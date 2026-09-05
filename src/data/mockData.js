export const ENTITY_PROFILES = {
  Individual: {
    id: 'ent_ind_01',
    name: 'Alex Rivera',
    designation: 'Principal Cloud Architect & Independent Consultant',
    taxId: 'US-SSN: 941-28-4892',
    taxIdAlternative: 'PAN: ABXPR9841K',
    currency: 'USD',
    riskTolerance: 'Conservative',
    annualVolume: 320000,
    recoveryTargetMonthly: 4500,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    stats: {
      totalAtRisk: 14850,
      recoveredMTD: 6420,
      recoveredYTD: 28900,
      successRate: 94.2,
      runRateSavings: 18400
    }
  },
  Business: {
    id: 'ent_biz_02',
    name: 'ApexFlow Technologies Inc.',
    designation: 'Series B Cloud Operations & Enterprise SaaS',
    taxId: 'US-EIN: 84-2918492',
    taxIdAlternative: 'VAT: GB928374102',
    currency: 'USD',
    riskTolerance: 'Balanced Autonomous',
    annualVolume: 4800000,
    recoveryTargetMonthly: 38000,
    avatar: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=250',
    stats: {
      totalAtRisk: 142850,
      recoveredMTD: 58400,
      recoveredYTD: 312500,
      successRate: 92.8,
      runRateSavings: 145000
    }
  },
  Organization: {
    id: 'ent_org_03',
    name: 'Global Aid & Climate Initiative',
    designation: 'International Non-Governmental Organization (501(c)(3))',
    taxId: 'EU-REG: 884-912-401',
    taxIdAlternative: 'FCRA: 031740921',
    currency: 'EUR',
    riskTolerance: 'Strict Guardrails',
    annualVolume: 12500000,
    recoveryTargetMonthly: 95000,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    stats: {
      totalAtRisk: 318400,
      recoveredMTD: 124500,
      recoveredYTD: 845000,
      successRate: 96.1,
      runRateSavings: 380000
    }
  }
};

export const CURRENCY_SYMBOLS = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  INR: '₹'
};

export const EXCHANGE_RATES_FROM_USD = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5
};

