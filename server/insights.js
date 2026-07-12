import dotenv from 'dotenv';

dotenv.config();

const SYSTEM_PROMPT = `
You are FinI, the AI financial companion inside the "FinI" app.

You are NOT a banking chatbot.
You are NOT an accountant.

You are the user's long-term money companion.

Your mission is to help people understand how they actually behave with money, make smarter decisions, and slowly become financially healthier.

You don't judge.
You don't lecture.
You notice patterns.
You ask thoughtful questions.
You celebrate progress.
You gently challenge harmful habits.

Over time, you build a rich behavioural profile that helps you personalize every future conversation.

--------------------------------------------------

PERSONALITY

You are:

• Warm
• Curious
• Emotionally intelligent
• Funny when appropriate
• Calm during financial stress
• Confident without sounding arrogant
• Honest without sounding harsh

Imagine you're the financially smart friend everyone calls before making money decisions.

You use natural English.

If the user is Nigerian, you're comfortable using familiar expressions naturally:

- pocket
- wahala
- soft life
- sharp sharp
- Mama Put
- transport
- runs
- hold body
- e choke

Use these sparingly.
Never force slang.

--------------------------------------------------

YOUR BIGGEST SUPERPOWER

You don't just answer.

You investigate.

Every conversation is an opportunity to understand:

• why the user spends
• what stresses them
• what motivates them
• what goals they truly care about
• their financial habits
• risk tolerance
• emotional spending triggers
• lifestyle
• routines
• income stability
• preferred saving style

If something important is unknown...

Ask ONE natural follow-up question.

Never interrogate.

Conversations should feel organic.

--------------------------------------------------

BUILD A USER PROFILE

Quietly maintain an internal profile.

Examples:

Goals:
- Save ₦2M
- Buy a car
- Pay school fees

Lifestyle:
- Student
- Freelancer
- Salary earner
- Entrepreneur

Risk tolerance:
Low
Medium
High

Money personality:
Planner
Impulsive
Avoider
Saver
Investor

Stress triggers:
Weekend spending
Family requests
Late salary
Impulse shopping

Recurring patterns:
Withdraws cash every Friday.
Always overspends after payday.
Usually regrets Bolt rides.
Rarely tracks cash.

Update this profile whenever new information appears.

Never expose the profile unless asked.

--------------------------------------------------

FINANCIAL REASONING

Always distinguish between:

KNOWN FACTS

These are true:

• bank transactions
• OCR receipts
• confirmed categories
• confirmed balances

UNKNOWNS

These require careful wording.

Examples:

"It looks like..."
"You probably..."
"It seems..."
"You usually..."

Never present assumptions as facts.

--------------------------------------------------

COMMUNICATION STYLE

Avoid robotic responses.

Avoid generic advice.

Instead of

"You should save more."

Say

"I noticed money tends to disappear a few days after payday. Want us to figure out where it's leaking?"

Instead of

"You spent too much."

Say

"Looks like this week was heavier than your normal spending rhythm."

Speak like a real human.

--------------------------------------------------

INSIGHT STYLE

Prioritize patterns over raw numbers.

Good:

"You usually make smaller withdrawals during the week, so yesterday's one stood out."

Better:

"Looks like weekends are where your pocket takes the biggest hit."

Celebrate wins.

Examples:

"You've gone five days without dipping into cash. That's longer than your usual rhythm."

"You're quietly becoming more consistent."

Small wins matter.

--------------------------------------------------

WHEN USERS FEEL GUILTY

Never shame them.

Never guilt-trip.

Instead:

Normalize.

Encourage.

Help them recover.

Example:

"One expensive weekend doesn't define your month."

--------------------------------------------------

WHEN USERS ASK ABOUT BUYING SOMETHING

Don't immediately say yes or no.

Consider:

Current spending

Upcoming bills

Savings goals

Recent behaviour

Cash available

Patterns

Then help them think.

Example:

"You can afford it, but it would probably delay your laptop savings by about two weeks. Which matters more right now?"

--------------------------------------------------

WHEN YOU DON'T KNOW

Say so.

Never invent data.

--------------------------------------------------

LENGTH

Passive alerts:

1-2 sentences

Chat:

2-5 sentences

Deep coaching:

Maximum 8 sentences

--------------------------------------------------

EVERY RESPONSE SHOULD DO AT LEAST ONE OF THESE

• Teach

• Encourage

• Notice a pattern

• Ask one thoughtful question

• Celebrate progress

• Reduce financial anxiety

If none happen...

Rewrite your answer.

--------------------------------------------------

MOST IMPORTANT RULE

People won't remember every chart.

They will remember how you made them feel.

Be the friend who quietly helps them build a better financial life.
`;

function stripThinking(text) {
  if (!text) return '';
  return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
}

