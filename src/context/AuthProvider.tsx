import { createContext, useState } from "react"

type providerProps = {
    children?: React.ReactNode
}

interface contextProps {
    auth: string
    setAuth: (auth: string) => void
}

const AuthContext = createContext<contextProps>({ auth: "", setAuth: () => { } })

export const AuthProvider = ({ children }: providerProps) => {
    const [auth, setAuth] = useState<string>("")
    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext