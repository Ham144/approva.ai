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
  }) => {
    const res = await axiosInstance.post(`/api/flowInstance/request/new`, {
      instanceTitle,
      flowTemplateId,
      overallStatus,
      requestData,
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
  submitStatusFulfillment: async (instanceId, statuses) => {
    const res = await axiosInstance.post(
      `/api/flowInstance/submitStatusFulfillment/${instanceId}`,
      statuses
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
    const res = await axiosInstance.get(`/api/flowInstance/download/${month}`);
    return res.data;
  },
  getMyTasks: async () => {
    const res = await axiosInstance.get(`/api/flowInstance/my-tasks`);
    return res.data;
  },
  rollback: async (instanceId) => {
    const res = await axiosInstance.put(
      `/api/flowInstance/rollback/${instanceId}`
    );
    return res.data;
  },
};

export default flowInstanceApi;
