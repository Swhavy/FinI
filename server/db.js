import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'database.json');

// Helper to parse date strings or create ISO strings relative to July 7, 2026
const relativeDate = (daysAgo, hoursAgo = 12) => {
  const baseDate = new Date('2026-07-07T03:00:00.000Z');
  baseDate.setDate(baseDate.getDate() - daysAgo);
  baseDate.setHours(baseDate.getHours() - hoursAgo);
  return baseDate.toISOString();
};

const DEFAULT_STATE = {
  activeUserId: 'u_123', // Defaults to Chidi
  users: {
    'u_123': {
      "id": "u_123",
      "displayName": "Chidi Okafor",
      "phone": "+2348012345678",
      "createdAt": relativeDate(60),
      "onboardingComplete": true,
      "profile": {
        "userType": "student",
        "riskComfort": "cautious",
        "goals": ["build_savings_habit", "understand_spending"],
        "tone": "direct_friendly"
      },
      "settings": {
        "cashExpiryDays": 7, // Students burn cash fast!
        "flagSensitivity": "medium",
        "currency": "NGN"
      },
      "stats": {
        "avgBurnCycleDays": 2.5,
        "unallocatedRatio30d": 0.45
      }
    },
    'u_456': {
      "id": "u_456",
      "displayName": "Funmi Alao",
      "phone": "+2348123456789",
      "createdAt": relativeDate(90),
      "onboardingComplete": true,
      "profile": {
        "userType": "trader",
        "riskComfort": "balanced",
        "goals": ["understand_spending", "track_business_cash"],
        "tone": "direct_friendly"
      },
      "settings": {
        "cashExpiryDays": 5,
        "flagSensitivity": "high",
        "currency": "NGN"
      },
      "stats": {
        "avgBurnCycleDays": 4.0,
        "unallocatedRatio30d": 0.15
      }
    },
    'u_789': {
      "id": "u_789",
      "displayName": "Emeka Obi",
      "phone": "+2348098765432",
      "createdAt": relativeDate(45),
      "onboardingComplete": true,
      "profile": {
        "userType": "salaried",
        "riskComfort": "bold",
        "goals": ["build_savings_habit"],
        "tone": "direct_friendly"
      },
      "settings": {
        "cashExpiryDays": 14,
        "flagSensitivity": "low",
        "currency": "NGN"
      },
      "stats": {
        "avgBurnCycleDays": 8.5,
        "unallocatedRatio30d": 0.28
      }
    }
  },
  bankAccounts: {
    'acc_1': {
      "id": "acc_1",
      "userId": "u_123",
      "provider": "mono",
      "institution": "GTBank",
      "monoAccountId": "acc_mono_chidi",
      "status": "connected",
      "linkedAt": relativeDate(60, 2)
    },
    'acc_1_kuda': {
      "id": "acc_1_kuda",
      "userId": "u_123",
      "provider": "mono",
      "institution": "Kuda Bank",
      "monoAccountId": "acc_mono_chidi_kuda",
      "status": "connected",
      "linkedAt": relativeDate(30, 1)
    },
    'acc_2': {
      "id": "acc_2",
      "userId": "u_456",
      "provider": "mono",
      "institution": "Access Bank",
      "monoAccountId": "acc_mono_funmi",
      "status": "connected",
      "linkedAt": relativeDate(90, 2)
    },
    'acc_2_providus': {
      "id": "acc_2_providus",
      "userId": "u_456",
      "provider": "mono",
      "institution": "Providus Bank",
      "monoAccountId": "acc_mono_funmi_providus",
      "status": "connected",
      "linkedAt": relativeDate(40, 4)
    },
    'acc_3': {
      "id": "acc_3",
      "userId": "u_789",
      "provider": "mono",
      "institution": "Zenith Bank",
      "monoAccountId": "acc_mono_emeka",
      "status": "connected",
      "linkedAt": relativeDate(45, 2)
    },
    'acc_3_opay': {
      "id": "acc_3_opay",
      "userId": "u_789",
      "provider": "mono",
      "institution": "OPay",
      "monoAccountId": "acc_mono_emeka_opay",
      "status": "connected",
      "linkedAt": relativeDate(25, 1)
    }
  },
  accountStats: {
    'acc_1': {
      "accountId": "acc_1",
      "avgInflowPerMonth": 85000,
      "inflowFrequencyDays": 14,
      "avgOutflowPerMonth": 78000,
      "lastInflowAt": relativeDate(3, 4),
      "lastOutflowAt": relativeDate(1, 2),
      "updatedAt": relativeDate(0, 1)
    },
    'acc_1_kuda': {
      "accountId": "acc_1_kuda",
      "avgInflowPerMonth": 45000,
      "inflowFrequencyDays": 7,
      "avgOutflowPerMonth": 40000,
      "lastInflowAt": relativeDate(5, 1),
      "lastOutflowAt": relativeDate(2, 3),
      "updatedAt": relativeDate(0, 1)
    },
    'acc_2': {
      "accountId": "acc_2",
      "avgInflowPerMonth": 240000,
      "inflowFrequencyDays": 3,
      "avgOutflowPerMonth": 210000,
      "lastInflowAt": relativeDate(1, 5),
      "lastOutflowAt": relativeDate(0, 3),
      "updatedAt": relativeDate(0, 1)
    },
    'acc_2_providus': {
      "accountId": "acc_2_providus",
      "avgInflowPerMonth": 180000,
      "inflowFrequencyDays": 5,
      "avgOutflowPerMonth": 160000,
      "lastInflowAt": relativeDate(4, 2),
      "lastOutflowAt": relativeDate(1, 1),
      "updatedAt": relativeDate(0, 1)
    },
    'acc_3': {
      "accountId": "acc_3",
      "avgInflowPerMonth": 450000,
      "inflowFrequencyDays": 30,
      "avgOutflowPerMonth": 380000,
      "lastInflowAt": relativeDate(8, 8),
      "lastOutflowAt": relativeDate(2, 4),
      "updatedAt": relativeDate(0, 1)
    },
    'acc_3_opay': {
      "accountId": "acc_3_opay",
      "avgInflowPerMonth": 120000,
      "inflowFrequencyDays": 10,
      "avgOutflowPerMonth": 100000,
      "lastInflowAt": relativeDate(3, 5),
      "lastOutflowAt": relativeDate(1, 2),
      "updatedAt": relativeDate(0, 1)
    }
  },
  transactions: {
    // Chidi's transactions
    't_chidi_1': {
      "id": "t_chidi_1",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 40000,
      "type": "credit",
      "channel": "transfer",
      "narration": "FATHER ALLOWANCE",
      "recipientType": "individual",
      "category": "income",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(14, 10)
    },
    't_chidi_2': {
      "id": "t_chidi_2",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 15000,
      "type": "debit",
      "channel": "atm",
      "narration": "GTB ATM IKEJA",
      "recipientType": "unknown",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": true,
      "cashFlagAnswer": true,
      "poolId": "pool_chidi_old",
      "createdAt": relativeDate(14, 9)
    },
    't_chidi_3': {
      "id": "t_chidi_3",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 3500,
      "type": "debit",
      "channel": "pos",
      "narration": "MTN TOPUP VTU",
      "recipientType": "merchant",
      "category": "bills",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(10)
    },
    't_chidi_4': {
      "id": "t_chidi_4",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 18000,
      "type": "debit",
      "channel": "pos",
      "narration": "SHOPRITE IKEJA",
      "recipientType": "merchant",
      "category": "food",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(3, 14)
    },
    't_chidi_5': {
      "id": "t_chidi_5",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 25000,
      "type": "debit",
      "channel": "atm",
      "narration": "GTB ATM UNILAG",
      "recipientType": "unknown",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": true,
      "cashFlagAnswer": true,
      "poolId": "pool_chidi_active",
      "createdAt": relativeDate(2, 6)
    },
    't_chidi_6': {
      "id": "t_chidi_6",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 4200,
      "type": "debit",
      "channel": "transfer",
      "narration": "TRANSFER TO SEGUN",
      "recipientType": "individual",
      "category": null, // unallocated P2P
      "categorySource": null,
      "cashFlagPrompted": true,
      "cashFlagAnswer": null, // Skippable P2P Cash question pending
      "poolId": null,
      "createdAt": relativeDate(1, 1)
    },
    // Chidi's Kuda Bank transactions
    't_chidi_k_1': {
      "id": "t_chidi_k_1",
      "userId": "u_123",
      "accountId": "acc_1_kuda",
      "amount": 30000,
      "type": "credit",
      "channel": "transfer",
      "narration": "FREELANCE DESIGN GIG",
      "recipientType": "individual",
      "category": "income",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(8, 2)
    },
    't_chidi_k_2': {
      "id": "t_chidi_k_2",
      "userId": "u_123",
      "accountId": "acc_1_kuda",
      "amount": 5200,
      "type": "debit",
      "channel": "pos",
      "narration": "BOLT TAXI RIDE",
      "recipientType": "merchant",
      "category": "transport",
      "categorySource": "user_tagged",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(6, 4)
    },
    't_chidi_k_3': {
      "id": "t_chidi_k_3",
      "userId": "u_123",
      "accountId": "acc_1_kuda",
      "amount": 2500,
      "type": "debit",
      "channel": "pos",
      "narration": "MAMA PUT CAMPUS",
      "recipientType": "merchant",
      "category": "food",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(5, 1)
    },
    't_chidi_k_4': {
      "id": "t_chidi_k_4",
      "userId": "u_123",
      "accountId": "acc_1_kuda",
      "amount": 8000,
      "type": "debit",
      "channel": "pos",
      "narration": "KUDA AGENT CASHOUT",
      "recipientType": "merchant",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(1, 10)
    },

    // Funmi's transactions (Access Bank)
    't_funmi_1': {
      "id": "t_funmi_1",
      "userId": "u_456",
      "accountId": "acc_2",
      "amount": 80000,
      "type": "credit",
      "channel": "pos",
      "narration": "POS SALES INFLOW MARKET",
      "recipientType": "merchant",
      "category": "income",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(5, 8)
    },
    't_funmi_2': {
      "id": "t_funmi_2",
      "userId": "u_456",
      "accountId": "acc_2",
      "amount": 50000,
      "type": "debit",
      "channel": "atm",
      "narration": "ACCESS ATM BALOGUN",
      "recipientType": "unknown",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": true,
      "cashFlagAnswer": true,
      "poolId": "pool_funmi_1",
      "createdAt": relativeDate(4, 10)
    },
    't_funmi_3': {
      "id": "t_funmi_3",
      "userId": "u_456",
      "accountId": "acc_2",
      "amount": 12000,
      "type": "debit",
      "channel": "pos",
      "narration": "BALOGUN WHOLESALE STORE",
      "recipientType": "merchant",
      "category": "inventory",
      "categorySource": "user_tagged",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(3, 4)
    },
    // Funmi's Providus Bank transactions
    't_funmi_p_1': {
      "id": "t_funmi_p_1",
      "userId": "u_456",
      "accountId": "acc_2_providus",
      "amount": 145000,
      "type": "credit",
      "channel": "transfer",
      "narration": "BULK CUSTOMER BANK TRANSFER",
      "recipientType": "individual",
      "category": "income",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(6, 2)
    },
    't_funmi_p_2': {
      "id": "t_funmi_p_2",
      "userId": "u_456",
      "accountId": "acc_2_providus",
      "amount": 35000,
      "type": "debit",
      "channel": "atm",
      "narration": "PROVIDUS ATM WITHDRAWAL",
      "recipientType": "unknown",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(2, 4)
    },

    // Emeka's transactions (Zenith Bank)
    't_emeka_1': {
      "id": "t_emeka_1",
      "userId": "u_789",
      "accountId": "acc_3",
      "amount": 350000,
      "type": "credit",
      "channel": "transfer",
      "narration": "INTERSWITCH CORP SALARY",
      "recipientType": "merchant",
      "category": "income",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(16, 8)
    },
    't_emeka_2': {
      "id": "t_emeka_2",
      "userId": "u_789",
      "accountId": "acc_3",
      "amount": 60000,
      "type": "debit",
      "channel": "atm",
      "narration": "ZENITH BANK ATM VI",
      "recipientType": "unknown",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": true,
      "cashFlagAnswer": true,
      "poolId": "pool_emeka_1",
      "createdAt": relativeDate(15, 2)
    },
    't_emeka_3': {
      "id": "t_emeka_3",
      "userId": "u_789",
      "accountId": "acc_3",
      "amount": 18000,
      "type": "debit",
      "channel": "pos",
      "narration": "THE SPAR LEKKI",
      "recipientType": "merchant",
      "category": "food",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(12, 5)
    },
    't_emeka_4': {
      "id": "t_emeka_4",
      "userId": "u_789",
      "accountId": "acc_3",
      "amount": 15000,
      "type": "debit",
      "channel": "pos",
      "narration": "EKO CLUB RESTAURANT",
      "recipientType": "merchant",
      "category": "entertainment",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(9, 10)
    },
    // Emeka's OPay transactions
    't_emeka_o_1': {
      "id": "t_emeka_o_1",
      "userId": "u_789",
      "accountId": "acc_3_opay",
      "amount": 45000,
      "type": "credit",
      "channel": "transfer",
      "narration": "OPAY SAVINGS INTEREST",
      "recipientType": "merchant",
      "category": "income",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(12, 1)
    },
    't_emeka_o_2': {
      "id": "t_emeka_o_2",
      "userId": "u_789",
      "accountId": "acc_3_opay",
      "amount": 12500,
      "type": "debit",
      "channel": "transfer",
      "narration": "TRANSFER TO MAMA",
      "recipientType": "individual",
      "category": null,
      "categorySource": null,
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(7, 3)
    },
    't_emeka_o_3': {
      "id": "t_emeka_o_3",
      "userId": "u_789",
      "accountId": "acc_3_opay",
      "amount": 8000,
      "type": "debit",
      "channel": "atm",
      "narration": "OPAY ATM WITHDRAWAL",
      "recipientType": "unknown",
      "category": "withdrawal",
      "categorySource": "auto_matched",
      "cashFlagPrompted": false,
      "cashFlagAnswer": null,
      "poolId": null,
      "createdAt": relativeDate(3, 8)
    }
  },
  cashPools: {
    'pool_chidi_old': {
      "id": "pool_chidi_old",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 15000,
      "status": "expired",
      "source": "atm_withdrawal",
      "confidence": 0.0,
      "linkedTransactionId": "t_chidi_2",
      "createdAt": relativeDate(14, 9),
      "lastEvaluatedAt": relativeDate(0, 1),
      "closedAt": relativeDate(2, 6), // Closed because a new withdrawal suggested old cash is likely gone!
      "closedReason": "new_withdrawal"
    },
    'pool_chidi_active': {
      "id": "pool_chidi_active",
      "userId": "u_123",
      "accountId": "acc_1",
      "amount": 25000,
      "status": "active", // Updated dynamically (2 days old)
      "source": "atm_withdrawal",
      "confidence": 0.71, // 2 days elapsed out of 7 days cashExpiryDays
      "linkedTransactionId": "t_chidi_5",
      "createdAt": relativeDate(2, 6),
      "lastEvaluatedAt": relativeDate(0, 1),
      "closedAt": null,
      "closedReason": null,
      "expenses": [
        { "id": "exp_1", "amount": 3000, "category": "transport", "narration": "Danfo bus cash", "createdAt": relativeDate(1, 12) },
        { "id": "exp_2", "amount": 4000, "category": "food", "narration": "Mama Put Rice", "createdAt": relativeDate(1, 2) }
      ]
    },
    'pool_funmi_1': {
      "id": "pool_funmi_1",
      "userId": "u_456",
      "accountId": "acc_2",
      "amount": 50000,
      "status": "aging",
      "source": "atm_withdrawal",
      "confidence": 0.12,
      "linkedTransactionId": "t_funmi_2",
      "createdAt": relativeDate(4, 10),
      "lastEvaluatedAt": relativeDate(0, 1),
      "closedAt": null,
      "closedReason": null,
      "expenses": [
        { "id": "exp_3", "amount": 15000, "category": "inventory", "narration": "Balogun market cart carrier fee", "createdAt": relativeDate(3, 8) },
        { "id": "exp_3_b", "amount": 12000, "category": "fuel", "narration": "Kerosene generator fuel for shop", "createdAt": relativeDate(2, 6) },
        { "id": "exp_3_c", "amount": 18000, "category": "transport", "narration": "Daily dispatch rider wholesale supply", "createdAt": relativeDate(1, 12) }
      ]
    },
    'pool_emeka_1': {
      "id": "pool_emeka_1",
      "userId": "u_789",
      "accountId": "acc_3",
      "amount": 60000,
      "status": "expired",
      "source": "atm_withdrawal",
      "confidence": 0.0,
      "linkedTransactionId": "t_emeka_2",
      "createdAt": relativeDate(15, 2),
      "lastEvaluatedAt": relativeDate(0, 1),
      "closedAt": null,
      "closedReason": null,
      "expenses": [
        { "id": "exp_4", "amount": 8000, "category": "fuel", "narration": "Fuel at Mobil Cash", "createdAt": relativeDate(13, 1) },
        { "id": "exp_5", "amount": 12000, "category": "groceries", "narration": "Market cash spend", "createdAt": relativeDate(10, 5) }
      ]
    }
  },
  merchantMemory: {
    'u_123_shoprite_ikeja': {
      "userId": "u_123",
      "merchantKey": "shoprite_ikeja",
      "category": "food",
      "confidence": 0.95,
      "timesConfirmed": 4,
      "updatedAt": relativeDate(3, 14)
    },
    'u_456_balogun_wholesale_store': {
      "userId": "u_456",
      "merchantKey": "balogun_wholesale_store",
      "category": "inventory",
      "confidence": 0.9,
      "timesConfirmed": 3,
      "updatedAt": relativeDate(3, 4)
    }
  },
  insights: {
    'ins_chidi_1': {
      "id": "ins_chidi_1",
      "userId": "u_123",
      "accountScope": "acc_1",
      "promptVersion": "insights.v1.relatable",
      "triggerType": "post_transaction",
      "inputSnapshot": {
        "pools": ["pool_chidi_active"],
        "recentTransactionId": "t_chidi_4",
        "burnCycleDays": 2.5,
        "userProfile": { "userType": "student", "tone": "direct_friendly" }
      },
      "inputHash": "8f9a2chidi",
      "outputText": "You just spent ₦18,000 at Shoprite, which is almost half of today's bank cash, and it's three days earlier than you usually empty your pocket. Looks like you'll need to pace yourself on cash this week.",
      "flagged": true,
      "userReaction": null,
      "generatedAt": relativeDate(3, 14)
    },
    'ins_funmi_1': {
      "id": "ins_funmi_1",
      "userId": "u_456",
      "accountScope": "acc_2",
      "promptVersion": "insights.v1.relatable",
      "triggerType": "post_transaction",
      "inputSnapshot": {
        "pools": ["pool_funmi_1"],
        "recentTransactionId": "t_funmi_3",
        "burnCycleDays": 4.0,
        "userProfile": { "userType": "trader", "tone": "direct_friendly" }
      },
      "inputHash": "8f9a2funmi",
      "outputText": "That wholesale purchase looks right in line with your normal restock cycles, but your cash pool is aging. Since Balogun carrier cash runs frequently, consider if you need a quick topup soon.",
      "flagged": false,
      "userReaction": null,
      "generatedAt": relativeDate(3, 4)
    },
    'ins_emeka_1': {
      "id": "ins_emeka_1",
      "userId": "u_789",
      "accountScope": "acc_3",
      "promptVersion": "insights.v1.relatable",
      "triggerType": "post_transaction",
      "inputSnapshot": {
        "pools": ["pool_emeka_1"],
        "recentTransactionId": "t_emeka_4",
        "burnCycleDays": 8.5,
        "userProfile": { "userType": "salaried", "tone": "direct_friendly" }
      },
      "inputHash": "8f9a2emeka",
      "outputText": "Nice weekend out at Eko Club, but that restaurant spend is a bit of a pattern breaker. Note that your ₦60,000 ATM cash pool from 15 days ago has fully expired and faded to 0% confidence. Any remaining physical cash is likely unlogged leakage; you should log a new cashout to restore fidelity.",
      "flagged": true,
      "userReaction": null,
      "generatedAt": relativeDate(2, 10)
    }
  },
  agentConversations: {
    'conv_chidi': {
      "id": "conv_chidi",
      "userId": "u_123",
      "messages": [
        { "role": "user", "text": "Should I buy this ₦20,000 jacket?", "at": relativeDate(1, 10) },
        { "role": "agent", "text": "That'd leave you pretty tight for the next few days based on your usual pace... You only have ₦18,000 left in cash confidence and your next inflow isn't for another 11 days.", "promptVersion": "insights.v1.relatable", "at": relativeDate(1, 10) }
      ],
      "createdAt": relativeDate(1, 10)
    }
  }
};

