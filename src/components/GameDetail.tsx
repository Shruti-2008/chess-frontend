import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import GameService from "../services/gameService";
import {
  ChessboardProps,
  GameDetails,
  MoveListProps,
} from "../utilities/commonInterfaces";
import AuthService from "../services/authService";
import MoveList from "./MoveList";
import Chessboard from "./Chessboard";
import { Color } from "../Constants";

function GameDetail() {
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
            setErrorText("No response from server!");
          } else if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response.status === 400) {
            // technical database details exposed
            setErrorText(error.response.data.detail);
          } else if (error.request) {
          } else {
            setErrorText("Unexpected error occured!");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured!");
    }
  }, []);

  const statHeaderStyle =
    "bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 rounded-lg drop-shadow-xl shadow-slate-400";
  const statTileStyle =
    "grow bg-slate-200 rounded-lg shadow-lg shadow-slate-100 p-2 lg:p-4 text-lg text-center font-semibold md:text-xl flex flex-col gap-4";
  const gridHeaderStyle =
    "text-center text-lg lg:text-xl bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 ";

  if (game) {
    const moveProps: MoveListProps = {
      moves: game.moves,
      addEmptyRows: 15,
    };

    const boardProps: ChessboardProps = {
      board: game.board,
      validMoves: [],
      lastMove: game.lastMove,
      moveStartPosition: null,
      capturedBlack: game.capturedBlack,
      capturedWhite: game.capturedWhite,
      checkedKing: game.checkedKing,
      handleTileClick: () => {},
      flipBoard: game.flipBoard,
      activePlayer:
        game.moves &&
        game.moves.length !== 0 &&
        game.moves[game.moves.length - 1].length === 1
          ? Color.Black
          : Color.White, //might change depending on last entry in moves array
      whitePlayer: game.whitePlayer,
      blackPlayer: game.blackPlayer,
      showNavigation: true,
    };

    return (
      <div className="mx-auto w-full">
        <div className="grid w-full grid-rows-2 lg:grid-cols-[3fr_1fr] lg:grid-rows-1 xl:p-4">
          <Chessboard {...boardProps} />
          <div className="flex w-full flex-col-reverse gap-4 p-4 lg:flex-col lg:gap-12">
            <div className="grid w-full grid-rows-[max-content_max-content] gap-6 lg:gap-12">
              <div className={statTileStyle}>
                <div className={statHeaderStyle}>Result</div>
                <div>{game.result}</div>
              </div>
              <div className={statTileStyle}>
                <div className={statHeaderStyle}>End Reason</div>
                <div>{game.endReason}</div>
              </div>
            </div>
            <div className="mx-auto flex w-full grow flex-col rounded-lg ">
              <div className="w-full rounded-lg bg-gradient-to-b from-amber-300 to-amber-200 p-2 text-center text-lg font-semibold shadow-lg shadow-slate-300 lg:text-xl">
                Moves
              </div>
              <div className="grid grid-cols-3">
                <div className={`${gridHeaderStyle} rounded-l-lg`}>No.</div>
                <div className={gridHeaderStyle}>White</div>
                <div className={`${gridHeaderStyle} rounded-r-lg`}>Black</div>
              </div>
              <div className="relative h-full w-full grow ">
                <div className="absolute bottom-0 top-0 left-0 right-0 overflow-y-auto">
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
export default GameDetail;
