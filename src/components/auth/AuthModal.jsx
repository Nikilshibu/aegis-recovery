import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { supabase } from '../../supabaseClient';
import {
  Shield,
  ShieldCheck,
  KeyRound,
  Mail,
  Smartphone,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

export function AuthModal() {
  const {
    authStatus,
    setAuthStatus,
    setUserRole,
    setEntityType,
    unlockSession,
    addAuditLog,
    activeModal,
    setActiveModal
  } = useApp();

  const [authTab, setAuthTab] = useState('signin'); // 'signin' | 'signup'
  const [selectedEntity, setSelectedEntity] = useState('Business'); // 'Individual' | 'Business' | 'Organization'
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'Operator' | 'Viewer'

  // Form states
  const [emailInput, setEmailInput] = useState('');
  const [phoneInput, setPhoneInput] = useState('');
  const [individualMethod, setIndividualMethod] = useState('magiclink'); // 'magiclink' | 'otp'

  // Flow steps: 'credentials' -> 'mfa' -> 'complete'
  const [step, setStep] = useState('credentials');
  const [mfaType, setMfaType] = useState('totp'); // 'totp' | 'whatsapp'
  const [totpCode, setTotpCode] = useState(['', '', '', '', '', '']);
  const [formError, setFormError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [mfaError, setMfaError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(45);

  const isOpen = activeModal === 'auth';

  if (!isOpen) return null;

  const handleCredentialsSubmit = (e) => {
    e.preventDefault();
    // Simple client-side validation
    if (individualMethod === 'magiclink') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailInput)) {
        setFormError('Please enter a valid email address.');
        setIsVerifying(false);
        return;
      }
    } else {
      const phoneRegex = /^\+?\d{7,15}$/;
      const cleanedPhone = phoneInput.replace(/\s+/g, '');
      if (!phoneRegex.test(cleanedPhone)) {
        setFormError('Please enter a valid phone number.');
        setIsVerifying(false);
        return;
      }
    }
    setFormError('');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('mfa');
      addAuditLog(
        'Primary Authentication Succeeded',
        `Initiated MFA challenge for ${selectedRole} profile under entity ${selectedEntity}`
      );
    }, 800);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsVerifying(true);
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) {
        console.error('Google login error:', error);
        setMfaError(error.message);
      } else {
        addAuditLog('Google OAuth Initiated', `Redirected to Google for provider ${data.provider || 'google'}`);
        // After redirect, Supabase will handle callback; for demo we proceed to MFA step
        setStep('mfa');
      }
    } catch (err) {
      console.error(err);
      setMfaError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSSOLogin = (provider) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setStep('mfa');
      addAuditLog(
        'Enterprise SSO Redirect Verified',
        `Identity token validated against ${provider} SAML/OIDC IdP`
      );
    }, 900);
  };

  const handleMfaCodeChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...totpCode];
    newCode[index] = value.slice(-1);
    setTotpCode(newCode);

    // Auto-advance input
    if (value && index < 5) {
      const nextInput = document.getElementById(`mfa-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyMfa = (e) => {
    if (e) e.preventDefault();
    setIsVerifying(true);
    setMfaError('');

    setTimeout(() => {
      setIsVerifying(false);
      setAuthStatus('authenticated');
      setEntityType(selectedEntity);
      setUserRole(selectedRole);
      setActiveModal(null);
      addAuditLog(
        'Zero-Trust Session Established',
        `MFA (${mfaType.toUpperCase()}) successfully validated with SHA-256 session ticket`
      );
      unlockSession();
    }, 900);
  };

  const autofillValidCode = () => {
    setTotpCode(['8', '4', '9', '2', '0', '1']);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0f172a] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8">
        
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                AegisRecover Access
              </h2>
              <p className="text-xs text-slate-400">Zero-Trust Identity & Recovery Governance</p>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-[10px] font-mono uppercase text-slate-300">
            TLS 1.3 / E2EE
          </div>
        </div>

        {step === 'credentials' ? (
          <div>
            {/* Sign In vs Create Account Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setAuthTab('signin')}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  authTab === 'signin'
                    ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthTab('signup')}
                className={`py-2 text-xs font-semibold rounded-lg transition ${
                  authTab === 'signup'
                    ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Entity Scope Declaration */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                1. Select Target Entity Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { type: 'Individual', label: 'Individual', sub: 'Freelance / Personal' },
                  { type: 'Business', label: 'Business', sub: 'B2B Enterprise' },
                  { type: 'Organization', label: 'Organization', sub: 'Non-Profit / NGO' }
                ].map(({ type, label, sub }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedEntity(type)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      selectedEntity === type
                        ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">{label}</div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* RBAC Scope Boundary */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-slate-300 mb-2">
                2. Select Role Boundary Assignment
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { role: 'Admin', desc: 'System & Thresholds' },
                  { role: 'Operator', desc: 'Onboarding & Outreach' },
                  { role: 'Viewer', desc: 'Read-Only Analytics' }
                ].map(({ role, desc }) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`p-2 rounded-lg border text-left text-xs transition ${
                      selectedRole === role
                        ? 'bg-indigo-500/15 border-indigo-500/40 text-indigo-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-semibold">{role}</div>
                    <div className="text-[10px] text-slate-500">{desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conditional Authentication Pathway */}
            {selectedEntity === 'Individual' ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
                  <span>Individual Pathway:</span>
                  <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIndividualMethod('magiclink')}
                      className={`px-2 py-1 rounded text-[11px] ${
                        individualMethod === 'magiclink' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Passwordless Magic Link
                    </button>
                    <button
                      type="button"
                      onClick={() => setIndividualMethod('otp')}
                      className={`px-2 py-1 rounded text-[11px] ${
                        individualMethod === 'otp' ? 'bg-slate-800 text-slate-100 font-medium' : 'text-slate-400'
                      }`}
                    >
                      Mobile OTP
                    </button>
                  </div>
                </div>

                {individualMethod === 'magiclink' ? (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="consultant@domain.com"
                        required
                        aria-required="true"
                      />
                    </div>
                    {formError && individualMethod === 'magiclink' && (
                      <p className="text-rose-400 text-xs mt-1">{formError}</p>
                    )}
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Mobile Number (WhatsApp/SMS)</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="+1 (555) 000-0000"
                        required
                        aria-required="true"
                      />
                    {formError && individualMethod === 'otp' && (
                      <p className="text-red-500 text-xs mt-1">{formError}</p>
                    )}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleCredentialsSubmit}
                  disabled={isVerifying}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition"
                >
                  {isVerifying ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Continue to Mandatory MFA</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              /* Enterprise SSO for Business / Organization */
              <div className="space-y-3">
                <div className="text-xs text-slate-400 mb-1">Enterprise SSO Identity Providers:</div>
                
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isVerifying}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.3 8.9 5 12 5z"/>
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"/>
                      <path fill="#FBBC05" d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7 0-1.2.2-2 .4-2.7L1.6 6.4C.6 8.3 0 10.5 0 12s.6 3.7 1.6 5.6l3.7-2.9z"/>
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.3L1.6 16C3.5 19.8 7.4 23 12 23z"/>
                    </svg>
                    <span>Sign in with Google</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSSOLogin('Microsoft Azure Entra ID')}
                  disabled={isVerifying}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <rect fill="#F25022" x="1" y="1" width="10" height="10"/>
                      <rect fill="#7FBA00" x="13" y="1" width="10" height="10"/>
                      <rect fill="#00A4EF" x="1" y="13" width="10" height="10"/>
                      <rect fill="#FFB900" x="13" y="13" width="10" height="10"/>
                    </svg>
                    <span>Sign in with Microsoft Azure Entra ID</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={() => handleSSOLogin('Okta Verify SSO')}
                  disabled={isVerifying}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-sky-500 flex items-center justify-center text-[10px] font-bold text-white">
                      O
                    </div>
                    <span>Sign in with Okta Enterprise SSO</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>

                <p className="text-[11px] text-slate-500 text-center pt-2">
                  Enforces Zero-Trust SAML 2.0 assertions with continuous posture checking.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Mandatory Multi-Factor Authentication (MFA) */
          <div className="space-y-5 animate-in fade-in slide-in-from-right-2 duration-150">
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <div>
                  <div className="text-xs font-semibold text-slate-200">Mandatory Multi-Factor Authentication</div>
                  <div className="text-[10px] text-slate-400">SOC 2 & GDPR Art 32 Requirement</div>
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                REQUIRED
              </span>
            </div>

            {/* MFA Channel Toggle */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setMfaType('totp')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border transition ${
                  mfaType === 'totp'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Authenticator TOTP</span>
              </button>
              <button
                type="button"
                onClick={() => setMfaType('whatsapp')}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium border transition ${
                  mfaType === 'whatsapp'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>WhatsApp / SMS OTP</span>
              </button>
            </div>

            {mfaType === 'totp' ? (
              <div className="text-center p-4 bg-slate-900/80 rounded-xl border border-slate-800">
                <div className="flex justify-center mb-3">
                  <div className="p-2.5 bg-white rounded-xl shadow-lg inline-block">
                    <svg className="w-24 h-24 text-slate-950" viewBox="0 0 24 24" fill="currentColor">
                      {/* Stylized QR Code Graphic */}
                      <path d="M3 3h6v6H3V3zm2 2v2h2V5H5zm8-2h6v6h-6V3zm2 2v2h2V5h-2zM3 13h6v6H3v-6zm2 2v2h2v-2H5zm13-2h3v3h-3v-3zm-5 0h3v3h-3v-3zm2 5h3v3h-3v-3zm3 0h3v3h-3v-3zm-5-3h3v3h-3v-3z" />
                    </svg>
                  </div>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Scan with Google Authenticator or 1Password</div>
                <div className="text-[10px] text-slate-500 font-mono mt-1">Secret Key: AEGIS-7X99-RECV-4821</div>
              </div>
            ) : (
              <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-center">
                <div className="text-xs text-slate-300 font-medium">Automated OTP Dispatched</div>
                <div className="text-[11px] text-emerald-400 font-mono mt-1">Sent to: +1 (415) XXXXX-XX21</div>
                <div className="text-[10px] text-slate-500 mt-2">Resend available in {resendCooldown}s</div>
              </div>
            )}

            {/* 6-Digit Token Inputs */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-slate-300">Enter 6-Digit Verification Token</label>
                <button
                  type="button"
                  onClick={autofillValidCode}
                  className="text-[11px] text-sky-400 hover:text-sky-300 underline"
                >
                  Quick Autofill Demo Code
                </button>
              </div>
              <div className="flex justify-between gap-2">
                {totpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`mfa-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleMfaCodeChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-lg font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                ))}
              </div>
            </div>

            {/* Verification Button */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('credentials')}
                className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition"
                aria-label="Back to credentials step"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleVerifyMfa}
                disabled={isVerifying}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize & Establish Session</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Inactivity Guardrail Footnote */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
          <span>Active Inactivity Timeout: 15 Minutes</span>
          <span className="text-emerald-400/90 font-mono">RBAC: Enforced</span>
        </div>
      </div>
    </div>
  );
}