export const INITIAL_LEAKS = [
  {
    id: 'LEAK-8492',
    title: 'Vendor Tier Overcharge vs Master SLA Clause 4b',
    entityType: 'Business',
    category: 'Contract Discrepancy',
    amountUSD: 8420,
    confidence: 98,
    riskLevel: 'Critical',
    detectedAt: '12 mins ago',
    vendor: 'Datadog Enterprise Cloud',
    department: 'Engineering / DevOps',
    channel: 'Direct ACH Wire',
    causeAnalysis: 'Billed for 240 host-agents at $38/host instead of contracted tiered discounted rate of $24/host specified under Enterprise Master Service Agreement Clause 4b.',
    clauseRef: 'Section 4b: Volume Tiers (Tier 3 Host Licenses capped at $24.00 net, retroactive to Q2).',
    invoiceId: 'INV-2026-DD-8819',
    ledgerTransaction: 'TXN-ACH-994012 (Amount Debited: $9,120.00 on 28-Aug-2026)',
    evidenceSnippet: 'Discrepancy: Expected $5,760.00, Invoiced $9,120.00. Delta: $3,360.00 recurring + $5,060 retroactive overcharge.',
    draftTemplateEmail: {
      subject: 'Discrepancy Notice & Immediate Credit Request: Inv #INV-2026-DD-8819 under MSA Clause 4b',
      targetEmail: 'billing-disputes@datadoghq.com',
      body: `Dear Datadog Enterprise Billing Operations Team,

Our autonomous financial reconciliation system has identified a billing discrepancy in invoice #INV-2026-DD-8819 issued on 28-Aug-2026.

According to our Master Service Agreement (MSA) dated Jan 14, 2026, Section 4b: Volume Tiers, our account qualifies for Tier 3 pricing ($24.00/host net for deployments > 200 units). The invoice applied standard catalog pricing of $38.00/host across all 240 active agents.

Discrepancy Breakdown:
- Invoiced Total: $9,120.00
- Contracted Net: $5,760.00
- Total Overage Claimed: $3,360.00 + $5,060 retroactive Q2 variance. Total Reclaim: $8,420.00.

Please issue a revised credit memo or reverse the unauthorized ACH charge within 5 business days pursuant to Clause 9.2 (Prompt Resolution of Disputed Sums).

Evidence and hash-verified MSA extracts are attached for verification.

Sincerely,
Automated Revenue Recovery Office
ApexFlow Technologies Inc.`
    },
    draftTemplateWhatsApp: {
      targetPhone: '+1 (415) 890-4821',
      countryCode: '+1',
      body: `[URGENT] ApexFlow Notice: Billing mismatch detected on Inv #INV-2026-DD-8819. Billed $9,120.00 vs contracted $5,760.00 (MSA Clause 4b). Total credit claimed: $8,420.00. Please approve credit memo or reply STOP.`
    },
    status: 'Pending',
    autonomousEligible: false // Above threshold $2,500
  },
  {
    id: 'LEAK-7104',
    title: 'High-Value Enterprise Stripe Invoice Dunning Exhaustion',
    entityType: 'Business',
    category: 'Failed Renewal / Dunning',
    amountUSD: 14500,
    confidence: 95,
    riskLevel: 'Critical',
    detectedAt: '34 mins ago',
    vendor: 'Northstar Financial Group (Client)',
    department: 'Sales & Invoicing',
    channel: 'Stripe Invoicing',
    causeAnalysis: 'Corporate credit card on file declined with code "do_not_honor" on scheduled retry 3 of 4. Smart dunning algorithms detected optimal processing window at Tuesday 10:15 AM EST.',
    clauseRef: 'Customer Master Terms: 30-Day Cure Period prior to enterprise tenant suspension.',
    invoiceId: 'STRIPE-IN-49204',
    ledgerTransaction: 'CHG-992014-DECLINED (Stripe Gateway Response Code 05)',
    evidenceSnippet: 'Card BIN 424242 indicates J.P. Morgan Commercial Fleet Card. Historic approvals peak Tuesdays 10:00 - 11:30 AM.',
    draftTemplateEmail: {
      subject: 'Action Required: Update Enterprise Payment Method for Invoice #STRIPE-IN-49204',
      targetEmail: 'ap-payments@northstarfin.com',
      body: `Dear Accounts Payable Team at Northstar Financial,

We attempted to process the scheduled annual license renewal for ApexFlow Core Suite under Invoice #STRIPE-IN-49204 ($14,500.00). The corporate card currently on file was declined by your issuing institution with response "temporary authorization limit reached".

To prevent any disruption to your mission-critical analytics clusters, please update your payment method via the secure PCI-DSS tokenized link below:
https://billing.apexflow.io/pay/inv_49204?token=sec_991823

Alternatively, you may wire funds directly to our corporate treasury. If you require an updated W-9 or purchase order reference, let us know immediately.

Kind regards,
ApexFlow Finance Operations`
    },
    draftTemplateWhatsApp: {
      targetPhone: '+1 (212) 555-0198',
      countryCode: '+1',
      body: `ApexFlow Alert: Annual renewal of $14,500 for Northstar Financial failed authorization. Update payment card here: https://billing.apexflow.io/pay/inv_49204 to avoid service pause.`
    },
    status: 'Pending',
    autonomousEligible: false
  },
  {
    id: 'LEAK-3918',
    title: 'Silent Duplicate Subscription & Ghost Seat Leakage',
    entityType: 'Business',
    category: 'Shadow SaaS / Auto-Renewal',
    amountUSD: 2180,
    confidence: 96,
    riskLevel: 'Medium',
    detectedAt: '1 hour ago',
    vendor: 'Figma Organization Seats',
    department: 'Product & Design',
    channel: 'Corporate Credit Card',
    causeAnalysis: '12 inactive design seats billed consecutively for 90 days despite Zero Activity logs in Okta SAML directory. Potential instant clawback via prorated cancellation hook.',
    clauseRef: 'Figma Terms of Service §5.3: Pro-rated unassigned seat credits on annual accounts.',
    invoiceId: 'FIG-INV-99218',
    ledgerTransaction: 'CARD-CORP-4881 (Recurring Monthly $2,180.00)',
    evidenceSnippet: '12 user accounts have 0 login events since June 1, 2026. Okta SAML shows deactivated status.',
    draftTemplateEmail: {
      subject: 'Seat Optimization & Credit Request - Figma Org Workspace #49120',
      targetEmail: 'support@figma.com',
      body: `Hello Figma Support Team,

We have audited our active organization seat licensing under Workspace ID #49120. 12 licenses were identified as decommissioned staff accounts that were disabled in our IdP but remained allocated on invoice #FIG-INV-99218.

Per §5.3 of your Enterprise Agreement, we request immediate de-provisioning of these 12 unused seats and application of a prorated account balance credit of $2,180.00.

Thank you,
ApexFlow IT Operations`
    },
    draftTemplateWhatsApp: {
      targetPhone: '+1 (650) 412-9901',
      countryCode: '+1',
      body: `Figma Seat Audit: 12 inactive seats identified on ApexFlow Org. Requesting one-click removal and $2,180 credit allocation.`
    },
    status: 'Pending',
    autonomousEligible: true // Under $2,500 threshold
  },
  {
    id: 'LEAK-5521',
    title: 'Unclaimed 18% VAT / TDS Withholding Over-Remittance',
    entityType: 'Individual',
    category: 'Tax Discrepancy',
    amountUSD: 1850,
    confidence: 99,
    riskLevel: 'Medium',
    detectedAt: '2 hours ago',
    vendor: 'Global Remote Client Invoicing',
    department: 'Contract Consulting',
    channel: 'SWIFT International Transfer',
    causeAnalysis: 'Overseas client mistakenly deducted 20% foreign contractor tax instead of 2% standard treaty tax specified under US-EU Double Taxation Avoidance Agreement (DTAA Form 8802).',
    clauseRef: 'IRS / DTAA Treaty Article 12: Royalties and Independent Personal Services capped at 2% withholding.',
    invoiceId: 'INV-ALX-2026-08',
    ledgerTransaction: 'SWIFT-WIRE-889124 (Net Received: $7,400 on $9,250 invoice)',
    evidenceSnippet: 'Form 8802 on file with Client AP. Withholding slip shows 20% ($1,850) deducted in error.',
    draftTemplateEmail: {
      subject: 'Tax Withholding Correction - Invoice #INV-ALX-2026-08 (DTAA Form 8802 Attached)',
      targetEmail: 'disbursements@client-corp.de',
      body: `Dear Finance & Disbursements Team,

I am writing regarding payment received on 27-Aug-2026 for Invoice #INV-ALX-2026-08 ($9,250.00).

The remittance statement indicates a 20% withholding deduction ($1,850.00). As documented in my certified US Tax Residency Certificate (Form 8802 / IRS 6166) submitted in January, this independent technical advisory engagement qualifies for the 2% withholding cap under Article 12 of the Double Taxation Avoidance Treaty.

Excess Withholding to be Refunded: $1,665.00 (or full $1,850 pending revised treaty filing).

Please review the attached certified tax residency form and issue the corrective wire transfer at your earliest convenience.

Best regards,
Alex Rivera`
    },
    draftTemplateWhatsApp: {
      targetPhone: '+49 170 892144',
      countryCode: '+49',
      body: `Hi Finance Team, regarding invoice #INV-ALX-2026-08: 20% tax was deducted instead of 2% DTAA treaty rate. $1,665 refund due. Documentation emailed.`
    },
    status: 'Pending',
    autonomousEligible: true
  },
  {
    id: 'LEAK-9042',
    title: 'Disputed Chargeback & Card Scheme Fee Arbitration',
    entityType: 'Organization',
    category: 'Chargeback & Dispute',
    amountUSD: 4200,
    confidence: 91,
    riskLevel: 'High',
    detectedAt: '3 hours ago',
    vendor: 'Donor Contribution Portal (Visa Europe)',
    department: 'Development & Philanthropy',
    channel: 'Visa Net / Cybersource',
    causeAnalysis: 'Fraud code 10.4 chargeback filed for major philanthropic grant. Automated biometric 3D-Secure log and IP matching confirms legitimate authorized donation.',
    clauseRef: 'Visa Core Rules 2026 §11.1.4: 3D Secure liability shift fully protects merchant from fraudulent claims.',
    invoiceId: 'DONATION-REC-4982',
    ledgerTransaction: 'CYBER-DISPUTE-88319 (Held in Escrow: €3,864 / $4,200)',
    evidenceSnippet: '3DS v2.2 authentication token verified with frictionless OTP. IP Geolocation matches registered donor address in Zurich.',
    draftTemplateEmail: {
      subject: 'Formal Dispute Rebuttal: Case #CYBER-DISPUTE-88319 - Complete 3DS Authentication Proof',
      targetEmail: 'chargeback-evidence@cybersource.com',
      body: `To the Visa Card Dispute Arbitration Panel,

Global Aid & Climate Initiative hereby formally submits complete compelling evidence refuting Dispute Case #CYBER-DISPUTE-88319 for €3,864.00 ($4,200.00).

Evidence Package:
1. Complete 3D Secure v2.2 Authentication Trace: CAVV/ECI Code 05 verified.
2. IP Geolocation and Session Log matching historical recurring philanthropic contributions from this verified donor ID.
3. Signed donor acknowledgment letter and project allocation schedule.

Under Visa Core Rules §11.1.4, liability shift applies unconditionally to 3DS authenticated transactions. We request immediate release of the disputed funds and dismissal of arbitration fees.

Respectfully,
Compliance & Treasury Office
Global Aid & Climate Initiative`
    },
    draftTemplateWhatsApp: {
      targetPhone: '+41 22 819 0421',
      countryCode: '+41',
      body: `Global Aid notice: Formal 3DS evidence submitted for disputed grant donation #CYBER-DISPUTE-88319. Full liability shift verified.`
    },
    status: 'Pending',
    autonomousEligible: false
  },
  {
    id: 'LEAK-2190',
    title: 'Unbilled Freelance Retainer Milestone Past SLA',
    entityType: 'Individual',
    category: 'Uncollected AR',
    amountUSD: 3600,
    confidence: 97,
    riskLevel: 'High',
    detectedAt: '4 hours ago',
    vendor: 'Fintech Mobile App Client',
    department: 'Client Retainers',
    channel: 'Direct ACH',
    causeAnalysis: 'Milestone 4 (API Security Architecture) completed and merged to production on GitHub 18 days ago. Contract clause 3a stipulates auto-invoicing within 48 hours of acceptance.',
    clauseRef: 'Consulting Contract §3a: Acceptance deemed approved if no written objections within 5 calendar days.',
    invoiceId: 'RET-MILESTONE-04',
    ledgerTransaction: 'PENDING-AR-MILESTONE-04 (Value: $3,600.00)',
    evidenceSnippet: 'PR #142 approved and merged by Client VP Eng on Aug 15. Zero revision requests recorded.',
    draftTemplateEmail: {
      subject: 'Milestone 4 Completion Notice & Invoice #RET-MILESTONE-04',
      targetEmail: 'accounting@fintechstartup.io',
      body: `Hi Team,

Following the successful delivery and production deployment of Milestone 4 (API Security Architecture), please find attached Invoice #RET-MILESTONE-04 for $3,600.00.

Per Section 3a of our Consulting Agreement, technical acceptance was established upon merge without objection. Payment is due within 10 business days as per contracted net terms.

Thank you for the seamless collaboration on this phase!

Best regards,
Alex Rivera`
    },
    draftTemplateWhatsApp: {
      targetPhone: '+1 (415) 309-8812',
      countryCode: '+1',
      body: `Hey Fintech Team, Milestone 4 has been deployed. Invoice RET-MILESTONE-04 ($3,600) is submitted per §3a terms. Let me know once queued!`
    },
    status: 'Pending',
    autonomousEligible: false
  }
];

