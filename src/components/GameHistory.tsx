import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import GameService from "../services/gameService";
import { GameOverview } from "../utilities/commonInterfaces";
import AuthService from "../services/authService";
import { IMAGE_LOC } from "../Constants";

function GameHistory() {
  const navigate = useNavigate();
  const [gameHistory, setGameHistory] = useState<GameOverview[]>([]);
  const [errorText, setErrorText] = useState("");

  const gridHeaderStyle =
    "border-b-4 border-slate-400 border-collapse md:text-lg lg:text-xl xl:text-2xl font-bold bg-gradient-to-b from-amber-400 to-amber-200 p-2 text-center lg:p-6 md:p-4 flex items-center justify-center";
  const gridItemStyle =
    "border-b-2 border-slate-400 border-collapse bg-slate-200 text-center p-2 group-hover:bg-gradient-to-b group-hover:from-amber-200 group-hover:to-amber-50 group-hover:border-y-4 group-hover:border-amber-200 transition duration-300 md:text-lg lg:text-xl xl:text-2xl lg:p-8 md:p-4";

  useEffect(() => {
    try {
      GameService.getConcludedGames()
        .then((games) => setGameHistory(games))
        .catch((error) => {
          if (!error?.response && error.request) {
            setErrorText("No response from server!");
          } else if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response.status === 400) {
            //technical database details exposed
            setErrorText(error.response.data.detail);
          } else {
            setErrorText("Unexpected error occured!");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured!");
    }
  }, []);

  const errorPageProps = {
    obj: "game history",
    errorText: errorText,
  };

  let gridTiles: JSX.Element[] = [];
  gameHistory.forEach((game, i) => {
    gridTiles.push(
      <Link
        to={`/history/${game.id}`}
        className="group contents"
        key={game.id.toString()}
      >
        <div
          className={`${gridItemStyle} flex flex-col gap-2 rounded-l-lg group-hover:border-l-4`}
        >
          <div className="flex flex-row items-center gap-4">
            <img
              src={`${IMAGE_LOC}spot_w.png`}
              alt="white color"
              className="h-6 w-6 border-2 border-amber-400"
            />
            <p>{game.whitePlayer}</p>
          </div>
          <div className="flex flex-row items-center gap-4">
            <img
              src={`${IMAGE_LOC}spot_b.png`}
              alt="white color"
              className="h-6 w-6 border-2 border-amber-400"
            />
            <p>{game.blackPlayer}</p>
          </div>
        </div>
        <div className={gridItemStyle}>{game.result}</div>
        <div className={gridItemStyle}>{game.endReason}</div>
        <div className={gridItemStyle}>{game.date.toDateString()}</div>
        <div className={`${gridItemStyle} rounded-r-lg group-hover:border-r-4`}>
          {game.noOfMoves}
        </div>
      </Link>
    );
  });

  return errorText ? (
    <ErrorPage {...errorPageProps} />
  ) : (
    <div className="m-auto flex h-full flex-col gap-8 p-4 pt-8">
      <div className="m-auto flex w-full justify-center">
        <div className="grid grid-cols-[max-content_max-content_max-content_max-content_max-content] overflow-x-auto ">
          <div className={`${gridHeaderStyle} rounded-l-lg`}>Players</div>
          <div className={gridHeaderStyle}>Result</div>
          <div className={gridHeaderStyle}>End Reason</div>
          <div className={gridHeaderStyle}>Date</div>
          <div className={`${gridHeaderStyle} rounded-r-lg`}>Moves</div>
          {gridTiles}
        </div>
      </div>
    </div>
  );
}

export default GameHistory;

// no of moves calculated as? check
// pagination if list gets too long
