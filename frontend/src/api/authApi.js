import axiosInstance from "./axiosInstance";

//login LDAP
export const loginLdap = async (body) => {
  const response = await axiosInstance.post(`/api/auth/login/ldap`, body);
  return response?.data;
};

export const loginApp = async (body) => {
  const response = await axiosInstance.post(`/api/auth/login/app`, body);
  return response?.data;
};

export const register = async (body) => {
  const response = await axiosInstance.post(
    "/api/auth/multi-tenant/register",
    body
  );
  return response?.data;
};

export const createAppUser = async (body) => {
  const response = await axiosInstance.post("/api/auth/createAppUser", body);
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

//mostly update role
export const updateUser = async (body) => {
  const response = await axiosInstance.put(`/api/auth/updateUser`, body);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axiosInstance.get(`/api/auth/getUserById/${id}`);
  return response?.data;
};

export const takeOverUser = async (body) => {
  const res = await axiosInstance.put(`/api/auth/takeOverUser`, body);
  return res.data;
};

export const switchOrg = async (body) => {
  const res = await axiosInstance.post(`/api/auth/switchOrg`, body);
  return res.data;
};

export const deleteAppUser = async (id) => {
  const response = await axiosInstance.delete(`/api/auth/deleteAppUser/${id}`);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.delete(`/api/auth/logout`);
  return response.data;
};