export const PREDICTIVE_RUNWAY_DATA = [
  { month: 'Apr', historical: 142000, projected: 142000, lowerBound: 138000, upperBound: 146000, leakageRisk: 8200 },
  { month: 'May', historical: 156000, projected: 156000, lowerBound: 150000, upperBound: 162000, leakageRisk: 9400 },
  { month: 'Jun', historical: 168000, projected: 168000, lowerBound: 160000, upperBound: 175000, leakageRisk: 11200 },
  { month: 'Jul', historical: 184000, projected: 184000, lowerBound: 174000, upperBound: 192000, leakageRisk: 14800 },
  { month: 'Aug', historical: 191000, projected: 191000, lowerBound: 180000, upperBound: 202000, leakageRisk: 16500 },
  { month: 'Sep (Now)', historical: 196000, projected: 196000, lowerBound: 184000, upperBound: 208000, leakageRisk: 21000 },
  { month: 'Oct', historical: null, projected: 208000, lowerBound: 189000, upperBound: 226000, leakageRisk: 28400 },
  { month: 'Nov', historical: null, projected: 219000, lowerBound: 194000, upperBound: 242000, leakageRisk: 34200 },
  { month: 'Dec', historical: null, projected: 234000, lowerBound: 201000, upperBound: 264000, leakageRisk: 48900 },
  { month: 'Jan', historical: null, projected: 246000, lowerBound: 210000, upperBound: 281000, leakageRisk: 42100 }
];

export const WATERFALL_DATA = [
  { step: 'Gross Invoiced', amount: 248000, type: 'base', desc: 'Total contractual revenue invoiced across all active accounts' },
  { step: 'Card & ACH Failures', amount: -24600, type: 'negative', desc: 'Failed subscription renewals, expired tokens, card auth limits' },
  { step: 'Contract Overbilling', amount: -12800, type: 'negative', desc: 'Unchecked vendor pricing tier jumps & duplicate seat allocations' },
  { step: 'Unclaimed Deductions', amount: -8400, type: 'negative', desc: 'TDS/VAT withholding mismatch & unapplied volume rebate credits' },
  { step: 'Disputed Chargebacks', amount: -5200, type: 'negative', desc: 'Contested card scheme fees and open buyer claims' },
  { step: 'AI Auto-Recovered', amount: +38200, type: 'positive', desc: 'Capital reclaimed via autonomous dunning, RAG dispute rebuttals & refunds' },
  { step: 'Net Realized Cash', amount: 235200, type: 'total', desc: 'Actual realized liquidity deposited into primary bank treasury' }
];

