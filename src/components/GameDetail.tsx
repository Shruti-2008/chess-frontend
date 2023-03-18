import { useEffect, useRef, useState } from "react";
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
import { Color, EndReason } from "../Constants";
import { getInitialChessState } from "../utilities/generalUtilities";
import useChessState from "../hooks/useChessState";
import { getOpponentColor } from "../utilities/pieceUtilities";
import { getMoveParameters } from "../utilities/responseUtilities";

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<GameDetails>();
  const [errorText, setErrorText] = useState("");
  const [flipBoard, setFlipBoard] = useState(false);
  const { chessState, setChessState, getMoves, makeMove, clearMoves } =
    useChessState(Number(id), getInitialChessState(Number(id)));

  const playOn = useRef(false);
  const counter = useRef(0);

  useEffect(() => {
    try {
      GameService.getGameDetails(Number(id))
        .then((game) => {
          setGame(game);
          if (game) {
            setFlipBoard(game.flipBoard);
            setChessState(game.chessState);
          }
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
          } else if (error.response) {
            const detail = error.response?.data?.detail;
            if (
              Array.isArray(detail) &&
              detail.length > 0 &&
              detail[0].msg !== undefined
            ) {
              setErrorText(error.response?.data.detail[0].msg);
            } else {
              setErrorText(detail);
            }
          } else {
            setErrorText("Unexpected error occured!");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured!");
    }
  }, []);

  useEffect(() => {
    if (playOn.current) {
      const player = counter.current % 2 === 0 ? Color.White : Color.Black;
      getMoves(player);
    }
  }, [chessState]);

  const statHeaderStyle =
    "bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 rounded-lg drop-shadow-xl shadow-slate-400";
  const statTileStyle =
    "grow bg-slate-200 rounded-lg shadow-lg shadow-slate-100 p-2 lg:p-4 text-center font-semibold flex flex-col gap-4";
  const gridHeaderStyle =
    "text-center bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 ";

  function handleFirstButtonClick() {
    const state = getInitialChessState(Number(id));
    setChessState(state);
    counter.current = 0;
    playOn.current = true;
  }

  function handleNextButtonClick() {
    const player = counter.current % 2 === 0 ? Color.White : Color.Black;
    if (
      playOn.current &&
      game &&
      game.chessState.steps &&
      counter.current < game.chessState.steps.length
    ) {
      const notation =
        game?.chessState.playedMoves[Math.floor(counter.current / 2)][
          counter.current % 2
        ];
      const move = game.chessState.steps[counter.current]!;
      const moveParameters = getMoveParameters(move, notation!);
      makeMove(
        moveParameters.moveStartPosition,
        moveParameters.moveEndPosition,
        player,
        moveParameters.promotionType
      );
      getMoves(getOpponentColor(player));
      counter.current += 1;
      if (counter.current === game.chessState.steps.length) {
        playOn.current = false;
      }
    }
  }

  function handleLastButtonClick() {
    counter.current = 0;
    setChessState(game!.chessState);
    clearMoves();
    playOn.current = false;
  }

  if (game) {
    const moveProps: MoveListProps = {
      moves: game.chessState.playedMoves,
      addEmptyRows: 15,
    };

    const boardProps: ChessboardProps = {
      board: chessState.board,
      validMoves: [],
      lastMove: chessState.lastMove,
      moveStartPosition: null,
      capturedBlack: chessState.capturedBlack,
      capturedWhite: chessState.capturedWhite,
      checkedKing: chessState.checkedKing,
      handleTileClick: () => {},
      flipBoard: flipBoard,
      whitePlayer: game.whitePlayer,
      blackPlayer: game.blackPlayer,
      showNavigation: true,
      handleFirstButtonClick,
      handleNextButtonClick,
      handleLastButtonClick,
    };

    return (
      <div className="mx-auto w-full">
        <div className="grid w-full grid-rows-2 lg:grid-cols-[3fr_1fr] lg:grid-rows-1 xl:p-4">
          <Chessboard {...boardProps} />
          <div className="flex w-full flex-col-reverse gap-4 p-4 lg:flex-col lg:gap-6">
            <div className="grid w-full grid-rows-[max-content_max-content] gap-6 lg:gap-6">
              <div className={statTileStyle}>
                <div className={statHeaderStyle}>Result</div>
                <div>{game.result}</div>
              </div>
              <div className={statTileStyle}>
                <div className={statHeaderStyle}>End Reason</div>
                <div>
                  {game.chessState.endReason
                    ? EndReason[+game.chessState.endReason]
                    : ""}
                </div>
              </div>
            </div>
            <div className="mx-auto flex w-full grow flex-col rounded-lg ">
              <div className="w-full rounded-lg bg-gradient-to-b from-amber-300 to-amber-200 p-2 text-center font-semibold shadow-lg shadow-slate-300">
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
