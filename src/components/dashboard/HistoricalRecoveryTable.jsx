import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  History,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Building2,
  User,
  Globe2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  MessageSquare
} from 'lucide-react';

export function HistoricalRecoveryTable() {
  const {
    historicalRecords,
    openRecordDrillDown,
    historySearchQuery,
    setHistorySearchQuery,
    historyEntityFilter,
    setHistoryEntityFilter,
    historyStatusFilter,
    setHistoryStatusFilter,
    formatCurrency,
    maskPii,
    selectedRecordId,
    setSelectedRecordId,
    navigateToTab
  } = useApp();

  // Filter records dynamically based on Organization name, Individual name, Business entity name, and status
  const filteredRecords = historicalRecords.filter((rec) => {
    // Search query matches entityName, vendor, category, or invoiceId
    const query = historySearchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      rec.entityName?.toLowerCase().includes(query) ||
      rec.vendor?.toLowerCase().includes(query) ||
      rec.category?.toLowerCase().includes(query) ||
      rec.metaValues?.invoiceId?.toLowerCase().includes(query) ||
      rec.id?.toLowerCase().includes(query);

    // Entity Segment filter
    const matchesEntity =
      historyEntityFilter === 'all' || rec.entityType === historyEntityFilter;

    // Status filter
    const matchesStatus =
      historyStatusFilter === 'all' || rec.status === historyStatusFilter;

    return matchesQuery && matchesEntity && matchesStatus;
  });

  const getEntityIcon = (type) => {
    switch (type) {
      case 'Organization':
        return <Globe2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Individual':
        return <User className="w-3.5 h-3.5 text-sky-400" />;
      default:
        return <Building2 className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Reclaimed':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-glow-emerald">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            Reclaimed
          </span>
        );
      case 'Active Dunning':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-950/60 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <Clock className="w-3 h-3 text-amber-400" />
            Active Dunning
          </span>
        );
      case 'In-Arbitration':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-sky-950/60 text-sky-300 border border-sky-500/40 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-sky-400" />
            In-Arbitration
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
            {status}
          </span>
        );
    }
  };

  return (
    <section className="mb-8">
      
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <History className="w-5 h-5 text-emerald-400" />
              Returning User Stream: Historical Recovery Assets Ledger
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {filteredRecords.length} Records Logged
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit history of past recovery cases, remediated leaks, and communications across Organizations, Businesses, and Individuals
          </p>
        </div>
      </div>

      {/* Advanced Filtering Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 mb-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Prominent Responsive Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by Organization Name, Individual Name, or Business Entity..."
              value={historySearchQuery}
              onChange={(e) => setHistorySearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Quick Segment Filter Pills */}
          <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs shrink-0">
            {[
              { id: 'all', label: 'All Entities' },
              { id: 'Organization', label: 'Organizations' },
              { id: 'Business', label: 'Businesses' },
              { id: 'Individual', label: 'Individuals' }
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setHistoryEntityFilter(id)}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  historyEntityFilter === id
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Status Dropdown */}
          <select
            value={historyStatusFilter}
            onChange={(e) => setHistoryStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 shrink-0"
          >
            <option value="all">All Statuses</option>
            <option value="Reclaimed">Reclaimed Only</option>
            <option value="Active Dunning">Active Dunning Only</option>
            <option value="In-Arbitration">In-Arbitration Only</option>
          </select>

        </div>
      </div>

      {/* Per-Record Context Active Notification Banner */}
      {selectedRecordId && (
        <div className="p-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/40 mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-lg animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <div className="font-bold text-white flex items-center gap-2">
                <span>Active Context Locked:</span>
                <span className="px-2 py-0.5 rounded font-mono text-emerald-300 bg-emerald-500/20 border border-emerald-500/30">
                  {selectedRecordId}
                </span>
                <span className="text-slate-400 font-normal">
                  ({historicalRecords.find(r => r.id === selectedRecordId)?.vendor || 'Selected Asset'})
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                All sidebar tabs (Payments, AI Support, Security Audit) are synchronized to this specific asset.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => navigateToTab('payments')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-emerald-300 text-[11px] font-semibold transition"
            >
              Payments & Billing →
            </button>
            <button
              onClick={() => navigateToTab('support')}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:text-emerald-300 text-[11px] font-semibold transition"
            >
              AI Support →
            </button>
            <button
              onClick={() => setSelectedRecordId(null)}
              className="px-2.5 py-1 rounded-lg bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[11px] font-semibold transition"
            >
              Clear Focus
            </button>
          </div>
        </div>
      )}

      {/* Historical Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-400 font-mono text-[11px]">
                <th className="py-3.5 px-4 font-semibold">Entity Name & Scope</th>
                <th className="py-3.5 px-4 font-semibold">Date Logged</th>
                <th className="py-3.5 px-4 font-semibold">Discrepancy Category & Vendor</th>
                <th className="py-3.5 px-4 font-semibold text-right">Initial Variance</th>
                <th className="py-3.5 px-4 font-semibold text-right">Recovered Capital</th>
                <th className="py-3.5 px-4 font-semibold text-center">Status</th>
                <th className="py-3.5 px-4 font-semibold text-center">Dispatched Comms</th>
                <th className="py-3.5 px-4 font-semibold text-right">Drill-Down</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No historical recovery records match the search filter "{historySearchQuery}".
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => {
                  const isSelected = selectedRecordId === rec.id;
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => {
                        setSelectedRecordId(rec.id);
                        openRecordDrillDown(rec);
                      }}
                      className={`transition cursor-pointer group ${
                        isSelected
                          ? 'bg-emerald-950/40 border-l-4 border-l-emerald-400'
                          : 'hover:bg-slate-900/60'
                      }`}
                    >
                      {/* Entity Name & Type */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg border ${isSelected ? 'bg-emerald-900/50 border-emerald-500/50 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                            {getEntityIcon(rec.entityType)}
                          </div>
                          <div>
                            <div className={`font-bold transition ${isSelected ? 'text-emerald-300 font-extrabold' : 'text-slate-100 group-hover:text-emerald-300'}`}>
                              {rec.entityName}
                            </div>
                            <div className="text-[10px] font-mono text-slate-500">
                              {rec.entityType} • {rec.id}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date Logged */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {rec.dateLogged}
                      </td>

                      {/* Category & Vendor */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{rec.vendor}</div>
                        <div className="text-[10px] text-slate-400">{rec.category}</div>
                      </td>

                      {/* Initial Variance */}
                      <td className="py-3.5 px-4 text-right font-mono text-rose-400 font-semibold whitespace-nowrap">
                        {formatCurrency(rec.amountInitial)}
                      </td>

                      {/* Recovered Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-400 whitespace-nowrap">
                        +{formatCurrency(rec.amountRecovered)}
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex justify-center">
                          {getStatusBadge(rec.status)}
                        </div>
                      </td>

                      {/* Dispatched Communications */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-700">
                          <MessageSquare className="w-3 h-3 text-sky-400" />
                          {rec.pastCommunications.length} sent
                        </span>
                      </td>

                      {/* Drill-Down Action Button */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecordId(rec.id);
                            openRecordDrillDown(rec);
                          }}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition border ${
                            isSelected
                              ? 'bg-emerald-600 text-slate-950 font-bold border-emerald-400 shadow-glow-emerald'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 group-hover:border-emerald-500/40 group-hover:text-emerald-300'
                          }`}
                        >
                          <span>{isSelected ? 'Inspecting' : 'Inspect'}</span>
                          <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </section>
  );
}
