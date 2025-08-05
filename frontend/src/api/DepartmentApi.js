import axiosInstance from "./axiosInstance";

const DepartmentApi = {
  getAllDepartment: async () => {
    const res = await axiosInstance.get("/api/department/list");
    return res.data;
  },
  getById: async (id) => {
    const res = axiosInstance.get(`/api/department/findById/${id}`);
    return res.data;
  },
  create: async (data) => {
    const res = await axiosInstance.post("/api/department/create", data);
    return res.data;
  },
  edit: async (id, data) => {
    try {
      const res = await axiosInstance.put(`/api/department/edit/${id}`, data);
      return res.data;
    } catch (error) {
      throw error;
    }
  },
  delete: async (id) => {
    const res = axiosInstance.delete(`/api/department/delete/${id}`);
    return res.data;
  },
};

export default DepartmentApi;
