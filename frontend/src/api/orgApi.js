import axiosInstance from "./axiosInstance";

const OrgApi = {
  getAllOrg: async (q) => {
    const response = await axiosInstance.get(`/api/org/getAllOrg?search=${q}`);
    return response.data;
  },
};

export default OrgApi;
