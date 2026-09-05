import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Award,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Calendar,
  Building,
  Hash,
  Download
} from 'lucide-react';

export function ComplianceCertModal() {
  const { activeModal, setActiveModal, modalData: cert } = useApp();

  if (activeModal !== 'cert' || !cert) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={() => setActiveModal(null)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">{cert.title}</h3>
            <p className="text-xs text-slate-400">{cert.subtitle}</p>
          </div>
        </div>

        {/* Certificate Metadata */}
        <div className="space-y-3 bg-slate-900/90 rounded-xl p-4 border border-slate-800 text-xs font-mono mb-6">
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-500 font-sans">Audit Status:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {cert.status}
            </span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-500 font-sans">Accredited Assessor:</span>
            <span className="text-slate-200 font-sans">{cert.auditor}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-500 font-sans">Certificate Token:</span>
            <span className="text-sky-300">{cert.certId}</span>
          </div>
          <div className="flex justify-between pb-2 border-b border-slate-800">
            <span className="text-slate-500 font-sans">Effective Issued Date:</span>
            <span className="text-slate-300">{cert.issuedDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500 font-sans">Next Surveillance Audit:</span>
            <span className="text-slate-300">{cert.renewalDate}</span>
          </div>
        </div>

        {/* SHA-256 Proof */}
        <div className="mb-6">
          <label className="block text-[11px] uppercase font-mono text-slate-400 mb-1.5 flex items-center gap-1">
            <Hash className="w-3 h-3 text-slate-500" />
            Cryptographic Audit Ledger Proof (SHA-256)
          </label>
          <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[10px] font-mono text-emerald-400 break-all">
            {cert.hashProof}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            Dismiss
          </button>
        </div>

      </div>
    </div>
  );
}
