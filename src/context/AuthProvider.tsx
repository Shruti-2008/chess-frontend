import { createContext, useState } from "react"

type Props = {
    children?: React.ReactNode
}

interface contextProps{
    auth: string
    setAuth:(auth: string)=>void
}


const AuthContext = createContext<contextProps>({auth:"",setAuth:()=>{}})

export const AuthProvider = ({ children } : Props) => {

    const [auth, setAuth] = useState("")

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext