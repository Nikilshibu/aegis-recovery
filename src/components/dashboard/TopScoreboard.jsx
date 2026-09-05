import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  ArrowUpRight,
  Sparkles,
  TrendingUp,
  Percent,
  Coins,
  ShieldCheck,
  DollarSign,
  Layers,
  ArrowDownRight
} from 'lucide-react';

export function TopScoreboard() {
  const {
    currentTotalAtRisk,
    currentRecoveredCapital,
    currentProfile,
    formatCurrency,
    currency,
    setCurrency,
    timeframe,
    setTimeframe,
    activeLeaksCount,
    entityType
  } = useApp();

  // Multipliers based on timeframe
  const timeframeMultiplier = timeframe === 'YTD' ? 3.2 : timeframe === 'QTD' ? 1.8 : 1.0;
  const displayRecovered = currentRecoveredCapital * timeframeMultiplier;
  const displayRisk = currentTotalAtRisk;
  const displayRunRate = currentProfile.stats.runRateSavings * (timeframe === 'YTD' ? 1.2 : 1.0);

  return (
    <section className="mb-8">
      {/* Top Controls Bar: Entity Context, Currency & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight">
              Financial Impact Hero
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              Live Ledger Stream
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Active autonomous capital recovery telemetry for <span className="text-slate-200 font-semibold">{currentProfile.name}</span> ({entityType})
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          {/* Currency Switcher */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 text-xs">
            {['USD', 'EUR', 'GBP', 'INR'].map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-2.5 py-1 rounded-lg font-mono font-medium transition ${
                  currency === curr
                    ? 'bg-slate-800 text-emerald-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>

          {/* Timeframe Selector */}
          <div className="flex items-center bg-slate-900/90 rounded-xl p-1 border border-slate-800 text-xs">
            {['MTD', 'QTD', 'YTD'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  timeframe === tf
                    ? 'bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* High-Visibility Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Revenue At Risk */}
        <div className="relative glass-panel rounded-2xl p-5 border border-rose-500/30 shadow-glow-crimson overflow-hidden group hover:border-rose-500/50 transition">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-rose-400">
            <AlertTriangle className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-rose-400/90 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              Total Revenue At Risk
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/60">
              {activeLeaksCount} Leaks Active
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-num text-slate-100 tracking-tight mb-1">
            {formatCurrency(displayRisk)}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="text-rose-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +12.4%
            </span>
            <span>unresolved invoices, renewals & disputes</span>
          </div>
        </div>

        {/* Card 2: Recovered Capital (MTD/YTD) */}
        <div className="relative glass-panel rounded-2xl p-5 border border-emerald-500/30 shadow-glow-emerald overflow-hidden group hover:border-emerald-500/50 transition">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-emerald-400">
            <Coins className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-emerald-400/90 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Recovered Capital ({timeframe})
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/60">
              Autonomous Reclaim
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-num text-emerald-400 tracking-tight mb-1 flex items-baseline gap-2">
            <span>{formatCurrency(displayRecovered)}</span>
            <span className="text-xs font-mono text-emerald-500 font-normal">Reclaimed</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +28.6%
            </span>
            <span>vs baseline manual AP/AR reconciliation</span>
          </div>
        </div>

        {/* Card 3: AI Recovery Success Rate */}
        <div className="relative glass-panel rounded-2xl p-5 border border-sky-500/30 shadow-glow-cyan overflow-hidden group hover:border-sky-500/50 transition">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-sky-400">
            <Percent className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-sky-400/90 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              AI Recovery Success Rate
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/60 text-sky-300 border border-sky-800/60">
              3-Agent Verified
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-num text-slate-100 tracking-tight mb-1 flex items-baseline gap-2">
            <span>{currentProfile.stats.successRate}%</span>
            <div className="w-20 bg-slate-800 rounded-full h-2 overflow-hidden self-center">
              <div
                className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full rounded-full"
                style={{ width: `${currentProfile.stats.successRate}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5" />
              High Precision
            </span>
            <span>zero false-positive charge reversals</span>
          </div>
        </div>

        {/* Card 4: Platform Run Rate Savings */}
        <div className="relative glass-panel rounded-2xl p-5 border border-amber-500/30 shadow-glow-amber overflow-hidden group hover:border-amber-500/50 transition">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition text-amber-400">
            <TrendingUp className="w-16 h-16" />
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-amber-400/90 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Platform Run Rate Savings
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60">
              Annualized
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono-num text-amber-300 tracking-tight mb-1">
            {formatCurrency(displayRunRate)}
            <span className="text-xs font-normal text-slate-400 font-sans"> / yr</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <span className="text-emerald-400 font-semibold flex items-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -18.2%
            </span>
            <span>via renegotiated SLAs & pruned shadow SaaS</span>
          </div>
        </div>

      </div>
    </section>
  );
}
