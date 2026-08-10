# M1 Component & State Architecture Analysis: `RoiStatementModal.jsx`

## Executive Summary
This document provides the complete architecture design for `frontend/src/components/RoiStatementModal.jsx`, a core component of **Milestone M1 (ROI Financial Exporter)** for Approva.ai. The component enables prospective enterprise clients to preview, customize, print (`window.print()`), and export (PDF via `jsPDF` and `jspdf-autotable`) an executive financial savings report derived from the live ROI calculator in `LandingPage.jsx`.

---

## 1. Existing System Analysis

### 1.1 `LandingPage.jsx` ROI Calculator Analysis (Lines 96–106 & 912–986)
- **State & Inputs** (Lines 96–98):
  - `employeeCount` (number, default: `85`): User count controlled by range slider (range: 20 – 500, step: 5).
  - `avgApprovalTimeDays` (number, default: `5`): Turnaround time in business days controlled by range slider (range: 1 – 14, step: 1).
- **Calculated Variables** (Lines 100–105):
  - `hourlyCost` = `85000` (IDR)
  - `monthlyApprovalCount` = `Math.round(employeeCount * 1.8)`
  - `hoursSavedPerApproval` = `avgApprovalTimeDays * 1.5`
  - `monthlySavingsRp` = `Math.round(monthlyApprovalCount * hoursSavedPerApproval * (hourlyCost * 0.4))`
- **Display Components** (Lines 962–985):
  - Primary metric: `monthlySavingsRp` formatted as `Rp ${monthlySavingsRp.toLocaleString("id-ID")}` / month.
  - Secondary metrics:
    - Monthly document volume (`monthlyApprovalCount` Berkas).
    - Monthly managerial hours saved (`Math.round(monthlyApprovalCount * hoursSavedPerApproval)` Hours).
- **Gap Identified**:
  - Section 05 in `LandingPage.jsx` currently lacks an export trigger button ("Export Laporan ROI (PDF/Print)") and modal mounting state (`isRoiModalOpen`).

### 1.2 `printtPdfHook.jsx` Pattern Analysis
- **Dependencies**: `jspdf` (^3.0.1) and `jspdf-autotable` (^5.0.2).
- **Export Pattern**:
  - Document setup: `const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });`
  - Headers: Corporate title aligned center, document type subtitle, metadata key-value pairs (left/right alignment at specified X, Y coordinates).
  - Table: `autoTable(doc, { startY, head, body, theme: 'grid', headStyles, bodyStyles, margin, didDrawPage })`.
  - Signature Footer: Placed via `didDrawPage` cursor Y offset.
  - Download trigger: `doc.save("file-name.pdf")`.

---

## 2. Component Props Contract Specification

`RoiStatementModal.jsx` will accept the following props from `LandingPage.jsx`:

```typescript
interface RoiStatementModalProps {
  /** Controls modal visibility */
  isOpen: boolean;
  
  /** Callback to close the modal */
  onClose: () => void;
  
  /** Selected employee count from ROI slider */
  employeeCount: number;
  
  /** Selected average manual approval duration (days) from ROI slider */
  avgApprovalTimeDays: number;
  
  /** Calculated monthly monetary savings in IDR */
  monthlySavingsRp: number;
  
  /** Calculated monthly total approval documents count */
  monthlyApprovalCount: number;
  
  /** Calculated monthly total managerial hours saved */
  totalHoursSaved: number;
}
```

---

## 3. Internal State Interface & Customization

To make the generated statement executive-ready for sales presentations and client proposals, `RoiStatementModal.jsx` maintains interactive internal state for proposal customization:

```javascript
// Internal State
const [companyName, setCompanyName] = useState("PT Enterprise Solutions Indonesia");
const [departmentName, setDepartmentName] = useState("Finance & Operations Division");
const [preparedBy, setPreparedBy] = useState("Executive Financial Analyst");
const [isExportingPdf, setIsExportingPdf] = useState(false);
const [isCustomizing, setIsCustomizing] = useState(false);
```

### Dynamic Derived Financial Calculations
- **Annual Savings (IDR)**: `annualSavingsRp = monthlySavingsRp * 12`
- **Annual Hours Saved**: `annualHoursSaved = totalHoursSaved * 12`
- **Payback Period / ROI**: Buyout vs 1-Month Savings Ratio.
- **Current Date String**: `new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })`

