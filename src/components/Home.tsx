import { Link } from "react-router-dom";
import TokenService from "../services/tokenService";
import AuthService from "../services/authService";
import { IMAGE_LOC } from "../Constants";

function Home() {
  const auth = TokenService.getAccessToken();
  const buttonStyle =
    "w-full rounded-lg bg-amber-300 px-8 py-4 text-center text-xl xl:text-2xl font-semibold shadow-lg transition duration-300 hover:bg-amber-400 md:w-44";
  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="flex min-h-screen flex-col-reverse justify-center bg-slate-400 md:flex-col ">
      <div className="flex flex-col items-center justify-center gap-4 px-12 py-6 pt-12 md:flex-row md:justify-end lg:gap-8">
        {auth ? (
          <>
            <Link to="/menu" className={buttonStyle}>
              MENU
            </Link>
            <Link to="/login" className={buttonStyle} onClick={handleLogout}>
              <button>LOGOUT</button>
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className={buttonStyle}>
              LOGIN
            </Link>
            <Link to="/register" className={buttonStyle}>
              REGISTER
            </Link>
          </>
        )}
      </div>
      <div className="m-auto flex w-3/4 flex-1 items-center justify-center p-2">
        <img
          src={`${IMAGE_LOC}chess_logo_black.png`}
          alt="logo"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
}

export default Home;
