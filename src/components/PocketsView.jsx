import React from 'react';
import { Banknote, BookOpen, Brain, Activity } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import PoolCard from './PoolCard';

export default function PocketsView({
  manualWithdrawAmount,
  setManualWithdrawAmount,
  handleManualWithdrawal,
  activePoolList,
  handleLogCashExpense,
  user,
  theme,
  formatMoney
}) {
  const isDark = theme === 'dark';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start px-2 sm:px-0">
      
      {/* LEFT COLUMN: MANUAL CASH WITHDRAWAL INJECTION & SCIENCE EXPLANATION (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* LOG MANUAL WITHDRAWAL (CASH OUT) */}
        <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-semibold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
            <Banknote size={13} className="text-accent-gold" /> Record Physical Cash Out
          </h4>
          <p className="text-[10px] font-mono leading-relaxed text-text-muted uppercase tracking-wider">
            Establishing a physical cash out allows FinI to create a probabilistic cash pool that decays organically as time ticks.
          </p>
          <form onSubmit={handleManualWithdrawal} className="flex gap-2 mt-1">
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-xs font-mono text-text-muted">₦</span>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={manualWithdrawAmount}
                onChange={(e) => setManualWithdrawAmount(e.target.value)}
                className="w-full border border-border bg-surface-3 rounded py-1.5 pl-7 pr-3 text-xs font-mono text-text-primary outline-hidden focus:border-accent-gold"
                required
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-4 py-1.5 text-xs font-mono shrink-0"
            >
              LOG CASH
            </button>
          </form>
        </div>

        {/* POCKET SCIENCE EDUCATION FOOTER PANEL */}
        <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-4">
          <h4 className="text-xs font-semibold font-mono uppercase tracking-widest text-text-primary">
            Scientific Cash Auditing Framework
          </h4>
          
          <div className="flex flex-col gap-4 text-[10.5px] leading-relaxed font-mono text-text-secondary uppercase tracking-wider">
            <div className="flex gap-3 items-start">
              <BookOpen size={14} className="text-accent-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-text-primary">Smart Decay Mechanics</strong>
                <p className="text-text-muted mt-1 normal-case leading-relaxed font-mono">Physical cash out creates confidence pools that lose fidelity automatically over time to account for minor unlogged spent items like transport or tips.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start border-t pt-3.5 border-border/40">
              <Brain size={14} className="text-accent-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-text-primary">Auto-Learned Habits</strong>
                <p className="text-text-muted mt-1 normal-case leading-relaxed font-mono">Custom categorization tag actions teach FinI your spending patterns. Matching transactions are allocated automatically to optimize reporting speeds.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start border-t pt-3.5 border-border/40">
              <Activity size={14} className="text-accent-gold shrink-0 mt-0.5" />
              <div>
                <strong className="text-text-primary">Dynamic Pattern Warnings</strong>
                <p className="text-text-muted mt-1 normal-case leading-relaxed font-mono">Audits verified bank ledger items against routine patterns and schedule limits, flagging anomalous debit feeds for instant manual verification.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* RIGHT COLUMN: ACTIVE CASH POOLS CARDS (7 cols) */}
      <div className="lg:col-span-7 p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-4 w-full">
        <div className="border-b pb-3 border-border flex justify-between items-center">
          <div>
            <h3 className="text-xs font-semibold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
              <Banknote size={13} className="text-accent-gold" /> Active Cash Pools
            </h3>
            <p className="text-[10px] font-mono mt-0.5 text-text-muted uppercase tracking-wider">Organically decaying physical pockets</p>
          </div>
          <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest font-bold">
            {activePoolList.length} Active Pools
          </span>
        </div>

        {/* POOLS ITERATION GRID */}
        <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {activePoolList.length > 0 ? (
              activePoolList.map(pool => (
                <PoolCard
                  key={pool.id}
                  pool={pool}
                  onLogExpense={handleLogCashExpense}
                  currency={user.settings.currency}
                  theme={theme}
                />
              ))
            ) : (
              <div className="p-10 rounded border border-border bg-surface-2 text-center flex flex-col items-center gap-3">
                <Banknote className="text-text-muted" size={32} />
                <p className="text-xs font-mono font-bold text-text-primary uppercase tracking-wider">
                  No active pocket cash pools detected
                </p>
                <p className="text-[10px] font-mono max-w-sm leading-relaxed text-text-muted uppercase tracking-widest">
                  Recording cashouts or answering transfer allocation alerts generates physical cash pools that decay organically over time.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
