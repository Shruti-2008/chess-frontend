import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { UserStats } from "../utilities/commonInterfaces";
import GameService from "../services/gameService";
import AuthService from "../services/authService";

function UserProfile() {
  const [stats, setStats] = useState<UserStats[]>([
    { result: "played", count: 0 },
    { result: "won", count: 0 },
    { result: "lost", count: 0 },
    { result: "tie", count: 0 },
  ]);
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      GameService.getUserStats()
        .then((response) => {
          setStats(response);
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server");
          } else if (error.response && error.response?.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response?.status === 400) {
            // technical database details exposed
            setErrorText(error.response.data.detail);
          } else {
            setErrorText("Unexpected error occured");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured");
    }
  }, []);

  const styleHeader =
    "rounded-lg bg-gradient-to-b from-slate-400 to-slate-500 p-2 font-medium uppercase text-white text-lg shadow-slate-400 drop-shadow-xl ";

  let statsList: JSX.Element[] = [];
  stats?.forEach((stat, idx) => {
    statsList.push(
      <div
        className="flex grow basis-1/3 flex-col gap-4 rounded-lg bg-slate-200 p-4 text-center shadow-lg shadow-slate-100"
        key={idx}
      >
        <div className={styleHeader}>{stat.result}</div>
        <div className="">
          <p className="text-2xl font-medium">{stat.count}</p>
        </div>
      </div>
    );
  });

  const errorPageProps = {
    obj: "game statistics",
    errorText: errorText,
  };

  return errorText ? (
    <ErrorPage {...errorPageProps} />
  ) : (
    <div className="flex w-full flex-col items-center justify-center gap-8 p-4 pt-8">
      <div className=" w-full rounded-xl bg-gradient-to-b from-amber-400 to-amber-200 p-4 text-center text-2xl font-semibold shadow-inner shadow-amber-200 md:w-2/3 lg:w-3/5">
        My Statistics
      </div>
      <div className="flex w-full flex-col flex-wrap justify-between gap-8 md:w-2/3 md:flex-row lg:w-3/5">
        {statsList}
      </div>
    </div>
  );
}
export default UserProfile;

// check with 1, 2, 3, 4 tiles
