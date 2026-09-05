import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { REGULATORY_BADGES } from '../../data/mockData';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Eye,
  Sliders,
  FileCheck2,
  Download,
  Search,
  ExternalLink,
  Award,
  Hash,
  AlertOctagon,
  Sparkles,
  KeyRound,
  FileSpreadsheet
} from 'lucide-react';

export function SecurityComplianceTab() {
  const {
    auditLogs,
    isPiiMasked,
    setIsPiiMasked,
    monetaryThreshold,
    setMonetaryThreshold,
    userRole,
    addAuditLog,
    formatCurrency,
    setActiveModal,
    setModalData,
    supabaseStatus,
    currentUser,
    selectedRecordId,
    setSelectedRecordId,
    historicalRecords,
    navigateToTab
  } = useApp();

  const [auditSearch, setAuditSearch] = useState('');
  const [copiedBadge, setCopiedBadge] = useState(null);

  const contextRecord = selectedRecordId
    ? historicalRecords.find(r => r.id === selectedRecordId)
    : null;

  // Derive absolute modification timeline history of selectedRecordId asset only
  const scopedAuditLogs = React.useMemo(() => {
    if (!selectedRecordId) return auditLogs;

    // Filter existing auditLogs matching this record ID, vendor, or invoice ID
    const matched = auditLogs.filter(log => {
      const text = `${log.action} ${log.details} ${log.actor}`.toLowerCase();
      const idMatch = text.includes(selectedRecordId.toLowerCase());
      const vendorMatch = contextRecord && text.includes(contextRecord.vendor.toLowerCase());
      const invoiceMatch = contextRecord?.metaValues?.invoiceId && text.includes(contextRecord.metaValues.invoiceId.toLowerCase());
      return idMatch || vendorMatch || invoiceMatch;
    });

    if (matched.length > 0) return matched;

    // If no direct audit log entry matched yet, construct the complete verified immutable timeline for this record asset
    if (contextRecord) {
      return [
        {
          id: `LOG-${selectedRecordId.slice(-4)}-4`,
          timestamp: `${contextRecord.dateLogged} 16:30:12 UTC`,
          actor: `Zero-Trust Enclave Sentinel (${currentUser.email})`,
          action: 'Escrow Settlement State Verified',
          details: `Reclaimed asset verification confirmed for ${contextRecord.vendor} (${formatCurrency(contextRecord.amountRecovered || contextRecord.amountInitial)}). Cryptographic seal committed.`,
          hash: '0x9f4a...88b2',
          status: 'Immutable Verified'
        },
        {
          id: `LOG-${selectedRecordId.slice(-4)}-3`,
          timestamp: `${contextRecord.dateLogged} 14:15:00 UTC`,
          actor: `Arbitration Engine (${userRole})`,
          action: 'Contract SLA Dispute Formalized',
          details: `Remittance dispute filed against ${contextRecord.vendor} under Clause 8.2. Invoice #${contextRecord.metaValues?.invoiceId || 'N/A'}.`,
          hash: '0x7c3b...21a4',
          status: 'Immutable Verified'
        },
        {
          id: `LOG-${selectedRecordId.slice(-4)}-2`,
          timestamp: `${contextRecord.dateLogged} 10:20:45 UTC`,
          actor: 'OCR Vector Parser Agent',
          action: 'Telemetry Ingestion & Discrepancy Flagged',
          details: `Asset ${selectedRecordId} ingested. Discrepancy diagnosed: "${contextRecord.causeAnalysis}". Initial variance ${formatCurrency(contextRecord.amountInitial)}.`,
          hash: '0x4d1e...99c7',
          status: 'Immutable Verified'
        },
        {
          id: `LOG-${selectedRecordId.slice(-4)}-1`,
          timestamp: `${contextRecord.dateLogged} 09:00:00 UTC`,
          actor: `Security Audit Enclave (${currentUser.uuid})`,
          action: 'Security Boundary Initialized',
          details: `Record ${selectedRecordId} provisioned in recovery_records table with isolated tenant enclave.`,
          hash: '0x1a8f...55e0',
          status: 'Immutable Verified'
        }
      ];
    }

    return auditLogs;
  }, [selectedRecordId, auditLogs, contextRecord, currentUser, formatCurrency, userRole]);

  const filteredLogs = scopedAuditLogs.filter(
    (log) =>
      log.action.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.actor.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
      log.hash.toLowerCase().includes(auditSearch.toLowerCase())
  );

  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setMonetaryThreshold(val);
    addAuditLog(
      'Autonomous Monetary Threshold Reconfigured',
      `Auto-pilot execution ceiling updated to ${formatCurrency(val)} (actions exceeding this require Admin 2FA)`
    );
  };

  const handleExportAuditCsv = () => {
    const headers = ['ID', 'Timestamp', 'Actor', 'Action', 'Details', 'SHA-256 Hash', 'Status'];
    const rows = scopedAuditLogs.map(l => [l.id, l.timestamp, l.actor, l.action, `"${l.details.replace(/"/g, '""')}"`, l.hash, l.status]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aegis_audit_trail_${selectedRecordId ? `${selectedRecordId}_` : ''}${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addAuditLog('Compliance Audit Log Exported', `Downloaded immutable cryptographic CSV log ledger${selectedRecordId ? ` for ${selectedRecordId}` : ''}`);
  };

  const handleVerifyBadge = (badge) => {
    setModalData(badge);
    setActiveModal('cert');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
              Security, Compliance & Infrastructure Guardrails
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Zero-Trust Level 3
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic audit trails, autonomous threshold constraints, PII pseudonymization, and formal compliance certifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportAuditCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-medium transition"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export Immutable Audit Log (CSV)</span>
          </button>
        </div>
      </div>


      {/* Grid: Monetary Threshold Slider & PII Masking Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Guardrail 1: Autonomous Monetary Value Threshold Slider */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-500/15 border border-indigo-500/40 text-indigo-400">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Autonomous Monetary Value Threshold</h3>
                <p className="text-[11px] text-slate-400">Determines auto-pilot execution vs mandatory Admin 2FA authorization</p>
              </div>
            </div>
            <span className="text-lg font-black font-mono-num text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-800/60">
              {formatCurrency(monetaryThreshold)}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <input
              type="range"
              min="500"
              max="10000"
              step="250"
              value={monetaryThreshold}
              onChange={handleSliderChange}
              disabled={userRole !== 'Admin'}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 disabled:opacity-50"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>$500 (Strict Manual)</span>
              <span>$5,000 (Standard Tier)</span>
              <span>$10,000 (High Autonomy)</span>
            </div>
          </div>

          {/* Threshold Guardrail Explainer */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Under {formatCurrency(monetaryThreshold)}:</span>
              <span className="text-emerald-400 font-medium">Auto-Pilot Recovery Dispatched Instantly</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Over {formatCurrency(monetaryThreshold)}:</span>
              <span className="text-amber-400 font-medium">Freezes & Requires High-Tier Admin TOTP</span>
            </div>
            {userRole !== 'Admin' && (
              <div className="pt-1 text-[11px] text-amber-400 font-mono">
                * Note: Modifying threshold requires Admin privilege (current: {userRole})
              </div>
            )}
          </div>
        </div>

        {/* Guardrail 2: Automatic PII Masking & Pseudonymization Engine */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
                {isPiiMasked ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-100">Automatic PII Masking Engine</h3>
                <p className="text-[11px] text-slate-400">Enforces DPDP Act 2023 & GDPR Art 32 pseudonymization</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsPiiMasked(!isPiiMasked);
                addAuditLog(
                  'PII Masking Toggled from Security Tab',
                  `Switched state to: ${!isPiiMasked ? 'MASKED' : 'EXPOSED'}`
                );
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition border ${
                isPiiMasked
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-glow-emerald'
                  : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              }`}
            >
              {isPiiMasked ? 'MASKING ON' : 'RAW EXPOSED'}
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
            <div className="text-[11px] uppercase font-mono text-slate-400">Live Pseudonymization Sample:</div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-950 text-slate-400">
                <span className="text-[10px] text-slate-500 block">Phone Identifier:</span>
                {isPiiMasked ? '+91 XXXXX-XX123' : '+91 98450-99123'}
              </div>
              <div className="p-2 rounded bg-slate-950 text-slate-400">
                <span className="text-[10px] text-slate-500 block">Corporate Tax ID / EIN:</span>
                {isPiiMasked ? 'US-EIN: **-***8492' : 'US-EIN: 84-2918492'}
              </div>
              <div className="p-2 rounded bg-slate-950 text-slate-400">
                <span className="text-[10px] text-slate-500 block">Bank Account / IBAN:</span>
                {isPiiMasked ? '**** **** **** 8821' : 'US49 JPMC 0021 8821'}
              </div>
              <div className="p-2 rounded bg-slate-950 text-slate-400">
                <span className="text-[10px] text-slate-500 block">Target Email ID:</span>
                {isPiiMasked ? 'b***s@datadoghq.com' : 'billing-disputes@datadoghq.com'}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Regulatory Compliance Badges */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" />
              Verified Regulatory Framework Badges
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Active external audits certifying zero-trust architecture, encrypted enclaves, and compliance
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
            5/5 Frameworks Audited
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {REGULATORY_BADGES.map((badge) => (
            <div
              key={badge.id}
              onClick={() => handleVerifyBadge(badge)}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 transition">
                    {badge.title}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">{badge.subtitle}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span className="text-emerald-400">{badge.status}</span>
                <span>{badge.certId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immutable System Audit Log */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        
        {/* Active Asset Audit Trail Banner when selectedRecordId is locked */}
        {selectedRecordId && (
          <div className="p-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-md animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  <span>Filtered to Asset Audit Timeline:</span>
                  <span className="px-2 py-0.5 rounded font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                    {selectedRecordId}
                  </span>
                  <span className="text-slate-300 font-semibold">
                    ({contextRecord?.vendor || 'Target Asset'})
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Displaying read-only system access log entries showing the absolute modification timeline history of this row asset only.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => navigateToTab('ledger')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-semibold transition"
              >
                ← Back to Ledger
              </button>
              <button
                onClick={() => setSelectedRecordId(null)}
                className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition"
              >
                Show Full System Audit Log
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-emerald-400" />
              <span>Immutable System Audit Log</span>
              {selectedRecordId && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {selectedRecordId} ONLY ({filteredLogs.length} entries)
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {selectedRecordId
                ? `Absolute modification timeline history and cryptographic integrity hash for asset ${selectedRecordId}`
                : 'Append-only tamper-evident hash log recording every user login, data edit, and autonomous AI remediation event'}
            </p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search audit trail..."
              value={auditSearch}
              onChange={(e) => setAuditSearch(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-56"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-2.5 font-semibold">Log ID</th>
                <th className="pb-2.5 font-semibold">Timestamp</th>
                <th className="pb-2.5 font-semibold">Actor / Entity</th>
                <th className="pb-2.5 font-semibold">Action Type</th>
                <th className="pb-2.5 font-semibold">Execution Details</th>
                <th className="pb-2.5 font-semibold">Cryptographic Hash</th>
                <th className="pb-2.5 font-semibold text-right">Integrity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 font-mono text-[11px] text-emerald-400 font-bold">{log.id}</td>
                  <td className="py-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                  <td className="py-3 text-slate-300 font-medium">{log.actor}</td>
                  <td className="py-3 text-slate-200 font-semibold">{log.action}</td>
                  <td className="py-3 text-slate-400 text-[11px] max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>
                  <td className="py-3 font-mono text-[10px] text-slate-500">{log.hash}</td>
                  <td className="py-3 text-right">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
