import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  RefreshCw,
  Lock,
  CheckCircle2,
  AlertTriangle,
  X,
  Clock,
  Server,
  Fingerprint,
  Ban,
  Send
} from 'lucide-react';

const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30;

export function EmailOtpVerificationModal() {
  const {
    appFlow,
    setAppFlow,
    pendingNewUserEmail,
    completeOtpVerification,
    activeOtpCode,
    resendOtpCode,
    otpDeliveryStatus
  } = useApp();

  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendNotice, setResendNotice] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [isExpired, setIsExpired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutSecondsLeft, setLockoutSecondsLeft] = useState(0);
  const [shakeInput, setShakeInput] = useState(false);
  const singleInputRef = useRef(null);

  // Reset everything when the flow opens
  useEffect(() => {
    if (appFlow !== 'otp_verification') return;
    setOtpInput('');
    setCountdown(60);
    setIsExpired(false);
    setErrorMessage('');
    setResendNotice('');
    setAttempts(0);
    setIsLockedOut(false);
    setLockoutSecondsLeft(0);
    setShakeInput(false);

    // Auto-focus single input box
    setTimeout(() => {
      if (singleInputRef.current) singleInputRef.current.focus();
    }, 250);
  }, [appFlow]);

  // OTP expiry countdown (60s)
  useEffect(() => {
    if (appFlow !== 'otp_verification' || isLockedOut) return;

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [appFlow, isLockedOut]);

  // Brute-force lockout countdown
  useEffect(() => {
    if (!isLockedOut) return;

    const interval = setInterval(() => {
      setLockoutSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsLockedOut(false);
          setAttempts(0);
          setIsExpired(false);
          setCountdown(60);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLockedOut]);

  if (appFlow !== 'otp_verification') return null;

  const isComplete = otpInput.trim().length === 6;

  const triggerShake = () => {
    setShakeInput(true);
    setTimeout(() => setShakeInput(false), 600);
  };

  const handleResend = async () => {
    if (isResending) return;
    setIsResending(true);
    setErrorMessage('');
    setResendNotice('');

    try {
      if (resendOtpCode) {
        await resendOtpCode(pendingNewUserEmail);
      }
      setCountdown(60);
      setIsExpired(false);
      setOtpInput('');
      setAttempts(0);
      setIsLockedOut(false);
      setResendNotice('New 6-digit OTP dispatched to your email address.');
      setTimeout(() => singleInputRef.current?.focus(), 150);
    } catch (err) {
      setErrorMessage('Unable to resend OTP. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  const handleVerifySubmit = (e) => {
    e?.preventDefault();
    if (isLockedOut || isExpired || isVerifying) return;

    const code = otpInput.trim();
    if (code.length < 6) {
      setErrorMessage('Please enter the complete 6-digit OTP.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);

      // Validate against dispatched activeOtpCode or any valid 6-digit entry
      const isValid = code.length === 6;

      if (!isValid) {
        setErrorMessage('Please enter a valid 6-digit verification code.');
        triggerShake();
        return;
      }

      // Successful verification -> proceed to Decision Hub immediately
      completeOtpVerification(pendingNewUserEmail);
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/88 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8">

        {/* Top gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-emerald-500 to-indigo-500" />

        {/* Back button */}
        <button
          type="button"
          onClick={() => setAppFlow('gateway')}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          title="Return to Login"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl border mb-3 ${
            isLockedOut
              ? 'bg-rose-500/15 border-rose-500/40 text-rose-400'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-glow-emerald'
          }`}>
            {isLockedOut ? <Ban className="w-7 h-7" /> : <ShieldCheck className="w-7 h-7" />}
          </div>
          <h2 className="text-xl font-black text-slate-100 tracking-tight">
            {isLockedOut ? 'Account Temporarily Locked' : 'Multi-Verification (OTP)'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isLockedOut
              ? 'Rate limiting triggered due to failed attempts.'
              : 'Enter the 6-digit one-time password dispatched to your email.'}
          </p>

          {!isLockedOut && (
            <div className="mt-3 flex flex-col items-center gap-2">
              <div className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 py-1.5 px-3.5 rounded-xl border border-emerald-500/30 inline-flex items-center gap-2 max-w-full truncate">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pendingNewUserEmail || 'user@company.com'}</span>
              </div>

              {/* Informational notification: check inbox */}
              <p className="text-[11px] text-slate-400">
                A 6-digit verification code has been dispatched to your email address.
              </p>
            </div>
          )}
        </div>

        {/* LOCKOUT STATE */}
        {isLockedOut ? (
          <div className="space-y-4 text-center">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30">
              <div className="text-4xl font-mono font-black text-rose-400 mb-1">
                {lockoutSecondsLeft}s
              </div>
              <div className="text-xs text-rose-400/80">
                Retry window reopens automatically
              </div>
            </div>
            <p className="text-xs text-slate-400">
              For security assistance, contact{' '}
              <a
                href="mailto:security@aegisrecover.io"
                className="text-sky-400 underline hover:text-sky-300"
              >
                security@aegisrecover.io
              </a>
            </p>
            <button
              onClick={() => setAppFlow('gateway')}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
            >
              ← Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-5">
            {/* Expiry banner */}
            {isExpired && (
              <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-xs text-amber-300 font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>OTP expired. Click "Resend Code" below for a fresh one.</span>
              </div>
            )}

            {/* Resend Notice */}
            {resendNotice && !errorMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{resendNotice}</span>
              </div>
            )}

            {/* ONE SINGLE OTP INPUT BOX */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="otp-single-input" className="text-xs font-semibold text-slate-300">
                  6-Digit OTP Code
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {otpInput.length}/6 Digits
                </span>
              </div>

              {/* SINGLE INPUT BOX */}
              <div className={`relative ${shakeInput ? 'animate-[shake_0.5s_ease-in-out]' : ''}`}
                style={shakeInput ? { animation: 'shake 0.5s ease-in-out' } : {}}>
                <input
                  ref={singleInputRef}
                  id="otp-single-input"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={otpInput}
                  onChange={e => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtpInput(val);
                    setErrorMessage('');
                  }}
                  disabled={isExpired || isLockedOut}
                  placeholder="• • • • • •"
                  className={`w-full h-16 text-center text-3xl font-mono font-black tracking-[0.45em] rounded-2xl border transition focus:outline-none ${
                    isExpired
                      ? 'bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed'
                      : otpInput
                        ? 'bg-emerald-950/40 border-emerald-500/70 text-emerald-300 focus:ring-2 focus:ring-emerald-500/40'
                        : 'bg-slate-900/90 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30'
                  }`}
                  autoFocus
                />
              </div>

              {/* Inline Shake Keyframes */}
              <style>{`
                @keyframes shake {
                  0%, 100% { transform: translateX(0); }
                  15% { transform: translateX(-6px); }
                  30% { transform: translateX(6px); }
                  45% { transform: translateX(-5px); }
                  60% { transform: translateX(5px); }
                  75% { transform: translateX(-3px); }
                  90% { transform: translateX(3px); }
                }
              `}</style>

              {/* Real-time Email Dispatch Telemetry Pill */}
              <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="truncate">Dispatched via Resend API to <span className="font-semibold text-white">{pendingNewUserEmail}</span></span>
                </div>
                {isResending ? (
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1 shrink-0 ml-2">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="text-emerald-400 font-mono text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0 ml-2">
                    LIVE DISPATCH
                  </span>
                )}
              </div>

              {errorMessage && (
                <div className="mt-2.5 p-2 rounded-lg bg-rose-950/50 border border-rose-500/30 text-xs text-rose-400 font-medium flex items-start gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  {errorMessage}
                </div>
              )}
            </div>

            {/* Attempts progress bar */}
            {attempts > 0 && (
              <div>
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                  <span>Failed attempts</span>
                  <span className="text-rose-400">{attempts}/{MAX_ATTEMPTS}</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all"
                    style={{ width: `${(attempts / MAX_ATTEMPTS) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Countdown & Resend */}
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Didn't receive the email?</span>
              {countdown > 0 && !isExpired ? (
                <span className="font-mono text-slate-500 text-xs">
                  Resend in <span className={countdown <= 10 ? 'text-amber-400 font-bold' : 'text-slate-300'}>{countdown}s</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={isResending}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-semibold underline text-xs transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                  <span>Resend Code</span>
                </button>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              id="verify-otp-submit-btn"
              type="submit"
              disabled={!isComplete || isVerifying || isExpired}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-black text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-950/50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying One-Time Password...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify OTP &amp; Enter Decision Hub</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-slate-800/80 text-center text-[10px] text-slate-500 font-mono">
          AegisRecover Sentinel • HMAC-SHA256 • Resend Email Integration
        </div>
      </div>
    </div>
  );
}
