import React from "react";
// import user from "../../assets/images/user.png"
// import menu from "../../assets/images/menu.png"

 function Header(){
    return(
        <nav className="grow-0 bg-slate-400 h-fit flex ">
            <img src="../../assets/images/menu.png" alt="menu" className="object-contain p-1 ml-2 "/>
            <p className="text-center  font-bold text-2xl text-white p-2 flex-auto">Chess.com</p>
            <img src="../../assets/images/user.png" alt="profile" className="object-contain w-12 p-1 mr-2"/>
        </nav>
    )
 }
 export default Header