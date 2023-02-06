import { Outlet, Link, useNavigate } from "react-router-dom"
import { useContext, useRef } from "react"
import AuthContext from "../context/AuthProvider"

function Navbar() {

    const { auth, setAuth } = useContext(AuthContext)
    const collapsibleMenu = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const buttonStyle = "w-24 lg:w-32 px-4 py-4 lg:px-8 m-2 lg:m-4 text-lg text-center font-semibold rounded-lg shadow-lg bg-amber-300 hover:bg-amber-400 transition duration-300"
    const collapsibleMenuStyle = " block p-2 bg-slate-200 border-y-2 border-slate-400 hover:bg-amber-300 active:bg-amber-200 transition duration-300"

    const showHideMenu = () => {
        collapsibleMenu.current?.classList.toggle("hidden")
    }

    const navigateBack = () => {
        navigate(-1)
    }

    return (
        <div className="bg-slate-400 m-0 min-h-screen border-2 border-teal-300">
            <div className="w-full flex flex-col border-blue-400 border-2">
                <div className="w-full flex justify-center items-center h-20 md:h-32 border-2 border-pink-400">
                    <button className="group flex absolute left-4 h-10 md:h-16 transition duration-300" onClick={navigateBack}>
                        <img
                            src="../../assets/images/back_button.png"
                            alt="back"
                            className="object-contain w-full h-full group-hover:hidden" />
                        <img
                            src="../../assets/images/back_button_hover.png"
                            alt="back"
                            className="object-contain w-full h-full hidden group-hover:flex" />
                    </button>
                    <div className="p-2 w-1/2 md:w-1/3 h-full border-2 border-green-400">
                        <Link to="/">
                            <img
                                src="../../assets/images/chess_logo_black.png"
                                alt="logo"
                                className="object-contain w-full h-full"></img>
                        </Link>
                    </div>
                    {
                        auth &&
                        <div className="absolute right-4 hidden md:flex">
                            <Link to="/menu" className={buttonStyle}>MENU</Link>
                            <Link to="/login" className={buttonStyle}>
                                <button onClick={e => setAuth("")}>LOGOUT</button>
                            </Link>
                        </div>
                    }
                    {
                        auth &&
                        <button className="flex md:hidden absolute right-4" onClick={showHideMenu}>
                            <img
                                src="../../assets/images/menu.png"
                                alt="menu"
                                className="object-contain w-full h-full" />
                        </button>
                    }
                </div>
                <div ref={collapsibleMenu} className="hidden md:hidden border-2 border-green-400">
                    <Link
                        to="/menu"
                        className={collapsibleMenuStyle}
                        onClick={showHideMenu}>
                        MENU
                    </Link>
                    <Link
                        to="/login"
                        className={collapsibleMenuStyle}
                        onClick={showHideMenu}>
                        <button onClick={e => setAuth("")}>LOGOUT</button>
                    </Link>
                </div>
            </div>
            <div className="w-full border-0 border-sky-400">
                <Outlet />
            </div>
        </div>
    )
}

export default Navbar