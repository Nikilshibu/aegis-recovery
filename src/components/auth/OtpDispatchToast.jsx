import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle2, X, Wifi, Server } from 'lucide-react';

/**
 * OtpDispatchToast — Slides in from the top of the screen the moment a new user
 * submits their email address and the OTP is "dispatched". Auto-dismisses after 5s.
 */
export function OtpDispatchToast({ email, visible, onDismiss }) {
  const [progress, setProgress] = useState(100);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!visible) {
      setShow(false);
      setProgress(100);
      return;
    }

    // Slight mount delay for the slide-down animation to feel smooth
    const mountTimer = setTimeout(() => setShow(true), 50);

    // Progress bar ticks down over 5 seconds
    const DURATION = 5000;
    const TICK = 50;
    let elapsed = 0;

    const ticker = setInterval(() => {
      elapsed += TICK;
      setProgress(Math.max(0, 100 - (elapsed / DURATION) * 100));
      if (elapsed >= DURATION) {
        clearInterval(ticker);
        setShow(false);
        setTimeout(onDismiss, 300); // wait for slide-up animation
      }
    }, TICK);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(ticker);
    };
  }, [visible, onDismiss]);

  if (!visible && !show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] flex justify-center px-4 pt-4 pointer-events-none">
      <div
        className={`w-full max-w-lg pointer-events-auto transition-all duration-300 ease-out ${
          show ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}
      >
        <div className="relative bg-[#0a1628] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-sky-400 to-emerald-500" />

          {/* Progress bar */}
          <div
            className="absolute bottom-0 left-0 h-0.5 bg-emerald-500/60 transition-all duration-50 ease-linear"
            style={{ width: `${progress}%` }}
          />

          <div className="p-4 flex items-start gap-4">
            {/* Animated icon */}
            <div className="shrink-0 relative">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shadow-glow-emerald">
                <Mail className="w-5 h-5 text-emerald-400" />
              </div>
              {/* Ping dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-sm font-bold text-slate-100">
                  OTP Dispatched — Check Your Inbox
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono truncate mb-1.5">
                Destination: <span className="text-sky-400 font-semibold">{email}</span>
              </p>

              {/* Mail-server metadata strip */}
              <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-slate-500">
                <span className="flex items-center gap-1">
                  <Server className="w-3 h-3 text-slate-600" />
                  From: noreply@aegisrecover.io
                </span>
                <span className="text-slate-700">•</span>
                <span className="flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-slate-600" />
                  MX: smtp.mailsec.aegis
                </span>
                <span className="text-slate-700">•</span>
                <span>DKIM: PASS • SPF: PASS</span>
                <span className="text-slate-700">•</span>
                <span>Exp: 10 min</span>
              </div>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => {
                setShow(false);
                setTimeout(onDismiss, 300);
              }}
              className="shrink-0 p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
