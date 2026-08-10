# Architectural Analysis & Recommendations: PDF Generation & Print Layout for Milestone M1 (ROI Financial Exporter)

**Author:** M1 Explorer 2 (PDF Generation & Print Layout Explorer)  
**Date:** 2026-08-10  
**Target Milestone:** M1 — ROI Financial Exporter  
**Project:** Approva.ai Frontend (`frontend/`)  

---

## 1. Executive Summary & Scope Assessment

Milestone M1 introduces the **Live ROI Financial Statement PDF & Print Exporter** for prospective enterprise clients (e.g., BUMN, Holding Groups, Enterprise Directors). This feature allows clients to calculate potential operational efficiency savings (in **Indonesian Rupiah (IDR)** and **Managerial Hours**) based on their employee count and current manual approval cycle, and then instantly export or print a formatted executive financial summary report.

### Key Technical Objectives:
1. **jsPDF + jspdf-autotable Generator (`generateRoiPdf`)**: Programmatic, high-fidelity PDF document generation leveraging installed `jspdf ^3.0.1` and `jspdf-autotable ^5.0.2`.
2. **Browser Print Layout (`window.print()`)**: `@media print` CSS rules enabling crisp, light-theme paper and PDF printouts directly from `RoiStatementModal.jsx`.
3. **Data Integrity & Localization**: Accurate IDR currency formatting (`Rp X.XXX.XXX`), managerial hours calculation (`X Jam/bulan`), and professional enterprise document branding (Navy Header `#0a0f1d`, Accent Blue `#0078d4`, Emerald Green `#10b981` highlights).

---

## 2. Dependency & Codebase Inspection

### 2.1 Package Dependencies (`frontend/package.json`)
Inspection of `frontend/package.json` confirms the exact versions:
- `"jspdf": "^3.0.1"`
- `"jspdf-autotable": "^5.0.2"`

In `jspdf` 3.x and `jspdf-autotable` 5.x, the modern ES module import syntax is:
```javascript
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
```
Execution is invoked functionally via `autoTable(doc, options)`, where `doc` is the instantiated `jsPDF` object.

### 2.2 Inspection of Existing `components/hooks/printtPdfHook.jsx`
The existing `printtPdfHook.jsx` in the codebase demonstrates the established pattern in the project:
- Instantiates `jsPDF` in `mm` units with A4 format: `new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" })`.
- Custom headers and meta information placed via `doc.text(...)` and `doc.setFontSize(...)`.
- Main data table created using `autoTable(doc, { startY, head, body, theme: 'grid', ... })`.
- Utilizes `didDrawPage` cursor inspection (`data.cursor.y`) to position post-table signature blocks or footers dynamically.
- Triggers browser download via `doc.save("filename.pdf")`.

---

## 3. Exact jsPDF Generator Function: `generateRoiPdf(...)`

Below is the complete, production-ready implementation of `generateRoiPdf` designed for `src/utils/generateRoiPdf.js` (or `src/components/hooks/useRoiPdf.js`).

### 3.1 Design Principles for `generateRoiPdf`
- **Page Dimensions**: A4 Portrait (Width: 210mm, Height: 297mm). Margins: Left/Right 15mm, Top 15mm.
- **Enterprise Visual Branding**:
  - Dark Navy Header `#0a0f1d` (RGB: `10, 15, 29`) with Accent Blue `#0078d4` divider.
  - 3 Summary KPI Highlight Cards (Monthly Savings Rp, Monthly Hours Saved, Annual Savings Rp) framed with light rounded boxes and distinct accent colors (Emerald `#10b981`, Sky Blue `#0284c7`, Amber `#d97706`).
  - Styled `autoTable` with solid headers (`#0078d4`), alternating light row fills (`#f8fafc`), and custom cell highlighting for savings rows.
- **Perpetual Buyout Notice**: Highlighted box emphasizing 100% On-Premise Data Sovereignty and Zero SaaS Subscription Fees.
- **Digital Footnote & Verification**: Bottom footer containing timestamp and verification text.

### 3.2 Full Source Code Implementation