class DataStore {
  constructor() {
    this.data = null;
    this.init();
  }

  init() {
    if (fs.existsSync(DB_PATH)) {
      try {
        const raw = fs.readFileSync(DB_PATH, 'utf8');
        this.data = JSON.parse(raw);
        // Ensure any new structure is loaded
        this.data = { ...DEFAULT_STATE, ...this.data };
      } catch (e) {
        console.error('Error loading database, resetting', e);
        this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
        this.save();
      }
    } else {
      this.data = JSON.parse(JSON.stringify(DEFAULT_STATE));
      this.save();
    }
  }

  save() {
    fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf8');
  }

  get() {
    this.decayAllPools();
    return this.data;
  }

  decayAllPools() {
    const now = new Date('2026-07-07T03:00:00.000Z'); // Consistent current date for hackathon
    const activeUserId = this.data.activeUserId;
    const user = this.data.users[activeUserId];
    if (!user) return;

    const expiryDays = user.settings.cashExpiryDays || 14;

    Object.keys(this.data.cashPools).forEach(poolId => {
      const pool = this.data.cashPools[poolId];
      if (pool.userId !== activeUserId || pool.closedAt) return;

      const createdDate = new Date(pool.createdAt);
      const diffMs = now - createdDate;
      const daysElapsed = Math.max(0, diffMs / (1000 * 60 * 60 * 24));

      // Calculate confidence
      let confidence = Math.max(0, 1 - (daysElapsed / expiryDays));
      pool.confidence = parseFloat(confidence.toFixed(2));

      // Categorize state based on days elapsed relative to expiryDays
      if (daysElapsed <= expiryDays * 0.25) {
        pool.status = 'fresh';
      } else if (daysElapsed <= expiryDays * 0.6) {
        pool.status = 'active';
      } else if (daysElapsed <= expiryDays) {
        pool.status = 'aging';
      } else {
        pool.status = 'expired';
        pool.confidence = 0.0;
        pool.closedAt = now.toISOString();
        pool.closedReason = 'time_expired';
      }

      pool.lastEvaluatedAt = now.toISOString();
    });
  }

