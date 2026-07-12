import React, { useState, useEffect } from 'react';
import { 
  Wallet, Banknote, RefreshCw, AlertTriangle, CheckCircle2, 
  HelpCircle, Sparkles, Plus, ArrowDownRight, ArrowUpLeft, 
  Key, ShieldAlert, BookOpen, Brain, ListCollapse,
  Activity, Tag, Coins, LogOut, Landmark, CalendarRange, 
  Filter, ChevronRight, Check, User, Search, Sun, Moon,
  Cpu, Layers, Award, Home
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import PoolCard from './components/PoolCard';
import AgentChat from './components/AgentChat';
import DashboardView from './components/DashboardView';
import LedgerView from './components/LedgerView';
import PocketsView from './components/PocketsView';
import SettingsView from './components/SettingsView';
import AgentsHubView from './components/AgentsHubView';
import ReflectionsView from './components/ReflectionsView';
import Logo from './components/Logo';

const mockUsers = [
  {
    id: 'u_123',
    displayName: 'Chidi Okafor',
    role: 'University Student',
    avatarColor: 'from-emerald-500 to-emerald-700 text-emerald-100',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    banks: ['GTBank', 'Kuda Bank'],
    goal: 'Wants to track pocket money, understand campus feeding/transport, and curb random spend.',
    accent: 'emerald'
  },
  {
    id: 'u_456',
    displayName: 'Funmi Alao',
    role: 'Market Trader',
    avatarColor: 'from-amber-400 to-orange-600 text-amber-100',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    banks: ['Access Bank', 'Providus Bank'],
    goal: 'Runs busy wholesale operations. Needs to log physical transport carriers and separate trade flow from personal savings.',
    accent: 'amber'
  },
  {
    id: 'u_789',
    displayName: 'Emeka Obi',
    role: 'Salaried Corporate',
    avatarColor: 'from-sky-500 to-indigo-700 text-sky-100',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    banks: ['Zenith Bank', 'OPay'],
    goal: 'Receives standard monthly salaries. Needs to audit heavy weekend restaurant cash and auto-tag recurring utilities.',
    accent: 'sky'
  }
];

const BANK_DETAILS = {
  'GTBank': { name: 'GTBank', color: 'bg-[#E44C16] border-[#E44C16] text-white', accent: '#E44C16', label: 'Guaranty Trust Bank' },
  'Kuda Bank': { name: 'Kuda Bank', color: 'bg-[#401964] border-[#401964] text-white', accent: '#401964', label: 'Kuda Microfinance' },
  'Access Bank': { name: 'Access Bank', color: 'bg-[#0A2540] border-[#0A2540] text-white', accent: '#0A2540', label: 'Access Bank plc' },
  'Providus Bank': { name: 'Providus Bank', color: 'bg-[#111111] border-[#B89745] text-[#B89745]', accent: '#111111', label: 'Providus Bank' },
  'Zenith Bank': { name: 'Zenith Bank', color: 'bg-[#E21E26] border-[#E21E26] text-white', accent: '#E21E26', label: 'Zenith Bank plc' },
  'OPay': { name: 'OPay', color: 'bg-[#00B574] border-[#00B574] text-white', accent: '#00B574', label: 'OPay Digital Services' }
};

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  // Experience states
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [splashProgress, setSplashProgress] = useState(0);

  // Mono Link Onboarding Simulation States
  const [monoOnboardingUser, setMonoOnboardingUser] = useState(null);
  const [monoStep, setMonoStep] = useState('intro'); // 'intro', 'banks', 'login', 'otp', 'success'
  const [monoBankIndex, setMonoBankIndex] = useState(0);
  const [monoUsername, setMonoUsername] = useState('');
  const [monoPassword, setMonoPassword] = useState('••••••••');
  const [monoOtp, setMonoOtp] = useState('');

  // Filtering states
  const [bankFilter, setBankFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeDatePreset, setActiveDatePreset] = useState('all');

  // Secure Companion Key state (Hiding Fireworks terminology)
  const [companionKey, setCompanionKey] = useState(() => {
    return localStorage.getItem('companion_ai_key') || '';
  });
  const [tempKey, setTempKey] = useState('');
  const [showKeyForm, setShowKeyForm] = useState(false);

  // Transaction form states
  const [txAmount, setTxAmount] = useState('');
  const [txNarration, setTxNarration] = useState('');
  const [txType, setTxType] = useState('debit');
  const [txChannel, setTxChannel] = useState('pos');
  const [txCategory, setTxCategory] = useState('');
  const [selectedTxBankId, setSelectedTxBankId] = useState('');

  // Custom Profile Creator States (Predefined choice of personalities)
  const [customName, setCustomName] = useState('');
  const [customPersonality, setCustomPersonality] = useState('student'); // 'student', 'trader', 'salaried'
  const [customPhone, setCustomPhone] = useState('');
  const [customGoals, setCustomGoals] = useState(['build_savings_habit', 'understand_spending']);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handlePersonalityChange = (type) => {
    setCustomPersonality(type);
    if (type === 'student') {
      setCustomGoals(['build_savings_habit', 'understand_spending']);
    } else if (type === 'trader') {
      setCustomGoals(['understand_spending', 'track_business_cash']);
    } else {
      setCustomGoals(['build_savings_habit', 'audit_withdrawals']);
    }
  };

  // Cash Pool withdrawal manual form
  const [manualWithdrawAmount, setManualWithdrawAmount] = useState('');

  // Active application tab (Desktop and Mobile)
  const [activeTab, setActiveTab] = useState('dashboard');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // AI states
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const [isChatting, setIsChatting] = useState(false);

  // Animate Splash Screen Progress Bar on mount
  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setSplashProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => setShowSplash(false), 300); // graceful exit
            return 100;
          }
          return prev + 4;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [showSplash]);

  // Load dashboard on mount, user switch, or filter changes
  const fetchDashboard = async (bank = bankFilter, start = startDate, end = endDate) => {
    try {
      let url = `/api/dashboard?bankId=${bank}`;
      if (start) url += `&startDate=${start}`;
      if (end) url += `&endDate=${end}`;
      
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to load dashboard data');
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchDashboard(bankFilter, startDate, endDate);
    }
  }, [bankFilter, startDate, endDate, isLoggedIn]);

  // Handle Preset Date Filter
  const applyDatePreset = (preset) => {
    setActiveDatePreset(preset);
    const today = new Date('2026-07-07T03:00:00.000Z');
    
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
    } else if (preset === '7d') {
      const start = new Date(today);
      start.setDate(start.getDate() - 7);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === '30d') {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    } else if (preset === 'this_month') {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(start.toISOString().split('T')[0]);
      setEndDate(today.toISOString().split('T')[0]);
    }
  };

  // Secure Companion Key Save
  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('companion_ai_key', tempKey.trim());
    setCompanionKey(tempKey.trim());
    setShowKeyForm(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem('companion_ai_key');
    setCompanionKey('');
    setTempKey('');
  };

  // Switch Active User profile (Login Flow)
  const handleLoginUser = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch('/api/users/switch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!res.ok) throw new Error('Failed to switch user');
      const json = await res.json();
      setData(json);
      
      // Reset filters upon switching profile
      setBankFilter('all');
      setStartDate('');
      setEndDate('');
      setActiveDatePreset('all');
      
      // Open Mono Onboarding Widget Flow
      const selectedMockUser = mockUsers.find(u => u.id === userId);
      setMonoOnboardingUser(selectedMockUser || mockUsers[0]);
      setMonoStep('intro');
      setMonoBankIndex(0);
      setMonoUsername(selectedMockUser ? selectedMockUser.displayName.toLowerCase().replace(/\s+/g, '_') + '_mono' : 'user_mono');
      setMonoPassword('••••••••');
      setMonoOtp('');
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Create custom profile based on predefined choice of personalities (AMD hackathon requirement)
  const handleCreateAndLogin = async (e) => {
    e.preventDefault();
    if (!customName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: customName.trim(),
          personalityType: customPersonality,
          phone: customPhone.trim() || undefined,
          goals: customGoals
        })
      });
      if (!res.ok) throw new Error('Failed to create custom profile');
      const json = await res.json();
      
      // Update data state
      setData(json.dashboard);
      
      // Reset form fields
      setCustomName('');
      setCustomPhone('');
      
      // Reset dashboard view filters
      setBankFilter('all');
      setStartDate('');
      setEndDate('');
      setActiveDatePreset('all');
      
      // Configure mock user object for the Mono handshake screens
      const customUserObj = {
        id: json.user.id,
        displayName: json.user.displayName,
        role: customPersonality === 'student' ? 'University Student' : customPersonality === 'trader' ? 'Market Trader' : 'Salaried Corporate',
        banks: customPersonality === 'student' ? ['GTBank', 'Kuda Bank'] : customPersonality === 'trader' ? ['Access Bank', 'Providus Bank'] : ['Zenith Bank', 'OPay'],
        goal: json.user.profile.goals.join(', '),
        accent: customPersonality === 'student' ? 'emerald' : customPersonality === 'trader' ? 'amber' : 'sky'
      };
      
      setMonoOnboardingUser(customUserObj);
      setMonoStep('intro');
      setMonoBankIndex(0);
      setMonoUsername(json.user.displayName.toLowerCase().replace(/\s+/g, '_') + '_mono');
      setMonoPassword('••••••••');
      setMonoOtp('');
      
      setIsLoggedIn(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Logout Flow
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleConfirmMonoConnection = async (bankName) => {
    try {
      const res = await fetch('/api/mono/link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ institution: bankName })
      });
      if (res.ok) {
        const json = await res.json();
        setData(json.dashboard);
      }
    } catch (err) {
      console.error("Error linking bank account via Mono Connect simulation:", err);
    }
    setMonoStep('success');
  };

  const renderMonoWidget = () => {
    if (!monoOnboardingUser) return null;
    return (
      <div className="max-w-md w-full bg-white text-slate-850 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 flex flex-col relative font-sans text-left animate-in fade-in zoom-in-95 duration-200">
        
        {/* Mono Secure Ribbon Header */}
        <div className="bg-[#0055FF] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Custom SVG Mono Logo */}
            <div className="w-5 h-5 rounded-lg bg-white/20 flex items-center justify-center font-bold text-[10px] tracking-tighter">
              m
            </div>
            <span className="font-bold tracking-tight text-sm">mono</span>
            <span className="text-[8px] bg-white/20 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wide">Link Widget</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-blue-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Secure 256-Bit SSL
          </div>
        </div>

        {/* Main Content Area */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between min-h-[360px]">
          
          {monoStep === 'intro' && (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="text-center space-y-3">
                <div className="w-14 h-14 bg-blue-50 text-[#0055FF] rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                  <Landmark size={26} />
                </div>
                <h3 className="text-base font-extrabold text-slate-900">Link your bank with Mono</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Connect your accounts securely to sync real bank runs and physical pocket confidence calculators in <strong className="text-[#0055FF]">FinI</strong>.
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3 text-xs">
                  <span className="text-[#0055FF] font-bold">✔</span>
                  <p className="text-slate-600 font-medium">Read-only transaction ledger access (Mono never sees passwords).</p>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <span className="text-[#0055FF] font-bold">✔</span>
                  <p className="text-slate-600 font-medium">Real-time sync for physical cash runs, bus rides, and mama put runs.</p>
                </div>
                <div className="flex items-start gap-3 text-xs">
                  <span className="text-[#0055FF] font-bold">✔</span>
                  <p className="text-slate-600 font-medium">CBN regulated & NDPR compliant data practices.</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setMonoStep('banks')}
                  className="w-full py-2.5 bg-[#0055FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  Securely Connect Bank <ChevronRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMonoOnboardingUser(null);
                    setIsLoggedIn(true);
                  }}
                  className="w-full py-2 hover:bg-slate-50 text-slate-500 hover:text-slate-800 font-medium text-xs rounded-xl transition-all cursor-pointer"
                >
                  Skip & Enter Directly
                </button>
              </div>
            </div>
          )}

          {monoStep === 'banks' && (
            <div className="space-y-5">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Select Bank Feed</h4>
                <p className="text-[11px] text-slate-500">Choose one of your connected banks associated with <strong>{monoOnboardingUser.displayName}</strong> to link:</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {monoOnboardingUser.banks.map((bankName, index) => {
                  const details = BANK_DETAILS[bankName] || { name: bankName, color: 'bg-slate-800 border-slate-800 text-white', label: bankName };
                  const isConnected = index < monoBankIndex;
                  const isCurrent = index === monoBankIndex;
                  
                  return (
                    <button
                      key={bankName}
                      type="button"
                      disabled={isConnected}
                      onClick={() => {
                        setMonoStep('login');
                      }}
                      className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center gap-2.5 transition-all shadow-xs relative ${
                        isConnected 
                          ? 'opacity-40 bg-slate-50 border-slate-150 cursor-not-allowed' 
                          : isCurrent 
                            ? 'border-blue-500 ring-2 ring-blue-500/20 hover:scale-102 cursor-pointer bg-slate-50/50' 
                            : 'border-slate-200 hover:border-slate-300 hover:scale-101 cursor-pointer bg-white'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-md ${details.color}`}>
                        {details.name.charAt(0)}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800">{details.name}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          {isConnected ? '✔ Connected' : isCurrent ? '🔗 Ready to Link' : 'Pending Link'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2 pt-6">
                <button
                  type="button"
                  onClick={() => setMonoStep('intro')}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {monoStep === 'login' && (() => {
            const bankName = monoOnboardingUser.banks[monoBankIndex];
            const details = BANK_DETAILS[bankName] || { name: bankName, color: 'bg-slate-850', label: bankName };
            return (
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white ${details.color}`}>
                    {details.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Sign in to {details.label}</h4>
                    <p className="text-[10px] text-slate-400 font-mono">Secure handshake via Mono API</p>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Mobile No / User ID</label>
                    <input
                      type="text"
                      value={monoUsername}
                      onChange={(e) => setMonoUsername(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-hidden focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-1">Internet Banking Password / PIN</label>
                    <input
                      type="password"
                      value={monoPassword}
                      onChange={(e) => setMonoPassword(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-800 outline-hidden focus:border-blue-500 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setMonoStep('banks')}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonoStep('otp')}
                    className="flex-1 py-2 bg-[#0055FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Authorize Link
                  </button>
                </div>
              </div>
            );
          })()}

          {monoStep === 'otp' && (() => {
            const bankName = monoOnboardingUser.banks[monoBankIndex];
            const details = BANK_DETAILS[bankName] || { name: bankName, color: 'bg-slate-850', label: bankName };
            return (
              <div className="space-y-5 text-center">
                <div className="w-12 h-12 bg-blue-50 text-[#0055FF] rounded-full mx-auto flex items-center justify-center animate-bounce">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">Security Verification</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto mt-1">
                    Enter the 6-digit one-time passcode (OTP) sent by <strong>{details.name}</strong> to the phone number on file.
                  </p>
                </div>

                <div className="py-2">
                  <input
                    type="text"
                    placeholder="843109"
                    maxLength={6}
                    value={monoOtp}
                    onChange={(e) => setMonoOtp(e.target.value)}
                    className="w-36 tracking-[0.5em] text-center font-mono font-bold text-lg border border-slate-200 rounded-xl py-2 px-3 text-slate-800 outline-hidden focus:border-blue-500 bg-white"
                  />
                </div>

                <div className="flex gap-2 pt-6">
                  <button
                    type="button"
                    onClick={() => setMonoStep('login')}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmMonoConnection(bankName)}
                    className="flex-1 py-2 bg-[#0055FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Confirm Connection
                  </button>
                </div>
              </div>
            );
          })()}

          {monoStep === 'success' && (() => {
            const bankName = monoOnboardingUser.banks[monoBankIndex];
            const hasNextBank = monoBankIndex < monoOnboardingUser.banks.length - 1;
            return (
              <div className="space-y-6 text-center flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-full mx-auto flex items-center justify-center shadow-inner">
                    <CheckCircle2 size={28} />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{bankName} Linked!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Your transaction runs and unallocated bank balances have been synced successfully with FinI.
                  </p>
                </div>

                <div className="space-y-2 text-left bg-slate-50 p-4 rounded-2xl border border-slate-100 max-w-xs mx-auto w-full">
                  <div className="text-[10px] font-mono flex items-center gap-2 text-slate-600">
                    <span className="text-emerald-500">✔</span> Authenticated via Mono handshake
                  </div>
                  <div className="text-[10px] font-mono flex items-center gap-2 text-slate-600">
                    <span className="text-emerald-500">✔</span> Fetched 30-day verified ledger run
                  </div>
                  <div className="text-[10px] font-mono flex items-center gap-2 text-slate-600">
                    <span className="text-emerald-500">✔</span> Synthesized decay cash pools
                  </div>
                </div>

                <div className="pt-4">
                  {hasNextBank ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMonoBankIndex(monoBankIndex + 1);
                        setMonoStep('login');
                        const nextBank = monoOnboardingUser.banks[monoBankIndex + 1];
                        setMonoUsername(monoOnboardingUser.displayName.toLowerCase().replace(/\s+/g, '_') + '_' + nextBank.toLowerCase().replace(/\s+/g, '_'));
                        setMonoOtp('');
                      }}
                      className="w-full py-2.5 bg-[#0055FF] hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Link Next Bank: {monoOnboardingUser.banks[monoBankIndex + 1]}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMonoOnboardingUser(null);
                        setIsLoggedIn(true);
                      }}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      Enter FinI Dashboard
                    </button>
                  )}
                </div>
              </div>
            );
          })()}

        </div>

        {/* Security compliance footer info */}
        <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-center gap-1.5 text-[9px] font-mono text-slate-400">
          <span className="text-slate-500 font-bold">🔒 Secure Handshake</span>
          <span>•</span>
          <span>CBN Compliant</span>
          <span>•</span>
          <span>NDPR Certified</span>
        </div>

      </div>
    );
  };

  // Create new transaction (Facts column)
  const handleAddTransaction = async (e) => {
    e.preventDefault();
    if (!txAmount || !txNarration) return;

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedTxBankId || data.bankAccounts[0]?.id,
          amount: parseFloat(txAmount),
          type: txType,
          channel: txChannel,
          narration: txNarration.toUpperCase(),
          recipientType: txType === 'credit' ? 'individual' : 'merchant',
          category: txCategory || null
        })
      });
      if (!res.ok) throw new Error('Failed to add transaction');
      const json = await res.json();
      
      // Re-fetch with current active filters to remain in state
      await fetchDashboard(bankFilter, startDate, endDate);
      
      setTxAmount('');
      setTxNarration('');
      setTxCategory('');

      // Auto-trigger an AI passive review for the new transaction
      triggerAIReview();
    } catch (err) {
      console.error(err);
    }
  };

  // Log a manual Cash Withdrawal
  const handleManualWithdrawal = async (e) => {
    e.preventDefault();
    if (!manualWithdrawAmount) return;

    try {
      // Find the account to link withdrawal to
      const targetAccount = bankFilter !== 'all' ? bankFilter : data.bankAccounts[0]?.id;

      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: targetAccount,
          amount: parseFloat(manualWithdrawAmount),
          type: 'debit',
          channel: 'atm',
          narration: 'ATM CASH WITHDRAWAL',
          recipientType: 'unknown',
          category: 'withdrawal'
        })
      });
      if (!res.ok) throw new Error('Failed to create cash pool');
      
      // Re-fetch with current active filters
      await fetchDashboard(bankFilter, startDate, endDate);
      setManualWithdrawAmount('');

      // Auto-trigger AI passive review
      triggerAIReview();
    } catch (err) {
      console.error(err);
    }
  };

  // Log expense against an active cash pool (Cash column)
  const handleLogCashExpense = async (poolId, expenseData) => {
    try {
      const res = await fetch('/api/cash-pools/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          poolId,
          ...expenseData
        })
      });
      if (!res.ok) throw new Error('Failed to log expense');
      
      // Re-fetch with current active filters
      await fetchDashboard(bankFilter, startDate, endDate);

      // Auto trigger AI passive review
      triggerAIReview();
    } catch (err) {
      console.error(err);
    }
  };

  // Categorize standard bank transaction (Facts column)
  const handleCategorizeTx = async (txId, category) => {
    try {
      const res = await fetch('/api/transactions/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txId, category })
      });
      if (!res.ok) throw new Error('Failed to categorize');
      
      // Re-fetch with current active filters
      await fetchDashboard(bankFilter, startDate, endDate);
    } catch (err) {
      console.error(err);
    }
  };

  // Answer skippable P2P transfer Cash question (Facts column)
  const handleAnswerP2PCash = async (txId, isWithdrawal) => {
    try {
      const tx = data.transactions.find(t => t.id === txId);
      if (isWithdrawal && tx) {
        // Trigger a transaction write to transform it into a pool-inducing withdrawal
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            accountId: tx.accountId,
            amount: tx.amount,
            type: 'debit',
            channel: 'atm',
            narration: `CONFIRMED CASH: ${tx.narration}`,
            category: 'withdrawal'
          })
        });
        if (!res.ok) throw new Error('Failed to convert P2P to Cash');
        
        // Re-fetch with current active filters
        await fetchDashboard(bankFilter, startDate, endDate);
      } else {
        // Just flag it as answered and categorized as standard transfer
        await handleCategorizeTx(txId, 'transfer');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Trigger Passive AI Pattern Analysis
  const triggerAIReview = async () => {
    setIsGeneratingInsight(true);
    try {
      const res = await fetch('/api/insights/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customApiKey: companionKey })
      });
      if (!res.ok) throw new Error('Failed to run AI analysis');
      
      // Re-fetch with current active filters
      await fetchDashboard(bankFilter, startDate, endDate);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingInsight(false);
    }
  };

  // Send Direct Question in Companion Chat
  const handleSendMessage = async (text) => {
    setIsChatting(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          customApiKey: companionKey,
          clientTimestamp: new Date().toISOString()
        })
      });
      if (!res.ok) throw new Error('Failed to chat');
      const json = await res.json();
      
      // Re-fetch to apply latest filters, but merge conversation state
      await fetchDashboard(bankFilter, startDate, endDate);
    } catch (err) {
      console.error(err);
    } finally {
      setIsChatting(false);
    }
  };

  // Set default tx bank account when data loads
  useEffect(() => {
    if (data && data.bankAccounts && !selectedTxBankId) {
      setSelectedTxBankId(data.bankAccounts[0]?.id || '');
    }
  }, [data]);

  // Render Splash Screen
  if (showSplash) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary p-6 select-none relative overflow-hidden">
        {/* Glowing atmospheric backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-accent-forest/10 rounded-full blur-3xl" />
 
        <div className="z-10 flex flex-col items-center max-w-sm text-center gap-6">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-24 h-24 shadow-[0_0_50px_rgba(212,175,55,0.15)] rounded-2xl overflow-hidden"
          >
            <Logo className="w-full h-full animate-pulse" showBg={true} />
          </motion.div>
 
          <div className="space-y-2">
            <motion.h1 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-3xl font-bold tracking-widest font-sans text-accent-gold"
            >
              FINI
            </motion.h1>
            <motion.p 
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xs text-text-muted font-mono tracking-widest uppercase"
            >
              Executive Private Wealth Office
            </motion.p>
          </div>
 
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="w-full space-y-3 mt-4"
          >
            <div className="h-1 w-full bg-surface-2 rounded overflow-hidden border border-border">
              <div 
                className="h-full bg-accent-gold rounded transition-all duration-75"
                style={{ width: `${splashProgress}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-wider">
              <span>Securing ledger logs...</span>
              <span>{splashProgress}%</span>
            </div>
          </motion.div>
 
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            onClick={() => setShowSplash(false)}
            className="text-[10px] font-mono text-text-muted hover:text-accent-gold underline mt-2 transition-colors cursor-pointer uppercase tracking-widest"
          >
            Skip Intro
          </motion.button>
        </div>
      </div>
    );
  }

  // Render Account Chooser Login Portal
  if (!isLoggedIn) {
    if (monoOnboardingUser) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#131314] text-[#e5e2e3] p-4 relative overflow-hidden">
          {/* glowing indicators */}
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-[#c2c6db]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-[#bcc7de]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="z-10 w-full max-w-md">
            {renderMonoWidget()}
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-base text-text-primary p-4 md:p-8 relative overflow-hidden">
        {/* glowing indicators */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-accent-gold/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-accent-forest/10 rounded-full blur-3xl pointer-events-none" />

        <div className="z-10 w-full max-w-6xl flex flex-col gap-8">
          <div className="text-center space-y-2">
            <span className="text-[10px] bg-accent-forest text-accent-gold border border-border px-3 py-1 rounded font-mono uppercase tracking-widest inline-block">
              SECURE PORTAL
            </span>
            <h2 className="text-2xl md:text-3xl font-semibold text-text-primary uppercase tracking-tight">
              FINI SETUP PORTAL
            </h2>
            <p className="text-xs text-text-secondary max-w-lg mx-auto leading-relaxed">
              Experience Nigeria's premium multi-bank and cash companion. Choose a pre-configured persona template, or register your custom profile below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Quick Start Personas */}
            <div className="lg:col-span-8 space-y-4">
              <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-gold flex items-center gap-1.5">
                <User size={13} /> Predefined Choice of Personalities
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {mockUsers.map((u) => (
                  <motion.div
                    key={u.id}
                    whileHover={{ y: -4, scale: 1.01 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLoginUser(u.id)}
                    className="bg-surface-1 hover:bg-surface-2 border border-border hover:border-accent-gold/50 rounded p-5 flex flex-col justify-between gap-5 cursor-pointer shadow-none transition-all min-h-[350px]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded bg-gradient-to-tr ${u.avatarColor} flex items-center justify-center font-mono font-bold text-base shadow-inner`}>
                          {u.displayName.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold font-mono text-text-primary">{u.displayName}</h4>
                          <p className="text-[9px] text-text-muted font-mono tracking-wider uppercase mt-0.5">{u.role}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 border-t border-border pt-2.5">
                        <span className="text-[8px] font-mono text-text-muted uppercase tracking-wider block">Connected Feeds</span>
                        <div className="flex flex-wrap gap-1">
                          {u.banks.map((b) => (
                            <span key={b} className="text-[8px] font-mono px-1.5 py-0.5 bg-bg-base border border-border text-text-secondary rounded">
                              🏦 {b}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1 bg-bg-base/40 p-2.5 rounded border border-border/50">
                        <span className="text-[8px] font-mono text-text-muted uppercase block">Audit Objectives</span>
                        <p className="text-[10px] text-text-secondary leading-relaxed italic">
                          "{u.goal}"
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoginUser(u.id);
                      }}
                      className="w-full py-1.5 bg-accent-forest hover:bg-accent-gold hover:text-bg-base text-accent-gold font-mono text-[10px] rounded transition-all cursor-pointer flex items-center justify-center gap-1 border border-border"
                    >
                      Enter Account <ChevronRight size={11} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Custom Dynamic Profile Creator */}
            <div className="lg:col-span-4 bg-surface-1 border border-border p-6 rounded space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono font-semibold uppercase tracking-wider text-accent-gold flex items-center gap-1.5">
                  <Sparkles size={13} className="animate-pulse" /> Register Custom Profile
                </h3>
                <p className="text-[10px] font-mono text-text-muted leading-relaxed">
                  Design your own custom profile based on predefined choice of financial personalities for the AMD hackathon.
                </p>
              </div>

              <form onSubmit={handleCreateAndLogin} className="space-y-4 text-left">
                <div className="space-y-1">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-text-muted">Custom Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Ibrahim Yusuf"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded py-2 px-3 text-xs font-mono text-text-primary outline-hidden focus:border-accent-gold"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-text-muted">Phone Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. +234 803 123 4567"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="w-full bg-surface-2 border border-border rounded py-2 px-3 text-xs font-mono text-text-primary outline-hidden focus:border-accent-gold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-text-muted">Select Financial Personality</label>
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => handlePersonalityChange('student')}
                      className={`p-2.5 rounded border text-left flex flex-col gap-1 transition-all ${
                        customPersonality === 'student'
                          ? 'border-accent-gold bg-accent-forest text-text-primary'
                          : 'border-border bg-surface-2 text-text-muted hover:border-border-strong'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                        🎓 University Student
                        {customPersonality === 'student' && <Check size={11} className="text-accent-gold" />}
                      </span>
                      <span className="text-[9px] text-text-muted font-mono leading-normal">
                        Cautious comfort, tight cash. Unstable student allowances requiring smart fading cash monitoring.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePersonalityChange('trader')}
                      className={`p-2.5 rounded border text-left flex flex-col gap-1 transition-all ${
                        customPersonality === 'trader'
                          ? 'border-accent-gold bg-accent-forest text-text-primary'
                          : 'border-border bg-surface-2 text-text-muted hover:border-border-strong'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                        🛒 Market Trader
                        {customPersonality === 'trader' && <Check size={11} className="text-accent-gold" />}
                      </span>
                      <span className="text-[9px] text-text-muted font-mono leading-normal">
                        Balanced comfort, rapid cash turnarounds. Daily wholesale business flows mixed with physical cash pools.
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePersonalityChange('salaried')}
                      className={`p-2.5 rounded border text-left flex flex-col gap-1 transition-all ${
                        customPersonality === 'salaried'
                          ? 'border-accent-gold bg-accent-forest text-text-primary'
                          : 'border-border bg-surface-2 text-text-muted hover:border-border-strong'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold flex items-center gap-1.5">
                        💼 Salaried Corporate
                        {customPersonality === 'salaried' && <Check size={11} className="text-accent-gold" />}
                      </span>
                      <span className="text-[9px] text-text-muted font-mono leading-normal">
                        Bold comfort, steady salary inflows. Heavily relies on credit ledger runs with weekend cash decay monitoring.
                      </span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border pt-3">
                  <label className="block text-[9px] font-mono uppercase tracking-wider text-text-muted">Choose Financial Goals</label>
                  <div className="grid grid-cols-1 gap-1.5 bg-bg-base/60 p-3 rounded border border-border text-left">
                    {[
                      { id: 'build_savings_habit', label: 'Build Savings Habit' },
                      { id: 'understand_spending', label: 'Understand Spending & Cash Runs' },
                      { id: 'track_business_cash', label: 'Track Daily Business Trade Flow' },
                      { id: 'audit_withdrawals', label: 'Audit Heavy Weekend Cashouts' },
                      { id: 'optimize_pocket_decay', label: 'Optimize Pocket Cash Decay' }
                    ].map((g) => {
                      const isChecked = customGoals.includes(g.id);
                      return (
                        <div 
                          key={g.id} 
                          onClick={() => {
                            if (isChecked) {
                              setCustomGoals(customGoals.filter(x => x !== g.id));
                            } else {
                              setCustomGoals([...customGoals, g.id]);
                            }
                          }}
                          className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                            isChecked ? 'bg-accent-forest text-accent-gold' : 'text-text-muted hover:bg-surface-2'
                          }`}
                        >
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${
                            isChecked ? 'border-accent-gold bg-accent-forest text-accent-gold' : 'border-border bg-surface-1'
                          }`}>
                            {isChecked && <Check size={10} strokeWidth={3} />}
                          </div>
                          <span className="text-[10px] font-mono select-none">{g.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-accent-gold hover:bg-accent-gold-dim text-[#14211c] font-semibold font-sans text-xs rounded transition-all cursor-pointer flex items-center justify-center gap-1"
                >
                  Create & Login Custom Account <Sparkles size={13} />
                </button>
              </form>
            </div>
          </div>

          <div className="text-center">
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-wider">
              Secure Private Key Protocol • Powered by Connected APIs • Gemini Intelligence Dominance
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Loader
  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#131314] text-[#e5e2e3] gap-4">
        <RefreshCw className="animate-spin text-[#c2c6db]" size={36} />
        <p className="font-mono text-xs tracking-wider uppercase text-[#c7c6cd]">Retrieving Secure Ledgers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#131314] text-[#e5e2e3] p-6 gap-3">
        <ShieldAlert className="text-[#ffb4ab]" size={48} />
        <h3 className="text-lg font-bold font-mono">Workspace Error</h3>
        <p className="text-xs text-[#c7c6cd] font-mono bg-[#0e0e0f] p-3 rounded-lg max-w-md border border-[#46464c]">{error}</p>
        <button onClick={() => fetchDashboard()} className="mt-2 px-4 py-2 bg-[#c2c6db] text-[#2b3040] font-bold rounded-xl text-xs hover:bg-[#bcc7de]">
          Retry Connection
        </button>
      </div>
    );
  }

  // Destructure Data
  const { user, bankAccounts, accountStats, transactions, cashPools, insights, conversation, availableUsers } = data;
  const activeMockUser = mockUsers.find(mu => mu.id === user.id) || {};

  const isDark = theme === 'dark';
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // Theme-aware styles mapping for FinI (Financial Identity)
  const sBg = 'bg-bg-base text-text-primary font-sans transition-colors duration-300';
  const sCard = 'bg-surface-1 border border-border text-text-primary rounded-lg';
  const sCardHeader = 'bg-surface-2 border-b border-border p-5';
  const sHeader = 'bg-surface-1 border-b border-border text-text-primary';
  const sControls = 'bg-surface-1 border border-border';
  const sInput = 'bg-surface-2 border border-border text-text-primary placeholder:text-text-muted focus:border-accent-gold rounded';
  const sTextMuted = 'text-text-muted';
  const sTextLight = 'text-text-secondary';
  const sTextLabel = 'text-text-primary';
  const sBorder = 'border-border';
  const sFeedBg = 'bg-bg-base border border-border/50';
  const sInnerCard = 'bg-surface-2 border border-border/30';
  const sTitle = 'text-text-primary font-semibold tracking-tight';

  // Active pool details & confidence calculation
  const activePoolList = cashPools.filter(p => !p.closedAt || p.status === 'expired');
  const totalCashConfidence = activePoolList.reduce((sum, p) => sum + (p.amount * p.confidence), 0);

  // Compute starting balance mathematically in React based on selected bank to maintain robust realism
  const getStartingBalance = () => {
    if (user.id === 'u_123') {
      if (bankFilter === 'acc_1') return 80000;
      if (bankFilter === 'acc_1_kuda') return 40000;
      return 120000;
    }
    if (user.id === 'u_456') {
      if (bankFilter === 'acc_2') return 200000;
      if (bankFilter === 'acc_2_providus') return 120000;
      return 320000;
    }
    if (user.id === 'u_789') {
      if (bankFilter === 'acc_3') return 500000;
      if (bankFilter === 'acc_3_opay') return 150000;
      return 650000;
    }
    return 150000;
  };

  const startingBalance = getStartingBalance();
  const activeBankBalance = transactions.reduce((acc, t) => t.type === 'credit' ? acc + t.amount : acc - t.amount, startingBalance);

  // Currency Formatter
  const formatMoney = (val) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: user.settings.currency || 'NGN',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col lg:flex-row relative transition-colors duration-300 overflow-hidden ${theme} ${sBg}`}>
      {/* BACKGROUND ATMOSPHERIC RADIAL GLOWS */}
      {isDark ? (
        <>
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-sky-50/40 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* 1. DESKTOP PERMANENT COLLAPSIBLE SIDEBAR (Only visible on screens larger than lg) */}
      <aside className={`hidden lg:flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-border transition-all duration-300 z-30 bg-surface-1 ${
        isSidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        
        {/* Sidebar Header & Brand */}
        <div className="p-5 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <div className="w-9 h-9 shrink-0 flex items-center justify-center">
                <Logo className="w-full h-full" showBg={true} />
              </div>
              {!isSidebarCollapsed && (
                <div>
                  <h1 className="text-sm font-black tracking-widest font-mono uppercase text-text-primary leading-none">FINI</h1>
                  <span className="text-[8px] font-mono text-accent-gold font-bold uppercase tracking-widest block mt-0.5">AI PRIVATE OS</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded border border-border text-text-muted transition-all hover:bg-surface-2"
              title="Toggle sidebar size"
            >
              <ListCollapse size={12} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {[
              { id: 'dashboard', label: 'Home', icon: Home },
              { id: 'ledger', label: 'Bank Ledger', icon: Wallet },
              { id: 'pockets', label: 'Cash Pockets', icon: Banknote },
              { id: 'reflections', label: 'Reflections', icon: Award },
              { id: 'assistant', label: 'FinI AI Companion', icon: Sparkles, hasDot: true },
              { id: 'agents', label: 'Multi-Agent Hub', icon: Cpu },
              { id: 'setup', label: 'Settings', icon: User },
            ].map(tab => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-xs font-mono font-bold transition-all cursor-pointer relative ${
                    isActive 
                      ? 'bg-accent-gold text-surface-1' 
                      : 'text-text-muted hover:text-text-primary hover:bg-surface-2'
                  }`}
                >
                  <TabIcon size={14} className="shrink-0" />
                  {!isSidebarCollapsed && <span className="truncate">{tab.label}</span>}
                  
                  {tab.hasDot && !isActive && (
                    <span className="absolute right-3.5 top-3.5 w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Profile details) */}
        <div className="p-4 border-t border-border flex flex-col gap-3 bg-surface-2/40">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              {activeMockUser.avatarUrl ? (
                <img 
                  src={activeMockUser.avatarUrl} 
                  alt={user.displayName}
                  className="w-8 h-8 rounded object-cover border border-border shrink-0"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center font-mono font-bold text-xs bg-surface-3 border border-border text-accent-gold">
                  {user.displayName.charAt(0)}
                </div>
              )}
              {!isSidebarCollapsed && (
                <div className="min-w-0">
                  <h4 className="text-xs font-mono font-bold truncate text-text-primary">{user.displayName}</h4>
                  <span className="text-[8px] font-mono uppercase text-text-muted tracking-widest font-bold">SECURE ACTIVE</span>
                </div>
              )}
            </div>

            {!isSidebarCollapsed && (
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={toggleTheme}
                  className="p-1.5 rounded border border-border text-accent-gold bg-surface-3 hover:bg-surface-2"
                  title={isDark ? "Light Mode" : "Dark Mode"}
                >
                  {isDark ? <Sun size={11} /> : <Moon size={11} />}
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded border border-border text-text-muted bg-surface-3 hover:text-danger-copper hover:bg-surface-2"
                  title="Logout sandbox session"
                >
                  <LogOut size={11} />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MOBILE TOP NAVIGATION HEADER (Only visible on mobile screens) */}
      <header className="lg:hidden flex items-center justify-between p-4 sticky top-0 border-b border-border z-30 bg-surface-1 text-text-primary">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-8 h-8 shrink-0 flex items-center justify-center">
            <Logo className="w-full h-full" showBg={true} />
          </div>
          <div>
            <h1 className="text-xs font-black tracking-widest font-mono uppercase text-text-primary leading-tight">FINI</h1>
            <span className="text-[7px] font-mono text-accent-gold font-bold uppercase tracking-widest block leading-none">PRIVATE OS</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-colors ${
              isDark ? 'border-white/10 text-amber-400 bg-[#0a0f1e]' : 'border-slate-200 text-amber-500 bg-slate-50'
            }`}
          >
            {isDark ? <Sun size={12} /> : <Moon size={12} />}
          </button>
          
          <button
            onClick={handleLogout}
            className={`px-2.5 py-1.5 rounded-xl border font-mono text-[9px] font-bold tracking-wider flex items-center gap-1 transition-colors ${
              isDark ? 'border-white/10 bg-[#0a0f1e] text-slate-400 hover:text-red-400' : 'border-slate-200 bg-slate-50 text-slate-600 hover:text-red-600'
            }`}
          >
            <LogOut size={10} /> OUT
          </button>
        </div>
      </header>

      {/* 3. MAIN COMPONENT SCROLLABLE CONTAINER VIEWPORT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full p-4 md:p-6 lg:p-8 z-10 pb-24 lg:pb-8">
        
        {/* Title context block */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className={`text-lg md:text-xl font-mono font-black uppercase tracking-tight flex items-center gap-2 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {activeTab === 'dashboard' && 'Home Dashboard'}
              {activeTab === 'ledger' && 'Verified Ledger Feeds'}
              {activeTab === 'pockets' && 'Estimated Pockets'}
              {activeTab === 'reflections' && 'Behavioral Reflections'}
              {activeTab === 'assistant' && 'Immersive Wealth Advisory'}
              {activeTab === 'agents' && 'Multi-Agent Hub'}
              {activeTab === 'setup' && 'Workspace settings'}
            </h2>
            <p className="text-[10px] md:text-xs font-mono uppercase mt-0.5 tracking-wider text-slate-500">
              {activeTab === 'dashboard' && 'Real-time multi-bank audit ledger and physical pocket projections.'}
              {activeTab === 'ledger' && 'Verified transaction flows synchronized via connected banks.'}
              {activeTab === 'pockets' && 'Record physical cash outs and track organic confidence fading.'}
              {activeTab === 'reflections' && 'Spotify Wrapped style interactive analysis of active traits.'}
              {activeTab === 'assistant' && 'Interactive sandbox advisor companion that learns your traits.'}
              {activeTab === 'agents' && 'Observe, audit, profile, and guide behaviors with the 7-Agent loop.'}
              {activeTab === 'setup' && 'Configure custom API integration gateways and sandbox profiles.'}
            </p>
          </div>

          {/* Quick status button or connection state displayed in title */}
          <div className="flex gap-2 shrink-0">
            {companionKey ? (
              <span className={`text-[9px] font-mono px-2 py-1 border rounded-lg uppercase tracking-wider font-bold transition-all ${
                isDark ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                🧠 Custom Brain Connected
              </span>
            ) : (
              <span className="text-[9px] font-mono px-2 py-1 border rounded-lg uppercase tracking-wider text-slate-500 bg-[#0e0e0f] border-white/10">
                🔒 Static Core Active
              </span>
            )}
          </div>
        </div>

        {/* Dynamic Page Rendering */}
        <div className="w-full flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="w-full"
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  user={user}
                  activeBankBalance={activeBankBalance}
                  totalCashConfidence={totalCashConfidence}
                  activePoolList={activePoolList}
                  insights={insights}
                  isGeneratingInsight={isGeneratingInsight}
                  triggerAIReview={triggerAIReview}
                  transactions={transactions}
                  startingBalance={startingBalance}
                  formatMoney={formatMoney}
                  theme={theme}
                />
              )}

              {activeTab === 'ledger' && (
                <LedgerView
                  bankFilter={bankFilter}
                  setBankFilter={setBankFilter}
                  bankAccounts={bankAccounts}
                  activeDatePreset={activeDatePreset}
                  applyDatePreset={applyDatePreset}
                  startDate={startDate}
                  endDate={endDate}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setActiveDatePreset={setActiveDatePreset}
                  transactions={transactions}
                  txAmount={txAmount}
                  setTxAmount={setTxAmount}
                  txType={txType}
                  setTxType={setTxType}
                  txChannel={txChannel}
                  setTxChannel={setTxChannel}
                  selectedTxBankId={selectedTxBankId}
                  setSelectedTxBankId={setSelectedTxBankId}
                  txNarration={txNarration}
                  setTxNarration={setTxNarration}
                  handleAddTransaction={handleAddTransaction}
                  handleCategorizeTx={handleCategorizeTx}
                  handleAnswerP2PCash={handleAnswerP2PCash}
                  formatMoney={formatMoney}
                  theme={theme}
                />
              )}

              {activeTab === 'pockets' && (
                <PocketsView
                  manualWithdrawAmount={manualWithdrawAmount}
                  setManualWithdrawAmount={setManualWithdrawAmount}
                  handleManualWithdrawal={handleManualWithdrawal}
                  activePoolList={activePoolList}
                  handleLogCashExpense={handleLogCashExpense}
                  user={user}
                  theme={theme}
                  formatMoney={formatMoney}
                />
              )}

              {activeTab === 'assistant' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
                  {/* Dynamic User Profile display side bar (5 cols) */}
                  <div className="lg:col-span-5 flex flex-col gap-6">
                    <div className="p-5 rounded-lg border border-border bg-surface-1 flex flex-col gap-4">
                      <div className="border-b pb-3 border-border/40">
                        <h4 className="text-xs font-bold font-mono uppercase tracking-widest flex items-center gap-1.5 text-text-primary">
                          <Brain size={13} className="text-accent-gold" /> Custom Advisor Personality
                        </h4>
                        <p className="text-[10px] font-mono text-text-muted mt-0.5 uppercase tracking-wider">FinI Companion tracks and learns custom behavioral markers</p>
                      </div>

                      <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-wider">
                        <div className="p-3 rounded border border-border bg-surface-2 flex flex-col gap-1">
                          <span className="text-[8px] uppercase text-text-muted font-bold">Money Personality Profile</span>
                          <span className="text-xs font-bold font-mono text-text-primary">
                            {user.profile.userType}
                          </span>
                        </div>

                        {/* Active goals list */}
                        <div className="p-3 rounded border border-border bg-surface-2 flex flex-col gap-1.5">
                          <span className="text-[8px] uppercase text-text-muted block font-bold">Identified Active Goals</span>
                          <div className="flex flex-col gap-1 font-sans text-[11px] leading-relaxed text-text-secondary uppercase">
                            {user.profile.goals.map((g, idx) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <span className="text-accent-gold shrink-0 font-bold">•</span>
                                <span className="text-text-secondary">{g.replace(/_/g, ' ')}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stored learned traits display */}
                        <div className="p-3 rounded border border-border bg-surface-2 flex flex-col gap-1.5">
                          <span className="text-[8px] uppercase text-text-muted block font-bold">Stored User Personality Traits</span>
                          {user.profile.learnedPersonality ? (
                            <div className="p-2.5 rounded border border-border bg-surface-3 text-[10px] leading-relaxed flex items-start gap-2 text-text-secondary">
                              <span className="text-accent-gold font-bold shrink-0">💡</span>
                              <span className="text-text-primary">
                                {user.profile.learnedPersonality}
                              </span>
                            </div>
                          ) : (
                            <p className="text-[9px] text-text-muted italic">No custom traits stored yet. Converse with the assistant to record behaviors.</p>
                          )}
                        </div>

                        <div className="p-3 rounded border border-border bg-surface-2 flex flex-col gap-1">
                          <span className="text-[8px] uppercase text-text-muted font-bold">Auditing Vocal Cadence</span>
                          <span className="text-xs font-bold font-mono capitalize text-text-primary">
                            {user.profile.tone?.replace(/_/g, ' ') || 'Direct Audit Style'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* IMMERSIVE COMPANION CHAT COMPONENT (7 cols) */}
                  <div className="lg:col-span-7 h-[560px]">
                    <AgentChat
                      messages={conversation?.messages || []}
                      onSendMessage={handleSendMessage}
                      isGenerating={isChatting}
                      userType={user.profile.userType}
                      theme={theme}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'reflections' && (
                <ReflectionsView
                  user={user}
                  formatMoney={formatMoney}
                  theme={theme}
                  transactions={transactions}
                  cashPools={cashPools}
                />
              )}

              {activeTab === 'agents' && (
                <AgentsHubView
                  user={user}
                  transactions={transactions}
                  cashPools={cashPools}
                  insights={insights}
                  theme={theme}
                  formatMoney={formatMoney}
                />
              )}

              {activeTab === 'setup' && (
                <SettingsView
                  user={user}
                  availableUsers={availableUsers}
                  switchProfile={handleLoginUser}
                  companionKey={companionKey}
                  handleClearKey={handleClearKey}
                  tempKey={tempKey}
                  setTempKey={setTempKey}
                  showKeyForm={showKeyForm}
                  setShowKeyForm={setShowKeyForm}
                  handleSaveKey={handleSaveKey}
                  setMonoOnboardingUser={setMonoOnboardingUser}
                  setMonoStep={setMonoStep}
                  setMonoBankIndex={setMonoBankIndex}
                  setMonoUsername={setMonoUsername}
                  setMonoPassword={setMonoPassword}
                  setMonoOtp={setMonoOtp}
                  mockUsers={mockUsers}
                  theme={theme}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* 4. MOBILE HIGH-FIDELITY BOTTOM NAVIGATION TAB BAR (Only visible on screens smaller than lg) */}
      <nav className="lg:hidden fixed bottom-4 left-3 right-3 rounded-lg border flex justify-around p-1.5 z-40 bg-surface-2/95 border-border text-text-secondary backdrop-blur-2xl">
        {[
          { id: 'dashboard', label: 'Home', icon: Home },
          { id: 'ledger', label: 'Ledger', icon: Wallet },
          { id: 'pockets', label: 'Pockets', icon: Banknote },
          { id: 'reflections', label: 'Traits', icon: Award },
          { id: 'assistant', label: 'FinI AI', icon: Sparkles, hasDot: true },
          { id: 'agents', label: 'Loop', icon: Cpu },
          { id: 'setup', label: 'Profile', icon: User },
        ].map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-0.5 rounded transition-all duration-200 relative cursor-pointer ${
                isActive
                  ? 'text-accent-gold bg-accent-gold/10'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <TabIcon size={14} className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[8px] tracking-tight font-sans font-medium ${isActive ? 'font-semibold' : ''}`}>{tab.label}</span>
              
              {tab.hasDot && !isActive && (
                <span className="absolute right-3 top-1 w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      {/* MONO ONBOARDING OVERLAY FOR DASHBOARD (RE-LINK FLOW) */}
      {monoOnboardingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="z-10 w-full max-w-md">
            {renderMonoWidget()}
          </div>
        </div>
      )}
    </div>
  );
}