export const COHORT_DUNNING_DATA = {
  bestDays: ['Tuesday', 'Wednesday'],
  bestHours: ['09:00 - 11:00 AM', '02:00 - 04:00 PM'],
  averageRecoveryWindowHours: 18.4,
  matrix: [
    { day: 'Mon', hours: [32, 28, 45, 62, 78, 65, 54, 40] },
    { day: 'Tue', hours: [45, 38, 68, 89, 94, 82, 70, 58] },
    { day: 'Wed', hours: [42, 35, 72, 91, 92, 85, 74, 52] },
    { day: 'Thu', hours: [38, 30, 60, 84, 86, 78, 68, 48] },
    { day: 'Fri', hours: [30, 24, 50, 72, 70, 62, 45, 32] },
    { day: 'Sat', hours: [18, 15, 25, 38, 42, 35, 28, 20] },
    { day: 'Sun', hours: [15, 12, 20, 32, 36, 30, 24, 18] }
  ]
};

export const EXPENSE_HEATMAP_DATA = [
  { vendor: 'AWS Cloud Services', department: 'Engineering', channel: 'Direct Card', monthlySpend: 34200, leakageRate: 14.2, anomaly: 'Idle EBS snapshots & unreserved instances' },
  { vendor: 'Datadog Enterprise', department: 'Engineering', channel: 'Direct ACH', monthlySpend: 9120, leakageRate: 36.8, anomaly: 'Tier jump overage violating clause 4b' },
  { vendor: 'Salesforce CRM', department: 'Sales', channel: 'Annual Wire', monthlySpend: 18500, leakageRate: 8.4, anomaly: '9 unassigned Enterprise seats' },
  { vendor: 'Google Workspace', department: 'Operations', channel: 'Direct Card', monthlySpend: 4200, leakageRate: 5.1, anomaly: 'Former employee archive accounts' },
  { vendor: 'HubSpot Enterprise', department: 'Marketing', channel: 'Direct Card', monthlySpend: 8400, leakageRate: 18.9, anomaly: 'Duplicate contact tier surcharge' },
  { vendor: 'WeWork Global Pass', department: 'Operations', channel: 'Direct Card', monthlySpend: 6800, leakageRate: 24.5, anomaly: 'Unused keycards during remote work quarter' }
];

export const INFRASTRUCTURE_AGENTS = [
  {
    id: 'agent_01',
    name: 'Agent 1: Ledger Ingestion & Stream Sentinel',
    status: 'Active / Continuous',
    throughput: '1,420 events/sec',
    latency: '42ms',
    role: 'Monitors real-time bank webhooks, Stripe events, and invoice queues for unexpected variance spikes.'
  },
  {
    id: 'agent_02',
    name: 'Agent 2: Contract & Policy RAG Verifier',
    status: 'Active / Multi-agent Validating',
    throughput: '85 clauses/min',
    latency: '180ms',
    role: 'Cross-checks extracted invoice line items against PDF contracts, tax treaties, and SLA thresholds using vector search.'
  },
  {
    id: 'agent_03',
    name: 'Agent 3: Autonomous Outreach & Dunning Bot',
    status: 'Active / Auto-Pilot',
    throughput: '48 communications/hr',
    latency: '95ms',
    role: 'Executes approved appeal drafts, card retries, and WhatsApp notices within user-defined monetary boundaries.'
  }
];

export const LIVE_API_TOKENS = [
  { name: 'Stripe API Gateway', status: 'Connected', permission: 'Read-Only + Restricted Dunning', lastSync: '12s ago', icon: 'stripe' },
  { name: 'Google Gmail API', status: 'Connected', permission: 'Draft-Only (No Direct Send)', lastSync: '1m ago', icon: 'mail' },
  { name: 'QuickBooks Online Sync', status: 'Connected', permission: 'Read & Reconcile', lastSync: '4m ago', icon: 'file-text' },
  { name: 'Slack Ops Webhook', status: 'Active', permission: 'Channel Push Alerts', lastSync: 'Just now', icon: 'message-square' }
];

