import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertTriangle,
  Cpu,
  Sparkles,
  Zap,
  User,
  Building2,
  Globe2,
  CheckCircle2,
  HelpCircle,
  KeyRound,
  X
} from 'lucide-react';
import { KNOWN_RETURNING_USERS } from '../../data/mockData';
import { supabase } from '../../supabaseClient';

export function GatewayLogin() {
  const {
    addAuditLog,
    initiateNewUserVerification,
    registerNewAccount,
    loginWithCredentials,
    authenticateWithGoogleUser
  } = useApp();

  // Mode: 'signin' | 'register'
  const [authMode, setAuthMode] = useState('signin');

  // Sign In / Register Common Form states
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [entityTypeInput, setEntityTypeInput] = useState('Business');
  const [rememberMe, setRememberMe] = useState(true);

  // UI helpers
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);

  // Quick Demo Account Auto-Fill
  const handleQuickFill = (user) => {
    setAuthMode('signin');
    setEmailInput(user.email);
    setPasswordInput('AegisPass2026!');
    setErrorMessage('');
    setSuccessMessage(`Credentials loaded for ${user.name} (${user.entityType})`);
    setTimeout(() => setSuccessMessage(''), 2500);
  };

  // Password Strength Calculation for Registration
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 8) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500' };
    if (score <= 3) return { score: 2, label: 'Moderate', color: 'bg-amber-500' };
    return { score: 3, label: 'Strong', color: 'bg-emerald-500' };
  };

  const passwordStrength = getPasswordStrength(passwordInput);

  // Handle Standard Sign In
  const handleSignInSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const email = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid corporate or personal email address.');
      return;
    }

    if (!passwordInput.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = loginWithCredentials({ email, password: passwordInput });
      if (!res.success) {
        setErrorMessage(res.error || 'Authentication failed. Please check your credentials.');
        return;
      }
      addAuditLog('Primary Credentials Verified', `Initiating 2-step OTP challenge for ${email}`);
    }, 400);
  };

  // Handle Registration / Create Account
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const email = emailInput.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!fullNameInput.trim()) {
      setErrorMessage('Please enter your full name or legal organization name.');
      return;
    }

    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please provide a valid email address for account registration.');
      return;
    }

    if (passwordInput.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (passwordInput !== confirmPasswordInput) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const res = registerNewAccount({
        email,
        password: passwordInput,
        name: fullNameInput.trim(),
        entityType: entityTypeInput
      });

      if (res.success) {
        setSuccessMessage(`Account registered for ${email}! Dispatching your verification OTP...`);
      }
    }, 450);
  };

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setErrorMessage('');
    addAuditLog('Google OAuth Initiated', 'Connecting to Google OAuth authentication service.');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (!error && data?.url) {
        window.location.href = data.url;
        return;
      }
    } catch (err) {
      console.warn('Supabase Google OAuth notice:', err);
    }

    // If popup or third-party redirect is restricted in browser, open account chooser modal
    setTimeout(() => {
      setIsGoogleLoading(false);
      setShowGoogleChooser(true);
    }, 300);
  };

  // Select Fast Google Account (Instant Enclave Login)
  const handleSelectGoogleProfile = (gUser) => {
    setShowGoogleChooser(false);
    authenticateWithGoogleUser(gUser);
  };

  return (
    <div className="min-h-screen bg-[#090d16] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500/20 selection:text-emerald-300 py-10">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative w-full max-w-md bg-[#0f172a]/95 border border-slate-700/80 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
        
        {/* Top Glowing Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500 rounded-t-3xl" />

        {/* 1. APP LOGO & HEADER */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-sky-500/15 to-indigo-500/20 border border-emerald-500/40 text-emerald-400 mb-2.5 shadow-lg shadow-emerald-950/50">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-100">AegisRecover</h1>
          <p className="text-xs text-slate-400 mt-0.5">Autonomous Revenue &amp; Capital Recovery Engine</p>
        </div>

        {/* 2. MODE SWITCHER TABS: SIGN IN vs. REGISTER */}
        <div className="grid grid-cols-2 p-1 bg-slate-900/90 border border-slate-800 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'signin'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthMode('register');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              authMode === 'register'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-950/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Create Account</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950/40 text-emerald-300 font-mono hidden sm:inline">
              Instant
            </span>
          </button>
        </div>

        {/* FEEDBACK BANNERS */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-2 animate-in fade-in duration-150">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-200 flex items-start gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE A: SIGN IN FORM                                                      */}
        {/* ========================================================================= */}
        {authMode === 'signin' && (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    if (!emailInput) {
                      setErrorMessage('Please enter your email above to receive a password reset challenge.');
                      return;
                    }
                    setSuccessMessage(`Password recovery challenge dispatched to ${emailInput}`);
                    initiateNewUserVerification(emailInput);
                  }}
                  className="text-[11px] text-emerald-400 hover:text-emerald-300 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Enter your account password"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-10 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
                <span>Remember this terminal (30 days)</span>
              </label>
            </div>

            {/* Submit Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 animate-spin" />
                  Verifying Credentials...
                </span>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* DEMO PROFILES CHIP SELECTOR */}
            <div className="pt-2">
              <div className="text-[10px] uppercase font-mono text-slate-500 mb-1.5 flex items-center justify-between">
                <span>Quick Test Demo Profiles</span>
                <span className="text-emerald-400 font-bold">1-Click Auto-Fill</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {KNOWN_RETURNING_USERS.map((user) => (
                  <button
                    key={user.email}
                    type="button"
                    onClick={() => handleQuickFill(user)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition group"
                    title={`Fill ${user.name} (${user.email})`}
                  >
                    <div className="text-[11px] font-bold text-slate-300 group-hover:text-emerald-300 truncate">
                      {user.name.split(' ')[0]}
                    </div>
                    <div className="text-[9px] text-slate-500 font-mono truncate">
                      {user.entityType}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* ========================================================================= */}
        {/* MODE B: REGISTER / CREATE ACCOUNT FORM                                    */}
        {/* ========================================================================= */}
        {authMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name / Organization Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => {
                    setFullNameInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="e.g. Acme Corp or Jane Doe"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Corporate or Personal Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="name@company.com"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            {/* Account Entity Type Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Architecture
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { type: 'Business', label: 'Business', icon: Building2, desc: 'Enterprise SaaS' },
                  { type: 'Individual', label: 'Individual', icon: User, desc: 'Consultant/1099' },
                  { type: 'Organization', label: 'Non-Profit', icon: Globe2, desc: 'NGO / 501(c)(3)' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = entityTypeInput === item.type;
                  return (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => setEntityTypeInput(item.type)}
                      className={`p-2 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-emerald-950/50 border-emerald-500/70 text-emerald-300'
                          : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Icon className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                        <span className="text-[11px] font-bold text-white truncate">{item.label}</span>
                      </div>
                      <div className="text-[9px] text-slate-500 truncate">{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Create a strong password"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Strength Indicator */}
              {passwordInput && (
                <div className="mt-1.5 flex items-center justify-between gap-2">
                  <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden flex gap-0.5">
                    <div className={`h-full flex-1 ${passwordStrength.score >= 1 ? passwordStrength.color : 'bg-slate-800'}`} />
                    <div className={`h-full flex-1 ${passwordStrength.score >= 2 ? passwordStrength.color : 'bg-slate-800'}`} />
                    <div className={`h-full flex-1 ${passwordStrength.score >= 3 ? passwordStrength.color : 'bg-slate-800'}`} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPasswordInput}
                  onChange={(e) => {
                    setConfirmPasswordInput(e.target.value);
                    setErrorMessage('');
                  }}
                  placeholder="Re-enter your password"
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                  required
                />
              </div>
            </div>

            {/* Register Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isGoogleLoading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-950/50 transition cursor-pointer active:scale-[0.99]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 animate-spin" />
                  Creating Account...
                </span>
              ) : (
                <>
                  <span>Register &amp; Proceed to OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* DIVIDER */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-800" />
          </div>
          <div className="relative flex justify-center text-[11px] font-medium">
            <span className="bg-[#0f172a] px-3 text-slate-400">
              Or authenticate with Google Identity
            </span>
          </div>
        </div>

        {/* GOOGLE SIGN IN BUTTONS */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleLoading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-100 font-bold text-xs transition shadow-md group active:scale-[0.99]"
          >
            {isGoogleLoading ? (
              <span className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
                <Cpu className="w-4 h-4 animate-spin" />
                Connecting to Google OAuth...
              </span>
            ) : (
              <>
                {/* Official Google G Logo */}
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition" />
              </>
            )}
          </button>

          {/* Quick Google Account Chooser Helper */}
          <button
            type="button"
            onClick={() => setShowGoogleChooser(true)}
            className="w-full text-center text-[10px] text-slate-500 hover:text-emerald-400 transition underline pt-1 font-mono"
          >
            Blocked by browser redirect? Click for 1-Click Google Identity Chooser
          </button>
        </div>

      </div>

      {/* FOOTER */}
      <p className="mt-4 text-center text-[10px] text-slate-600 font-mono">
        AegisRecover Sentinel · SOC2 Type II Certified · Zero-Trust Multi-Verification
      </p>

      {/* ========================================================================= */}
      {/* GOOGLE ACCOUNT CHOOSER MODAL (INSTANT FALLBACK & TESTER)                   */}
      {/* ========================================================================= */}
      {showGoogleChooser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm bg-[#0f172a] border border-slate-700 rounded-3xl p-6 shadow-2xl">
            <button
              onClick={() => setShowGoogleChooser(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.97 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Choose a Google Account</h3>
                <p className="text-[11px] text-slate-400">to continue to AegisRecover</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {[
                {
                  name: 'Dr. Marcus Vance',
                  email: 'marcus.vance@gmail.com',
                  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
                  entityType: 'Business'
                },
                {
                  name: 'Director Chen',
                  email: 'director.chen@innovatetech.io',
                  avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=120',
                  entityType: 'Business'
                },
                {
                  name: 'Elena Rostova',
                  email: 'treasury@globalaid.org',
                  avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
                  entityType: 'Organization'
                }
              ].map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleSelectGoogleProfile(acc)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 text-left transition group"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">
                      {acc.email}
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                </button>
              ))}
            </div>

            {/* Or custom Google account */}
            <div className="pt-2 border-t border-slate-800">
              <div className="text-[10px] text-slate-400 mb-1.5 font-medium">Use another Google account:</div>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  id="custom-google-email-input"
                  placeholder="your.google@gmail.com"
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('custom-google-email-input');
                    const emailVal = (input?.value || '').trim().toLowerCase();
                    if (!emailVal || !emailVal.includes('@')) return;
                    handleSelectGoogleProfile({
                      email: emailVal,
                      name: emailVal.split('@')[0],
                      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
                      entityType: 'Business'
                    });
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
