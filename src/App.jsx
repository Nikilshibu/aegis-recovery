import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/common/Sidebar';
import { TopScoreboard } from './components/dashboard/TopScoreboard';
import { HistoricalRecoveryTable } from './components/dashboard/HistoricalRecoveryTable';
import { RegisteredAccountDashboard } from './components/dashboard/RegisteredAccountDashboard';
import { RecordDrillDownDrawer } from './components/dashboard/RecordDrillDownDrawer';
import { PredictiveRunway } from './components/dashboard/PredictiveRunway';
import { ActionCenter } from './components/dashboard/ActionCenter';
import { LeakageDecompositions } from './components/dashboard/LeakageDecompositions';
import { SecurityComplianceTab } from './components/dashboard/SecurityComplianceTab';
import { AdaptiveIngestionEngine } from './components/ingestion/AdaptiveIngestionEngine';
import { PaymentsBillingTerminal } from './components/payments/PaymentsBillingTerminal';
import { AiCustomerSupportCenter } from './components/support/AiCustomerSupportCenter';
import { GatewayLogin } from './components/auth/GatewayLogin';
import { EmailOtpVerificationModal } from './components/auth/EmailOtpVerificationModal';
import { AuthModal } from './components/auth/AuthModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { OutreachPanel } from './components/dashboard/OutreachPanel';
import { SourceVerificationModal } from './components/dashboard/SourceVerificationModal';
import { ComplianceCertModal } from './components/common/ComplianceCertModal';
import { EmailDispatchCenterModal } from './components/common/EmailDispatchCenterModal';
import { RecordDecisionHub } from './components/dashboard/RecordDecisionHub';
import { GlobalVoiceSentinelModal } from './components/common/GlobalVoiceSentinelModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import {
  ShieldCheck,
  Menu,
  X,
  Mail,
  MessageSquare,
  Lock,
  Eye,
  EyeOff,
  Bell,
  Sliders,
  Sparkles,
  Activity,
  HardDriveDownload,
  CreditCard,
  Headphones,
  FileSpreadsheet,
  LayoutDashboard,
  Layers,
  CheckCircle2
} from 'lucide-react';

