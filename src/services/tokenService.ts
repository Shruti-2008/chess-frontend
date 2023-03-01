import { User } from "../utilities/commonInterfaces";

const getAccessToken = () => {
  const item = localStorage.getItem("chess_user");
  if (item) {
    const user = JSON.parse(item);
    if (user.access_token) {
      return user.access_token;
    }
  }
  return null;
};

const getRefreshToken = () => {
  const item = localStorage.getItem("chess_user");
  if (item) {
    const user = JSON.parse(item);
    if (user.refresh_token) {
      return user.refresh_token;
    }
  }
  return null;
};

const getUser = () => {
  const item = localStorage.getItem("chess_user");
  if (item) {
    return JSON.parse(item);
  }
  return null;
};

const setUser = (user: User) => {
  localStorage.setItem("chess_user", JSON.stringify(user));
};

const setAccessToken = (token: string) => {
  const item = localStorage.getItem("chess_user");
  const user = item
    ? JSON.parse(item)
    : { access_token: "", refresh_token: "" };
  user.access_token = token;
  localStorage.setItem("chess_user", JSON.stringify(user));
};

const removeUser = () => {
  localStorage.removeItem("chess_user");
};

const TokenService = {
  getRefreshToken,
  getAccessToken,
  setAccessToken,
  getUser,
  setUser,
  removeUser,
};

export default TokenService;
