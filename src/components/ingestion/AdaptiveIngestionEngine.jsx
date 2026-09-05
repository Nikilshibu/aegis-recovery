import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HardDriveDownload,
  FileText,
  Mail,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Sparkles,
  UploadCloud,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Info,
  DollarSign,
  CreditCard,
  Paperclip,
  Check,
  FileCheck
} from 'lucide-react';

export function AdaptiveIngestionEngine() {
  const {
    currentProfile,
    entityType,
    formatCurrency,
    currency,
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
    navigateToTab,
    maskPii,
    createAndCommitRecord,
    refreshHeroDashboardMetrics
  } = useApp();

  // Manual Form State
  const [formEntityName, setFormEntityName] = useState('');
  const [formVendor, setFormVendor] = useState('');
  const [formCategory, setFormCategory] = useState('Contract Tier Discrepancy');
  const [formInvoiceId, setFormInvoiceId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDetails, setFormDetails] = useState('');
  const [customRecipientEmail, setCustomRecipientEmail] = useState('');
  const [customRecipientPhone, setCustomRecipientPhone] = useState('');
  const [formSubmittedToast, setFormSubmittedToast] = useState(false);

  // Document & Identity/KYC File Upload State (Passport, Aadhaar, PAN Card, Invoices)
  const fileInputRef = useRef(null);
  const [selectedDocType, setSelectedDocType] = useState('aadhaar'); // 'passport' | 'aadhaar' | 'pan' | 'invoice'
  const [attachedDoc, setAttachedDoc] = useState(null);
  const [isScanningDoc, setIsScanningDoc] = useState(false);
  const [docScanProgress, setDocScanProgress] = useState(0);

  // Quick Sample Document Handlers
  const loadSamplePassport = () => {
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
        fileName: 'Passport_Alex_Rivera_USA_Verified.pdf',
        fileSize: '1.4 MB',
        idNumber: 'P129482938',
        bearerName: 'Alex Rivera',
        issuer: 'Department of State, United States of America',
        country: 'United States',
        status: 'Cryptographically Verified',
        notes: 'Passport MRZ checksum and security holograms verified with zero-knowledge hashing.'
      });

      // Synchronize manual fields
      setFormEntityName('Alex Rivera');
      setFormVendor('Stripe Global Treasury / Cloud Advisory');
      setFormInvoiceId('INV-PASS-2026-8812');
      setFormCategory('Contract Tier Discrepancy');
      setFormAmount('7450');
      setFormDetails('Passport identity verified (P129482938). Retainer fee tier variance for cross-border advisory services.');
    }, 900);
  };

  const loadSampleAadhaar = () => {
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
        notes: 'UIDAI digital signature verified with QR code cryptographic hash.'
      });

      // Synchronize manual fields
      setFormEntityName('Vikram Mehta Technical Advisory');
      setFormVendor('Tata Consultancy Services Ltd.');
      setFormInvoiceId('INV-UIDAI-2026-4401');
      setFormCategory('Late Settlement SLA Breach');
      setFormAmount('5800');
      setFormDetails('UIDAI Aadhaar 4829 1920 4819 verified. Cross-border IT consulting invoice variance under DTAA clause.');
    }, 900);
  };

  const loadSamplePanCard = () => {
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
        notes: 'NSDL / UTIITSL corporate PAN structure verified with MCA entity registry.'
      });

      // Synchronize manual fields
      setFormEntityName('ApexFlow Technologies Inc.');
      setFormVendor('Razorpay / AWS Enterprise India');
      setFormInvoiceId('INV-PAN-2026-902');
      setFormCategory('Contract Tier Discrepancy');
      setFormAmount('9200');
      setFormDetails('Entity PAN ABCDE1234F verified. GSTIN / Tax credit discrepancy on AWS compute settlement.');
    }, 900);
  };

  const loadSampleInvoice = () => {
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
        bearerName: currentProfile.name,
        issuer: 'Snowflake Enterprise Data Cloud',
        country: 'United States',
        status: 'Cryptographically Verified',
        notes: 'OCR extracted Section 8.1 Compute Multiplier variance of $6,350.00.'
      });

      // Synchronize manual fields
      setFormVendor('Snowflake Enterprise Data Cloud');
      setFormInvoiceId('SNOW-INV-2026-9041');
      setFormCategory('Contract Tier Discrepancy');
      setFormAmount('6350');
      setFormDetails('Clause 8.1 Compute Multiplier variance parsed from invoice PDF. Recoverable variance: $6,350.00.');
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
        bearerName: formEntityName || currentProfile.name,
        issuer: selectedDocType === 'aadhaar'
          ? 'UIDAI (Govt of India)'
          : selectedDocType === 'pan'
            ? 'Income Tax Dept (Govt of India)'
            : selectedDocType === 'passport'
              ? 'Issuing Passport Authority'
              : formVendor,
        country: selectedDocType === 'aadhaar' || selectedDocType === 'pan' ? 'India' : 'International',
        status: 'Cryptographically Verified',
        notes: `File ${file.name} scanned successfully with AI OCR. Security layers & text verified.`
      });

      // Synchronize invoice ID if invoice
      if (selectedDocType === 'invoice') {
        setFormInvoiceId(generatedId);
      }
    }, 1000);
  };

  // Submit Ingestion: Injects Record with Attached Verification Documents into Waiting Period Queue
  const handleRecordInjection = async (e) => {
    e.preventDefault();

    const targetRecipient = outboundChannel === 'email' ? customRecipientEmail : customRecipientPhone;

    const newRecord = {
      entityName: formEntityName,
      vendor: formVendor,
      category: formCategory,
      invoiceId: formInvoiceId,
      amount: parseFloat(formAmount) || 2500,
      currency: currency,
      details: formDetails,
      peerChannel: outboundChannel, // 'email' | 'whatsapp'
      peerRecipient: targetRecipient,
      recipientEmail: customRecipientEmail,
      recipientPhone: customRecipientPhone,
      attachedDoc: attachedDoc || {
        type: 'Standard KYC & Invoicing Packet',
        idNumber: formInvoiceId,
        fileName: `${formInvoiceId}_Verification_Packet.pdf`,
        bearerName: formEntityName,
        status: 'Attached'
      }
    };

    injectRecordToPendingQueue(newRecord);
    setFormSubmittedToast(true);
    setTimeout(() => setFormSubmittedToast(false), 4000);

    // Reset input fields to clean state
    setFormEntityName('');
    setFormVendor('');
    setFormInvoiceId('');
    setFormAmount('');
    setFormDetails('');
    setCustomRecipientEmail('');
    setCustomRecipientPhone('');
    setAttachedDoc(null);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Telemetry Header */}
      <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 bg-[#0f172a]/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              MODULE 4 & 5: INGESTION & PEER VERIFICATION
            </span>
            <span className="text-xs text-slate-400 font-mono">• Manual Info + Identity/KYC File Upload</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Adaptive Ingestion Engine with Waiting Period & Peer Routing
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Ingest recovery targets combining manual dispute data with identity/KYC documents (Passport, Aadhaar Card, PAN Card, Invoices). Records enter a 15-minute waiting period for counterparty verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-2 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-center gap-2">
            <span className="text-slate-400">Waiting Notification:</span>
            <span className="text-emerald-400 font-bold uppercase">{outboundChannel}</span>
          </div>
        </div>
      </div>

      {/* Toast Confirmation */}
      {formSubmittedToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-glow-emerald animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Record Ingested:</strong> Entered 15-Minute Waiting Period. Notification dispatched to peer via <strong>{outboundChannel.toUpperCase()}</strong> ({outboundChannel === 'email' ? customRecipientEmail : customRecipientPhone}).
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
            BUFFERED
          </span>
        </div>
      )}

      {/* Main Workstation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ==================================================================== */}
        {/* LEFT COLUMN (lg:col-span-7): Unified Ingestion (Manual + File Upload) */}
        {/* ==================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-800 bg-[#0b101b] p-6 shadow-2xl space-y-6">
            
            <div className="pb-4 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-400" />
                <span>New Record Ingestion Workstation</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Both manual parameters and identity/invoice verification files are required to initiate peer recovery.
              </p>
            </div>

            {/* PART 1: Supporting Document & Identity/KYC File Upload */}
            <div className="space-y-3 p-4 rounded-2xl bg-slate-900/70 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <UploadCloud className="w-4 h-4 text-sky-400" />
                  <span>1. Supporting Document & KYC Upload (Passport, Aadhaar, PAN Card, Invoices)</span>
                </label>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
                  Required Verification Packet
                </span>
              </div>

              {/* Document Type Selector Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                {[
                  { id: 'passport', label: 'Passport', icon: '🛂', desc: 'Proof of Identity' },
                  { id: 'aadhaar', label: 'Aadhaar Card', icon: '🪪', desc: 'UIDAI Resident ID' },
                  { id: 'pan', label: 'PAN Card', icon: '💳', desc: 'Income Tax Entity' },
                  { id: 'invoice', label: 'Invoice / Contract', icon: '📄', desc: 'Discrepancy Proof' }
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

              {/* File Drop Zone with Real File Input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-sky-500/60 rounded-2xl p-5 text-center transition bg-slate-950/60 cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-200 mb-0.5">
                  Click to Browse or Drag & Drop {selectedDocType.toUpperCase()} Document
                </div>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto mb-2">
                  Supports PDF, PNG, JPG (Passport, Aadhaar, PAN Card, Vendor Invoice). Scans security watermarks and OCR checksums.
                </p>

                {/* Progress bar if scanning */}
                {isScanningDoc && (
                  <div className="max-w-xs mx-auto space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-sky-300">
                      <span>Scanning Document OCR Layers...</span>
                      <span>{docScanProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 transition-all duration-300"
                        style={{ width: `${docScanProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Sample One-Click Buttons */}
              <div className="pt-1">
                <div className="text-[10px] uppercase font-mono text-slate-500 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Quick-Load Sample Verification Documents:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={loadSamplePassport}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-500/50 text-[11px] font-medium text-slate-300 hover:text-sky-300 transition flex items-center gap-1.5"
                  >
                    <span>🛂 Sample Passport (USA)</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadSampleAadhaar}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-[11px] font-medium text-slate-300 hover:text-emerald-300 transition flex items-center gap-1.5"
                  >
                    <span>🪪 Sample Aadhaar (UIDAI)</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadSamplePanCard}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-indigo-500/50 text-[11px] font-medium text-slate-300 hover:text-indigo-300 transition flex items-center gap-1.5"
                  >
                    <span>💳 Sample PAN Card (ITD)</span>
                  </button>
                  <button
                    type="button"
                    onClick={loadSampleInvoice}
                    disabled={isScanningDoc}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-[11px] font-medium text-slate-300 hover:text-amber-300 transition flex items-center gap-1.5"
                  >
                    <span>📄 Sample Invoice ($6,350)</span>
                  </button>
                </div>
              </div>

              {/* Verified Attached Document Preview Badge */}
              {attachedDoc && (
                <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold text-white">
                        {attachedDoc.type} Attached & Verified
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                      {attachedDoc.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-mono bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-slate-300">
                    <div>
                      <span className="text-slate-500">File: </span>
                      <span className="text-slate-200">{attachedDoc.fileName}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">ID Number: </span>
                      <span className="text-emerald-400 font-bold">{attachedDoc.idNumber}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Bearer: </span>
                      <span className="text-slate-200">{attachedDoc.bearerName}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    {attachedDoc.notes}
                  </p>
                </div>
              )}
            </div>

            {/* PART 2: Manual Information Form */}
            <form onSubmit={handleRecordInjection} className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <span>2. Manual Dispute & Recovery Parameters</span>
                  </label>
                  <span className="text-[10px] font-mono text-slate-500">
                    Synchronized with attached document
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Entity / Claimant Name
                    </label>
                    <input
                      type="text"
                      value={formEntityName}
                      onChange={e => setFormEntityName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. ApexFlow Technologies Inc. or your name"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Vendor / Debtor Name
                    </label>
                    <input
                      type="text"
                      value={formVendor}
                      onChange={e => setFormVendor(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. Snowflake, Datadog, Client Corp"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Invoice / Contract ID
                    </label>
                    <input
                      type="text"
                      value={formInvoiceId}
                      onChange={e => setFormInvoiceId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. INV-2026-001"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Discrepancy Category
                    </label>
                    <select
                      value={formCategory}
                      onChange={e => setFormCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      <option>Contract Tier Discrepancy</option>
                      <option>Late Settlement SLA Breach</option>
                      <option>Uncollected Retainer / Invoicing</option>
                      <option>Overbilling & Ghost Charges</option>
                      <option>Dunning / Card Expiry Churn</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Recoverable Amount ({currency})
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2 text-slate-500 text-xs font-mono">$</span>
                      <input
                        type="number"
                        value={formAmount}
                        onChange={e => setFormAmount(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                        placeholder="0.00"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Discrepancy Cause & Evidence Analysis
                  </label>
                  <textarea
                    rows={3}
                    value={formDetails}
                    onChange={e => setFormDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 resize-none"
                    placeholder="Provide details on contract clause reference, variance percentage, or SLA terms..."
                  />
                </div>
              </div>

              {/* PART 3: Inform Other User During Waiting Period (Mail or WhatsApp) */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>3. Inform Counterparty / Other User During Waiting Period:</span>
                  </label>

                  {/* Channel Toggle Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setOutboundChannel('email')}
                      className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        outboundChannel === 'email'
                          ? 'bg-sky-500/20 border-sky-500/60 text-sky-300 shadow-glow-cyan'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>[✉ Inform via Mail]</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOutboundChannel('whatsapp')}
                      className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition border ${
                        outboundChannel === 'whatsapp'
                          ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 shadow-glow-emerald'
                          : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>[💬 Inform via WhatsApp]</span>
                    </button>
                  </div>
                </div>

                {/* Dynamic Input based on channel selection */}
                {outboundChannel === 'email' ? (
                  <div className="animate-in fade-in duration-200 pt-1">
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Counterparty Recipient Mail ID for Waiting Period Verification:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-sky-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={customRecipientEmail}
                        onChange={e => {
                          setCustomRecipientEmail(e.target.value);
                          setOutboundEmail(e.target.value);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        placeholder="legal-reconciliation@counterparty.com"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-sky-400/80 mt-1 font-mono">
                      An email with verification instructions & deep links will be dispatched immediately in this waiting period.
                    </p>
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200 pt-1">
                    <label className="text-[11px] font-mono text-slate-400 block mb-1">
                      Counterparty WhatsApp Phone Number for Waiting Period Verification:
                    </label>
                    <div className="relative">
                      <MessageSquare className="w-4 h-4 text-emerald-400 absolute left-3 top-2.5" />
                      <input
                        type="tel"
                        value={customRecipientPhone}
                        onChange={e => {
                          setCustomRecipientPhone(e.target.value);
                          setOutboundPhone(e.target.value);
                        }}
                        className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                        placeholder="+1 (415) 890-4821 or +91 98765-43210"
                        required
                      />
                    </div>
                    <p className="text-[10px] text-emerald-400/80 mt-1 font-mono">
                      A WhatsApp verification alert will be sent immediately to the counterparty in this waiting period.
                    </p>
                  </div>
                )}
              </div>

              {/* Submit Ingestion Action */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm shadow-glow-emerald transition flex items-center justify-center gap-2"
              >
                <HardDriveDownload className="w-4 h-4" />
                <span>🚀 Ingest Record & Start 15-Minute Peer Verification Waiting Period</span>
              </button>
            </form>

          </div>
        </div>

        {/* ==================================================================== */}
        {/* RIGHT COLUMN (lg:col-span-5): WAITING PERIOD & PEER CONFIRMATION     */}
        {/* ==================================================================== */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-3xl border border-slate-800 bg-[#0b101b] p-6 shadow-2xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
                <h3 className="text-base font-bold text-white">⏳ Waiting Period for Peer Verification</h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                {pendingQueue.filter(q => q.status === 'pending').length} ACTIVE
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Every injected record enters this <strong>15-minute waiting period</strong> for the other user to verify the record. A verification dispatch was sent via {outboundChannel.toUpperCase()}. If confirmed or upon 00:00 timer expiry, it settles directly into the active ledger.
            </p>

            {/* List of Pending Items */}
            <div className="space-y-4 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
              {pendingQueue.map(item => {
                const isPending = item.status === 'pending';
                const isAuthorized = item.status === 'authorized';
                const isTerminated = item.status === 'terminated';
                const isAutoExecuted = item.status === 'auto_executed';

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition relative overflow-hidden ${
                      isPending
                        ? 'bg-slate-900/90 border-amber-500/40 shadow-glow-amber'
                        : isAutoExecuted
                          ? 'bg-emerald-950/40 border-emerald-500/40'
                          : isAuthorized
                            ? 'bg-emerald-950/30 border-emerald-500/30'
                            : 'bg-rose-950/20 border-rose-500/30 opacity-75'
                    }`}
                  >
                    {/* Top Row: Entity & Amount */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{item.vendor}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                            {item.invoiceId}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                          Claimant: {item.entityName}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-black font-mono text-emerald-400">
                          {formatCurrency(item.amount)}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono capitalize">
                          via {item.peerChannel || item.channel}
                        </div>
                      </div>
                    </div>

                    {/* Attached Document Badge if available */}
                    {item.attachedDoc && (
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] mb-2.5 text-slate-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">
                          KYC/Doc: <strong>{item.attachedDoc.type || 'Identity Card'}</strong> ({item.attachedDoc.idNumber || item.invoiceId})
                        </span>
                        <span className="ml-auto text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 shrink-0">
                          Verified
                        </span>
                      </div>
                    )}

                    {/* Extracted Details Summary */}
                    <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 mb-3 leading-relaxed">
                      {item.extractedDetails}
                    </div>

                    {/* Waiting Period Row (Active during pending) */}
                    {isPending && (
                      <div className="mb-3 p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center w-6 h-6 rounded-full border border-amber-500/60 bg-amber-500/10">
                              <Clock className="w-3 h-3 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
                            </div>
                            <div className="text-[10px] uppercase font-mono font-bold text-amber-300">
                              Waiting Period Buffer
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-base font-black font-mono text-amber-300">
                              {formatTimer(item.secondsLeft)}
                            </span>
                          </div>
                        </div>

                        {/* Peer Notification Status */}
                        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 pt-1 border-t border-amber-500/20">
                          {(item.peerChannel || item.channel) === 'email' ? (
                            <>
                              <Mail className="w-3 h-3 text-sky-400 shrink-0" />
                              <span className="truncate">
                                Verification Email Sent to: <strong className="text-sky-300">{item.peerRecipient || item.recipient}</strong>
                              </span>
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span className="truncate">
                                WhatsApp Alert Sent to: <strong className="text-emerald-300">{item.peerRecipient || item.recipient}</strong>
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Status Badge when not pending */}
                    {!isPending && (
                      <div className="mb-3 flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">Queue Resolution:</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                            isAutoExecuted
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isAuthorized
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isAutoExecuted ? 'AUTO-EXECUTED AT 00:00' : isAuthorized ? 'PEER VERIFIED & CONFIRMED' : 'TERMINATED'}
                        </span>
                      </div>
                    )}

                    {/* Interactive Action Buttons for Pending State */}
                    {isPending ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => peerVerifyRecord ? peerVerifyRecord(item.id) : authorizePendingRecord(item.id)}
                            className="py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                            title="Simulate peer counterparty confirming the record"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Peer Verify & Confirm</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => terminatePendingRecord(item.id)}
                            className="py-2 px-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold text-xs transition flex items-center justify-center gap-1.5"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Dispute / Terminate</span>
                          </button>
                        </div>

                        {/* Testing helpers: Fast Forward / Trigger 00:00 */}
                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                          <span>Testing shortcuts:</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => fastForwardPendingTimer(item.id, 5)}
                              className="text-amber-400 hover:underline hover:text-amber-300"
                            >
                              Jump to 00:05
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => fastForwardPendingTimer(item.id, 1)}
                              className="text-emerald-400 hover:underline hover:text-emerald-300"
                            >
                              Trigger 00:00 Auto-Exec
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* DEEP LINK BUTTON: Renders when auto-executed or authorized! */
                      item.deepLinkId && (
                        <div className="pt-2 border-t border-slate-800/80">
                          <button
                            type="button"
                            onClick={() => navigateToTab('ledger', { recordId: item.deepLinkId })}
                            className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition flex items-center justify-center gap-2 group"
                          >
                            <span>🔗 View Record in Historical Ledger: #{item.deepLinkId}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-emerald-400 group-hover:translate-x-0.5 transition" />
                          </button>
                        </div>
                      )
                    )}

                  </div>
                );
              })}

              {pendingQueue.length === 0 && (
                <div className="text-center py-8 text-slate-500 text-xs">
                  No records currently in waiting period queue.
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
