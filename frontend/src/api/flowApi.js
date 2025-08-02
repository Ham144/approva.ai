import axiosInstance from "./axiosInstance";

//ini TEPLATE untuk EDITOR bukan untuk user, untuk user flowInstanceApi
const flowApi = {
  getFlowById: async (id) => {
    if (!id) {
      throw new Error("ID is required");
    }
    try {
      const res = await axiosInstance.get(`/api/flow/getFlowById/${id}`);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  createFlowAndPoint: async (body) => {
    try {
      const res = await axiosInstance.post(`/api/flow/createFlow`, body);
      return res.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getAllFlowNameAndDesc: async (searchKey = "") => {
    try {
      const params = searchKey ? { searchKey } : {};
      const response = await axiosInstance.get(`/api/flow/list/forOwner`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  getAllFlowNameAndDescForRequest: async (searchKey = "") => {
    try {
      const params = searchKey ? { searchKey } : {};
      const response = await axiosInstance.get(`/api/flow/list/forRequest`, {
        params,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  updateFlowAndDesc: async (id, body) => {
    try {
      const response = await axiosInstance.put(`/api/flow/update/${id}`, body);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
  duplicateFlow: async (id) => {
    const res = await axiosInstance.post(`/api/flow/duplicate/${id}`);
    return res.data;
  },
  getAllFlowForLibrary: async () => {
    const res = await axiosInstance.get(`/api/flow/list/forLibrary`);
    return res.data;
  },
  deleteFlow: async (id) => {
    const res = await axiosInstance.delete(`/api/flow/delete/${id}`);
    return res.data;
  },
};

export default flowApi;