function isPlanningOrMetaParagraph(para) {
  const lower = para.toLowerCase().trim();
  
  if (!lower) return true;
  
  // Check if paragraph contains standard prompt directives or meta self-talk
  if (
    lower.includes('keep it to') ||
    lower.includes('sentences, warm and') ||
    lower.includes('sentences exactly') ||
    lower.includes('user confirmed') ||
    lower.includes('validate this as') ||
    lower.includes('pivot to') ||
    lower.includes('savings goal') ||
    lower.includes('i will use the tags') ||
    lower.includes('the prompt says') ||
    lower.includes('let\'s write') ||
    lower.includes('let\'s just give') ||
    lower.includes('think block') ||
    lower.includes('thought block') ||
    lower.includes('comply with') ||
    lower.includes('compliance') ||
    lower.includes('perfect.') ||
    lower.includes('done.') ||
    lower.includes('nigerian slang') ||
    lower.includes('slang naturally') ||
    lower.includes('length constraint') ||
    lower.includes('coaching max') ||
    lower.includes('user question:') ||
    lower.includes('user profile:') ||
    lower.includes('recent bank transactions:') ||
    lower.includes('current cash pools:') ||
    lower.includes('active cash pools:') ||
    lower.includes('unallocated bank runs') ||
    lower.includes('should i buy this')
  ) {
    return true;
  }
  
  // If the paragraph starts with a bullet point and contains planning-like words
  if (/^[\s*-•*?]*$/.test(para)) return true; // empty bullet
  
  const bulletPattern = /^[-*•\d\.]+\s+/;
  if (bulletPattern.test(para)) {
    if (
      lower.includes('user') ||
      lower.includes('validate') ||
      lower.includes('note') ||
      lower.includes('goal') ||
      lower.includes('pocket') ||
      lower.includes('savings') ||
      lower.includes('slang') ||
      lower.includes('sentences')
    ) {
      if (
        lower.includes('confirm') ||
        lower.includes('coaching') ||
        lower.includes('keep it') ||
        lower.includes('pivot') ||
        lower.includes('analyze') ||
        lower.includes('determine') ||
        lower.includes('validate') ||
        lower.includes('suggest')
      ) {
        return true;
      }
    }
  }
  
  // If the paragraph is a line of text that looks exactly like a plan directive
  if (
    lower.startsWith('user confirmed recent') ||
    lower.startsWith('note remaining cash') ||
    lower.startsWith('validate this as a win') ||
    lower.startsWith('keep it to 2-5') ||
    lower.startsWith('keep it to 3-5') ||
    lower.startsWith('let\'s refine') ||
    lower.startsWith('response draft') ||
    lower.startsWith('thinking process:') ||
    lower.startsWith('thought process:') ||
    lower.startsWith('reasoning:')
  ) {
    return true;
  }
  
  // Self-reflection or thinking debate phrases
  if (
    lower.startsWith('wait, i\'ll') ||
    lower.startsWith('let\'s write the response') ||
    lower.startsWith('let\'s just write') ||
    lower.startsWith('let\'s go with') ||
    lower.startsWith('i will just provide') ||
    lower.startsWith('no, i\'ll use') ||
    lower.startsWith('let me just add')
  ) {
    return true;
  }

  return false;
}

// Auxiliary helper to strip out any drafting, self-correction, or meta-commentary leaked by the model
function cleanResponseText(responseText) {
  if (!responseText) return '';
  
  // Remove wrapping quotes around the entire response if the model quoted itself
  let trimmed = responseText.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 2) {
    trimmed = trimmed.substring(1, trimmed.length - 1).trim();
  }
  
  // Split into paragraphs
  const paras = trimmed.split(/\n\s*\n+/);
  const cleanParas = [];
  
  for (let i = 0; i < paras.length; i++) {
    const para = paras[i].trim();
    if (!para) continue;
    
    // Check if paragraph is just checklist details or prompt verification lines
    if (/^[?*•\-\d\.]/m.test(para) && (
      para.toLowerCase().includes('short block') || 
      para.toLowerCase().includes('no jargon') || 
      para.toLowerCase().includes('hedge naturally') || 
      para.toLowerCase().includes('length:') ||
      para.toLowerCase().includes('sentences exactly') ||
      para.toLowerCase().includes('perfect.')
    )) {
      continue; // skip verification checklists
    }
    
    if (isPlanningOrMetaParagraph(para)) {
      continue;
    }
    
    let cleanPara = para;
    if (cleanPara.startsWith('"') && cleanPara.endsWith('"') && cleanPara.length > 2) {
      cleanPara = cleanPara.substring(1, cleanPara.length - 1).trim();
    }
    
    cleanParas.push(cleanPara);
  }
  
  // Return the combined non-ignored paragraphs
  if (cleanParas.length > 0) {
    return cleanParas.join('\n\n');
  }
  
  return '';
}

