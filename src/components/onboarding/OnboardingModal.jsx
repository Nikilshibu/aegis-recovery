import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Building2,
  User,
  Globe2,
  UploadCloud,
  FileText,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  AlertCircle,
  AlertTriangle,
  RefreshCw,
  CreditCard,
  ShieldCheck,
  Mail,
  MessageSquare,
  FileCheck
} from 'lucide-react';

export function OnboardingModal() {
  const {
    appFlow,
    setAppFlow,
    activeModal,
    setActiveModal,
    entityType,
    completeNewUserOnboarding,
    pendingNewUserEmail,
    formatCurrency
  } = useApp();

  const isNewUserFlow = appFlow === 'onboarding';
  const isVisible = isNewUserFlow || activeModal === 'onboarding';

  // Segment Selection
  const [selectedSegment, setSelectedSegment] = useState(
    entityType === 'Individual' ? 'Individual' : entityType === 'Organization' ? 'Organization' : 'Business'
  );

  // Ingestion Pathway: 'manual' vs 'upload'
  const [ingestionTab, setIngestionTab] = useState('upload');

  // Dynamic High-Utility Form Fields
  // For Individual:
  const [incomeSource, setIncomeSource] = useState('Principal Cloud Advisory & Freelance');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [primaryCountry, setPrimaryCountry] = useState('United States');
  const [individualCurrency, setIndividualCurrency] = useState('USD');
  const [individualName, setIndividualName] = useState('');

  // For Business / Organization:
  const [legalName, setLegalName] = useState('');
  const [regCountry, setRegCountry] = useState('United States (Delaware)');
  const [taxId, setTaxId] = useState('');
  const [revenueBracket, setRevenueBracket] = useState('$1M - $5M ARR');
  const [techStack, setTechStack] = useState('Stripe Payments + QuickBooks Online');
  const [corporateCurrency, setCorporateCurrency] = useState('USD');

  // Document & Identity/KYC File Upload State (Passport, Aadhaar, PAN Card, Invoices)
  const fileInputRef = useRef(null);
  const [selectedDocType, setSelectedDocType] = useState('passport'); // 'passport' | 'aadhaar' | 'pan' | 'invoice'
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [docScanProgress, setDocScanProgress] = useState(0);
  const [attachedDoc, setAttachedDoc] = useState(null);
  const [scannedResult, setScannedResult] = useState(null);

  // Inform Other User (Mail vs WhatsApp)
  const [informChannel, setInformChannel] = useState('email');
  const [otherUserEmail, setOtherUserEmail] = useState('');
  const [otherUserPhone, setOtherUserPhone] = useState('');

  // Mandatory Privacy Consent Interceptor
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [consentError, setConsentError] = useState('');
  const [showPrivacyFramework, setShowPrivacyFramework] = useState(false);

  // Quick Sample Document Loaders
  const handleLoadSamplePassport = () => {
    setSelectedDocType('passport');
    setIsScanningDoc(true);
    setDocScanProgress(25);
    setAttachedDoc(null);

    setTimeout(() => setDocScanProgress(60), 300);
    setTimeout(() => setDocScanProgress(90), 650);
    setTimeout(() => {
      setDocScanProgress(100);
      setIsScanningDoc(false);

      setAttachedDoc({
        type: 'Passport',
        fileName: 'Passport_Alex_Rivera_Verified.pdf',
        fileSize: '1.4 MB',
        idNumber: 'P129482938',
        bearerName: 'Alex Rivera',
        issuer: 'Department of State, United States of America',
        country: 'United States',
        status: 'Cryptographically Verified',
        notes: 'Security holograms & MRZ checksums verified with zero-knowledge hashing.'
      });

      setIndividualName('Alex Rivera');
      setPrimaryCountry('United States');
      setIndividualCurrency('USD');
      setIncomeSource('Principal Cloud Advisory & Freelance');

      setScannedResult({
        vendor: 'Snowflake Cloud Data Warehouse',
        invoiceId: 'SNOW-INV-2026-9041',
        discrepancyDelta: 6350,
        cause: 'Passport verified. Clause 8.1 Compute Multiplier variance of $6,350.00 extracted from attached invoice.'
      });
    }, 900);
  };

  const handleLoadSampleAadhaar = () => {
    setSelectedDocType('aadhaar');
    setIsScanningDoc(true);
    setDocScanProgress(25);
    setAttachedDoc(null);

    setTimeout(() => setDocScanProgress(60), 300);
    setTimeout(() => setDocScanProgress(90), 650);
    setTimeout(() => {
      setDocScanProgress(100);
      setIsScanningDoc(false);

      setAttachedDoc({
        type: 'Aadhaar Card',
        fileName: 'eAadhaar_Vikram_Mehta_UIDAI_Signed.pdf',
        fileSize: '890 KB',
        idNumber: '4829 1920 4819',
        bearerName: 'Vikram Mehta',
        issuer: 'UIDAI (Unique Identification Authority of India)',
        country: 'India',
        status: 'Cryptographically Verified',
        notes: 'UIDAI cryptographic digital signature verified with QR code hash.'
      });

      if (selectedSegment === 'Individual') {
        setIndividualName('Vikram Mehta Technical Advisory');
        setPrimaryCountry('India');
        setIncomeSource('Cross-Border Technology Consulting (DTAA Treaty)');
      } else {
        setLegalName('Vikram Mehta Enterprise Solutions Pvt. Ltd.');
        setRegCountry('India (MCA / GSTIN)');
        setTaxId('GSTIN: 27AADCB2230M1Z2 / AADHAAR: 4829 1920 4819');
      }

      setScannedResult({
        vendor: 'Tata Consultancy Services / Vendor Hub',
        invoiceId: 'INV-UIDAI-2026-4401',
        discrepancyDelta: 5800,
        cause: 'UIDAI Aadhaar 4829 1920 4819 verified. Cross-border IT consulting invoice variance under DTAA treaty.'
      });
    }, 900);
  };

  const handleLoadSamplePanCard = () => {
    setSelectedDocType('pan');
    setIsScanningDoc(true);
    setDocScanProgress(25);
    setAttachedDoc(null);

    setTimeout(() => setDocScanProgress(60), 300);
    setTimeout(() => setDocScanProgress(90), 650);
    setTimeout(() => {
      setDocScanProgress(100);
      setIsScanningDoc(false);

      setAttachedDoc({
        type: 'PAN Card',
        fileName: 'Corporate_PAN_ApexFlow_ITD.pdf',
        fileSize: '620 KB',
        idNumber: 'ABCDE1234F',
        bearerName: 'ApexFlow Technologies Inc.',
        issuer: 'Income Tax Department, Govt of India',
        country: 'India / International Entity',
        status: 'Cryptographically Verified',
        notes: 'NSDL / UTIITSL corporate PAN structure verified with MCA registry.'
      });

      setLegalName('ApexFlow Technologies Inc.');
      setTaxId('PAN: ABCDE1234F / GSTIN: 27AADCB2230M1Z2');
      setRegCountry('India (MCA / GSTIN)');

      setScannedResult({
        vendor: 'Razorpay / AWS Enterprise India',
        invoiceId: 'INV-PAN-2026-902',
        discrepancyDelta: 9200,
        cause: 'Entity PAN ABCDE1234F verified. GSTIN / Tax credit discrepancy on AWS India compute settlement.'
      });
    }, 900);
  };

  const handleLoadSampleInvoice = () => {
    setSelectedDocType('invoice');
    setIsScanningDoc(true);
    setDocScanProgress(25);
    setAttachedDoc(null);

    setTimeout(() => setDocScanProgress(60), 300);
    setTimeout(() => setDocScanProgress(90), 650);
    setTimeout(() => {
      setDocScanProgress(100);
      setIsScanningDoc(false);

      setAttachedDoc({
        type: 'Invoice / Contract',
        fileName: 'Snowflake_Enterprise_Invoice_9041.pdf',
        fileSize: '2.1 MB',
        idNumber: 'SNOW-INV-2026-9041',
        bearerName: legalName || 'ApexFlow Technologies Inc.',
        issuer: 'Snowflake Enterprise Data Cloud',
        country: 'United States',
        status: 'Cryptographically Verified',
        notes: 'OCR extracted Section 8.1 Compute Multiplier variance.'
      });

      setScannedResult({
        vendor: 'Snowflake Cloud Data Warehouse',
        invoiceId: 'SNOW-INV-2026-9041',
        discrepancyDelta: 6350,
        cause: 'Contract clause 8.1 (Compute Tier Multiplier variance of $6,350.00).'
      });
    }, 900);
  };

  // Real File Upload Handler
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningDoc(true);
    setDocScanProgress(20);
    setAttachedDoc(null);

    const docTypeLabels = {
      passport: 'Passport',
      aadhaar: 'Aadhaar Card',
      pan: 'PAN Card',
      invoice: 'Invoice / Agreement'
    };

    setTimeout(() => setDocScanProgress(55), 350);
    setTimeout(() => setDocScanProgress(85), 700);
    setTimeout(() => {
      setDocScanProgress(100);
      setIsScanningDoc(false);

      const generatedId = selectedDocType === 'passport'
        ? `P${Math.floor(100000000 + Math.random() * 900000000)}`
        : selectedDocType === 'aadhaar'
          ? `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`
          : selectedDocType === 'pan'
            ? `ABCDE${Math.floor(1000 + Math.random() * 9000)}F`
            : `INV-${Date.now().toString().slice(-6)}`;

      setAttachedDoc({
        type: docTypeLabels[selectedDocType] || 'Verification Document',
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        idNumber: generatedId,
        bearerName: selectedSegment === 'Individual' ? individualName : legalName,
        issuer: selectedDocType === 'aadhaar'
          ? 'UIDAI (Govt of India)'
          : selectedDocType === 'pan'
            ? 'Income Tax Dept (Govt of India)'
            : selectedDocType === 'passport'
              ? 'Issuing Passport Authority'
              : 'Enterprise Counterparty',
        country: selectedDocType === 'aadhaar' || selectedDocType === 'pan' ? 'India' : 'International',
        status: 'Cryptographically Verified',
        notes: `File ${file.name} scanned successfully with AI OCR. Security layers & text verified.`
      });

      setScannedResult({
        vendor: 'Disputed Cloud Service Provider',
        invoiceId: generatedId,
        discrepancyDelta: 4500,
        cause: `${docTypeLabels[selectedDocType]} attached and verified for dispute recovery.`
      });
    }, 1000);
  };

  const handleSegmentSwitch = (segmentId) => {
    setSelectedSegment(segmentId);
    if (segmentId === 'Individual') {
      setPrimaryCountry('United States');
      setIndividualCurrency('USD');
    } else {
      setRegCountry('United States (Delaware)');
      setCorporateCurrency('USD');
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!privacyConsent) {
      setConsentError('Mandatory Requirement: Please check the privacy consent authorization box before proceeding.');
      return;
    }

    setConsentError('');

    const profileData = {
      segment: selectedSegment,
      name: selectedSegment === 'Individual' ? individualName : legalName,
      incomeSource: selectedSegment === 'Individual' ? incomeSource : null,
      monthlyExpenses: selectedSegment === 'Individual' ? monthlyExpenses : null,
      primaryCountry: selectedSegment === 'Individual' ? primaryCountry : regCountry,
      taxId: selectedSegment === 'Individual' ? (attachedDoc?.type === 'Aadhaar Card' ? `AADHAAR: ${attachedDoc.idNumber}` : 'PAN: ABXPR9841K') : taxId,
      revenueBracket: selectedSegment === 'Individual' ? null : revenueBracket,
      techStack: selectedSegment === 'Individual' ? 'Direct ACH + Wise' : techStack,
      currency: selectedSegment === 'Individual' ? individualCurrency : corporateCurrency,
      scannedDiscrepancy: !!scannedResult,
      scannedVendor: scannedResult?.vendor,
      scannedInvoiceId: scannedResult?.invoiceId,
      scannedAmount: scannedResult?.discrepancyDelta,
      scannedCause: scannedResult?.cause,
      peerChannel: informChannel,
      peerRecipient: informChannel === 'email' ? otherUserEmail : otherUserPhone,
      attachedDoc: attachedDoc
    };

    completeNewUserOnboarding(profileData);
    setActiveModal(null);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-[#0f172a] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        
        {/* Glow Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-indigo-500" />

        <button
          type="button"
          onClick={() => {
            setActiveModal(null);
            setAppFlow('record_selection');
          }}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-mono"
          title="Return to Decision Hub"
        >
          <X className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Decision Hub</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 shadow-glow-emerald">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-100 tracking-tight">
              Verified Profiling & Record Ingestion
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isNewUserFlow
                ? `Account verified (${pendingNewUserEmail || 'Zero-Trust'}). Enter manual metadata and upload identity/KYC files to activate recovery engine.`
                : 'Configure entity metadata, attach supporting documents, and select counterparty routing.'}
            </p>
          </div>
        </div>

        {/* 1. Segment Control Switch */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
            1. Profile Metadata Segment Selection
          </label>
          <div className="grid grid-cols-3 gap-2.5 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
            {[
              { id: 'Individual', label: 'Individual', icon: User, desc: 'Freelance & 1099' },
              { id: 'Business', label: 'Business', icon: Building2, desc: 'B2B Enterprise SaaS' },
              { id: 'Organization', label: 'Organization', icon: Globe2, desc: 'Non-Profit / NGO' }
            ].map(({ id, label, icon: Icon, desc }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSegmentSwitch(id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl text-center transition ${
                  selectedSegment === id
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-glow-emerald'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5 mb-1 text-emerald-400" />
                <span className="text-xs font-bold">{label}</span>
                <span className="text-[10px] text-slate-500 mt-0.5">{desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2. File Upload & Ingestion Pathway (Passport, Aadhaar, PAN Card, Invoices) */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              2. Supporting Document & Identity/KYC Upload
            </span>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
              Passport • Aadhaar • PAN • Invoices
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 rounded-xl border border-slate-800 mb-4">
            <button
              type="button"
              onClick={() => setIngestionTab('upload')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition ${
                ingestionTab === 'upload'
                  ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-sky-400" />
              <span>Upload Document (Passport / Aadhaar / PAN)</span>
            </button>
            <button
              type="button"
              onClick={() => setIngestionTab('manual')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-medium transition ${
                ingestionTab === 'manual'
                  ? 'bg-slate-800 text-slate-100 shadow border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Manual Information Only</span>
            </button>
          </div>

          {/* Upload File View */}
          {ingestionTab === 'upload' && (
            <div className="mb-5 space-y-3 animate-in fade-in duration-150">
              
              {/* Document Type Selector */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'passport', label: 'Passport', icon: '🛂', desc: 'Proof of Identity' },
                  { id: 'aadhaar', label: 'Aadhaar Card', icon: '🪪', desc: 'UIDAI Resident' },
                  { id: 'pan', label: 'PAN Card', icon: '💳', desc: 'ITD Entity' },
                  { id: 'invoice', label: 'Invoice / Contract', icon: '📄', desc: 'Discrepancy' }
                ].map(doc => (
                  <button
                    key={doc.id}
                    type="button"
                    onClick={() => setSelectedDocType(doc.id)}
                    className={`p-2.5 rounded-xl border text-left transition ${
                      selectedDocType === doc.id
                        ? 'bg-sky-500/20 border-sky-500/60 text-sky-200 shadow-glow-cyan'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base mb-0.5">{doc.icon}</div>
                    <div className="text-xs font-bold">{doc.label}</div>
                    <div className="text-[9px] text-slate-500">{doc.desc}</div>
                  </button>
                ))}
              </div>

              {/* Drag and Drop Zone */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-2xl p-5 text-center transition bg-slate-900/60 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition">
                  <UploadCloud className="w-6 h-6 text-sky-400" />
                </div>
                <div className="text-xs font-bold text-slate-200 mb-0.5">
                  Click to Browse or Drag & Drop {selectedDocType.toUpperCase()} Document
                </div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mb-2">
                  Upload Passport, Aadhaar Card, PAN Card, or invoices (.pdf, .png, .jpg). Integrated OCR extracts fields automatically.
                </p>

                {isScanningDoc && (
                  <div className="max-w-xs mx-auto space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-sky-300">
                      <span>Scanning OCR Security Layers...</span>
                      <span>{docScanProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${docScanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Sample Buttons */}
              <div>
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Quick-Load Sample Documents:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleLoadSamplePassport}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-[11px] font-medium text-slate-300 hover:text-sky-300 transition flex items-center gap-1.5"
                  >
                    <span>🛂 Sample Passport (USA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSampleAadhaar}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-[11px] font-medium text-slate-300 hover:text-emerald-300 transition flex items-center gap-1.5"
                  >
                    <span>🪪 Sample Aadhaar (UIDAI)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSamplePanCard}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-medium text-slate-300 hover:text-indigo-300 transition flex items-center gap-1.5"
                  >
                    <span>💳 Sample PAN Card (ITD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleLoadSampleInvoice}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-[11px] font-medium text-slate-300 hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <span>📄 Sample Invoice ($6,350)</span>
                  </button>
                </div>
              </div>

              {/* Verified Badge */}
              {attachedDoc && (
                <div className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs text-emerald-300 flex items-start gap-2.5 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-200">
                      {attachedDoc.type} Verified & Form Fields Auto-Synchronized!
                    </span>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Bearer: <span className="text-slate-300 font-semibold">{attachedDoc.bearerName}</span> • ID: <span className="text-emerald-400 font-mono font-bold">{attachedDoc.idNumber}</span> ({attachedDoc.issuer})
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Dynamic High-Utility Form Fields */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            
            {/* Dynamic Schema A: For [Individual] */}
            {selectedSegment === 'Individual' ? (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Individual Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={individualName}
                      onChange={(e) => setIndividualName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Alex Rivera"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Income Source Type
                    </label>
                    <select
                      value={incomeSource}
                      onChange={(e) => setIncomeSource(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Principal Cloud Advisory & Freelance">Freelance Consulting / Independent Advisory</option>
                      <option value="Remote Tech Contract Services">Remote Tech Engineering Contract</option>
                      <option value="Agency Creative Retainers">Agency Retainer Engagements</option>
                      <option value="Digital IP & SaaS Royalties">Digital Assets & Software Royalties</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Estimated Monthly Expenses
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-3 pr-8 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                        placeholder="e.g. 4200"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                        {individualCurrency}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Financial Country
                    </label>
                    <select
                      value={primaryCountry}
                      onChange={(e) => setPrimaryCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="United States">United States</option>
                      <option value="India">India</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="Switzerland">Switzerland</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Primary Currency
                    </label>
                    <select
                      value={individualCurrency}
                      onChange={(e) => setIndividualCurrency(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              /* Dynamic Schema B: For [Business / Organization] */
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Registered Legal Business / Organization Name
                    </label>
                    <input
                      type="text"
                      value={legalName}
                      onChange={(e) => setLegalName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. ApexFlow Technologies Inc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Country of Legal Registration
                    </label>
                    <select
                      value={regCountry}
                      onChange={(e) => setRegCountry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="United States (Delaware)">United States (Delaware)</option>
                      <option value="India (MCA / GSTIN)">India (MCA / GSTIN)</option>
                      <option value="United Kingdom (Companies House)">United Kingdom (Companies House)</option>
                      <option value="Germany (HRB / EU-VAT)">Germany (HRB / EU-VAT)</option>
                      <option value="Singapore (ACRA)">Singapore (ACRA)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Tax Identification Number (GSTIN / PAN / EIN)
                    </label>
                    <input
                      type="text"
                      value={taxId}
                      onChange={(e) => setTaxId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono"
                      placeholder="US-EIN: 84-2918492"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Annual Revenue Bracket
                    </label>
                    <select
                      value={revenueBracket}
                      onChange={(e) => setRevenueBracket(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="< $1M ARR">&lt; $1M ARR (Early Stage)</option>
                      <option value="$1M - $5M ARR">$1M - $5M ARR (Growth Scaleup)</option>
                      <option value="$5M - $20M ARR">$5M - $20M ARR (Series B+)</option>
                      <option value="$20M - $100M ARR">$20M - $100M ARR (Mid-Market)</option>
                      <option value="$100M+ ARR">$100M+ ARR (Enterprise)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Operating Currency
                    </label>
                    <select
                      value={corporateCurrency}
                      onChange={(e) => setCorporateCurrency(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Core Accounting / ERP Tech Stack
                  </label>
                  <select
                    value={techStack}
                    onChange={(e) => setTechStack(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Stripe Payments + QuickBooks Online">Stripe Payments + QuickBooks Online</option>
                    <option value="Stripe Enterprise + NetSuite ERP">Stripe Enterprise + NetSuite ERP</option>
                    <option value="Cybersource + SAP S/4HANA">Cybersource Gateway + SAP S/4HANA</option>
                    <option value="Xero + Chargebee Billing">Xero Accounting + Chargebee</option>
                    <option value="Direct SWIFT Banking + Workday Financials">Direct SWIFT Banking + Workday Financials</option>
                  </select>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* 3. Inform Counterparty / Other User During Waiting Period (Mail vs WhatsApp) */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>3. Inform Counterparty / Other User During Waiting Period:</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setInformChannel('email')}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  informChannel === 'email'
                    ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 shadow-glow-cyan'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>[✉ Inform via Mail]</span>
              </button>

              <button
                type="button"
                onClick={() => setInformChannel('whatsapp')}
                className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                  informChannel === 'whatsapp'
                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-glow-emerald'
                    : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>[💬 Inform via WhatsApp]</span>
              </button>
            </div>
          </div>

          {informChannel === 'email' ? (
            <div className="animate-in fade-in duration-200 pt-1">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Other User / Counterparty Email Address for Verification:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-sky-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={otherUserEmail}
                  onChange={e => setOtherUserEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                  placeholder="legal-reconciliation@counterparty.com"
                />
              </div>
              <p className="text-[10px] text-sky-400/80 mt-1 font-mono">
                An email will be dispatched immediately in this waiting period to the other user to verify this record.
              </p>
            </div>
          ) : (
            <div className="animate-in fade-in duration-200 pt-1">
              <label className="text-[11px] font-mono text-slate-400 block mb-1">
                Other User / Counterparty WhatsApp Number for Verification:
              </label>
              <div className="relative">
                <MessageSquare className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                <input
                  type="tel"
                  value={otherUserPhone}
                  onChange={e => setOtherUserPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  placeholder="+1 (415) 890-4821 or +91 98765-43210"
                />
              </div>
              <p className="text-[10px] text-emerald-400/80 mt-1 font-mono">
                A WhatsApp verification alert will be sent immediately in this waiting period to the other user.
              </p>
            </div>
          )}
        </div>

        {/* 4. Mandatory Privacy Consent Interceptor Checkbox */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={privacyConsent}
              onChange={(e) => {
                setPrivacyConsent(e.target.checked);
                if (consentError) setConsentError('');
              }}
              className="mt-0.5 w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500/20 bg-slate-800 shrink-0"
            />
            <div className="text-xs text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-100">
                Authorize AI to process scanned profiles, identity documents, and dispute transactions securely.
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Mandatory legal interceptor: You grant AegisRecover autonomous zero-knowledge cryptographic processing rights adhering to DPDP Act 2023 & GDPR Art 32. Personally identifiable identifiers (PII) remain masked by default.
              </p>
              <button
                type="button"
                onClick={() => setShowPrivacyFramework(!showPrivacyFramework)}
                className="text-[11px] text-sky-400 hover:text-sky-300 underline mt-1 block"
              >
                {showPrivacyFramework ? 'Hide Cryptographic Privacy Architecture' : 'View Zero-Knowledge Privacy Architecture'}
              </button>
            </div>
          </label>

          {showPrivacyFramework && (
            <div className="mt-3 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-400 space-y-1 bg-slate-950 p-3 rounded-xl">
              <div>• Zero Token Retention: Credit cards and IBANs are strictly tokenized via PCI-DSS Level 1 HSM.</div>
              <div>• Ephemeral RAG Search: Identity KYC documents and contracts are parsed in secure memory with zero plaintext persistence.</div>
              <div>• Autonomous Escrow Guardrails: All actions bounded by user-defined monetary threshold limits.</div>
            </div>
          )}

          {consentError && (
            <p className="text-xs text-rose-400 mt-2 font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {consentError}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          {!isNewUserFlow && (
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-400 hover:text-slate-200 transition"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow-emerald transition"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Complete Onboarding & Ingest into Waiting Period</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
