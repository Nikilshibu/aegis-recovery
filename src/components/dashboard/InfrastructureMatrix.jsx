import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { INFRASTRUCTURE_AGENTS, LIVE_API_TOKENS } from '../../data/mockData';
import {
  Cpu,
  Key,
  ShieldCheck,
  Zap,
  Activity,
  CheckCircle2,
  RefreshCw,
  Server,
  Lock,
  ExternalLink,
  Bot
} from 'lucide-react';

export function InfrastructureMatrix() {
  const { addAuditLog } = useApp();
  const [refreshingToken, setRefreshingToken] = useState(null);

  const handleTestToken = (tokenName) => {
    setRefreshingToken(tokenName);
    setTimeout(() => {
      setRefreshingToken(null);
      addAuditLog(
        'API Token Scope Validated',
        `Validated non-repudiation signature on ${tokenName}. Confirmed strict least-privilege boundary.`
      );
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Section Header */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Server className="w-6 h-6 text-emerald-400" />
            Infrastructure Status & Multi-Agent Matrix
          </h2>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            High Availability
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Autonomous multi-agent consensus nodes, real-time event ingestion throughput, and least-privilege API tokens
        </p>
      </div>

      {/* Multi-Agent Cross-Checking Status Matrix */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Bot className="w-5 h-5 text-sky-400" />
              Autonomous Multi-Agent Consensus Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              3 independent algorithmic agents validate every anomaly prior to staging or auto-dispatch
            </p>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            Consensus Quorum: 3/3 Healthy
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {INFRASTRUCTURE_AGENTS.map((agent) => (
            <div
              key={agent.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">{agent.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                </div>
                <div className="text-[10px] font-mono text-emerald-400 mb-2">{agent.status}</div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{agent.role}</p>
              </div>

              <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs font-mono">
                <div>
                  <span className="text-[10px] text-slate-500 block">Throughput:</span>
                  <span className="text-slate-300 font-semibold">{agent.throughput}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Round-Trip:</span>
                  <span className="text-emerald-400 font-semibold">{agent.latency}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Connection Tokens & API Perimeter */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Key className="w-5 h-5 text-emerald-400" />
              Live API Connection Tokens & Guardrails
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Read-Only and Draft-Only scope boundaries preventing accidental destructive actions
            </p>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Zero-Trust Enforced</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {LIVE_API_TOKENS.map((token) => (
            <div
              key={token.name}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">{token.name}</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {token.status}
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-950 text-[11px] font-mono text-sky-300 border border-slate-800 mb-3">
                  <Lock className="w-3 h-3 inline mr-1 text-slate-500" />
                  {token.permission}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span>Last Sync: {token.lastSync}</span>
                <button
                  type="button"
                  onClick={() => handleTestToken(token.name)}
                  className="text-emerald-400 hover:text-emerald-300 font-mono underline"
                >
                  {refreshingToken === token.name ? 'Checking...' : 'Verify Scope'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
