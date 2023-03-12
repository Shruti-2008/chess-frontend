import React, { useEffect } from "react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaHandshake, FaHandshakeSlash } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import {
  BOARD_SIZE,
  Color,
  PieceType,
  EndReason,
  DrawStatus,
  Winner,
} from "../Constants";
import { Position } from "../models";
import Chessboard from "./Chessboard";
import PromotionModal from "./PromotionModal";
import EndGame from "./EndGame";
import Moves from "./Moves";
import { useNavigate, useParams } from "react-router-dom";
import { getOpponentColor, isEqual } from "../utilities/pieceUtilities";
import {
  constructResponse,
  processResponse,
} from "../utilities/responseUtilities";
import TokenService from "../services/tokenService";
import Modal from "./Modal";
import useChessState from "../hooks/useChessState";
import GameService from "../services/gameService";
import { getInitialChessState } from "../utilities/generalUtilities";
import AuthService from "../services/authService";
import ErrorPage from "./ErrorPage";

function Referee() {
  const { id } = useParams();

  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [player, setPlayer] = useState(Color.White);
  const [activePlayer, setActivePlayer] = useState(Color.White);
  const [promotionPawnPosition, setPromotionPawnPosition] =
    useState<Position | null>(null);
  const [moveStartPosition, setMoveStartPosition] = useState<Position | null>(
    null
  );
  const [isMoveSent, setIsMoveSent] = useState(true);
  const [errorText, setErrorText] = useState("");
  const {
    chessState,
    validMoves,
    getMoves,
    updateValidMoves,
    makeMove,
    clearMoves,
    resign,
    requestDraw,
    acceptDraw,
    rejectDraw,
    setChessState,
  } = useChessState(Number(id), getInitialChessState(+id!));

  const promotionModalRef = useRef<HTMLDivElement>(null);
  const endGameRef = useRef<HTMLDivElement>(null);
  const drawModalRef = useRef<HTMLDivElement>(null);
  const ws = useRef<WebSocket | null>(null);
  const auth = TokenService.getAccessToken();
  const navigate = useNavigate();

  const wsHost = process.env.REACT_APP_WEBSOCKET_HOSTNAME;
  const wsScheme = window.location.protocol === "https:" ? "wss://" : "ws://";

  useEffect(() => {
    try {
      GameService.getGameDetails(+id!)
        .then((game) => {
          if (game.chessState.isConcluded === false) {
            setWebSocket(game.whitePlayer, game.blackPlayer);
          }
          setChessState(game.chessState);
          setWhitePlayer(game.whitePlayer);
          setBlackPlayer(game.blackPlayer);
          setPlayer(game.player);
          setActivePlayer(game.activePlayer);
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

    return () => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        ws.current?.close();
      }
    };
  }, []);

  function setWebSocket(_whitePlayer: string, _blackPlayer: string) {
    ws.current = new WebSocket(wsScheme + wsHost + `ws/${id}?token=${auth}`);
    ws.current.onmessage = (event) => {
      var eventData = JSON.parse(event.data);
      // if opponent is the active player and he offers a draw but then plays a move, the draw is considered to be cancelled
      if (
        !drawModalRef.current?.classList.contains("hidden") &&
        eventData.draw === null
      ) {
        hideDrawModal();
        makeToast(
          "Draw cancelled",
          `by ${player === Color.White ? _blackPlayer : _whitePlayer}`,
          <FaHandshakeSlash />
        );
      }
      // update chessState when opponent sends a response
      setChessState(processResponse(eventData));
      setActivePlayer(eventData.active_player); // does not update activePlayer since it has already been updated after making move. can be removed.
    };
    ws.current.onclose = () => {
      ws.current?.close();
    };
  }

  useEffect(() => {
    if (isMoveSent === false) {
      sendMove();
      setIsMoveSent(true);
    }
  }, [isMoveSent]);

  // handle draw offer, acceptance and rejection
  const processDrawRequest = (drawStatus: DrawStatus, player: Color) => {
    if (
      (player === Color.White &&
        (drawStatus === DrawStatus.WhiteOffered ||
          drawStatus === DrawStatus.WhiteRejected)) ||
      (player === Color.Black &&
        (drawStatus === DrawStatus.BlackOffered ||
          drawStatus === DrawStatus.BlackRejected))
    ) {
      // if a draw was offered or rejected by the current player then send move to the opponent.
      setIsMoveSent(false);
    } else if (
      (player === Color.White && drawStatus === DrawStatus.BlackOffered) ||
      (player === Color.Black && drawStatus === DrawStatus.WhiteOffered)
    ) {
      // if a draw was offered by the opponent, show the draw modal so current player can either accept or reject the draw.
      showDrawModal();
    } else if (
      (player === Color.White && drawStatus === DrawStatus.BlackRejected) ||
      (player === Color.Black && drawStatus === DrawStatus.WhiteRejected)
    ) {
      // if the draw offered by the current player was rejected by the opponent, inform the current player using a toast message.
      makeToast(
        "Draw declined",
        `by ${player === Color.White ? blackPlayer : whitePlayer}`,
        <FaHandshakeSlash />
      );
    }
  };

  // show draw modal
  const showDrawModal = () => {
    drawModalRef.current!.classList.remove("hidden");
  };

  // hide draw modal
  const hideDrawModal = () => {
    drawModalRef.current!.classList.add("hidden");
  };

  useEffect(() => {
    if (chessState.isConcluded) {
      // inform the opponent of game conclusion by sending move if
      // 1. game is won by opponent OR
      // 2. the draw offered by opponent is accepted by current player
      if (
        chessState.winner ===
          (player === Color.White ? Winner.Black : Winner.White) ||
        (chessState.winner === Winner.Draw &&
          chessState.draw ===
            (player === Color.White
              ? DrawStatus.WhiteAccepted
              : DrawStatus.BlackAccepted))
      ) {
        setIsMoveSent(false);
      }
      // show the conclusion modal to current user
      toggleConclusionModal();
    } else if (chessState.draw) {
      processDrawRequest(chessState.draw, player);
    }

    if (!chessState.isConcluded && player === activePlayer) {
      // find moves for the current player if game has not been concluded and current player is the active player
      getMoves(player);
    } else {
      clearMoves();
    }
  }, [chessState]);

  // construct and send move to opponent
  const sendMove = () => {
    // get the json object to be sent
    const obj = constructResponse(chessState, player);

    if (
      !ws.current ||
      (ws.current && ws.current!.readyState === WebSocket.CLOSED)
    ) {
      // if websocket has been closed, reopen it
      setWebSocket(whitePlayer, blackPlayer);
    }

    if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
      // if websocket is in connecting state, send move after connection has been established
      ws.current!.onopen = () => {
        ws.current!.send(JSON.stringify(obj));
      };
    } else if (ws.current) {
      // websocket is open
      ws.current!.send(JSON.stringify(obj));
    }
  };

  // handle tile click
  function handleTileClick(
    event: React.MouseEvent,
    posClicked: Position,
    valid: boolean = false
  ) {
    if (valid) {
      // A valid tile was clicked indicating it was destination tile of a valid move. Hence make the move.
      handleMove(posClicked);
    } else {
      // The tile clicked is the start position of a move. Hence show all moves that start from the clicked position.
      showValidMoves(posClicked);
    }
  }

  // play the move and update the board
  // capture piece if applicable
  // add notation of move to the playedMoves. also update steps
  // update the lastMove
  // update the whiteKingPosition, blackKingPosition if applicable
  // disqualify king, rook for further castle moves as applicable
  function handleMove(moveEndPosition: Position) {
    // if current player offers draw and immediately makes a move, the draw offer is considered to be cancelled. Inform the current user with a toast notification.
    if (
      chessState.draw ===
      (player === Color.White
        ? DrawStatus.WhiteOffered
        : DrawStatus.BlackOffered)
    ) {
      makeToast(
        "Draw cancelled",
        `by ${player === Color.White ? whitePlayer : blackPlayer}`,
        <FaHandshakeSlash />
      );
    }

    // pawn promotion
    const srcPiece =
      chessState.board[moveStartPosition!.x][moveStartPosition!.y];
    const srcPieceColor = player;
    const endRow = srcPieceColor === Color.White ? BOARD_SIZE - 1 : 0;
    if (isEqual(srcPiece, PieceType.Pawn) && moveEndPosition.x === endRow) {
      promotionModalRef.current!.classList.remove("hidden");
      setPromotionPawnPosition(moveEndPosition);
    } else {
      makeMove(moveStartPosition!, moveEndPosition, player);
      // set next move start position as null
      setMoveStartPosition(null);
      // send move to opponent
      setIsMoveSent(false);
      // update active player to opponent after making move
      setActivePlayer(getOpponentColor(player));
    }
  }

  // fiter moves based on starting position
  function showValidMoves(posClicked: Position) {
    if (chessState!.board[posClicked.x][posClicked.y] === PieceType.Empty) {
      // no moves start from an empty tile
      setMoveStartPosition(null);
    } else {
      // the tile clicked is occupied by a piece. Hence, filter moves starting from this position
      updateValidMoves(posClicked);
      setMoveStartPosition(posClicked);
    }
  }

  // function called after user selects a piece type to promote the pawn into
  function promotePawn(type: PieceType) {
    // hide the modal
    promotionModalRef.current?.classList.add("hidden");
    makeMove(moveStartPosition!, promotionPawnPosition!, player, type);
    // set promotion pawn position as null
    setPromotionPawnPosition(null);
    // set next move start position as null
    setMoveStartPosition(null);
    // send move to opponent
    setIsMoveSent(false);
    // update active player to opponent after making move
    setActivePlayer(getOpponentColor(player));
  }

  // toggle the endGame modal
  function toggleConclusionModal() {
    endGameRef.current!.classList.toggle("hidden");
  }

  // make toast notification
  function makeToast(title: string, message: string, icon: JSX.Element) {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } relative flex w-full max-w-md translate-y-0 flex-row items-center justify-center rounded-xl bg-gradient-to-b from-amber-400 to-amber-100 px-4 py-6 text-gray-900 shadow-2xl hover:translate-y-1 hover:shadow-none`}
        >
          <div className="text-3xl md:text-5xl">{icon}</div>
          <div className="ml-4 flex cursor-default flex-col items-start justify-center sm:ml-6">
            <h1 className="text-base font-semibold leading-none tracking-wider text-gray-900 sm:text-lg md:text-xl">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed tracking-wider text-gray-600 sm:text-base md:text-lg">
              {message}
            </p>
          </div>
          <div
            className="absolute top-2 right-2 cursor-pointer text-lg"
            onClick={() => toast.dismiss(t.id)}
          >
            <MdOutlineClose />
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  }

  const handleResign = () => {
    resign(player);
  };

  const handleDrawRequest = () => {
    makeToast(
      "Draw offered",
      `to ${player === Color.White ? blackPlayer : whitePlayer}`,
      <FaHandshake />
    );
    requestDraw(player);
  };

  const handleDrawAcceptance = () => {
    acceptDraw(player);
    hideDrawModal();
  };

  const handleDrawRejection = () => {
    rejectDraw(player);
    hideDrawModal();
  };

  const boardProps = {
    board: chessState!.board,
    validMoves,
    lastMove: chessState.lastMove,
    moveStartPosition,
    capturedBlack: chessState!.capturedBlack,
    capturedWhite: chessState!.capturedWhite,
    checkedKing: chessState!.checkedKing,
    handleTileClick,
    flipBoard: player === Color.Black,
    activePlayer: Color.None,
    whitePlayer: whitePlayer,
    blackPlayer: blackPlayer,
    showNavigation: false,
  };

  const promotionModalProps = {
    promotePawn,
    color: player,
  };

  const endGameProps = {
    winner: chessState!.winner!,
    reason: EndReason[chessState!.endReason!],
    player: player,
    whitePlayer,
    blackPlayer,
    toggleConclusionModal,
  };

  const drawModalProps = {
    message: `${
      player === Color.White ? blackPlayer : whitePlayer
    } offered a draw`,
    buttons: [
      { label: "Accept", handleButtonClick: handleDrawAcceptance },
      { label: "Reject", handleButtonClick: handleDrawRejection },
    ],
  };

  const movesProps = {
    moves: chessState!.playedMoves,
    handleResign,
    handleDrawRequest,
    isConcluded: chessState.isConcluded,
  };

  if (!errorText) {
    return (
      <div className="flex h-full w-full flex-col xl:p-4">
        <Toaster />
        <div className="grid w-full grid-rows-2 lg:grid-cols-[3fr_1fr] lg:grid-rows-1">
          {" "}
          {/**flex flex-col border-2 border-purple-400 md:flex-row */}
          <Chessboard {...boardProps} />
          <Moves {...movesProps} />
        </div>
        <div className="hidden" ref={promotionModalRef}>
          <PromotionModal {...promotionModalProps} />
        </div>
        <div className="hidden" ref={drawModalRef}>
          <Modal {...drawModalProps} />
        </div>
        <div ref={endGameRef} className="hidden h-full w-full">
          <EndGame {...endGameProps} />
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

export default Referee;
