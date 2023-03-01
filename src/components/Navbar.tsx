import { Outlet, Link, useNavigate } from "react-router-dom";
import { useRef } from "react";
import AuthService from "../services/authService";
import TokenService from "../services/tokenService";
import { IMAGE_LOC } from "../Constants";

function Navbar() {
  const auth = TokenService.getAccessToken();
  const collapsibleMenu = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const buttonStyle =
    "m-2 w-24 rounded-lg from-amber-400 to-amber-200 bg-gradient-to-t py-4 text-center text-lg lg:text-xl font-semibold shadow-lg transition duration-300 hover:ring-4 hover:ring-amber-200 hover:ring-offset-2 hover:ring-offset-amber-200 lg:m-3 xl:m-4 lg:w-36";
  const collapsibleMenuStyle =
    "block cursor-pointer border-y-2 border-slate-400 bg-slate-200 p-2 transition duration-300 hover:bg-amber-300 active:bg-amber-200";

  const showHideMenu = () => {
    collapsibleMenu.current?.classList.toggle("hidden");
  };

  const navigateBack = () => {
    navigate(-1);
  };

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="m-0 min-h-screen border-2 border-teal-300 bg-slate-400">
      <div className="flex w-full flex-col border-2 border-blue-400">
        <div className="flex h-20 w-full items-center justify-center md:h-32">
          <button
            className="group absolute left-4 flex h-10 transition duration-300 hover:h-12 md:h-16 hover:md:h-20 xl:left-8"
            onClick={navigateBack}
          >
            <img
              src={`${IMAGE_LOC}back_button.png`}
              alt="back"
              className="h-full w-full object-contain group-hover:hidden"
            />
            <img
              src={`${IMAGE_LOC}back_button_hover.png`}
              alt="back"
              className="hidden h-full w-full object-contain group-hover:flex"
            />
          </button>
          <div className="h-full w-1/2 p-2 md:w-1/3">
            <Link to="/">
              <img
                src={`${IMAGE_LOC}chess_logo_black.png`}
                alt="logo"
                className="h-full w-full object-contain"
              />
            </Link>
          </div>
          {auth && (
            <div className="absolute right-4 hidden md:flex xl:right-8">
              <Link to="/menu" className={buttonStyle}>
                MENU
              </Link>
              <Link to="/login" className={buttonStyle} onClick={handleLogout}>
                <button>LOGOUT</button>
              </Link>
              {/* <button onClick={handleLogout} className={buttonStyle}>
                LOGOUT
              </button> */}
            </div>
          )}
          {auth && (
            <button
              className="group absolute right-4 flex transition duration-300 md:hidden"
              onClick={showHideMenu}
            >
              <img
                src={`${IMAGE_LOC}menu.png`}
                alt="menu"
                className="h-full w-full object-contain group-hover:hidden"
              />
              <img
                src={`${IMAGE_LOC}menu_hover_thick.png`}
                alt="menu"
                className="hidden h-full w-full object-contain group-hover:flex"
              />
            </button>
          )}
        </div>
        <div ref={collapsibleMenu} className="hidden md:hidden">
          <Link
            to="/menu"
            className={collapsibleMenuStyle}
            onClick={showHideMenu}
          >
            MENU
          </Link>
          <Link
            to="/login"
            className={collapsibleMenuStyle}
            onClick={() => {
              showHideMenu();
              handleLogout();
            }}
          >
            <button>LOGOUT</button>
          </Link>
        </div>
      </div>
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;

// remove borders
// auth
