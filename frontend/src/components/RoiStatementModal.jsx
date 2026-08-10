import React, { useEffect } from "react";
import {
  Printer,
  FileText,
  X,
  Building2,
  Calendar,
  Hash,
  CheckCircle2,
} from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const RoiStatementModal = ({
  isOpen,
  onClose,
  employeeCount = 85,
  avgApprovalTimeDays = 5,
  monthlySavingsRp = 39015000,
  monthlyApprovalCount = 153,
  totalHoursSaved = 1148,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const todayStr = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const refId = `REF-ROI-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`;

  const handlePrint = () => {
    window.print();
  };

  const handleExportPdf = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Dark Header Banner
    doc.setFillColor(10, 15, 29);
    doc.rect(0, 0, 210, 25, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text(
      "APPROVA.AI - EXECUTIVE FINANCIAL SAVINGS STATEMENT",
      105,
      15,
      { align: "center" }
    );

    // Document Metadata
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    doc.text(`Tanggal Laporan: ${todayStr}`, 14, 35);
    doc.text(`Reference ID: ${refId}`, 14, 41);

    doc.setFont("helvetica", "bold");
    doc.text("Ringkasan Metrik Organisasi:", 14, 50);
    doc.setFont("helvetica", "normal");
    doc.text(`• Total Karyawan / Users: ${employeeCount} Karyawan`, 14, 56);
    doc.text(`• Rata-rata Siklus Approval Manual: ${avgApprovalTimeDays} Hari Kerja`, 14, 62);
    doc.text(`• Volume Approval Bulanan: ${monthlyApprovalCount} Berkas`, 14, 68);

    // Breakdown Table
    autoTable(doc, {
      startY: 75,
      head: [
        [
          "Metrik / Indikator",
          "Kondisi Manual (Sebelumnya)",
          "Mode Approva.ai (Otomatis)",
          "Efisiensi / Penghematan",
        ],
      ],
      body: [
        [
          "Waktu Pemrosesan Approval",
          `${avgApprovalTimeDays} Hari / Berkas`,
          "< 1 Hari Kerja",
          `${(avgApprovalTimeDays * 1.5).toFixed(1)} Jam / Berkas`,
        ],
        [
          "Total Jam Kerja Manajerial",
          `${Math.round(monthlyApprovalCount * avgApprovalTimeDays * 3).toLocaleString("id-ID")} Jam`,
          `${Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5).toLocaleString("id-ID")} Jam`,
          `${totalHoursSaved?.toLocaleString("id-ID")} Jam / Bulan`,
        ],
        [
          "Estimasi Biaya Jam Manajerial",
          `Rp ${Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5 * 85000).toLocaleString("id-ID")}`,
          `Rp ${Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5 * 85000 * 0.6).toLocaleString("id-ID")}`,
          `Rp ${monthlySavingsRp?.toLocaleString("id-ID")} / Bulan`,
        ],
        [
          "Proyeksi Penghematan Tahunan",
          "-",
          "-",
          `Rp ${(monthlySavingsRp * 12)?.toLocaleString("id-ID")} / Tahun`,
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [0, 120, 212],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 9 },
      styles: { cellPadding: 3 },
    });

    const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY : 140;

    // Highlight summary box
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.rect(14, finalY + 8, 182, 22, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 101, 52);
    doc.text("TOTAL ESTIMASI PENGHEMATAN BULANAN:", 20, finalY + 16);
    doc.setFontSize(12);
    doc.text(
      `Rp ${monthlySavingsRp?.toLocaleString("id-ID")} / Bulan  (${totalHoursSaved?.toLocaleString("id-ID")} Jam Terhemat)`,
      20,
      finalY + 24
    );

    // Footer text
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(100, 116, 139);
    doc.text(
      "Dokumen ini diterbitkan secara resmi oleh Approva.ai ROI Financial Calculator System.",
      14,
      282
    );

    doc.save(`approva_roi_financial_statement_${employeeCount}_karyawan.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      {/* Inline Print Styles for clean window.print output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-area, .print-area * {
            visibility: visible !important;
          }
          .print-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 24px !important;
            background-color: #ffffff !important;
            color: #0f172a !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* Backdrop click area */}
      <div
        className="fixed inset-0 no-print"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl rounded-2xl bg-[#0a0f1d] border border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto text-slate-100 print-area z-10">
        {/* Top Action & Close Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold font-mono">
              EXECUTIVE STATEMENT
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-colors border border-slate-700"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span>Cetak / Print Laporan</span>
            </button>

            <button
              onClick={handleExportPdf}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-md shadow-blue-600/30"
            >
              <FileText className="w-4 h-4" />
              <span>Unduh PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Statement Header */}
        <div className="text-center space-y-2 pt-2 border-b border-slate-800 pb-6">
          <div className="flex items-center justify-center gap-2 text-[#0078d4] font-bold font-mono text-sm uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>APPROVA.AI ENTERPRISE PLATFORM</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white uppercase tracking-tight">
            APPROVA.AI - EXECUTIVE FINANCIAL SAVINGS STATEMENT
          </h2>
          <p className="text-xs text-slate-400">
            Laporan Resmi Estimasi Penghematan Biaya Operasional &amp; Jam Manajerial
          </p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[11px] block uppercase">Tanggal Dokumen</span>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{todayStr}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[11px] block uppercase">Reference ID</span>
            <div className="font-bold text-cyan-400 font-mono flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>{refId}</span>
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-slate-400 font-mono text-[11px] block uppercase">Skala Organisasi</span>
            <div className="font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>{employeeCount} Karyawan / Users</span>
            </div>
          </div>
        </div>

        {/* Breakdown Table */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Rincian Efisiensi Finansial &amp; Jam Manajerial</span>
          </h3>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 font-bold">
                  <th className="p-3">Metrik / Indikator</th>
                  <th className="p-3">Kondisi Manual (Sebelumnya)</th>
                  <th className="p-3">Mode Approva.ai (Otomatis)</th>
                  <th className="p-3 text-emerald-400">Efisiensi / Penghematan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-200">
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">Waktu Pemrosesan Approval</td>
                  <td className="p-3 font-mono text-slate-400">{avgApprovalTimeDays} Hari / Berkas</td>
                  <td className="p-3 font-mono text-cyan-400">&lt; 1 Hari Kerja</td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {(avgApprovalTimeDays * 1.5).toFixed(1)} Jam / Berkas
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">Total Jam Kerja Manajerial</td>
                  <td className="p-3 font-mono text-slate-400">
                    {Math.round(monthlyApprovalCount * avgApprovalTimeDays * 3).toLocaleString("id-ID")} Jam
                  </td>
                  <td className="p-3 font-mono text-cyan-400">
                    {Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5).toLocaleString("id-ID")} Jam
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    {totalHoursSaved?.toLocaleString("id-ID")} Jam / Bulan
                  </td>
                </tr>
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">Estimasi Biaya Jam Manajerial</td>
                  <td className="p-3 font-mono text-slate-400">
                    Rp {Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5 * 85000).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 font-mono text-cyan-400">
                    Rp {Math.round(monthlyApprovalCount * avgApprovalTimeDays * 1.5 * 85000 * 0.6).toLocaleString("id-ID")}
                  </td>
                  <td className="p-3 font-mono font-bold text-emerald-400">
                    Rp {monthlySavingsRp?.toLocaleString("id-ID")} / Bulan
                  </td>
                </tr>
                <tr className="bg-emerald-950/20 font-bold">
                  <td className="p-3 text-emerald-300">Proyeksi Penghematan Tahunan</td>
                  <td className="p-3 font-mono text-slate-500">-</td>
                  <td className="p-3 font-mono text-slate-500">-</td>
                  <td className="p-3 font-mono text-emerald-400 text-sm">
                    Rp {(monthlySavingsRp * 12)?.toLocaleString("id-ID")} / Tahun
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Highlight Executive Summary Card */}
        <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[11px] font-mono text-emerald-400 uppercase font-bold tracking-wider">
              TOTAL ESTIMASI PENGHEMATAN BULANAN
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              Rp {monthlySavingsRp?.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-slate-400">
              Disertai penghematan {totalHoursSaved?.toLocaleString("id-ID")} jam kerja manajerial setiap bulan.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-slate-800 text-center sm:flex sm:justify-between text-[11px] text-slate-500 font-mono">
          <span>APPROVA.AI FINANCIAL CALCULATOR ENGINE v2.0</span>
          <span>HAK CIPTA © {new Date().getFullYear()} APPROVA.AI</span>
        </div>
      </div>
    </div>
  );
};

export default RoiStatementModal;
