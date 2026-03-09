import axiosInstance from "./axiosInstance";

const flowInstanceApi = {
  getFlowInstanceById: async (id) => {
    if (!id) {
      throw new Error("ID is required");
    }
    const res = await axiosInstance.get(
      `/api/flowInstance/flowInstanceById/${id}`,
    );
    return res.data;
  },
  //untuk membuat baru dan mengedit request
  requestNewFlowInstance: async ({
    instanceTitle,
    flowTemplateId,
    overallStatus,
    requestData,
    selectedAuthorized,
  }) => {
    const res = await axiosInstance.post(`/api/flowInstance/request/new`, {
      instanceTitle,
      flowTemplateId,
      overallStatus,
      requestData,
      selectedAuthorized,
    });
    return res.data;
  },
  // getFlowInstanceList menerima query string hasil serialisasi filter, hasilnya array data
  getFlowInstanceList: async ({ query }) => {
    try {
      const res = await axiosInstance.get(
        `/api/flowInstance/getFlowInstanceList?${query}`,
      );
      return res.data;
    } catch (error) {
      throw Error(error);
    }
  },
  editRequestFlowInstance: async ({
    instanceId,
    instanceTitle,
    overallStatus,
    requestData,
  }) => {
    const res = await axiosInstance.put(
      `/api/flowInstance/edit/${instanceId}`,
      {
        instanceTitle,
        overallStatus,
        requestData,
      },
    );
    return res.data;
  },
  submitStatusFulfillment: async (instanceId, statuses, selectedAuthorized) => {
    const res = await axiosInstance.post(
      `/api/flowInstance/submitStatusFulfillment/${instanceId}`,
      { statuses, selectedAuthorized },
    );
    return res.data;
  },
  delete: async (instanceId) => {
    const res = await axiosInstance.delete(
      `/api/flowInstance/delete/${instanceId}`,
    );
    return res.data;
  },
  downloadFlowInstanceByMonth: async (month) => {
    const res = await axiosInstance.get(`/api/flowInstance/download/${month}`, {
      responseType: "blob", // Penting untuk download file
    });

    // Buat blob dan download
    const blob = new Blob([res.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Buat URL untuk download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `process-history-${month}.xlsx`;

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },

  downloadFlowInstanceDetail: async (body) => {
    const res = await axiosInstance.post(
      `/api/flowInstance/download-detail`,
      body,
      {
        responseType: "blob", // ✅ penting untuk download file
      },
    );

    // Pastikan ini beneran file Excel, bukan JSON error
    const contentType = res.headers["content-type"];
    if (!contentType.includes("spreadsheetml")) {
      // Konversi blob ke text untuk lihat error
      const text = await res.data.text();
      throw new Error(`Download gagal: ${text}`);
    }

    // Buat blob dan download
    // Note: Backend sudah memfilter kolom dengan keysType === "image" untuk mengurangi ukuran file
    const blob = new Blob([res.data], {
      type: contentType,
    });

    // Nama file: ambil dari header kalau ada, atau fallback
    const contentDisposition = res.headers["content-disposition"];
    let filename = `process-history.xlsx`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) filename = match[1];
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  downloadFlowInstanceDetailTableColum: async (body) => {
    const res = await axiosInstance.post(
      `/api/flowInstance/download-detail-table-column`,
      body,
      {
        responseType: "blob", // ✅ penting untuk download file
      },
    );

    // Pastikan ini beneran file Excel, bukan JSON error
    const contentType = res.headers["content-type"];
    if (!contentType.includes("spreadsheetml")) {
      // Konversi blob ke text untuk lihat error
      const text = await res.data.text();
      throw new Error(`Download gagal: ${text}`);
    }

    // Buat blob dan download
    // Note: Backend sudah memfilter kolom dengan keysType === "image" untuk mengurangi ukuran file
    const blob = new Blob([res.data], {
      type: contentType,
    });

    // Nama file: ambil dari header kalau ada, atau fallback
    const contentDisposition = res.headers["content-disposition"];
    let filename = `process-history.xlsx`;
    if (contentDisposition) {
      const match = contentDisposition.match(/filename="?(.+)"?/);
      if (match) filename = match[1];
    }

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    return { success: true };
  },
  getMyTasks: async () => {
    const res = await axiosInstance.get(`/api/flowInstance/my-tasks`);
    return res.data;
  },
  undo_1_step: async (instanceId, targetStatusIndex) => {
    const res = await axiosInstance.put(
      `/api/flowInstance/undo/${instanceId}`,
      {
        targetStatusIndex,
      },
    );
    return res.data;
  },
  rollback: async (instanceId) => {
    const res = await axiosInstance.put(`/api/flowInstance/undo/${instanceId}`);
    return res.data;
  },
  getMyStats: async ({ startDate, endDate }) => {
    const query = `startDate=${startDate}&endDate=${endDate}`;
    const res = await axiosInstance.get(`/api/flowInstance/my-stats?` + query);
    return res.data;
  },
  getDepartmentStats: async ({ orgId, startDate, endDate, departmentId = "all" }) => {
    const query = `orgId=${orgId}&startDate=${startDate}&endDate=${endDate}&departmendId=${departmentId}`;
    const res = await axiosInstance.get(`/api/superadmin/department-stats?` + query);
    return res.data;
  },
};

export default flowInstanceApi;