---

## 4. DOM Structure & Layout Design

The component utilizes a dual-mode layout (Screen Modal Preview + `@media print` Page Document):

```
RoiStatementModal (dialog container / backdrop)
 ├── Modal Backdrop (fixed overlay, backdrop-blur, print:hidden)
 └── Modal Content Card (max-w-4xl, bg-slate-900, print:bg-white print:text-black print:max-w-none print:shadow-none)
      ├── Modal Action Header (screen-only: Title, Print Btn, Download PDF Btn, Close Btn)
      ├── Interactive Parameter Customizer Bar (screen-only: collapsible inputs for Company Name, Dept)
      └── Printable Document Area (`#roi-statement-print-area`)
           ├── Executive Document Header
           │    ├── Approva.ai Logo & Corporate Letterhead
           │    ├── Document Title ("EXECUTIVE ROI & FINANCIAL EFFICIENCY STATEMENT")
           │    └── Report Metadata Badge (Ref No, Date, Target Organization)
           ├── KPI Summary Card Grid (3 Columns)
           │    ├── Card 1: Monthly Financial Savings (Rp)
           │    ├── Card 2: Annualized Projection (Rp)
           │    └── Card 3: Managerial Hours Reclaimed / Year
           ├── Detailed Financial Breakdown Table
           │    ├── Metric | Baseline (Manual) | Optimized (Approva.ai) | Net Efficiency Gain
           │    ├── Process Cycle Time | {avgApprovalTimeDays} Days | Instant (< 5 Min) | 99.8% Speedup
           │    ├── Monthly Approvals | {monthlyApprovalCount} Documents | Automated Routing | Zero Bottleneck
           │    ├── Hours Spent / Mo | Baseline Hrs | {totalHoursSaved} Hrs Saved | Reclaimed Productivity
           │    └── Direct Cost Impact | Baseline Labor Cost | Rp {monthlySavingsRp} Saved | Direct OPEX Reduction
           ├── Audit & Calculation Methodology Disclosure Box
           │    ├── Hourly Cost Assumption: Rp 85.000 / Managerial Hour
           │    ├── Labor Savings Multiplier: 40% Direct Productive Reallocation
           │    └── Security & Compliance: On-Premise AES-256 Data Sovereignty & SHA-256 Audit Digest
           └── Formal Authorization Signature Block
                ├── Prepared By Signature Box (Name, Title, Date)
                └── Executive Approval Signature Box (Client Representative Signature Line)
```

---

## 5. Screen vs. Print (`window.print()`) CSS Strategy

Using Tailwind CSS responsive print modifiers (`print:*`) and inline `@media print` styles:

```css
@media print {
  body * {
    visibility: hidden;
  }
  #roi-statement-print-area, #roi-statement-print-area * {
    visibility: visible;
  }
  #roi-statement-print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    background: white !important;
    color: black !important;
    padding: 20px;
  }
  .print\:hidden {
    display: none !important;
  }
}
```

---

## 6. PDF Generator Implementation Specification (`jsPDF` + `jspdf-autotable`)

The `handleExportPdf()` function uses `jspdf` and `jspdf-autotable`:

```javascript
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