  // Get data package for dashboard
  getDashboardData(bankId = 'all', startDate = null, endDate = null) {
    this.decayAllPools();
    const userId = this.data.activeUserId;
    const user = this.data.users[userId];

    const bankAccountList = Object.values(this.data.bankAccounts).filter(a => a.userId === userId);
    const accountIds = bankAccountList.map(a => a.id);

    // If "all" is selected, we query all of the user's accounts, otherwise we filter to the specific bank account
    const activeAccountIds = bankId === 'all' ? accountIds : [bankId];

    const statsList = Object.values(this.data.accountStats).filter(s => activeAccountIds.includes(s.accountId));
    
    // Get all transactions for the user
    let txList = Object.values(this.data.transactions)
      .filter(t => t.userId === userId);

    // Filter by bank account
    if (bankId !== 'all') {
      txList = txList.filter(t => t.accountId === bankId);
    }

    // Filter by date range
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      txList = txList.filter(t => new Date(t.createdAt) >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      txList = txList.filter(t => new Date(t.createdAt) <= end);
    }

    // Sort transactions chronologically (newest first)
    txList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Filter cash pools
    let activePools = Object.values(this.data.cashPools).filter(p => p.userId === userId);
    if (bankId !== 'all') {
      activePools = activePools.filter(p => p.accountId === bankId);
    }

    // Insights filter
    let userInsights = Object.values(this.data.insights).filter(i => i.userId === userId);
    if (bankId !== 'all') {
      userInsights = userInsights.filter(i => i.accountScope === 'all' || i.accountScope === bankId);
    }
    userInsights.sort((a, b) => new Date(b.generatedAt) - new Date(a.generatedAt));

    const conversations = Object.values(this.data.agentConversations).find(c => c.userId === userId) || {
      id: `conv_${userId}`,
      userId,
      messages: [],
      createdAt: new Date().toISOString()
    };

    return {
      user,
      bankAccounts: bankAccountList,
      accountStats: statsList[0] || null,
      transactions: txList,
      cashPools: activePools,
      insights: userInsights,
      conversation: conversations,
      availableUsers: Object.values(this.data.users)
    };
  }

