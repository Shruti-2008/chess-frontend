import {useContext} from "react"
import { Outlet, Navigate } from "react-router-dom"
import AuthContext from "../context/AuthProvider"

const Protected = () =>{
    const {auth} = useContext(AuthContext)
    return auth ? <Outlet/> : <Navigate to="/login" replace={true} />
}

export default Protected