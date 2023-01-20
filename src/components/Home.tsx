import { Link, Outlet } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthProvider"
function Home() {
    const { auth, setAuth } = useContext(AuthContext)
    console.log(auth)
    return (
        <div className="bg-slate-400 h-screen flex flex-col justify-center">
            <div className="flex flex-row justify-end m-12">
                {auth
                    ? <>
                    <Link to="/menu" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">MENU</Link>
                    <Link to="/login" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">
                        <button onClick={e => setAuth("")}>LOGOUT</button>
                    </Link>
                    </>
                    : <>
                        <Link to="/login" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">LOGIN</Link>
                        <Link to="/register" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">REGISTER</Link>
                    </>}
            </div>
            <div className="w-3/4 m-auto">
                <img src="../../assets/images/chess_logo_black.png" alt="logo" />
            </div>


            <Outlet />
        </div>
    )
}

export default Home