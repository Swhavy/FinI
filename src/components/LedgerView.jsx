import React, { useState } from 'react';
import { 
  Wallet, Plus, Tag, ArrowDownRight, ArrowUpLeft, 
  Search, Landmark, CalendarRange, CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LedgerView({
  bankFilter,
  setBankFilter,
  bankAccounts,
  activeDatePreset,
  applyDatePreset,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  setActiveDatePreset,
  transactions,
  txAmount,
  setTxAmount,
  txType,
  setTxType,
  txChannel,
  setTxChannel,
  selectedTxBankId,
  setSelectedTxBankId,
  txNarration,
  setTxNarration,
  handleAddTransaction,
  handleCategorizeTx,
  handleAnswerP2PCash,
  formatMoney,
  theme
}) {
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter local transactions dynamically
  const filteredTxs = transactions.filter(tx => {
    const matchesBank = bankFilter === 'all' || tx.accountId === bankFilter;
    const matchesSearch = tx.narration.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (tx.category && tx.category.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || (tx.category && tx.category.toLowerCase() === categoryFilter.toLowerCase());
    return matchesBank && matchesSearch && matchesCategory;
  });

  // Extract all active categories
  const categoriesList = ['all', 'food', 'bills', 'entertainment', 'transport', 'inventory', 'income'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start px-2 sm:px-0">
      
      {/* LEFT COLUMN: CONTROLS & ADD TRANSACTION FORMS (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* BANK ACCOUNT & DATE FILTER MODULE */}
        <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-4">
          {/* Bank selection */}
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-muted font-bold">
              <Landmark size={12} className="text-accent-gold" /> Connected Bank Filters
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setBankFilter('all')}
                className={`px-3 py-1.5 rounded font-mono text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                  bankFilter === 'all'
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                COMBINED
              </button>
              {bankAccounts.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBankFilter(b.id)}
                  className={`px-3 py-1.5 rounded font-mono text-[11px] font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
                    bankFilter === b.id
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  {b.institution.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range controls */}
          <div className="flex flex-col gap-2 border-t pt-3 border-border/40">
            <label className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-muted font-bold">
              <CalendarRange size={12} className="text-accent-gold" /> Date-Range Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={activeDatePreset}
                onChange={(e) => applyDatePreset(e.target.value)}
                className="w-full border border-border bg-surface-3 rounded px-3 py-1.5 text-xs text-text-secondary focus:border-accent-gold outline-hidden"
              >
                <option value="all">📅 All Time</option>
                <option value="7d">📅 Last 7 Days</option>
                <option value="30d">📅 Last 30 Days</option>
                <option value="this_month">📅 This Month (July)</option>
              </select>
 
              <div className="flex gap-1.5 items-center border border-border rounded px-2.5 py-1.5 bg-surface-3 w-full">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActiveDatePreset('custom');
                  }}
                  className="bg-transparent text-[10px] font-mono min-w-0 flex-1 outline-hidden text-text-secondary"
                  title="Start Date"
                />
                <span className="text-[10px] font-mono text-text-muted">-</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActiveDatePreset('custom');
                  }}
                  className="bg-transparent text-[10px] font-mono min-w-0 flex-1 outline-hidden text-text-secondary"
                  title="End Date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* LOG MOCK BANK RUN (TRANSACTION INJECTION) */}
        <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-semibold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
            <Plus size={13} className="text-accent-gold" /> Log Mock Bank Run
          </h4>
          <form onSubmit={handleAddTransaction} className="flex flex-col gap-3 mt-1">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Amount (₦)</label>
                <input
                  type="number"
                  placeholder="Amount"
                  value={txAmount}
                  onChange={(e) => setTxAmount(e.target.value)}
                  className="w-full border border-border bg-surface-3 rounded py-1.5 px-3 text-xs font-mono text-text-primary outline-hidden focus:border-accent-gold"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Type</label>
                <select
                  value={txType}
                  onChange={(e) => setTxType(e.target.value)}
                  className="w-full border border-border bg-surface-3 rounded py-1.5 px-2 text-xs text-text-secondary outline-hidden focus:border-accent-gold"
                >
                  <option value="debit">Debit (Spent)</option>
                  <option value="credit">Credit (Inflow)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Channel</label>
                <select
                  value={txChannel}
                  onChange={(e) => setTxChannel(e.target.value)}
                  className="w-full border border-border bg-surface-3 rounded py-1.5 px-2 text-xs text-text-secondary outline-hidden focus:border-accent-gold"
                >
                  <option value="pos">POS Terminal</option>
                  <option value="transfer">Bank Transfer</option>
                  <option value="atm">ATM Cash Out</option>
                  <option value="bills">Utility / Bills</option>
                </select>
              </div>
              <div>
                <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Target Bank</label>
                <select
                  value={selectedTxBankId}
                  onChange={(e) => setSelectedTxBankId(e.target.value)}
                  className="w-full border border-border bg-surface-3 rounded py-1.5 px-2 text-xs font-mono text-text-secondary outline-hidden focus:border-accent-gold"
                  required
                >
                  {bankAccounts.map(b => (
                    <option key={b.id} value={b.id}>{b.institution.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-mono uppercase tracking-widest text-text-muted mb-1">Narration / Vendor</label>
              <input
                type="text"
                placeholder="e.g. SHOPRITE IKEJA"
                value={txNarration}
                onChange={(e) => setTxNarration(e.target.value)}
                className="w-full border border-border bg-surface-3 rounded py-1.5 px-3 text-xs uppercase font-mono text-text-primary outline-hidden focus:border-accent-gold"
                required
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 font-mono text-xs"
            >
              INSERT BANK RUN
            </button>
          </form>
        </div>

        {/* PENDING AUDITS MODULE */}
        {transactions.some(t => !t.category) && (
          <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-3">
            <h4 className="text-xs font-semibold font-mono text-accent-gold uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={13} /> Pending Private Allocations
            </h4>
            <div className="flex flex-col gap-3 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
              {transactions.filter(t => !t.category).slice(0, 3).map(tx => (
                <div key={tx.id} className="p-4 rounded border border-border bg-surface-2 flex flex-col gap-3 text-xs">
                  <div className="flex justify-between items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <span className="font-mono font-bold block truncate text-text-primary uppercase">
                        {tx.narration}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted block mt-0.5 tabular-nums">
                        Amount: {formatMoney(tx.amount)}
                      </span>
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded uppercase border border-border text-text-muted bg-surface-3 tracking-wider font-bold shrink-0">
                      UNALLOCATED
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Tags Buttons */}
                    <div className="flex flex-wrap gap-1">
                      {['food', 'bills', 'entertainment', 'transport', 'inventory'].map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => handleCategorizeTx(tx.id, cat)}
                          className="text-[9px] px-2 py-1 rounded font-mono uppercase tracking-wider cursor-pointer border border-border bg-surface-3 hover:border-accent-gold text-text-secondary hover:text-text-primary transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* Custom text tag */}
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const val = e.target.elements[`custom_${tx.id}`].value.trim();
                        if (val) {
                          handleCategorizeTx(tx.id, val.toLowerCase());
                          e.target.reset();
                        }
                      }}
                      className="flex gap-1"
                    >
                      <input
                        name={`custom_${tx.id}`}
                        type="text"
                        placeholder="CUSTOM TAG (E.G. RENT)..."
                        className="flex-1 rounded border border-border bg-surface-3 px-2 py-1 text-[10px] uppercase font-mono text-text-primary focus:border-accent-gold"
                      />
                      <button
                        type="submit"
                        className="btn-primary px-3 text-[10px] font-mono shrink-0 py-1"
                      >
                        SAVE
                      </button>
                    </form>

                    {/* Cash P2P converter */}
                    {tx.channel === 'transfer' && tx.recipientType === 'individual' && (
                      <div className="p-3 rounded border border-border bg-surface-3 text-[10px] flex flex-col gap-1.5 mt-1.5">
                        <span className="font-mono text-text-secondary uppercase tracking-wider font-semibold">CONVERT TO PHYSICAL CASH OUT?</span>
                        <div className="flex gap-2 mt-0.5">
                          <button 
                            type="button"
                            onClick={() => handleAnswerP2PCash(tx.id, true)}
                            className="bg-accent-gold hover:bg-accent-gold-dim text-surface-1 font-bold font-mono text-[9px] px-2.5 py-1 rounded cursor-pointer transition-colors"
                          >
                            WITHDRAW CASH
                          </button>
                          <button 
                            type="button"
                            onClick={() => handleAnswerP2PCash(tx.id, false)}
                            className="bg-surface-2 border border-border text-text-secondary font-bold font-mono text-[9px] px-2.5 py-1 rounded cursor-pointer hover:text-text-primary transition-colors"
                          >
                            KEEP IN LEDGER
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* RIGHT COLUMN: VERIFIED TRANSACTIONS LIST TABLE (7 cols) */}
      <div className="lg:col-span-7 p-6 bg-surface-1 border border-border rounded-lg flex flex-col gap-4 overflow-hidden w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-3 border-border">
          <div>
            <h3 className="text-xs font-semibold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
              <Wallet size={13} className="text-accent-gold" /> Private Ledger Streams
            </h3>
            <p className="text-[10px] font-mono mt-0.5 text-text-muted uppercase tracking-wider">Verified bank activity and asset ledger</p>
          </div>
          <span className="text-[9px] font-mono text-text-muted uppercase tracking-widest font-bold">
            {filteredTxs.length} Records found
          </span>
        </div>

        {/* Search and Category Quick Filters */}
        <div className="flex flex-col gap-3 w-full">
          {/* Search bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 text-text-muted" size={14} />
            <input
              type="text"
              placeholder="SEARCH LEDGER BY NARRATION OR TAGS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-border bg-surface-2 py-2 pl-9 pr-4 text-xs font-mono text-text-primary placeholder:text-text-muted focus:border-accent-gold"
            />
          </div>

          {/* Quick Categories filter */}
          <div className="flex flex-wrap gap-1">
            {categoriesList.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`text-[9px] font-mono uppercase px-2.5 py-1 rounded border font-bold tracking-widest transition-colors cursor-pointer ${
                  categoryFilter === cat
                    ? 'btn-primary'
                    : 'btn-secondary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* LEDGER LIST ROWS */}
        <div className="flex flex-col gap-2.5 max-h-[500px] overflow-y-auto pr-1 no-scrollbar w-full overflow-x-hidden">
          {filteredTxs.length > 0 ? (
            filteredTxs.map(tx => (
              <div key={tx.id} className="p-3.5 rounded border border-border bg-surface-2 flex items-center justify-between gap-4 transition-colors hover:border-accent-gold/40 w-full overflow-hidden">
                <div className="flex items-center gap-3 shrink-0 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${
                    tx.type === 'credit' 
                      ? 'bg-accent-forest text-accent-gold border border-border' 
                      : 'bg-surface-3 text-text-muted border border-border'
                  }`}>
                    {tx.type === 'credit' ? <ArrowDownRight size={15} /> : <ArrowUpLeft size={15} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="font-mono font-bold text-text-primary uppercase truncate leading-tight">
                      {tx.narration}
                    </h5>
                    <span className="text-[9px] text-text-muted font-mono block mt-0.5 uppercase tracking-wider">
                      {new Date(tx.createdAt).toLocaleDateString()} • {tx.channel.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex flex-col items-end gap-1.5 ml-2">
                  <span className={`font-mono font-bold text-xs tabular-nums ${
                    tx.type === 'credit' ? 'text-accent-gold' : 'text-danger-copper'
                  }`}>
                    {tx.type === 'credit' ? '+' : '-'}{formatMoney(tx.amount)}
                  </span>
                  {tx.category ? (
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-bold border border-border bg-surface-3 text-text-muted tracking-wider">
                      {tx.category}
                    </span>
                  ) : (
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-mono uppercase font-bold bg-surface-3 text-accent-gold border border-border tracking-wider">
                      Unallocated
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-text-muted italic text-center py-10 font-mono uppercase tracking-wider">No matching verified bank ledger entries found</p>
          )}
        </div>
      </div>

    </div>
  );
}
