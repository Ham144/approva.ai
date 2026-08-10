# Detailed Codebase & ROI Exporter Survey Analysis

**Project**: Approva.ai Frontend Optimization  
**Date**: 2026-08-10  
**Investigator**: Explorer 1 (Codebase & ROI Exporter Explorer)  
**Target Root**: `C:\Users\USER\.gemini\antigravity\scratch\approva.ai`

---

## Executive Summary

The Approva.ai project is an Enterprise Dynamic E-Form & Approval Control Platform targeted at BUMN, holding groups, and corporate enterprises. The frontend codebase is built with **Vite 5.4**, **React 18.3**, **Tailwind CSS 3.4**, **DaisyUI 4.12**, **Zustand 5**, **React Router 6**, and **jsPDF 3.0 / jspdf-autotable 5.0**.

The main entry point for prospective clients is `src/pages/LandingPage.jsx` (68 KB, 1,266 lines), which contains an interactive **Financial Efficiency & ROI Calculator** (`#roi-calculator`). Currently, the ROI Calculator computes live IDR savings and Managerial Hours savings based on employee count and approval delay sliders, but **lacks a print/export mechanism** (Requirement R1).

This analysis provides a comprehensive survey of:
1. Overall project structure, dependencies, and configuration.
2. ROI Calculator state, formulas, and financial calculation logic.
3. Architecture and specification for adding the "Print/Export Financial Statement PDF" feature using `window.print()` and `jsPDF`.
4. Build scripts, linting, and testing setups.

---

## 1. Overall Project Structure

### 1.1 Environment & Directory Layout
```
approva.ai/
├── .agents/                        # Agent working directories (metadata only)
│   ├── orchestrator/
│   └── teamwork_preview_explorer_survey_1/
├── backend/                        # Backend Node.js / API service
└── frontend/                       # React + Vite Single Page Application (SPA)
    ├── dist/                       # Production build output folder
    ├── public/                     # Static public assets (logo.png, etc.)
    ├── src/
    │   ├── api/                    # API services & constants (constant.js, etc.)
    │   ├── components/             # Reusable UI components & modals
    │   │   └── hooks/              # Custom hooks (e.g. printtPdfHook.jsx)
    │   ├── lib/                    # Library utilities (utils.js with cn helper)
    │   ├── pages/                  # Route view components (LandingPage.jsx, Login.jsx, etc.)
    │   ├── utils/                  # Formatting utilities (formatCurrency.js, formatRupiah.js)
    │   ├── App.jsx                 # Application layout wrapper with Toaster & Navigation
    │   ├── main.jsx                # Entry file & React Router configuration
    │   ├── store.js                # Zustand global state store
    │   └── index.css               # Global Tailwind CSS styles
    ├── build-production.sh         # Shell script for production build
    ├── components.json             # Shadcn / UI configuration
    ├── eslint.config.js            # ESLint flat configuration
    ├── index.html                  # HTML template
    ├── package.json                # Project dependencies and npm scripts
    ├── postcss.config.js           # PostCSS configuration
    ├── tailwind.config.js          # Tailwind CSS theme configuration
    └── vite.config.js              # Vite bundler configuration & manual chunks setup
```

### 1.2 Tech Stack & Key Dependencies (`frontend/package.json`)
* **Framework**: React 18.3.1 (JavaScript / JSX format)
* **Build Tool**: Vite 5.4.1 (`@vitejs/plugin-react`)
* **Styling**: Tailwind CSS 3.4.10, DaisyUI 4.12.10, Autoprefixer 10.4.20, PostCSS 8.4.45
* **UI Components & Icons**:
  * `lucide-react` (v0.471.2): Lucide icon set (Sparkles, Calendar, DollarSign, Clock, FileText, Printer, CheckCircle2, etc.)
  * `@tabler/icons-react` (v3.34.1): Tabler icons
  * `antd` (v5.27.0): Ant Design UI components
  * `motion` (v12.23.12): Framer Motion animation framework
  * `recharts` (v3.7.0): Charting library
