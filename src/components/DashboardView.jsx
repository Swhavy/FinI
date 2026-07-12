import React, { useState } from 'react';
import { 
  Wallet, Banknote, RefreshCw, CheckCircle2, 
  Sparkles, Activity, Brain, ArrowDownRight, ArrowUpLeft, 
  TrendingUp, Award, Calendar, ChevronRight, Scale, ShieldCheck, Gauge, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Logo from './Logo';

export default function DashboardView({
  user,
  activeBankBalance,
  totalCashConfidence,
  activePoolList,
  insights,
  isGeneratingInsight,
  triggerAIReview,
  transactions,
  startingBalance,
  formatMoney,
  theme
}) {
  const isDark = theme === 'dark';
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // 1. Synthesize 7-day trend data dynamically for the custom SVG chart
  const get7DayTrendData = () => {
    const dataPoints = [];
    const today = new Date('2026-07-07T03:00:00.000Z');
    
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateString = d.toLocaleDateString('en-NG', { month: 'short', day: 'numeric' });
      
      // Calculate bank ledger balance up to this day
      const upToDateTxs = transactions.filter(t => new Date(t.createdAt) <= d);
      const bankBalanceAtDate = upToDateTxs.reduce(
        (acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, 
        startingBalance
      );
      
      // Calculate cash confidence decay up to this day
      let cashBalanceAtDate = 0;
      activePoolList.forEach(pool => {
        const poolCreated = new Date(pool.createdAt);
        if (poolCreated <= d) {
          const daysDiff = Math.max(0, (d - poolCreated) / (1000 * 60 * 60 * 24));
          const decayedConfidence = Math.max(0, 1 - (daysDiff / user.stats.avgBurnCycleDays));
          cashBalanceAtDate += pool.amount * decayedConfidence;
        }
      });
      
      dataPoints.push({
        date: dateString,
        bank: bankBalanceAtDate,
        cash: cashBalanceAtDate,
        total: bankBalanceAtDate + cashBalanceAtDate
      });
    }
    return dataPoints;
  };

  const trendData = get7DayTrendData();
  const chartHeight = 110;
  const chartWidth = 520;
  const maxTotalVal = Math.max(...trendData.map(d => d.total), 10000) * 1.1;
  const minVal = 0;
  const valRange = maxTotalVal - minVal || 1;

  const getSvgCoordinates = (index, value) => {
    const x = (index / (trendData.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - ((value - minVal) / valRange) * (chartHeight - 30) - 10;
    return { x, y };
  };

  // Build SVG Paths
  let totalAreaPath = '';
  let totalLinePath = '';
  let bankLinePath = '';

  trendData.forEach((dp, i) => {
    const pTotal = getSvgCoordinates(i, dp.total);
    const pBank = getSvgCoordinates(i, dp.bank);

    if (i === 0) {
      totalLinePath = `M ${pTotal.x} ${pTotal.y}`;
      bankLinePath = `M ${pBank.x} ${pBank.y}`;
      totalAreaPath = `M ${pTotal.x} ${chartHeight} L ${pTotal.x} ${pTotal.y}`;
    } else {
      totalLinePath += ` L ${pTotal.x} ${pTotal.y}`;
      bankLinePath += ` L ${pBank.x} ${pBank.y}`;
      totalAreaPath += ` L ${pTotal.x} ${pTotal.y}`;
    }

    if (i === trendData.length - 1) {
      totalAreaPath += ` L ${pTotal.x} ${chartHeight} Z`;
    }
  });

  const hoveredDp = hoveredIndex !== null ? trendData[hoveredIndex] : null;

  // Custom targets & cash flow figures based on the active sandbox profile
  const getProfileSpecifics = () => {
    if (user.profile.userType === 'student') {
      return {
        fundName: 'Micro-Savings Vault 🎒',
        savedNum: 14800,
        targetNum: 20000,
        completionDate: 'Sept 2026',
        weeklyProjectionNaira: '₦4,200',
        cashFlowPositive: '₦14,200',
        momentumRate: '22% less',
        percent: 74,
        impulseScoreText: 'Medium Reactive Pattern',
        impulsePercent: '34% Reactive',
        decisionDelay: '1.5 Hours',
        adherence: '88.5%',
        levelIndex: 3
      };
    } else if (user.profile.userType === 'trader') {
      return {
        fundName: 'Wholesale Reserves 📈',
        savedNum: 296000,
        targetNum: 400000,
        completionDate: 'Jan 2027',
        weeklyProjectionNaira: '₦85,000',
        cashFlowPositive: '₦98,400',
        momentumRate: '14% less',
        percent: 74,
        impulseScoreText: 'Balanced Flow Pattern',
        impulsePercent: '24% Reactive',
        decisionDelay: '2.8 Hours',
        adherence: '92.1%',
        levelIndex: 2
      };
    } else {
      // salaried default
      return {
        fundName: 'House Deposit Fund 🏡',
        savedNum: 1480000,
        targetNum: 2000000,
        completionDate: 'Oct 2026',
        weeklyProjectionNaira: '₦42,000',
        cashFlowPositive: '₦423,000',
        momentumRate: '15% less',
        percent: 74,
        impulseScoreText: 'Low Reactive Pattern',
        impulsePercent: '12% Reactive',
        decisionDelay: '4.2 Hours',
        adherence: '98.4%',
        levelIndex: 5
      };
    }
  };

  const specs = getProfileSpecifics();

  // Dynamic Identity mapping
  const getPersonalityHero = () => {
    if (user.profile.userType === 'student') {
      return {
        title: "The Campus Planner",
        desc: "You manage tight student allowances and campus feed runs with calculated precision. Every fading cash pocket is carefully audited to keep your liquid balance safe."
      };
    } else if (user.profile.userType === 'trader') {
      return {
        title: "The Velocity Merchant",
        desc: "You operate in high-frequency wholesale business flows and rapid physical cash turns. Separating personal money from busy market inventory pipelines is your superpower."
      };
    } else {
      return {
        title: "The Strategist",
        desc: "You approach finance like a grandmaster. Every move is calculated, every risk is hedged, and your focus remains fixed on the long game with controlled weekend cashouts."
      };
    }
  };

  const hero = getPersonalityHero();

  const getAvatarUrl = () => {
    if (user.displayName.includes('Chidi') || user.profile.userType === 'student') {
      return 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face';
    } else if (user.displayName.includes('Funmi') || user.profile.userType === 'trader') {
      return 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face';
    } else if (user.displayName.includes('Emeka') || user.profile.userType === 'salaried') {
      return 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face';
    }
    return 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face';
  };

  const cleanThinkingTags = (text) => {
    if (!text) return '';
    return text.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
  };

  const aiRecommendation = insights && insights.length > 0 
    ? cleanThinkingTags(insights[0].outputText) 
    : "Your weekend spending has dropped 14% this month without impacting your social engagement score. You've redirected NGN42,000 into your Wealth Management bucket. Suggesting a 2% increase in your Risk Profile for the next cycle.";

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-300 px-2 sm:px-0">
      
      {/* SECTION 1: HERO IDENTITY BANNER */}
      <section className="mb-2">
        <div className="relative w-full rounded-lg bg-surface-1 border border-border p-6 md:p-8 flex flex-col justify-end group transition-all duration-300 min-h-[160px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-bg-base/90 via-transparent to-transparent z-0" />
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none group-hover:scale-105 transition-transform duration-700" />
          
          {/* Subtle Logo watermark background */}
          <div className="absolute -top-12 -right-12 w-64 h-64 opacity-10 pointer-events-none group-hover:scale-105 group-hover:opacity-15 transition-all duration-700 z-0">
            <Logo className="w-full h-full" showBg={false} />
          </div>

          {/* Top-right floating user profile/account avatar pill */}
          <div className="absolute top-4 right-4 flex items-center gap-2.5 z-10 border border-border p-1.5 pr-4 rounded bg-surface-2 transition-all duration-300">
            <img 
              src={getAvatarUrl()} 
              alt={user.displayName}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded object-cover border border-accent-gold/20 shadow-sm shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-mono font-bold uppercase tracking-tight leading-none text-text-primary">{user.displayName}</span>
              <span className="text-[7px] font-mono uppercase tracking-wider mt-0.5 text-text-muted">{user.profile.userType}</span>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-surface-2 p-1 border border-border shrink-0 shadow-lg flex items-center justify-center bg-radial-to-br from-surface-2 to-surface-3">
              <Logo className="w-full h-full" showBg={true} />
            </div>
            <div className="space-y-1.5 md:space-y-2">
              <span className="font-mono text-[9px] uppercase tracking-widest text-accent-gold font-bold bg-accent-forest/40 px-3 py-1 rounded border border-border inline-block">
                Your Financial Identity
              </span>
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary uppercase tracking-tight">
                {hero.title}
              </h2>
              <p className="text-xs md:text-sm text-text-secondary max-w-2xl leading-relaxed">
                {hero.desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: BEHAVIORAL SNAPSHOT BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Confidence (Large Square) - Styled as Executive card with gold top border */}
        <div className="md:col-span-6 bg-surface-1 border border-border border-t-2 border-t-accent-gold rounded-lg p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h3 className="text-xs font-semibold font-mono text-text-secondary uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={14} className="text-accent-gold" />
              Cash Confidence Score
            </h3>
          </div>
          
          <div className="relative w-40 h-40 flex items-center justify-center my-4">
            <div className="absolute inset-0 bg-radial-to-r from-accent-gold/5 to-transparent rounded-full blur-xl pointer-events-none" />
            <svg className="w-full h-full -rotate-90">
              <circle className="stroke-border" cx="80" cy="80" fill="transparent" r="70" strokeWidth="5" />
              <circle 
                className="stroke-accent-gold" 
                cx="80" 
                cy="80" 
                fill="transparent" 
                r="70" 
                strokeWidth="5" 
                strokeDasharray="439.8" 
                strokeDashoffset="70.36" // Matches top 5% risk / ~84 score
                strokeLinecap="square"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono text-4xl font-bold text-text-primary leading-none">84</span>
              <span className="text-[10px] font-mono text-accent-gold font-bold uppercase tracking-widest mt-1">OPTIMAL</span>
            </div>
          </div>
          
          <div className="w-full pt-4 border-t border-border/40 text-center">
            <p className="text-[10px] font-mono text-text-muted uppercase font-semibold tracking-widest">TOP 5% OF RISK MANAGEMENT ADHERENCE</p>
          </div>
        </div>

        {/* AI Insight Card - Left Gold Border Accent */}
        <div className="md:col-span-6 bg-surface-1 border border-border border-l-4 border-l-accent-gold rounded-lg p-6 overflow-hidden relative flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-gold/5 rounded-full blur-2xl pointer-events-none" />
          
          <div>
            <h3 className="text-xs font-semibold font-mono text-accent-gold uppercase tracking-widest flex items-center gap-2 mb-4">
              <Sparkles size={14} className="animate-pulse" />
              FinI Private AI Intelligence
            </h3>
            <p className="text-xs md:text-[13px] text-text-secondary leading-relaxed italic font-mono">
              "{aiRecommendation}"
            </p>
          </div>
          
          <button 
            onClick={triggerAIReview}
            disabled={isGeneratingInsight}
            className="btn-primary mt-6 w-full py-3"
          >
            {isGeneratingInsight ? 'Analyzing Patterns...' : 'Optimize Profile'} 
            <ArrowRight size={13} className="text-[#14211c]" />
          </button>
        </div>

      </div>

      {/* SECTION 3: LINE CHART/VELOCITY GRAPH */}
      <div className="bg-surface-1 border border-border rounded-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
          <div className="space-y-1">
            <h4 className="text-xs font-semibold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
              <Activity size={14} className="text-accent-gold animate-pulse" /> Cash Flow Velocity & Organic Decay Trend
            </h4>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Combined liquid ledger & physical pockets over the last 7 days</p>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[9px] font-mono text-text-muted font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-accent-gold inline-block shrink-0" /> Total Liquid Net Asset</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-xs bg-border inline-block shrink-0" /> Isolated Bank Balance</span>
          </div>
        </div>

        {/* Render SVG Responsive Container */}
        <div className="relative w-full overflow-x-auto select-none pt-1">
          {hoveredDp && (
            <div className="absolute top-0 right-2 px-3 py-2 rounded border text-[10px] font-mono shadow-xl transition-all flex flex-col gap-0.5 z-10 bg-surface-2 border-border text-text-primary">
              <span className="text-text-muted font-bold uppercase tracking-wider">{hoveredDp.date}</span>
              <span className="font-bold text-accent-gold">Total: {formatMoney(hoveredDp.total)}</span>
              <span className="text-text-secondary">Bank Ledger: {formatMoney(hoveredDp.bank)}</span>
              <span className="text-accent-gold-dim">Decaying Cash: {formatMoney(hoveredDp.cash)}</span>
            </div>
          )}

          <svg 
            viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
            className="w-full h-auto min-w-[480px]"
            style={{ maxHeight: '150px' }}
          >
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0.00" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const yVal = chartHeight - ratio * (chartHeight - 30) - 15;
              return (
                <line 
                  key={idx} 
                  x1="20" 
                  y1={yVal} 
                  x2={chartWidth - 20} 
                  y2={yVal} 
                  stroke="var(--border)" 
                  strokeWidth="0.5" 
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Total Area under curve */}
            <path d={totalAreaPath} fill="url(#chartGradient)" />

            {/* Total line curve - Sovereign Gold */}
            <path d={totalLinePath} fill="none" stroke="var(--accent-gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

            {/* Bank balance line curve - Muted Border color */}
            <path d={bankLinePath} fill="none" stroke="var(--border)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3" />

            {/* Nodes and Hover zones */}
            {trendData.map((dp, i) => {
              const p = getSvgCoordinates(i, dp.total);
              return (
                <g key={i}>
                  <circle 
                    cx={p.x} 
                    cy={p.y} 
                    r={hoveredIndex === i ? '5' : '3.5'} 
                    fill={hoveredIndex === i ? 'var(--accent-gold)' : 'var(--surface-1)'} 
                    stroke="var(--accent-gold)" 
                    strokeWidth="2" 
                    className="transition-all duration-150 cursor-pointer"
                  />
                  {/* Vertical interaction bars */}
                  <rect
                    x={p.x - 20}
                    y="0"
                    width="40"
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  />
                </g>
              );
            })}
          </svg>

          {/* Dates footer */}
          <div className="flex justify-between px-4 mt-1.5 text-[9px] font-mono text-text-muted font-semibold uppercase tracking-wider">
            {trendData.map((dp, idx) => (
              <span key={idx}>{dp.date}</span>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 4: LIVE INSIGHTS ALERTS & RECENT STREAM PREVIEWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
        
        {/* LIVE INSIGHT ALERTS FEED (7 cols) */}
        <div className="lg:col-span-7 bg-surface-1 border border-border rounded-lg p-6 flex flex-col gap-4 w-full">
          <div className="flex justify-between items-center border-b pb-3 border-border">
            <h4 className="text-xs font-semibold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
              <Sparkles size={14} className="text-accent-gold animate-pulse" /> Private Wealth Audit Stream
            </h4>
            
            <button
              onClick={triggerAIReview}
              disabled={isGeneratingInsight}
              className="btn-secondary px-3 py-1 text-[10px] h-7"
            >
              <RefreshCw size={10} className={isGeneratingInsight ? 'animate-spin' : ''} /> RUN AUDIT CHECK
            </button>
          </div>

          <div className="flex flex-col gap-0.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar w-full">
            {insights && insights.length > 0 ? (
              insights.slice(0, 3).map((ins, idx) => (
                <div 
                  key={ins.id} 
                  className={`py-3.5 px-1 border-b border-border/40 text-xs leading-relaxed transition-all ${
                    idx === 0 ? 'pt-1' : ''
                  }`}
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-mono text-[9px] uppercase font-bold text-accent-gold tracking-widest">
                      {ins.flagged ? '🚨 PATTERN ALERT' : '💡 CASH WATCH'}
                    </span>
                    <span className="font-mono text-[8px] text-text-muted font-semibold">
                      {new Date(ins.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="font-mono text-text-secondary leading-relaxed">{cleanThinkingTags(ins.outputText)}</p>
                </div>
              ))
            ) : (
              <div className="p-6 border border-border/50 rounded text-center text-xs italic font-mono bg-surface-2 text-text-muted uppercase tracking-wider">
                No custom companion alerts generated yet. Click "Run Audit Check" to evaluate patterns.
              </div>
            )}
          </div>
        </div>

        {/* LEDGER PREVIEW FEEDS (5 cols) - transaction overflow protection built in */}
        <div className="lg:col-span-5 bg-surface-1 border border-border rounded-lg p-6 flex flex-col gap-4 w-full overflow-hidden">
          <div className="border-b pb-3 border-border flex justify-between items-center">
            <h4 className="text-xs font-semibold font-mono uppercase tracking-widest text-text-primary">
              Recent Ledger Streams
            </h4>
            <span className="text-[8px] font-mono text-text-muted uppercase font-semibold tracking-wider">Verified Ledger</span>
          </div>

          <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1 no-scrollbar w-full overflow-x-hidden">
            {transactions.slice(0, 5).map(tx => (
              <div key={tx.id} className="p-3 rounded border border-border bg-surface-2 flex items-center justify-between gap-3 text-[11px] w-full">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    tx.type === 'credit' 
                      ? 'bg-accent-forest text-accent-gold border border-border' 
                      : 'bg-surface-3 text-text-muted border border-border'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownRight size={11} /> : <ArrowUpLeft size={11} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-mono font-bold truncate text-text-primary leading-tight">
                      {tx.narration}
                    </h5>
                    <span className="text-[8px] text-text-muted font-mono block mt-0.5 uppercase tracking-wider">
                      {tx.channel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`font-mono font-bold tabular-nums ${tx.type === 'credit' ? 'text-accent-gold' : 'text-danger-copper'}`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatMoney(tx.amount)}
                  </span>
                  <span className="block text-[8px] font-mono text-text-muted uppercase mt-0.5 font-bold tracking-widest">
                    {tx.category || 'Unallocated'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
