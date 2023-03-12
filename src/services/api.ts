import axios, { RawAxiosRequestHeaders } from "axios";
import TokenService from "./tokenService";

const API_URL = process.env.REACT_APP_API_URL;
const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
  },
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers = { ...config.headers } as RawAxiosRequestHeaders; //AxiosHeaders;
      config.headers["Authorization"] = `Bearer ${token}`;
      //config.headers.set("Authorization", `Bearer ${token}`);
      //instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      //instance.defaults.headers.common["Authorization"] = null;
    }
    if (config.url === "/logout") {
      TokenService.removeUser();
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;
    if (error.response) {
      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        try {
          const token = TokenService.getRefreshToken();
          if (token) {
            const payload = await instance.post("/refresh", {
              refresh_token: token,
            });
            if (payload.data.access_token) {
              TokenService.setAccessToken(payload.data.access_token);
              originalConfig.headers.Authorization =
                "Bearer " + payload.data.access_token;
              return instance(originalConfig);
            } else {
              TokenService.removeUser();
              return Promise.reject(error);
            }
          }
        } catch (e) {
          return Promise.reject(e);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
