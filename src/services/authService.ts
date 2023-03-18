import api from "./api";
import TokenService from "./tokenService";

const login = async (email: string, password: string) => {
  const bodyFormData = new FormData();
  bodyFormData.append("username", email);
  bodyFormData.append("password", password);

  const response = await api.post("/login", bodyFormData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  TokenService.setUser({ ...response.data, username: email });
  return response;
};

const logout = () => {
  const token = TokenService.getRefreshToken();
  if (token) {
    api.post("/logout", { refresh_token: token });
  }
  //TokenService.removeUser();
};

const signup = async (email: string, password: string) => {
  const response = await api.post("/users/", { email, password });
  TokenService.setUser({ ...response.data, username: email });
  return response;
};

const AuthService = {
  api,
  login,
  signup,
  logout,
};

export default AuthService;