* **State & Routing**:
  * `react-router-dom` (v6.26.1): Client-side routing (`createBrowserRouter`, `createRoutesFromElements`)
  * `zustand` (v5.0.3): State management (`store.js`)
  * `@tanstack/react-query` (v5.63.0): Async data fetching
* **Exporting & PDF Utilities**:
  * `jspdf` (v3.0.1): Client-side PDF generation
  * `jspdf-autotable` (v5.0.2): Table plugin for jsPDF
* **Feedback & Helpers**:
  * `react-hot-toast` (v2.5.1): Toast notifications (`Toaster` rendered at top-center in `App.jsx`)
  * `clsx` (v2.1.1) & `tailwind-merge` (v3.31.1): Class name utility helper `cn(...)` in `src/lib/utils.js`

### 1.3 Routing Architecture (`src/main.jsx`)
* Index route `/` renders `LandingPage` component (`src/pages/LandingPage.jsx`).
* `/login` renders `Login`.
* Authenticated app routes wrapped under `<LevelWrapper />` (`/home`, `/request`, `/process`, `/management/*`, `/superadmin/*`).

---

## 2. ROI Calculator Component & Financial Calculation Logic

### 2.1 Component Location & Structure
* **File**: `src/pages/LandingPage.jsx`
* **Section Tag**: `<section id="roi-calculator" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto text-left">` (Lines 912–986)

### 2.2 State Variables
```javascript
const [employeeCount, setEmployeeCount] = useState(85);         // Slider: 20 - 500 (step 5)
const [avgApprovalTimeDays, setAvgApprovalTimeDays] = useState(5); // Slider: 1 - 14 (step 1)
```

### 2.3 Financial Savings Formulas
```javascript
const hourlyCost = 85000;                                             // IDR 85,000 / hour (Managerial hourly cost benchmark)
const monthlyApprovalCount = Math.round(employeeCount * 1.8);        // Submissions count per month
const hoursSavedPerApproval = avgApprovalTimeDays * 1.5;              // Hours saved per approval transaction
const monthlySavingsRp = Math.round(
  monthlyApprovalCount * hoursSavedPerApproval * (hourlyCost * 0.4)
);                                                                    // Monthly Financial Savings in IDR
const totalHoursSaved = Math.round(monthlyApprovalCount * hoursSavedPerApproval); // Managerial Hours saved per month
const annualSavingsRp = monthlySavingsRp * 12;                        // Annualized Savings in IDR
```

### 2.4 Breakdown of Financial Metric Outputs
1. **Total Employee / User Count (`employeeCount`)**: Represents total organizational users submitting or approving e-forms.
2. **Current Manual Approval Duration (`avgApprovalTimeDays`)**: Represents current latency of manual physical/paper approval processes.
3. **Estimated Monthly Submissions (`monthlyApprovalCount`)**: Calculated as `employeeCount * 1.8`.
4. **Managerial Hours Saved (`totalHoursSaved`)**: Calculated as `monthlyApprovalCount * avgApprovalTimeDays * 1.5`.
5. **Monthly IDR Savings (`monthlySavingsRp`)**: Direct financial savings from reduced managerial approval delays and administrative labor.
6. **Annualized IDR Savings (`annualSavingsRp`)**: Projection over 12 months (`monthlySavingsRp * 12`).

---

## 3. Print / Export PDF Implementation Plan (Requirement R1)

### 3.1 Gaps Identified
* Section `#roi-calculator` currently displays the input sliders and monthly savings summary cards, but has **no action button** to export or print the ROI report.
* Prospective clients need a formal document ("Laporan Estimasi Efisiensi Finansial & ROI Approva.ai") that can be downloaded as PDF or printed for internal procurement proposals.

### 3.2 Design & Component Specification for ROI Exporter

