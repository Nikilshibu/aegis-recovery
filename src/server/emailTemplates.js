/**
 * AegisRecover Enterprise HTML Email Templates
 * Styled with modern dark theme, emerald accents, and responsive layout.
 */

// Common header wrapper
function emailLayout(content, preheaderText = '') {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>AegisRecover Security Dispatch</title>
  <style>
    body { margin: 0; padding: 0; background-color: #090d16; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 20px; }
    .card { background-color: #0f172a; border: 1px solid #1e293b; border-radius: 20px; padding: 32px; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5); }
    .header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #1e293b; }
    .logo { display: inline-block; font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; text-decoration: none; }
    .badge-emerald { display: inline-block; background-color: rgba(16, 185, 129, 0.15); border: 1px solid rgba(16, 185, 129, 0.35); color: #10b981; font-size: 11px; font-weight: 700; font-family: monospace; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
    .badge-amber { display: inline-block; background-color: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.35); color: #f59e0b; font-size: 11px; font-weight: 700; font-family: monospace; padding: 4px 10px; border-radius: 8px; text-transform: uppercase; }
    .btn-primary { display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #090d16 !important; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 28px; border-radius: 12px; margin: 20px 0; text-align: center; }
    .footer { text-align: center; padding-top: 24px; font-size: 11px; color: #64748b; font-family: monospace; }
    .meta-table { width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #0b101b; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b; }
    .meta-table td { padding: 12px 16px; font-size: 12px; font-family: monospace; border-bottom: 1px solid #1e293b; }
    .meta-table td:first-child { color: #64748b; width: 40%; }
    .meta-table td:last-child { color: #f1f5f9; font-weight: 600; }
  </style>
</head>
<body>
  ${preheaderText ? `<div style="display:none;font-size:1px;color:#090d16;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">${preheaderText}</div>` : ''}
  <div class="container">
    <div class="card">
      <div class="header">
        <div class="logo">🛡️ AegisRecover</div>
        <div style="font-size: 11px; color: #94a3b8; font-family: monospace; margin-top: 4px;">AI Revenue & Capital Recovery System</div>
      </div>
      ${content}
      <div class="footer">
        <div>SOC 2 Type II Certified • Zero-Trust RLS Enforced • DPDP 2023 Compliant</div>
        <div style="margin-top: 6px;">This cryptographic notice was generated autonomously by AegisRecover Sentinel.</div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

/**
 * 1. Welcome email on user registration
 */
export function generateWelcomeEmailHtml({ name, email, entityType = 'Business', entityName = 'ApexFlow Tech', uuid = 'usr_8491028' }) {
  const content = `
    <div style="text-align: center; padding-top: 24px;">
      <span class="badge-emerald">Registration Certified</span>
      <h1 style="font-size: 24px; font-weight: 900; color: #ffffff; margin: 16px 0 8px 0;">Welcome to AegisRecover, ${name}</h1>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0;">
        Your high-security AI Revenue & Capital Recovery profile for <strong>${entityName}</strong> (${entityType}) is now verified and fully initialized under Row Level Security.
      </p>
    </div>

    <table class="meta-table">
      <tr><td>Authenticated Entity</td><td>${entityName}</td></tr>
      <tr><td>Profile Segment</td><td>${entityType} Tier</td></tr>
      <tr><td>Assigned Security UUID</td><td><span style="color:#10b981;">${uuid}</span></td></tr>
      <tr><td>Registered Dispatch Email</td><td>${email}</td></tr>
      <tr><td>Guardrail Level</td><td>Zero-Trust Level 3 (MFA/OTP Enforced)</td></tr>
    </table>

    <div style="background-color: #0b101b; border: 1px solid #1e293b; border-radius: 12px; padding: 18px; margin-bottom: 24px;">
      <div style="font-size: 13px; font-weight: 700; color: #38bdf8; margin-bottom: 8px;">🚀 What to Expect Next:</div>
      <ul style="font-size: 12px; color: #cbd5e1; margin: 0; padding-left: 20px; line-height: 1.7;">
        <li>Automated background scanning for vendor overbilling, ghost charges, and contract tier variances.</li>
        <li>15-minute intermediate validation queue guardrail on all incoming payment disputes.</li>
        <li>Real-time stochastic demand forecasting to protect against uncollected churn.</li>
      </ul>
    </div>

    <div style="text-align: center;">
      <a href="http://localhost:3000/" class="btn-primary">Launch AegisRecover Hub →</a>
    </div>
  `;
  return emailLayout(content, `Welcome to AegisRecover. Your profile for ${entityName} is active.`);
}

/**
 * 2. Record creation notification ('inserted, waiting for confirmation from peer')
 */
export function generateRecordCreatedHtml({
  recordId = 'REC-2026-904',
  vendor = 'Snowflake Cloud Data Warehouse',
  amount = 6350,
  currency = 'USD',
  entityName = 'ApexFlow Technologies Inc.',
  invoiceId = 'SNOW-INV-2026-9041',
  details = 'Contract Clause 8.1 Compute Multiplier variance parsed from invoice scan.',
  deepLinkUrl = 'http://localhost:3000/',
  peerName = 'Snowflake Accounts Receivable'
}) {
  const content = `
    <div style="padding-top: 24px;">
      <div style="text-align: center;">
        <span class="badge-amber">Action Required: Confirmation Pending</span>
        <h1 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 16px 0 8px 0;">New Recovery Record Ingested</h1>
      </div>

      <!-- MANDATORY REQUIREMENT: Record creation notification ('inserted, waiting for confirmation from peer') -->
      <div style="background-color: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 14px; padding: 16px; margin: 20px 0; text-align: center;">
        <div style="font-size: 13px; font-weight: 800; color: #fbbf24; text-transform: uppercase; font-family: monospace;">
          Status: Inserted, waiting for confirmation from peer
        </div>
        <div style="font-size: 12px; color: #e2e8f0; margin-top: 4px;">
          Record has been placed into the 15-Minute Pending Validation Queue awaiting peer verification from <strong>${peerName}</strong>.
        </div>
      </div>

      <table class="meta-table">
        <tr><td>Record Tracking ID</td><td><span style="color:#38bdf8;">${recordId}</span></td></tr>
        <tr><td>Counterparty / Vendor</td><td>${vendor}</td></tr>
        <tr><td>Invoice / Contract ID</td><td>${invoiceId}</td></tr>
        <tr><td>Disputed Capital Volume</td><td><span style="color:#10b981; font-size:14px;">$${Number(amount).toLocaleString()} ${currency}</span></td></tr>
        <tr><td>Claimant Entity</td><td>${entityName}</td></tr>
        <tr><td>Target Peer Contact</td><td>${peerName}</td></tr>
      </table>

      <div style="background-color: #0b101b; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; margin-bottom: 20px; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
        <strong style="color: #94a3b8; display: block; margin-bottom: 4px;">Extracted Audit Evidence:</strong>
        ${details}
      </div>

      <div style="text-align: center;">
        <a href="${deepLinkUrl}" class="btn-primary">Inspect Record in Historical Ledger →</a>
      </div>
    </div>
  `;
  return emailLayout(content, `Record ${recordId} inserted, waiting for confirmation from peer.`);
}

/**
 * 3. Verification success notification
 */
export function generateVerificationSuccessHtml({
  email,
  name = 'Operator',
  entityType = 'Business',
  verifiedTimestamp = new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
  ipAddress = '198.51.100.42 (TLS 1.3 / ECH Encrypted)',
  sessionDuration = '15 Minutes'
}) {
  const content = `
    <div style="padding-top: 24px; text-align: center;">
      <span class="badge-emerald">Zero-Trust Identity Confirmed</span>
      <h1 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 16px 0 8px 0;">Two-Step Verification Successful</h1>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0;">
        Hello ${name}, your Two-Step Verification OTP token was successfully confirmed. Your session has been granted secure access to the recovery ledger.
      </p>

      <table class="meta-table" style="text-align: left;">
        <tr><td>Account Email</td><td>${email}</td></tr>
        <tr><td>Entity Authorization</td><td>${entityType} Level Authorization</td></tr>
        <tr><td>Verification Timestamp</td><td>${verifiedTimestamp}</td></tr>
        <tr><td>Network Security Trace</td><td>${ipAddress}</td></tr>
        <tr><td>Inactivity Timeout Guardrail</td><td>${sessionDuration} (Zero-Trust Active)</td></tr>
      </table>

      <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: 12px; padding: 14px; margin: 20px 0; font-size: 12px; color: #6ee7b7; text-align: left;">
        🔒 <strong>Zero-Knowledge Security Assurance:</strong> All subsequent database transactions are automatically scoped to your authenticated Supabase user UUID.
      </div>

      <div style="text-align: center;">
        <a href="http://localhost:3000/" class="btn-primary">Access Dashboard Hub →</a>
      </div>
    </div>
  `;
  return emailLayout(content, `Two-Step Verification successful for ${email}. Session established.`);
}

/**
 * 4. Scheduled reminders for pending/overdue payments with direct links and instructions
 */
export function generatePaymentReminderHtml({
  paymentId = 'PAY-8921',
  invoiceId = 'INV-2026-DD-8819',
  vendor = 'Datadog Enterprise Cloud',
  amount = 9120,
  currency = 'USD',
  dueDate = '2026-09-10',
  isOverdue = false,
  penaltyFee = 450,
  directLink = 'http://localhost:3000/',
  entityName = 'ApexFlow Technologies Inc.',
  instructions = [
    '1. Click the secure deep-link below to open the Payment Tracking & Audit Terminal.',
    '2. Review the verified contract discrepancy and the $450.00 statutory SLA breach penalty.',
    '3. Choose either [Authorize Reclaimed Escrow Wire] or [Submit Formal Arbitration Counter-Claim].',
    '4. Remittance must be completed within 48 hours to avoid compounding late settlement charges.'
  ]
}) {
  const content = `
    <div style="padding-top: 24px;">
      <div style="text-align: center;">
        <span class="${isOverdue ? 'badge-amber' : 'badge-emerald'}">
          ${isOverdue ? '⚠️ Payment Overdue & Penalty Levied' : '⏰ Scheduled Payment Reminder'}
        </span>
        <h1 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 16px 0 8px 0;">
          ${isOverdue ? 'Urgent Remittance Demand' : 'Scheduled Settlement Notice'}
        </h1>
        <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 20px 0;">
          Notice regarding Invoice <strong>#${invoiceId}</strong> for <strong>${vendor}</strong>.
        </p>
      </div>

      <table class="meta-table">
        <tr><td>Payment ID</td><td><span style="color:#38bdf8;">${paymentId}</span></td></tr>
        <tr><td>Vendor / Debtor</td><td>${vendor}</td></tr>
        <tr><td>Disputed / Recoverable Sum</td><td><span style="color:#10b981; font-size:15px;">$${Number(amount).toLocaleString()} ${currency}</span></td></tr>
        <tr><td>Scheduled Due Date</td><td><strong style="color:${isOverdue ? '#ef4444' : '#f59e0b'};">${dueDate}</strong></td></tr>
        ${penaltyFee > 0 ? `<tr><td>Statutory SLA Penalty Levied</td><td><span style="color:#ef4444;">+$${penaltyFee}.00 USD (MSA §4.2)</span></td></tr>` : ''}
        <tr><td>Beneficiary Entity</td><td>${entityName}</td></tr>
      </table>

      <!-- MANDATORY REQUIREMENT: Direct Links and Step-by-Step Instructions -->
      <div style="background-color: #0b101b; border: 1px solid #1e293b; border-radius: 14px; padding: 20px; margin: 20px 0;">
        <div style="font-size: 13px; font-weight: 800; color: #38bdf8; text-transform: uppercase; font-family: monospace; margin-bottom: 10px;">
          📋 Action Instructions:
        </div>
        <div style="font-size: 12px; color: #cbd5e1; line-height: 1.8;">
          ${Array.isArray(instructions) ? instructions.map(inst => `<div>• ${inst}</div>`).join('') : instructions}
        </div>
      </div>

      <div style="text-align: center; margin: 24px 0;">
        <a href="${directLink}" class="btn-primary" style="background: linear-gradient(135deg, #38bdf8 0%, #0284c7 100%);">
          🔗 Open Payment & Settlement Terminal →
        </a>
      </div>

      <div style="text-align: center; font-size: 11px; color: #94a3b8; font-family: monospace;">
        Direct Deep-Link Reference: <span style="color: #38bdf8;">${directLink}</span>
      </div>
    </div>
  `;
  return emailLayout(content, `Reminder: Pending payment of $${Number(amount).toLocaleString()} for ${vendor}. Review settlement instructions.`);
}

/**
 * 5. One-Time Password (OTP) verification email
 */
export function generateOtpEmailHtml({ email, otpCode }) {
  const content = `
    <div style="padding-top: 24px; text-align: center;">
      <span class="badge-emerald">Security Challenge</span>
      <h1 style="font-size: 22px; font-weight: 900; color: #ffffff; margin: 16px 0 8px 0;">
        Your One-Time Password (OTP)
      </h1>
      <p style="font-size: 14px; color: #94a3b8; line-height: 1.6; margin: 0 0 24px 0;">
        Use the verification code below to complete your login to AegisRecover. This code is valid for 10 minutes.
      </p>

      <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%); border: 2px dashed rgba(16, 185, 129, 0.4); border-radius: 16px; padding: 24px; margin: 24px 0;">
        <div style="font-size: 11px; font-family: monospace; color: #10b981; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px;">
          Verification Code
        </div>
        <div style="font-size: 38px; font-family: monospace; font-weight: 900; letter-spacing: 8px; color: #38bdf8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.3);">
          ${otpCode}
        </div>
      </div>

      <table class="meta-table">
        <tr><td>Recipient Account</td><td>${email}</td></tr>
        <tr><td>Security Standard</td><td>HMAC-SHA256 Multi-Factor Auth</td></tr>
        <tr><td>Session Type</td><td>Zero-Trust Identity Challenge</td></tr>
      </table>

      <div style="font-size: 12px; color: #64748b; line-height: 1.6; margin-top: 20px;">
        If you did not request this code, please contact security@aegisrecover.io immediately.
      </div>
    </div>
  `;
  return emailLayout(content, `Your AegisRecover verification OTP code is ${otpCode}`);
}
