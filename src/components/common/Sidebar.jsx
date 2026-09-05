import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  FileSpreadsheet,
  HardDriveDownload,
  CreditCard,
  Headphones,
  ShieldCheck,
  Building2,
  User,
  Globe2,
  Lock,
  LogOut,
  ChevronRight,
  Sparkles,
  Radio,
  Clock,
  Menu,
  X,
  Mail,
  MessageSquare,
  Zap,
  CheckCircle2,
  Sliders,
  Layers,
  Plus
} from 'lucide-react';

export function Sidebar({ mobileOpen, setMobileOpen }) {
  const {
    setAppFlow,
    currentTab,
    navigateToTab,
    entityType,
    setEntityType,
    userRole,
    currentUser,
    historicalRecords,
    pendingQueue,
    paymentsLedger,
    outboundChannel,
    outboundEmail,
    outboundPhone,
    sessionSecondsRemaining,
    logoutToGateway,
    maskPii,
    supabaseStatus,
    setAuthStatus,
    setSelectedDashboardRecord,
    selectedRecordId,
    setSelectedRecordId
  } = useApp();

  const pendingActiveCount = pendingQueue.filter(q => q.status === 'pending').length;
  const penaltiesCount = paymentsLedger.reduce((acc, p) => acc + (p.penaltyCharges?.length || 0), 0);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard Hub',
      description: 'Metrics, scorecards & charts',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'ledger',
      label: 'Records Ledger',
      description: 'Historical recovery assets',
      icon: FileSpreadsheet,
      badge: historicalRecords.length ? `${historicalRecords.length}` : null,
      badgeColor: 'bg-slate-800 text-slate-300'
    },
    {
      id: 'ingestion',
      label: 'Data Ingestion Engine',
      description: 'Dual-inlet onboarding & QR',
      icon: HardDriveDownload,
      badge: pendingActiveCount > 0 ? `${pendingActiveCount} PENDING` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
    },
    {
      id: 'payments',
      label: 'Payments & Billing',
      description: 'SaaS tiers & penalty audit',
      icon: CreditCard,
      badge: penaltiesCount > 0 ? `${penaltiesCount} PENALTIES` : null,
      badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
    },
    {
      id: 'support',
      label: 'AI Customer Support',
      description: 'Voice assistant & LLM chat',
      icon: Headphones,
      badge: 'LIVE AI',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'security',
      label: 'Security & Compliance',
      description: 'Audit logs & PII mask',
      icon: ShieldCheck,
      badge: 'SOC 2',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
    }
  ];

  const formatSessionTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNavClick = (tabId) => {
    navigateToTab(tabId);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-[#0b101b] border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-indigo-600 shadow-glow-emerald">
                <ShieldCheck className="w-6 h-6 text-slate-950 font-black" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#0b101b] animate-ping" />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-[#0b101b]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-black tracking-tight text-white">AegisRecover</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    v2.6
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono tracking-wide">
                  AI Revenue & Capital Recovery
                </p>
              </div>
            </div>

            {/* Close Button on Mobile */}
            <button
              onClick={() => setMobileOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* Active Record Context Pill if selected */}
          {selectedRecordId && (
            <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
                <span className="text-slate-400">Active Asset:</span>
                <span className="text-emerald-400 font-bold truncate">{selectedRecordId}</span>
              </div>
              <button
                onClick={() => setSelectedRecordId(null)}
                className="text-slate-400 hover:text-rose-400 px-1 hover:bg-slate-800/80 rounded transition"
                title="Clear context focus"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tab Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Quick Record Navigation & Creation */}
          <div className="space-y-1.5 pb-2 border-b border-slate-800/60">
            <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase flex items-center justify-between">
              <span>Record Management</span>
            </div>
            
            <button
              onClick={() => {
                setAppFlow('record_selection');
                if (setMobileOpen) setMobileOpen(false);
              }}
              className="w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/30 transition text-slate-300"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500/20 transition">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300">Decision Hub</div>
                  <div className="text-[10px] text-slate-500">Switch or pick record</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-emerald-400 transition" />
            </button>

            <button
              onClick={() => {
                setAppFlow('onboarding');
                if (setMobileOpen) setMobileOpen(false);
              }}
              className="w-full group flex items-center justify-between px-3 py-2 rounded-xl text-left bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 transition text-emerald-300"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="p-1 rounded-lg bg-emerald-500/20 text-emerald-300">
                  <Plus className="w-3.5 h-3.5" />
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-emerald-200">New Record</div>
                  <div className="text-[10px] text-emerald-400/70">Open onboarding</div>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold bg-emerald-500/30 text-emerald-200 px-1.5 py-0.5 rounded">
                +ADD
              </span>
            </button>
          </div>

          <div className="px-3 pt-1 text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
            Core Modules
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent text-emerald-300 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded-lg transition ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40'
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-semibold tracking-tight truncate leading-tight">
                      {item.label}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${item.badgeColor}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Persistent User & Telemetry Footer */}
        <div className="p-3.5 border-t border-slate-800/80 bg-[#090d16]/90 space-y-3">
          

          {/* User Profile Card */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-200 truncate leading-tight">
                  {currentUser.name}
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate leading-tight">
                  {maskPii(currentUser.email, 'email')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setAuthStatus('session_locked')}
                title="Lock Session"
                className="p-1 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-slate-800 transition"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={logoutToGateway}
                title="Log Out to Gateway"
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>


        </div>
      </aside>
    </>
  );
}