export const REGULATORY_BADGES = [
  {
    id: 'soc2',
    title: 'SOC 2 Type II Certified',
    subtitle: 'AICPA Trust Services Criteria (Security, Availability & Confidentiality)',
    status: 'Active & Verified',
    auditor: 'Deloitte & Touche LLP',
    issuedDate: 'January 15, 2026',
    renewalDate: 'January 14, 2027',
    certId: 'SOC2-TY2-2026-889421',
    hashProof: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'iso27001',
    title: 'ISO/IEC 27001:2022',
    subtitle: 'Information Security Management System (ISMS)',
    status: 'Active & Audited',
    auditor: 'BSI Assurance International',
    issuedDate: 'March 01, 2025',
    renewalDate: 'February 28, 2028',
    certId: 'ISMS-UKAS-489012',
    hashProof: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4'
  },
  {
    id: 'dpdp',
    title: 'DPDP Act 2023 Compliant',
    subtitle: 'Digital Personal Data Protection Act (Consent & Zero-Knowledge Architecture)',
    status: 'Fully Enforced',
    auditor: 'Data Protection Board of India / CERT-In Certified',
    issuedDate: 'November 10, 2025',
    renewalDate: 'Continuous Audit',
    certId: 'DPDP-COMP-99410',
    hashProof: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb'
  },
  {
    id: 'gdpr',
    title: 'GDPR Article 32 Verified',
    subtitle: 'Technical & Organizational Security Measures (Pseudonymization & Cryptographic Masking)',
    status: 'Enforced',
    auditor: 'EU Data Protection Commission (CNIL Guidelines)',
    issuedDate: 'February 12, 2026',
    renewalDate: 'Continuous Audit',
    certId: 'GDPR-ART32-EU-1029',
    hashProof: 'fb8e20fc2e4c3f248c60c39bd652f3c1347298ab97b8b894d1a654138b9ae661'
  },
  {
    id: 'pci',
    title: 'PCI-DSS Level 1 Merchant',
    subtitle: 'Payment Card Industry Data Security Standard (Zero Token Storage)',
    status: 'Verified Level 1',
    auditor: 'Coalfire Systems Qualified Security Assessor',
    issuedDate: 'December 20, 2025',
    renewalDate: 'December 19, 2026',
    certId: 'PCI-DSS-L1-49219',
    hashProof: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0'
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-9921',
    timestamp: '2026-09-03 15:38:14 UTC',
    actor: 'Admin (sec-officer@apexflow.io)',
    action: 'MFA Verified Session Initialization',
    details: 'Zero-Trust TOTP authentication passed via hardware security token (IP 198.51.100.42)',
    hash: '0x8f72a19c4b22...49e1',
    status: 'Immutable Verified'
  },
  {
    id: 'LOG-9920',
    timestamp: '2026-09-03 15:24:02 UTC',
    actor: 'Autonomous Agent 2 (RAG Verifier)',
    action: 'Contract Vector Discrepancy Flagged',
    details: 'Flagged Datadog Invoice #INV-2026-DD-8819 for 36.8% variance against MSA clause 4b',
    hash: '0x3a49f82d01cb...8290',
    status: 'Immutable Verified'
  },
  {
    id: 'LOG-9919',
    timestamp: '2026-09-03 14:52:19 UTC',
    actor: 'Operator (billing-lead@apexflow.io)',
    action: 'Dunning Window Optimized',
    details: 'Card retry schedule shifted from Mon 03:00 UTC to Tue 15:15 UTC based on cohort success model',
    hash: '0x7c91e0a812df...3147',
    status: 'Immutable Verified'
  },
  {
    id: 'LOG-9918',
    timestamp: '2026-09-03 13:10:45 UTC',
    actor: 'Autonomous Agent 3 (Dunning Bot)',
    action: 'Auto-Executed Seat Clawback',
    details: 'Executed prorated credit claim for 12 inactive seats on Figma Org ($2,180.00)',
    hash: '0x5b33d98c77aa...9012',
    status: 'Immutable Verified'
  }
];

export const KNOWN_RETURNING_USERS = [
  {
    email: 'sarah.vance@apexflow.io',
    name: 'Sarah Vance, CISSP',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250'
  },
  {
    email: 'alex.rivera@cloudconsult.com',
    name: 'Alex Rivera',
    entityName: 'Alex Rivera Consulting',
    entityType: 'Individual',
    role: 'Operator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'
  },
  {
    email: 'treasury@globalaid.org',
    name: 'Elena Rostova',
    entityName: 'Global Aid & Climate Initiative',
    entityType: 'Organization',
    role: 'Admin',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=250'
  }
];

