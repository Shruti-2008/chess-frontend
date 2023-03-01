import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import GameService from "../services/gameService";
import { GameDetails } from "../utilities/commonInterfaces";
import AuthService from "../services/authService";
import MoveList from "./MoveList";
import Chessboard from "./Chessboard";
import { Color } from "../Constants";

function GameMoves() {
  const { id } = useParams();
  const [game, setGame] = useState<GameDetails>();
  const [errorText, setErrorText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    try {
      GameService.getGameDetails(Number(id))
        .then((game) => {
          setGame(game);
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server");
          } else if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response.status === 400) {
            // technical database details exposed
            setErrorText(error.response.data.detail);
          } else if (error.request) {
          } else {
            setErrorText("Unexpected error occured");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured");
    }
  }, []);

  const statHeaderStyle =
    "bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 rounded-lg drop-shadow-xl shadow-slate-400";
  const statTileStyle =
    "grow bg-slate-200 rounded-lg shadow-lg shadow-slate-100 p-2 lg:p-4 text-lg text-center md:text-xl flex flex-col gap-4";
  const gridHeaderStyle =
    "text-center text-lg lg:text-xl bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 ";

  if (game) {
    const moveProps = {
      moves: game.moves,
      addEmptyRows: false,
    };

    const boardProps = {
      board: game.board,
      validMoves: [],
      lastMove: game.lastMove,
      moveStartPosition: null,
      capturedBlack: game.capturedBlack, // get from api
      capturedWhite: game.capturedWhite, // get from api
      checkedKing: game.checkedKing, // get from api
      handleClick: () => {},
      flipBoard: game.flipBoard,
      activePlayer:
        game.moves &&
        game.moves.length !== 0 &&
        game.moves[game.moves.length - 1].length == 1
          ? Color.Black
          : Color.White, //might change depending on last entry in moves array
      whitePlayer: game.whitePlayer,
      blackPlayer: game.blackPlayer,
    };

    return (
      <div className="mx-auto w-full border-2 border-amber-300">
        <div className="grid w-full grid-rows-2 border-8 border-red-500 lg:grid-cols-[3fr_1fr] lg:grid-rows-1">
          <Chessboard {...boardProps} />
          <div className="flex w-full flex-col-reverse gap-4 border-2 border-white p-4 lg:flex-col lg:gap-12">
            <div className="grid w-full grid-rows-[max-content_max-content] gap-6 border-2 border-green-400  lg:gap-12">
              <div className={statTileStyle}>
                <div className={statHeaderStyle}>Result</div>
                <div>{game.result}</div>
              </div>
              <div className={statTileStyle}>
                <div className={statHeaderStyle}>End Reason</div>
                <div>{game.endReason}</div>
              </div>
            </div>
            <div className="mx-auto flex w-full grow flex-col rounded-lg border-4 border-pink-400 bg-slate-400">
              <div className="w-full rounded-lg bg-gradient-to-b from-amber-300 to-amber-200 p-2 text-center text-lg font-semibold shadow-lg shadow-slate-300 lg:text-xl">
                Moves
              </div>
              <div className="grid grid-cols-3">
                <div className={`${gridHeaderStyle} rounded-l-lg`}>No.</div>
                <div className={gridHeaderStyle}>White</div>
                <div className={`${gridHeaderStyle} rounded-r-lg`}>Black</div>
              </div>
              <div className="relative h-full w-full grow border-4 border-teal-300">
                <div className="absolute bottom-0 top-0 left-0 right-0 overflow-y-auto border-4 border-amber-300">
                  <MoveList {...moveProps} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    const errorPageProps = {
      obj: "game",
      errorText: errorText,
    };

    return <ErrorPage {...errorPageProps} />;
  }
}
export default GameMoves;

// handle error function
