import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Eye,
  EyeOff,
  UserCheck,
  LogOut,
  ChevronDown,
  Building2,
  User,
  Globe2,
  Sparkles,
  Sliders,
  FileCheck2
} from 'lucide-react';

export function Header({ activeTab, setActiveTab }) {
  const {
    entityType,
    setEntityType,
    userRole,
    setUserRole,
    isPiiMasked,
    setIsPiiMasked,
    sessionSecondsRemaining,
    authStatus,
    setAuthStatus,
    addAuditLog,
    setActiveModal,
    currentProfile,
    maskPii
  } = useApp();

  const [entityDropdownOpen, setEntityDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEntityChange = (newEntity) => {
    setEntityType(newEntity);
    setEntityDropdownOpen(false);
    addAuditLog('Profile Scope Switched', `Context switched to ${newEntity}: ${currentProfile.name}`);
  };

  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    setRoleDropdownOpen(false);
    addAuditLog('RBAC Scope Modified', `Privilege boundary updated to ${newRole}`);
  };

  const handleLogout = () => {
    addAuditLog('Session Terminated', 'User initiated logout from dashboard');
    setAuthStatus('unauthenticated');
    setActiveModal('auth');
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case 'Individual':
        return <User className="w-4 h-4 text-sky-400" />;
      case 'Organization':
        return <Globe2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Building2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand & Profile Scope */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('inbox')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-sky-500/20 to-indigo-500/20 border border-emerald-500/40 shadow-glow-emerald">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-slate-100 via-slate-200 to-emerald-400 bg-clip-text text-transparent">
                  AegisRecover
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  v2.6 Zero-Trust
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Autonomous AI Revenue & Capital Recovery Engine</p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* Dynamic Profile Segment Picker */}
          <div className="relative">
            <button
              onClick={() => setEntityDropdownOpen(!entityDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/70 hover:border-slate-600 transition text-xs text-slate-200"
            >
              {getEntityIcon(entityType)}
              <div className="text-left hidden sm:block">
                <div className="font-semibold text-slate-100 leading-tight">{entityType}</div>
                <div className="text-[10px] text-slate-400 font-mono-num">{maskPii(currentProfile.taxId, 'tax')}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {entityDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 glass-dropdown rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  Switch Active Entity Segment
                </div>
                {['Individual', 'Business', 'Organization'].map((type) => (
                  <button
                    key={type}
                    onClick={() => handleEntityChange(type)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition ${
                      entityType === type
                        ? 'bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {getEntityIcon(type)}
                      <div className="text-left">
                        <div className="font-medium">{type}</div>
                        <div className="text-[10px] text-slate-400">
                          {type === 'Individual' && 'Personal Freelance / Contractor'}
                          {type === 'Business' && 'Enterprise B2B SaaS Corporation'}
                          {type === 'Organization' && 'Global NGO & Grant Initiative'}
                        </div>
                      </div>
                    </div>
                    {entityType === type && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('inbox')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'inbox'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            AI Action Center
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'history'
                ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            History & Records
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'analytics'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Decompositions & Forecasts
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'security'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Security & Compliance
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'infrastructure'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Engine Agents & Tokens
          </button>
        </nav>

        {/* Right: Security Guardrails, PII Toggle, Session Timer & Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Ingest / Onboard Button */}
          <button
            onClick={() => setActiveModal('onboarding')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-medium transition shadow-glow-emerald"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ingest Data</span>
          </button>

          {/* PII Masking Switch */}
          <button
            onClick={() => {
              setIsPiiMasked(!isPiiMasked);
              addAuditLog(
                'PII Masking Toggled',
                `Zero-Trust pseudonymization state altered to: ${!isPiiMasked ? 'MASKED' : 'EXPOSED (Privileged View)'}`
              );
            }}
            title={isPiiMasked ? "PII Masking Active (+91 XXXXX-XX123)" : "PII Exposed (Privileged View)"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition ${
              isPiiMasked
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {isPiiMasked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">{isPiiMasked ? 'PII MASKED' : 'RAW PII'}</span>
          </button>


          {/* RBAC Role Badge & Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs text-slate-200"
            >
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium hidden sm:inline">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-52 glass-dropdown rounded-xl shadow-2xl p-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                  Switch RBAC Role Boundary
                </div>
                {[
                  { role: 'Admin', desc: 'Full System, Threshold & Security Config' },
                  { role: 'Operator', desc: 'Onboarding & Outreach Drafts' },
                  { role: 'Viewer', desc: 'Read-Only Analytics & Audit' }
                ].map(({ role, desc }) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs transition ${
                      userRole === role
                        ? 'bg-emerald-500/15 text-emerald-300 font-medium border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="font-semibold">{role}</div>
                    <div className="text-[10px] text-slate-400">{desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Return to Gateway Entry / Logout */}
          <button
            onClick={() => {
              if (window.confirm('Return to Gateway Entry Point? This lets you test the Returning vs New User login flow.')) {
                handleLogout();
              }
            }}
            title="Gateway Entry & Switch User"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Gateway</span>
          </button>

        </div>
      </div>
    </header>
  );
}
