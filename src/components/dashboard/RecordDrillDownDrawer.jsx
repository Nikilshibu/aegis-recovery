import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileCheck,
  ShieldCheck,
  Building2,
  User,
  Globe2,
  Calendar,
  AlertTriangle,
  Mail,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  Send,
  Zap,
  Lock,
  Download,
  FileText,
  RefreshCw,
  Clock,
  Sparkles,
  Layers,
  ArrowDownRight
} from 'lucide-react';

export function RecordDrillDownDrawer() {
  const {
    selectedRecordForDrillDown: rec,
    closeRecordDrillDown,
    formatCurrency,
    maskPii,
    addAuditLog
  } = useApp();

  const [executingAction, setExecutingAction] = useState(null);
  const [actionSuccess, setActionSuccess] = useState('');

  if (!rec) return null;

  const getEntityIcon = (type) => {
    switch (type) {
      case 'Organization':
        return <Globe2 className="w-4 h-4 text-emerald-400" />;
      case 'Individual':
        return <User className="w-4 h-4 text-sky-400" />;
      default:
        return <Building2 className="w-4 h-4 text-indigo-400" />;
    }
  };

  const handleExecuteAction = (act) => {
    setExecutingAction(act.id);
    setActionSuccess('');

    setTimeout(() => {
      setExecutingAction(null);
      setActionSuccess(`Workflow executed: "${act.label}"`);
      addAuditLog(
        `Action Executed on Record ${rec.id}`,
        `${act.label} completed successfully for ${rec.entityName}`
      );
      setTimeout(() => setActionSuccess(''), 3500);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0f172a] border-l border-slate-700/80 shadow-2xl h-full flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
              {getEntityIcon(rec.entityType)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">{rec.entityName}</h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {rec.entityType}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Asset ID: <span className="text-slate-200 font-bold">{rec.id}</span> • Logged: {rec.dateLogged}
              </p>
            </div>
          </div>

          <button
            onClick={closeRecordDrillDown}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Feedback Banner */}
        {actionSuccess && (
          <div className="p-3 bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section 1: Financial Impact Overview Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-rose-500/30">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Initial Variance Detected
              </span>
              <div className="text-xl font-black font-mono-num text-rose-400">
                {formatCurrency(rec.amountInitial)}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">Billed vs Contracted Gap</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                Recovered Capital
              </span>
              <div className="text-xl font-black font-mono-num text-emerald-400">
                +{formatCurrency(rec.amountRecovered)}
              </div>
              <div className="text-[11px] text-emerald-500/80 mt-1 font-semibold">Successfully Reclaimed</div>
            </div>
          </div>

          {/* Section 2: Financial Leak Cause Analysis */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Financial Leak Cause Analysis
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                AI Confidence: {rec.metaValues.confidenceScore}%
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              {rec.causeAnalysis}
            </p>
          </div>

          {/* Section 3: Parsed Meta-Values Grid */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 block">
              Parsed Meta-Values & Legal Citations
            </span>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-2.5">
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-500 font-sans">Counterparty / Vendor:</span>
                <span className="text-slate-200 font-bold">{rec.vendor}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-500 font-sans">Invoice ID Reference:</span>
                <span className="text-slate-200">{maskPii(rec.metaValues.invoiceId, 'auto')}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-500 font-sans">Ledger Transaction Hash:</span>
                <span className="text-slate-300">{rec.metaValues.ledgerTxn}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-500 font-sans">Cited SLA / Contract Section:</span>
                <span className="text-sky-300">{rec.metaValues.slaSection}</span>
              </div>
              <div className="flex justify-between pb-1.5 border-b border-slate-800">
                <span className="text-slate-500 font-sans">Billing Conduit / Gateway:</span>
                <span className="text-slate-300">{rec.metaValues.gateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">RAG Vector Verification Latency:</span>
                <span className="text-emerald-400">{rec.metaValues.detectionLatency}</span>
              </div>
            </div>
          </div>

          {/* Section 4: Past Automated Communications Timeline */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-400" />
                Past Automated Communications ({rec.pastCommunications.length})
              </span>
              <span className="text-[10px] font-mono text-slate-500">Autonomous Dispatch Trail</span>
            </div>

            <div className="space-y-2.5">
              {rec.pastCommunications.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {comm.type === 'email' ? (
                        <Mail className="w-3.5 h-3.5 text-sky-400" />
                      ) : (
                        <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className="font-semibold text-slate-200">
                        {comm.type.toUpperCase()}: {comm.subject || comm.tone}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">{comm.timestamp}</span>
                  </div>

                  <div className="text-[11px] text-slate-400">
                    Recipient: <span className="font-mono text-slate-300">{maskPii(comm.recipient, 'auto')}</span>
                  </div>

                  {comm.preview && (
                    <div className="p-2 rounded bg-slate-950 text-[11px] text-slate-400 italic">
                      "{comm.preview}"
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[10px] font-mono">
                    <span className="text-slate-500">Tone: {comm.tone}</span>
                    <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                      {comm.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Recommended Next Action Workflows */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 block">
              Recommended Next Action Workflows
            </span>
            <div className="space-y-2">
              {rec.recommendedActions.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => handleExecuteAction(act)}
                  disabled={executingAction === act.id}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-200 transition text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition" />
                    <span className="font-medium group-hover:text-emerald-300 transition">
                      {act.label}
                    </span>
                  </div>
                  {executingAction === act.id ? (
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                  ) : (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:translate-x-1 transition" />
                  )}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono text-[11px]">
            SHA-256 Verified Immutable Record
          </span>
          <button
            onClick={closeRecordDrillDown}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition"
          >
            Close Drawer
          </button>
        </div>

      </div>
    </div>
  );
}
