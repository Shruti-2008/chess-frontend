import { Link } from "react-router-dom";
import TokenService from "../services/tokenService";
import AuthService from "../services/authService";
import { IMAGE_LOC } from "../Constants";

function Home() {
  const auth = TokenService.getAccessToken();
  const buttonStyle =
    "w-full rounded-lg from-amber-400 to-amber-200 bg-gradient-to-t px-6 py-4 text-center text-lg font-semibold shadow-lg transition duration-300 hover:ring-4 hover:ring-amber-200 hover:ring-offset-2 hover:ring-offset-amber-200 md:w-40";

  const handleLogout = () => {
    AuthService.logout();
  };

  return (
    <div className="flex min-h-screen flex-col-reverse justify-center gap-4 bg-slate-400 py-12 md:flex-col">
      <div className="flex flex-col items-center justify-center gap-4 px-12 md:flex-row md:justify-end lg:gap-8 lg:px-32 xl:px-44">
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
      <div className="m-auto flex w-10/12 flex-1 items-center justify-center md:w-3/4">
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
