import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileCheck,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Search,
  Hash,
  Download,
  Send,
  AlertTriangle
} from 'lucide-react';

export function SourceVerificationModal() {
  const {
    activeModal,
    setActiveModal,
    modalData: leak,
    formatCurrency,
    maskPii,
    addAuditLog
  } = useApp();

  const [activeTab, setActiveTab] = useState('split'); // 'split' | 'raw'
  const [copiedHash, setCopiedHash] = useState(false);

  if (activeModal !== 'verification' || !leak) return null;

  const mockVectorSimilarity = 98.6;
  const mockShaProof = '0x8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4';

  const handleCopyProof = () => {
    navigator.clipboard?.writeText(mockShaProof);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
    addAuditLog('Cryptographic Proof Exported', `SHA-256 hash verified for leak ${leak.id}`);
  };

  const handleProceedToOutreach = () => {
    setActiveModal('outreach');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 border border-sky-500/40 text-sky-400">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  RAG Source Verification & Ledger Split View
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                  Vector Match: {mockVectorSimilarity}%
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Cross-checking disputed transaction <span className="font-mono text-slate-200">{leak.id}</span> against authoritative ground-truth legal instruments
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

        {/* Verification Body: Side-by-Side Split Window */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-950/40">
          
          {/* Left Pane: Invoiced Ledger Transaction Discrepancy */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Disputed Invoiced Ledger Transaction
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Source: Ingested AP Records
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Vendor / Counterparty:</span>
                <span className="text-slate-200 font-semibold">{leak.vendor}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Invoice Identifier:</span>
                <span className="text-slate-200">{maskPii(leak.invoiceId, 'auto')}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Ledger Reference:</span>
                <span className="text-slate-300">{leak.ledgerTransaction}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Billed Variance / Claim:</span>
                <span className="text-rose-400 font-bold font-mono-num text-sm">
                  +{formatCurrency(leak.amountUSD)}
                </span>
              </div>

              {/* Bounding Box Simulation of Scanned Invoice */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-rose-500/40 relative">
                <div className="absolute -top-2.5 right-3 bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border border-rose-500/40">
                  Detected Variance Bounding Box
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed font-sans">
                  {leak.evidenceSnippet}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Department: {leak.department}</span>
              <span>Billing Conduit: {leak.channel}</span>
            </div>
          </div>

          {/* Right Pane: Authoritative Contract Clause / RAG Ground Truth */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Contract & Tax Policy Ground Truth (RAG)
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Cosine Distance: 0.014
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Legal Document:</span>
                <span className="text-emerald-300 font-semibold">Master Agreement & SLA</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Cited Section:</span>
                <span className="text-slate-200">{leak.clauseRef}</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Effective Date:</span>
                <span className="text-slate-300">Active & Executed (Jan 14, 2026)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span className="text-slate-500">Governing Jurisdiction:</span>
                <span className="text-slate-300">Delaware / ICC Commercial Rules</span>
              </div>

              {/* Highlighted Contract Passage */}
              <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-emerald-500/40 relative">
                <div className="absolute -top-2.5 right-3 bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[9px] font-mono uppercase font-bold border border-emerald-500/40">
                  RAG Exact Clause Extraction
                </div>
                <div className="text-[11px] text-emerald-200/90 leading-relaxed font-sans">
                  "{leak.clauseRef} In the event Customer experiences billing deviations exceeding 2.5%, Vendor shall promptly credit the variance or offset against future billing cycles upon formal written or automated notice."
                </div>
              </div>
            </div>

            {/* Cryptographic SHA-256 Hash Proof */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between font-mono">
              <div className="flex items-center gap-1.5 truncate max-w-xs">
                <Hash className="w-3.5 h-3.5 text-slate-500" />
                <span className="truncate">{mockShaProof}</span>
              </div>
              <button
                type="button"
                onClick={handleCopyProof}
                className="text-sky-400 hover:text-sky-300 underline text-[10px] shrink-0 ml-2"
              >
                {copiedHash ? 'Copied!' : 'Copy Hash'}
              </button>
            </div>
          </div>

        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Multi-Agent Consensus: 3 of 3 validation agents confirmed ground-truth violation.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveModal(null)}
              className="px-4 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Close Window
            </button>
            <button
              onClick={handleProceedToOutreach}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Confirm Discrepancy & Prepare Outreach</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
