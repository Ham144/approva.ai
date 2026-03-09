import axiosInstance from "./axiosInstance";

const OrgApi = {
  getAllOrg: async (q) => {
    const response = await axiosInstance.get(`/api/org/getAllOrg?search=${q}`);
    return response.data;
  },
  getAllOrgSuperTenant: async (q) => {
    const response = await axiosInstance.get(
      `/api/superadmin/getAllOrgSuperTenant?search=${q}`,
    );
    return response.data;
  },
  disableOrg: async (_id) => {
    const response = await axiosInstance.delete(
      `/api/superadmin/disableOrg/${_id}`,
    );
    return response.data;
  },
  deleteOrg: async (_id) => {
    const response = await axiosInstance.delete(
      `/api/superadmin/deleteOrg/${_id}`,
    );
    return response.data;
  },
  createOrgApi: async (body) => {
    const response = await axiosInstance.post(
      "/api/superadmin/createOrg",
      body,
    );
    return response.data;
  },
  getMyOrg: async (_id) => {
    const response = await axiosInstance.get(`/api/org/getOrgById/${_id}`);
    return response.data;
  },
};

export default OrgApi;
