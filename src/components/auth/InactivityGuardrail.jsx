import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  Clock,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  KeyRound,
  AlertOctagon
} from 'lucide-react';

export function InactivityGuardrail() {
  const {
    authStatus,
    sessionSecondsRemaining,
    showInactivityWarning,
    setShowInactivityWarning,
    handleUserActivity,
    unlockSession,
    currentUser,
    userRole,
    addAuditLog
  } = useApp();

  const [unlockCode, setUnlockCode] = useState('');
  const [unlockError, setUnlockError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  // Warning Modal (when <= 60 seconds remain)
  const isWarningVisible = showInactivityWarning && authStatus === 'authenticated' && sessionSecondsRemaining > 0;
  
  // Full Lock Screen (when session time is 0 or status is locked)
  const isLocked = authStatus === 'session_locked' || sessionSecondsRemaining <= 0;

  const handleExtendSession = () => {
    handleUserActivity();
    addAuditLog('Session Inactivity Extended', 'User confirmed active presence prior to auto-timeout');
  };

  const handleUnlockSubmit = (e) => {
    e.preventDefault();
    setIsUnlocking(true);
    setUnlockError('');

    setTimeout(() => {
      setIsUnlocking(false);
      unlockSession();
      setUnlockCode('');
    }, 600);
  };

  if (!isWarningVisible && !isLocked) {
    return null;
  }

  // Render Full Lock Screen
  if (isLocked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
        <div className="w-full max-w-md bg-[#0f172a] border border-amber-500/40 rounded-2xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-4 shadow-glow-amber">
            <Lock className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-bold text-slate-100 mb-1">Zero-Trust Session Auto-Locked</h2>
          <p className="text-xs text-slate-400 mb-6">
            Terminated due to 15-minute strict inactivity compliance guardrail. Re-authenticate to resume workflow.
          </p>

          <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 text-left mb-6 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-500">Active Operator:</span>
              <span className="text-slate-300 font-medium">{currentUser.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Security Boundary:</span>
              <span className="text-emerald-400 font-mono">{userRole}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Timeout Policy:</span>
              <span className="text-amber-400 font-mono">15m Auto-Revoke (SOC 2 CC6.1)</span>
            </div>
          </div>

          <form onSubmit={handleUnlockSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-400 mb-1 text-left">
                Enter Master Password or TOTP Token
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={unlockCode}
                  onChange={(e) => setUnlockCode(e.target.value)}
                  placeholder="Enter token (or press Resume)"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUnlocking}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg transition"
            >
              {isUnlocking ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Resume Secure Session</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Render 60-Second Warning Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-[#0f172a] border border-amber-500/50 rounded-2xl shadow-2xl p-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500 animate-pulse" />

        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-3 animate-bounce">
          <Clock className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-100 mb-1">Inactivity Timeout Warning</h3>
        <p className="text-xs text-slate-400 mb-4">
          Due to Zero-Trust guardrails, your session will be locked automatically in:
        </p>

        <div className="text-4xl font-mono font-bold text-amber-400 mb-5 tracking-tight">
          00:{sessionSecondsRemaining.toString().padStart(2, '0')}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              // Let it lock immediately
              unlockSession();
            }}
            className="flex-1 py-2 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition"
          >
            Lock Now
          </button>
          <button
            type="button"
            onClick={handleExtendSession}
            className="flex-1 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition"
          >
            I'm Still Here
          </button>
        </div>
      </div>
    </div>
  );
}