#### A. Target Location for Export Button
In `LandingPage.jsx`, inside the ROI Calculator Card (`#roi-calculator`), place an Enterprise Export Button beneath or beside the savings display:
```jsx
<div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div className="text-xs text-slate-400">
    <span className="text-emerald-400 font-bold">✓ Report Verified:</span> Formal Financial Estimate
  </div>
  <button
    onClick={() => setIsRoiPdfModalOpen(true)}
    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-slate-950 font-extrabold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
  >
    <FileText className="w-4 h-4" />
    <span>Cetak / Ekspor Laporan Finansial (PDF)</span>
  </button>
</div>
```

#### B. Dual Export Strategy: Interactive Modal Document + `window.print()` + Direct `jsPDF` Download
1. **Formatted Document Modal Layout (`RoiStatementModal`)**:
   * Official header: "Approva.ai Enterprise Financial Statement & ROI Projection Report"
   * Document metadata: Report ID (`APPROVA-ROI-2026-${Date.now().toString(36).toUpperCase()}`), Date of issue, Confidentiality tag ("CONFIDENTIAL - FOR INTERNAL PROCURMENT USE ONLY").
   * Parameter Inputs Summary: Company Size, Baseline Manual Latency, Hourly Rate Benchmark (Rp 85.000).
   * Summary Financial Table:
     * Bulanan (Monthly IDR Savings)
     * Tahunan (Annual IDR Savings)
     * Jam Manajerial Terhemat (Managerial Hours Saved)
     * Volume Pengajuan (Monthly Submissions Volume)
   * On-Premise ROI Comparison vs Cloud SaaS Subscriptions (demonstrating Perpetual Buyout advantage).
   * Official SHA-256 Digital Verification Stamp & Seal footer.
2. **Printing & Exporting Handlers**:
   * **`window.print()` Handler**: Triggers browser print dialog with print-formatted document styling (using clean printable modal container and `@media print` CSS rules).
   * **Direct `jsPDF` Download Handler**: Uses `jsPDF` (3.0.1) + `jspdf-autotable` (5.0.2) to generate `Laporan_Efisiensi_Finansial_Approva_AI.pdf` containing clean headers, summary tables, and official watermark seal.

---

## 4. Existing Build Scripts and Test Setups

### 4.1 Build Configuration & Scripts
* `package.json` scripts:
  * `npm run dev`: Runs Vite development server (`vite`)
  * `npm run build`: Runs production bundle build (`vite build`)
  * `npm run lint`: Runs ESLint validation (`eslint .`)
  * `npm run preview`: Previews built production bundle (`vite preview`)
* `vite.config.js`:
  * Configures chunk splitting for vendor libraries (`react`, `react-router-dom`, `zustand`, `lucide-react`, `tailwindcss`, `daisyui`).
  * Terser minification with console drop options (`drop_console: true`).
  * Assets output path: `assets/js/[name]-[hash].js`.

### 4.2 Test Setup Status
* There are currently no automated unit test suites (Jest/Vitest) configured in `package.json`.
* Quality and integrity verification relies on Vite compilation (`npm run build` / `pnpm run build`), ESLint checking, and visual runtime verification.

---

## 5. Implementation Roadmap for Next Phase (Implementer Agent)

1. **Modify `LandingPage.jsx`**:
   * Add state variable `isRoiPdfModalOpen` (boolean) and optional `customCompanyName` input state.
   * Add "Cetak / Ekspor Laporan Finansial (PDF)" button inside section `#roi-calculator`.
   * Create `RoiStatementModal` component rendered when `isRoiPdfModalOpen` is true.
2. **Implement Export Handlers**:
   * Add `handlePrintStatement` utilizing `window.print()` with CSS print utility classes (`@media print`).
   * Add `handleDownloadPdf` using `jsPDF` and `jspdf-autotable`.
3. **Verify Build**:
   * Run `pnpm run build` in `frontend/` directory to confirm zero build errors and Exit Code 0.

---
*Analysis completed by Explorer 1.*
