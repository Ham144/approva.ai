import axiosInstance from "./axiosInstance";

const FlexSourceDataApi = {
  getAllSourceData: async (search) => {
    const res = await axiosInstance.get(
      `/api/flexSourceData/getAllSourceData/${search}`
    );
    return res.data;
  },
  getSourceDataById: async (id) => {
    if (!id) return;
    const res = await axiosInstance.get(
      `/api/flexSourceData/getSourceDataById/${id}`
    );
    return res.data;
  },
  getSourceDataByIdPost: async (id) => {
    if (!id) return;
    const res = await axiosInstance.post(
      `/api/flexSourceData/getSourceDataByIdPost`,
      {
        id,
      }
    );
    return res.data;
  },
  createSourceData: async (body) => {
    try {
      const res = await axiosInstance.post(
        `/api/flexSourceData/createSourceData`,
        body
      );
      return res.data;
    } catch (error) {
      return error;
    }
  },
  editSourceData: async (id, body) => {
    console.log(id, body);
    const res = await axiosInstance.put(
      `/api/flexSourceData/editSourceData/${id}`,
      body
    );
    return res.data;
  },
  deleteSourceData: async (id) => {
    const res = await axiosInstance.delete(
      `/api/flexSourceData/deleteSourceData/${id}`
    );
    return res.data;
  },
};

export default FlexSourceDataApi;
