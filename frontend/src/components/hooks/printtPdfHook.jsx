import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { NAMAPERUSAHAAN } from "@/api/constant";

const useReturnPdf = ({
  selectedMultiple,
  returns,
  vendorDocNo,
  setVendorDocNo,
  setSelectedMultiple,
}) => {
  console.log(selectedMultiple);
  const handleMakePDFofSelected = async () => {
    if (!selectedMultiple.length)
      return toast.error("Please select at least one return");
    if (!vendorDocNo) return toast.error("Vendor Doc No is required");
    //pengecekan apakah semua nya berasal dari vendor yang sama
    const vendorIds = selectedMultiple.map((ret) => ret.sku?.vendorName);
    if (new Set(vendorIds).size !== 1)
      return toast.error(
        "Item Yang terpilih harusnya berasal dari vendor yang sama"
      );

    // Ambil data yang dipilih
    const selectedReturns = returns.filter((ret) =>
      selectedMultiple.includes(ret._id)
    );
    if (!selectedReturns.length) return;

    // Untuk setiap return, generate satu PDF (atau bisa digabung, di sini satu file untuk semua)
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Header
    doc.setFontSize(16);
    doc.text(NAMAPERUSAHAAN + " Service", 105, 20, { align: "center" });
    doc.setFontSize(14);
    doc.text("TRANSFER VENDOR", 105, 30, { align: "center" });
    doc.setFontSize(10);

    // Info kiri-kanan
    doc.setFontSize(11);
    doc.text(
      `Vendor Name : ${selectedReturns[0].sku?.vendorName || "-"}`,
      20,
      52
    );
    doc.text(`Vendor Doc No : ${vendorDocNo || "-"}`, 20, 59);
    doc.text(
      `Print Date : ${new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      120,
      52
    );
    doc.text(
      `Location Code : ${selectedReturns[0].location?.code || "-"}`,
      120,
      59
    );

    //main table
    const tableResult = autoTable(doc, {
      startY: 70,
      head: [["ITEM", "NO TTB", "LOCATION CODE", "TGL TTB", "QTY"]],
      body: [
        ...selectedReturns.map((ret) => [
          ret.sku?.sku || "-",
          ret.ttbNumber || "-",
          ret.location?.code || "-",
          ret.createdAt
            ? new Date(ret.createdAt).toLocaleDateString("id-ID")
            : "-",
          ret.quantity || 0,
        ]),
        [
          "",
          "",
          "",
          "TOTAL",
          selectedReturns.reduce((e, ret) => e + ret.quantity, 0),
        ],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [200, 200, 200],
        textColor: 20,
        fontStyle: "bold",
      },
      bodyStyles: { fontSize: 11 },
      margin: { left: 20, right: 20 },
      styles: { cellPadding: 2, fontSize: 11 },
      didDrawPage: function (data) {
        // Mendapatkan posisi Y setelah tabel selesai
        const finalY = data.cursor.y;

        // Tambahkan margin untuk footer
        const footerY = finalY + 20;

        // Footer tanda tangan
        doc.text("Diserahkan oleh", 30, footerY);
        doc.text("Diterima oleh", 150, footerY);
        doc.text(
          `Warehouse ${selectedReturns[0].location?.name || "-"}`,
          20,
          footerY + 20
        );
        doc.text(`Vendor`, 154, footerY + 20);
      },
    });

    doc.save("transfer-vendor.pdf");
    setVendorDocNo("");
    setSelectedMultiple([]);
    document.getElementById("free-text-before-download")?.close();
    document.getElementById("return-action-dialog")?.close();
  };

  return { handleMakePDFofSelected };
};

export default useReturnPdf;
