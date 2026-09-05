# AegisRecover | Autonomous AI Revenue & Capital Recovery Engine

[![Live Demo](https://img.shields.io/badge/Live%20Demo-aegis--recovery.vercel.app-10b981?style=for-the-badge&logo=vercel&logoColor=white)](https://aegis-recovery.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Nikilshibu%2Faegis--recovery-0ea5e9?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nikilshibu/aegis-recovery)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-amber?style=for-the-badge)](LICENSE)

---

## 🌐 Live Deployment

| Resource | URL |
| :--- | :--- |
| **🚀 Production URL** | **[https://aegis-recovery.vercel.app](https://aegis-recovery.vercel.app)** |
| **📦 GitHub Repository** | **[https://github.com/Nikilshibu/aegis-recovery](https://github.com/Nikilshibu/aegis-recovery)** |
| **⚡ Status** | **Operational • High-Availability Global CDN** |

---

## 🛡️ Executive Overview

**AegisRecover** is an enterprise-grade autonomous capital and revenue recovery platform engineered for high-velocity finance, procurement, and billing operations. It proactively identifies revenue leakage, automates dispute resolution workflows, audits contract SLA variances, and securely recovers stranded capital with cryptographic auditability.

Designed with a sovereign zero-trust architecture, AegisRecover integrates real-time PII anonymization, automated communications via Resend, and configurable monetary threshold boundaries.

---

## 🚀 Key Features

### 1. 📊 Executive Scoreboard & Capital Recovery Telemetry
* **Live Ingestion & Recovery Tracking**: Real-time monitoring of total recovered capital, active leakage items, and contingency fee reconciliation.
* **Granular Status Breakdown**: Filter and inspect records across *Active Monitoring*, *Under Review*, *Recovered*, and *Escrow Hold*.
* **Interactive Metric Cards**: High-impact financial visualizations detailing net recovery ratios and annualized leakage mitigation.

### 2. ⚡ Adaptive Ingestion Engine
* **Multimodal Ledger Ingestion**: Real-time batch and stream parsing for ERP ledgers, corporate card charges, and SaaS invoices.
* **Automated Discrepancy Diagnostics**: AI-driven detection of duplicate charges, unapplied credit memos, contract clause compute multipliers, and expired contract pricing.

### 3. 📈 Predictive Demand & Expiration Runway
* **Volatility Modeling**: Interactive scenario simulations across Baseline, Aggressive, and Conservative market regimes.
* **Proactive Renewal Radar**: Detects upcoming corporate card expirations and vendor SLA renewal deadlines prior to revenue disruption.

### 4. ⚖️ Decision Hub & Historical Recovery Ledger
* **Peer Consensus & Dispute Arbitration**: Streamlined approval flows for billing dispute acceptances, counter-offers, and legal escrow hold escalations.
* **Audit Trail Exporter**: One-click immutable CSV export with SHA-256 integrity verification hashes.

### 5. 💳 Payments & Billing Terminal
* **Contingency Fee Accounting**: Automated contingency calculations (e.g. 8.5% fee on net recovered funds).
* **Automated Notification Dispatch**: Integrated with the **Resend API** to dispatch cryptographic verification notices, milestone updates, and SLA penalty reminders.

### 6. 🔒 Enterprise Security & PII Protection
* **Automatic PII Masking Engine**: One-click toggling between raw and pseudonymized view for vendor emails, tax IDs, and sensitive bank accounts.
* **Monetary Threshold Guardrails**: User-defined execution limits—actions exceeding the threshold require executive dual-authorization.
* **Compliance Standards Alignment**: Built to comply with SOC 2 Type II, ISO 27001, DPDP 2023, and GDPR Article 32 guidelines.

---

## 🛠️ Technology Stack

* **Frontend Framework**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
* **Styling & Layout**: [Tailwind CSS 3](https://tailwindcss.com/) with curated dark-mode glassmorphic aesthetics
* **Icons & Visuals**: [Lucide React](https://lucide.dev/)
* **Cloud & Serverless Backend**: Vercel Serverless Functions (`/api/*`)
* **Email & Notifications**: [Resend REST API](https://resend.com/)
* **Database & Enclave Layer**: Sovereign client ledger with optional [Supabase](https://supabase.com/) integration

---

## 📂 Project Structure

```bash
aegis-recovery/
├── api/
│   └── index.js                   # Vercel Serverless Function API Router
├── src/
│   ├── components/
│   │   ├── auth/                  # Gateway login & multi-factor verification
│   │   ├── common/                # Sidebar, modals, compliance certs, error boundaries
│   │   ├── dashboard/             # Scoreboard, runway, historical records, decision hub
│   │   ├── ingestion/             # Adaptive stream ingestion engine
│   │   ├── payments/              # Contingency fee accounting & billing terminal
│   │   └── support/               # AI customer support & billing arbitration
│   ├── context/
│   │   └── AppContext.jsx         # Global state, audit logging, and PII masking engine
│   ├── data/
│   │   └── mockData.js            # Initialized enterprise telemetry & recovery fixtures
│   ├── server/
│   │   ├── emailTemplates.js      # Responsive HTML notification templates
│   │   └── resendEndpoints.js     # Resend REST API route logic
│   ├── services/
│   │   └── notificationService.js # Client-side notification dispatch service
│   ├── App.jsx                    # Root application component & routing
│   ├── main.jsx                   # React DOM mount point
│   ├── index.css                  # Tailwind styles and custom utilities
│   └── supabaseClient.js          # Sovereign ledger client configuration
├── .env.example                   # Environment variable template
├── .gitignore                     # Git exclusions
├── index.html                     # HTML5 entry with preconnected Google fonts
├── package.json                   # Project dependencies and npm scripts
├── tailwind.config.js             # Custom Tailwind color tokens and animations
├── vercel.json                    # Vercel deployment and SPA rewrite rules
└── vite.config.js                 # Vite bundler configuration & local API middleware
```

---

## ⚙️ Local Development Setup

### 1. Prerequisites
* **Node.js**: v18.0 or higher
* **npm**: v9.0 or higher

### 2. Clone the Repository
```bash
git clone https://github.com/Nikilshibu/aegis-recovery.git
cd aegis-recovery
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your optional API keys (the app includes full offline mock fallbacks if keys are omitted):
```env
RESEND_API_KEY=your_resend_api_key_here
RESEND_DEFAULT_FROM=AegisRecover Sentinel <onboarding@resend.dev>
```

### 5. Launch the Development Server
```bash
npm run dev
```
Open your browser at **`http://localhost:3000`**.

---

## 🚢 Production Build & Deployment

### Build Locally
To create an optimized production build:
```bash
npm run build
```
The compiled static assets and bundles will be generated in the `dist/` directory.

### Deploy to Vercel
This repository is pre-configured with [vercel.json](vercel.json) for instantaneous deployment:

1. Import **[https://github.com/Nikilshibu/aegis-recovery](https://github.com/Nikilshibu/aegis-recovery)** on [Vercel](https://vercel.com/new).
2. Accept the auto-detected **Vite** preset.
3. Add any environment variables (`RESEND_API_KEY`) under **Settings > Environment Variables**.
4. Click **Deploy**.

---

## 🔒 Security & Privacy

* **Zero-Knowledge Architecture**: Financial ledgers and PII are masked prior to client presentation.
* **Environment Protection**: Secrets and production credentials are never committed to version control.
* **Sanitized Communications**: Outbound notifications are routed through cryptographically verified sender domains with SPF/DKIM alignment.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
