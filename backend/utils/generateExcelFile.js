import FlowInstance from "../models/FlowInstance.model.js";
import ExcelJS from "exceljs";

const generateExcelFile = async (month, filename) => {
  try {
    //ubah 2025-06 menjadi waktu yang berlaku mongodb
    const year = parseInt(month.split("-")[0]);
    const monthNumber = parseInt(month.split("-")[1]);

    // Buat range tanggal untuk bulan tersebut
    const startDate = new Date(year, monthNumber - 1, 1);
    const endDate = new Date(year, monthNumber, 0, 23, 59, 59, 999);

    const data = await FlowInstance.find({
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate([
      { path: "requestedBy", select: "username displayName" },
      { path: "flowTemplate", select: "title desc" },
      { path: "statuses.completedBy", select: "username displayName" },
    ]);

    // Buat workbook dan worksheet baru
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Process History");

    // Definisikan kolom-kolom
    worksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Global Index", key: "globalIndex", width: 15 },
      { header: "Instance Title", key: "instanceTitle", width: 30 },
      { header: "Flow Template", key: "flowTemplate", width: 25 },
      { header: "Requested By", key: "requestedBy", width: 20 },
      { header: "Overall Status", key: "overallStatus", width: 15 },
      { header: "Current Status", key: "currentStatus", width: 20 },
      { header: "Created At", key: "createdAt", width: 20 },
      { header: "Updated At", key: "updatedAt", width: 20 },
      { header: "Completed Steps", key: "completedSteps", width: 15 },
      { header: "Total Steps", key: "totalSteps", width: 15 },
    ];

    // Styling untuk header
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Tambahkan data ke worksheet
    data.forEach((instance, index) => {
      const currentStatus = instance.statuses[instance.currentStatusIndex];
      const completedSteps = instance.statuses.filter(
        (s) => s.completed,
      ).length;
      const totalSteps = instance.statuses.length;

      worksheet.addRow({
        no: index + 1,
        globalIndex: instance.globalIndex,
        instanceTitle: instance.instanceTitle,
        flowTemplate: instance.flowTemplate?.title || "N/A",
        requestedBy:
          instance.requestedBy?.username ||
          instance.requestedBy?.displayName ||
          "N/A",
        overallStatus: instance.overallStatus,
        currentStatus: currentStatus?.statusTitle || "N/A",
        createdAt: instance.createdAt.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
        updatedAt: instance.updatedAt.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
        }),
        completedSteps: completedSteps,
        totalSteps: totalSteps,
      });
    });

    // Auto-fit kolom
    worksheet.columns.forEach((column) => {
      if (column.width) {
        column.width = Math.max(column.width, 10);
      }
    });

    // Tambahkan worksheet untuk detail status
    const detailWorksheet = workbook.addWorksheet("Status Details");

    detailWorksheet.columns = [
      { header: "No", key: "no", width: 5 },
      { header: "Global Index", key: "globalIndex", width: 15 },
      { header: "Instance Title", key: "instanceTitle", width: 30 },
      { header: "Status Title", key: "statusTitle", width: 25 },
      { header: "Status Description", key: "statusDesc", width: 30 },
      { header: "Completed", key: "completed", width: 12 },
      { header: "Completed By", key: "completedBy", width: 20 },
      { header: "Completed At", key: "completedAt", width: 20 },
      { header: "Verdict", key: "verdict", width: 15 },
      { header: "Rejected Reason", key: "rejectedReason", width: 30 },
    ];

    // Styling untuk header detail
    detailWorksheet.getRow(1).font = { bold: true };
    detailWorksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Tambahkan detail status
    let detailRowNo = 1;
    data.forEach((instance, index) => {
      instance.statuses.forEach((status, statusIndex) => {
        detailWorksheet.addRow({
          no: detailRowNo++,
          globalIndex: instance.globalIndex,
          instanceTitle: instance.instanceTitle,
          statusTitle: status.statusTitle,
          statusDesc: status.statusDesc,
          completed: status.completed ? "Yes" : "No",
          completedBy:
            status.completedBy?.username ||
            status.completedBy?.displayName ||
            "N/A",
          completedAt: status.completedAt
            ? status.completedAt.toLocaleString("id-ID", {
                timeZone: "Asia/Jakarta",
              })
            : "N/A",
          verdict: status.verdict,
          rejectedReason: status.rejectedReason || "N/A",
        });
      });
    });

    // Auto-fit kolom detail
    detailWorksheet.columns.forEach((column) => {
      if (column.width) {
        column.width = Math.max(column.width, 10);
      }
    });

    // Tambahkan summary worksheet
    const summaryWorksheet = workbook.addWorksheet("Summary");

    summaryWorksheet.columns = [
      { header: "Metric", key: "metric", width: 25 },
      { header: "Value", key: "value", width: 20 },
    ];

    // Styling untuk header summary
    summaryWorksheet.getRow(1).font = { bold: true };
    summaryWorksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE0E0E0" },
    };

    // Hitung summary
    const totatalInstances = data.length;
    const completedInstances = data.filter(
      (i) => i.overallStatus === "completed",
    ).length;
    const rejectedInstances = data.filter(
      (i) => i.overallStatus === "rejected",
    ).length;
    const inProgressInstances = data.filter(
      (i) => i.overallStatus === "in-progress",
    ).length;
    const draftInstances = data.filter(
      (i) => i.overallStatus === "draft",
    ).length;

    summaryWorksheet.addRow({
      metric: "Total Instances",
      value: totalInstances,
    });
    summaryWorksheet.addRow({ metric: "Completed", value: completedInstances });
    summaryWorksheet.addRow({ metric: "Rejected", value: rejectedInstances });
    summaryWorksheet.addRow({
      metric: "In Progress",
      value: inProgressInstances,
    });
    summaryWorksheet.addRow({ metric: "Draft", value: draftInstances });
    summaryWorksheet.addRow({
      metric: "Month",
      value: `${year}-${monthNumber.toString().padStart(2, "0")}`,
    });

    // Auto-fit kolom summary
    summaryWorksheet.columns.forEach((column) => {
      if (column.width) {
        column.width = Math.max(column.width, 10);
      }
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
  } catch (error) {
    throw new Error(`Failed to generate Excel file: ${error.message}`);
  }
};

export default generateExcelFile;