export const HISTORICAL_RECOVERY_RECORDS = [
  {
    id: 'REC-2026-635',
    ownerEmail: 'sarah.vance@apexflow.io',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    dateLogged: '2026-08-30',
    category: 'Contract SLA Dispute & Late Processing',
    vendor: 'Datadog Enterprise Cloud',
    amountInitial: 6358,
    amountRecovered: 6358,
    currency: 'USD',
    status: 'In-Arbitration',
    causeAnalysis: 'Contractual breach penalty of 10% ($635.80) applied to late settlement processing on $6,358 base cloud usage invoice.',
    metaValues: {
      invoiceId: 'INV-2026-DD-6358',
      ledgerTxn: 'TXN-DISPUTE-6358',
      confidenceScore: 99,
      slaSection: 'MSA §4.2 Clause 8.2: 10% Late Processing Surcharge',
      gateway: 'Direct ACH Wire',
      detectionLatency: '28ms'
    },
    pastCommunications: [
      {
        id: 'COMM-6358',
        type: 'email',
        timestamp: '2026-08-31 14:00 UTC',
        recipient: 'billing-disputes@datadoghq.com',
        subject: '⚠️ Contractual Breach Penalty Enforced: 10% late processing fee ($635.80) added to active dispute arbitration.',
        preview: 'Formal breach penalty levied on $6,358 invoice. Total tracked: $6,993.80.',
        status: 'Delivered & Dispatched',
        tone: 'Firm Contractual'
      }
    ],
    recommendedActions: [
      { id: 'act-6358-1', label: 'Monitor Arbitration Escrow Status', icon: 'Scale' },
      { id: 'act-6358-2', label: 'Trigger Next Dunning Reconciliation', icon: 'RefreshCw' }
    ]
  },
  {
    id: 'REC-2026-881',
    ownerEmail: 'sarah.vance@apexflow.io',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    dateLogged: '2026-08-28',
    category: 'Contract Tier Discrepancy',
    vendor: 'Datadog Enterprise Cloud',
    amountInitial: 9120,
    amountRecovered: 8420,
    currency: 'USD',
    status: 'Reclaimed',
    causeAnalysis: 'Invoiced for 240 host-agents at $38/host standard catalog pricing instead of contracted tiered volume rate of $24/host under Enterprise Master Service Agreement Clause 4b.',
    metaValues: {
      invoiceId: 'INV-2026-DD-8819',
      ledgerTxn: 'TXN-ACH-994012',
      confidenceScore: 98,
      slaSection: 'MSA §4b: Volume Tier 3 Pricing ($24.00 net)',
      gateway: 'Direct ACH Wire',
      detectionLatency: '42ms'
    },
    pastCommunications: [
      {
        id: 'COMM-01',
        type: 'email',
        timestamp: '2026-08-28 14:15 UTC',
        recipient: 'billing-disputes@datadoghq.com',
        subject: 'Discrepancy Notice & Immediate Credit Request: Inv #INV-2026-DD-8819 under MSA Clause 4b',
        preview: 'Formal demand citing Section 4b: Volume Tiers. Identified $3,360 current + $5,060 retroactive overcharge.',
        status: 'Delivered & Opened',
        tone: 'Firm Contractual'
      },
      {
        id: 'COMM-02',
        type: 'whatsapp',
        timestamp: '2026-08-29 09:30 UTC',
        recipient: '+1 (415) XXXXX-XX21',
        preview: '[URGENT] ApexFlow Notice: Billed $9,120.00 vs contracted $5,760.00. Total credit claimed: $8,420.00.',
        status: 'Read Receipt Confirmed',
        tone: 'Automated Instant Alert'
      }
    ],
    recommendedActions: [
      { id: 'act-1', label: 'Export Cryptographic Signed Audit Package (PDF)', icon: 'FileText' },
      { id: 'act-2', label: 'Lock Future Tier Price Ceiling in QuickBooks', icon: 'Lock' },
      { id: 'act-3', label: 'Trigger Next Reconciliation Cycle', icon: 'RefreshCw' }
    ]
  },
  {
    id: 'REC-2026-794',
    ownerEmail: 'treasury@globalaid.org',
    entityName: 'Global Aid & Climate Initiative',
    entityType: 'Organization',
    dateLogged: '2026-08-25',
    category: '3DS Biometric Escrow Dispute',
    vendor: 'Visa Europe / Cybersource Settlement',
    amountInitial: 4200,
    amountRecovered: 4200,
    currency: 'EUR',
    status: 'Reclaimed',
    causeAnalysis: 'Fraud code 10.4 chargeback wrongfully initiated on recurring grant allocation. Full biometric 3D-Secure v2.2 trace submitted, forcing unconditional liability shift under Visa Core Rules §11.1.4.',
    metaValues: {
      invoiceId: 'DONATION-REC-4982',
      ledgerTxn: 'CYBER-DISPUTE-88319',
      confidenceScore: 95,
      slaSection: 'Visa Core Rules 2026 §11.1.4: 3DS Merchant Liability Shift',
      gateway: 'Cybersource Gateway',
      detectionLatency: '110ms'
    },
    pastCommunications: [
      {
        id: 'COMM-03',
        type: 'email',
        timestamp: '2026-08-25 16:40 UTC',
        recipient: 'chargeback-evidence@cybersource.com',
        subject: 'Formal Dispute Rebuttal: Case #CYBER-DISPUTE-88319 - Complete 3DS Authentication Proof',
        preview: 'Submitted CAVV/ECI Code 05 proof and Zurich donor IP geolocation trace.',
        status: 'Arbitration Won',
        tone: 'Formal Legal'
      }
    ],
    recommendedActions: [
      { id: 'act-4', label: 'Deposit Reclaimed Escrow to Operating Treasury', icon: 'ArrowDownRight' },
      { id: 'act-5', label: 'Update Donors Fraud Protection White-list', icon: 'ShieldCheck' }
    ]
  },
  {
    id: 'REC-2026-642',
    ownerEmail: 'alex.rivera@cloudconsult.com',
    entityName: 'Alex Rivera Consulting',
    entityType: 'Individual',
    dateLogged: '2026-08-22',
    category: 'Cross-Border TDS / Withholding Mismatch',
    vendor: 'Fintech Mobile App Client (Germany)',
    amountInitial: 1850,
    amountRecovered: 1665,
    currency: 'USD',
    status: 'Reclaimed',
    causeAnalysis: 'Foreign client erroneously withheld 20% statutory German contractor tax instead of 2% standard treaty rate specified in US-EU DTAA Form 8802 filed in January.',
    metaValues: {
      invoiceId: 'INV-ALX-2026-08',
      ledgerTxn: 'SWIFT-WIRE-889124',
      confidenceScore: 99,
      slaSection: 'IRS / DTAA Treaty Article 12: Independent Personal Services Cap (2%)',
      gateway: 'SWIFT Wire Remittance',
      detectionLatency: '65ms'
    },
    pastCommunications: [
      {
        id: 'COMM-04',
        type: 'email',
        timestamp: '2026-08-22 11:20 UTC',
        recipient: 'disbursements@client-corp.de',
        subject: 'Tax Withholding Correction - Invoice #INV-ALX-2026-08 (DTAA Form 8802 Attached)',
        preview: 'Certified residency form 8802 submitted with demand for $1,665 refund.',
        status: 'Acknowledged & Refund Wire Queued',
        tone: 'Polite Collaborative'
      }
    ],
    recommendedActions: [
      { id: 'act-6', label: 'Download Verified Treaty Withholding Certificate', icon: 'Download' },
      { id: 'act-7', label: 'Auto-Apply 2% Rule to Future German Client Invoices', icon: 'Zap' }
    ]
  },
  {
    id: 'REC-2026-519',
    ownerEmail: 'sarah.vance@apexflow.io',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    dateLogged: '2026-08-19',
    category: 'Shadow SaaS Ghost Seat Allocation',
    vendor: 'Figma Enterprise Organization',
    amountInitial: 2180,
    amountRecovered: 2180,
    currency: 'USD',
    status: 'Reclaimed',
    causeAnalysis: '12 decommissioned employee accounts remained billed as active licenses for 90 days with zero login activity in Okta IdP directory. Executed prorated credit claim under §5.3.',
    metaValues: {
      invoiceId: 'FIG-INV-99218',
      ledgerTxn: 'CARD-CORP-4881',
      confidenceScore: 96,
      slaSection: 'Figma Enterprise Terms §5.3: Pro-rated unassigned seat credit policy',
      gateway: 'Corporate Amex Card',
      detectionLatency: '82ms'
    },
    pastCommunications: [
      {
        id: 'COMM-05',
        type: 'email',
        timestamp: '2026-08-19 15:00 UTC',
        recipient: 'support@figma.com',
        subject: 'Seat Optimization & Credit Request - Figma Org Workspace #49120',
        preview: 'Automated de-provisioning request for 12 inactive seats with $2,180.00 credit allocation.',
        status: 'Credit Note Issued ($2,180.00)',
        tone: 'Assertive Technical'
      }
    ],
    recommendedActions: [
      { id: 'act-8', label: 'Enable Automatic SCIM Okta License De-provisioning', icon: 'Bot' },
      { id: 'act-9', label: 'Archive Incident Log into Financial Audit File', icon: 'FileCheck' }
    ]
  },
  {
    id: 'REC-2026-402',
    ownerEmail: 'treasury@globalaid.org',
    entityName: 'Starlight Medical Foundation',
    entityType: 'Organization',
    dateLogged: '2026-08-15',
    category: 'Failed Grant Dunning & Card Expiration',
    vendor: 'Stripe Invoicing / Donor Treasury',
    amountInitial: 14500,
    amountRecovered: 14500,
    currency: 'USD',
    status: 'Reclaimed',
    causeAnalysis: 'Corporate grant renewal card failed with authorization limit code. Cohort model rescheduled retry to Tuesday 10:15 AM EST when corporate treasury balance swept in.',
    metaValues: {
      invoiceId: 'STRIPE-IN-49204',
      ledgerTxn: 'CHG-992014-DECLINED',
      confidenceScore: 94,
      slaSection: 'Customer Master Terms §8: 30-Day Cure Window & Intelligent Retry',
      gateway: 'Stripe Payments',
      detectionLatency: '90ms'
    },
    pastCommunications: [
      {
        id: 'COMM-06',
        type: 'email',
        timestamp: '2026-08-15 13:45 UTC',
        recipient: 'ap-payments@northstarfin.com',
        subject: 'Action Required: Update Enterprise Payment Method for Invoice #STRIPE-IN-49204',
        preview: 'Secure tokenized PCI payment update link dispatched.',
        status: 'Payment Succeeded via Optimal Dunning Schedule',
        tone: 'Professional Firm'
      }
    ],
    recommendedActions: [
      { id: 'act-10', label: 'Sync Receipt into NetSuite ERP General Ledger', icon: 'CheckCircle2' }
    ]
  },
  {
    id: 'REC-2026-388',
    ownerEmail: 'sarah.vance@apexflow.io',
    entityName: 'BioTech Genomics Inc.',
    entityType: 'Business',
    dateLogged: '2026-08-11',
    category: 'Cloud Storage Overbilling & Orphan Volume',
    vendor: 'AWS Cloud Services',
    amountInitial: 11400,
    amountRecovered: 9800,
    currency: 'USD',
    status: 'Reclaimed',
    causeAnalysis: '24 unattached provisioned IOPS EBS volumes running in idle cluster environment. Automated terraform clawback hook released volumes and submitted SLA credit claim.',
    metaValues: {
      invoiceId: 'AWS-INV-99410-AUG',
      ledgerTxn: 'AWS-DIRECT-DEBIT-901',
      confidenceScore: 97,
      slaSection: 'AWS Enterprise Support SLA §3.2: Orphan Resource Credit Policy',
      gateway: 'Corporate ACH',
      detectionLatency: '35ms'
    },
    pastCommunications: [
      {
        id: 'COMM-07',
        type: 'email',
        timestamp: '2026-08-11 18:10 UTC',
        recipient: 'aws-support@amazon.com',
        subject: 'Case #89201: Billing adjustment for decommissioned compute cluster EBS volumes',
        preview: 'Submitted cloudwatch log metrics demonstrating zero IOPS across 45 days.',
        status: 'AWS Credit Memo Approved ($9,800.00)',
        tone: 'Assertive Technical'
      }
    ],
    recommendedActions: [
      { id: 'act-11', label: 'Deploy Real-Time EBS Idle Termination Lambda', icon: 'Zap' }
    ]
  },
  {
    id: 'REC-2026-210',
    ownerEmail: 'alex.rivera@cloudconsult.com',
    entityName: 'Vikram Mehta Advisory',
    entityType: 'Individual',
    dateLogged: '2026-08-04',
    category: 'Uncollected Retainer SLA Breach',
    vendor: 'US Venture Incubator Client',
    amountInitial: 3600,
    amountRecovered: 3600,
    currency: 'USD',
    status: 'Reclaimed',
    causeAnalysis: 'Milestone delivery accepted 18 days past due without payment. Consulting clause 3a deemed delivery approved. Dispatched automated demand notice resulting in same-day ACH wire.',
    metaValues: {
      invoiceId: 'RET-MILESTONE-04',
      ledgerTxn: 'PENDING-AR-04',
      confidenceScore: 99,
      slaSection: 'Consulting Agreement §3a: Deemed Acceptance & Immediate Net-10 Remittance',
      gateway: 'Direct ACH',
      detectionLatency: '50ms'
    },
    pastCommunications: [
      {
        id: 'COMM-08',
        type: 'email',
        timestamp: '2026-08-04 10:00 UTC',
        recipient: 'accounting@fintechstartup.io',
        subject: 'Milestone 4 Completion Notice & Invoice #RET-MILESTONE-04',
        preview: 'Submitted GitHub PR merge proof with notice of deemed acceptance.',
        status: 'ACH Wire Cleared ($3,600.00)',
        tone: 'Professional Collaborative'
      }
    ],
    recommendedActions: [
      { id: 'act-12', label: 'Log Tax Receipt under Schedule C Consulting Income', icon: 'FileCheck' }
    ]
  }
];