const handleExportPdf = () => {
  setIsExportingPdf(true);
  try {
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    // Corporate Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("APPROVA.AI FINANCIAL REPORT", 14, 18);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Executive ROI & Cost Efficiency Statement", 140, 18);

    // Metadata Block
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Organization: ${companyName}`, 14, 38);
    doc.text(`Department: ${departmentName}`, 14, 44);
    doc.text(`Prepared By: ${preparedBy}`, 14, 50);
    
    doc.text(`Date: ${new Date().toLocaleDateString("id-ID")}`, 140, 38);
    doc.text(`Doc Ref: ROI-EXP-${Date.now().toString().slice(-6)}`, 140, 44);

    // KPI Cards Highlight Table
    autoTable(doc, {
      startY: 56,
      head: [["Monthly Savings (IDR)", "Annual Projection (IDR)", "Managerial Hours Reclaimed"]],
      body: [[
        `Rp ${monthlySavingsRp.toLocaleString("id-ID")}`,
        `Rp ${(monthlySavingsRp * 12).toLocaleString("id-ID")}`,
        `${totalHoursSaved * 12} Hours / Year`
      ]],
      theme: "grid",
      headStyles: { fillColor: [0, 120, 212], textColor: 255, fontStyle: "bold", halign: "center" },
      bodyStyles: { fontSize: 12, fontStyle: "bold", halign: "center", textColor: [16, 185, 129] }
    });

    // Main Detailed Breakdown Table
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 8,
      head: [["Metric Parameter", "Current Baseline", "Approva.ai Optimized", "Net Impact / Savings"]],
      body: [
        ["Active Organization Users", `${employeeCount} Users`, `${employeeCount} Users`, "100% Seat Coverage"],
        ["Avg Approval Cycle", `${avgApprovalTimeDays} Business Days`, "< 5 Minutes", `${((avgApprovalTimeDays * 24 - 0.1) / (avgApprovalTimeDays * 24) * 100).toFixed(1)}% Cycle Reduction`],
        ["Monthly Document Volume", `${monthlyApprovalCount} Docs`, `${monthlyApprovalCount} Automated`, "Zero Manual Delay"],
        ["Monthly Hours Saved", "0 Hrs Reclaimed", `${totalHoursSaved} Hrs Saved`, `${totalHoursSaved} Hours / Month`],
        ["Monthly OPEX Efficiency", "Rp 0 Saved", `Rp ${monthlySavingsRp.toLocaleString("id-ID")}`, `Rp ${monthlySavingsRp.toLocaleString("id-ID")} / Month`]
      ],
      theme: "striped",
      headStyles: { fillColor: [30, 41, 59], textColor: 255, fontStyle: "bold" },
      bodyStyles: { fontSize: 10 }
    });

    // Methodology & Security Note
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text("Methodology Note: Calculations assume standard managerial cost rate of Rp 85.000/hr with a conservative 40%", 14, finalY);
    doc.text("productive recovery multiplier. Data security guaranteed via On-Premise AES-256 & SHA-256 Immutable Audit Log.", 14, finalY + 5);

    // Signatures
    doc.setFont("helvetica", "normal");
    doc.setTextColor(30, 41, 59);
    doc.text("Prepared By,", 30, finalY + 25);
    doc.text("(____________________)", 25, finalY + 45);
    doc.text(preparedBy, 30, finalY + 50);

    doc.text("Approved & Accepted By,", 140, finalY + 25);
    doc.text("(____________________)", 135, finalY + 45);
    doc.text("Executive Representative", 137, finalY + 50);

    doc.save(`Approva_ROI_Statement_${companyName.replace(/\s+/g, "_")}.pdf`);
    toast.success("Laporan ROI PDF Berhasil Diunduh!");
  } catch (err) {
    toast.error("Gagal mengunduh PDF ROI Statement.");
    console.error(err);
  } finally {
    setIsExportingPdf(false);
  }
};
```

---

## 7. Integration Plan for `LandingPage.jsx`

In `LandingPage.jsx`:
1. Import `RoiStatementModal` from `../components/RoiStatementModal`.
2. Add modal state: `const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);`
3. Add Export Button inside Section 05 (under the KPI card in `LandingPage.jsx` lines 962–985):
   ```jsx
   <button
     onClick={() => setIsRoiModalOpen(true)}
     className="w-full mt-4 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
   >
     <FileText className="w-4 h-4" />
     Export Laporan ROI (PDF / Print)
   </button>
   ```
4. Render `<RoiStatementModal>` at bottom of `LandingPage.jsx`:
   ```jsx
   <RoiStatementModal
     isOpen={isRoiModalOpen}
     onClose={() => setIsRoiModalOpen(false)}
     employeeCount={employeeCount}
     avgApprovalTimeDays={avgApprovalTimeDays}
     monthlySavingsRp={monthlySavingsRp}
     monthlyApprovalCount={monthlyApprovalCount}
     totalHoursSaved={Math.round(monthlyApprovalCount * hoursSavedPerApproval)}
   />
   ```

---

## 8. Summary of Benefits & Acceptance Alignment
- **Fulfills R1 Requirement**: Prospective clients can save financial estimates in both print view (`window.print()`) and downloadable PDF file (`jsPDF`).
- **Seamless Data Flow**: Accepts exact state inputs from `LandingPage.jsx` ROI calculator sliders.
- **Enterprise Ready**: Includes corporate headers, parameter customization, financial tables, calculation transparency notes, and signature approval lines.
