import { createContext, useState } from "react";

type providerProps = {
  children?: React.ReactNode;
};

// interface UserAuth {
//     email: string
//     id: number
//     accessToken: string
// }

interface contextProps {
  auth: string; //UserAuth
  setAuth: (auth: string /*UserAuth*/) => void;
}

const AuthContext = createContext<contextProps>({
  auth: "",
  setAuth: () => {},
}); //{email:"", id:0, accessToken:""}

export const AuthProvider = ({ children }: providerProps) => {
  const [auth, setAuth] = useState<string /*UserAuth*/>(""); //{email:"", id:0, accessToken:""}
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
