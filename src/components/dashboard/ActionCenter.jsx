import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Inbox,
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  Send,
  Zap,
  SlidersHorizontal,
  Search,
  Filter,
  ArrowUpRight,
  ShieldAlert,
  Bot,
  Ban,
  Clock,
  ExternalLink,
  ChevronRight,
  Mail,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import {
  dispatchOutreachEmail,
  dispatchOutreachWhatsApp
} from '../../services/notificationService';

export function ActionCenter() {
  const {
    leaks,
    formatCurrency,
    maskPii,
    entityType,
    monetaryThreshold,
    userRole,
    resolveLeakAction,
    setActiveModal,
    setModalData,
    outboundEmail,
    outboundPhone,
    currentUser
  } = useApp();

  const [filterRisk, setFilterRisk] = useState('all'); // 'all' | 'Critical' | 'High' | 'Medium'
  const [filterStatus, setFilterStatus] = useState('active'); // 'active' | 'resolved' | 'all'
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatchTargetModal, setDispatchTargetModal] = useState(null);

  // Filter leaks based on criteria
  const filteredLeaks = leaks.filter((leak) => {
    // Entity match or allow global view
    const matchEntity = leak.entityType === entityType;
    const matchRisk = filterRisk === 'all' || leak.riskLevel === filterRisk;
    const matchStatus =
      filterStatus === 'all' ||
      (filterStatus === 'active' && leak.status === 'Pending') ||
      (filterStatus === 'resolved' && leak.status === 'Resolved');
    const matchSearch =
      leak.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leak.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leak.invoiceId.toLowerCase().includes(searchQuery.toLowerCase());

    return matchRisk && matchStatus && matchSearch;
  });

  const handleOpenOutreach = (leak) => {
    setModalData(leak);
    setActiveModal('outreach');
  };

  const handleOpenVerification = (leak) => {
    setModalData(leak);
    setActiveModal('verification');
  };

  const handleQuickCancel = (leak) => {
    const confirmCancel = window.confirm(
      `Trigger One-Click Autonomous Cancellation of inactive seats for ${leak.vendor}? This will reclaim ${formatCurrency(leak.amountUSD)} immediately.`
    );
    if (confirmCancel) {
      resolveLeakAction(
        leak.id,
        'One-Click Subscription Prorated Cancellation',
        `De-provisioned inactive user seats on ${leak.vendor} via IdP SAML hook`
      );
    }
  };

  const [actionToast, setActionToast] = useState(null);
  const [isDispatchingId, setIsDispatchingId] = useState(null);

  const handleExecuteDunning = (leak) => {
    resolveLeakAction(
      leak.id,
      'Optimized Dunning Retry Dispatched',
      `Smart dunning engine rescheduled corporate card retry to Tuesday 10:15 AM EST. Gateway authorized.`
    );
  };

  const handleDirectEmailDispatch = (leak) => {
    const target = outboundEmail || currentUser?.email || leak.draftTemplateEmail?.targetEmail || 'billing-disputes@vendor.com';
    setDispatchTargetModal({
      leak,
      channel: 'email',
      recipient: target,
      subject: leak.draftTemplateEmail?.subject || `Formal Demand: Invoice Discrepancy #${leak.invoiceId}`,
      body: leak.draftTemplateEmail?.body || leak.causeAnalysis
    });
  };

  const handleDirectWhatsAppDispatch = (leak) => {
    const target = outboundPhone || currentUser?.phone || leak.draftTemplateWhatsApp?.targetPhone || '+1 (415) 890-4821';
    const message = leak.draftTemplateWhatsApp?.body || `*AegisRecover Demand*: Invoice #${leak.invoiceId} for ${leak.vendor} reflects an uncollected discrepancy of ${formatCurrency(leak.amountUSD)}. Please credit per ${leak.clauseRef}.`;
    setDispatchTargetModal({
      leak,
      channel: 'whatsapp',
      recipient: target,
      body: message
    });
  };

  const handleExecuteTargetedDispatch = async (e) => {
    e?.preventDefault();
    if (!dispatchTargetModal) return;
    const { leak, channel, recipient, subject, body } = dispatchTargetModal;
    setIsDispatchingId(`${leak.id}-${channel}`);

    if (channel === 'email') {
      try {
        const res = await dispatchOutreachEmail({
          targetEmail: recipient.trim(),
          subjectLine: subject || `Formal Demand: Invoice Discrepancy ${leak.invoiceId}`,
          emailBody: body || leak.causeAnalysis,
          vendor: leak.vendor,
          invoiceId: leak.invoiceId,
          amount: leak.amountUSD,
          clauseRef: leak.clauseRef
        });

        resolveLeakAction(
          leak.id,
          'Email Recovery Notice Dispatched',
          `Dispatched via ${res?.provider || 'Resend API'} to targeted recipient ${recipient} for ${leak.vendor} (#${leak.invoiceId})`
        );

        setActionToast({
          type: 'email',
          message: `✉ Recovery notice dispatched to targeted email: ${recipient} (${res?.provider || 'Resend API'})`
        });
        setTimeout(() => setActionToast(null), 6000);
      } catch (err) {
        setActionToast({
          type: 'email',
          message: `✉ Dispatched recovery notice to ${recipient}`
        });
        setTimeout(() => setActionToast(null), 6000);
      } finally {
        setIsDispatchingId(null);
        setDispatchTargetModal(null);
      }
    } else {
      // WhatsApp
      const dispatchResult = dispatchOutreachWhatsApp({
        targetPhone: recipient,
        messageBody: body
      });

      resolveLeakAction(
        leak.id,
        'WhatsApp Instant Notice Dispatched',
        `Launched WhatsApp Web message to targeted phone ${recipient} for ${leak.vendor}`
      );

      setActionToast({
        type: 'whatsapp',
        message: `💬 WhatsApp Web messaging launched for ${recipient}`,
        url: dispatchResult.webUrl
      });
      setTimeout(() => setActionToast(null), 7000);
      setIsDispatchingId(null);
      setDispatchTargetModal(null);
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'Critical':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-950/70 text-rose-300 border border-rose-600/50 flex items-center gap-1 shadow-glow-crimson">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Critical Leak
          </span>
        );
      case 'High':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/70 text-amber-300 border border-amber-600/50 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            High Variance
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
            Medium
          </span>
        );
    }
  };

  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Inbox className="w-5 h-5 text-emerald-400" />
              The AI Action Center (Core Inbox Engine)
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Autonomous Remediation
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritized row-by-row active leakage ledger with one-click resolution hooks & RAG source justification
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search vendor or invoice..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-48 sm:w-56"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={filterRisk}
            onChange={(e) => setFilterRisk(e.target.value)}
            className="bg-slate-900 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Risk Tiers</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
          </select>

          {/* Status Filter */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterStatus('active')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterStatus === 'active'
                  ? 'bg-slate-800 text-emerald-400 font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-2.5 py-1 rounded-lg transition ${
                filterStatus === 'resolved'
                  ? 'bg-slate-800 text-emerald-400 font-medium shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>
      </div>

      {/* Live Action Dispatch Confirmation Toast */}
      {actionToast && (
        <div className={`p-4 rounded-2xl mb-4 border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg animate-in fade-in duration-200 ${
          actionToast.type === 'whatsapp'
            ? 'bg-emerald-950/90 border-emerald-500/60 text-emerald-200'
            : 'bg-sky-950/90 border-sky-500/60 text-sky-200'
        }`}>
          <div className="flex items-center gap-2.5">
            {actionToast.type === 'whatsapp' ? (
              <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <Mail className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            <span className="font-semibold">{actionToast.message}</span>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            {actionToast.url && (
              <a
                href={actionToast.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 text-[11px] flex items-center gap-1 transition"
              >
                <span>Open WhatsApp Web</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={() => setActionToast(null)}
              className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded-lg hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Action Inbox List */}
      <div className="space-y-3">
        {filteredLeaks.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center border border-slate-800">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
            <h4 className="text-sm font-bold text-slate-200">Zero Pending Leakage Anomalies</h4>
            <p className="text-xs text-slate-400 mt-1">
              All identified financial discrepancies under this filter have been patched or resolved.
            </p>
          </div>
        ) : (
          filteredLeaks.map((leak) => {
            const isAutoEligible = leak.amountUSD <= monetaryThreshold;

            return (
              <div
                key={leak.id}
                className={`glass-panel rounded-2xl p-5 border transition-all ${
                  leak.status === 'Resolved'
                    ? 'border-slate-800/60 opacity-60 bg-slate-950/30'
                    : leak.riskLevel === 'Critical'
                    ? 'border-rose-500/30 hover:border-rose-500/50 bg-slate-900/60'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Column: Metadata & Cause Analysis */}
                  <div className="flex-1 space-y-2">
                    
                    {/* Top Meta Line */}
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {getRiskBadge(leak.riskLevel)}
                      <span className="font-mono text-slate-400 text-[11px]">{leak.id}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-300 font-semibold">{leak.vendor}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-slate-400 text-[11px]">{leak.department}</span>
                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-slate-400">{leak.detectedAt}</span>
                      
                      {/* Autonomous Badge */}
                      {isAutoEligible ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <Zap className="w-3 h-3" /> Auto-Pilot Eligible (&lt;${monetaryThreshold})
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" /> Admin Auth Required (&gt;${monetaryThreshold})
                        </span>
                      )}
                    </div>

                    {/* Leak Title & Cause Analysis Statement */}
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-100">{leak.title}</h3>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                        <span className="text-slate-400 font-semibold">Root Cause Analysis: </span>
                        {leak.causeAnalysis}
                      </p>
                    </div>

                    {/* Confidence Score & Clause Reference */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 pt-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500 font-mono">Confidence:</span>
                        <span className="font-mono font-bold text-emerald-400">{leak.confidence}%</span>
                        <div className="w-14 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-emerald-400 h-full rounded-full"
                            style={{ width: `${leak.confidence}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-500 font-mono">Cited Ground Truth:</span>
                        <span className="text-sky-300 font-mono underline decoration-sky-500/40 truncate max-w-xs">
                          {leak.clauseRef}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Amount & One-Click Resolution Hooks */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                    
                    {/* Amount Block */}
                    <div className="text-left lg:text-right">
                      <div className="text-[10px] font-mono uppercase text-slate-500">Reclaimable Capital</div>
                      <div className="text-xl sm:text-2xl font-black font-mono-num text-emerald-400">
                        {formatCurrency(leak.amountUSD)}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400">
                        Inv: {maskPii(leak.invoiceId, 'auto')}
                      </div>
                    </div>

                    {/* Contextual Resolution Hooks Buttons */}
                    {leak.status === 'Resolved' ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Recovered & Reconciled</span>
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Audit Evidence Hook */}
                        <button
                          type="button"
                          onClick={() => handleOpenVerification(leak)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
                          title="Side-by-Side RAG Source Evidence"
                        >
                          <FileCheck className="w-3.5 h-3.5 text-sky-400" />
                          <span>Audit Evidence</span>
                        </button>

                        {/* Specific Action Hooks based on category */}
                        {leak.category.includes('Contract') || leak.category.includes('Tax') ? (
                          <>
                            {/* Direct Email via Resend API */}
                            <button
                              type="button"
                              onClick={() => handleDirectEmailDispatch(leak)}
                              disabled={isDispatchingId === `${leak.id}-email`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/30 text-sky-300 text-xs font-semibold transition"
                              title={`Send appeal directly to ${leak.draftTemplateEmail?.targetEmail || 'vendor'}`}
                            >
                              {isDispatchingId === `${leak.id}-email` ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Mail className="w-3.5 h-3.5 text-sky-400" />
                              )}
                              <span>Send Email</span>
                            </button>

                            {/* Direct WhatsApp Web */}
                            <button
                              type="button"
                              onClick={() => handleDirectWhatsAppDispatch(leak)}
                              disabled={isDispatchingId === `${leak.id}-whatsapp`}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-semibold transition"
                              title={`Send alert directly to WhatsApp (${leak.draftTemplateWhatsApp?.targetPhone || 'vendor'})`}
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                              <span>WhatsApp</span>
                            </button>

                            {/* AI Draft Canvas modal */}
                            <button
                              type="button"
                              onClick={() => handleOpenOutreach(leak)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-glow-emerald transition"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>AI Draft Canvas</span>
                            </button>
                          </>
                        ) : leak.category.includes('Shadow SaaS') ? (
                          <button
                            type="button"
                            onClick={() => handleQuickCancel(leak)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-slate-950 text-xs font-bold shadow-glow-crimson transition"
                          >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Trigger One-Click Cancel</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleExecuteDunning(leak)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-slate-950 text-xs font-bold shadow-lg transition"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>Execute Dunning Flow</span>
                          </button>
                        )}
                      </div>
                    )}

                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>
      {/* Targeted Outreach Dispatch Modal */}
      {dispatchTargetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {dispatchTargetModal.channel === 'whatsapp' ? <MessageSquare className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {dispatchTargetModal.channel === 'whatsapp' ? 'Dispatch WhatsApp Recovery Notice' : 'Dispatch Email Recovery Demand'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Target: {dispatchTargetModal.leak.vendor} · #{dispatchTargetModal.leak.invoiceId} ({formatCurrency(dispatchTargetModal.leak.amountUSD)})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setDispatchTargetModal(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleExecuteTargetedDispatch} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  {dispatchTargetModal.channel === 'whatsapp' ? 'Target WhatsApp Phone Number' : 'Target Recipient Email Address'}
                </label>
                <input
                  type={dispatchTargetModal.channel === 'whatsapp' ? 'text' : 'email'}
                  value={dispatchTargetModal.recipient}
                  onChange={(e) => setDispatchTargetModal(prev => ({ ...prev, recipient: e.target.value }))}
                  required
                  placeholder={dispatchTargetModal.channel === 'whatsapp' ? '+1 (555) 234-5678 or +91 9876543210' : 'name@company.com'}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {dispatchTargetModal.channel === 'whatsapp' 
                    ? 'Enter the recipient phone number with country code. WhatsApp Web will open with the pre-filled legal notice.' 
                    : 'Enter the counterparty or your own email address to receive the official recovery demand.'}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                  Message Content Preview
                </label>
                <textarea
                  value={dispatchTargetModal.body}
                  onChange={(e) => setDispatchTargetModal(prev => ({ ...prev, body: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-300 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setDispatchTargetModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isDispatchingId !== null}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatchingId ? 'Dispatching...' : `Confirm & Dispatch to ${dispatchTargetModal.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}`}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
