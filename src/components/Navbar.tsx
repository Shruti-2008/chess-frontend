import {Outlet, Link} from "react-router-dom"

function Navbar() {
    return (
        <div className="bg-slate-400 p">
            <div className="w-1/2 m-auto p-2 md:w-1/4">
                <Link to="/">
                    <img src="../../assets/images/chess_logo_black.png" ></img>
                </Link>
            </div>
            <Outlet />
        </div>
    )
}

export default Navbar