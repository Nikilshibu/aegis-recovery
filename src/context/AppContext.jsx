import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import {
  ENTITY_PROFILES,
  CURRENCY_SYMBOLS,
  EXCHANGE_RATES_FROM_USD,
  INITIAL_LEAKS,
  INITIAL_AUDIT_LOGS,
  LIVE_API_TOKENS,
  KNOWN_RETURNING_USERS,
  HISTORICAL_RECOVERY_RECORDS,
  INITIAL_PAYMENT_LEDGER
} from '../data/mockData';
import { supabase, checkUserStatus, enforceRlsBoundaries } from '../supabaseClient';
import {
  dispatchWelcomeEmail,
  dispatchRecordCreatedNotification,
  dispatchVerificationSuccessNotification,
  dispatchPaymentReminder,
  dispatchOtpEmail,
  dispatchPenaltyNotification,
  dispatchRecoveryStatusNotification
} from '../services/notificationService';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Navigation & Gateway Flow State
  // 'gateway' -> 'otp_verification' -> 'onboarding' -> 'dashboard'
  const [appFlow, setAppFlow] = useState('gateway');
  const [pendingNewUserEmail, setPendingNewUserEmail] = useState('');
  const [isReturningUser, setIsReturningUser] = useState(true);
  const [activeOtpCode, setActiveOtpCode] = useState('749201');
  const [otpDeliveryStatus, setOtpDeliveryStatus] = useState(null);

  // Resend Email Dispatches & Notification Center State
  const [emailDispatches, setEmailDispatches] = useState([
    {
      id: 'resend_msg_init1',
      type: 'welcome',
      subject: 'Welcome to AegisRecover: Profile Certified for ApexFlow Technologies Inc.',
      recipient: 'sarah.vance@apexflow.io',
      timestamp: new Date().toISOString().slice(0, 19) + ' UTC',
      provider: 'Resend API (Live)'
    }
  ]);
  const [isEmailCenterOpen, setIsEmailCenterOpen] = useState(false);

  // Master-Detail Record Focus on Dashboard:
  // Defaults to the primary active record so Demand Forecasting & Business Anomalies are always active
  const [selectedDashboardRecord, setSelectedDashboardRecord] = useState(HISTORICAL_RECOVERY_RECORDS[0]);

  // Welcome Message Alert Banner
  const [welcomeNotification, setWelcomeNotification] = useState({
    visible: false,
    title: '',
    message: ''
  });

  // Global Context: Per-Record Context Integration (Sidebar Linking)
  // 'selectedRecordId = null' initially
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  // Ingestion Layout Success Alert Banner
  const [recordSuccessAlert, setRecordSuccessAlert] = useState(null);

  // Core Persistent Tab Navigation - Default set to 'ledger' (Records Ledger matrix alone)
  // 'ledger' | 'dashboard' | 'ingestion' | 'payments' | 'support' | 'security'
  const [currentTab, setCurrentTab] = useState('ledger');

  // Supabase Connection & Health Status
  const [supabaseStatus, setSupabaseStatus] = useState({
    online: false,
    rlsActive: true,
    latencyMs: 38,
    lastPing: null
  });

  // Entity and Role Management
  const [entityType, setEntityType] = useState('Business'); // 'Individual' | 'Business' | 'Organization'
  const [userRole, setUserRole] = useState('Admin'); // 'Admin' | 'Operator' | 'Viewer'
  const [authStatus, setAuthStatus] = useState('unauthenticated'); // 'authenticated' | 'unauthenticated' | 'mfa_pending' | 'session_locked'
  const [currentUser, setCurrentUser] = useState({
    uuid: 'usr_sec_8491028',
    name: 'Sarah Vance, CISSP',
    email: 'sarah.vance@apexflow.io',
    phone: '+1 (415) 890-4821',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  });

  // Zero-Trust Security Controls
  const [isPiiMasked, setIsPiiMasked] = useState(true);
  const [monetaryThreshold, setMonetaryThreshold] = useState(2500); // $ threshold for full autonomy
  const [currency, setCurrency] = useState('USD');
  const [timeframe, setTimeframe] = useState('MTD'); // 'MTD' | 'QTD' | 'YTD'

  // Module 4: Adaptive Outbound Recovery Channel Configuration
  // 'email' | 'whatsapp'
  const [outboundChannel, setOutboundChannel] = useState('email');
  const [outboundEmail, setOutboundEmail] = useState('');
  const [outboundPhone, setOutboundPhone] = useState('');

  // Dynamic Financial Leak State
  const [leaks, setLeaks] = useState(INITIAL_LEAKS);
  const [historicalRecords, setHistoricalRecords] = useState(HISTORICAL_RECOVERY_RECORDS);
  const [selectedRecordForDrillDown, setSelectedRecordForDrillDown] = useState(null);

  // History Filtering States
  const [historySearchQuery, setHistorySearchQuery] = useState('');
  const [historyEntityFilter, setHistoryEntityFilter] = useState('all'); // 'all' | 'Organization' | 'Business' | 'Individual'
  const [historyStatusFilter, setHistoryStatusFilter] = useState('all'); // 'all' | 'Reclaimed' | 'Active Dunning' | 'In-Arbitration' | 'Auto-Escrow Held'

  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);
  const [anomalyTriggered, setAnomalyTriggered] = useState(true);
  const [preDunningActivated, setPreDunningActivated] = useState(false);

  // Module 5: Intermediate Pending Validation Queue
  const [pendingQueue, setPendingQueue] = useState([
    {
      id: 'PEND-9042',
      entityName: 'ApexFlow Technologies Inc.',
      entityType: 'Business',
      vendor: 'Snowflake Enterprise Data Cloud',
      category: 'Contract Tier Discrepancy',
      invoiceId: 'SNOW-INV-2026-9041',
      amount: 6350,
      currency: 'USD',
      channel: 'email',
      recipient: 'billing-disputes@snowflake.com',
      peerChannel: 'email',
      peerRecipient: 'billing-disputes@snowflake.com',
      waitingPeriod: true,
      peerVerificationStatus: 'waiting_for_peer',
      secondsLeft: 900, // 15:00
      initialSeconds: 900,
      status: 'pending', // 'pending' | 'authorized' | 'terminated' | 'auto_executed'
      extractedDetails: 'Contract Clause 8.1 Compute Multiplier variance parsed from invoice scan. Potential credit: $6,350.00.',
      deepLinkId: null,
      dateInjected: '2026-09-04 15:30 UTC'
    }
  ]);

  // Module 6: Granular Payment Tracking & Audit Ledger State
  const [paymentsLedger, setPaymentsLedger] = useState(INITIAL_PAYMENT_LEDGER);
  const [activeMilestoneNotification, setActiveMilestoneNotification] = useState(null);

  // Automated Email Notification Preferences (Reminders, Penalty, Recovery Status)
  const [automatedEmailOptions, setAutomatedEmailOptions] = useState({
    reminders: true,
    penalty: true,
    recoveryStatus: true
  });

  // Real-time Auto-Mail Delivery Toast State for User Feedback
  const [autoMailToast, setAutoMailToast] = useState(null);

  useEffect(() => {
    if (!autoMailToast?.visible) return;
    const timer = setTimeout(() => {
      setAutoMailToast(null);
    }, 7000);
    return () => clearTimeout(timer);
  }, [autoMailToast]);

  const toggleAutomatedEmailOption = (optionKey) => {
    setAutomatedEmailOptions(prev => {
      const updated = { ...prev, [optionKey]: !prev[optionKey] };
      return updated;
    });
  };

  // Module 3: AI Customer Support Center State
  const [voiceRecordingActive, setVoiceRecordingActive] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isProcessingVocal, setIsProcessingVocal] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [isGlobalVoiceModalOpen, setIsGlobalVoiceModalOpen] = useState(false);
  const recognitionRef = useRef(null);
  const latestTranscriptRef = useRef('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'AegisLLM Recovery Specialist online. Connected to live Supabase RLS ledger. How can I assist with your billing disputes, dunning retries, or contract audits today?',
      timestamp: 'Just now',
      tags: ['Autonomous Specialist', 'SOC 2 Enforced']
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  // Dynamic Overrides for Entity Stats
  const [customStats, setCustomStats] = useState({
    recoveredAdd: 0,
    riskSubtract: 0
  });

  // Active Modals & Slide-overs
  const [activeModal, setActiveModal] = useState(null); // 'onboarding' | 'verification' | 'outreach' | 'cert' | 'auth'
  const [modalData, setModalData] = useState(null);

  // Inactivity Guardrail (15 minutes = 900 seconds)
  const [sessionSecondsRemaining, setSessionSecondsRemaining] = useState(900);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);

  // Test Supabase Connection on Mount
  useEffect(() => {
    async function pingSupabase() {
      const res = await supabase.testConnection();
      setSupabaseStatus({
        online: res.online,
        rlsActive: res.rlsActive,
        latencyMs: res.latencyMs,
        lastPing: new Date().toLocaleTimeString()
      });
    }
    pingSupabase();
  }, []);

  // Generate SHA-like mock hash
  const generateMockHash = () => {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 16; i++) {
      hash += chars[Math.floor(Math.random() * chars.length)];
    }
    return hash + '...' + hash.substring(2, 6);
  };

  // Log an immutable audit event
  const addAuditLog = useCallback((action, details, actorOverride = null) => {
    const newLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      actor: actorOverride || `${userRole} (${currentUser.email})`,
      action,
      details,
      hash: generateMockHash(),
      status: 'Immutable Verified'
    };
    setAuditLogs(prev => [newLog, ...prev]);
  }, [userRole, currentUser]);

  // Session Activity Reset Handler
  const handleUserActivity = useCallback(() => {
    if (authStatus === 'authenticated' && appFlow === 'dashboard') {
      setSessionSecondsRemaining(900);
      setShowInactivityWarning(false);
    }
  }, [authStatus, appFlow]);

  // Inactivity Timer Hook
  useEffect(() => {
    if (authStatus !== 'authenticated' || appFlow !== 'dashboard') return;

    const interval = setInterval(() => {
      setSessionSecondsRemaining(prev => {
        if (prev <= 1) {
          setAuthStatus('session_locked');
          setShowInactivityWarning(false);
          addAuditLog('Session Auto-Locked', '15-minute zero-trust inactivity guardrail triggered');
          return 0;
        }
        if (prev <= 60 && !showInactivityWarning) {
          setShowInactivityWarning(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [authStatus, appFlow, showInactivityWarning, addAuditLog]);

  // Global activity listeners for user presence
  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    const debouncedActivity = () => {
      if (sessionSecondsRemaining > 60) {
        setSessionSecondsRemaining(900);
      }
    };

    events.forEach(e => window.addEventListener(e, debouncedActivity));
    return () => events.forEach(e => window.removeEventListener(e, debouncedActivity));
  }, [sessionSecondsRemaining]);

  // Currency Converter
  const formatCurrency = useCallback((amountUSD) => {
    const rate = EXCHANGE_RATES_FROM_USD[currency] || 1;
    const converted = amountUSD * rate;
    const symbol = CURRENCY_SYMBOLS[currency] || '$';

    return `${symbol}${converted.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })}`;
  }, [currency]);

  // PII Masking Utility (Bank accounts, personal IDs masked as +91 XXXXX-XX123)
  const maskPii = useCallback((text, type = 'auto') => {
    if (!isPiiMasked || !text) return text;

    // Phone numbers: mask middle digits as +91 XXXXX-XX123
    if (type === 'phone' || String(text).includes('+') || /^\d{10,12}$/.test(String(text).replace(/[\s-()]/g, ''))) {
      const cleaned = String(text);
      if (cleaned.startsWith('+91')) {
        return '+91 XXXXX-XX' + cleaned.slice(-3);
      }
      return cleaned.replace(/(\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?(\d{2,4})/, (m, p1, p2) => {
        return `${p1 || ''}XXXXX-XX${p2 || cleaned.slice(-3)}`;
      });
    }

    // Bank Account / Card / IBAN
    if (type === 'iban' || type === 'card' || String(text).includes('CARD-') || String(text).includes('IBAN')) {
      return `**** **** **** ${String(text).slice(-4)}`;
    }

    // Tax IDs (EIN, SSN, PAN, GSTIN, VAT)
    if (type === 'tax' || String(text).includes('EIN') || String(text).includes('SSN') || String(text).includes('PAN') || String(text).includes('GSTIN') || String(text).includes('VAT')) {
      const parts = String(text).split(': ');
      if (parts.length > 1) {
        return `${parts[0]}: **-***${parts[1].slice(-4)}`;
      }
      return `***-**-${String(text).slice(-4)}`;
    }

    // Email address masking
    if (type === 'email' || String(text).includes('@')) {
      const [user, domain] = String(text).split('@');
      if (!domain) return text;
      return `${user.charAt(0)}***${user.slice(-1)}@${domain}`;
    }

    return text;
  }, [isPiiMasked]);

  // Financial Scoreboard Dynamic Values
  const currentProfile = ENTITY_PROFILES[entityType] || ENTITY_PROFILES.Business;
  const activeLeaksCount = leaks.filter(l => l.status === 'Pending').length;
  const currentTotalAtRisk = Math.max(0, currentProfile.stats.totalAtRisk - customStats.riskSubtract);
  const currentRecoveredCapital = currentProfile.stats.recoveredMTD + customStats.recoveredAdd;

  // Returning User Login Handler
  const loginReturningUser = (userObj) => {
    const userUuid = userObj.uuid || userObj.id || `usr_${userObj.email.replace(/[^a-z0-9]/g, '').slice(0, 10)}`;
    const userEmail = userObj.email.toLowerCase();

    setCurrentUser({
      uuid: userUuid,
      name: userObj.name,
      email: userObj.email,
      phone: userObj.phone || (userObj.entityType === 'Individual' ? '+91 98765-43210' : '+1 (415) 890-4821'),
      avatar: userObj.avatar
    });
    setEntityType(userObj.entityType);
    setUserRole(userObj.role || 'Admin');
    setIsReturningUser(true);
    setAuthStatus('authenticated');
    setAppFlow('dashboard');
    setCurrentTab('dashboard');
    setSessionSecondsRemaining(900);
    setSelectedDashboardRecord(HISTORICAL_RECOVERY_RECORDS[0]);

    // First when we login, dispatch welcome message via Resend API
    dispatchWelcomeEmail({
      email: userEmail,
      name: userObj.name,
      entityType: userObj.entityType,
      entityName: userObj.entityName || userObj.name,
      uuid: userUuid
    }).then(res => {
      if (res?.record) {
        setEmailDispatches(prev => [res.record, ...prev]);
      }
    });

    // Display top welcome message banner
    setWelcomeNotification({
      visible: true,
      title: `Welcome back, ${userObj.name}!`,
      message: `Secure session verified for ${userEmail}. Welcome notification dispatched via Resend. Displaying past records for registered account (${userUuid}).`
    });

    // Update outbound channel contacts
    setOutboundEmail(userObj.email);
    if (userObj.entityType === 'Individual') {
      setOutboundPhone('+91 98765-43210');
      setOutboundChannel('whatsapp');
    } else {
      setOutboundPhone('+1 (415) 890-4821');
      setOutboundChannel('email');
    }

    // Strict Row Level Security (RLS) enforcement
    const userRecords = enforceRlsBoundaries(HISTORICAL_RECOVERY_RECORDS, userUuid, userEmail);
    setHistoricalRecords(userRecords.length > 0 ? userRecords : HISTORICAL_RECOVERY_RECORDS.filter(r => r.entityType === userObj.entityType));

    addAuditLog(
      'Returning User Session Authenticated',
      `Supabase RLS Enforced. Welcome email sent. Direct routing to Dashboard Hub for ${userObj.entityName} (${userObj.entityType}). UUID: ${userUuid}.`
    );
  };

  // Reactive Post-Login State Evaluation Callback Function (Google OAuth & Session Redirect)
  const handlePostLoginStateEvaluation = useCallback(async (authenticatedUser) => {
    if (!authenticatedUser) return;
    
    const userUid = authenticatedUser.id || authenticatedUser.uid || 'usr_oauth_unknown';
    const userEmail = (authenticatedUser.email || '').toLowerCase();
    const userName = authenticatedUser.user_metadata?.full_name || 
                     authenticatedUser.user_metadata?.name || 
                     userEmail.split('@')[0] || 'Authorized User';

    addAuditLog(
      'Post-Login Evaluation Initiated',
      `Evaluating session redirect for auth.uid: ${userUid} against public.profiles table`
    );

    let profileRow = null;

    // 1. Cross-reference secure authenticated 'auth.uid()' token identifier against 'public.profiles' database table
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userUid)
        .limit(1);

      if (data && data.length > 0) {
        profileRow = data[0];
      }
    } catch (err) {
      console.warn('public.profiles query error:', err);
    }

    // Fallback: cross-reference email in profiles table or known profiles cache
    if (!profileRow && userEmail) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .limit(1);
        if (data && data.length > 0) {
          profileRow = data[0];
        }
      } catch (e) {}

      if (!profileRow) {
        const matchedKnown = KNOWN_RETURNING_USERS.find(
          u => u.email.toLowerCase() === userEmail || u.id === userUid
        );
        if (matchedKnown) {
          profileRow = {
            id: userUid,
            name: matchedKnown.name,
            email: userEmail,
            entityType: matchedKnown.entityType,
            entityName: matchedKnown.entityName,
            role: matchedKnown.role || 'Admin',
            avatar: matchedKnown.avatar
          };
        }
      }
    }

    // REQUIREMENT: First when we login, it must send a welcome message
    dispatchWelcomeEmail({
      email: userEmail,
      name: profileRow?.name || userName,
      entityType: profileRow?.entityType || 'Business',
      entityName: profileRow?.entityName || `${userName}'s Workspace`,
      uuid: userUid
    }).then(res => {
      if (res?.record) {
        setEmailDispatches(prev => [res.record, ...prev]);
      }
    });

    setWelcomeNotification({
      visible: true,
      title: `Welcome to AegisRecover, ${profileRow?.name || userName}!`,
      message: `Authenticated via Supabase Google OAuth (auth.uid: ${userUid}). Welcome email dispatched via Resend. Displaying past records for registered account.`
    });

    if (profileRow) {
      // -----------------------------------------------------------------
      // RETURNING (OLD) USER FLOW:
      // Active profile row entry matches their specific ID:
      // Bypass all forms instantly and render filterable historical dashboard matrix
      // populated with their Supabase rows.
      // -----------------------------------------------------------------
      const finalEntity = profileRow.entityType || 'Business';
      setCurrentUser({
        uuid: userUid,
        name: profileRow.name || userName,
        email: userEmail,
        avatar: profileRow.avatar || authenticatedUser.user_metadata?.avatar_url,
        role: profileRow.role || 'Admin'
      });
      setEntityType(finalEntity);
      setUserRole(profileRow.role || 'Admin');
      setIsReturningUser(true);
      setAuthStatus('authenticated');
      setAppFlow('record_selection');
      setCurrentTab('dashboard');
      setSelectedDashboardRecord(HISTORICAL_RECOVERY_RECORDS[0]);

      // Populate Supabase rows
      let userRecords = [];
      try {
        const { data: dbRecords } = await supabase
          .from('recovery_records')
          .select('*')
          .eq('user_uuid', userUid);
        if (dbRecords && dbRecords.length > 0) {
          userRecords = dbRecords;
        }
      } catch (e) {}

      if (userRecords.length === 0) {
        userRecords = enforceRlsBoundaries(HISTORICAL_RECOVERY_RECORDS, userUid, userEmail);
      }
      if (userRecords.length === 0) {
        userRecords = HISTORICAL_RECOVERY_RECORDS.filter(r => r.entityType === finalEntity);
      }
      setHistoricalRecords(userRecords);

      addAuditLog(
        'Returning User Session Verified',
        `Active profile verified for auth.uid: ${userUid}. Routed to Decision Hub (Record Selection) with ${userRecords.length} historical records ready.`
      );
    } else {
      // -----------------------------------------------------------------
      // NEW USER FLOW:
      // No matching profile table row is detected:
      // DO NOT auto-route to onboarding! The user must ask for onboarding from Decision Hub!
      // -----------------------------------------------------------------
      setPendingNewUserEmail(userEmail);
      setCurrentUser({
        uuid: userUid,
        name: userName,
        email: userEmail,
        avatar: authenticatedUser.user_metadata?.avatar_url,
        isNew: true
      });
      setAuthStatus('authenticated');
      setAppFlow('record_selection'); // Intermediate Decision Hub

      addAuditLog(
        'New User Session Routed to Decision Hub',
        `Identity verified for auth.uid: ${userUid}. Routed to Decision Hub (Record Selection). User must ask for onboarding page.`
      );
    }
  }, [addAuditLog]);

  // Pathway Handlers (Defined before useEffect so listener can invoke it)
  const initiateNewUserVerification = useCallback((email) => {
    // Generate dynamic 6-digit cryptographic verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(generatedOtp);
    setPendingNewUserEmail(email);
    setAppFlow('otp_verification');
    setOtpDeliveryStatus({ sending: true, success: false, recipient: email });

    addAuditLog(
      'Two-Step Multi-Verification OTP Dispatched',
      `6-digit challenge token dispatched to ${email} for multi-verification.`
    );

    // Asynchronously dispatch OTP via Resend API
    dispatchOtpEmail({ email, otpCode: generatedOtp }).then(res => {
      console.log('📬 [AegisRecover OTP Challenge] Dispatched to', email, ':', generatedOtp, res);
      setOtpDeliveryStatus({ sending: false, success: true, recipient: email, provider: res?.provider || 'Resend' });
      if (res?.record) {
        setEmailDispatches(prev => [res.record, ...prev]);
      }
    }).catch(err => {
      console.warn('Failed to dispatch OTP email:', err);
      setOtpDeliveryStatus({ sending: false, success: false, error: err.message, recipient: email });
    });
  }, [addAuditLog]);

  const resendOtpCode = useCallback((email) => {
    const targetEmail = email || pendingNewUserEmail;
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(generatedOtp);
    setOtpDeliveryStatus({ sending: true, success: false, recipient: targetEmail });

    addAuditLog(
      'OTP Challenge Resent',
      `Fresh 6-digit challenge token dispatched to ${targetEmail}.`
    );

    return dispatchOtpEmail({ email: targetEmail, otpCode: generatedOtp }).then(res => {
      console.log('📬 [AegisRecover OTP Challenge Resent] To', targetEmail, ':', generatedOtp, res);
      setOtpDeliveryStatus({ sending: false, success: true, recipient: targetEmail, provider: res?.provider || 'Resend' });
      if (res?.record) {
        setEmailDispatches(prev => [res.record, ...prev]);
      }
      return { success: true, otpCode: generatedOtp };
    }).catch(err => {
      console.warn('Failed to resend OTP email:', err);
      setOtpDeliveryStatus({ sending: false, success: false, error: err.message, recipient: targetEmail });
      return { success: false, error: err.message, otpCode: generatedOtp };
    });
  }, [pendingNewUserEmail, addAuditLog]);

  // Ref guards to avoid re-triggering session checks on state/callback changes
  const hasMountedSessionCheckRef = useRef(false);
  const initiateNewUserVerificationRef = useRef(initiateNewUserVerification);
  initiateNewUserVerificationRef.current = initiateNewUserVerification;
  const addAuditLogRef = useRef(addAuditLog);
  addAuditLogRef.current = addAuditLog;
  const authStatusRef = useRef(authStatus);
  authStatusRef.current = authStatus;

  // Reactive Post-Login Session Check upon initial mount ONLY
  useEffect(() => {
    if (hasMountedSessionCheckRef.current) return;
    hasMountedSessionCheckRef.current = true;

    let authListener = null;

    // Detect if this page load is an active Google OAuth callback redirect
    const isOAuthRedirect = window.location.hash.includes('access_token') || 
                            window.location.search.includes('code=');

    if (isOAuthRedirect) {
      // If returning from Google OAuth redirect, route to mandatory Multi-Verification (OTP)!
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          addAuditLogRef.current(
            'OAuth Callback Initiated',
            `Google OAuth token received for ${session.user.email}. Routing to mandatory multi-verification OTP challenge.`
          );
          initiateNewUserVerificationRef.current(session.user.email);
        }
      }).catch(err => {
        console.warn('OAuth callback session evaluation notice:', err);
      });
    }

    try {
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session?.user?.email) {
          // If we are not already authenticated or verified, route to multi-verification
          if (authStatusRef.current !== 'authenticated') {
            initiateNewUserVerificationRef.current(session.user.email);
          }
        }
      });
      authListener = data?.subscription;
    } catch (err) {
      console.warn('onAuthStateChange listener notice:', err);
    }

    return () => {
      if (authListener?.unsubscribe) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const completeOtpVerification = (verifiedEmail) => {
    const targetEmail = verifiedEmail || pendingNewUserEmail;
    
    // IMMEDIATE SYNCHRONOUS TRANSITION TO DECISION HUB (No network blocking)
    setAuthStatus('authenticated');
    setAppFlow('record_selection');

    addAuditLog(
      'Two-Step Verification Succeeded',
      `Identity verified for ${targetEmail}. User registered & authenticated. Routed to Decision Hub (Record Selection).`
    );

    // Asynchronous background status check & telemetry dispatch
    checkUserStatus(targetEmail, KNOWN_RETURNING_USERS).then(userCheck => {
      if (userCheck?.status === 'RETURNING_USER') {
        const userObj = userCheck.user;
        const userUuid = userObj.uuid || userObj.id || `usr_${userObj.email.replace(/[^a-z0-9]/g, '').slice(0, 10)}`;
        setCurrentUser({
          uuid: userUuid,
          name: userObj.name,
          email: userObj.email,
          phone: userObj.phone || (userObj.entityType === 'Individual' ? '+91 98765-43210' : '+1 (415) 890-4821'),
          avatar: userObj.avatar
        });
        setEntityType(userObj.entityType || 'Business');
        setUserRole(userObj.role || 'Admin');
        setIsReturningUser(true);
      } else {
        const newUuid = `usr_${Date.now().toString(36)}`;
        setCurrentUser({
          uuid: newUuid,
          name: targetEmail.split('@')[0],
          email: targetEmail,
          phone: '+1 (415) 890-4821',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
        });
        setEntityType('Business');
        setUserRole('Admin');
        setIsReturningUser(false);
      }

      // Background notification
      dispatchVerificationSuccessNotification({
        email: targetEmail,
        name: userCheck?.user?.name || targetEmail.split('@')[0],
        entityType: userCheck?.user?.entityType || entityType,
        verifiedTimestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      }).then(res => {
        if (res?.record) {
          setEmailDispatches(prev => [res.record, ...prev]);
        }
      }).catch(() => {});
    }).catch(err => {
      console.warn('Background checkUserStatus notice:', err);
    });
  };

  const logoutToGateway = useCallback(() => {
    setAuthStatus('unauthenticated');
    setAppFlow('gateway');
    setSelectedRecordId(null);
    setSelectedRecordForDrillDown(null);
    setCurrentTab('dashboard');
    addAuditLog('Session Terminated', 'User logged out to Gateway Login. Mandatory authentication required.');
  }, [addAuditLog]);

  const completeNewUserOnboarding = (profileData) => {
    const newUuid = `usr_new_${Date.now().toString(36)}`;
    const newRecordId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

    setCurrentUser({
      uuid: newUuid,
      name: profileData.name || (profileData.segment === 'Individual' ? 'Alex Rivera' : 'ApexFlow Tech'),
      email: pendingNewUserEmail || 'new-client@entity.io',
      phone: profileData.phone || '+1 (555) 234-5678',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
    });
    setEntityType(profileData.segment);

    // Initial historical recovery record for newly onboarded user
    const newRecord = {
      id: newRecordId,
      ownerEmail: pendingNewUserEmail,
      ownerUuid: newUuid,
      entityName: profileData.name,
      entityType: profileData.segment,
      dateLogged: new Date().toISOString().slice(0, 10),
      category: profileData.scannedDiscrepancy ? 'Contract Tier Discrepancy (Scanned)' : 'Baseline Ledger Onboarded',
      vendor: profileData.scannedVendor || (profileData.segment === 'Individual' ? 'Client Retainer Network' : 'AWS Cloud Enterprise'),
      amountInitial: profileData.scannedAmount || 8500,
      amountRecovered: profileData.scannedAmount ? Math.floor(profileData.scannedAmount * 0.9) : 7650,
      currency: profileData.currency || 'USD',
      status: 'Reclaimed',
      causeAnalysis: profileData.scannedCause || `Initial financial health audit completed. ERP connector (${profileData.techStack || 'Stripe + Accounting'}) mapped to RAG verification pipeline.`,
      metaValues: {
        invoiceId: profileData.scannedInvoiceId || `INV-ONBOARD-${Math.floor(1000 + Math.random() * 9000)}`,
        ledgerTxn: `TXN-INITIAL-${Date.now().toString().slice(-6)}`,
        confidenceScore: 99,
        slaSection: 'Onboarding Baseline Security & SLA Verification',
        gateway: profileData.techStack || 'Stripe Connect',
        detectionLatency: '28ms'
      },
      pastCommunications: [
        {
          id: `COMM-${Date.now().toString().slice(-4)}`,
          type: outboundChannel,
          timestamp: new Date().toISOString().slice(0, 16) + ' UTC',
          recipient: outboundChannel === 'email' ? pendingNewUserEmail : outboundPhone,
          subject: `AegisRecover: Baseline Ingestion Profile Activated for ${profileData.name}`,
          preview: 'Cryptographic zero-knowledge consent verified. Automated recovery sentinel activated.',
          status: 'Delivered',
          tone: 'Professional Welcome'
        }
      ],
      recommendedActions: [
        { id: 'act-new-1', label: 'Export Onboarding Ledger Certificate (PDF)', icon: 'FileText' },
        { id: 'act-new-2', label: 'Verify Automated Dunning Escrow Link', icon: 'Lock' }
      ]
    };

    setHistoricalRecords(prev => [newRecord, ...prev]);
    setSelectedDashboardRecord(newRecord);
    setSelectedRecordId(newRecord.id);
    setAppFlow('dashboard');
    setCurrentTab('dashboard');

    // REQUIREMENT 1: Welcome email on user registration via Resend API
    dispatchWelcomeEmail({
      email: pendingNewUserEmail,
      name: profileData.name || 'Executive',
      entityType: profileData.segment,
      entityName: profileData.name || 'ApexFlow Tech',
      uuid: newUuid
    }).then(res => {
      if (res?.record) {
        setEmailDispatches(prev => [res.record, ...prev]);
      }
    });

    addAuditLog(
      'Welcome Email Dispatched via Resend API',
      `Delivered official onboarding certified welcome email to ${pendingNewUserEmail}. API Route: /api/notifications/welcome`
    );
  };

  // Deep-Link Navigation Helper
  const navigateToTab = (tabName, deepLinkMeta = null) => {
    setCurrentTab(tabName);
    if (tabName === 'ledger' && deepLinkMeta?.recordId) {
      const match = historicalRecords.find(r => r.id === deepLinkMeta.recordId);
      if (match) {
        setSelectedRecordForDrillDown(match);
      }
    }
  };

  // Drill-down controls
  const openRecordDrillDown = (record) => {
    setSelectedRecordForDrillDown(record);
    addAuditLog(
      'Record Drill-Down Inspected',
      `Inspected recovery asset ${record.id} for ${record.entityName}`
    );
  };

  const closeRecordDrillDown = () => {
    setSelectedRecordForDrillDown(null);
  };


  // Module 5: Pending Validation Queue Operations with Waiting Period & Peer Routing
  const injectRecordToPendingQueue = (newRecord) => {
    const selectedChannel = newRecord.peerChannel || newRecord.channel || outboundChannel;
    const isWhatsApp = selectedChannel === 'whatsapp';
    const targetRecipient = isWhatsApp
      ? (newRecord.recipientPhone || newRecord.peerRecipient || outboundPhone)
      : (newRecord.recipientEmail || newRecord.peerRecipient || outboundEmail);

    const queueItem = {
      id: `PEND-${Math.floor(1000 + Math.random() * 9000)}`,
      entityName: newRecord.entityName || currentProfile.name,
      entityType: entityType,
      vendor: newRecord.vendor || 'Unknown Vendor',
      category: newRecord.category || 'Contract Discrepancy',
      invoiceId: newRecord.invoiceId || `INV-${Date.now().toString().slice(-6)}`,
      amount: Number(newRecord.amount) || 2500,
      currency: newRecord.currency || currency,
      channel: selectedChannel,
      recipient: targetRecipient,
      peerChannel: selectedChannel,
      peerRecipient: targetRecipient,
      waitingPeriod: true,
      peerVerificationStatus: 'waiting_for_peer',
      secondsLeft: 900, // 15:00 waiting period buffer
      initialSeconds: 900,
      status: 'pending',
      extractedDetails: newRecord.details || 'Scanned invoice / KYC discrepancy queued for automated peer verification and recovery settlement.',
      deepLinkId: null,
      dateInjected: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC'
    };

    setPendingQueue(prev => [queueItem, ...prev]);

    // Send notification in waiting period to peer/other user
    if (selectedChannel === 'email') {
      dispatchRecordCreatedNotification({
        recordId: queueItem.id,
        vendor: queueItem.vendor,
        amount: queueItem.amount,
        currency: queueItem.currency,
        entityName: queueItem.entityName,
        invoiceId: queueItem.invoiceId,
        details: `[WAITING PERIOD ACTIVE] ${queueItem.extractedDetails}`,
        deepLinkUrl: 'http://localhost:3000/',
        peerName: `${queueItem.vendor} Finance & Audits`,
        recipientEmail: targetRecipient
      }).then(res => {
        if (res?.record) {
          setEmailDispatches(prev => [res.record, ...prev]);
        }
      });

      addAuditLog(
        'Waiting Period Verification Email Dispatched via Resend API',
        `Dispatched verification request to peer (${targetRecipient}) for ${queueItem.vendor} (${formatCurrency(queueItem.amount)}). Active waiting period: 15 minutes.`
      );
    } else {
      addAuditLog(
        'Waiting Period Verification Alert Dispatched via WhatsApp',
        `Dispatched WhatsApp verification prompt to counterparty (${targetRecipient}) for ${queueItem.vendor} (${formatCurrency(queueItem.amount)}). Active waiting period: 15 minutes.`
      );
    }

    return queueItem.id;
  };

  // REQUIREMENT 4: Scheduled reminder for pending/overdue payments with direct links & instructions
  const triggerPaymentReminderNotification = async (payment, customRecipient = null) => {
    const isOverdue = payment.statusStep === 'escalated';
    const instructions = [
      '1. Open the direct deep-link to the Payments & Settlement Terminal.',
      `2. Verify the discrepancy audit for ${payment.vendor} (${formatCurrency(payment.amount)}).`,
      '3. Remit wire payment or file an arbitration response under contract SLA terms.',
      '4. Comply within 48h to prevent compounding statutory penalties.'
    ];

    const targetEmail = (customRecipient || payment.contactTarget || outboundEmail || currentUser?.email || 'delivered@resend.dev').trim();

    const res = await dispatchPaymentReminder({
      paymentId: payment.id,
      invoiceId: payment.invoiceId || 'INV-2026-SETTLE',
      vendor: payment.vendor,
      amount: payment.amount,
      currency: payment.currency || 'USD',
      dueDate: '2026-09-12',
      isOverdue,
      penaltyFee: payment.penaltyCharges?.reduce((sum, p) => sum + p.fee, 0) || 450,
      directLink: 'http://localhost:3000/',
      entityName: payment.entityName || currentProfile?.name || 'ApexFlow Technologies Inc.',
      instructions,
      recipientEmail: targetEmail
    });

    const record = res?.record || {
      id: res?.id || `sim_remind_${Date.now().toString(36)}`,
      type: 'payment-reminder',
      subject: isOverdue
        ? `[URGENT REMITTANCE] Overdue Payment Demand for ${payment.vendor} (#${payment.invoiceId || 'INV-SETTLE'}) - Penalty Levied`
        : `[Settlement Notice] Scheduled Reminder: Pending Payment for ${payment.vendor} (#${payment.invoiceId || 'INV-SETTLE'})`,
      recipient: targetEmail,
      timestamp: new Date().toISOString().slice(0, 19) + ' UTC',
      provider: res?.provider || 'Resend Enclave'
    };

    setEmailDispatches(prev => [record, ...prev]);

    // Trigger instant visual confirmation toast
    setAutoMailToast({
      visible: true,
      title: isOverdue ? 'Overdue Remittance Notice Dispatched' : 'Payment Reminder Auto-Mail Dispatched',
      message: `Direct deep-link notice for ${payment.vendor} (${formatCurrency(payment.amount)}) sent to ${targetEmail}.`,
      recipient: targetEmail,
      dispatchId: res?.id || record.id,
      provider: res?.provider || 'Resend API'
    });

    addAuditLog(
      'Scheduled Payment Reminder Dispatched via Resend API',
      `Sent payment reminder for ${payment.vendor} (${formatCurrency(payment.amount)}) with instructions to ${targetEmail}. Delivery ID: ${res?.id || record.id}`
    );

    return { ...res, record, targetEmail };
  };

  const authorizePendingRecord = (queueId) => {
    const item = pendingQueue.find(q => q.id === queueId);
    if (!item) return;

    const newRecordId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

    // Create new historical record
    const newHistorical = {
      id: newRecordId,
      ownerEmail: currentUser.email,
      ownerUuid: currentUser.uuid,
      entityName: item.entityName,
      entityType: item.entityType,
      dateLogged: new Date().toISOString().slice(0, 10),
      category: item.category,
      vendor: item.vendor,
      amountInitial: item.amount,
      amountRecovered: item.amount,
      currency: item.currency,
      status: 'Reclaimed',
      causeAnalysis: item.extractedDetails,
      metaValues: {
        invoiceId: item.invoiceId,
        ledgerTxn: `TXN-AUTH-${Date.now().toString().slice(-6)}`,
        confidenceScore: 98,
        slaSection: 'Manual Authorized Recovery Execution',
        gateway: 'Aegis Sentinel Hook',
        detectionLatency: '18ms'
      },
      pastCommunications: [
        {
          id: `COMM-${Date.now().toString().slice(-4)}`,
          type: item.channel,
          timestamp: new Date().toISOString().slice(0, 16) + ' UTC',
          recipient: item.recipient,
          subject: `Payment Recovery Execution Notice: ${item.invoiceId}`,
          preview: `Authorized settlement demand of ${formatCurrency(item.amount)} dispatched via ${item.channel.toUpperCase()}.`,
          status: 'Dispatched & Confirmed',
          tone: 'Direct Remittance'
        }
      ],
      recommendedActions: [
        { id: 'act-p-1', label: 'Download Verified Settlement Memo (PDF)', icon: 'FileText' }
      ]
    };

    // Also add to Payment Tracking Ledger
    const newPayment = {
      id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
      recordId: newRecordId,
      entityName: item.entityName,
      entityType: item.entityType,
      vendor: item.vendor,
      invoiceId: item.invoiceId,
      amount: item.amount,
      recoveredAmount: item.amount,
      currency: item.currency,
      dateCreated: new Date().toISOString().slice(0, 16) + ' UTC',
      executionTimestamp: new Date().toISOString().slice(0, 19) + ' UTC',
      statusStep: 'recovered',
      cancellationFlag: false,
      cancellationReason: null,
      penaltyCharges: [],
      outboundChannel: item.channel,
      contactTarget: item.recipient,
      milestoneHistory: [
        { step: 'ingestion', timestamp: item.dateInjected, note: 'Record injected via Ingestion Engine' },
        { step: 'recovered', timestamp: new Date().toISOString().slice(0, 19) + ' UTC', note: 'Immediate authorization confirmed by admin' }
      ]
    };

    setHistoricalRecords(prev => [newHistorical, ...prev]);
    setPaymentsLedger(prev => [newPayment, ...prev]);

    // Update pending item state
    setPendingQueue(prev => prev.map(q => q.id === queueId ? {
      ...q,
      status: 'authorized',
      peerVerificationStatus: 'peer_verified',
      secondsLeft: 0,
      deepLinkId: newRecordId
    } : q));

    setCustomStats(prev => ({
      recoveredAdd: prev.recoveredAdd + item.amount,
      riskSubtract: prev.riskSubtract + item.amount
    }));

    addAuditLog(
      'Pending Record Authorized Manually',
      `Administrator immediately authorized recovery of ${formatCurrency(item.amount)} from ${item.vendor}. Committed to ledger as ${newRecordId}.`
    );
  };

  // Peer Verification & Approval during active waiting period
  const peerVerifyRecord = (queueId) => {
    const item = pendingQueue.find(q => q.id === queueId);
    if (!item) return;

    authorizePendingRecord(queueId);

    addAuditLog(
      'Peer Verification & Approval Confirmed',
      `Counterparty (${item.peerRecipient || item.recipient}) verified and approved record ${item.invoiceId} during active waiting period. Successfully settled and pushed to ledger.`
    );
  };

  const terminatePendingRecord = (queueId, reason = 'Operator Terminated') => {
    const item = pendingQueue.find(q => q.id === queueId);
    if (!item) return;

    setPendingQueue(prev => prev.map(q => q.id === queueId ? {
      ...q,
      status: 'terminated',
      secondsLeft: 0,
      cancellationReason: reason
    } : q));

    addAuditLog(
      'Pending Record Terminated',
      `Flagged as error and terminated for ${item.vendor} (${formatCurrency(item.amount)}). Reason: ${reason}`
    );
  };

  const fastForwardPendingTimer = (queueId, targetSeconds = 3) => {
    setPendingQueue(prev => prev.map(q => q.id === queueId ? {
      ...q,
      secondsLeft: targetSeconds
    } : q));
  };

  // Asynchronous database fetch function to automatically calculate new Hero dashboard metrics
  const refreshHeroDashboardMetrics = async (newRecordInserted = null) => {
    try {
      const userUuid = currentUser.uuid;
      const { data: dbRecords, error } = await supabase
        .from('recovery_records')
        .select('*')
        .eq('user_uuid', userUuid);

      let records = (dbRecords && dbRecords.length > 0) ? dbRecords : historicalRecords;
      if (newRecordInserted && !records.some(r => r.id === newRecordInserted.id)) {
        records = [newRecordInserted, ...records];
      }

      const newRecovered = records
        .filter(r => r.status === 'Reclaimed')
        .reduce((sum, r) => sum + (Number(r.amountRecovered || r.amount || 0)), 0);

      const newAtRisk = records
        .filter(r => r.status !== 'Reclaimed')
        .reduce((sum, r) => sum + (Number(r.amountInitial || r.amount || 0)), 0);

      setCustomStats(prev => ({
        ...prev,
        recoveredAdd: newRecovered > 0 ? newRecovered : (newRecordInserted ? Number(newRecordInserted.amountInitial) : prev.recoveredAdd),
        riskSubtract: Math.max(0, prev.riskSubtract)
      }));

      addAuditLog(
        'Hero Dashboard Metrics Recalculated',
        `Recalculated metrics: Recovered ${formatCurrency(newRecovered)}, At-Risk ${formatCurrency(newAtRisk)} across ${records.length} records.`
      );

      return { newRecovered, newAtRisk, totalRecords: records.length };
    } catch (err) {
      console.warn('Hero metrics recalculation notice:', err);
      if (newRecordInserted) {
        setCustomStats(prev => ({
          ...prev,
          recoveredAdd: prev.recoveredAdd + Number(newRecordInserted.amountInitial)
        }));
      }
    }
  };

  // Dedicated Ingestion creation handler: pushes to Supabase, recalculates Hero metrics, shows layout success banner, resets focus to Records Ledger
  const createAndCommitRecord = async (recordData) => {
    const newRecordId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;
    const amountNum = parseFloat(recordData.amount) || 2500;

    const newRecord = {
      id: newRecordId,
      ownerEmail: currentUser.email,
      ownerUuid: currentUser.uuid,
      entityName: recordData.entityName || currentProfile.name,
      entityType: entityType,
      dateLogged: new Date().toISOString().slice(0, 10),
      category: recordData.category || 'Contract Tier Discrepancy',
      vendor: recordData.vendor || 'Disputed Vendor Enclave',
      amountInitial: amountNum,
      amountRecovered: recordData.status === 'Reclaimed' ? amountNum : 0,
      currency: recordData.currency || currency || 'USD',
      status: recordData.status || 'Active Dunning',
      causeAnalysis: recordData.details || 'Discrepancy logged via Adaptive Ingestion Engine. Verified by OCR scan.',
      metaValues: {
        invoiceId: recordData.invoiceId || `INV-${Date.now().toString().slice(-6)}`,
        ledgerTxn: `TXN-INGEST-${Date.now().toString().slice(-6)}`,
        confidenceScore: 99,
        slaSection: 'Section 8.2 Invoice Variance Remediation',
        gateway: 'Adaptive Ingestion Engine',
        detectionLatency: '24ms'
      },
      pastCommunications: [
        {
          id: `COMM-${Date.now().toString().slice(-4)}`,
          type: outboundChannel,
          timestamp: new Date().toISOString().slice(0, 16) + ' UTC',
          recipient: outboundChannel === 'email' ? (recordData.recipientEmail || outboundEmail) : (recordData.recipientPhone || outboundPhone),
          subject: `Notice of Disputed Remittance: ${recordData.invoiceId}`,
          preview: 'Status: inserted, waiting for confirmation from peer.',
          status: 'Delivered',
          tone: 'Formal Dispute'
        }
      ],
      recommendedActions: [
        { id: 'act-1', label: 'Generate Formal Dunning Demand Notice', icon: 'FileText' },
        { id: 'act-2', label: 'Levy Contract Clause SLA Penalty', icon: 'Scale' }
      ]
    };

    // Push to Supabase recovery_records table
    try {
      await supabase.from('recovery_records').insert([{
        record_id: newRecordId,
        user_uuid: currentUser.uuid,
        vendor: newRecord.vendor,
        amount: newRecord.amountInitial,
        currency: newRecord.currency,
        invoice_id: newRecord.metaValues.invoiceId,
        category: newRecord.category,
        status: newRecord.status,
        details: newRecord.causeAnalysis,
        created_at: new Date().toISOString()
      }]);
    } catch (err) {
      console.warn('Supabase insert notice:', err);
    }

    // Add to historicalRecords state
    setHistoricalRecords(prev => [newRecord, ...prev]);

    // Add matching payment row into paymentsLedger
    const newPayment = {
      id: `PAY-${newRecordId.replace('REC-2026-', '')}`,
      recordId: newRecordId,
      entityName: newRecord.entityName,
      entityType: newRecord.entityType,
      vendor: newRecord.vendor,
      invoiceId: newRecord.metaValues.invoiceId,
      amount: newRecord.amountInitial,
      currency: newRecord.currency,
      dateCreated: newRecord.dateLogged,
      executionTimestamp: 'Pending SLA Settlement',
      statusStep: 'disputed',
      cancellationFlag: false,
      cancellationReason: null,
      penaltyCharges: [],
      outboundChannel: outboundChannel,
      contactTarget: outboundChannel === 'email' ? outboundEmail : outboundPhone
    };
    setPaymentsLedger(prev => [newPayment, ...prev]);

    // Recalculate Hero dashboard metrics
    await refreshHeroDashboardMetrics(newRecord);

    // Push layout success alert banner
    setRecordSuccessAlert({
      visible: true,
      recordId: newRecord.id,
      vendor: newRecord.vendor,
      amount: newRecord.amountInitial,
      message: `Record ${newRecord.id} for ${newRecord.vendor} successfully created and pushed to Supabase. Hero dashboard metrics updated.`
    });

    // Lock context into selectedRecordId
    setSelectedRecordId(newRecord.id);

    // Dispatch Resend record-created email
    dispatchRecordCreatedNotification({
      recordId: newRecord.id,
      vendor: newRecord.vendor,
      amount: newRecord.amountInitial,
      currency: newRecord.currency,
      entityName: newRecord.entityName,
      invoiceId: newRecord.metaValues.invoiceId,
      details: newRecord.causeAnalysis,
      deepLinkUrl: 'http://localhost:3000/',
      peerName: `${newRecord.vendor} Accounts Receivable`,
      recipientEmail: outboundEmail
    }).then(res => {
      if (res?.record) {
        setEmailDispatches(prev => [res.record, ...prev]);
      }
    });

    addAuditLog(
      'Record Ingested & Pushed to Supabase',
      `Asset ${newRecord.id} for ${newRecord.vendor} (${formatCurrency(newRecord.amountInitial)}) committed. Hero metrics recalculated. Routed to Records Ledger.`
    );

    // Programmatically reset sidebar navigation tab focus straight back to the Records Ledger matrix screen
    setCurrentTab('ledger');

    return newRecord;
  };

  // Pending Queue Real-Time Countdown Engine (15:00 ticking down)
  useEffect(() => {
    const interval = setInterval(() => {
      setPendingQueue(prev => {
        let changed = false;
        const next = prev.map(item => {
          if (item.status !== 'pending') return item;

          if (item.secondsLeft <= 1) {
            changed = true;
            // Auto-Execute on 00:00!
            const newRecordId = `REC-2026-${Math.floor(100 + Math.random() * 900)}`;

            // Create historical recovery record
            const autoHistorical = {
              id: newRecordId,
              ownerEmail: currentUser.email,
              ownerUuid: currentUser.uuid,
              entityName: item.entityName,
              entityType: item.entityType,
              dateLogged: new Date().toISOString().slice(0, 10),
              category: item.category,
              vendor: item.vendor,
              amountInitial: item.amount,
              amountRecovered: item.amount,
              currency: item.currency,
              status: 'Reclaimed',
              causeAnalysis: item.extractedDetails,
              metaValues: {
                invoiceId: item.invoiceId,
                ledgerTxn: `TXN-AUTO-EXEC-${Date.now().toString().slice(-6)}`,
                confidenceScore: 99,
                slaSection: 'Autonomous Countdown 15-Minute Expiry Auto-Execution',
                gateway: 'Aegis Auto-Dunning Hook',
                detectionLatency: '12ms'
              },
              pastCommunications: [
                {
                  id: `COMM-${Date.now().toString().slice(-4)}`,
                  type: item.channel,
                  timestamp: new Date().toISOString().slice(0, 16) + ' UTC',
                  recipient: item.recipient,
                  subject: `[AUTONOMOUS NOTICE] Dispute Settled for ${item.invoiceId}`,
                  preview: `Executed default ${item.channel.toUpperCase()} dispatch template on 00:00 timer expiry. Target: ${item.recipient}.`,
                  status: 'Delivered',
                  tone: 'Automated Instant Alert'
                }
              ],
              recommendedActions: [
                { id: 'act-a-1', label: 'View Deep-Linked Transaction Details', icon: 'ArrowRight' }
              ]
            };

            // Also create in Payment Tracking Ledger
            const autoPayment = {
              id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
              recordId: newRecordId,
              entityName: item.entityName,
              entityType: item.entityType,
              vendor: item.vendor,
              invoiceId: item.invoiceId,
              amount: item.amount,
              recoveredAmount: item.amount,
              currency: item.currency,
              dateCreated: item.dateInjected,
              executionTimestamp: new Date().toISOString().slice(0, 19) + ' UTC',
              statusStep: 'recovered',
              cancellationFlag: false,
              cancellationReason: null,
              penaltyCharges: [],
              outboundChannel: item.channel,
              contactTarget: item.recipient,
              milestoneHistory: [
                { step: 'ingestion', timestamp: item.dateInjected, note: 'Ingested into Pending Queue' },
                { step: 'recovered', timestamp: new Date().toISOString().slice(0, 19) + ' UTC', note: 'Auto-executed at 00:00 countdown expiry' }
              ]
            };

            // Append to records
            setHistoricalRecords(h => [autoHistorical, ...h]);
            setPaymentsLedger(p => [autoPayment, ...p]);

            addAuditLog(
              'Autonomous Execution Triggered (00:00 Timer Expiry)',
              `Countdown elapsed without intervention. Auto-dispatched default ${item.channel.toUpperCase()} template for ${item.vendor} (${formatCurrency(item.amount)}). Deep-link created: ${newRecordId}`
            );

            return {
              ...item,
              secondsLeft: 0,
              status: 'auto_executed',
              deepLinkId: newRecordId
            };
          }

          return {
            ...item,
            secondsLeft: item.secondsLeft - 1
          };
        });

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser, formatCurrency, addAuditLog]);

  // Module 6: Granular Payment Milestone Operations
  const advancePaymentMilestone = (paymentId, targetStep) => {
    let payment = paymentsLedger.find(p => p.id === paymentId || p.recordId === paymentId);
    let currentLedger = [...paymentsLedger];

    if (!payment) {
      const matchingRec = historicalRecords.find(r => r.id === paymentId || paymentId.includes(r.id.replace('REC-2026-', '')));
      if (matchingRec) {
        payment = {
          id: paymentId.startsWith('PAY-') ? paymentId : `PAY-${matchingRec.id.replace('REC-2026-', '')}`,
          recordId: matchingRec.id,
          entityName: matchingRec.entityName,
          entityType: matchingRec.entityType,
          vendor: matchingRec.vendor,
          invoiceId: matchingRec.metaValues?.invoiceId || 'INV-2026-SETTLE',
          amount: matchingRec.amountInitial,
          recoveredAmount: matchingRec.amountRecovered,
          currency: matchingRec.currency || 'USD',
          dateCreated: `${matchingRec.dateLogged} 09:15:00 UTC`,
          executionTimestamp: targetStep === 'recovered' ? `${matchingRec.dateLogged} 16:30:00 UTC` : 'Pending SLA Settlement',
          statusStep: targetStep,
          cancellationFlag: false,
          cancellationReason: null,
          penaltyCharges: [],
          outboundChannel: outboundChannel,
          contactTarget: outboundEmail,
          milestoneHistory: []
        };
        currentLedger = [payment, ...currentLedger];
      } else {
        return;
      }
    }

    const updatedLedger = currentLedger.map(p => {
      if (p.id === payment.id || p.id === paymentId || p.recordId === paymentId) {
        const newHistory = [
          ...(p.milestoneHistory || []),
          {
            step: targetStep,
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            note: `Milestone advanced to ${targetStep.toUpperCase()} by ${userRole}`
          }
        ];
        return {
          ...p,
          statusStep: targetStep,
          executionTimestamp: targetStep === 'recovered' ? new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC' : p.executionTimestamp,
          milestoneHistory: newHistory
        };
      }
      return p;
    });

    setPaymentsLedger(updatedLedger);

    // Synchronize status into historicalRecords
    setHistoricalRecords(prev => prev.map(rec => {
      if (rec.id === payment.recordId || rec.id === paymentId) {
        return {
          ...rec,
          status: targetStep === 'recovered' ? 'Reclaimed' : (targetStep === 'escalated' ? 'In-Arbitration' : 'Active Dispute')
        };
      }
      return rec;
    }));

    // Dynamic penalty calculation
    const calculatedPenalty = payment.amount === 6358 ? 635.80 : (payment.amount * 0.1);
    const targetEmail = (payment.contactTarget || outboundEmail || currentUser?.email || 'delivered@resend.dev').trim();

    // Automated Email Dispatch (Option chosen by user)
    if (targetStep === 'escalated' && automatedEmailOptions.penalty) {
      dispatchPenaltyNotification({
        paymentId: payment.id,
        invoiceId: payment.invoiceId,
        vendor: payment.vendor,
        amount: payment.amount,
        penaltyFee: calculatedPenalty,
        reason: '10% Contractual Breach Late Processing Penalty (Clause 8.2)',
        recipientEmail: targetEmail,
        entityName: payment.entityName || currentProfile?.name || 'ApexFlow Technologies Inc.'
      }).then(res => {
        if (res?.record) {
          setEmailDispatches(prev => [res.record, ...prev]);
        }
        setAutoMailToast({
          visible: true,
          title: 'Penalty Assessment Auto-Mail Dispatched',
          message: `Contractual penalty notice for ${payment.vendor} (${formatCurrency(calculatedPenalty)}) sent to ${targetEmail}.`,
          recipient: targetEmail,
          dispatchId: res?.id || 'live',
          provider: res?.provider || 'Resend API'
        });
      }).catch(() => {});
    }

    if (targetStep === 'recovered' && automatedEmailOptions.recoveryStatus) {
      dispatchRecoveryStatusNotification({
        paymentId: payment.id,
        invoiceId: payment.invoiceId,
        vendor: payment.vendor,
        amount: payment.amount,
        penaltyFee: calculatedPenalty,
        recipientEmail: targetEmail,
        entityName: payment.entityName || currentProfile?.name || 'ApexFlow Technologies Inc.'
      }).then(res => {
        if (res?.record) {
          setEmailDispatches(prev => [res.record, ...prev]);
        }
        setAutoMailToast({
          visible: true,
          title: 'Recovery Settlement Auto-Mail Dispatched',
          message: `Escrow recovery confirmation notice for ${payment.vendor} (${formatCurrency(payment.amount)}) sent to ${targetEmail}.`,
          recipient: targetEmail,
          dispatchId: res?.id || 'live',
          provider: res?.provider || 'Resend API'
        });
      }).catch(() => {});
    }

    // Trigger simulated notification copy layout to active communication channel
    const notificationCopy = {
      type: 'milestone_update',
      channel: payment.outboundChannel || outboundChannel,
      targetRecipient: payment.contactTarget || (outboundChannel === 'email' ? outboundEmail : outboundPhone),
      paymentId: payment.id,
      vendor: payment.vendor,
      amount: payment.amount,
      currency: payment.currency,
      milestone: targetStep,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      subject: `[AegisRecover Status Alert] Payment ${payment.id} transitioned to ${targetStep.toUpperCase()}`,
      bodyText: `Notification Dispatch via ${payment.outboundChannel === 'whatsapp' ? 'WhatsApp' : 'Corporate Email'}:\n\nRecord ${payment.id} for ${payment.vendor} (${formatCurrency(payment.amount)}) has advanced to stage: [${targetStep.toUpperCase()}].\nVerification hash: ${generateMockHash()}\nRow Level Security Status: ENFORCED (UUID: ${currentUser.uuid})`
    };

    setActiveMilestoneNotification(notificationCopy);

    addAuditLog(
      `Payment Milestone Advanced: ${targetStep.toUpperCase()}`,
      `Transaction ${payment.id} for ${payment.vendor} transitioned to ${targetStep}.${
        (targetStep === 'escalated' && automatedEmailOptions.penalty) || (targetStep === 'recovered' && automatedEmailOptions.recoveryStatus)
          ? ' Automated notification dispatched via Resend API.'
          : ''
      }`
    );
  };

  const toggleCancellationFlag = (paymentId, flagReason = 'Flagged for compliance review') => {
    let payment = paymentsLedger.find(p => p.id === paymentId || p.recordId === paymentId);
    if (!payment) return;

    const newFlag = !payment.cancellationFlag;
    setPaymentsLedger(prev => prev.map(p => (p.id === payment.id || p.id === paymentId) ? {
      ...p,
      cancellationFlag: newFlag,
      cancellationReason: newFlag ? flagReason : null
    } : p));

    // Simulated notification
    setActiveMilestoneNotification({
      type: 'cancellation_flag',
      channel: payment.outboundChannel || outboundChannel,
      targetRecipient: payment.contactTarget || (outboundChannel === 'email' ? outboundEmail : outboundPhone),
      paymentId: payment.id,
      vendor: payment.vendor,
      amount: payment.amount,
      currency: payment.currency,
      flagState: newFlag ? 'FLAGGED' : 'CLEARED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      subject: `[Security Notice] Transaction ${payment.id} Cancellation Flag: ${newFlag ? 'ACTIVATED' : 'CLEARED'}`,
      bodyText: `Transaction ${payment.id} has had its cancellation flag toggled to: [${newFlag ? 'ACTIVE / SUSPENDED' : 'CLEARED / RESUMED'}].\nReason: ${flagReason}\nAudit trail committed to immutable zero-trust ledger.`
    });

    addAuditLog(
      `Payment Cancellation Flag ${newFlag ? 'Engaged' : 'Cleared'}`,
      `Payment ${payment.id} (${payment.vendor}) flag state set to ${newFlag}.`
    );
  };

  const levyPenaltyCharge = (paymentId, penaltyObj) => {
    let payment = paymentsLedger.find(p => p.id === paymentId || p.recordId === paymentId);
    let currentLedger = [...paymentsLedger];

    if (!payment) {
      const matchingRec = historicalRecords.find(r => r.id === paymentId || paymentId.includes(r.id.replace('REC-2026-', '')));
      if (matchingRec) {
        payment = {
          id: paymentId.startsWith('PAY-') ? paymentId : `PAY-${matchingRec.id.replace('REC-2026-', '')}`,
          recordId: matchingRec.id,
          entityName: matchingRec.entityName,
          entityType: matchingRec.entityType,
          vendor: matchingRec.vendor,
          invoiceId: matchingRec.metaValues?.invoiceId || 'INV-2026-SETTLE',
          amount: matchingRec.amountInitial,
          recoveredAmount: matchingRec.amountRecovered,
          currency: matchingRec.currency || 'USD',
          dateCreated: `${matchingRec.dateLogged} 09:15:00 UTC`,
          executionTimestamp: 'Pending SLA Settlement',
          statusStep: matchingRec.status === 'Reclaimed' ? 'recovered' : (matchingRec.status === 'In-Arbitration' ? 'escalated' : 'disputed'),
          cancellationFlag: false,
          cancellationReason: null,
          penaltyCharges: [],
          outboundChannel: outboundChannel,
          contactTarget: outboundEmail,
          milestoneHistory: []
        };
        currentLedger = [payment, ...currentLedger];
      } else {
        return;
      }
    }

    const penaltyItem = {
      id: `PEN-${Math.floor(1000 + Math.random() * 9000)}`,
      reason: penaltyObj.reason || 'Contract SLA Processing Delay Penalty',
      fee: Number(penaltyObj.fee) || (payment.amount === 6358 ? 635.80 : 450),
      dateLevied: new Date().toISOString().replace('T', ' ').substring(0, 16) + ' UTC',
      status: 'Levied to Escrow'
    };

    setPaymentsLedger(currentLedger.map(p => (p.id === payment.id || p.id === paymentId) ? {
      ...p,
      penaltyCharges: [...(p.penaltyCharges || []), penaltyItem]
    } : p));

    // Automated Email Dispatch for Penalty Levy
    if (automatedEmailOptions.penalty) {
      dispatchPenaltyNotification({
        paymentId: payment.id,
        invoiceId: payment.invoiceId,
        vendor: payment.vendor,
        amount: payment.amount,
        penaltyFee: penaltyItem.fee,
        reason: penaltyItem.reason,
        recipientEmail: payment.contactTarget || (outboundChannel === 'email' ? outboundEmail : 'delivered@resend.dev'),
        entityName: payment.entityName
      }).then(res => {
        if (res?.record) {
          setEmailDispatches(prev => [res.record, ...prev]);
        }
      }).catch(() => {});
    }

    // Dispatched copy preview
    setActiveMilestoneNotification({
      type: 'penalty_levied',
      channel: payment.outboundChannel || outboundChannel,
      targetRecipient: payment.contactTarget || (outboundChannel === 'email' ? outboundEmail : outboundPhone),
      paymentId: payment.id,
      vendor: payment.vendor,
      amount: penaltyItem.fee,
      currency: payment.currency,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      subject: `[Statutory Penalty Levied] Notice for ${payment.vendor} - ${formatCurrency(penaltyItem.fee)}`,
      bodyText: `Contract breach penalty assessed against ${payment.vendor}:\n\nBreach Reason: ${penaltyItem.reason}\nLevied Fee: ${formatCurrency(penaltyItem.fee)}\nPenalty ID: ${penaltyItem.id}\nDispatched to: ${payment.contactTarget}${
        automatedEmailOptions.penalty ? '\nAutomated Email Notice: DISPATCHED VIA RESEND API' : ''
      }`
    });

    addAuditLog(
      'Penalty Charge Levied',
      `Levied ${formatCurrency(penaltyItem.fee)} against ${payment.vendor} on transaction ${payment.id}. Reason: ${penaltyItem.reason}`
    );
  };

  const dismissMilestoneNotification = () => {
    setActiveMilestoneNotification(null);
  };

  // Native Speech Synthesis Narrator
  const speakText = useCallback((text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '').replace(/\[.*?\]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => v.lang.includes('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('David') || v.name.includes('Zira')));
      if (preferredVoice) utterance.voice = preferredVoice;

      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => setIsVoiceSpeaking(false);
      utterance.onerror = () => setIsVoiceSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis notice:', e);
      setIsVoiceSpeaking(false);
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsVoiceSpeaking(false);
  }, []);

  const toggleVoiceMute = useCallback(() => {
    setVoiceMuted(prev => {
      if (!prev) stopSpeaking();
      return !prev;
    });
  }, [stopSpeaking]);

  // Process Intent from Voice Command
  const processVoiceIntent = useCallback((transcript) => {
    const lower = transcript.toLowerCase();
    let reply = '';

    if (lower.includes('ingestion') || lower.includes('upload') || lower.includes('inject') || lower.includes('new record') || lower.includes('aadhaar') || lower.includes('passport') || lower.includes('pan')) {
      setCurrentTab('ingestion');
      reply = 'Navigating to Adaptive Ingestion Engine. You can upload Passport, Aadhaar, PAN card, or invoice records and initiate peer verification.';
    } else if (lower.includes('payment') || lower.includes('billing') || lower.includes('terminal') || lower.includes('penalty')) {
      setCurrentTab('payments');
      reply = 'Opening Payments & Billing Terminal. Displaying active transaction milestones, dispute statuses, and contractual SLA breach penalties.';
    } else if (lower.includes('anomaly') || lower.includes('forecasting') || lower.includes('runway') || lower.includes('monte carlo') || lower.includes('churn')) {
      setCurrentTab('dashboard');
      reply = 'Opening Stochastic Demand Forecasting. Showing active Business Anomaly: 94.2% Card Authorization Churn with $48,900 projected variance.';
    } else if (lower.includes('action center') || lower.includes('inbox') || lower.includes('leak')) {
      setCurrentTab('dashboard');
      reply = 'Displaying AI Action Center. Active recovery targets detected with one-click dunning and Resend API email outreach.';
    } else if (lower.includes('security') || lower.includes('compliance') || lower.includes('audit')) {
      setCurrentTab('security');
      reply = 'Opening Security & Compliance matrix. Displaying SOC2 Type II, ISO 27001 certifications, and SHA-256 zero-trust logs.';
    } else if (lower.includes('support') || lower.includes('help')) {
      setCurrentTab('support');
      reply = 'Opening AI Customer Support Center with active LLM assistance.';
    } else if (lower.includes('ledger') || lower.includes('records') || lower.includes('history')) {
      setCurrentTab('ledger');
      reply = 'Opening Historical Recovery Ledger. Accessing all verified corporate records and recovery matrices.';
    } else if (lower.includes('snowflake')) {
      setSelectedRecordId('REC-2026-9041');
      reply = 'Record REC-2026-9041 locked: Snowflake Enterprise Data Cloud ($6,350.00 discrepancy under Clause 8.1). Recovery rate: 94%.';
    } else if (lower.includes('datadog')) {
      setSelectedRecordId('REC-2026-6358');
      reply = 'Record REC-2026-6358 locked: Datadog Enterprise APM Tier Discrepancy ($6,358.00). 10% SLA breach penalty enforced.';
    } else if (lower.includes('aws') || lower.includes('amazon')) {
      setSelectedRecordId('REC-2026-1102');
      reply = 'Record REC-2026-1102 locked: AWS Cloud Infrastructure unattached EBS volumes ($4,200.00). 100% recovered.';
    } else {
      reply = `Voice instruction processed: "${transcript}". Query evaluated against active financial recovery ledger. All metrics and guardrails synchronized.`;
    }

    setChatMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}-u`,
        sender: 'user',
        text: `Voice Command: "${transcript}"`,
        timestamp: 'Just now',
        tags: ['Speech Recognized', 'PCM Mic Stream']
      },
      {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        text: reply,
        timestamp: 'Just now',
        tags: ['AegisVoice Response', 'Synthesized Audio']
      }
    ]);

    if (!voiceMuted) {
      speakText(reply);
    }

    addAuditLog('Voice Command Executed', `Instruction: "${transcript}" -> Action: ${reply.slice(0, 60)}...`);
  }, [speakText, voiceMuted, addAuditLog, setCurrentTab, setSelectedRecordId]);

  // Module 3: AI Voice Assistant Operations
  const startVoiceRecording = useCallback(() => {
    latestTranscriptRef.current = '';
    setVoiceRecordingActive(true);
    setIsProcessingVocal(true);
    setVoiceTranscript('Listening... Speak your command (e.g. "Audit Snowflake", "Check anomalies", "Open payments")...');

    const SpeechRecognition = typeof window !== 'undefined' ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            latestTranscriptRef.current = currentTranscript;
            setVoiceTranscript(currentTranscript);
          }
        };

        recognition.onend = () => {
          setVoiceRecordingActive(false);
          setIsProcessingVocal(false);
          const finalSpoken = (latestTranscriptRef.current || '').trim();
          if (finalSpoken && !finalSpoken.startsWith('Listening...')) {
            processVoiceIntent(finalSpoken);
          }
        };

        recognition.onerror = (event) => {
          console.warn('Speech recognition notice:', event.error);
          setVoiceRecordingActive(false);
          setIsProcessingVocal(false);
          if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            setVoiceTranscript('Microphone access blocked. Click any quick shortcut or use preset below.');
          }
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition initialization notice:', err);
      }
    }

    // Acoustic Simulation Fallback if Web Speech is not supported or permitted
    const activeRec = selectedRecordId
      ? historicalRecords.find(r => r.id === selectedRecordId)
      : null;

    const defaultCmd = activeRec ? `Audit ${activeRec.vendor} discrepancy` : 'Audit Snowflake compute variance for Q3';
    latestTranscriptRef.current = defaultCmd;

    const phrases = activeRec ? [
      `Initializing acoustic vectors for record ${activeRec.id}...`,
      `Auditing ${activeRec.vendor}: "${activeRec.causeAnalysis?.slice(0, 50)}..."`,
      `Querying Supabase RLS ledger for ${activeRec.vendor}...`,
      `Match verified: Discrepancy ${formatCurrency(activeRec.amountInitial)} evaluated.`
    ] : [
      'Listening to acoustic vectors...',
      'Recognized speech: "Audit Snowflake compute variance for Q3..."',
      'Matching against Supabase ledger records...',
      'Result verified: Invoice #SNOW-INV-2026-9041 ($6,350.00 discrepancy).'
    ];

    phrases.forEach((phrase, idx) => {
      setTimeout(() => {
        setVoiceTranscript(phrase);
        if (idx === phrases.length - 1) {
          setVoiceRecordingActive(false);
          setIsProcessingVocal(false);
          processVoiceIntent(defaultCmd);
        }
      }, (idx + 1) * 600);
    });
  }, [historicalRecords, selectedRecordId, formatCurrency, processVoiceIntent]);

  const stopVoiceRecording = useCallback(() => {
    setVoiceRecordingActive(false);
    setIsProcessingVocal(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

    const transcript = (latestTranscriptRef.current || voiceTranscript || '').trim();
    const effective = transcript && !transcript.startsWith('Listening...') && !transcript.startsWith('Processing...')
      ? transcript
      : (selectedRecordId ? `Audit locked record ${selectedRecordId}` : 'Audit Snowflake compute variance for Q3');

    processVoiceIntent(effective);
  }, [voiceTranscript, selectedRecordId, processVoiceIntent]);

  // Module 3: LLM Chat Box Messaging with Per-Record System Context
  const sendChatMessage = (promptText) => {
    if (!promptText.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: promptText,
      timestamp: 'Just now'
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiTyping(true);

    setTimeout(() => {
      let replyText = '';
      const lower = promptText.toLowerCase();
      const activeRec = selectedRecordId
        ? historicalRecords.find(r => r.id === selectedRecordId)
        : null;

      if (activeRec) {
        // System Data context feed for selectedRecordId
        if (lower.includes('audit') || lower.includes('contract') || lower.includes('discrepancy') || lower.includes('tier') || lower.includes('mismatch') || lower.includes('retainer') || lower.includes('datadog')) {
          replyText = `Contract Analysis for Scoped Asset [${activeRec.id}]: Target Vendor: ${activeRec.vendor} | Invoice: ${activeRec.metaValues?.invoiceId || 'N/A'}. Discrepancy text: "${activeRec.causeAnalysis}". Initial variance evaluated at ${formatCurrency(activeRec.amountInitial)} with ${formatCurrency(activeRec.amountRecovered)} recovered to date (${activeRec.status}). Statutory SLA Section 8.2 remediation terms apply.`;
        } else if (lower.includes('penalty') || lower.includes('breach') || lower.includes('fee') || lower.includes('sla')) {
          replyText = `SLA Penalty Audit for ${activeRec.vendor} (${activeRec.id}): Contractual clause non-compliance penalty assessed at $450.00. Notice dispatched to ${activeRec.vendor} accounts receivable. Penalty state: Settled to Escrow.`;
        } else if (lower.includes('payment') || lower.includes('status') || lower.includes('milestone')) {
          replyText = `Settlement Status for ${activeRec.vendor}: Record status is currently [${activeRec.status}], with ${formatCurrency(activeRec.amountRecovered)} reclaimed of ${formatCurrency(activeRec.amountInitial)} total disputed capital. Milestone pipeline verified in Payments & Billing.`;
        } else {
          replyText = `AegisLLM System Context [Record ${activeRec.id}]: Active vendor is ${activeRec.vendor} (${activeRec.entityName}). Detected discrepancy: "${activeRec.causeAnalysis}". Disputed sum: ${formatCurrency(activeRec.amountInitial)}. How would you like to proceed with dunning dispatch or arbitration escalation for this asset?`;
        }
      } else if (lower.includes('datadog') || lower.includes('tier') || lower.includes('clause')) {
        replyText = `Contract Analysis: Datadog Enterprise Cloud (Inv #INV-2026-DD-8819) billed $9,120.00 against a contracted ceiling of $5,760.00 under MSA §4b. A formal credit memo claim of $8,420.00 has been verified, and a $450.00 Late Settlement SLA Penalty is currently logged in the Payments Terminal.`;
      } else if (lower.includes('penalty') || lower.includes('breach') || lower.includes('fee')) {
        replyText = `Penalty Engine Status: 3 statutory contract penalties are logged across your active vendors ($450 SLA delay, $320 gateway arbitration, $95 tax remittance lag). All penalties are enforced under your active ${outboundChannel.toUpperCase()} communication template.`;
      } else if (lower.includes('dunning') || lower.includes('card') || lower.includes('retry')) {
        replyText = `Smart Dunning Optimizer: Analysis of J.P. Morgan Commercial Fleet BINs indicates authorization success increases by +38.4% on Tuesday mornings (10:15 AM EST). Pre-dunning hedging is active to prevent uncollected enterprise churn.`;
      } else if (lower.includes('threshold') || lower.includes('auto') || lower.includes('pilot')) {
        replyText = `Zero-Trust Policy: Your AI Auto-Pilot Threshold is currently locked at ${formatCurrency(monetaryThreshold)}. Any recovery or dunning action below this value operates autonomously; transactions above this threshold freeze and require manual administrator authorization.`;
      } else {
        replyText = `Query processed against your authenticated Supabase RLS database (UUID: ${currentUser.uuid}). Across ${historicalRecords.length} records, total recovered capital stands at ${formatCurrency(currentRecoveredCapital)} with ${activeLeaksCount} active items under monitoring. Outbound notifications will dispatch via your configured ${outboundChannel.toUpperCase()} channel.`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-ai`,
          sender: 'ai',
          text: replyText,
          timestamp: 'Just now',
          tags: activeRec ? ['Asset Scoped', activeRec.vendor, 'SOC 2 Enforced'] : ['AegisLLM Verified', 'Row-Level Scoped']
        }
      ]);
      setIsAiTyping(false);
    }, 900);

    addAuditLog(
      'LLM Billing Query Executed',
      `Prompt: "${promptText.slice(0, 45)}..."`
    );
  };

  // Actions
  const resolveLeakAction = (leakId, actionType, details = '') => {
    const leak = leaks.find(l => l.id === leakId);
    if (!leak) return;

    setLeaks(prev =>
      prev.map(item =>
        item.id === leakId ? { ...item, status: 'Resolved', resolvedVia: actionType } : item
      )
    );

    setCustomStats(prev => ({
      recoveredAdd: prev.recoveredAdd + leak.amountUSD,
      riskSubtract: prev.riskSubtract + leak.amountUSD
    }));

    addAuditLog(
      `Capital Recovery Executed: ${actionType}`,
      `Successfully reclaimed ${formatCurrency(leak.amountUSD)} from ${leak.vendor}. Cause: ${leak.category}. Details: ${details || 'Autonomous hook executed'}`
    );

    setActiveModal(null);
  };

  const unlockSession = () => {
    setAuthStatus('authenticated');
    setSessionSecondsRemaining(900);
    setShowInactivityWarning(false);
    addAuditLog('Session Unlocked via Biometric/MFA Re-verification', 'Inactivity session restored with valid session token');
  };

  const handlePreDunningActivation = () => {
    setPreDunningActivated(true);
    setAnomalyTriggered(false);
    addAuditLog(
      'Pre-Dunning & Smart Hedging Activated',
      'AI Automated Dunning schedule shifted card authorization attempts 48 hours in advance of expiry.'
    );
  };

  return (
    <AppContext.Provider
      value={{
        appFlow,
        setAppFlow,
        currentTab,
        setCurrentTab,
        navigateToTab,
        pendingNewUserEmail,
        setPendingNewUserEmail,
        isReturningUser,
        setIsReturningUser,
        loginReturningUser,
        initiateNewUserVerification,
        resendOtpCode,
        activeOtpCode,
        otpDeliveryStatus,
        completeOtpVerification,
        completeNewUserOnboarding,
        logoutToGateway,
        supabaseStatus,
        historicalRecords,
        setHistoricalRecords,
        selectedRecordForDrillDown,
        openRecordDrillDown,
        closeRecordDrillDown,
        historySearchQuery,
        setHistorySearchQuery,
        historyEntityFilter,
        setHistoryEntityFilter,
        historyStatusFilter,
        setHistoryStatusFilter,
        entityType,
        setEntityType,
        userRole,
        setUserRole,
        authStatus,
        setAuthStatus,
        currentUser,
        setCurrentUser,
        isPiiMasked,
        setIsPiiMasked,
        monetaryThreshold,
        setMonetaryThreshold,
        currency,
        setCurrency,
        timeframe,
        setTimeframe,
        outboundChannel,
        setOutboundChannel,
        outboundEmail,
        setOutboundEmail,
        outboundPhone,
        setOutboundPhone,
        pendingQueue,
        injectRecordToPendingQueue,
        authorizePendingRecord,
        peerVerifyRecord,
        terminatePendingRecord,
        fastForwardPendingTimer,
        paymentsLedger,
        advancePaymentMilestone,
        toggleCancellationFlag,
        levyPenaltyCharge,
        activeMilestoneNotification,
        dismissMilestoneNotification,
        automatedEmailOptions,
        setAutomatedEmailOptions,
        toggleAutomatedEmailOption,
        voiceRecordingActive,
        voiceTranscript,
        isProcessingVocal,
        startVoiceRecording,
        stopVoiceRecording,
        voiceMuted,
        setVoiceMuted,
        toggleVoiceMute,
        isVoiceSpeaking,
        speakText,
        stopSpeaking,
        isGlobalVoiceModalOpen,
        setIsGlobalVoiceModalOpen,
        chatMessages,
        isAiTyping,
        sendChatMessage,
        leaks,
        setLeaks,
        auditLogs,
        addAuditLog,
        anomalyTriggered,
        setAnomalyTriggered,
        preDunningActivated,
        handlePreDunningActivation,
        sessionSecondsRemaining,
        showInactivityWarning,
        setShowInactivityWarning,
        handleUserActivity,
        unlockSession,
        formatCurrency,
        maskPii,
        currentProfile,
        activeLeaksCount,
        currentTotalAtRisk,
        currentRecoveredCapital,
        resolveLeakAction,
        activeModal,
        setActiveModal,
        modalData,
        setModalData,
        emailDispatches,
        setEmailDispatches,
        isEmailCenterOpen,
        setIsEmailCenterOpen,
        triggerPaymentReminderNotification,
        selectedDashboardRecord,
        setSelectedDashboardRecord,
        welcomeNotification,
        setWelcomeNotification,
        handlePostLoginStateEvaluation,
        selectedRecordId,
        setSelectedRecordId,
        recordSuccessAlert,
        setRecordSuccessAlert,
        autoMailToast,
        setAutoMailToast,
        createAndCommitRecord,
        refreshHeroDashboardMetrics
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
