import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import AuthContext from "../context/AuthProvider";
import TokenService from "../services/tokenService";

const Protected = () => {
  //const { auth } = useContext(AuthContext);
  const auth = TokenService.getAccessToken();
  return auth ? <Outlet /> : <Navigate to="/login" replace={true} />;
};

export default Protected;

// auth
