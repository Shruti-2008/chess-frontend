import { Outlet, Link } from "react-router-dom"
import { useContext } from "react"
import AuthContext from "../context/AuthProvider"

function Navbar() {
    const { auth, setAuth } = useContext(AuthContext)
    const styles={
            backgroundImage: "url(../../assets/images/chess_logo_black.png)",
        }

        // {w-1/2 md:w-1/4} 
    return (
        <div className="bg-slate-400 h-screen flex flex-col items-center">
            <div className="w-full h-1/6 flex items-center justify-end bg-no-repeat bg-center bg-contain border-2 border-red-500" style={styles}> 
            {auth &&
                    <div className="flex flex-row items-center border-4 border-green-400">
                        <Link to="/menu" className="bg-amber-300 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">MENU</Link>
                        <Link to="/login" className="bg-amber-300 px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">
                            <button onClick={e => setAuth("")}>LOGOUT</button>
                        </Link>
                    </div>} 
                    {/* <Link to="/">
                        <img src="../../assets/images/chess_logo_black.png" alt="logo"></img>
                    </Link> */}
                </div>
            {/*<div className="flex items-center border-2 border-red-500">
                 <div className="border-4 border-amber-400 flex-1">
                    <div className="w-1/2 p-2 md:w-2/4 ">
                        <Link to="/">
                            <img src="../../assets/images/chess_logo_black.png" alt="logo"></img>
                        </Link>
                    </div>
                </div>
                {auth &&
                    <div className="flex flex-row justify-end m-12 border-4 border-green-400">
                        <Link to="/menu" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">MENU</Link>
                        <Link to="/login" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">
                            <button onClick={e => setAuth("")}>LOGOUT</button>
                        </Link>
                    </div>} 
            </div>*/}
            <Outlet />
        </div>
    )
}

export default Navbar