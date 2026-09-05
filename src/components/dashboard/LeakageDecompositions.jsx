import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  WATERFALL_DATA,
  COHORT_DUNNING_DATA,
  EXPENSE_HEATMAP_DATA
} from '../../data/mockData';
import {
  BarChart3,
  Calendar,
  Grid,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  ArrowDownRight,
  ArrowUpRight
} from 'lucide-react';

export function LeakageDecompositions() {
  const { formatCurrency } = useApp();

  const [activeDecompositionTab, setActiveDecompositionTab] = useState('waterfall'); // 'waterfall' | 'cohort' | 'heatmap'

  // Calculations for Waterfall
  const maxWaterfallAmount = Math.max(...WATERFALL_DATA.map(d => Math.abs(d.amount)));

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800 mb-8">
      
      {/* Header & Sub-Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-400" />
              Advanced Leakage Decompositions
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Deep Analytics
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sequential waterfall bridges, card authorization cohort timing, and departmental expense friction
          </p>
        </div>

        {/* Segmented Tab Controls */}
        <div className="flex bg-slate-900 rounded-xl p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setActiveDecompositionTab('waterfall')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeDecompositionTab === 'waterfall'
                ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Leakage Waterfall
          </button>
          <button
            onClick={() => setActiveDecompositionTab('cohort')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeDecompositionTab === 'cohort'
                ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Cohort Dunning Timeline
          </button>
          <button
            onClick={() => setActiveDecompositionTab('heatmap')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeDecompositionTab === 'heatmap'
                ? 'bg-slate-800 text-emerald-300 font-semibold shadow-sm border border-slate-700'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Expense Heatmap
          </button>
        </div>
      </div>

      {/* 1. Sequential Leakage Waterfall Chart */}
      {activeDecompositionTab === 'waterfall' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-xs text-slate-400 mb-2">
            Tracks how potential revenue steps down to actual realized treasury cash through processing friction and recovers via autonomous AI intervention:
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5">
            {WATERFALL_DATA.map((item, index) => {
              const isBase = item.type === 'base';
              const isNegative = item.type === 'negative';
              const isPositive = item.type === 'positive';
              const isTotal = item.type === 'total';

              return (
                <div
                  key={item.step}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                    isTotal
                      ? 'bg-emerald-950/40 border-emerald-500/50 shadow-glow-emerald'
                      : isPositive
                      ? 'bg-emerald-950/20 border-emerald-500/30'
                      : isNegative
                      ? 'bg-rose-950/20 border-rose-500/30'
                      : 'bg-slate-900 border-slate-800'
                  }`}
                >
                  <div>
                    <div className="text-[10px] font-mono uppercase text-slate-500 mb-1 flex items-center justify-between">
                      <span>Step {index + 1}</span>
                      {isNegative && <ArrowDownRight className="w-3 h-3 text-rose-400" />}
                      {isPositive && <ArrowUpRight className="w-3 h-3 text-emerald-400" />}
                    </div>
                    <div className="text-xs font-bold text-slate-200 leading-snug mb-2">
                      {item.step}
                    </div>
                  </div>

                  {/* Relative Bar visual */}
                  <div className="my-2">
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isTotal
                            ? 'bg-emerald-400'
                            : isPositive
                            ? 'bg-emerald-400'
                            : isNegative
                            ? 'bg-rose-500'
                            : 'bg-sky-400'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(15, (Math.abs(item.amount) / maxWaterfallAmount) * 100))}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div
                      className={`text-sm font-black font-mono-num ${
                        isTotal
                          ? 'text-emerald-400'
                          : isPositive
                          ? 'text-emerald-300'
                          : isNegative
                          ? 'text-rose-400'
                          : 'text-slate-100'
                      }`}
                    >
                      {item.amount > 0 && !isBase && !isTotal ? `+` : ''}
                      {formatCurrency(item.amount)}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                      {item.desc}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Sparkles className="w-4 h-4" />
              <span>AI Autonomous Interventions remediated +$38,200.00 across 4 distinct leakage vectors.</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500">Reconciliation Rate: 94.8%</span>
          </div>
        </div>
      )}

      {/* 2. Cohort Dunning & Retry Timeline */}
      {activeDecompositionTab === 'cohort' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Credit card gateway retry success rates (%) mapped across day-of-week and time-of-day cohorts:
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Optimal Window:</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/40">
                Tue & Wed (09:00 - 11:00 AM)
              </span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-9 gap-1.5 text-center text-xs">
                {/* Header Row */}
                <div className="p-2 text-[11px] font-mono text-slate-500 text-left">Day / UTC</div>
                {['06-08', '08-10', '10-12', '12-14', '14-16', '16-18', '18-20', '20-22'].map((time) => (
                  <div key={time} className="p-2 text-[10px] font-mono text-slate-400 bg-slate-900/80 rounded-lg">
                    {time}
                  </div>
                ))}

                {/* Day Rows */}
                {COHORT_DUNNING_DATA.matrix.map((row) => (
                  <React.Fragment key={row.day}>
                    <div className="p-2 font-mono text-xs text-slate-300 font-semibold text-left flex items-center">
                      {row.day}
                    </div>
                    {row.hours.map((rate, hIndex) => {
                      const isOptimal = rate >= 85;
                      const isHigh = rate >= 70 && rate < 85;
                      const isMed = rate >= 40 && rate < 70;

                      return (
                        <div
                          key={hIndex}
                          title={`${row.day} interval ${hIndex}: ${rate}% authorization success`}
                          className={`p-2.5 rounded-lg font-mono font-bold text-xs transition cursor-default ${
                            isOptimal
                              ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/60 shadow-glow-emerald'
                              : isHigh
                              ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800/40'
                              : isMed
                              ? 'bg-sky-950/40 text-sky-400 border border-sky-800/30'
                              : 'bg-slate-900 text-slate-500 border border-slate-800'
                          }`}
                        >
                          {rate}%
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Dunning Guidance Footnote */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
            <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Algorithmic Dunning Recommendation:</span>
              <p className="text-slate-400 text-[11px] mt-0.5 leading-relaxed">
                Retrying corporate card authorizations between Tuesday 10:00 AM and Wednesday 11:30 AM yields a 94% first-retry clearing rate, compared to a 32% failure rate on weekends. The autonomous engine has scheduled all pending dunning retries to this optimal window.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Expense & Deductions Heatmap */}
      {activeDecompositionTab === 'heatmap' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="text-xs text-slate-400 mb-2">
            Identifies leakage density and pricing friction aggregated by Vendor, Billing Channel, and Department:
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                  <th className="pb-3 font-semibold">Vendor / Service</th>
                  <th className="pb-3 font-semibold">Department</th>
                  <th className="pb-3 font-semibold">Payment Conduit</th>
                  <th className="pb-3 font-semibold text-right">Monthly Volume</th>
                  <th className="pb-3 font-semibold text-right">Leakage Density</th>
                  <th className="pb-3 font-semibold pl-4">Detected Operational Anomaly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {EXPENSE_HEATMAP_DATA.map((row) => (
                  <tr key={row.vendor} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 font-semibold text-slate-200">{row.vendor}</td>
                    <td className="py-3 text-slate-400">{row.department}</td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">{row.channel}</td>
                    <td className="py-3 text-right font-mono text-slate-200">
                      {formatCurrency(row.monthlySpend)}
                    </td>
                    <td className="py-3 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded font-mono font-bold text-xs ${
                          row.leakageRate > 20
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60'
                            : row.leakageRate > 10
                            ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60'
                        }`}
                      >
                        {row.leakageRate}%
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-slate-300 text-[11px]">
                      {row.anomaly}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
