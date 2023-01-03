import {Link, Outlet} from "react-router-dom"
function Home(){
    return(
        <div className="bg-slate-400 h-screen flex flex-col justify-center">
            <div className="flex flex-row justify-end m-12">
            <Link to="/login" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">Login</Link>
            <Link to="/register" className="bg-amber-300 px-8 py-4 text-xl font-semibold rounded-lg shadow-lg hover:bg-amber-400 m-4">Register</Link>
            </div>
            <div className="w-3/4 m-auto">
                <img src="../../assets/images/chess_logo_black.png"/>
            </div>
            
            
            <Outlet />
        </div>
    )
}

export default Home