export const INITIAL_PAYMENT_LEDGER = [
  {
    id: 'PAY-6358',
    recordId: 'REC-2026-635',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    vendor: 'Datadog Enterprise Cloud',
    invoiceId: 'INV-2026-DD-6358',
    amount: 6358,
    recoveredAmount: 6358,
    currency: 'USD',
    dateCreated: '2026-08-30 11:00:00 UTC',
    executionTimestamp: 'Pending SLA Settlement',
    statusStep: 'escalated', // 'ingestion' | 'disputed' | 'escalated' | 'recovered'
    cancellationFlag: false,
    cancellationReason: null,
    penaltyCharges: [
      {
        id: 'PEN-6358-A',
        reason: '10% Contractual Breach Late Processing Penalty (Clause 8.2)',
        fee: 635.80,
        dateLevied: '2026-08-31 14:00 UTC',
        status: 'Added to Dispute Arbitration'
      }
    ],
    outboundChannel: 'email',
    contactTarget: 'billing-disputes@datadoghq.com',
    milestoneHistory: [
      { step: 'ingestion', timestamp: '2026-08-30 11:00:00 UTC', note: 'Telemetry vector ingested for Datadog ($6,358.00 base)' },
      { step: 'disputed', timestamp: '2026-08-30 12:30:00 UTC', note: 'Variance formally challenged under Master Service Agreement' },
      { step: 'escalated', timestamp: '2026-08-31 14:00:00 UTC', note: '10% late processing fee ($635.80) added to active dispute arbitration' }
    ]
  },
  {
    id: 'PAY-8921',
    recordId: 'REC-2026-881',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    vendor: 'Datadog Enterprise Cloud',
    invoiceId: 'INV-2026-DD-8819',
    amount: 9120,
    recoveredAmount: 8420,
    currency: 'USD',
    dateCreated: '2026-08-28 14:15:00 UTC',
    executionTimestamp: '2026-08-28 14:32:10 UTC',
    statusStep: 'recovered', // 'ingestion' | 'disputed' | 'escalated' | 'recovered'
    cancellationFlag: false,
    cancellationReason: null,
    penaltyCharges: [
      {
        id: 'PEN-881-A',
        reason: 'Vendor Late Settlement SLA Breach (MSA §4.2 > 14d delay)',
        fee: 450,
        dateLevied: '2026-08-29 10:00 UTC',
        status: 'Settled to Escrow'
      }
    ],
    outboundChannel: 'email',
    contactTarget: 'billing-disputes@datadoghq.com',
    milestoneHistory: [
      { step: 'ingestion', timestamp: '2026-08-28 14:15:00 UTC', note: 'Telemetry vector ingested via QuickBooks API' },
      { step: 'disputed', timestamp: '2026-08-28 14:22:30 UTC', note: '36.8% volume tier variance formally challenged' },
      { step: 'escalated', timestamp: '2026-08-29 09:10:15 UTC', note: 'Legal SLA penalty clause 4.2 applied (+ $450.00)' },
      { step: 'recovered', timestamp: '2026-08-30 16:45:00 UTC', note: 'Credit memo issued and settled to escrow' }
    ]
  },
  {
    id: 'PAY-7940',
    recordId: 'REC-2026-794',
    entityName: 'Global Aid & Climate Initiative',
    entityType: 'Organization',
    vendor: 'Visa Europe / Cybersource Settlement',
    invoiceId: 'DONATION-REC-4982',
    amount: 4200,
    recoveredAmount: 4200,
    currency: 'EUR',
    dateCreated: '2026-08-25 11:20:00 UTC',
    executionTimestamp: '2026-08-25 16:40:00 UTC',
    statusStep: 'escalated',
    cancellationFlag: false,
    cancellationReason: null,
    penaltyCharges: [
      {
        id: 'PEN-794-B',
        reason: 'Merchant Gateway False Chargeback Filing Surcharge',
        fee: 320,
        dateLevied: '2026-08-26 14:15 UTC',
        status: 'Under Arbitration'
      }
    ],
    outboundChannel: 'whatsapp',
    contactTarget: '+41 79 XXXXX-XX82',
    milestoneHistory: [
      { step: 'ingestion', timestamp: '2026-08-25 11:20:00 UTC', note: 'Chargeback webhook parsed from Cybersource' },
      { step: 'disputed', timestamp: '2026-08-25 16:40:00 UTC', note: 'Full biometric 3DS v2.2 evidence submitted' },
      { step: 'escalated', timestamp: '2026-08-26 14:15:00 UTC', note: 'Arbitration surcharge invoked under Visa Rules §11.1.4' }
    ]
  },
  {
    id: 'PAY-6421',
    recordId: 'REC-2026-642',
    entityName: 'Alex Rivera Consulting',
    entityType: 'Individual',
    vendor: 'Fintech Mobile App Client (Germany)',
    invoiceId: 'INV-ALX-2026-08',
    amount: 1850,
    recoveredAmount: 1665,
    currency: 'USD',
    dateCreated: '2026-08-22 09:00:00 UTC',
    executionTimestamp: '2026-08-22 11:20:00 UTC',
    statusStep: 'disputed',
    cancellationFlag: false,
    cancellationReason: null,
    penaltyCharges: [
      {
        id: 'PEN-642-C',
        reason: 'Statutory Tax Remittance Delay Fee (DTAA Treaty Art 12)',
        fee: 95,
        dateLevied: '2026-08-23 08:30 UTC',
        status: 'Pending Remittance'
      }
    ],
    outboundChannel: 'email',
    contactTarget: 'disbursements@client-corp.de',
    milestoneHistory: [
      { step: 'ingestion', timestamp: '2026-08-22 09:00:00 UTC', note: 'SWIFT wire advice parsed with 20% withholding' },
      { step: 'disputed', timestamp: '2026-08-22 11:20:00 UTC', note: 'Form 8802 filed requesting 18% statutory rebate' }
    ]
  },
  {
    id: 'PAY-5109',
    recordId: 'REC-2026-519',
    entityName: 'ApexFlow Technologies Inc.',
    entityType: 'Business',
    vendor: 'Snowflake Cloud Data Warehouse',
    invoiceId: 'SNOW-INV-2026-8812',
    amount: 12450,
    recoveredAmount: 11205,
    currency: 'USD',
    dateCreated: '2026-09-02 10:14:00 UTC',
    executionTimestamp: '2026-09-02 10:45:00 UTC',
    statusStep: 'ingestion',
    cancellationFlag: false,
    cancellationReason: null,
    penaltyCharges: [],
    outboundChannel: 'email',
    contactTarget: 'enterprise-billing@snowflake.com',
    milestoneHistory: [
      { step: 'ingestion', timestamp: '2026-09-02 10:14:00 UTC', note: 'Scanned compute multiplier contract tier discrepancy' }
    ]
  }
];