```javascript
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Generates and triggers download of the Official ROI Financial Statement PDF.
 * 
 * @param {Object} params
 * @param {string} [params.companyName="Perusahaan Prospektif"] - Name of client enterprise.
 * @param {number} [params.employeeCount=85] - Total active employees/users.
 * @param {number} [params.avgApprovalTimeDays=5] - Baseline manual approval duration (days).
 * @param {number} [params.monthlySavingsRp] - Computed monthly savings in IDR.
 * @param {number} [params.monthlyApprovalCount] - Computed monthly document submissions.
 * @param {number} [params.totalHoursSaved] - Computed monthly managerial hours saved.
 */
export const generateRoiPdf = ({
  companyName = "Perusahaan Prospektif",
  employeeCount = 85,
  avgApprovalTimeDays = 5,
  monthlySavingsRp,
  monthlyApprovalCount,
  totalHoursSaved,
}) => {
  // 1. Initialize A4 Portrait Document
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // 2. Financial & Efficiency Calculations
  const hourlyCost = 85000; // Rp 85.000 / jam (Managerial Base Hourly Cost)
  const computedMonthlyApprovals = monthlyApprovalCount ?? Math.round(employeeCount * 1.8);
  const hoursSavedPerApproval = avgApprovalTimeDays * 1.5;
  const computedMonthlySavings = monthlySavingsRp ?? Math.round(computedMonthlyApprovals * hoursSavedPerApproval * (hourlyCost * 0.4));
  const computedHoursSaved = totalHoursSaved ?? Math.round(computedMonthlyApprovals * hoursSavedPerApproval);
  const annualSavingsRp = computedMonthlySavings * 12;
  const annualHoursSaved = computedHoursSaved * 12;

  // Helper Formatters
  const formatIDR = (val) => "Rp " + Math.round(val).toLocaleString("id-ID");
  const formatNum = (val) => Math.round(val).toLocaleString("id-ID");

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm

  // 3. Document Header (Corporate Navy Theme)
  doc.setFillColor(10, 15, 29); // #0a0f1d
  doc.rect(0, 0, pageWidth, 40, "F");

  // Cyan Accent Strip
  doc.setFillColor(0, 120, 212); // #0078d4
  doc.rect(0, 40, pageWidth, 2, "F");

  // Title Text
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("APPROVA.AI ENTERPRISE", 15, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(56, 189, 248); // Light Cyan accent
  doc.text("LAPORAN EFISIENSI FINANSIAL & ESTIMASI ROI", 15, 26);

  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // Slate 300
  doc.text("Dynamic Workflow & E-Form Control Platform (On-Premise Edition)", 15, 33);

  // Metadata Block (Right Header)
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  const docRef = `ROI-FIN-${Math.floor(100000 + Math.random() * 900000)}`;
  doc.text(`Ref ID: ${docRef}`, pageWidth - 15, 18, { align: "right" });
  
  doc.setFont("helvetica", "normal");
  const currentDate = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Tanggal: ${currentDate}`, pageWidth - 15, 25, { align: "right" });
  doc.text("Lisensi: Beli Putus (Perpetual)", pageWidth - 15, 32, { align: "right" });

  // 4. Client Profile Box
  doc.setFillColor(241, 245, 249); // slate-100
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(15, 47, pageWidth - 30, 20, 3, 3, "FD");

  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text(`Klien / Perusahaan Target: ${companyName}`, 20, 55);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`Jumlah Karyawan Operasional: ${employeeCount} User  |  Rata-rata Siklus Manual: ${avgApprovalTimeDays} Hari Kerja`, 20, 62);

  // 5. KPI Highlight Cards Grid (3 Columns)
  const gap = 5;
  const boxWidth = (pageWidth - 30 - gap * 2) / 3;

  // Card 1: Monthly IDR Savings (Emerald Accent)
  doc.setFillColor(236, 253, 245); // Emerald 50
  doc.setDrawColor(16, 185, 129); // Emerald 500
  doc.roundedRect(15, 72, boxWidth, 25, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(4, 120, 87); // Emerald 700
  doc.text("PENGHEMATAN / BULAN", 15 + boxWidth / 2, 78, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(5, 150, 105); // Emerald 600
  doc.text(formatIDR(computedMonthlySavings), 15 + boxWidth / 2, 87, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Efisiensi Biaya Manajerial", 15 + boxWidth / 2, 92, { align: "center" });

  // Card 2: Monthly Hours Saved (Sky Blue Accent)
  const card2X = 15 + boxWidth + gap;
  doc.setFillColor(240, 249, 255); // Sky 50
  doc.setDrawColor(2, 132, 199); // Sky 600
  doc.roundedRect(card2X, 72, boxWidth, 25, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(3, 105, 161); // Sky 700
  doc.text("JAM WORKFLOW TERHEMAT", card2X + boxWidth / 2, 78, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(2, 132, 199);
  doc.text(`${formatNum(computedHoursSaved)} Jam / Bulan`, card2X + boxWidth / 2, 87, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(`${formatNum(annualHoursSaved)} Jam / Tahun`, card2X + boxWidth / 2, 92, { align: "center" });

  // Card 3: Annual IDR Savings (Amber Accent)
  const card3X = 15 + (boxWidth + gap) * 2;
  doc.setFillColor(254, 243, 199); // Amber 100
  doc.setDrawColor(217, 119, 6); // Amber 600
  doc.roundedRect(card3X, 72, boxWidth, 25, 2.5, 2.5, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(180, 83, 9); // Amber 700
  doc.text("PENGHEMATAN / TAHUN", card3X + boxWidth / 2, 78, { align: "center" });
  doc.setFontSize(11);
  doc.setTextColor(217, 119, 6);
  doc.text(formatIDR(annualSavingsRp), card3X + boxWidth / 2, 87, { align: "center" });
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("Proyeksi Efisiensi 12 Bulan", card3X + boxWidth / 2, 92, { align: "center" });

  // 6. Main Data Table (autoTable)
  autoTable(doc, {
    startY: 103,
    margin: { left: 15, right: 15 },
    head: [["METRIK & PARAMETER EVALUASI", "NILAI BASIN / ESTIMASI", "CATATAN METODOLOGI & ASUMSI"]],
    body: [
      ["Jumlah Karyawan Operasional (User)", `${employeeCount} Karyawan`, "Skala Lisensi Beli Putus Unlimited Users"],
      ["Rata-rata Durasi Approval Manual Saat Ini", `${avgApprovalTimeDays} Hari Kerja`, "Berdasarkan survei bottleneck dokumen manual"],
      ["Estimasi Volume Pengajuan Dokumen", `${formatNum(computedMonthlyApprovals)} Berkas / Bulan`, "Asumsi rata-rata 1.8 pengajuan / karyawan / bulan"],
      ["Jam Manajerial Terhemat per Pengajuan", `${hoursSavedPerApproval.toFixed(1)} Jam / Berkas`, "Reduksi waktu tunggu, penyampaian & verifikasi"],
      ["Total Jam Kerja Manajerial Terhemat (Bulanan)", `${formatNum(computedHoursSaved)} Jam / Bulan`, "Total alokasi jam kerja manajer yang dialihkan"],
      ["Total Jam Kerja Manajerial Terhemat (Tahunan)", `${formatNum(annualHoursSaved)} Jam / Tahun`, "Proyeksi efisiensi produktivitas tim 1 tahun"],
      ["Biaya Jam Kerja Manajerial (Hourly Base Cost)", `${formatIDR(hourlyCost)} / Jam`, "Estimasi standar rata-rata gaji manajerial"],
      ["ESTIMASI PENGHEMATAN FINANSIAL BULANAN", formatIDR(computedMonthlySavings), "Total Nilai Waktu Terhemat x 40% Efficiency Factor"],
      ["ESTIMASI PENGHEMATAN FINANSIAL TAHUNAN", formatIDR(annualSavingsRp), "Proyeksi Kumulatif 12 Bulan Efisiensi Operasional"],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [0, 120, 212], // Approva Blue #0078d4
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
    },
    bodyStyles: {
      fontSize: 8.5,
      textColor: [51, 65, 85],
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 72, fontStyle: "bold" },
      1: { cellWidth: 48, halign: "right", fontStyle: "bold" },
      2: { cellWidth: "auto", textColor: [100, 116, 139] },
    },
    didParseCell: (data) => {
      // Highlight row 7 and row 8 (Savings Total Rows)
      if (data.section === "body" && (data.row.index === 7 || data.row.index === 8)) {
        data.cell.styles.fillColor = [236, 253, 245]; // emerald 50
        data.cell.styles.textColor = [4, 120, 87]; // emerald 700
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // 7. Post-Table Guarantee Callout Box
  const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 7 : 205;

  doc.setFillColor(248, 250, 252); // slate 50
  doc.setDrawColor(203, 213, 225); // slate 300
  doc.roundedRect(15, finalY, pageWidth - 30, 28, 2.5, 2.5, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text("KEUNTUNGAN MODEL LISENSI BELI PUTUS (PERPETUAL ON-PREMISE):", 20, finalY + 7);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text("• Tanpa Biaya Langganan SaaS Bulanan Per-User (Zero Seat Subscription Fee selamanya).", 20, finalY + 13);
  doc.text("• 100% Data Sovereignty: Aplikasi & database di-host sepenuhnya di VPS / Server Internal milik Perusahaan.", 20, finalY + 18);
  doc.text("• Payback Period (BEP) investasi lisensi tercapai dalam waktu < 3 bulan pertama pengoperasian sistem.", 20, finalY + 23);

  // 8. Footer Line & Document Verification
  doc.setDrawColor(226, 232, 240);
  doc.line(15, 280, pageWidth - 15, 280);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text("Approva.ai Enterprise — Official ROI & Financial Exporter", 15, 285);
  doc.text("Halaman 1 dari 1  |  Dokumen ini dihasilkan secara otomatis oleh sistem", pageWidth - 15, 285, { align: "right" });

  // 9. Save PDF File
  const safeFilename = companyName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase();
  doc.save(`approva_roi_financial_statement_${safeFilename}.pdf`);
};
```

---

## 4. `window.print()` Print-Ready CSS & Layout Specification

When the user clicks **"Cetak Laporan (Print)"**, `window.print()` triggers the browser's native print engine. Without print-specific styling, dark backgrounds, navigation bars, modals, and buttons interfere with the output.

### 4.1 Required `@media print` CSS Additions (`src/index.css`)

The following CSS rules should be added to `frontend/src/index.css`:

```css
/* ==========================================================================
   MILESTONE M1: PRINT-READY CSS FOR ROI FINANCIAL EXPORTER (@media print)
   ========================================================================== */

@media print {
  /* 1. Page Geometry & Color Scheme Overrides */
  @page {
    size: A4 portrait;
    margin: 12mm 15mm 12mm 15mm;
  }

  html, body {
    background: #ffffff !important;
    color: #0f172a !important;
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif !important;
    font-size: 11pt !important;
    line-height: 1.4 !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: visible !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* 2. Hide Non-Printable Elements */
  header,
  nav,
  footer,
  .no-print,
  button,
  .btn,
  input[type="range"],
  .fixed.inset-0.bg-black\/80,
  .fixed.inset-0.bg-slate-950\/80,
  .toast-container {
    display: none !important;
  }

  /* 3. Isolate Print Container */
  body > * {
    visibility: hidden !important;
  }

  .print-area,
  .print-area * {
    visibility: visible !important;
  }

  .print-area {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #ffffff !important;
    color: #0f172a !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    transform: none !important;
  }

  /* 4. Document Print Header */
  .print-area .print-header {
    border-bottom: 3px solid #0078d4 !important;
    padding-bottom: 12px !important;
    margin-bottom: 20px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-end !important;
  }

  .print-area .print-header-title {
    color: #0078d4 !important;
    font-size: 18pt !important;
    font-weight: 800 !important;
    margin: 0 !important;
  }

  .print-area .print-header-subtitle {
    color: #475569 !important;
    font-size: 10pt !important;
    margin: 2px 0 0 0 !important;
  }

  /* 5. Printable KPI Grid Cards */
  .print-area .print-kpi-grid {
    display: grid !important;
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 12px !important;
    margin-bottom: 24px !important;
    page-break-inside: avoid !important;
  }

  .print-area .print-kpi-card {
    border: 1px solid #cbd5e1 !important;
    border-radius: 8px !important;
    padding: 12px !important;
    background-color: #f8fafc !important;
  }

  .print-area .print-kpi-card.emerald {
    border-color: #10b981 !important;
    background-color: #ecfdf5 !important;
  }

  .print-area .print-kpi-card.sky {
    border-color: #0284c7 !important;
    background-color: #f0f9ff !important;
  }

  .print-area .print-kpi-card.amber {
    border-color: #d97706 !important;
    background-color: #fffbeb !important;
  }

  .print-area .print-kpi-label {
    font-size: 8pt !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    color: #475569 !important;
  }

  .print-area .print-kpi-value {
    font-size: 14pt !important;
    font-weight: 800 !important;
    margin: 4px 0 !important;
  }

  .print-area .print-kpi-card.emerald .print-kpi-value { color: #047857 !important; }
  .print-area .print-kpi-card.sky .print-kpi-value { color: #0369a1 !important; }
  .print-area .print-kpi-card.amber .print-kpi-value { color: #b45309 !important; }

  /* 6. Printable Financial Table */
  .print-area .print-table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-bottom: 24px !important;
    font-size: 9.5pt !important;
  }

  .print-area .print-table th {
    background-color: #0078d4 !important;
    color: #ffffff !important;
    font-weight: 700 !important;
    text-align: left !important;
    padding: 8px 10px !important;
    border: 1px solid #0078d4 !important;
  }

  .print-area .print-table td {
    padding: 8px 10px !important;
    border: 1px solid #e2e8f0 !important;
    color: #1e293b !important;
  }

  .print-area .print-table tr:nth-child(even) td {
    background-color: #f8fafc !important;
  }

  .print-area .print-table tr.highlight-savings td {
    background-color: #ecfdf5 !important;
    color: #047857 !important;
    font-weight: 700 !important;
  }

  /* 7. Printable Document Footer */
  .print-area .print-footer {
    margin-top: 40px !important;
    border-top: 1px solid #cbd5e1 !important;
    padding-top: 10px !important;
    display: flex !important;
    justify-content: space-between !important;
    font-size: 8pt !important;
    color: #64748b !important;
    page-break-inside: avoid !important;
  }
}
```

---

## 5. Component Design: `RoiStatementModal.jsx`

`RoiStatementModal.jsx` is the interactive executive modal dialog triggered when the user clicks **"Ekspor Laporan Finansial (PDF / Print)"** in the ROI Calculator section of `LandingPage.jsx`.

### 5.1 Interface Contract (per `PROJECT.md`)
- **Props**:
  - `isOpen` (boolean): Controls modal visibility.
  - `onClose` (function): Modal close handler.
  - `employeeCount` (number): User/employee count.
  - `avgApprovalTimeDays` (number): Manual approval cycle duration.
  - `monthlySavingsRp` (number): Monthly IDR savings.
  - `monthlyApprovalCount` (number): Monthly document count.
  - `totalHoursSaved` (number): Monthly managerial hours saved.

- **Action Handlers**:
  - `handleExportPdf()`: Calls `generateRoiPdf({ companyName, employeeCount, avgApprovalTimeDays, monthlySavingsRp, monthlyApprovalCount, totalHoursSaved })`.
  - `handlePrint()`: Calls `window.print()`.

### 5.2 Complete Component Code Design

```jsx
import React, { useState } from "react";
import { X, Printer, Download, Building2, TrendingUp, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { generateRoiPdf } from "../utils/generateRoiPdf";

const RoiStatementModal = ({
  isOpen,
  onClose,
  employeeCount = 85,
  avgApprovalTimeDays = 5,
  monthlySavingsRp = 23120000,
  monthlyApprovalCount = 153,
  totalHoursSaved = 1148,
}) => {
  const [companyName, setCompanyName] = useState("");

  if (!isOpen) return null;

  const hourlyCost = 85000;
  const hoursSavedPerApproval = (avgApprovalTimeDays * 1.5).toFixed(1);
  const annualSavingsRp = monthlySavingsRp * 12;
  const annualHoursSaved = totalHoursSaved * 12;

  const formatIDR = (val) => "Rp " + Math.round(val).toLocaleString("id-ID");
  const formatNum = (val) => Math.round(val).toLocaleString("id-ID");

  const handleExportPdfClick = () => {
    generateRoiPdf({
      companyName: companyName.trim() || "Perusahaan Prospektif",
      employeeCount,
      avgApprovalTimeDays,
      monthlySavingsRp,
      monthlyApprovalCount,
      totalHoursSaved,
    });
  };

  const handlePrintClick = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      
      {/* Printable Container wrapper with 'print-area' class */}
      <div className="print-area relative w-full max-w-4xl bg-[#0a0f1d] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Modal Action Header (Hidden during window.print()) */}
        <div className="no-print p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[#0078d4]">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Ringkasan Laporan Efisiensi ROI</h3>
              <p className="text-xs text-slate-400">Siap diunduh sebagai PDF resmi atau dicetak langsung.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrintClick}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Cetak (Print)</span>
            </button>

            <button
              onClick={handleExportPdfClick}
              className="px-5 py-2 rounded-xl bg-[#0078d4] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Body */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Company Name Customization Input (Hidden in print) */}
          <div className="no-print p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <Building2 className="w-4 h-4 text-cyan-400 flex-shrink-0" />
              <span>Nama Perusahaan (Opsional untuk Header PDF):</span>
            </div>
            <input
              type="text"
              placeholder="Contoh: PT Semen Indonesia (Persero) Tbk"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="w-full sm:w-72 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#0078d4]"
            />
          </div>

          {/* Printable Header */}
          <div className="print-header flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800 pb-6 gap-4">
            <div>
              <span className="text-[10px] font-mono text-[#0078d4] font-bold tracking-widest uppercase block mb-1">
                APPROVA.AI ENTERPRISE EDITION
              </span>
              <h2 className="print-header-title text-2xl font-black text-white">Laporan Efisiensi Finansial & ROI</h2>
              <p className="print-header-subtitle text-xs text-slate-400 mt-1">
                Estimasi Efisiensi Jam Kerja Manajerial & Hemat Biaya Operasional Workflow
              </p>
            </div>
            <div className="text-left sm:text-right text-xs text-slate-400 font-mono space-y-0.5">
              <p className="text-white font-bold">{companyName || "Perusahaan Prospektif"}</p>
              <p>Tanggal: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
              <p className="text-emerald-400">Lisensi: Beli Putus (Perpetual On-Premise)</p>
            </div>
          </div>

          {/* Printable KPI Cards Grid */}
          <div className="print-kpi-grid grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="print-kpi-card emerald p-5 rounded-2xl bg-emerald-950/40 border border-emerald-800/80">
              <span className="print-kpi-label text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Penghematan / Bulan
              </span>
              <div className="print-kpi-value text-2xl font-black text-emerald-300 font-mono my-1">
                {formatIDR(monthlySavingsRp)}
              </div>
              <span className="text-[11px] text-slate-400">Efisiensi Biaya Manajerial</span>
            </div>

            <div className="print-kpi-card sky p-5 rounded-2xl bg-sky-950/40 border border-sky-800/80">
              <span className="print-kpi-label text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                Jam Workflow Terhemat
              </span>
              <div className="print-kpi-value text-2xl font-black text-sky-300 font-mono my-1">
                {formatNum(totalHoursSaved)} Jam / Bln
              </div>
              <span className="text-[11px] text-slate-400">{formatNum(annualHoursSaved)} Jam / Tahun</span>
            </div>

            <div className="print-kpi-card amber p-5 rounded-2xl bg-amber-950/40 border border-amber-800/80">
              <span className="print-kpi-label text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Penghematan / Tahun
              </span>
              <div className="print-kpi-value text-2xl font-black text-amber-300 font-mono my-1">
                {formatIDR(annualSavingsRp)}
              </div>
              <span className="text-[11px] text-slate-400">Proyeksi Efisiensi 12 Bulan</span>
            </div>
          </div>

          {/* Printable Detailed Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-800">
            <table className="print-table w-full text-xs text-left">
              <thead className="bg-slate-900 text-slate-300 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Metrik & Parameter Evaluasi</th>
                  <th className="py-3 px-4 text-right">Nilai / Estimasi</th>
                  <th className="py-3 px-4">Catatan Metodologi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Jumlah Karyawan Operasional (User)</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-cyan-400">{employeeCount} User</td>
                  <td className="py-3 px-4 text-slate-400">Skala Lisensi Beli Putus Unlimited Users</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Rata-rata Siklus Approval Manual</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-400">{avgApprovalTimeDays} Hari Kerja</td>
                  <td className="py-3 px-4 text-slate-400">Baseline bottleneck dokumen manual saat ini</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Estimasi Volume Pengajuan / Bulan</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">{formatNum(monthlyApprovalCount)} Berkas</td>
                  <td className="py-3 px-4 text-slate-400">Asumsi 1.8 pengajuan / karyawan / bulan</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Jam Terhemat per Pengajuan</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{hoursSavedPerApproval} Jam</td>
                  <td className="py-3 px-4 text-slate-400">Penyederhanaan verifikasi & notifikasi WhatsApp</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Total Jam Manajerial Terhemat (Bulanan)</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{formatNum(totalHoursSaved)} Jam / Bln</td>
                  <td className="py-3 px-4 text-slate-400">Pengalihan alokasi jam kerja manajer ke core business</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-semibold text-white">Base Cost Jam Kerja Manajerial</td>
                  <td className="py-3 px-4 text-right font-mono font-bold">{formatIDR(hourlyCost)} / Jam</td>
                  <td className="py-3 px-4 text-slate-400">Estimasi standar gaji manajerial internal</td>
                </tr>
                <tr className="highlight-savings bg-emerald-950/60 font-bold">
                  <td className="py-3.5 px-4 text-emerald-300">POTENSI PENGHEMATAN BULANAN</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-300 text-sm">{formatIDR(monthlySavingsRp)}</td>
                  <td className="py-3.5 px-4 text-emerald-400 text-[11px]">Nilai jam kerja terhemat x 40% Factor</td>
                </tr>
                <tr className="highlight-savings bg-emerald-950/80 font-bold">
                  <td className="py-3.5 px-4 text-emerald-300">POTENSI PENGHEMATAN TAHUNAN</td>
                  <td className="py-3.5 px-4 text-right font-mono text-emerald-300 text-sm">{formatIDR(annualSavingsRp)}</td>
                  <td className="py-3.5 px-4 text-emerald-400 text-[11px]">Proyeksi efisiensi kumulatif 12 bulan</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Guarantee Callout Box */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Jaminan Lisensi Beli Putus (Perpetual On-Premise)</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Di-host 100% di VPS / Server internal kantor. Tanpa biaya langganan per-user bulanan. Payback Period (BEP) lisensi dicapai dalam waktu kurang dari 3 bulan pengoperasian.
            </p>
          </div>

          {/* Printable Footer */}
          <div className="print-footer pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Approva.ai Enterprise — Live ROI Financial Exporter</span>
            <span>Dokumen Otomatis • Lisensi Beli Putus</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RoiStatementModal;
```

---

## 6. Wiring & Integration in `LandingPage.jsx`

To connect `RoiStatementModal.jsx` in `LandingPage.jsx`:

1. **State Addition**:
   ```jsx
   const [isRoiModalOpen, setIsRoiModalOpen] = useState(false);
   ```

2. **Trigger Button in ROI Calculator Section** (`#roi-calculator`):
   ```jsx
   <button
     onClick={() => setIsRoiModalOpen(true)}
     className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#0078d4] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
   >
     <FileText className="w-4 h-4" />
     <span>Ekspor Laporan Finansial (PDF / Print)</span>
   </button>
   ```

3. **Modal Component Mounting**:
   ```jsx
   <RoiStatementModal
     isOpen={isRoiModalOpen}
     onClose={() => setIsRoiModalOpen(false)}
     employeeCount={employeeCount}
     avgApprovalTimeDays={avgApprovalTimeDays}
     monthlySavingsRp={monthlySavingsRp}
     monthlyApprovalCount={monthlyApprovalCount}
     totalHoursSaved={totalHoursSaved}
   />
   ```

---

## 7. Verification Method

### 7.1 Build Verification
Execute Vite production build check to ensure zero syntax or bundle errors:
```bash
cd frontend && pnpm run build
```
Target result: Exit code 0.

### 7.2 Manual Functional Verification
1. Open ROI section on Landing Page (`#roi-calculator`).
2. Adjust employee slider to `85` and approval days to `5`.
3. Click **"Ekspor Laporan Finansial (PDF / Print)"**.
4. Confirm `RoiStatementModal` pops up with correct calculated metrics.
5. Click **"Unduh PDF"**: Verify PDF downloads as `approva_roi_financial_statement_...pdf` and renders formatted table & KPI boxes cleanly.
6. Click **"Cetak (Print)"**: Verify browser print preview opens with light background, isolated print layout, and hidden non-printable UI buttons.

---

## 8. Summary Checklist for Implementer

| Task | File Target | Description |
|---|---|---|
| **1. PDF Generator Utility** | `frontend/src/utils/generateRoiPdf.js` | Create jsPDF + autoTable generator function with IDR & hours formatting. |
| **2. Print Layout CSS** | `frontend/src/index.css` | Add `@media print` rules for light background, hidden UI, page geometry. |
| **3. ROI Statement Modal** | `frontend/src/components/RoiStatementModal.jsx` | Create interactive modal with PDF download and `window.print()` support. |
| **4. Landing Page Wiring** | `frontend/src/pages/LandingPage.jsx` | Import `RoiStatementModal`, add `isRoiModalOpen` state, and add export trigger button. |
