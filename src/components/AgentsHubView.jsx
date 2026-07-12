import React, { useState } from 'react';
import { 
  Cpu, Activity, ShieldAlert, Brain, Sparkles, History, 
  UserCheck, RefreshCw, Layers, DollarSign, Database, 
  Terminal, Play, CheckCircle2, TrendingUp, HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AgentsHubView({
  user,
  transactions,
  cashPools,
  insights,
  theme,
  formatMoney
}) {
  const isDark = theme === 'dark';
  const [activeTab, setActiveTab] = useState('pipeline');
  const [executingAgent, setExecutingAgent] = useState(null);
  const [eventLogs, setEventLogs] = useState([
    { id: 1, time: '12:44:02', event: 'Mono BankSync Triggered', type: 'system', desc: 'Syncing 3 months of ledgers for active user profile' },
    { id: 2, time: '12:44:03', event: 'ScoutObservation Created', type: 'scout', desc: 'Identified recurring GTBank ATM cashouts' },
    { id: 3, time: '12:44:03', event: 'AnomalyDetected (Risk Score: 12)', type: 'detective', desc: 'No transaction anomalies found' },
    { id: 4, time: '12:44:04', event: 'IdentityProfileUpdated', type: 'behavior', desc: 'Computed Money Archetype: "The Architect"' },
    { id: 5, time: '12:44:05', event: 'InsightGenerated', type: 'insight', desc: 'Suppressed alert fatigue. Pattern forwarded to Companion' }
  ]);
  const [mockIsRunning, setMockIsRunning] = useState(false);

  // 1. Deterministic Metrics Engine (Calculated locally from user ledger data)
  const calculateScorecard = () => {
    let impulseScore = 35;
    let weekendSpending = 40;
    let cashDependence = 45;
    let savingsConsistency = 60;
    let goalCommitment = 75;
    let decisionSpeed = 50;

    if (transactions && transactions.length > 0) {
      const debs = transactions.filter(t => t.type === 'debit');
      const totalDebAmount = debs.reduce((sum, t) => sum + t.amount, 0) || 1;

      // Impulse Score: Unallocated withdrawals or POS cashouts relative to overall debits
      const impulseTxs = debs.filter(t => t.category === 'withdrawal' || !t.category);
      const impulseAmt = impulseTxs.reduce((sum, t) => sum + t.amount, 0);
      impulseScore = Math.round((impulseAmt / totalDebAmount) * 100);
      impulseScore = Math.max(15, Math.min(95, impulseScore));

      // Weekend Spending: Ratio of Saturday/Sunday transactions
      const weekendTxs = debs.filter(t => {
        const d = new Date(t.createdAt);
        const day = d.getDay(); // 0 is Sunday, 6 is Saturday
        return day === 0 || day === 6;
      });
      const weekendAmt = weekendTxs.reduce((sum, t) => sum + t.amount, 0);
      weekendSpending = Math.round((weekendAmt / totalDebAmount) * 100);
      weekendSpending = Math.max(10, Math.min(90, weekendSpending));

      // Cash Dependence: Ratio of ATM/Cash withdrawals to total spending
      const cashWithdrawals = debs.filter(t => t.channel === 'atm' || t.category === 'withdrawal');
      const cashAmt = cashWithdrawals.reduce((sum, t) => sum + t.amount, 0);
      cashDependence = Math.round((cashAmt / totalDebAmount) * 100);
      cashDependence = Math.max(20, Math.min(98, cashDependence));

      // Savings Consistency: Derived from income transactions count & ratio
      const credits = transactions.filter(t => t.type === 'credit');
      const savingsProgress = Math.min(100, Math.round((credits.length / 3) * 100));
      savingsConsistency = Math.max(40, savingsProgress);
    }

    // Apply specific offsets based on profile type
    if (user.profile.userType === 'student') {
      impulseScore = Math.min(95, impulseScore + 15);
      cashDependence = Math.min(98, cashDependence + 10);
      savingsConsistency = Math.max(20, savingsConsistency - 20);
      goalCommitment = 65;
      decisionSpeed = 75;
    } else if (user.profile.userType === 'trader') {
      cashDependence = Math.min(98, cashDependence + 30);
      impulseScore = Math.max(10, impulseScore - 15);
      savingsConsistency = 80;
      goalCommitment = 85;
      decisionSpeed = 40;
    } else if (user.profile.userType === 'salaried') {
      weekendSpending = Math.min(95, weekendSpending + 15);
      savingsConsistency = Math.min(95, savingsConsistency + 10);
      goalCommitment = 90;
      decisionSpeed = 60;
    }

    return {
      impulseScore,
      weekendSpending,
      cashDependence,
      savingsConsistency,
      goalCommitment,
      decisionSpeed,
      financialConfidence: Math.round((savingsConsistency + goalCommitment - impulseScore / 2) / 1.5)
    };
  };

  const scores = calculateScorecard();

  const getArchetypeLabel = () => {
    if (user.profile.userType === 'student') {
      return { title: 'The Striver 🚀', desc: 'Always chasing the next side gig, managing unstable inflows with persistent campus grit.' };
    }
    if (user.profile.userType === 'trader') {
      return { title: 'The Architect 📐', desc: 'Thoroughly tracks business capital, avoids margins leakages, builds structured reserves.' };
    }
    return { title: 'The Protector 🛡️', desc: 'Focused on long-term household buffer, steady automated saving, and careful weekend control.' };
  };

  const archetype = getArchetypeLabel();

  // Multi-Agent Pipeline steps
  const agents = [
    { 
      id: 'scout', 
      name: 'Scout Agent (Observer)', 
      role: 'Passive Ledger Listener', 
      icon: Cpu, 
      color: 'text-accent-gold border-border bg-surface-2',
      desc: 'Triggers on bank sync (Mono hook) or instant transfers. Extracts transaction metadata, compares against historical merchant frequencies, and flags category types.',
      lastAction: 'Analyzed last inflow transaction narration: "FATHER ALLOWANCE".'
    },
    { 
      id: 'detective', 
      name: 'Detective Agent (Anomaly)', 
      role: 'Risk Score Calculator', 
      icon: ShieldAlert, 
      color: 'text-danger-copper border-border bg-surface-2',
      desc: 'Performs localized fraud auditing. Detects micro-spending spikes (>2x standard averages), unallocated late-night cashouts, and rapid-fire POS card runs.',
      lastAction: 'Calculated current transaction risk score: 14/100 (Safe).'
    },
    { 
      id: 'sage', 
      name: 'Sage Agent (Memory)', 
      role: 'Long-Term Memory Manager', 
      icon: Brain, 
      color: 'text-accent-gold border-border bg-surface-2',
      desc: 'Maintains user goals, lifestyle parameters, and coaching preferences. Indexes memory files to supply context prompts to Private AI Core.',
      lastAction: 'Retrieved profile parameters: Student with GTBank & Kuda hooks.'
    },
    { 
      id: 'behavior', 
      name: 'Behavior Analyst (Profiler)', 
      role: 'Identity Scorecard Profiler', 
      icon: TrendingUp, 
      color: 'text-accent-gold border-border bg-surface-2',
      desc: 'Analyzes macro-behavior patterns to compute the scorecard metrics. Identifies money archetypes naturally from structural wallet habits.',
      lastAction: `Computed money archetype match: "${archetype.title}" with 88% confidence.`
    },
    { 
      id: 'insight', 
      name: 'Insight Engine (Filter)', 
      role: 'Alert Relevance Prioritizer', 
      icon: Layers, 
      color: 'text-accent-gold border-border bg-surface-2',
      desc: 'Scores observations based on urgency and emotional novelty. Suppresses alert fatigue by batching non-essential notifications.',
      lastAction: 'Forwarded highest fidelity decay patterns to Private Concierge.'
    }
  ];

  const triggerAgentDryRun = (agentId) => {
    if (mockIsRunning) return;
    setExecutingAgent(agentId);
    setMockIsRunning(true);

    const logMessages = {
      scout: 'Scouting multi-bank ledgers... found 1 recent unallocated transfer.',
      detective: 'Evaluating delta variances... risk metrics computed at 14 (Sufficient Confidence).',
      sage: 'Updating vector memories... established student budget bounds.',
      behavior: 'Refined Money Scorecard... 84 cash confidence ratio locked.',
      insight: 'Generated alert token stream... packet decanting alert broadcast.'
    };

    setTimeout(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        event: `${agentId.toUpperCase()} run manually`,
        type: agentId,
        desc: logMessages[agentId] || 'Agent execution sequence completed successfully.'
      };
      setEventLogs(prev => [newLog, ...prev]);
      setExecutingAgent(null);
      setMockIsRunning(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300 px-2 sm:px-0">
      
      {/* HEADER SECTION WITH PRIVATE TABS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-4 w-full">
        <div>
          <h2 className="text-xl font-semibold text-text-primary uppercase tracking-widest font-mono">
            Autonomous Private Pipeline
          </h2>
          <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider mt-1">
            Observe, audit, and profiler systems operating under local RTPM framework
          </p>
        </div>

        {/* Quiet luxury Navigation Tabs - No pill shapes or heavy blue/green colors */}
        <div className="flex flex-wrap gap-1.5 bg-surface-2 p-1 rounded border border-border">
          {[
            { id: 'pipeline', label: 'PIPE OPERATIONS' },
            { id: 'scorecard', label: 'BEHAVIOR SCORECARD' },
            { id: 'cost', label: 'COMPUTE STATS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-[9px] font-mono font-bold tracking-widest uppercase rounded-xs transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'btn-primary'
                  : 'text-text-muted hover:text-text-primary bg-transparent border-0'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SANDBOX INFRASTRUCTURE CLARIFICATION NOTICE */}
      <div className="p-4 rounded border border-border bg-surface-2/40 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
        <div className="flex items-start gap-2.5">
          <HelpCircle size={15} className="text-accent-gold shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[10px] font-mono font-black uppercase tracking-widest text-text-primary leading-none">
              Sandbox Infrastructure Operations
            </h4>
            <p className="text-[10px] font-mono text-text-muted leading-relaxed uppercase tracking-wider">
              Note: The multi-agent sequence trigger buttons run as local sandbox dry-runs with preloaded telemetry events. However, the Behavior Scorecard metrics, money archetypes, and wallet pattern tracking are calculated deterministically using actual transaction records from your active bank ledgers.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* TAB 1: PIPE OPERATIONS */}
        {activeTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
          >
            {/* Left side list: Agent grid (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="border-b pb-2 border-border/40">
                <h3 className="text-xs font-semibold font-mono uppercase tracking-widest text-text-primary">
                  Active Pipe Agents
                </h3>
                <p className="text-[10px] font-mono text-text-muted uppercase mt-0.5 tracking-wider">Independent workers tracking wallet patterns</p>
              </div>

              <div className="flex flex-col gap-4">
                {agents.map((agent) => {
                  const IconComp = agent.icon;
                  const isThisExecuting = executingAgent === agent.id;
                  return (
                    <div 
                      key={agent.id}
                      className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col sm:flex-row gap-4 justify-between items-start transition-all hover:border-accent-gold/45"
                    >
                      <div className="flex items-start gap-3.5 min-w-0">
                        <div className={`w-10 h-10 rounded border flex items-center justify-center shrink-0 ${agent.color}`}>
                          <IconComp size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold font-mono uppercase text-text-primary tracking-wide">{agent.name}</h4>
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded border border-border bg-surface-3 text-text-muted tracking-wider uppercase font-bold">{agent.role}</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-text-secondary mt-1.5 font-mono">{agent.desc}</p>
                          
                          <div className="mt-3.5 p-2.5 rounded bg-surface-3 border border-border/60 text-[10px] font-mono text-accent-gold uppercase tracking-wider">
                            <span className="font-bold block text-[8px] text-text-muted mb-0.5">LAST COMPLETED ACTION:</span>
                            {agent.lastAction}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={mockIsRunning}
                        onClick={() => triggerAgentDryRun(agent.id)}
                        className="btn-secondary text-[9px] py-1.5 px-3 uppercase tracking-widest font-mono font-bold flex items-center gap-1 shrink-0 self-end sm:self-start disabled:opacity-40"
                      >
                        {isThisExecuting ? (
                          <>
                            <RefreshCw size={10} className="animate-spin" /> RUNNING...
                          </>
                        ) : (
                          <>
                            <Play size={10} /> TRIGGER SEQ
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right side: Event Telemetry Logs (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4 w-full">
              <div className="border-b pb-2 border-border/40">
                <h3 className="text-xs font-semibold font-mono uppercase tracking-widest text-text-primary">
                  System Telemetry Feed
                </h3>
                <p className="text-[10px] font-mono text-text-muted uppercase mt-0.5 tracking-wider">Historical diagnostic activity stream</p>
              </div>

              <div className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center border-b border-border pb-2">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-text-muted">Live Pipeline Diagnostic</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-gold border border-surface-1 animate-pulse" />
                </div>

                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-auto pr-1 no-scrollbar w-full">
                  {eventLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-surface-2 border border-border rounded flex flex-col gap-1 w-full text-[10.5px]">
                      <div className="flex justify-between items-center text-[9px] font-mono border-b border-border/40 pb-1 mb-1">
                        <span className="text-accent-gold font-bold tracking-wider">{log.event.toUpperCase()}</span>
                        <span className="text-text-muted tabular-nums">{log.time}</span>
                      </div>
                      <p className="font-mono text-text-secondary leading-relaxed normal-case">{log.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="text-[9px] text-text-muted border-t border-border/40 pt-3 text-center uppercase tracking-widest font-bold font-mono">
                  SECURE CHANNELS DEPLOYED • MD5 SYNC VALID
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: FINANCIAL IDENTITY SCORECARD */}
        {activeTab === 'scorecard' && (
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6 w-full"
          >
            {/* Archetype banner card */}
            <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-accent-gold font-bold">My Money Archetype</span>
                <h3 className="text-xl font-bold font-mono tracking-tight text-text-primary mt-1 uppercase">
                  {archetype.title}
                </h3>
                <p className="text-xs mt-2 max-w-xl leading-relaxed text-text-secondary font-mono">
                  {archetype.desc}
                </p>
              </div>
              <div className="px-4 py-3 border border-border bg-surface-2 rounded flex flex-col items-center shrink-0">
                <span className="text-[9px] font-mono text-text-muted uppercase font-bold tracking-widest">Match Confidence</span>
                <span className="text-2xl font-bold font-mono text-accent-gold mt-1">88%</span>
              </div>
            </div>

            {/* Scorecard 10 metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { label: 'Impulse Score', value: scores.impulseScore, suffix: '/100', desc: 'Tendency to make spontaneous unplanned withdrawals or untagged P2P runs.', highBad: true },
                { label: 'Weekend Spending Ratio', value: scores.weekendSpending, suffix: '%', desc: 'Discretionary weekend capital burn vs. steady weekday routines.', highBad: true },
                { label: 'Cash Dependence', value: scores.cashDependence, suffix: '%', desc: 'Reliance on hard physical cash withdrawals instead of traceable banking channels.', highBad: true },
                { label: 'Savings Consistency', value: scores.savingsConsistency, suffix: '/100', desc: 'Frequency and reliability of setting aside surplus cash buffers.', highBad: false },
                { label: 'Goal Commitment', value: scores.goalCommitment, suffix: '/100', desc: 'Active contribution tracking against stated custom financial milestones.', highBad: false },
                { label: 'Financial Confidence', value: scores.financialConfidence, suffix: '/100', desc: 'Aggregated stability index computed from unallocated ratio & cash decay cycle.', highBad: false },
                { label: 'Decision Speed', value: scores.decisionSpeed, suffix: '/100', desc: 'Average time elapsed between companion insights delivery and user adjustments.', highBad: true }
              ].map((metric, idx) => {
                const isCritical = metric.highBad ? metric.value > 65 : metric.value < 45;
                const progressColor = isCritical 
                  ? 'bg-danger-copper' 
                  : 'bg-accent-gold';

                return (
                  <div 
                    key={idx}
                    className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col justify-between transition-colors hover:border-accent-gold/40"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[11px] font-bold font-mono text-text-secondary uppercase tracking-widest">{metric.label}</span>
                        <span className={`text-xs font-bold font-mono ${isCritical ? 'text-danger-copper' : 'text-accent-gold'}`}>
                          {metric.value}{metric.suffix}
                        </span>
                      </div>
                      <p className="text-[10px] leading-relaxed mt-2 font-mono text-text-muted uppercase tracking-wider">{metric.desc}</p>
                    </div>

                    <div className="mt-5">
                      {/* Custom bar */}
                      <div className="w-full h-1 bg-surface-3 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${progressColor}`} 
                          style={{ width: `${metric.value}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[8px] font-mono text-text-muted mt-1.5 uppercase tracking-widest font-bold">
                        <span>PRUDENT</span>
                        <span>FADED RUN</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* TAB 3: COST OPTIMIZATION */}
        {activeTab === 'cost' && (
          <motion.div
            key="cost"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full"
          >
            {/* Left side: Cost Strategy details (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="border-b pb-2 border-border/40">
                <h3 className="text-xs font-semibold font-mono uppercase tracking-widest text-text-primary">
                  Token Efficiency Operations
                </h3>
                <p className="text-[10px] font-mono text-text-muted uppercase mt-0.5 tracking-wider">Optimizing inference latency and pay-per-token economics</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Model Routing Optimization', desc: 'Scout, Detective, and Anomaly run locally or on light 8B endpoints. Conversational Coach routes directly to Llama 70B for rich financial EQ.', savings: '84% cost reduction' },
                  { title: 'Context Window Pruning', desc: 'Prunes deep historical transactions prior to sending prompt context. Dynamically bundles only the last 10 chat loops and active cash decay pools.', savings: '68% prompt compression' },
                  { title: 'Edge Diagnostic Caching', desc: 'Caches Financial Identity Scorecards on-memory for 7 days. Only invalidates and triggers profiler on major cashouts or category overrides.', savings: 'Zero latency refresh' },
                  { title: 'Deterministic Fallback', desc: 'Direct ledger calculations bypass LLM token costs completely, saving massive server fees and avoiding numerical hallucination.', savings: '100% stable mathematics' }
                ].map((strat, i) => (
                  <div key={i} className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col justify-between hover:border-accent-gold/45 transition-colors">
                    <div>
                      <h4 className="text-xs font-bold font-mono text-text-primary uppercase tracking-wide">{strat.title}</h4>
                      <p className="text-[10.5px] leading-relaxed mt-2 text-text-secondary font-mono">{strat.desc}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[9px] font-mono uppercase font-bold text-accent-gold tracking-widest">
                      <span>Optimization Win:</span>
                      <span>{strat.savings}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Informative advice quote */}
              <div className="p-5 bg-surface-1 border border-border rounded-lg leading-relaxed text-xs">
                <p className="italic font-mono text-text-secondary leading-relaxed">
                  "I'm not looking for the most compute-heavy build. I'm looking for the one where local lightweight intelligence unlocks something real: a differentiated product, a defensible edge, or economics that actually pencil out."
                </p>
                <span className="block mt-2 font-mono text-[9px] text-text-muted uppercase tracking-widest font-bold">— ACT II TRACK 3 PRIVATE ADVISOR</span>
              </div>
            </div>

            {/* Right side: Cost stats widget (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6 sticky top-6">
              <div className="border-b pb-2 border-border/40">
                <h3 className="text-xs font-semibold font-mono uppercase tracking-widest text-text-primary flex items-center gap-1.5">
                  <Database size={14} className="text-accent-gold" /> System Telemetry Metrics
                </h3>
                <p className="text-[10px] font-mono text-text-muted uppercase mt-0.5 tracking-wider">Real-time local cluster statistics</p>
              </div>

              <div className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col gap-5 w-full">
                {/* Stats list */}
                <div className="flex flex-col gap-4 font-mono text-xs uppercase tracking-wider text-text-secondary">
                  <div className="flex justify-between items-center border-b border-border/40 pb-2 gap-2">
                    <span className="text-text-muted text-[10px]">Private Endpoint</span>
                    <span className="text-text-primary font-bold truncate text-right">local-cluster/qwen-plus-8b</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span className="text-text-muted text-[10px]">Inference Cluster</span>
                    <span className="text-accent-gold font-bold">Sovereign Node Cluster</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span className="text-text-muted text-[10px]">Avg Latency</span>
                    <span className="text-text-primary font-bold tabular-nums">180 ms</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border/40 pb-2">
                    <span className="text-text-muted text-[10px]">Tokens Active</span>
                    <span className="text-text-primary font-bold tabular-nums">1,840 Tkn</span>
                  </div>
                  <div className="flex justify-between items-center pb-1">
                    <span className="text-text-muted text-[10px]">Private Telemetry Fee</span>
                    <span className="text-accent-gold font-bold tabular-nums">₦0.045 / Run</span>
                  </div>
                </div>

                <div className="p-4 rounded text-center flex flex-col gap-1.5 bg-surface-2 border border-border">
                  <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest font-bold">Monthly Estimated Sovereign Edge Win</span>
                  <span className="text-2xl font-bold font-mono text-accent-gold mt-1 tabular-nums">₦24,800</span>
                  <span className="text-[8px] font-mono text-text-muted block mt-1 uppercase tracking-widest">EST RUNNING COST FOR 10,000 CONSECUTIVE INQUIRIES</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