export function App() {
  const {
    appFlow,
    setAppFlow,
    currentTab,
    navigateToTab,
    entityType,
    userRole,
    monetaryThreshold,
    currentProfile,
    formatCurrency,
    outboundChannel,
    outboundEmail,
    outboundPhone,
    isPiiMasked,
    setIsPiiMasked,
    addAuditLog,
    supabaseStatus,
    currentUser,
    setAuthStatus,
    isEmailCenterOpen,
    setIsEmailCenterOpen,
    emailDispatches,
    selectedRecordId,
    setSelectedRecordId,
    recordSuccessAlert,
    setRecordSuccessAlert,
    autoMailToast,
    setAutoMailToast
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 1. Gateway Login Screen (NO voice assistant on login page)
  if (appFlow === 'gateway') {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans relative">
        <GatewayLogin />
      </div>
    );
  }

  // 2. OTP Verification Barrier (NO voice assistant on verification)
  if (appFlow === 'otp_verification') {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans relative">
        <GatewayLogin />
        <EmailOtpVerificationModal />
      </div>
    );
  }

  // 3. Decision Dashboard (NO SIDEBAR ON EITHER SIDE, NO login voice overlay)
  if (appFlow === 'record_selection' || appFlow === 'decision_hub') {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans relative">
        <RecordDecisionHub />
      </div>
    );
  }

  // 4. Onboarding flow for New Record
  if (appFlow === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans flex items-center justify-center p-4 relative">
        <OnboardingModal />
      </div>
    );
  }

  // Map active tab to human readable breadcrumbs
  const getTabTitle = () => {
    switch (currentTab) {
      case 'dashboard': return 'Dashboard Hub & Analytics';
      case 'ledger': return 'Records Ledger & Asset Matrix';
      case 'ingestion': return 'Data Ingestion Engine & Pending Queue';
      case 'payments': return 'Payments & Billing Terminal';
      case 'support': return 'AI Customer Support Center (Voice + LLM)';
      case 'security': return 'Security, Compliance & Infrastructure Guardrails';
      default: return 'Dashboard Hub';
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex font-sans selection:bg-emerald-500/20 selection:text-emerald-300">
      
      {/* MODULE 2: UNIFIED PERSISTENT SIDEBAR NAVIGATION */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Sticky App Bar */}
        <header className="sticky top-0 z-30 h-16 bg-[#090d16]/95 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Title */}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-500 hidden sm:inline">
                  AegisRecover &gt;
                </span>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  {getTabTitle()}
                </h1>
              </div>
            </div>
          </div>

          {/* Streamlined Top Bar (Redundant badges removed) */}
          <div className="flex items-center gap-3">
            {selectedRecordId && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs font-mono shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-slate-400 hidden sm:inline">Active Context:</span>
                <span className="text-emerald-300 font-bold">{selectedRecordId}</span>
                <button
                  onClick={() => setSelectedRecordId(null)}
                  className="ml-1 text-slate-500 hover:text-slate-200 text-xs font-bold"
                  title="Clear per-record context filter"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Return to Decision Hub Button */}
            <button
              onClick={() => setAppFlow('record_selection')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 transition"
              title="Return to Decision Hub (No Sidebars)"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Decision Hub</span>
            </button>

            {/* Lock Session Button */}
            <button
              onClick={() => setAuthStatus('session_locked')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-300 transition"
              title="Lock Zero-Trust Session"
            >
              <Lock className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Workspace Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6">
          
          {/* Layout Success Alert Banner for Newly Created Records */}
          {recordSuccessAlert?.visible && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-glow-emerald animate-in slide-in-from-top-3 duration-300 mb-6">
              <div className="flex items-center gap-3.5">
                <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-2 text-sm">
                    <span>New Record Created & Synced to Supabase</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {recordSuccessAlert.recordId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 font-mono">
                    {recordSuccessAlert.message} All sidebar tabs are now locked to this record context.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRecordSuccessAlert(null)}
                className="p-1.5 rounded-xl text-emerald-400 hover:text-white hover:bg-emerald-900/40 transition shrink-0"
              >
                ✕
              </button>
            </div>
          )}

          {/* Real-Time Auto-Mail Dispatch Confirmation Banner */}
          {autoMailToast?.visible && (
            <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-emerald-950/95 via-slate-900 to-sky-950/95 border border-emerald-500/60 text-slate-100 shadow-2xl shadow-glow-emerald animate-in slide-in-from-top-3 duration-300 mb-6 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="font-mono min-w-0">
                    <div className="font-bold text-white flex items-center gap-2 text-xs sm:text-sm truncate">
                      <span>{autoMailToast.title || 'Automated Email Dispatched via Resend API'}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        CONFIRMED
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 truncate">
                      {autoMailToast.message}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>Recipient: <strong className="text-emerald-400">{autoMailToast.recipient}</strong></span>
                      <span>•</span>
                      <span>Delivery ID: <strong className="text-slate-300">{autoMailToast.dispatchId}</strong></span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setAutoMailToast(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          <ErrorBoundary>
            {/* TAB 1: DASHBOARD HUB (REGISTERED ACCOUNT PAST RECORDS & DYNAMIC INSIGHTS) */}
            {currentTab === 'dashboard' && (
              <RegisteredAccountDashboard />
            )}

            {/* TAB 2: RECORDS LEDGER */}
            {currentTab === 'ledger' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <HistoricalRecoveryTable />
              </div>
            )}

            {/* TAB 3: DATA INGESTION ENGINE (MODULE 4 & 5) */}
            {currentTab === 'ingestion' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <AdaptiveIngestionEngine />
              </div>
            )}

            {/* TAB 4: PAYMENTS & BILLING TERMINAL (MODULE 6) */}
            {currentTab === 'payments' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <PaymentsBillingTerminal />
              </div>
            )}

            {/* TAB 5: AI CUSTOMER SUPPORT CENTER (MODULE 3 - VOICE ASSISTANT) */}
            {currentTab === 'support' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <AiCustomerSupportCenter />
              </div>
            )}

            {/* TAB 6: SECURITY & COMPLIANCE (MODULE 8) */}
            {currentTab === 'security' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <SecurityComplianceTab />
              </div>
            )}
          </ErrorBoundary>

        </main>


      </div>

      {/* Interactive Modal & Slide-Over Systems */}
      <RecordDrillDownDrawer />
      <AuthModal />
      <OnboardingModal />
      <OutreachPanel />
      <SourceVerificationModal />
      <ComplianceCertModal />
      <EmailDispatchCenterModal
        isOpen={isEmailCenterOpen}
        onClose={() => setIsEmailCenterOpen(false)}
      />
      {/* Voice Assistant ONLY mounted on AI Customer Support tab */}
      {currentTab === 'support' && <GlobalVoiceSentinelModal />}

    </div>
  );
}
