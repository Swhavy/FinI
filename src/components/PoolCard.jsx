import React, { useState } from 'react';
import { Calendar, Trash2, Tag, AlertCircle, Plus, DollarSign, Coins } from 'lucide-react';
import { motion } from 'motion/react';

export default function PoolCard({ pool, onLogExpense, currency = 'NGN' }) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseNarration, setExpenseNarration] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('food');

  const confidencePercent = Math.round(pool.confidence * 100);

  // Formatting currency
  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleExpenseSubmit = (e) => {
    e.preventDefault();
    if (!expenseAmount || !expenseNarration) return;
    onLogExpense(pool.id, {
      amount: parseFloat(expenseAmount),
      narration: expenseNarration,
      category: expenseCategory
    });
    setExpenseAmount('');
    setExpenseNarration('');
    setShowLogForm(false);
  };

  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidencePercent / 100) * circumference;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="relative bg-surface-1 border border-border rounded-lg p-6 flex flex-col gap-6 overflow-hidden shadow-none"
    >
      {/* 2px Gold top border ONLY for Executive/Primary cards */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent-gold" />

      {/* Cash Confidence Circular progress ring gauge */}
      <div className="relative w-24 h-24 mx-auto flex items-center justify-center mt-2">
        <svg className="w-full h-full transform -rotate-90">
          {/* Base circle background representing border color */}
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="var(--border)"
            fill="transparent"
            strokeWidth="4"
          />
          {/* Active Sovereign Gold progress circle that fades as confidence drops */}
          <motion.circle
            cx="48"
            cy="48"
            r={radius}
            fill="transparent"
            stroke="var(--accent-gold)"
            strokeWidth="4"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ opacity: Math.max(0.15, pool.confidence) }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-semibold font-mono text-text-primary tabular-nums tracking-tight">
            {confidencePercent}
          </span>
          <span className="text-[7px] font-mono tracking-widest uppercase text-text-muted">
            CONFIDENCE
          </span>
        </div>
      </div>

      {/* Financial Figure Details */}
      <div className="text-center space-y-1.5">
        <div 
          className="text-2xl font-semibold text-text-primary tracking-tight tabular-nums transition-opacity duration-300"
          style={{ opacity: Math.max(0.4, pool.confidence) }}
        >
          {formatMoney(pool.amount)}
        </div>
        <div className="flex justify-center">
          <span className="data-label text-[9px] px-2.5 py-0.5 rounded bg-surface-2 border border-border uppercase tracking-widest text-accent-gold font-bold">
            {pool.status}
          </span>
        </div>
        <div className="text-[10px] font-mono text-text-muted uppercase tracking-wider space-y-0.5">
          <div>SOURCE: {pool.source.replace('_', ' ')}</div>
          <div>WITHDRAWN: {new Date(pool.createdAt).toLocaleDateString()}</div>
        </div>
      </div>

      {/* Cash Spend Ledger */}
      <div className="space-y-3 pt-3 border-t border-border/40">
        <div className="flex justify-between items-center text-xs">
          <span className="data-label uppercase tracking-widest font-semibold text-[10px] text-text-muted">CASH SPEND LEDGER</span>
          {!pool.closedAt && (
            <button
              onClick={() => setShowLogForm(!showLogForm)}
              className="flex items-center gap-1 text-[11px] text-accent-gold hover:text-accent-gold-dim font-semibold transition-colors cursor-pointer uppercase tracking-wider"
            >
              <Plus size={12} /> LOG EXPENSE
            </button>
          )}
        </div>

        {/* Expenses List */}
        {pool.expenses && pool.expenses.length > 0 ? (
          <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto pr-1">
            {pool.expenses.map((exp) => (
              <div 
                key={exp.id} 
                className="flex justify-between items-center text-xs py-2 px-3 rounded bg-surface-2 border border-border text-text-secondary transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">{exp.narration}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] uppercase font-mono bg-surface-3 text-text-muted border border-border">
                    {exp.category}
                  </span>
                </div>
                <span className="font-mono text-text-primary tabular-nums">-{formatMoney(exp.amount)}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-text-muted italic py-1 font-mono text-center">No physical expenses logged yet</p>
        )}
      </div>

      {/* Form to log cash expense */}
      {showLogForm && (
        <form onSubmit={handleExpenseSubmit} className="p-4 rounded bg-surface-2 border border-border flex flex-col gap-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Amount</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-xs font-mono text-text-muted">₦</span>
                <input
                  type="number"
                  placeholder="2000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full border border-border bg-surface-3 rounded py-1.5 pl-6 pr-2 text-xs font-mono text-text-primary outline-hidden focus:border-accent-gold"
                  required
                />
              </div>
            </div>
            <div className="w-1/3">
              <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Category</label>
              <select
                value={expenseCategory}
                onChange={(e) => setExpenseCategory(e.target.value)}
                className="w-full border border-border bg-surface-3 rounded py-1.5 px-2 text-xs text-text-secondary focus:border-accent-gold"
              >
                <option value="food">Food</option>
                <option value="transport">Transport</option>
                <option value="inventory">Inventory</option>
                <option value="bills">Bills</option>
                <option value="entertainment">Fun</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Description</label>
            <input
              type="text"
              placeholder="Danfo bus fare / Mama Put lunch"
              value={expenseNarration}
              onChange={(e) => setExpenseNarration(e.target.value)}
              className="w-full border border-border bg-surface-3 rounded py-1.5 px-3 text-xs text-text-primary focus:border-accent-gold"
              required
            />
          </div>
          <div className="flex justify-end gap-2 text-xs mt-1">
            <button
              type="button"
              onClick={() => setShowLogForm(false)}
              className="btn-ghost px-2.5 py-1 text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-3.5 py-1 text-xs"
            >
              Log Expense
            </button>
          </div>
        </form>
      )}

      {/* Close Indicator */}
      {pool.closedAt && (
        <div className="flex items-center gap-1 text-[10px] text-danger-copper font-mono uppercase tracking-wider justify-center mt-1 pt-2 border-t border-border/20">
          <AlertCircle size={10} /> CLOSED: {pool.closedReason.replace('_', ' ')}
        </div>
      )}
    </motion.div>
  );
}
