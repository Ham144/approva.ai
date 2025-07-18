import axiosInstance from "./axiosInstance";

const configApi = {
  getConfigAD: async () => {
    const response = await axiosInstance.get(`/api/config/ad`);
    return response.data;
  },
  updateConfigAD: async (body) => {
    const response = await axiosInstance.put(`/api/config/ad`, body);
    return response.data;
  },
  getConfigSMTP: async () => {
    const res = await axiosInstance.get("/api/config/smtp");
    return res.data;
  },
  updateConfigSMTP: async (body) => {
    const res = await axiosInstance.put("/api/config/smtp", body);
    return res.data;
  },
  testConfigSMTP: async (body) => {
    const res = await axiosInstance.post("/api/config/smtp/test", body);
    return res.data;
  },
  getConfigOrganization: async (body) => {
    const res = await axiosInstance.get("/api/config/organization");
    return res.data;
  },
  updateConfigOrganization: async (body) => {
    const res = await axiosInstance.put("/api/config/organization", body);
    return res.data;
  },
};

export default configApi;