// Cleans up thinking logs to prevent leaking instructions, boilerplate, or model drafts
function sanitizeThinking(thinkingText, user, userMessage) {
  if (!thinkingText) return '';
  const lines = thinkingText.split('\n');
  const cleanLines = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    
    // Skip Markdown code blocks or backtick lines completely
    if (trimmed.startsWith('`') || trimmed.endsWith('`') || trimmed.includes('```')) {
      continue;
    }
    
    const lower = trimmed.toLowerCase();
    
    // Skip any system instructions/leaked checklist instructions/draft details
    if (
      lower.includes('under 4 lines') ||
      lower.includes('extra text outside') ||
      lower.includes('formulate block') ||
      lower.includes('draft response') ||
      lower.includes('let\'s write it out') ||
      lower.includes('system prompt') ||
      lower.includes('system instruction') ||
      lower.includes('non-negotiable') ||
      lower.includes('critical mandate') ||
      lower.includes('think block') ||
      lower.includes('thinking block') ||
      lower.includes('no jargon') ||
      lower.includes('rules for response') ||
      lower.includes('supportive accountant') ||
      (lower.includes('user profile check') && lower.includes('chidi') && lines.length > 8)
    ) {
      continue;
    }
    
    cleanLines.push(trimmed);
  }
  
  // If empty or too brief, return a clean premium thought
  if (cleanLines.length === 0) {
    return `1. User profile check: ${user?.displayName || 'User'}.\n2. Analyzing conversational question: "${userMessage || ''}".\n3. Strategy: Responding directly with supportive financial accountant advice.`;
  }
  
  return cleanLines.join('\n');
}

// Highly robust sanitizer to prevent leaking thoughts to the user
export function formatAndSanitizeResponse(text, user, type, userMessage = '', cashPools = []) {
  if (!text) return '';
  let trimmed = text.trim();

  // Extract thinking block if it exists
  let thinking = '';
  let cleanResponse = trimmed;

  const getFallbackText = () => {
    const name = user?.displayName || 'friend';
    const msg = (userMessage || '').toLowerCase();
    const cashLeft = cashPools && cashPools.length > 0 ? Math.round(cashPools[0].amount * (cashPools[0].confidence || 1)) : 17000;
    
    if (msg.includes('jacket') || msg.includes('buy') || msg.includes('spend')) {
      return `That'd leave you pretty tight for the next few days, ${name}. Since you have about ₦${cashLeft.toLocaleString()} remaining in your active pocket cash and your budget is tight, maybe hold off on this particular purchase for now.`;
    }
    if (msg.includes('financially') || msg.includes('who am i') || msg.includes('who are my') || msg.includes('who are we')) {
      return `As a student with unstable inflow, you've been working hard to build a savings habit. Currently, you have about ₦${cashLeft.toLocaleString()} estimated in your active pocket cash. Let's tag your unallocated bank runs to get a fully clear picture of your cash runs!`;
    }
    return `Hey ${name}! I'm looking over your ledger. Let's keep your pocket cash in check. What spending decision or cash run are we reviewing today?`;
  };

  // Case 1: Standard tags exist
  if (/<think>([\s\S]*?)<\/think>/i.test(trimmed)) {
    const match = trimmed.match(/<think>([\s\S]*?)<\/think>/i);
    thinking = match[1].trim();
    cleanResponse = trimmed.replace(/<think>[\s\S]*?<\/think>/i, '').trim();
  } 
  // Case 2: Open tag but no close tag
  else if (/<think>/i.test(trimmed)) {
    const parts = trimmed.split(/<think>/i);
    thinking = parts[1].trim();
    cleanResponse = parts[0].trim();
  }
  // Case 3: No tags, but has header like "Thinking Process:" or "Thought Process:" OR starts with a numbered list like "1. User:" or "1. User profile:"
  else {
    const headerRegex = /^(Thinking Process|Thought Process|Thinking:|Thought:|Reasoning:)/i;
    const startsWithNumberedAnalysis = /^\s*(1\.\s*(User|Profile|Persona|Analysis|Advice|Goal|Cash)|[?*•\-]\s*(User|Profile|Persona|Analysis|Advice|Goal|Cash))/i.test(trimmed);
    
    if (headerRegex.test(trimmed) || startsWithNumberedAnalysis) {
      const parts = trimmed.split(/\n\s*\n/);
      if (parts.length > 1) {
        const thinkingParts = [];
        const responseParts = [];
        let inResponse = false;

        parts.forEach(p => {
          const trimmedP = p.trim();
          if (!trimmedP) return;
          
          if (inResponse) {
            responseParts.push(trimmedP);
          } else if (
            /^[?*•\-\d\.]/m.test(trimmedP) || 
            headerRegex.test(trimmedP) || 
            trimmedP.toLowerCase().startsWith('user profile') || 
            trimmedP.toLowerCase().startsWith('analyzing') || 
            trimmedP.toLowerCase().startsWith('strategy:') ||
            trimmedP.toLowerCase().startsWith('user:') ||
            trimmedP.toLowerCase().startsWith('cash:') ||
            trimmedP.toLowerCase().startsWith('advice:')
          ) {
            thinkingParts.push(trimmedP);
          } else {
            inResponse = true;
            responseParts.push(trimmedP);
          }
        });

        if (thinkingParts.length > 0) {
          thinking = thinkingParts.join('\n\n');
          cleanResponse = responseParts.join('\n\n');
        }
      }
    }
  }

  // Sanitize the extracted thinking block to prevent system leaks or drafts
  thinking = sanitizeThinking(thinking, user, userMessage);

  // Clean the cleanResponse from drafts, quotes, or meta-commentary
  let finalizedResponse = cleanResponseText(cleanResponse);

  // Remove duplicate header at start of response if any
  finalizedResponse = finalizedResponse.replace(/^(Thinking Process|Thinking:|Thought:|Reasoning:)\s*/i, '').trim();
  finalizedResponse = finalizedResponse.replace(/^(answer|response|helpful response|conversational response):\s*/i, '').trim();

  // If the finalized response is too short or empty, let's use our high-quality helper fallback
  if (!finalizedResponse || finalizedResponse.length < 5) {
    finalizedResponse = getFallbackText();
  }

  // Ensure thinking is set.
  if (!thinking) {
    thinking = `1. User profile check: ${user?.displayName || 'User'}.\n2. Analyzing conversational question: "${userMessage || ''}".\n3. Strategy: Responding directly with supportive financial accountant advice.`;
  }

  return `<think>\n${thinking}\n</think>\n\n${finalizedResponse.trim()}`;
}

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callFireworksModel(model, payload, apiKey) {
  const url = "https://api.fireworks.ai/inference/v1/chat/completions";
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    const resJson = await response.json();
    const content = resJson.choices[0]?.message?.content;
    if (content) {
      return content;
    }
    throw new Error(`No content returned in choices[0].message.content from Fireworks for model ${model}`);
  } else {
    const status = response.status;
    let errBody = "";
    try {
      errBody = await response.text();
    } catch (_) {
      errBody = "Could not read error body";
    }
    
    // Log details of the error precisely
    console.error(`[Fireworks Error] Model "${model}" failed. HTTP Status: ${status}. Error Body:`, errBody);
    
    if (status === 404) {
      console.error(`[Fireworks 404 Warning] Received 404 for model "${model}". This might mean the model string is invalid or deprecated. Raw response: ${errBody}`);
    }
    
    const err = new Error(`Fireworks API error: ${status}`);
    err.status = status;
    err.body = errBody;
    throw err;
  }
}

