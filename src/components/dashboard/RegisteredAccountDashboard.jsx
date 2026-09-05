import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Globe2,
  Sparkles,
  ExternalLink,
  DollarSign,
  CreditCard,
  Headphones,
  FileText,
  ChevronRight,
  Layers,
  Scale,
  Send,
  X,
  TrendingUp,
  Activity,
  Sliders
} from 'lucide-react';
import { PredictiveRunway } from './PredictiveRunway';
import { ActionCenter } from './ActionCenter';
import { LeakageDecompositions } from './LeakageDecompositions';

export function RegisteredAccountDashboard() {
  const {
    currentUser,
    currentProfile,
    entityType,
    historicalRecords,
    selectedDashboardRecord,
    setSelectedDashboardRecord,
    navigateToTab,
    formatCurrency,
    maskPii,
    welcomeNotification,
    setWelcomeNotification,
    paymentsLedger,
    triggerPaymentReminderNotification
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Reclaimed' | 'Active Dunning' | 'In-Arbitration'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dashboardViewMode, setDashboardViewMode] = useState('all'); // 'all' | 'forecasting' | 'records'

  // Filter records belonging to this registered account
  const accountRecords = historicalRecords || [];

  // Active Record Focus (Always non-null: defaults to selected or first record)
  const activeRecord = selectedDashboardRecord || accountRecords[0] || {
    id: 'REC-2026-9041',
    vendor: 'Snowflake Enterprise Data Cloud',
    amountInitial: 6350,
    amountRecovered: 6350,
    category: 'Contract Tier Discrepancy',
    status: 'Reclaimed',
    causeAnalysis: 'Clause 8.1 Compute Multiplier variance parsed from invoice PDF. Recoverable variance: $6,350.00.',
    metaValues: {
      invoiceId: 'SNOW-INV-2026-9041',
      slaSection: 'Section 8.1 Compute Multiplier',
      ledgerTxn: 'TXN-9021-VAR',
      detectionLatency: '24ms',
      confidenceScore: 99
    }
  };

  const filteredRecords = accountRecords.filter(rec => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      rec.vendor?.toLowerCase().includes(query) ||
      rec.id?.toLowerCase().includes(query) ||
      rec.category?.toLowerCase().includes(query) ||
      rec.metaValues?.invoiceId?.toLowerCase().includes(query) ||
      rec.entityName?.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || rec.category === categoryFilter;

    return matchesQuery && matchesStatus && matchesCategory;
  });

  // Calculate registered account totals
  const totalAccountRecordsCount = accountRecords.length;
  const totalAccountRecovered = accountRecords
    .filter(r => r.status === 'Reclaimed')
    .reduce((sum, r) => sum + (r.amountRecovered || r.amountInitial || 0), 0);
  const totalAccountAtRisk = accountRecords
    .filter(r => r.status !== 'Reclaimed')
    .reduce((sum, r) => sum + (r.amountInitial || 0), 0);

  // Related payment for active record
  const relatedPayment = paymentsLedger?.find(p => p.recordId === activeRecord.id) || {
    id: `PAY-${activeRecord.id?.replace('REC-2026-', '') || '9041'}`,
    vendor: activeRecord.vendor,
    amount: activeRecord.amountInitial,
    statusStep: activeRecord.status === 'Reclaimed' ? 'recovered' : 'disputed',
    invoiceId: activeRecord.metaValues?.invoiceId || 'INV-2026-9041',
    dateCreated: activeRecord.dateLogged,
    executionTimestamp: 'Pending SLA Finalization'
  };

  // Helper for status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'Reclaimed':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-glow-emerald">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Reclaimed
          </span>
        );
      case 'Active Dunning':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-amber-400" />
            Active Dunning
          </span>
        );
      case 'In-Arbitration':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            In-Arbitration
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Notification Banner (Dispatched on Login) */}
      {welcomeNotification?.visible && (
        <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-sky-950/80 border border-emerald-500/40 text-xs text-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-glow-emerald animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base flex items-center gap-2">
                <span>{welcomeNotification.title || `Welcome, ${currentUser.name}!`}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  SESSION ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {welcomeNotification.message || `Displaying live telemetry, stochastic demand forecasting, and business anomalies for ${currentUser.name}.`}
              </p>
            </div>
          </div>

          <button
            onClick={() => setWelcomeNotification({ ...welcomeNotification, visible: false })}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Top Header: Account Overview & Primary Actions */}
      <div className="glass-panel p-6 sm:p-7 rounded-3xl border border-slate-800 bg-[#0f172a]/90 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-2xl">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              DASHBOARD HUB & ANALYTICS
            </span>
            <span className="text-xs font-mono text-slate-400">• Demand Forecasting & Business Anomalies</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Record Details, Stochastic Forecasting & Anomalies
          </h1>
          
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
            Account: <strong className="text-white">{currentUser.name}</strong> (<span className="text-slate-300 font-mono">{currentUser.email}</span>) • UUID: <span className="font-mono text-emerald-400">{currentUser.uuid}</span>.
            Real-time demand forecasting runway, business anomaly alerts, and active dispute recovery matrix.
          </p>
        </div>

        {/* PRIMARY CTAs & View Switcher */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            id="create-new-record-btn"
            onClick={() => navigateToTab('ingestion')}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-glow-emerald transition flex items-center gap-2 transform hover:scale-[1.02]"
          >
            <PlusCircle className="w-5 h-5" />
            <span>+ Create New Record</span>
          </button>

          <button
            onClick={() => navigateToTab('payments')}
            className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold text-xs font-mono transition flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>Payments Terminal</span>
          </button>
        </div>
      </div>

      {/* Account Scorecards: Summary of Registered Account */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>REGISTERED ACCOUNT RECORDS</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
              ONLINE
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {totalAccountRecordsCount} Past Records
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Active Focus: <span className="text-emerald-400 font-bold">{activeRecord.vendor}</span>
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>ACCOUNT RECOVERED CAPITAL</span>
            <span className="text-emerald-400 font-bold font-mono">+100% Reclaimed</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">
            {formatCurrency(totalAccountRecovered)}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Directly reclaimed to escrow
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>IN-FLIGHT CLAIMS / DISPUTES</span>
            <span className="text-amber-400 font-bold font-mono">Active</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400">
            {formatCurrency(totalAccountAtRisk)}
          </div>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            Pending peer confirmation & dunning
          </p>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* RECORD CONTEXT SWITCHER: Allows Switching Active Record Focus in 1 Click!     */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-[#0b101b] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">Active Record Context Focus:</span>
            <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/30">
              {activeRecord.id} • {activeRecord.vendor} ({formatCurrency(activeRecord.amountInitial)})
            </span>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDashboardViewMode('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                dashboardViewMode === 'all'
                  ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Sections
            </button>
            <button
              onClick={() => setDashboardViewMode('forecasting')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                dashboardViewMode === 'forecasting'
                  ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Forecasting & Anomalies Focus
            </button>
            <button
              onClick={() => setDashboardViewMode('records')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                dashboardViewMode === 'records'
                  ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Past Records Matrix
            </button>
          </div>
        </div>

        {/* Quick-Switch Record Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-800">
          {accountRecords.map(rec => {
            const isSelected = rec.id === activeRecord.id;
            return (
              <button
                key={rec.id}
                onClick={() => setSelectedDashboardRecord(rec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-glow-emerald font-bold'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                <span>{rec.vendor}</span>
                <span className={isSelected ? 'text-emerald-400 font-black' : 'text-slate-500'}>
                  {formatCurrency(rec.amountInitial)}
                </span>
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* SECTION A: ACTIVE RECORD DETAILS & AUDIT CAUSE ANALYSIS                        */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {dashboardViewMode !== 'records' && (
        <div className="space-y-6">
          
          {/* Active Record Detail Banner */}
          <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-emerald-500/40 bg-[#0f172a]/95 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl shadow-glow-emerald">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ACTIVE RECORD CONTEXT DETAILS
                </span>
                <span className="text-xs font-mono text-slate-400">• ID: {activeRecord.id}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1 flex items-center gap-2">
                <span>{activeRecord.vendor}</span>
                <span className="text-emerald-400 font-mono text-lg">({formatCurrency(activeRecord.amountInitial)})</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Invoice: <span className="text-slate-200">{activeRecord.metaValues?.invoiceId || 'INV-2026-9041'}</span> • Category: <span className="text-slate-200">{activeRecord.category}</span> • Status: <span className="text-emerald-400 font-bold">{activeRecord.status}</span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigateToTab('payments', { recordId: activeRecord.id })}
                className="px-3 py-2 rounded-2xl bg-slate-900 border border-slate-700 hover:border-sky-400 text-sky-300 text-xs font-mono font-semibold transition flex items-center gap-1.5"
              >
                <CreditCard className="w-4 h-4 text-sky-400" />
                <span>Payment Milestones</span>
              </button>

              <button
                onClick={() => triggerPaymentReminderNotification(relatedPayment)}
                className="px-3 py-2 rounded-2xl bg-sky-500/20 border border-sky-500/40 hover:bg-sky-500/30 text-sky-300 text-xs font-mono font-semibold transition flex items-center gap-1.5"
                title="Dispatch Resend Overdue/Pending Payment Reminder Email"
              >
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span>Dispatch Resend Reminder</span>
              </button>
            </div>
          </div>

          {/* Active Record Scorecard (Data calculated based on this record) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>RECOVERABLE CAPITAL</span>
                <span className="text-emerald-400 font-bold">Verified</span>
              </div>
              <div className="text-2xl font-black font-mono text-white">
                {formatCurrency(activeRecord.amountInitial)}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Variance calculated from scan audit
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>AMOUNT RECLAIMED</span>
                <span className="text-emerald-400 font-bold">
                  {activeRecord.status === 'Reclaimed' ? '100% Reclaimed' : 'In Escalation'}
                </span>
              </div>
              <div className="text-2xl font-black font-mono text-emerald-400">
                {formatCurrency(activeRecord.amountRecovered || (activeRecord.status === 'Reclaimed' ? activeRecord.amountInitial : 0))}
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Net proceeds routed to treasury
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>SLA LATE PENALTY</span>
                <span className="text-rose-400 font-bold">Contract Clause</span>
              </div>
              <div className="text-2xl font-black font-mono text-rose-400">
                +$450.00
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Late Remittance Fee (MSA §4.2)
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-5 border border-slate-800 bg-[#0b101b]">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>AUDIT CONFIDENCE</span>
                <span className="text-sky-400 font-bold font-mono">99.2%</span>
              </div>
              <div className="text-2xl font-black font-mono text-sky-400">
                {activeRecord.metaValues?.confidenceScore || 99}%
              </div>
              <p className="text-xs text-slate-500 mt-1 font-mono">
                Cryptographic hash verified
              </p>
            </div>
          </div>

          {/* Cause Analysis & Contract Discrepancy Breakdown for this record */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800 bg-[#0b101b] space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Audit Cause Analysis & Evidence for {activeRecord.vendor}</span>
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
              {activeRecord.causeAnalysis}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono text-slate-400 pt-1">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500">Contract Clause:</span> <strong className="text-slate-200">{activeRecord.metaValues?.slaSection || 'Section 8.1 Compute Multiplier'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500">Ledger Reference:</span> <strong className="text-slate-200">{activeRecord.metaValues?.ledgerTxn || 'TXN-9021-VAR'}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-500">Detection Latency:</span> <strong className="text-emerald-400">{activeRecord.metaValues?.detectionLatency || '32ms'}</strong>
              </div>
            </div>
          </div>

          {/* ───────────────────────────────────────────────────────────────────────────── */}
          {/* FEATURE 1: STOCHASTIC DEMAND FORECASTING RUNWAY & BUSINESS ANOMALIES           */}
          {/* ───────────────────────────────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Feature 1: Predictive Runway & Stochastic Demand Forecasting for {activeRecord.vendor}</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Stochastic Model Active
              </span>
            </div>
            <PredictiveRunway />
          </div>

          {/* ───────────────────────────────────────────────────────────────────────────── */}
          {/* FEATURE 2: AI ACTION CENTER INBOX                                             */}
          {/* ───────────────────────────────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Feature 2: Autonomous Remediation & Dunning Actions for {activeRecord.vendor}</span>
              </div>
            </div>
            <ActionCenter />
          </div>

          {/* ───────────────────────────────────────────────────────────────────────────── */}
          {/* FEATURE 3: ADVANCED LEAKAGE DECOMPOSITIONS & DETECTED OPERATIONAL ANOMALIES   */}
          {/* ───────────────────────────────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span>Feature 3: Contract Discrepancy & Detected Operational Anomalies</span>
              </div>
            </div>
            <LeakageDecompositions />
          </div>

        </div>
      )}

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* SECTION B: PAST RECORDS MATRIX FOR REGISTERED ACCOUNT                          */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {dashboardViewMode !== 'forecasting' && (
        <div className="glass-panel rounded-3xl border border-slate-800 bg-[#0b101b] p-5 sm:p-6 shadow-2xl space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Account Past Records & Capital Recovery Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any record to inspect its dedicated demand forecasting, operational anomalies, and cause analysis above.
              </p>
            </div>

            <div className="text-xs font-mono text-slate-400">
              {filteredRecords.length} Records Scoped
            </div>
          </div>

          {/* Table Controls: Search & Status Filters */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search past records by vendor, invoice ID, or category..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono transition"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800 overflow-x-auto">
              {[
                { id: 'all', label: 'All Records' },
                { id: 'Reclaimed', label: '✓ Reclaimed' },
                { id: 'Active Dunning', label: '⏳ Active Dunning' },
                { id: 'In-Arbitration', label: '⚖ In-Arbitration' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                    statusFilter === f.id
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Element */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="text-[11px] uppercase tracking-wider text-slate-500 font-mono border-b border-slate-800">
                <tr>
                  <th className="pb-3 pl-2">Record ID</th>
                  <th className="pb-3">Vendor / Enclave</th>
                  <th className="pb-3">Invoice ID</th>
                  <th className="pb-3">Discrepancy Category</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-center">Status</th>
                  <th className="pb-3 text-center">Date Logged</th>
                  <th className="pb-3 text-right pr-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(record => {
                    const isSelected = record.id === activeRecord.id;
                    return (
                      <tr
                        key={record.id}
                        onClick={() => {
                          setSelectedDashboardRecord(record);
                          window.scrollTo({ top: 180, behavior: 'smooth' });
                        }}
                        className={`hover:bg-slate-900/80 cursor-pointer transition group ${
                          isSelected ? 'bg-emerald-950/25 border-l-2 border-emerald-400' : ''
                        }`}
                      >
                        {/* Record ID */}
                        <td className="py-3.5 pl-2">
                          <span className={`px-2 py-1 rounded font-bold border text-[11px] transition ${
                            isSelected
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                              : 'bg-slate-800/90 text-emerald-400 border-slate-700 group-hover:border-emerald-500/40'
                          }`}>
                            {record.id}
                          </span>
                        </td>

                        {/* Vendor */}
                        <td className="py-3.5 font-sans font-bold text-white text-sm">
                          <div className="flex items-center gap-2">
                            <span>{record.vendor}</span>
                            {isSelected && (
                              <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Invoice ID */}
                        <td className="py-3.5 text-slate-400">
                          {record.metaValues?.invoiceId || record.invoiceId || 'INV-2026-9041'}
                        </td>

                        {/* Category */}
                        <td className="py-3.5 text-slate-300 font-sans text-xs">
                          {record.category}
                        </td>

                        {/* Amount */}
                        <td className="py-3.5 text-right font-bold text-white text-sm">
                          {formatCurrency(record.amountInitial)}
                        </td>

                        {/* Status Badge */}
                        <td className="py-3.5 text-center">
                          <div className="inline-flex justify-center">
                            {renderStatusBadge(record.status)}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 text-center text-slate-500 text-[11px]">
                          {record.dateLogged}
                        </td>

                        {/* Action Button */}
                        <td className="py-3.5 text-right pr-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDashboardRecord(record);
                              window.scrollTo({ top: 180, behavior: 'smooth' });
                            }}
                            className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition flex items-center gap-1.5 ml-auto ${
                              isSelected
                                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald'
                                : 'bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 border-emerald-500/30 group-hover:shadow-glow-emerald'
                            }`}
                          >
                            <span>{isSelected ? 'Focused' : 'Inspect in Analytics'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-500">
                      <p className="text-sm">No past records matching active filters.</p>
                      <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                        className="mt-2 text-xs text-emerald-400 hover:underline"
                      >
                        Clear search filters
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Instructional Footer */}
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Click any record row to focus its dedicated predictive runway, root cause, and remediation actions.</span>
            </div>
            <div className="text-slate-500">
              {filteredRecords.length} of {accountRecords.length} records displayed
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
