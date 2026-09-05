import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  PlusCircle,
  FolderOpen,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  Building2,
  CheckCircle2,
  Clock,
  LogOut,
  ChevronRight,
  TrendingUp,
  FileText,
  AlertCircle
} from 'lucide-react';

export function RecordDecisionHub() {
  const {
    currentUser,
    setAppFlow,
    historicalRecords,
    setSelectedRecordId,
    setSelectedDashboardRecord,
    setCurrentTab,
    formatCurrency,
    logoutToGateway,
    entityType
  } = useApp();

  // Handler for creating a new record -> routes to onboarding page
  const handleCreateNewRecord = () => {
    setAppFlow('onboarding');
  };

  // Handler for opening existing record -> routes to dashboard with DETAILS OF THAT RECORD
  const handleOpenExistingRecord = (recordId = null) => {
    const targetRecord = (recordId ? historicalRecords.find(r => r.id === recordId) : null) || historicalRecords[0];
    if (targetRecord) {
      if (setSelectedDashboardRecord) {
        setSelectedDashboardRecord(targetRecord);
      }
      setSelectedRecordId(targetRecord.id);
    }
    setCurrentTab('dashboard');
    setAppFlow('dashboard');
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* ─── TOP HEADER (NO SIDEBAR ON EITHER SIDE) ─── */}
      <header className="w-full bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800/80 px-6 sm:px-10 py-4 flex items-center justify-between">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-sky-500/15 to-indigo-500/20 border border-emerald-500/40 text-emerald-400 shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black text-white tracking-tight">AegisRecover</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-mono text-emerald-400">
                Decision Hub
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Zero-Trust Autonomous Capital Recovery
            </p>
          </div>
        </div>

        {/* User Profile Pill & Sign Out */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt=""
                className="w-7 h-7 rounded-lg object-cover border border-slate-700"
              />
            ) : (
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-200 truncate max-w-[160px]">
                {currentUser?.name || 'Verified User'}
              </div>
              <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                <span>OTP Verified</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={logoutToGateway}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-rose-400 transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT CONTAINER (CENTERED, NO SIDEBAR) ─── */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Welcome Hero */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Active Session Authenticated · Select Route
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            How would you like to proceed?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
            Choose whether to start a new recovery record onboarding or access your existing account records ledger with full sidebar navigation.
          </p>
        </div>

        {/* ─── TWO DECISION CARDS ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* CARD 1: CREATE A NEW RECORD */}
          <div className="group relative bg-[#0f172a]/90 border border-slate-800 hover:border-emerald-500/60 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/40 hover:-translate-y-1">
            
            {/* Hover Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-t-3xl opacity-80 group-hover:opacity-100 transition" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  <PlusCircle className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
                  New Intake
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Create a New Record
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Start a fresh recovery intake or asset onboarding. Configure company details, ingestion pathways, contract SLA clauses, and autonomous dunning thresholds.
              </p>

              {/* Highlights */}
              <div className="space-y-2.5 mb-8">
                {[
                  'Guided Multi-Tiered Onboarding Wizard',
                  'Dual-Inlet Document & Invoice Parsing',
                  'Autonomous Dunning & SLA Escrow Configuration'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleCreateNewRecord}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition active:scale-[0.99]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Onboarding Wizard</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          {/* CARD 2: ACCESS EXISTING RECORD */}
          <div className="group relative bg-[#0f172a]/90 border border-slate-800 hover:border-sky-500/60 rounded-3xl p-7 sm:p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-sky-950/40 hover:-translate-y-1">
            
            {/* Hover Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-t-3xl opacity-80 group-hover:opacity-100 transition" />

            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  <FolderOpen className="w-7 h-7" />
                </div>
                <span className="px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-xs font-mono font-bold text-sky-400">
                  Left Sidebar Workspace
                </span>
              </div>

              <h3 className="text-xl font-bold text-white tracking-tight mb-2">
                Access Existing Records
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Open your active recovery ledger, dispute cases, and analytics. Launches the complete workspace with the persistent left sidebar for detailed management.
              </p>

              {/* Existing Record Quick Picker */}
              <div className="space-y-2.5 mb-6">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="uppercase tracking-wider">Active Recovery Assets:</span>
                  <span className="text-emerald-400">Click to open record details</span>
                </div>
                {historicalRecords.slice(0, 3).map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleOpenExistingRecord(rec.id)}
                    className="p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/60 flex items-center justify-between cursor-pointer transition-all duration-200 group/rec hover:shadow-lg hover:shadow-emerald-950/30 hover:scale-[1.01]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 group-hover/rec:bg-emerald-500/20 group-hover/rec:text-emerald-300 group-hover/rec:border-emerald-500/40 transition">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-200 group-hover/rec:text-emerald-300 transition truncate">
                          {rec.vendor}
                        </div>
                        <div className="text-[10px] font-mono text-slate-400 mt-0.5 truncate">
                          {rec.id} • {rec.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0 ml-3 flex items-center gap-3">
                      <div>
                        <div className="text-xs font-mono font-bold text-emerald-400">
                          {formatCurrency(rec.amountRecovered || rec.amountInitial)}
                        </div>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                          {rec.status}
                        </span>
                      </div>
                      <span className="p-1.5 rounded-lg bg-slate-800 group-hover/rec:bg-emerald-500 group-hover/rec:text-slate-950 text-slate-400 transition">
                        <ArrowRight className="w-3.5 h-3.5 group-hover/rec:translate-x-0.5 transition" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenExistingRecord()}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-sky-950/40 transition active:scale-[0.99]"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Open Record Details &amp; Left Sidebar</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="w-full text-center py-4 border-t border-slate-800/60 text-[11px] text-slate-500 font-mono">
        AegisRecover · Certified Zero-Trust Infrastructure · SOC 2 Type II
      </footer>
    </div>
  );
}
