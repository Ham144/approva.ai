import axiosInstance from "./axiosInstance";

export const login = async (body) => {
  const response = await axiosInstance.post(`/api/auth/login/ldap`, body);
  return response?.data;
};

export const createNewUser = async (body) => {
  const response = await axiosInstance.post(`/api/auth/createNewUser`, body);
  return response.data;
};

export const getUserInfo = async () => {
  try {
    const response = await axiosInstance.get(`/api/auth/getUserInfo`);
    return response?.data;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getAllAccount = async () => {
  const response = await axiosInstance.get(`/api/auth/getAllAccount`);
  return response.data;
};

export const updateUser = async (body) => {
  const response = await axiosInstance.put(`/api/auth/updateUser`, body);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/auth/getUserById/${id}`);
  return response?.data;
};

export const logout = async () => {
  const response = await axiosInstance.delete(`/api/auth/logout`);
  return response.data;
};