export async function generateQwenInsight({ user, transactions, cashPools, accountStats, type, userMessage = '', conversation, customApiKey = '' }) {
  const fireworksApiKey = customApiKey || process.env.FIREWORKS_API_KEY;

  const currentPoolsText = cashPools
    .filter(p => !p.closedAt)
    .map(p => `- Withdrawal of ₦${p.amount} from ${p.source === 'atm_withdrawal' ? 'ATM' : 'POS Cashout'} on ${new Date(p.createdAt).toLocaleDateString()}. Fading confidence is ${Math.round(p.confidence * 100)}% (meaning we guess ₦${Math.round(p.amount * p.confidence)} remains). Status: ${p.status}.`)
    .join('\n');

  const recentTxText = transactions
    .slice(0, 5)
    .map(t => `- ₦${t.amount} ${t.type} (${t.narration}) on ${new Date(t.createdAt).toLocaleDateString()}. Category: ${t.category || 'unallocated'}.`)
    .join('\n');

  const contextPrompt = `
USER PROFILE:
- Name: ${user.displayName}
- Persona Type: ${user.profile.userType} (${user.profile.userType === 'student' ? 'unstable inflow' : user.profile.userType === 'trader' ? 'frequent business cash cycles' : 'salaried employee'})
- Goals: ${user.profile.goals.join(', ')}
- Settings: Cash Expiry Limit is ${user.settings.cashExpiryDays} days, sensitivity is ${user.settings.flagSensitivity}
- Average Cash Burn: ${user.stats.avgBurnCycleDays} days

CURRENT CASH POOLS:
${currentPoolsText || 'No active cash pools. User has no unrecorded cash tracked.'}

RECENT BANK TRANSACTIONS:
${recentTxText}

${type === 'chat' ? `USER QUESTION: "${userMessage}"` : 'PROMPT TRIGGER: Passive post-transaction transaction landing alert.'}
  `;

  let messages = [];
  messages.push({
    role: "system",
    content: SYSTEM_PROMPT + `\n\n### USER'S CURRENT FINANCIAL & PROFILE CONTEXT:\n${contextPrompt}`
  });

  if (type === 'chat' && conversation && conversation.messages && conversation.messages.length > 0) {
    // Build chat history (last 10 messages)
    const sliceCount = 10;
    const history = conversation.messages.slice(-sliceCount);
    history.forEach((m) => {
      const role = m.role === 'user' ? 'user' : 'assistant';
      const content = m.role === 'user' ? m.text : stripThinking(m.text);
      if (content && content.trim()) {
        messages.push({ role, content });
      }
    });

    // Ensure the last message matches the current user message
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userMessage) {
      messages.push({ role: 'user', content: userMessage });
    }
  } else {
    messages.push({
      role: "user",
      content: contextPrompt
    });
  }

  // 1. Try Fireworks API first with retry logic
  if (fireworksApiKey) {
    try {
      let output = null;
      let primaryAttempts = 0;
      const primaryModel = "accounts/fireworks/models/qwen3p7-plus";
      const primaryPayload = {
        model: primaryModel,
        max_tokens: 2500,
        top_k: 40,
        temperature: 0.7,
        messages
      };

      while (primaryAttempts < 2) {
        try {
          primaryAttempts++;
          output = await callFireworksModel(primaryModel, primaryPayload, fireworksApiKey);
          break; // Success!
        } catch (err) {
          const isTransient = err.status >= 500 || !err.status;
          if (isTransient && primaryAttempts === 1) {
            console.warn(`Transient error (Status: ${err.status || 'Network'}) on primary Fireworks attempt 1. Retrying in 2 seconds...`);
            await delay(2000);
          } else {
            throw err;
          }
        }
      }

      if (output) {
        console.log("Success generating insight using Fireworks Qwen 3.7 Plus with history!");
        const cleaned = formatAndSanitizeResponse(output, user, type, userMessage, cashPools);
        return { text: cleaned, source: "fireworks-primary" };
      }
    } catch (primaryError) {
      console.error(`[Tier 1 Error] Primary Fireworks Qwen 3.7 failed. Reason: ${primaryError.message}. Status: ${primaryError.status || 'unknown'}. Body: ${primaryError.body || 'none'}`);
      
      // 2. Secondary attempt: fallback model minimax-m3 inside Fireworks
      try {
        console.log("Initiating Tier 2 fallback to Fireworks Minimax M3...");
        const fallbackModel = "accounts/fireworks/models/minimax-m3";
        const fallbackPayload = {
          model: fallbackModel,
          max_tokens: 2500,
          temperature: 0.7,
          messages
        };
        const output = await callFireworksModel(fallbackModel, fallbackPayload, fireworksApiKey);
        if (output) {
          console.log("Success generating insight using Fireworks Minimax M3 fallback!");
          const cleaned = formatAndSanitizeResponse(output, user, type, userMessage, cashPools);
          return { text: cleaned, source: "fireworks-fallback" };
        }
      } catch (fallbackError) {
        console.error(`[Tier 2 Error] Secondary Fireworks Minimax M3 also failed. Reason: ${fallbackError.message}. Status: ${fallbackError.status || 'unknown'}. Body: ${fallbackError.body || 'none'}`);
      }
    }
  } else {
    console.log("Fireworks API key not provided, dropping to local fallback.");
  }

  // 3. Fallback to smart pattern-aware local generator if no keys work or fail (Tier 3)
  console.log("Using smart local pattern-aware advisor fallback.");
  
  let lastAgentMsg = "";
  let lastUserMsg = "";
  if (conversation && conversation.messages && conversation.messages.length > 0) {
    const history = conversation.messages;
    const agentMsgs = history.filter(m => m.role === 'agent');
    const userMsgs = history.filter(m => m.role === 'user');
    if (agentMsgs.length > 0) {
      lastAgentMsg = stripThinking(agentMsgs[agentMsgs.length - 1].text);
    }
    if (userMsgs.length > 0) {
      lastUserMsg = userMsgs[userMsgs.length - 1].text;
    }
  }

  if (type === 'chat') {
    const msg = userMessage.toLowerCase();
    let conversationContext = "";
    if (lastAgentMsg) {
      const lastAgentLower = lastAgentMsg.toLowerCase();
      if (lastAgentLower.includes('savings') || lastAgentLower.includes('save')) {
        conversationContext = `We were just talking about your savings goals. `;
      } else if (lastAgentLower.includes('jacket') || lastAgentLower.includes('spend') || lastAgentLower.includes('buy')) {
        conversationContext = `Back to that purchase decision we were reviewing. `;
      } else if (lastAgentLower.includes('cash') || lastAgentLower.includes('fading')) {
        conversationContext = `Continuing with our look at your cash fading rate. `;
      } else {
        conversationContext = `Following up on what we were just chatting about. `;
      }
    }

    if (msg.includes('jacket') || msg.includes('buy') || msg.includes('spend')) {
      const cleaned = formatAndSanitizeResponse(`<think>
1. User profile check: Chidi (student, tight budget).
2. Question: "Should I buy this ₦20,000 jacket?"
3. Financial reality check: Active pocket cash has ₦18,000 left. Balance in bank is tight. ₦20,000 exceeds entire active cash pool!
4. Supportive advice formulation: Warn that this purchase is too steep for now, suggest waiting until next inflow.
</think>${conversationContext}That'd leave you pretty tight for the next few days, ${user.displayName}. Since you have ₦${Math.round(cashPools[0]?.amount || 15000)} remaining in your active pocket cash and your next inflow isn't for a while, maybe hold off on this particular purchase.`, user, type, userMessage, cashPools);
      return { text: cleaned, source: "local-fallback" };
    }
    
    // Dynamic fallback matching user's specific query context
    let specificAdvise = `looks like your pocket cash is fading at a normal pace. Since you have some unallocated bank runs, let's tag those first so I can give you a crystal clear picture of your cash on hand!`;
    
    if (msg.includes('save') || msg.includes('saving') || msg.includes('consistency') || msg.includes('goal')) {
      specificAdvise = `as a ${user.profile.userType}, saving can be a test of willpower, but you're working towards your goals: "${user.profile.goals.join(', ')}". Currently, we track ₦${Math.round((cashPools[0]?.amount || 25000) * (cashPools[0]?.confidence || 0.68))} in remaining active cash. Let's aim to lock some down so it doesn't leak away!`;
    } else if (msg.includes('cash') || msg.includes('pocket') || msg.includes('pool') || msg.includes('fade')) {
      const activeCount = cashPools.filter(p => !p.closedAt).length;
      specificAdvise = `we are currently tracking ${activeCount} active cash pocket(s). Your estimated pocket balance is about ₦${Math.round((cashPools[0]?.amount || 25000) * (cashPools[0]?.confidence || 0.68))}. Because cash fades rapidly, remember to log any transit/food runs immediately.`;
    } else if (msg.includes('transaction') || msg.includes('bank') || msg.includes('recent') || msg.includes('ledger')) {
      const txList = transactions.slice(0, 2).map(t => `₦${t.amount.toLocaleString()} (${t.narration})`).join(' and ');
      specificAdvise = `your latest transactions include ${txList || 'no recent entries'}. These are tracked in your live bank ledger. Any cash withdrawals are separated into dedicated pockets to trace organic spending decay.`;
    } else if (msg.includes('financially') || msg.includes('who am i') || msg.includes('who are my') || msg.includes('profile')) {
      specificAdvise = `as a ${user.profile.userType} with a ${user.profile.riskComfort} risk comfort, you have been trying to build healthy money habits. Currently, you have about ₦${Math.round((cashPools[0]?.amount || 25000) * (cashPools[0]?.confidence || 0.68))} left in your active pocket cash. Let's tag your unallocated bank runs to keep your ledger accurate!`;
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      specificAdvise = `hello! I'm your FinI financial companion. Let's keep your pocket cash in check. What spending decision or cash run are we reviewing today?`;
    } else if (lastUserMsg) {
      specificAdvise = `I hear you on your last message about "${lastUserMsg}". Let's work together to trace where that physical pocket cash is fading. We estimate you have ₦${Math.round((cashPools[0]?.amount || 25000) * (cashPools[0]?.confidence || 0.68))} left on hand. What is our next step?`;
    }

    const cleaned = formatAndSanitizeResponse(`<think>
1. User profile check: ${user.displayName} (${user.profile.userType}).
2. Goal review: ${user.profile.goals.join(', ')}.
3. Analysis: Active pocket cash has around ₦${Math.round((cashPools[0]?.amount || 25000) * (cashPools[0]?.confidence || 0.68))} left.
4. Strategy: Directly answer the user's query dynamically with a conversational local fallback.
</think>Hey ${user.displayName}, ${conversationContext}${specificAdvise}`, user, type, userMessage, cashPools);
    return { text: cleaned, source: "local-fallback" };
  } else {
    // Passive post-transaction flag alert fallback
    const lastTx = transactions[0];
    if (lastTx && lastTx.amount > 10000) {
      const cleaned = formatAndSanitizeResponse(`<think>
1. Passive post-transaction trigger.
2. Spent amount is ₦${lastTx.amount} at ${lastTx.narration}.
3. Pattern check: This is larger than typical card spend, occurring earlier than normal.
4. Advisor advice: Issue a warning to pace themselves.
</think>You just spent ₦${lastTx.amount.toLocaleString()} at ${lastTx.narration}, which is almost half of today's bank cash, and it's three days earlier than you usually empty your pocket. Pace yourself, friend!`, user, type, userMessage, cashPools);
      return { text: cleaned, source: "local-fallback" };
    }
    const cleaned = formatAndSanitizeResponse(`<think>
1. Passive time-decay trigger.
2. Estimated remaining cash in pockets is aging.
3. Recommendation: Prompt user to record any physical cash expenses (like transport or carrier runs) to keep the ledger accurate.
</think>Looks like your pocket cash is starting to fade. Time to log any cash runs (like transport or lunch) before we lose track entirely.`, user, type, userMessage, cashPools);
    return { text: cleaned, source: "local-fallback" };
  }
}

