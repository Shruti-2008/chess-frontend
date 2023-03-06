import { Outlet, Navigate } from "react-router-dom";
import TokenService from "../services/tokenService";

const Protected = () => {
  const auth = TokenService.getAccessToken();
  return auth ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default Protected;
