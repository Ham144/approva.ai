import axiosInstance from "./axiosInstance";

const FileApi = {
  uploadImage: async (formData) => {
    const res = await axiosInstance.post("/api/file/upload/img", formData);
    return res.data;
  },

  downloadFile: async (filename) => {
    const res = await axiosInstance.get(`/api/file/download/${filename}`, {
      responseType: "blob",
    });
    return res.data;
  },

  getFileUrl: (filename) => {
    return `${axiosInstance.defaults.baseURL}/api/file/${filename}`;
  },
};

export default FileApi;
