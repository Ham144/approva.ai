import axiosInstance from "./axiosInstance";

const flowInstanceApi = {
  getFlowInstanceById: async (id) => {
    if (!id) {
      throw new Error("ID is required");
    }
    const res = await axiosInstance.get(
      `/api/flowInstance/flowInstanceById/${id}`
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
        `/api/flowInstance/getFlowInstanceList?${query}`
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
      }
    );
    return res.data;
  },
  submitStatusFulfillment: async (instanceId, statuses, selectedAuthorized) => {
    const res = await axiosInstance.post(
      `/api/flowInstance/submitStatusFulfillment/${instanceId}`,
      { statuses, selectedAuthorized }
    );
    return res.data;
  },
  delete: async (instanceId) => {
    const res = await axiosInstance.delete(
      `/api/flowInstance/delete/${instanceId}`
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
  getMyTasks: async () => {
    const res = await axiosInstance.get(`/api/flowInstance/my-tasks`);
    return res.data;
  },
  undo_1_step: async (instanceId) => {
    const res = await axiosInstance.put(`/api/flowInstance/undo/${instanceId}`);
    return res.data;
  },
  rollback: async (instanceId) => {
    const res = await axiosInstance.put(`/api/flowInstance/undo/${instanceId}`);
    return res.data;
  },
};

export default flowInstanceApi;
