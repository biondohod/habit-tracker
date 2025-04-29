import axios from "axios";
import { jwtDecode } from "jwt-decode";
import getCookie from "../helpers/getCookie";

const axiosJwt = axios.create();
axiosJwt.defaults.withCredentials = true;

const URL = "/api";

// User api
export const apiRefreshToken = async () => {
  const res = await axiosJwt.get(`${URL}/user/refresh`);
  return res.data;
};

axiosJwt.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const code = error?.response?.data?.code;
    if (
      code === "TOKEN_EXPIRED" &&
      !originalRequest._retry &&
      !originalRequest.url.endsWith("/user/refresh")
    ) {
      originalRequest._retry = true;
      try {
        await apiRefreshToken();
        return axiosJwt(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export const apiLogin = async ({ email, password }) => {
  const res = await axios.post(`${URL}/user/login`, { email, password });
  return res.data;
};

export const apiRegister = async ({ email, password, name }) => {
  const res = await axios.post(`${URL}/user/register`, {
    email,
    password,
    name,
  });
  return res.data;
};

export const apiGetUser = async () => {
  const res = await axiosJwt.get(`${URL}/user/get`);
  return res.data;
};

export const apiLogout = async () => {
  const res = await axiosJwt.post(`${URL}/user/logout`);
  return res.data;
};

export const apiDeleteUser = async (id) => {
  const res = await axios.delete(`/api/user/delete/${id}`, {
    withCredentials: true,
  });
  return res.data;
};

// Habit api
export const apiCreateHabit = async (habit) => {
  const res = await axiosJwt.post(`${URL}/habit`, habit, {
    withCredentials: true,
  });
  return res.data;
};

export const apiGetHabits = async () => {
  const res = await axiosJwt.get(`${URL}/habit`);
  return res.data;
};

export const apiGetHabit = async (id) => {
  const res = await axiosJwt.get(`${URL}/habit/${id}`);
  return res.data;
};

export const apiUpdateHabit = async (id, habit) => {
  const res = await axiosJwt.patch(`${URL}/habit/${id}`, habit);
  return res.data;
};

export const apiDeleteHabit = async (id) => {
  const res = await axiosJwt.delete(`${URL}/habit/${id}`);
  return res.data;
};
