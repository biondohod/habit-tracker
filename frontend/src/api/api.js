import axios from "axios";
import { jwtDecode } from "jwt-decode";
import getCookie from "../helpers/getCookie";

const axiosJwt = axios.create();
axiosJwt.defaults.withCredentials = true;

const URL = "/api";

export const apiRefreshToken = async () => {
  const res = await axios.get(`${URL}/refresh`, { withCredentials: true });
  return res.data;
};

axiosJwt.interceptors.request.use(
  async (config) => {
    const accessToken = getCookie("accessToken");
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      const currentDate = new Date();
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        await apiRefreshToken();
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
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