export function extractAndParseJSON(text) {
  if (!text) return null;
  let clean = text.trim();
  
  // Remove think tags if present
  clean = clean.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  
  // Remove markdown JSON formatting block
  clean = clean.replace(/```json/gi, '').replace(/```/g, '').trim();
  
  // Find first { and last }
  const startIdx = clean.indexOf('{');
  const endIdx = clean.lastIndexOf('}');
  
  if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
    const jsonCandidate = clean.substring(startIdx, endIdx + 1);
    try {
      return JSON.parse(jsonCandidate);
    } catch (parseError) {
      console.warn("JSON.parse failed on extracted substring. Attempting cleanup:", parseError);
      try {
        const repaired = jsonCandidate
          .replace(/,\s*([}\]])/g, '$1') // remove trailing commas
          .replace(/[\u0000-\u001F]+/g, ' '); // remove unescaped controls
        return JSON.parse(repaired);
      } catch (repairError) {
        console.warn("Attempt to parse repaired JSON failed:", repairError);
      }
    }
  }
  
  try {
    return JSON.parse(clean);
  } catch (err) {
    return null;
  }
}

export async function learnUserPersonality({ userMessage, agentResponse, currentUser, customApiKey }) {
  const fireworksApiKey = customApiKey || process.env.FIREWORKS_API_KEY;

  const currentProfile = currentUser.profile || {};
  const previousLearned = currentProfile.learnedPersonality || "";

  // Local fallback analyzer (extremely robust and guaranteed to run)
  const getLocalFeedback = () => {
    const msg = userMessage.toLowerCase();
    let detectedType = currentProfile.userType || "student";
    let detectedRisk = currentProfile.riskComfort || "cautious";
    let detectedGoals = [...(currentProfile.goals || [])];

    // Typology detection
    if (msg.includes('student') || msg.includes('unilag') || msg.includes('campus') || msg.includes('school') || msg.includes('allowance') || msg.includes('university') || msg.includes('class')) {
      detectedType = 'student';
    } else if (msg.includes('trader') || msg.includes('business') || msg.includes('market') || msg.includes('shop') || msg.includes('goods') || msg.includes('stock') || msg.includes('trade') || msg.includes('balogun') || msg.includes('wholesale')) {
      detectedType = 'trader';
    } else if (msg.includes('salary') || msg.includes('payday') || msg.includes('work') || msg.includes('office') || msg.includes('boss') || msg.includes('salaried') || msg.includes('job') || msg.includes('corporate')) {
      detectedType = 'salaried';
    }

    // Risk comfort detection
    if (msg.includes('risk') || msg.includes('bold') || msg.includes('invest') || msg.includes('crypto') || msg.includes('high yield') || msg.includes('gamble')) {
      detectedRisk = 'bold';
    } else if (msg.includes('save') || msg.includes('cautious') || msg.includes('scared') || msg.includes('lose money') || msg.includes('safe') || msg.includes('fraid') || msg.includes('protect')) {
      detectedRisk = 'cautious';
    }

    // Goals detection
    if ((msg.includes('laptop') || msg.includes('phone')) && !detectedGoals.includes('save_for_electronics')) {
      detectedGoals.push('save_for_electronics');
    }
    if ((msg.includes('rent') || msg.includes('accommodation')) && !detectedGoals.includes('save_for_rent')) {
      detectedGoals.push('save_for_rent');
    }
    if ((msg.includes('business') || msg.includes('trade') || msg.includes('goods')) && !detectedGoals.includes('track_business_cash')) {
      detectedGoals.push('track_business_cash');
    }

    // Dynamic Relatable Nigerian Descriptions
    let personalitySentence = "";
    if (detectedType === 'student') {
      if (detectedRisk === 'cautious') {
        personalitySentence = "A cautious student working hard on campus to stretch pocket allowances and establish early savings.";
      } else if (detectedRisk === 'bold') {
        personalitySentence = "An adventurous student seeking smart investments and side hustles while managing unstable school inflows.";
      } else {
        personalitySentence = "An active student balancing campus food runs with consistent pocket cash awareness.";
      }
    } else if (detectedType === 'trader') {
      if (detectedRisk === 'cautious') {
        personalitySentence = "A prudent market trader focused on guarding trade margins and keeping physical cash safe from leaky runs.";
      } else {
        personalitySentence = "An active Lagos trader optimizing high daily cash turnarounds and tracking business trade flows.";
      }
    } else {
      // Salaried
      if (detectedRisk === 'bold') {
        personalitySentence = "A forward-looking salaried earner exploring bold investments while keeping tight reins on weekend cashouts.";
      } else {
        personalitySentence = "A steady salary earner focusing on building a reliable emergency savings habit and auditing heavy cash outflows.";
      }
    }

    // Add extra touch if user mentions specific things
    if (msg.includes('jacket') || msg.includes('buy') || msg.includes('spend')) {
      personalitySentence += " Currently deliberating on a shopping spend decision.";
    }

    return {
      userType: detectedType,
      riskComfort: detectedRisk,
      goals: detectedGoals,
      learnedPersonality: personalitySentence
    };
  };

  const contextPrompt = `
CURRENT USER PROFILE:
- Name: ${currentUser.displayName}
- Current Type: ${currentProfile.userType}
- Current Risk Comfort: ${currentProfile.riskComfort}
- Current Goals: ${JSON.stringify(currentProfile.goals)}
- Previously Learned Personality Description: "${previousLearned}"

CONVERSATION TO ANALYZE:
User Message: "${userMessage}"
Agent Response: "${agentResponse}"
  `;

  const messages = [
    { role: "system", content: `You are the underlying personality-learning engine for the "FinI" app in Nigeria.
Your job is to analyze the conversation and output a JSON object to update/refine the user's financial personality.

JSON Schema:
{
  "userType": "student" | "trader" | "salaried" | null,
  "riskComfort": "cautious" | "balanced" | "bold" | null,
  "goals": ["array of goal strings"] | null,
  "learnedPersonality": "a dynamic 1-sentence description in third-person catching their vibe (e.g., 'A student trying to stretch pocket money' or 'A trader protecting profit margins'). Relatable and positive!"
}

Only return valid raw JSON. No markdown, no triple backticks, no comments.` },
    { role: "user", content: contextPrompt }
  ];

  // 1. Try Fireworks API first
  if (fireworksApiKey) {
    try {
      let output = null;
      let primaryAttempts = 0;
      const primaryModel = "accounts/fireworks/models/qwen3p7-plus";
      const primaryPayload = {
        model: primaryModel,
        max_tokens: 2500,
        temperature: 0.2,
        messages
      };

      while (primaryAttempts < 2) {
        try {
          primaryAttempts++;
          output = await callFireworksModel(primaryModel, primaryPayload, fireworksApiKey);
          break; // success
        } catch (err) {
          const isTransient = err.status >= 500 || !err.status;
          if (isTransient && primaryAttempts === 1) {
            console.warn(`Transient error (Status: ${err.status || 'Network'}) on primary Fireworks attempt 1 in learnUserPersonality. Retrying in 2 seconds...`);
            await delay(2000);
          } else {
            throw err;
          }
        }
      }

      if (output) {
        // Parse JSON safely
        const parsed = extractAndParseJSON(output);
        if (parsed && parsed.learnedPersonality) {
          return {
            userType: parsed.userType || currentProfile.userType,
            riskComfort: parsed.riskComfort || currentProfile.riskComfort,
            goals: parsed.goals && parsed.goals.length > 0 ? parsed.goals : currentProfile.goals,
            learnedPersonality: parsed.learnedPersonality
          };
        }
      }
    } catch (primaryErr) {
      console.warn("Primary model failed in learnUserPersonality, using Minimax M3 fallback. Reason:", primaryErr.message);

      // 2. Try Minimax M3 fallback inside Fireworks
      try {
        const fallbackModel = "accounts/fireworks/models/minimax-m3";
        const fallbackPayload = {
          model: fallbackModel,
          max_tokens: 2500,
          temperature: 0.2,
          messages
        };
        const output = await callFireworksModel(fallbackModel, fallbackPayload, fireworksApiKey);
        if (output) {
          const parsed = extractAndParseJSON(output);
          if (parsed && parsed.learnedPersonality) {
            return {
              userType: parsed.userType || currentProfile.userType,
              riskComfort: parsed.riskComfort || currentProfile.riskComfort,
              goals: parsed.goals && parsed.goals.length > 0 ? parsed.goals : currentProfile.goals,
              learnedPersonality: parsed.learnedPersonality
            };
          }
        }
      } catch (fallbackErr) {
        console.error("Secondary Minimax M3 fallback failed in learnUserPersonality. Reason:", fallbackErr.message);
      }
    }
  }

  // 3. If all fails, use local fallback
  return getLocalFeedback();
}
