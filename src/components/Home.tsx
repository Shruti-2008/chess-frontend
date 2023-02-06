import { Link } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthProvider"

function Home() {
    const { auth, setAuth } = useContext(AuthContext)
    const buttonStyle = "w-full md:w-44 px-8 py-4 text-center text-xl font-semibold rounded-lg shadow-lg bg-amber-300 hover:bg-amber-400 transition duration-300"

    return (
        <div className="bg-slate-400 min-h-screen flex flex-col-reverse md:flex-col justify-center ">
            <div className="flex flex-col md:flex-row items-center justify-center md:justify-end gap-4 px-12 py-6 border-2 border-blue-500 ">
                {auth
                    ? <>
                        <Link
                            to="/menu"
                            className={buttonStyle}>
                            MENU
                        </Link>
                        <Link
                            to="/login"
                            className={buttonStyle}>
                            <button onClick={e => setAuth("")}>LOGOUT</button>
                        </Link>
                    </>
                    : <>
                        <Link
                            to="/login"
                            className={buttonStyle}>
                            LOGIN
                        </Link>
                        <Link
                            to="/register"
                            className={buttonStyle}>
                            REGISTER
                        </Link>
                    </>}
            </div>
            <div className="flex-1 w-3/4 m-auto p-2 flex items-center justify-center border-2 border-red-500">
                <img
                    src="../../assets/images/chess_logo_black.png"
                    alt="logo"
                    className="object-contain w-full h-full"
                />
            </div>
        </div>
    )
}

export default Home