  switchUser(userId) {
    if (this.data.users[userId]) {
      this.data.activeUserId = userId;
      this.save();
      return true;
    }
    return false;
  }

  updateUserProfile(userId, profileUpdates) {
    if (this.data.users[userId]) {
      const user = this.data.users[userId];
      user.profile = {
        ...user.profile,
        ...profileUpdates
      };
      this.save();
      return true;
    }
    return false;
  }

  createCustomUser({ displayName, personalityType, phone, goals }) {
    const id = `u_custom_${Date.now()}`;
    const cleanPhone = phone || `+23480${Math.floor(10000000 + Math.random() * 90000000)}`;
    
    let profile = {
      userType: "student",
      riskComfort: "cautious",
      goals: ["build_savings_habit", "understand_spending"],
      tone: "direct_friendly"
    };
    let settings = {
      cashExpiryDays: 7,
      flagSensitivity: "medium",
      currency: "NGN"
    };
    let stats = {
      avgBurnCycleDays: 2.5,
      unallocatedRatio30d: 0.45
    };

    if (personalityType === 'trader') {
      profile = {
        userType: "trader",
        riskComfort: "balanced",
        goals: ["understand_spending", "track_business_cash"],
        tone: "direct_friendly"
      };
      settings = {
        cashExpiryDays: 10,
        flagSensitivity: "high",
        currency: "NGN"
      };
      stats = {
        avgBurnCycleDays: 4.0,
        unallocatedRatio30d: 0.15
      };
    } else if (personalityType === 'salaried') {
      profile = {
        userType: "salaried",
        riskComfort: "bold",
        goals: ["build_savings_habit"],
        tone: "direct_friendly"
      };
      settings = {
        cashExpiryDays: 14,
        flagSensitivity: "low",
        currency: "NGN"
      };
      stats = {
        avgBurnCycleDays: 8.5,
        unallocatedRatio30d: 0.28
      };
    }

    if (goals && Array.isArray(goals) && goals.length > 0) {
      profile.goals = goals;
    }

    const newUser = {
      id,
      displayName,
      phone: cleanPhone,
      createdAt: new Date('2026-07-07T03:00:00.000Z').toISOString(),
      onboardingComplete: true,
      profile,
      settings,
      stats
    };

    this.data.users[id] = newUser;

    // Create default bank accounts for this custom user to simulate high fidelity
    const acc1Id = `acc_custom_${id}_1`;
    const acc2Id = `acc_custom_${id}_2`;

    const b1Name = personalityType === 'student' ? 'GTBank' : personalityType === 'trader' ? 'Access Bank' : 'Zenith Bank';
    const b2Name = personalityType === 'student' ? 'Kuda Bank' : personalityType === 'trader' ? 'Providus Bank' : 'OPay';

    this.data.bankAccounts[acc1Id] = {
      id: acc1Id,
      userId: id,
      provider: "mono",
      institution: b1Name,
      monoAccountId: `acc_mono_${id}_1`,
      status: "connected",
      linkedAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    this.data.bankAccounts[acc2Id] = {
      id: acc2Id,
      userId: id,
      provider: "mono",
      institution: b2Name,
      monoAccountId: `acc_mono_${id}_2`,
      status: "connected",
      linkedAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    // Account stats
    this.data.accountStats[acc1Id] = {
      accountId: acc1Id,
      avgInflowPerMonth: personalityType === 'student' ? 85000 : personalityType === 'trader' ? 240000 : 450000,
      inflowFrequencyDays: personalityType === 'student' ? 14 : personalityType === 'trader' ? 3 : 30,
      avgOutflowPerMonth: personalityType === 'student' ? 78000 : personalityType === 'trader' ? 210000 : 380000,
      lastInflowAt: relativeDate(3, 4),
      lastOutflowAt: relativeDate(1, 2),
      updatedAt: relativeDate(0, 1)
    };

    this.data.accountStats[acc2Id] = {
      accountId: acc2Id,
      avgInflowPerMonth: personalityType === 'student' ? 45000 : personalityType === 'trader' ? 180000 : 120000,
      inflowFrequencyDays: personalityType === 'student' ? 7 : personalityType === 'trader' ? 5 : 10,
      avgOutflowPerMonth: personalityType === 'student' ? 40000 : personalityType === 'trader' ? 160000 : 100000,
      lastInflowAt: relativeDate(5, 1),
      lastOutflowAt: relativeDate(2, 3),
      updatedAt: relativeDate(0, 1)
    };

    // Populate standard initial transactions based on personality
    if (personalityType === 'student') {
      this.data.transactions[`t_${id}_1`] = {
        id: `t_${id}_1`,
        userId: id,
        accountId: acc1Id,
        amount: 45000,
        type: "credit",
        channel: "transfer",
        narration: "ALLOWANCE FROM SPONSOR",
        recipientType: "individual",
        category: "income",
        categorySource: "auto_matched",
        cashFlagPrompted: false,
        cashFlagAnswer: null,
        poolId: null,
        createdAt: relativeDate(4)
      };
      this.data.transactions[`t_${id}_2`] = {
        id: `t_${id}_2`,
        userId: id,
        accountId: acc1Id,
        amount: 15000,
        type: "debit",
        channel: "atm",
        narration: "ATM CASHOUT CAMPUS",
        recipientType: "unknown",
        category: "withdrawal",
        categorySource: "auto_matched",
        cashFlagPrompted: true,
        cashFlagAnswer: true,
        poolId: `pool_${id}_active`,
        createdAt: relativeDate(2)
      };
      this.data.transactions[`t_${id}_3`] = {
        id: `t_${id}_3`,
        userId: id,
        accountId: acc1Id,
        amount: 2500,
        type: "debit",
        channel: "pos",
        narration: "UNILAG FOOD HUB",
        recipientType: "merchant",
        category: "food",
        categorySource: "auto_matched",
        cashFlagPrompted: false,
        cashFlagAnswer: null,
        poolId: null,
        createdAt: relativeDate(1)
      };
    } else if (personalityType === 'trader') {
      this.data.transactions[`t_${id}_1`] = {
        id: `t_${id}_1`,
        userId: id,
        accountId: acc1Id,
        amount: 180000,
        type: "credit",
        channel: "transfer",
        narration: "WHOLESALE DEPOSIT BALOGUN",
        recipientType: "individual",
        category: "income",
        categorySource: "auto_matched",
        cashFlagPrompted: false,
        cashFlagAnswer: null,
        poolId: null,
        createdAt: relativeDate(3)
      };
      this.data.transactions[`t_${id}_2`] = {
        id: `t_${id}_2`,
        userId: id,
        accountId: acc1Id,
        amount: 50000,
        type: "debit",
        channel: "atm",
        narration: "BALOGUN ACCESS ATM",
        recipientType: "unknown",
        category: "withdrawal",
        categorySource: "auto_matched",
        cashFlagPrompted: true,
        cashFlagAnswer: true,
        poolId: `pool_${id}_active`,
        createdAt: relativeDate(1)
      };
    } else {
      // Salaried
      this.data.transactions[`t_${id}_1`] = {
        id: `t_${id}_1`,
        userId: id,
        accountId: acc1Id,
        amount: 380000,
        type: "credit",
        channel: "transfer",
        narration: "NET PAY SALARY",
        recipientType: "individual",
        category: "income",
        categorySource: "auto_matched",
        cashFlagPrompted: false,
        cashFlagAnswer: null,
        poolId: null,
        createdAt: relativeDate(7)
      };
      this.data.transactions[`t_${id}_2`] = {
        id: `t_${id}_2`,
        userId: id,
        accountId: acc1Id,
        amount: 40000,
        type: "debit",
        channel: "atm",
        narration: "VI ZENITH ATM OUT",
        recipientType: "unknown",
        category: "withdrawal",
        categorySource: "auto_matched",
        cashFlagPrompted: true,
        cashFlagAnswer: true,
        poolId: `pool_${id}_active`,
        createdAt: relativeDate(3)
      };
    }

    // Create starting Cash Pool
    this.data.cashPools[`pool_${id}_active`] = {
      id: `pool_${id}_active`,
      userId: id,
      accountId: acc1Id,
      amount: personalityType === 'student' ? 15000 : personalityType === 'trader' ? 50000 : 40000,
      status: "fresh",
      source: "atm_withdrawal",
      confidence: 0.95,
      linkedTransactionId: `t_${id}_2`,
      createdAt: relativeDate(2),
      lastEvaluatedAt: relativeDate(1),
      closedAt: null,
      closedReason: null,
      expenses: []
    };

    this.save();
    return newUser;
  }

  addTransaction(tx) {
    const id = `t_${Date.now()}`;
    const newTx = {
      id,
      userId: this.data.activeUserId,
      ...tx,
      createdAt: tx.createdAt || new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    // If it is a cash withdrawal, we handle pool state transition
    if (tx.type === 'debit' && (tx.channel === 'atm' || tx.category === 'withdrawal' || tx.narration.toUpperCase().includes('ATM') || tx.narration.toUpperCase().includes('CASHOUT'))) {
      // 1. Close any previous open cash pools for this user
      const nowStr = new Date('2026-07-07T03:00:00.000Z').toISOString();
      Object.keys(this.data.cashPools).forEach(poolId => {
        const p = this.data.cashPools[poolId];
        if (p.userId === this.data.activeUserId && !p.closedAt) {
          p.closedAt = nowStr;
          p.closedReason = 'new_withdrawal';
          p.status = 'expired';
          p.confidence = 0.0;
        }
      });

      // 2. Create a new fresh pool
      const poolId = `pool_${Date.now()}`;
      this.data.cashPools[poolId] = {
        id: poolId,
        userId: this.data.activeUserId,
        accountId: tx.accountId,
        amount: tx.amount,
        status: 'fresh',
        source: tx.channel === 'atm' ? 'atm_withdrawal' : 'pos_cashout',
        confidence: 1.0,
        linkedTransactionId: id,
        createdAt: nowStr,
        lastEvaluatedAt: nowStr,
        closedAt: null,
        closedReason: null,
        expenses: []
      };

      newTx.poolId = poolId;
      newTx.cashFlagPrompted = true;
      newTx.cashFlagAnswer = true;
    }

    this.data.transactions[id] = newTx;
    this.save();
    return newTx;
  }

  logCashExpense(poolId, { amount, category, narration }) {
    const pool = this.data.cashPools[poolId];
    if (!pool || pool.closedAt) return null;

    const expenseId = `exp_${Date.now()}`;
    const exp = {
      id: expenseId,
      amount: parseFloat(amount),
      category,
      narration,
      createdAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    if (!pool.expenses) pool.expenses = [];
    pool.expenses.push(exp);

    // Subtract amount from current pool confidence pool size
    pool.amount = Math.max(0, pool.amount - amount);

    this.save();
    return exp;
  }

  categorizeTransaction(txId, category) {
    const tx = this.data.transactions[txId];
    if (!tx) return false;

    tx.category = category;
    tx.categorySource = 'user_tagged';

    // Memorize the merchant
    const cleanKey = tx.narration.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const memoryKey = `${tx.userId}_${cleanKey}`;
    this.data.merchantMemory[memoryKey] = {
      userId: tx.userId,
      merchantKey: cleanKey,
      category,
      confidence: 1.0,
      timesConfirmed: (this.data.merchantMemory[memoryKey]?.timesConfirmed || 0) + 1,
      updatedAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    // Auto categorize any remaining matching unallocated transactions
    Object.keys(this.data.transactions).forEach(id => {
      const otherTx = this.data.transactions[id];
      if (otherTx.userId === tx.userId && !otherTx.category && otherTx.narration.toLowerCase().replace(/[^a-z0-9]/g, '_') === cleanKey) {
        otherTx.category = category;
        otherTx.categorySource = 'auto_matched';
      }
    });

    this.save();
    return true;
  }

  linkBankAccount(institution, transactionsList = []) {
    const id = `acc_mono_${Date.now()}`;
    const newAccount = {
      id,
      userId: this.data.activeUserId,
      provider: 'mono',
      institution,
      monoAccountId: `acc_mono_${institution.toLowerCase()}_${Date.now()}`,
      status: 'connected',
      linkedAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };
    this.data.bankAccounts[id] = newAccount;

    // Default account stats
    this.data.accountStats[id] = {
      accountId: id,
      avgInflowPerMonth: 120000,
      inflowFrequencyDays: 14,
      avgOutflowPerMonth: 110000,
      lastInflowAt: new Date('2026-07-05T03:00:00.000Z').toISOString(),
      lastOutflowAt: new Date('2026-07-06T15:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    // Add provided transactions
    transactionsList.forEach((tx, i) => {
      const txId = `t_mono_${id}_${i}`;
      this.data.transactions[txId] = {
        id: txId,
        userId: this.data.activeUserId,
        accountId: id,
        amount: tx.amount,
        type: tx.type,
        channel: tx.channel || 'pos',
        narration: tx.narration.toUpperCase(),
        recipientType: tx.recipientType || 'unknown',
        category: tx.category || null,
        categorySource: tx.category ? 'auto_matched' : null,
        cashFlagPrompted: false,
        cashFlagAnswer: null,
        poolId: null,
        createdAt: tx.createdAt || new Date('2026-07-07T03:00:00.000Z').toISOString()
      };
    });

    this.save();
    return newAccount;
  }

  addMessageToConversation(role, text, customTimestamp, source) {
    const userId = this.data.activeUserId;
    let conv = Object.values(this.data.agentConversations).find(c => c.userId === userId);
    const nowStr = customTimestamp || new Date().toISOString();

    if (!conv) {
      const convId = `conv_${Date.now()}`;
      conv = {
        id: convId,
        userId,
        messages: [],
        createdAt: nowStr
      };
      this.data.agentConversations[convId] = conv;
    }

    conv.messages.push({
      role,
      text,
      at: nowStr,
      source: role === 'agent' ? source : undefined
    });

    this.save();
    return conv;
  }

  addPassiveInsight(outputText, flagged = false) {
    const userId = this.data.activeUserId;
    const dashboard = this.getDashboardData();
    const id = `ins_${Date.now()}`;

    const newInsight = {
      id,
      userId,
      accountScope: dashboard.bankAccounts[0]?.id || 'all',
      promptVersion: "insights.v1.relatable",
      triggerType: "post_transaction",
      inputSnapshot: {
        pools: dashboard.cashPools.map(p => p.id),
        recentTransactionId: dashboard.transactions[0]?.id || null,
        burnCycleDays: dashboard.user.stats.avgBurnCycleDays,
        userProfile: { userType: dashboard.user.profile.userType, tone: dashboard.user.profile.tone }
      },
      inputHash: `hash_${Date.now()}`,
      outputText,
      flagged,
      userReaction: null,
      generatedAt: new Date('2026-07-07T03:00:00.000Z').toISOString()
    };

    this.data.insights[id] = newInsight;
    this.save();
    return newInsight;
  }
}

export const db = new DataStore();
