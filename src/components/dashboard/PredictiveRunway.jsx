import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  Sparkles,
  Sliders,
  RefreshCw,
  Activity,
  Radio,
  ShieldCheck,
  ShieldAlert,
  Search,
  FileCheck,
  X,
  ChevronRight,
  Mail,
  MessageSquare,
  Send,
  Lock
} from 'lucide-react';
import {
  dispatchOutreachEmail,
  dispatchOutreachWhatsApp
} from '../../services/notificationService';

export function PredictiveRunway() {
  const {
    formatCurrency,
    entityType,
    anomalyTriggered,
    setAnomalyTriggered,
    preDunningActivated,
    handlePreDunningActivation,
    addAuditLog
  } = useApp();

  // Stochastic Parameters
  const [volatility, setVolatility] = useState(18); // 5% to 45%
  const [liveDriftActive, setLiveDriftActive] = useState(true);
  const [randomSeed, setRandomSeed] = useState(42);
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [marketShockActive, setMarketShockActive] = useState(false);

  // Business Anomaly Deep-Dive & Remediation Engine State
  const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
  const [anomalyRisk, setAnomalyRisk] = useState(94.2);
  const [anomalyMitigated, setAnomalyMitigated] = useState(false);
  const [activeRemediation, setActiveRemediation] = useState(null);
  const [remediationFeedback, setRemediationFeedback] = useState('');
  const [appliedProtocols, setAppliedProtocols] = useState([]);

  // Month labels for a rolling 6-month runway
  const monthLabels = ['M1 (Current)', 'M2 (+30d)', 'M3 (+60d)', 'M4 (+90d)', 'M5 (+120d)', 'M6 (+150d)'];

  // Entity baseline volume
  const baseVolume = useMemo(() => {
    switch (entityType) {
      case 'Individual': return 28000;
      case 'Organization': return 480000;
      case 'Business':
      default:
        return 210000;
    }
  }, [entityType]);

  // Stochastic Mathematical Model: Non-linear Geometric Brownian Motion with Mean-Reverting Drift
  const stochasticData = useMemo(() => {
    // Deterministic pseudo-random Gaussian generator using Box-Muller
    let seed = randomSeed;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    const gaussianRandom = () => {
      let u = 0, v = 0;
      while (u === 0) u = pseudoRandom();
      while (v === 0) v = pseudoRandom();
      return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    };

    const points = [];
    let currentVal = baseVolume;
    const volFactor = volatility / 100;
    const shockMultiplier = marketShockActive ? 0.76 : 1.0;

    for (let i = 0; i < 6; i++) {
      const z = gaussianRandom();
      // Non-linear fluctuating drift (combines sine seasonal cycle + mean reversion)
      const seasonalDrift = Math.sin(i * 1.1) * (baseVolume * 0.08);
      const randomShock = z * (baseVolume * volFactor * 0.45);
      const meanReversion = (baseVolume - currentVal) * 0.22;

      // Anomaly stabilization effect when mitigated (+18% to +24% positive lift in runway)
      const anomalyLift = anomalyMitigated ? (baseVolume * 0.18 * (1 + i * 0.05)) : 0;

      currentVal = Math.max(
        baseVolume * 0.4,
        (currentVal + seasonalDrift + randomShock + meanReversion + anomalyLift) * (i === 3 ? shockMultiplier : 1.0)
      );

      const upperBand = currentVal * (1 + volFactor * (0.6 + i * 0.12));
      const lowerBand = currentVal * (1 - volFactor * (0.5 + i * 0.1));

      points.push({
        monthIndex: i,
        monthLabel: monthLabels[i],
        runway: Math.round(currentVal),
        upperBound: Math.round(upperBand),
        lowerBound: Math.round(lowerBand),
        volatilityPercent: Math.round(volFactor * 100 + Math.sin(i + seed) * 4)
      });
    }

    return points;
  }, [baseVolume, volatility, randomSeed, marketShockActive]);

  // Live real-time stochastic drift ticker (subtle fluctuations every 2.5s)
  useEffect(() => {
    if (!liveDriftActive) return;
    const interval = setInterval(() => {
      setRandomSeed(prev => prev + 1);
    }, 2500);
    return () => clearInterval(interval);
  }, [liveDriftActive]);

  // SVG Chart Geometry
  const width = 800;
  const height = 240;
  const padding = { top: 30, right: 40, bottom: 40, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const minVal = useMemo(() => {
    const minLower = Math.min(...stochasticData.map(d => d.lowerBound));
    return Math.max(0, Math.floor(minLower * 0.85));
  }, [stochasticData]);

  const maxVal = useMemo(() => {
    const maxUpper = Math.max(...stochasticData.map(d => d.upperBound));
    return Math.ceil(maxUpper * 1.12);
  }, [stochasticData]);

  const getX = (index) => padding.left + (index / (stochasticData.length - 1)) * chartWidth;
  const getY = (val) => padding.top + chartHeight - ((val - minVal) / Math.max(1, maxVal - minVal)) * chartHeight;

  // Build SVG Paths
  const linePoints = stochasticData.map((d, i) => `${getX(i)},${getY(d.runway)}`).join(' ');
  const upperPoints = stochasticData.map((d, i) => [getX(i), getY(d.upperBound)]);
  const lowerPoints = stochasticData.map((d, i) => [getX(i), getY(d.lowerBound)]).reverse();
  const confidencePolygon = [...upperPoints, ...lowerPoints].map(p => p.join(',')).join(' ');

  // Gradient Area Path under the expected runway
  const areaPath = `M ${getX(0)} ${getY(stochasticData[0].runway)} ` +
    stochasticData.map((d, i) => `L ${getX(i)} ${getY(d.runway)}`).join(' ') +
    ` L ${getX(stochasticData.length - 1)} ${padding.top + chartHeight} L ${getX(0)} ${padding.top + chartHeight} Z`;

  // Trigger Market Shock Simulation
  const handleTriggerShock = () => {
    setMarketShockActive(prev => !prev);
    setRandomSeed(s => s + 7);
  };

  // Remediation Action Handlers
  const handleDeploySmartDunning = () => {
    setActiveRemediation('dunning');
    setTimeout(() => {
      setAnomalyRisk(18.5);
      setAnomalyMitigated(true);
      if (!appliedProtocols.includes('dunning')) {
        setAppliedProtocols(prev => [...prev, 'dunning']);
      }
      setActiveRemediation(null);
      setRemediationFeedback('✅ Smart Dunning Matrix Deployed: Batch retries re-routed to Tue 10:15 AM EST. Risk dropped to 18.5%. $41,565.00 salvaged.');
      setRandomSeed(s => s + 5);
      addAuditLog('Business Anomaly Remediated', 'Smart Dunning Retry Matrix deployed. Churn risk reduced from 94.2% to 18.5%. Reclaimed $41,565.00.');
    }, 850);
  };

  const handleDispatchCardNotices = async () => {
    setActiveRemediation('notices');
    try {
      await dispatchOutreachEmail({
        targetEmail: 'fleet-procurement@jpmorgan.com',
        subjectLine: 'Urgent: Proactive Card Expiry & Fleet Billing Update Required',
        emailBody: '18 corporate fleet cards are scheduled for expiration in Q4. Please update payment tokens via our verified portal to prevent transaction disruption.',
        vendor: 'J.P. Morgan Commercial Fleet',
        invoiceId: 'FLEET-EXP-2026-Q4',
        amount: 24500,
        clauseRef: 'Fleet SLA Section 3.4'
      });
      dispatchOutreachWhatsApp({
        targetPhone: '+1 (415) 890-4821',
        messageBody: 'AegisRecover Sentinel: 18 J.P. Morgan corporate fleet cards expiring. Proactive renewal link sent to your registered billing email.'
      });

      if (!appliedProtocols.includes('notices')) {
        setAppliedProtocols(prev => [...prev, 'notices']);
      }
      setAnomalyRisk(r => Math.max(12.0, r - 25.0));
      setAnomalyMitigated(true);
      setActiveRemediation(null);
      setRemediationFeedback('✅ Proactive Card Update Notices dispatched to fleet holders via Resend API and WhatsApp Web.');
      addAuditLog('Proactive Card Notices Dispatched', 'Dispatched 18 fleet expiry notifications via Resend API & WhatsApp Web.');
    } catch (e) {
      setActiveRemediation(null);
    }
  };

  const handleEnforceEscrowHedge = () => {
    setActiveRemediation('escrow');
    setTimeout(() => {
      if (!appliedProtocols.includes('escrow')) {
        setAppliedProtocols(prev => [...prev, 'escrow']);
      }
      setAnomalyMitigated(true);
      setActiveRemediation(null);
      setRemediationFeedback('✅ Sovereign Escrow Hedge Enforced: Contractual buffer locked to prevent service suspension.');
      addAuditLog('Escrow Hedge Enforced', 'Contractual SLA buffer locked for active anomaly exposure.');
    }, 700);
  };

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 border border-slate-800 bg-[#0b101b] mb-8 relative overflow-hidden shadow-2xl">
      
      {/* 1. Interactive Business Anomaly & Diagnostic Command Center */}
      <div className={`mb-6 p-5 rounded-3xl border transition-all duration-300 shadow-xl ${
        anomalyMitigated
          ? 'bg-emerald-950/40 border-emerald-500/50 shadow-glow-emerald'
          : 'bg-amber-950/40 border-amber-500/50 shadow-glow-amber'
      }`}>
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-2xl border shrink-0 mt-0.5 ${
              anomalyMitigated
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
            }`}>
              {anomalyMitigated ? (
                <CheckCircle2 className="w-6 h-6 animate-pulse" />
              ) : (
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              )}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm sm:text-base font-bold text-white">
                  {anomalyMitigated
                    ? 'Business Anomaly Mitigated: Smart Dunning & Churn Protection Active'
                    : 'Business Anomaly: Degrading Card Authorization Trend & Enterprise Churn'}
                </h4>
                <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                  anomalyMitigated
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {anomalyRisk.toFixed(1)}% Risk Probability
                </span>
                {anomalyMitigated && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                    +$41,565.00 RECLAIMED
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {anomalyMitigated
                  ? 'Mitigation protocols deployed. Batch retries re-routed to Tuesday 10:15 AM EST. Impending card failure exposure reduced by 85.0% and Monte Carlo runway stabilized into positive territory.'
                  : 'Stochastic runway calculations indicate an impending $48,900.00 churn spike in Q4 due to J.P. Morgan Commercial Fleet card expirations and batch gateway limits.'}
              </p>

              {/* Protocol Badges if applied */}
              {appliedProtocols.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-mono text-slate-400">Active Protocols:</span>
                  {appliedProtocols.includes('dunning') && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Smart Dunning Matrix
                    </span>
                  )}
                  {appliedProtocols.includes('notices') && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Card Renewal Notices
                    </span>
                  )}
                  {appliedProtocols.includes('escrow') && (
                    <span className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Escrow Buffer
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Remediation Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full lg:w-auto">
            <button
              onClick={() => setShowDiagnosticModal(true)}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition"
            >
              <FileCheck className="w-4 h-4 text-sky-400" />
              <span>🔬 Diagnostic Deep-Dive</span>
            </button>

            {!anomalyMitigated ? (
              <button
                onClick={handleDeploySmartDunning}
                disabled={activeRemediation === 'dunning'}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition whitespace-nowrap"
              >
                {activeRemediation === 'dunning' ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Zap className="w-4 h-4" />
                )}
                <span>Deploy Smart Dunning Matrix</span>
              </button>
            ) : (
              <button
                onClick={() => setShowDiagnosticModal(true)}
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Remediation Active (Inspect)</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-time Feedback Toast inside Anomaly Banner */}
        {remediationFeedback && (
          <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{remediationFeedback}</span>
            </div>
            <button
              onClick={() => setRemediationFeedback('')}
              className="text-slate-500 hover:text-white text-xs px-2"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Chart Header & Interactive Volatility Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              MODULE 7: STOCHASTIC FORECASTING
            </span>
            <span className="text-xs text-slate-400 font-mono">• Monte Carlo & Brownian Motion</span>
          </div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Stochastic Demand & Recovery Runway (Rolling 6-Month Period)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Non-linear fluctuating projections showing volatility risk cones and expected capital recovery trajectories.
          </p>
        </div>

        {/* Dynamic Controls Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Volatility Slider */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono text-[11px]">Volatility (σ):</span>
            <input
              type="range"
              min="5"
              max="40"
              value={volatility}
              onChange={e => setVolatility(Number(e.target.value))}
              className="w-20 accent-emerald-500 cursor-pointer h-1.5"
            />
            <span className="text-emerald-400 font-mono font-bold text-[11px]">{volatility}%</span>
          </div>

          {/* Live Ticker Toggle */}
          <button
            onClick={() => setLiveDriftActive(!liveDriftActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-1.5 border ${
              liveDriftActive
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-glow-emerald'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${liveDriftActive ? 'animate-pulse text-emerald-400' : ''}`} />
            <span>Live Drift: {liveDriftActive ? 'ON' : 'PAUSED'}</span>
          </button>

          {/* Simulate Market Shock */}
          <button
            onClick={handleTriggerShock}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition flex items-center gap-1.5 border ${
              marketShockActive
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300 shadow-glow-amber animate-pulse'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-400" />
            <span>{marketShockActive ? 'Shock Applied (-24%)' : 'Simulate Q4 Shock'}</span>
          </button>
        </div>
      </div>

      {/* SVG Multi-Colored Line & Area Chart Container */}
      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[650px] overflow-visible select-none"
        >
          <defs>
            {/* Multi-colored Linear Gradient for Area Fill */}
            <linearGradient id="stochasticGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#06b6d4" stopOpacity="0.25" />
              <stop offset="85%" stopColor="#6366f1" stopOpacity="0.10" />
              <stop offset="100%" stopColor="#090d16" stopOpacity="0.0" />
            </linearGradient>

            {/* Confidence Interval Risk Cone Gradient */}
            <linearGradient id="riskConeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.18" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#ef4444" stopOpacity="0.22" />
            </linearGradient>

            {/* Line Stroke Gradient */}
            <linearGradient id="lineStrokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding.top + chartHeight * (1 - ratio);
            const val = Math.round(minVal + ratio * (maxVal - minVal));
            return (
              <g key={i}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + chartWidth}
                  y2={y}
                  stroke="#1e293b"
                  strokeDasharray="4 4"
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="#64748b"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  {formatCurrency(val)}
                </text>
              </g>
            );
          })}

          {/* Volatility Risk Cone Boundary Polygon */}
          <polygon
            points={confidencePolygon}
            fill="url(#riskConeGradient)"
            stroke="#f59e0b"
            strokeOpacity="0.4"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Gradient Area Fill under Expected Runway */}
          <path
            d={areaPath}
            fill="url(#stochasticGradient)"
          />

          {/* Fluctuating Non-Linear Runway Polyline */}
          <polyline
            points={linePoints}
            fill="none"
            stroke="url(#lineStrokeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {stochasticData.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.runway);
            const isHovered = hoveredPoint?.monthIndex === i;

            return (
              <g key={i} className="cursor-pointer">
                {/* Upper boundary point */}
                <circle
                  cx={cx}
                  cy={getY(d.upperBound)}
                  r={2.5}
                  fill="#10b981"
                  opacity={0.6}
                />
                {/* Lower boundary point */}
                <circle
                  cx={cx}
                  cy={getY(d.lowerBound)}
                  r={2.5}
                  fill="#ef4444"
                  opacity={0.6}
                />

                {/* Main expected line node */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 7 : 5}
                  fill="#0b101b"
                  stroke="#10b981"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                  onMouseEnter={() => setHoveredPoint(d)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />

                {/* Month labels on X-axis */}
                <text
                  x={cx}
                  y={padding.top + chartHeight + 20}
                  textAnchor="middle"
                  fill={isHovered ? '#10b981' : '#94a3b8'}
                  fontSize="11"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fontFamily="monospace"
                >
                  {d.monthLabel}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Overlay */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none p-3 rounded-xl bg-slate-950/95 border border-emerald-500/50 shadow-2xl text-xs font-mono space-y-1"
            style={{
              left: `${Math.min(getX(hoveredPoint.monthIndex) + 20, 600)}px`,
              top: `${Math.max(getY(hoveredPoint.runway) - 60, 20)}px`
            }}
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{hoveredPoint.monthLabel}</span>
            </div>
            <div className="text-emerald-400 font-bold">
              Runway: {formatCurrency(hoveredPoint.runway)}
            </div>
            <div className="text-slate-400 text-[10px]">
              Upper Cap: <span className="text-slate-200">{formatCurrency(hoveredPoint.upperBound)}</span>
            </div>
            <div className="text-slate-400 text-[10px]">
              Risk Floor: <span className="text-rose-400">{formatCurrency(hoveredPoint.lowerBound)}</span>
            </div>
            <div className="text-[9px] text-amber-300 pt-1 border-t border-slate-800">
              Volatility Factor: {hoveredPoint.volatilityPercent}%
            </div>
          </div>
        )}
      </div>

      {/* Legend & Stochastic Metadata Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs font-mono text-slate-400">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-emerald-400 rounded-full" />
            <span>Expected Runway</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-2 bg-amber-500/30 border border-amber-500/50 rounded" />
            <span>Stochastic Volatility Risk Cone</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Default Risk Floor</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px]">
          Simulated Algorithm: <span className="text-slate-300">GBM + Mean Reverting ARMA</span>
        </div>
      </div>

      {/* Interactive Forensic Diagnostic & Remediation Modal */}
      {showDiagnosticModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-[#0b101b] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            
            {/* Modal Glow Accent */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500" />

            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">
                      Business Anomaly Forensic Station
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      RAG ROOT-CAUSE AUDIT
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Detailed decline telemetry, impacted accounts, and active mitigation protocols
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. Key Metrics Exposure Scorecard */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-5">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-500">Gross Churn Exposure</div>
                <div className="text-xl font-black font-mono text-rose-400 mt-0.5">$48,900.00</div>
                <div className="text-[10px] text-slate-400 mt-1">Projected Q4 Authorization Drag</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-500">AI Salvaged Recovery</div>
                <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">$41,565.00</div>
                <div className="text-[10px] text-emerald-400/80 mt-1">85.0% Potential Recovery Rate</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="text-[10px] font-mono uppercase text-slate-500">Active Risk Probability</div>
                <div className="text-xl font-black font-mono text-amber-400 mt-0.5">{anomalyRisk.toFixed(1)}%</div>
                <div className="text-[10px] text-slate-400 mt-1">{anomalyMitigated ? 'Stabilized via Mitigation' : 'Critical Pre-Dunning Threshold'}</div>
              </div>
            </div>

            {/* 2. Transaction Decline Failure Waterfall */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                <span>Forensic Transaction Failure Modes</span>
                <span className="text-[10px] font-mono text-slate-400">Sample: 412 Corporate BINs</span>
              </div>

              <div className="space-y-2">
                {[
                  { mode: 'Card Expiration (J.P. Morgan Commercial Fleet BINs)', pct: 42, count: '18 Cards ($24,500.00)', color: 'bg-rose-500' },
                  { mode: 'Merchant Soft Decline (Midnight settlement batch cap)', pct: 31, count: '14 Txns ($14,200.00)', color: 'bg-amber-500' },
                  { mode: 'Gateway Latency Timeout (Cybersource & Stripe queue spike)', pct: 27, count: '9 Txns ($10,200.00)', color: 'bg-sky-500' }
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-300">{item.mode}</span>
                      <span className="text-slate-400 font-bold">{item.pct}% • {item.count}</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div className={`${item.color} h-full rounded-full transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Impacted Accounts & Cardholders Matrix */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-200">
                Impacted Vendor Accounts & Expiring Tokens
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {[
                  { name: 'J.P. Morgan Commercial Fleet', exp: 'Q4 Expiring', cards: '18 Cards', loss: '$24,500.00', status: 'Pending Notice' },
                  { name: 'Snowflake Enterprise Cloud', exp: 'Tier Overbilling', cards: 'Clause 8.1', loss: '$14,200.00', status: 'Audit Ready' },
                  { name: 'Datadog APM Enterprise', exp: 'SLA Breach Overdue', cards: 'MSA §4b', loss: '$10,200.00', status: 'Penalty Logged' }
                ].map((acc, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white">{acc.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{acc.cards} • {acc.exp}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold font-mono text-rose-400">{acc.loss}</div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                        {acc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Actionable Remediation Protocols */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Execute Real-Time Mitigation Protocols</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={handleDeploySmartDunning}
                  disabled={activeRemediation === 'dunning'}
                  className="p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 hover:from-emerald-500/30 hover:to-teal-500/20 border border-emerald-500/40 text-left transition space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    {appliedProtocols.includes('dunning') && (
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">ACTIVE</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-emerald-200 group-hover:text-emerald-100">1. Smart Dunning Matrix</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Re-route retries to Tuesday 10:15 AM EST. Lifts Monte Carlo runway.</p>
                </button>

                <button
                  onClick={handleDispatchCardNotices}
                  disabled={activeRemediation === 'notices'}
                  className="p-3 rounded-xl bg-gradient-to-br from-sky-500/20 to-indigo-500/10 hover:from-sky-500/30 hover:to-indigo-500/20 border border-sky-500/40 text-left transition space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <Mail className="w-4 h-4 text-sky-400" />
                    {appliedProtocols.includes('notices') && (
                      <span className="text-[9px] font-mono text-sky-400 font-bold">SENT</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-sky-200 group-hover:text-sky-100">2. Dispatch Card Notices</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Sends Resend emails & WhatsApp links to 18 fleet cardholders.</p>
                </button>

                <button
                  onClick={handleEnforceEscrowHedge}
                  disabled={activeRemediation === 'escrow'}
                  className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 hover:from-indigo-500/30 hover:to-purple-500/20 border border-indigo-500/40 text-left transition space-y-1 group"
                >
                  <div className="flex items-center justify-between">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    {appliedProtocols.includes('escrow') && (
                      <span className="text-[9px] font-mono text-indigo-400 font-bold">LOCKED</span>
                    )}
                  </div>
                  <div className="text-xs font-bold text-indigo-200 group-hover:text-indigo-100">3. Escrow Hedging Buffer</div>
                  <p className="text-[10px] text-slate-400 leading-tight">Freezes billing leak progression under contract SLA clause.</p>
                </button>
              </div>

              {remediationFeedback && (
                <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{remediationFeedback}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-[11px] font-mono text-slate-400">
                AegisRecover Stochastic Remediation Protocol • Zero-Trust Certified
              </div>
              <button
                onClick={() => setShowDiagnosticModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-white transition"
              >
                Done & Apply to Runway
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
