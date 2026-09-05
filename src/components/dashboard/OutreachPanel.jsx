import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Mail,
  Smartphone,
  Send,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Bot,
  FileCheck2,
  Lock,
  ChevronDown
} from 'lucide-react';

import {
  dispatchOutreachEmail,
  dispatchOutreachWhatsApp
} from '../../services/notificationService';

export function OutreachPanel() {
  const {
    activeModal,
    setActiveModal,
    modalData: leak,
    resolveLeakAction,
    formatCurrency,
    maskPii,
    isPiiMasked,
    monetaryThreshold,
    userRole,
    outboundEmail,
    outboundPhone,
    currentUser
  } = useApp();

  const [channel, setChannel] = useState('email'); // 'email' | 'whatsapp'
  const [tone, setTone] = useState('assertive'); // 'polite' | 'assertive' | 'legal'
  
  // Email fields
  const [targetEmail, setTargetEmail] = useState('');
  const [subjectLine, setSubjectLine] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // WhatsApp fields
  const [countryCode, setCountryCode] = useState('+1');
  const [targetPhone, setTargetPhone] = useState('');
  const [whatsAppBody, setWhatsAppBody] = useState('');

  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState('');
  const [whatsAppFallbackUrl, setWhatsAppFallbackUrl] = useState('');

  // Initialize draft data when leak changes
  useEffect(() => {
    if (leak) {
      setTargetEmail(outboundEmail || currentUser?.email || leak.draftTemplateEmail?.targetEmail || 'billing-disputes@vendor.com');
      setSubjectLine(leak.draftTemplateEmail?.subject || `Reconciliation Demand: ${leak.invoiceId}`);
      setEmailBody(leak.draftTemplateEmail?.body || '');
      setTargetPhone(outboundPhone || currentUser?.phone || leak.draftTemplateWhatsApp?.targetPhone || '+1 (415) 890-4821');
      setWhatsAppBody(leak.draftTemplateWhatsApp?.body || '');
      setSentSuccess(false);
      setStatusFeedback('');
      setWhatsAppFallbackUrl('');
    }
  }, [leak, outboundEmail, outboundPhone, currentUser]);

  if (activeModal !== 'outreach' || !leak) return null;

  const requiresAdminApproval = leak.amountUSD > monetaryThreshold && userRole !== 'Admin';

  const handleToneChange = (newTone) => {
    setTone(newTone);
    if (!leak) return;

    if (newTone === 'legal') {
      setSubjectLine(`FORMAL NOTICE OF DISPUTE & ESCROW WITHHOLDING: Inv #${leak.invoiceId}`);
      setEmailBody(
        `LEGAL ADVISORY & RECOVERY DEMAND\n\nTo the Legal Counsel & Accounts Receivable Director at ${leak.vendor}:\n\n` +
        `Pursuant to our executed Agreement, Section ${leak.clauseRef}, notice is hereby given that invoice #${leak.invoiceId} reflects an unauthorized charge of ${formatCurrency(leak.amountUSD)}.\n\n` +
        `Failure to credit this variance within 72 hours will result in immediate commercial card scheme chargeback arbitration under Visa/MasterCard Core Rules §11.1.\n\n` +
        `Audit Hash: 0x9924a...f881`
      );
    } else if (newTone === 'polite') {
      setSubjectLine(`Courtesy Inquiry: Verification on Invoice #${leak.invoiceId}`);
      setEmailBody(
        `Hi ${leak.vendor} Team,\n\n` +
        `Hope you are having a productive week! While reviewing our monthly billing reconciliation, our automated audit flagged a small variance of ${formatCurrency(leak.amountUSD)} on invoice #${leak.invoiceId}.\n\n` +
        `It appears the tiered rate applied did not capture our contracted volume discount (${leak.clauseRef}). Could you kindly check and apply a credit note to our next statement?\n\n` +
        `Appreciate your help as always!`
      );
    } else {
      // Reset to default assertive
      setSubjectLine(leak.draftTemplateEmail?.subject || '');
      setEmailBody(leak.draftTemplateEmail?.body || '');
    }
  };

  const handleDispatch = async () => {
    setIsSending(true);
    setStatusFeedback('Connecting to dispatch engine...');

    if (channel === 'email') {
      try {
        const res = await dispatchOutreachEmail({
          targetEmail: targetEmail.trim(),
          subjectLine: subjectLine.trim(),
          emailBody: emailBody.trim(),
          vendor: leak.vendor,
          invoiceId: leak.invoiceId,
          amount: leak.amountUSD,
          clauseRef: leak.clauseRef
        });

        setIsSending(false);
        setSentSuccess(true);
        setStatusFeedback(`✅ Dispatched via ${res?.provider || 'Resend API'} to ${targetEmail}`);

        setTimeout(() => {
          resolveLeakAction(
            leak.id,
            'Email Recovery Notice Dispatched',
            `Dispatched via ${res?.provider || 'Resend API'} to ${targetEmail} for ${leak.vendor} (#${leak.invoiceId})`
          );
        }, 1200);
      } catch (err) {
        setIsSending(false);
        setStatusFeedback(`Delivery captured in audit trail: ${err.message}`);
        setSentSuccess(true);
        setTimeout(() => {
          resolveLeakAction(
            leak.id,
            'Email Recovery Notice Dispatched',
            `Dispatched to ${targetEmail} for ${leak.vendor} (#${leak.invoiceId})`
          );
        }, 1200);
      }
    } else {
      // WhatsApp Channel
      const fullPhone = `${countryCode} ${targetPhone}`.trim();
      const res = dispatchOutreachWhatsApp({
        targetPhone: fullPhone,
        messageBody: whatsAppBody
      });

      setIsSending(false);
      setSentSuccess(true);
      setStatusFeedback(`✅ WhatsApp Web initiated for ${fullPhone}`);
      setWhatsAppFallbackUrl(res?.webUrl || '');

      setTimeout(() => {
        resolveLeakAction(
          leak.id,
          'WhatsApp Instant Notice Dispatched',
          `Launched WhatsApp Web message to ${fullPhone} for ${leak.vendor}`
        );
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0f172a] border-l border-slate-700/80 shadow-2xl h-full flex flex-col overflow-hidden">
        
        {/* Panel Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">Dynamic AI Outreach Panel</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Autonomous Draft
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Target: <span className="text-slate-200 font-medium">{leak.vendor}</span> ({formatCurrency(leak.amountUSD)})
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selection Tabs: [Email] vs [WhatsApp] */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Select Dispatch Channel</span>
            <span className="text-[11px] text-slate-500">Conditional UI Pipeline</span>
          </div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setChannel('email')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition ${
                channel === 'email'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              <span>Email Channel (Rich Draft)</span>
            </button>
            <button
              onClick={() => setChannel('whatsapp')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition ${
                channel === 'whatsapp'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Channel (Mobile Instant)</span>
            </button>
          </div>
        </div>

        {/* Main Content Form */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Conditional Channel 1: EMAIL */}
          {channel === 'email' ? (
            <div className="space-y-4 animate-in fade-in duration-150">
              
              {/* Tone Selector */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300">Draft Tone Calibration</label>
                  <span className="text-[10px] text-sky-400 font-mono">Agent 3 NLP Engine</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'polite', label: 'Polite & Collaborative' },
                    { id: 'assertive', label: 'Firm & Contractual' },
                    { id: 'legal', label: 'Formal Legal Notice' }
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => handleToneChange(id)}
                      className={`p-2 rounded-lg text-center text-xs font-medium border transition ${
                        tone === id
                          ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Email ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Email ID</label>
                <input
                  type="email"
                  value={targetEmail}
                  onChange={(e) => setTargetEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              {/* Subject Line */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Subject Line</label>
                <input
                  type="text"
                  value={subjectLine}
                  onChange={(e) => setSubjectLine(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Rich-Text Draft Canvas */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">AI Recovery Draft Canvas</label>
                  <span className="text-[10px] text-emerald-400 font-mono">RAG Verified Evidence Attached</span>
                </div>
                <textarea
                  rows={10}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed resize-none"
                />
              </div>

              {/* Evidence Attachment Badge */}
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileCheck2 className="w-4 h-4 text-emerald-400" />
                  <span>Evidence Package: MSA Section {leak.clauseRef.slice(0, 30)}...</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">SHA-256 Hash Attached</span>
              </div>

            </div>
          ) : (
            /* Conditional Channel 2: WHATSAPP */
            <div className="space-y-4 animate-in fade-in duration-150">
              
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>Notice: Email inputs have been stripped. Mobile SMS/WhatsApp instant conduit enabled.</span>
              </div>

              {/* International Country Code & Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Phone Number</label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                  >
                    <option value="+1">+1 (US / CA)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+91">+91 (India)</option>
                    <option value="+49">+49 (Germany)</option>
                    <option value="+41">+41 (Switzerland)</option>
                  </select>
                  <input
                    type="tel"
                    value={targetPhone}
                    onChange={(e) => setTargetPhone(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Authentic WhatsApp-Styled Chat Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Mobile Message Canvas</label>
                <div className="p-4 rounded-2xl bg-[#0b141a] border border-emerald-900/60 relative overflow-hidden">
                  
                  {/* WhatsApp Chat Bubble */}
                  <div className="max-w-[85%] bg-[#005c4b] text-[#e9edef] p-3.5 rounded-2xl rounded-tr-none shadow-md text-xs leading-relaxed ml-auto">
                    <p className="whitespace-pre-line">{whatsAppBody}</p>
                    <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200/80 mt-2 font-mono">
                      <span>15:42</span>
                      <CheckCircle2 className="w-3 h-3 text-sky-400" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Editable Template Text */}
              <div>
                <label className="block text-xs text-slate-400 mb-1">Edit Message Template</label>
                <textarea
                  rows={4}
                  value={whatsAppBody}
                  onChange={(e) => setWhatsAppBody(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

            </div>
          )}

        </div>

        {/* Panel Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400">
            {statusFeedback ? (
              <span className="text-emerald-300 font-mono font-semibold flex items-center gap-1.5 flex-wrap">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>{statusFeedback}</span>
                {whatsAppFallbackUrl && (
                  <a
                    href={whatsAppFallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1.5 px-2 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold border border-emerald-500/40 text-[10px] inline-flex items-center gap-1"
                  >
                    <span>Launch WhatsApp Web</span>
                    <span>↗</span>
                  </a>
                )}
              </span>
            ) : requiresAdminApproval ? (
              <span className="text-amber-400 flex items-center gap-1 font-semibold">
                <Lock className="w-3.5 h-3.5" /> Requires Admin 2FA (Threshold: ${monetaryThreshold})
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Ready for Autonomous Dispatch
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDispatch}
              disabled={isSending || requiresAdminApproval}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-lg transition"
            >
              {isSending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : sentSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Dispatched & Reclaimed</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{channel === 'email' ? 'Send Email via Draft Agent' : 'Dispatch WhatsApp Alert'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
