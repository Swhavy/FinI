import React from 'react';
import { Landmark, Brain, ShieldAlert, Key, User, Check } from 'lucide-react';

export default function SettingsView({
  user,
  availableUsers,
  switchProfile,
  companionKey,
  handleClearKey,
  tempKey,
  setTempKey,
  showKeyForm,
  setShowKeyForm,
  handleSaveKey,
  setMonoOnboardingUser,
  setMonoStep,
  setMonoBankIndex,
  setMonoUsername,
  setMonoPassword,
  setMonoOtp,
  mockUsers, // Pass mockUsers explicitly from parent App
  theme
}) {
  const isDark = theme === 'dark';
  const activeMockUser = mockUsers.find(u => u.id === user.id) || mockUsers[0];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start animate-in fade-in duration-300 px-2 sm:px-0">
      
      {/* LEFT COLUMN: SECURITY CONTROLS & API KEYS (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* CUSTOM SECURE COMPANION KEY CARD */}
        <div className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 border-b pb-3 border-border/40">
            <h4 className="text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
              <Key size={13} className="text-accent-gold" /> Private AI Core Token
            </h4>
            <p className="text-[10px] font-mono text-text-muted uppercase tracking-wider">Set custom LLM capabilities & secure prompts</p>
          </div>

          <div>
            {companionKey ? (
              <div className="flex flex-col gap-3 p-4 rounded bg-surface-2 border border-accent-gold/30 text-accent-gold">
                <div className="flex items-center gap-2">
                  <Brain size={14} />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Sovereign Key Active</span>
                </div>
                <button 
                  onClick={handleClearKey}
                  className="text-[9px] font-mono uppercase tracking-widest font-bold underline hover:text-danger-copper cursor-pointer self-start"
                >
                  Deauthorize key
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 border border-border p-3.5 rounded bg-surface-2 text-text-secondary">
                  <ShieldAlert size={14} className="text-accent-gold" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-widest">Standard Offline AI Engine Active</span>
                </div>

                {!showKeyForm ? (
                  <button 
                    onClick={() => {
                      setTempKey('');
                      setShowKeyForm(true);
                    }}
                    className="btn-secondary text-[10px] font-mono tracking-widest font-bold uppercase py-2 w-full"
                  >
                    Authorize custom Fireworks Key
                  </button>
                ) : (
                  <form onSubmit={handleSaveKey} className="p-4 rounded border border-border bg-surface-2 flex flex-col gap-3">
                    <label className="text-[9px] font-mono uppercase text-text-muted tracking-widest block font-bold">Fireworks API Key</label>
                    <input
                      type="password"
                      placeholder="fw_..."
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      className="w-full rounded border border-border bg-surface-3 py-1.5 px-3 text-xs font-mono text-text-primary outline-hidden"
                      required
                    />
                    <div className="flex justify-end gap-2 text-[10px]">
                      <button 
                        type="button" 
                        onClick={() => setShowKeyForm(false)} 
                        className="px-2 py-1 font-mono uppercase tracking-widest text-text-muted hover:text-text-primary font-bold"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        className="btn-primary px-3 py-1 text-[10px] font-mono"
                      >
                        SAVE KEY
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* BANK CONNECTION RE-LINK TRIGGER CARD */}
        <div className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col gap-3">
          <h4 className="text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
            <Landmark size={13} className="text-accent-gold" /> Account Connection Feeds
          </h4>
          <p className="text-[10.5px] font-mono leading-relaxed text-text-secondary uppercase tracking-wider">
            Re-link your financial feeds using the secure Mono simulation gateway to reset start ledger values.
          </p>
          <button 
            type="button"
            onClick={() => {
              const currentMockUser = mockUsers.find(u => u.id === user.id) || mockUsers[0];
              setMonoOnboardingUser(currentMockUser);
              setMonoStep('intro');
              setMonoBankIndex(0);
              setMonoUsername(currentMockUser.displayName.toLowerCase().replace(/\s+/g, '_') + '_mono');
              setMonoPassword('••••••••');
              setMonoOtp('');
            }}
            className="btn-secondary flex items-center justify-center gap-2 py-2 text-[10px] font-mono uppercase font-bold tracking-widest w-full"
          >
            <Landmark size={12} className="text-accent-gold" /> Re-link Mono Feeds
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: HIGH-FIDELITY USER PROFILE SWITCHER (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* PREMIUM ACTIVE USER PORTRAIT BANNED CARD */}
        <div className="p-6 bg-surface-1 border border-border rounded-lg flex flex-col sm:flex-row items-center gap-6">
          {activeMockUser.avatarUrl ? (
            <img 
              src={activeMockUser.avatarUrl} 
              alt={user.displayName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded object-cover border-2 border-accent-gold shrink-0"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded bg-surface-2 border border-border flex items-center justify-center text-accent-gold text-2xl font-mono font-bold shrink-0">
              {user.displayName.charAt(0)}
            </div>
          )}
          
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-text-primary">{user.displayName}</h3>
              <span className="text-[8px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-widest bg-surface-3 text-accent-gold border border-accent-gold/25 self-center">
                {user.profile.userType}
              </span>
            </div>
            
            <p className="text-[10px] font-mono leading-relaxed text-text-secondary uppercase tracking-wider">
              <strong>Active Goal:</strong> {user.profile.goals.map(g => g.replace(/_/g, ' ')).join(' • ')}
            </p>
            
            {user.profile.learnedPersonality && (
              <div className="mt-2 p-2.5 rounded bg-surface-2 border border-border text-[10px] font-mono leading-relaxed flex items-start gap-2 text-text-secondary uppercase tracking-wider">
                <span className="shrink-0 text-accent-gold font-bold">💡</span>
                <span>{user.profile.learnedPersonality}</span>
              </div>
            )}
          </div>
        </div>

        {/* SIMULATOR SWITCHER CARD */}
        <div className="p-5 bg-surface-1 border border-border rounded-lg flex flex-col gap-4">
          <div className="border-b pb-3 border-border/40 flex justify-between items-center">
            <div>
              <h3 className="text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
                <User size={13} className="text-accent-gold" /> Simulate Sandbox Profiles
              </h3>
              <p className="text-[10px] font-mono mt-0.5 text-text-muted uppercase tracking-wider">Switch sandbox profiles to audit custom personality patterns</p>
            </div>
            <span className="text-[8px] font-mono text-accent-gold uppercase tracking-widest font-bold">Sandbox Active</span>
          </div>

          {/* SWITCH ACTIVE USERS CONTAINER */}
          <div className="flex flex-col gap-3">
            {availableUsers.map((avUser) => {
              const isCurrent = avUser.id === user.id;
              const mockDetail = mockUsers.find(mu => mu.id === avUser.id) || {};
              
              return (
                <div 
                  key={avUser.id}
                  onClick={() => !isCurrent && switchProfile(avUser.id)}
                  className={`p-4 rounded border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent 
                      ? 'bg-surface-2 border-accent-gold/40 shadow-none'
                      : 'bg-surface-2/60 border-border hover:border-accent-gold/30 cursor-pointer'
                  }`}
                >
                  <div className="flex gap-3 items-start min-w-0">
                    {mockDetail.avatarUrl ? (
                      <img 
                        src={mockDetail.avatarUrl} 
                        alt={avUser.displayName}
                        className="w-8 h-8 rounded object-cover shrink-0 border border-border"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-surface-3 border border-border text-accent-gold">
                        {avUser.displayName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="font-mono font-bold text-xs text-text-primary uppercase tracking-wide">
                          {avUser.displayName}
                        </h5>
                        <span className="text-[8px] px-1.5 py-0.25 rounded font-mono uppercase border font-bold bg-surface-3 text-text-muted border-border tracking-wider">
                          {avUser.profile.userType}
                        </span>
                      </div>
                      <p className="text-[9px] font-mono text-text-muted mt-1 leading-relaxed uppercase tracking-wider">
                        <strong>Audit Target:</strong> {avUser.profile.goals[0]?.replace(/_/g, ' ') || 'Budget Runs'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 md:self-center self-end">
                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[9px] font-mono font-bold text-accent-gold bg-accent-gold/10 border border-accent-gold/20 px-2 py-0.5 rounded-xs uppercase tracking-widest">
                        <Check size={10} /> Active Profile
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-text-muted uppercase hover:text-accent-gold transition-colors font-bold tracking-widest">
                        Switch Profile →
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}
