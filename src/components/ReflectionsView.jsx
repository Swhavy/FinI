import React from 'react';
import { 
  Sparkles, ShieldCheck, Timer, Utensils, Award, BookOpen, 
  Share2, ArrowRight, Zap, Target, HeartHandshake, Compass
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ReflectionsView({ user, formatMoney, theme, transactions = [], cashPools = [] }) {
  const isDark = theme === 'dark';

  // Customize the reflections dynamically based on real transactions and cash pools
  const getReflectionData = () => {
    // 1. Compute Savings / Remaining active pocket balance dynamically
    const activePockets = cashPools.filter(p => !p.closedAt);
    const totalInActivePockets = activePockets.reduce((sum, p) => sum + p.amount, 0);
    const computedSavedAmount = Math.max(1500, Math.round((totalInActivePockets * 0.42) / 100) * 100);

    // 2. Compute Decision Delay Hours dynamically from debit channel counts
    const debs = transactions.filter(t => t.type === 'debit');
    const withdrawalCount = debs.filter(t => t.channel === 'atm' || t.category === 'withdrawal' || t.narration.toLowerCase().includes('atm')).length;
    const computedDelayHours = Math.max(1.8, Math.min(6.5, 7.8 - withdrawalCount * 0.8));

    // 3. Compute Streak Days dynamically from length of records
    const computedStreakDays = Math.max(7, Math.min(60, (transactions.length * 2) + activePockets.length));

    // 4. Compute Impulse Reduction dynamically
    const computedImpulseReduction = Math.max(10, Math.min(38, 42 - withdrawalCount * 4));

    if (user.id === 'u_123' || user.profile.userType === 'student') {
      const displaySaved = computedSavedAmount;
      const displayHours = computedDelayHours.toFixed(1) + ' Hours';
      const displayStreak = computedStreakDays + ' Days';
      
      return {
        month: 'October 2023',
        tagline: 'Refining Campus Flow',
        headline: 'You mastered the art of pacing.',
        summary: 'A month of mindful campus decisions. By pausing before impulsive card runs, you successfully navigated the student budget crunch with confidence and poise.',
        archetypeTitle: 'The Striver 🚀',
        archetypeDesc: '"This month, you proved that resourcefulness is a form of wealth. You managed unstable student flows with intentional campus checks and built a solid buffer against spontaneous peer pressure."',
        delayHours: displayHours,
        delayDesc: 'Average wait before food and transit runs',
        delayReduction: computedImpulseReduction + '% Impulse Reduction',
        delayStatsText: 'You successfully avoided late-night campus delivery and spontaneous weekend snack runs.',
        habitIcon: Utensils,
        habitTitle: 'The Campus Kitchen',
        habitStat: '+' + formatMoney(displaySaved),
        habitLabel: 'Saved for your Micro-Reserve Fund',
        habitDesc: 'You cooked at the dorm or ate at the main student hall more than last month, avoiding premium off-campus restaurant markups and keeping transit runs in check.',
        streakDays: displayStreak,
        streakDesc: displayStreak + ' Savings Streak',
        streakSubtitle: 'Consistently feeding your micro-vault every single afternoon and maintaining positive pocket confidence.',
        imageAlt: 'A refined blueprint diagram of minimal luxury curves celebrating campus achievements'
      };
    } else if (user.id === 'u_456' || user.profile.userType === 'trader') {
      const displaySaved = computedSavedAmount * 4.5;
      const displayHours = (computedDelayHours * 1.3).toFixed(1) + ' Hours';
      const displayStreak = (computedStreakDays + 15) + ' Days';

      return {
        month: 'October 2023',
        tagline: 'Defensible Reserves',
        headline: 'You guarded your wholesale margins.',
        summary: 'An incredible month of separation. By segregating trade logistics capital from personal pockets, you built structured resilience that keeps your wholesale system running smoothly.',
        archetypeTitle: 'The Architect 📐',
        archetypeDesc: '"Every financial transaction was a carefully aligned structural layer this month. You prioritize systematic inventory margins, ensuring liquidity is accessible precisely when the market calls."',
        delayHours: displayHours,
        delayDesc: 'Average supplier rate evaluation delay',
        delayReduction: Math.round(computedImpulseReduction * 0.75) + '% Margin Retention',
        delayStatsText: 'You compared supplier prices for wholesale inventory purchases rather than accepting the immediate quote.',
        habitIcon: ShieldCheck,
        habitTitle: 'Pocket Separation',
        habitStat: '+' + formatMoney(displaySaved),
        habitLabel: 'Shielded business liquidity',
        habitDesc: 'You strictly transferred transport expenses to isolated digital logs, preventing personal daily withdrawals from bleeding business capital.',
        streakDays: displayStreak,
        streakDesc: displayStreak + ' Consistency Streak',
        streakSubtitle: 'Ensuring your business capital flow remained untouched, organized, and untarnished.',
        imageAlt: 'A refined gold wireframe graphic representing business inventory cycles'
      };
    } else {
      // Emeka Obi or salaried default
      const displaySaved = computedSavedAmount * 2.8;
      const displayHours = (computedDelayHours * 1.1).toFixed(1) + ' Hours';
      const displayStreak = (computedStreakDays + 7) + ' Days';

      return {
        month: 'October 2023',
        tagline: 'The Long Game Focus',
        headline: 'Your focus shifted to the long game.',
        summary: 'A month of quiet discipline and intentional choices. You\'re building more than just numbers; you\'re creating a structured foundation for high-end peace of mind.',
        archetypeTitle: 'The Strategist 🛡️',
        archetypeDesc: '"This month, you didn\'t just spend; you designed. Every transaction was a brick in a foundation you\'re laying for a future self. You prioritize structure over spontaneity, and harmony over haste."',
        delayHours: displayHours,
        delayDesc: 'Average decision pause time',
        delayReduction: computedImpulseReduction + '% Impulse Reduction',
        delayStatsText: 'You waited an average of ' + displayHours + ' before major discretionary weekend outlays, dodging heavy emotional transactions.',
        habitIcon: Utensils,
        habitTitle: 'Mindful Meals',
        habitStat: '+' + formatMoney(displaySaved),
        habitLabel: 'Saved for your Deposit Fund',
        habitDesc: 'You cooked at home and brought meals to the office more than last month. This single shift accelerated your savings timeline significantly.',
        streakDays: displayStreak,
        streakDesc: displayStreak + ' Savings Streak',
        streakSubtitle: 'Consistency is the architect of wealth. You didn\'t miss a single day of logging physical cash or micro-savings.',
        imageAlt: 'Ethereal blueprint artwork of architectural structures floating in dark space made of silver and sapphire vectors'
      };
    }
  };

  const info = getReflectionData();
  const HabitIcon = info.habitIcon;

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12 px-2 sm:px-0">
      {/* 1. HEADER SECTION */}
      <section className="text-center space-y-3 pt-4">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono font-bold uppercase tracking-[0.25em] text-accent-gold"
        >
          {info.month} • Private Wealth Audit Reflection
        </motion.p>
        
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-2xl md:text-3xl font-semibold tracking-tight text-text-primary uppercase"
        >
          {info.headline}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm max-w-2xl mx-auto leading-relaxed text-text-secondary font-mono"
        >
          {info.summary}
        </motion.p>
      </section>

      {/* 2. BENTO GRID OF REFLECTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch w-full">
        
        {/* Impulse Control Card (7 columns) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-7 p-6 bg-surface-1 border border-border rounded-lg flex flex-col justify-between overflow-hidden relative"
        >
          <div className="absolute -top-10 -right-10 opacity-5 pointer-events-none">
            <Timer className="w-40 h-40 text-text-primary" />
          </div>

          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-2 text-accent-gold">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Impulse Strategy</span>
            </div>
            
            <div className="space-y-1">
              <h3 className="text-sm font-semibold font-mono uppercase tracking-widest text-text-primary">
                The Decision Delay Rule
              </h3>
              <p className="text-[11px] leading-relaxed text-text-secondary font-mono">
                You paused an average of <span className="text-accent-gold font-bold font-mono">{info.delayHours}</span> before major discretionary transactions, enabling cognitive cooling to work its magic.
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-[9px] font-mono text-text-muted block uppercase font-bold tracking-widest">Behavior Shift Outcome</span>
              <span className="text-lg font-bold font-mono text-accent-gold tabular-nums block">{info.delayReduction}</span>
              <p className="text-[10px] text-text-muted font-mono mt-0.5 max-w-[240px] leading-relaxed uppercase tracking-wider">
                {info.delayStatsText}
              </p>
            </div>

            {/* Custom stylized bars mimicking mockup (Gold/Border themed) */}
            <div className="h-14 w-28 flex items-end gap-1 px-1 shrink-0">
              <div className="flex-1 bg-border h-[30%] rounded-xs" />
              <div className="flex-1 bg-border h-[50%] rounded-xs" />
              <div className="flex-1 bg-border h-[40%] rounded-xs" />
              <div className="flex-1 bg-accent-gold h-[85%] rounded-xs animate-pulse" />
              <div className="flex-1 bg-border h-[60%] rounded-xs" />
              <div className="flex-1 bg-border h-[45%] rounded-xs" />
            </div>
          </div>
        </motion.div>

        {/* The Custom Habit Card (5 columns) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-5 p-6 bg-surface-1 border border-border border-l-4 border-l-accent-gold rounded-lg flex flex-col justify-between relative overflow-hidden"
        >
          {/* Subtle mesh/shimmer light block */}
          <div className="absolute inset-0 bg-gradient-to-tr from-accent-gold/5 to-transparent pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-accent-gold">
              <HabitIcon size={16} />
              <span className="text-[10px] font-mono uppercase tracking-widest font-bold">{info.habitTitle}</span>
            </div>

            <div className="py-1">
              <span className="text-2xl font-bold font-mono tracking-tight text-accent-gold block tabular-nums">{info.habitStat}</span>
              <span className="text-[10px] font-mono uppercase font-bold text-text-muted tracking-widest">
                {info.habitLabel}
              </span>
            </div>
          </div>

          <div className="mt-6 relative z-10 font-mono text-[10.5px] uppercase tracking-wider text-text-secondary leading-relaxed">
            <p>{info.habitDesc}</p>
          </div>
        </motion.div>

        {/* Consistency Streak Card (Full-width grid celebrate) */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="md:col-span-12 p-6 md:p-8 bg-surface-1 border border-border rounded-lg overflow-hidden relative"
        >
          <div className="grid md:grid-cols-12 items-center gap-6 md:gap-8 w-full">
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-accent-gold">
                <Award size={16} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Unbroken Momentum</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg md:text-xl font-bold font-mono tracking-widest text-text-primary uppercase">
                  {info.streakDesc}
                </h3>
                <p className="text-[11px] leading-relaxed md:text-xs text-text-secondary font-mono uppercase tracking-wide">
                  {info.streakSubtitle} Consistency is the ultimate architect of multi-generational wealth. By locking down micro-contributions, you cultivate an active relationship with accumulation.
                </p>
              </div>

              <div className="pt-2 flex flex-wrap gap-2">
                <button className="btn-primary px-4 py-2 text-[10px] font-mono">
                  <Share2 size={11} /> SHARE PROGRESS
                </button>
                <button className="btn-secondary px-4 py-2 text-[10px] font-mono">
                  DOWNLOAD BADGE
                </button>
              </div>
            </div>

            {/* Abstract radial animation grid representing streak */}
            <div className="md:col-span-5 flex justify-center relative select-none">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-dashed border-accent-gold/20 animate-[spin_40s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-accent-gold/10 animate-[spin_25s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full border border-dashed border-border animate-[spin_50s_linear_infinite]" />
                
                <div className="text-center z-10">
                  <span className="block text-4xl font-bold font-mono text-accent-gold leading-none tabular-nums">{info.streakDays.split(' ')[0]}</span>
                  <span className="block text-[8px] font-mono text-text-muted uppercase tracking-widest mt-1.5 font-bold">STREAK DAYS</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Financial Soul Archetype Card */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="md:col-span-12 p-6 md:p-8 bg-surface-1 border border-border rounded-lg overflow-hidden relative flex flex-col justify-between"
        >
          {/* Subtle elegant glowing blob to represent AI soul art */}
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-48 bg-gradient-to-tr from-accent-gold/5 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="grid md:grid-cols-12 gap-6 relative z-10 items-center w-full">
            <div className="md:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-accent-gold">
                <Compass size={16} />
                <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Your Financial Soul</span>
              </div>

              <h2 className="text-lg md:text-xl font-bold font-mono uppercase tracking-widest text-text-primary">
                {info.archetypeTitle}
              </h2>

              <p className="text-xs md:text-sm leading-relaxed italic text-text-secondary font-mono">
                {info.archetypeDesc}
              </p>
            </div>

            <div className="md:col-span-4 flex md:justify-end">
              <div className="p-4 rounded border border-border bg-surface-2 flex flex-col items-center w-full md:w-44 text-center">
                <span className="text-[8px] font-mono text-text-muted uppercase tracking-widest font-bold">Active Resonance</span>
                <span className="text-lg font-bold font-mono text-accent-gold mt-1 uppercase">94% Align</span>
                <span className="text-[8px] text-text-muted font-mono mt-1 leading-none uppercase">UPDATED SUNDAYS</span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
