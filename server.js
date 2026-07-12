import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import { generateQwenInsight, learnUserPersonality } from './server/insights.js';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API: Health status
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverTime: new Date().toISOString() });
});

// API: Get entire dashboard dataset for current user
app.get('/api/dashboard', (req, res) => {
  try {
    const { bankId, startDate, endDate } = req.query;
    const data = db.getDashboardData(bankId || 'all', startDate || null, endDate || null);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Switch active user (Chidi, Funmi, Emeka)
app.post('/api/users/switch', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }
  const success = db.switchUser(userId);
  if (success) {
    res.json(db.getDashboardData());
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// API: Create custom profile with predefined choice of personalities (AMD hackathon requirement)
app.post('/api/users/create', (req, res) => {
  const { displayName, personalityType, phone, goals } = req.body;
  if (!displayName || !personalityType) {
    return res.status(400).json({ error: 'displayName and personalityType are required' });
  }

  try {
    const newUser = db.createCustomUser({ displayName, personalityType, phone, goals });
    db.switchUser(newUser.id);
    res.json({ success: true, user: newUser, dashboard: db.getDashboardData() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Link a bank account via Mono Connect widget simulation
app.post('/api/mono/link', (req, res) => {
  const { institution, transactions } = req.body;
  if (!institution) {
    return res.status(400).json({ error: 'institution is required' });
  }

  // Generate mock transactions matching active user behavior if not provided
  let txList = transactions;
  if (!txList || txList.length === 0) {
    const today = new Date('2026-07-07T03:00:00.000Z');
    
    const d1 = new Date(today); d1.setDate(today.getDate() - 1);
    const d2 = new Date(today); d2.setDate(today.getDate() - 3);
    const d3 = new Date(today); d3.setDate(today.getDate() - 5);
    const d4 = new Date(today); d4.setDate(today.getDate() - 8);

    txList = [
      { amount: 75000, type: 'credit', channel: 'transfer', narration: `Inflow via ${institution}`, category: 'income', recipientType: 'individual', createdAt: d4.toISOString() },
      { amount: 8500, type: 'debit', channel: 'pos', narration: 'Mama Put Corner Lagos', category: 'food', recipientType: 'merchant', createdAt: d3.toISOString() },
      { amount: 20000, type: 'debit', channel: 'atm', narration: `${institution} Cashout`, category: 'withdrawal', recipientType: 'unknown', createdAt: d2.toISOString() },
      { amount: 5500, type: 'debit', channel: 'transfer', narration: 'Transfer to cab driver', category: null, recipientType: 'individual', createdAt: d1.toISOString() }
    ];
  }

  try {
    const newAccount = db.linkBankAccount(institution, txList);
    res.json({ success: true, account: newAccount, dashboard: db.getDashboardData() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Add new transaction (triggers automatic cash pool or tracking if needed)
app.post('/api/transactions', async (req, res) => {
  try {
    const { amount, type, channel, narration, recipientType, category, accountId } = req.body;
    if (!amount || !type || !narration) {
      return res.status(400).json({ error: 'amount, type, and narration are required' });
    }

    const currentDashboard = db.getDashboardData();
    const defaultAccountId = currentDashboard.bankAccounts[0]?.id || 'acc_1';

    const newTx = db.addTransaction({
      accountId: accountId || defaultAccountId,
      amount: parseFloat(amount),
      type,
      channel: channel || 'unknown',
      narration,
      recipientType: recipientType || 'unknown',
      category: category || null,
      categorySource: category ? 'user_tagged' : null,
      cashFlagPrompted: false,
      cashFlagAnswer: null,
      poolId: null
    });

    res.json({ transaction: newTx, dashboard: db.getDashboardData() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Categorize raw transaction and train merchant memory
app.post('/api/transactions/categorize', (req, res) => {
  const { transactionId, category } = req.body;
  if (!transactionId || !category) {
    return res.status(400).json({ error: 'transactionId and category are required' });
  }

  const success = db.categorizeTransaction(transactionId, category);
  if (success) {
    res.json({ success: true, dashboard: db.getDashboardData() });
  } else {
    res.status(404).json({ error: 'Transaction not found' });
  }
});

// API: Log a cash expense out of a physical cash pool (reducing size and adding to log)
app.post('/api/cash-pools/expense', (req, res) => {
  const { poolId, amount, category, narration } = req.body;
  if (!poolId || !amount || !category || !narration) {
    return res.status(400).json({ error: 'poolId, amount, category, and narration are required' });
  }

  const expense = db.logCashExpense(poolId, { amount, category, narration });
  if (expense) {
    res.json({ success: true, expense, dashboard: db.getDashboardData() });
  } else {
    res.status(404).json({ error: 'Cash pool not found or closed' });
  }
});

// API: Generate passive Qwen AI insight based on last transaction / status
app.post('/api/insights/trigger', async (req, res) => {
  const { customApiKey } = req.body;
  try {
    const dashboard = db.getDashboardData();
    const { text: outputText, source } = await generateQwenInsight({
      user: dashboard.user,
      transactions: dashboard.transactions,
      cashPools: dashboard.cashPools,
      accountStats: dashboard.accountStats,
      type: 'passive',
      customApiKey
    });

    // Check if the output suggests flagging (e.g. contains alert/tight/warning indicators)
    const flagged = outputText.toLowerCase().includes('tight') || outputText.toLowerCase().includes('pocket') || outputText.toLowerCase().includes('empty');
    const newInsight = db.addPassiveInsight(outputText, flagged);

    res.json({ insight: newInsight, dashboard: db.getDashboardData() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API: Chat directly with Qwen 3.7 Plus Agent ("should I buy this?")
app.post('/api/chat', async (req, res) => {
  const { message, customApiKey, clientTimestamp } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  try {
    // 1. Log the user's message with accurate client side timestamp
    db.addMessageToConversation('user', message, clientTimestamp);

    // 2. Fetch full dashboard for context
    const dashboard = db.getDashboardData();

    // 3. Generate response using Qwen 3.7
    const { text: responseText, source } = await generateQwenInsight({
      user: dashboard.user,
      transactions: dashboard.transactions,
      cashPools: dashboard.cashPools,
      accountStats: dashboard.accountStats,
      type: 'chat',
      userMessage: message,
      conversation: dashboard.conversation,
      customApiKey
    });

    // 4. Log the agent's response
    // Shift by 1 second to ensure the response is always chronologically subsequent
    const agentTime = clientTimestamp 
      ? new Date(new Date(clientTimestamp).getTime() + 1000).toISOString()
      : new Date().toISOString();
    db.addMessageToConversation('agent', responseText, agentTime, source);

    // 5. Learn & update user personality dynamically based on interaction
    try {
      const personalityUpdates = await learnUserPersonality({
        userMessage: message,
        agentResponse: responseText,
        currentUser: dashboard.user,
        customApiKey
      });
      if (personalityUpdates) {
        db.updateUserProfile(dashboard.user.id, personalityUpdates);
      }
    } catch (learnErr) {
      console.warn('Personality learning error:', learnErr);
    }

    res.json({
      ...db.getDashboardData(),
      source
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vite middleware integration for live development and static serving in production
async function startViteServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    console.log(`Development mode: ${process.env.NODE_ENV !== 'production' ? 'ON (Vite Middleware active)' : 'OFF (Serving built folder)'}`);
  });
}

startViteServer();
