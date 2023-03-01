import React, { useEffect } from "react";
import { useRef, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaHandshake } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import {
  BOARD_SIZE,
  Color,
  PieceType,
  EndReason,
  CastleSide,
  DrawStatus,
  Winner,
} from "../Constants";
import { Position } from "../models";
import { Move } from "../models/Move";
import Chessboard from "./Chessboard";
import PromotionModal from "./PromotionModal";
import EndGame from "./EndGame";
import Moves from "./Moves";
import { useLocation, useParams } from "react-router-dom";
import {
  getColor,
  getOpponentColor,
  isEqual,
} from "../utilities/pieceUtilities";
import {
  getBoardAsString,
  getCapturedObject,
  getDrawValue,
  getMoveHistory,
  processResponse,
} from "../utilities/responseUtilities";
import Board from "../models/Board";
import {
  findMoves,
  isOpponentKingUnderCheck,
} from "../utilities/moveUtilities";
import TokenService from "../services/tokenService";
import useSocket from "../hooks/useSocket";
import { MovePosition, MoveResponse } from "../utilities/commonInterfaces";
import Modal from "./Modal";

function Referee() {
  // chessState direct state manipulation
  // end Game, checked and all
  // reconnect websocket, check what happens when socket is closed after sending move and we keep awaiting opponent move
  // pass names to cards
  // comments
  // testing
  // draw, tileunderattack
  // abandon button
  // user stats when no game played
  // console warnings
  // provide ws to back button click

  const location = useLocation();
  const { id } = useParams();

  const [whitePlayer, setWhitePlayer] = useState("");
  const [blackPlayer, setBlackPlayer] = useState("");
  const [isMoveSent, setIsMoveSent] = useState(true);
  const [chessState, setChessState] = useState<Board>(
    new Board(Number(id), true)
    //processResponse(location.state)
  );
  const [promotionPawnPosition, setPromotionPawnPosition] =
    useState<Position | null>(null);
  const [moves, setMoves] = useState<Move[]>([]);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [moveStartPosition, setMoveStartPosition] = useState<Position | null>(
    null
  );

  const promotionModalRef = useRef<HTMLDivElement>(null);
  const endGameRef = useRef<HTMLDivElement>(null);
  const drawModalRef = useRef<HTMLDivElement>(null); //not needed
  const ws = useRef<WebSocket | null>(null);
  const auth = TokenService.getAccessToken();

  const wsHost = process.env.REACT_APP_WEBSOCKET_HOSTNAME;
  const wsScheme = window.location.protocol == "https:" ? "wss://" : "ws://";

  console.log("Rendered", chessState.draw);
  // console.log("m : ", moves);
  console.log("vm : ", validMoves);

  function setWebSocket() {
    ws.current = new WebSocket(wsScheme + wsHost + `ws/${id}?token=${auth}`);
    ws.current.onmessage = (event) => {
      console.log("Recieved message from opponent");
      var eventData = JSON.parse(event.data);
      //handleResponse(processResponse(eventData));
      console.log("Websocket Draw", chessState.draw, eventData.draw);
      if (
        !drawModalRef.current?.classList.contains("hidden") &&
        eventData.draw === null
      ) {
        showHideDrawModal();
        toast(
          `${
            chessState.player === Color.White ? blackPlayer : whitePlayer
          } cancelled a draw`
        );
      }
      // if (
      //   chessState.draw &&
      //   eventData.draw === null &&
      //   chessState.draw ===
      //     (chessState.player === Color.White
      //       ? DrawStatus.BlackOffered
      //       : DrawStatus.WhiteOffered)
      // ) {
      //   toast(
      //     `${
      //       chessState.player === Color.White ? blackPlayer : whitePlayer
      //     } cancelled a draw`
      //   );
      //   showHideDrawModal();
      // }
      setChessState(processResponse(eventData));
    };
    ws.current.onclose = () => {
      ws.current?.close();
    };
  }

  React.useEffect(() => {
    // Set up web socket connection
    setWebSocket();
    setChessState(processResponse(location.state));
    setWhitePlayer(location.state.white_player);
    setBlackPlayer(location.state.black_player);

    return () => ws.current?.close();
  }, []);

  useEffect(() => {
    if (isMoveSent === false) {
      sendMove();
      setIsMoveSent(true);
    }
  }, [isMoveSent]);

  // useEffect(() => {
  //   if (
  //     // chessState && //can be removed since chessState is never null
  //     // !chessState.initialLoad && // to prevent moves from getting calculated for initial load. maybe this condition is not necessary once we reset moves on actual load
  //     !chessState.isConcluded && // get moves only if the game has not ended
  //     chessState.player === chessState.activePlayer // get moves if active player is same as this player
  //   ) {
  //     getMoves();
  //   } else {
  //     if (
  //       chessState.isConcluded &&
  //       chessState.winner == getOpponentColor(chessState.player)
  //     ) {
  //       // I'm the loser
  //       setIsMoveSent(false);
  //     }
  //     // set valid moves to null
  //     setValidMoves([]);
  //     // set moves to null
  //     setMoves([]);
  //   }

  //   showHideModal();
  // }, [chessState]);

  const drawAction = (drawStatus: DrawStatus, player: Color) => {
    console.log("draw action called with ", drawStatus, player);
    if (
      (player === Color.White &&
        (drawStatus === DrawStatus.WhiteOffered ||
          drawStatus === DrawStatus.WhiteRejected)) ||
      (player === Color.Black &&
        (drawStatus === DrawStatus.BlackOffered ||
          drawStatus === DrawStatus.BlackRejected))
    ) {
      console.log("1");
      setIsMoveSent(false);
    } else if (
      (player === Color.White && drawStatus === DrawStatus.BlackOffered) ||
      (player === Color.Black && drawStatus === DrawStatus.WhiteOffered)
    ) {
      console.log("2");
      showHideDrawModal();
    } else if (
      (player === Color.White && drawStatus === DrawStatus.BlackRejected) ||
      (player === Color.Black && drawStatus === DrawStatus.WhiteRejected)
    ) {
      console.log("3");
      toast(`${getOpponentColor(player)} declined draw!`);
    }
  };

  const showHideDrawModal = () => {
    drawModalRef.current!.classList.toggle("hidden");
  };

  useEffect(() => {
    if (chessState.isConcluded) {
      showHideModal();
      alert(`${chessState.winner} ${chessState.player}`);
      if (
        chessState.winner ===
          (chessState.player === Color.White ? Winner.Black : Winner.White) ||
        (chessState.winner === Winner.Draw &&
          chessState.draw ===
            (chessState.player === Color.White
              ? DrawStatus.WhiteAccepted
              : DrawStatus.BlackAccepted))
      ) {
        setIsMoveSent(false);
      }
      setValidMoves([]);
      setMoves([]);
    } else if (chessState.draw) {
      drawAction(chessState.draw, chessState.player);
    }
    if (
      !chessState.isConcluded &&
      chessState.player === chessState.activePlayer
    ) {
      getMoves();
    } else {
      setValidMoves([]);
      setMoves([]);
    }
  }, [chessState]);

  const sendMove = () => {
    let obj = {
      //MoveResponse
      id: chessState!.gameId, //*******************
      board: getBoardAsString(chessState!.board),
      player_color: chessState!.player,
      active_player: getOpponentColor(chessState!.player),
      last_move_start:
        chessState!.lastMove !== null
          ? [
              chessState!.lastMove!.startPosition.x,
              chessState!.lastMove!.startPosition.y,
            ]
          : null,
      last_move_end:
        chessState!.lastMove !== null
          ? [
              chessState!.lastMove!.endPosition.x,
              chessState!.lastMove!.endPosition.y,
            ]
          : null,
      move_history: getMoveHistory(chessState!.playedMoves),
      white_king_pos: [chessState!.whiteKingPos.x, chessState!.whiteKingPos.y],
      black_king_pos: [chessState!.blackKingPos.x, chessState!.blackKingPos.y],
      enpassant_position:
        chessState!.enPassantPawnPosition &&
        chessState.enPassantPawnPosition.length > 0
          ? [
              chessState.enPassantPawnPosition[0].x,
              chessState.enPassantPawnPosition[0].y,
            ]
          : [],
      castle_eligibility: chessState!.isEligibleForCastle.map((e) => e.value),
      checked_king: chessState.checkedKing,
      is_concluded: chessState!.winner ? true : false,
      winner: chessState!.winner,
      end_reason: chessState?.endReason,
      draw: getDrawValue(chessState.draw, chessState.player),
      Capture: getCapturedObject(
        chessState!.capturedWhite,
        chessState!.capturedBlack
      ),
    };
    // reopenClosedWS()
    console.log("WS STATE: ", ws.current?.readyState);
    if (ws.current && ws.current!.readyState === WebSocket.CLOSED) {
      console.log("WebSocket CLOSED: Reopening");
      //ws.current = new WebSocket(wsScheme + wsHost + `ws/${id}?token=${auth}`);
      setWebSocket();
      console.log("WS 3", ws.current);
    }
    if (ws.current && ws.current.readyState === WebSocket.CONNECTING) {
      ws.current!.onopen = () => {
        ws.current!.send(JSON.stringify(obj));
        console.log("WS 4", ws.current);
      };
    } else {
      console.log("WS 1", ws.current);
      ws.current!.send(JSON.stringify(obj));
    }
    console.log("Final Object Sent", obj);
  };

  // function reopenClosedWS() {
  //   if (ws.current!.readyState === WebSocket.CLOSED) {
  //     console.log("WebSocket CLOSED: Reopening");
  //     ws.current = new WebSocket(wsScheme + wsHost + `ws/${id}?token=${auth}`);
  //   }
  // }

  // post move steps
  function postMoveSteps(_chessState: Board) {
    // set next move start position as null
    setMoveStartPosition(null);
    // set valid moves to null
    setValidMoves([]);
    // set moves to null
    setMoves([]);

    // find if opponent king is under check
    if (isOpponentKingUnderCheck(_chessState)) {
      _chessState.checkedKing = getOpponentColor(_chessState.player);
    } else {
      _chessState.checkedKing = null;
    }

    // send move to opponent
    setIsMoveSent(false);
  }

  // handle tile click
  function handleClick(
    event: React.MouseEvent,
    posClicked: Position,
    valid: boolean = false
  ) {
    if (valid) {
      // A valid tile was clicked indicating it was destination tile of a valid move. Hence make the move.
      makeMove(posClicked);
    } else {
      // The tile clicked is the start position of a move. Hence show all moves that start from the clicked position.
      showValidMoves(posClicked);
    }
  }

  // play the move and update the board
  // capture piece if applicable
  // add notation of move to the state playedMoves
  // update the state lastMove
  // update the states whiteKingPosition, blackKingPosition if applicable
  // disqualify king, rook for further castle moves as applicable
  function makeMove(moveEndPosition: Position) {
    //clone the board
    const _chessState = chessState!.cloneBoard();

    chessState.draw ===
      (chessState.player === Color.White
        ? DrawStatus.WhiteOffered
        : DrawStatus.BlackOffered) &&
      toast(
        `${
          chessState.player === Color.White ? whitePlayer : blackPlayer
        } cancelled a draw.`
      );
    _chessState.draw = null;

    // retreive start and end pieces
    const srcPiece =
      _chessState.board[moveStartPosition!.x][moveStartPosition!.y];
    const destPiece = _chessState.board[moveEndPosition.x][moveEndPosition.y];
    const srcPieceColor = _chessState.player;
    const endRow = srcPieceColor === Color.White ? BOARD_SIZE - 1 : 0;

    // find the move played from list of moves
    const curMove: MovePosition = {
      startPosition: moveStartPosition!,
      endPosition: moveEndPosition,
    };
    const move = moves.find((move) => move.isEqual(curMove));

    if (move) {
      // destination position is occupied by opponent piece
      if (
        destPiece !== PieceType.Empty &&
        getColor(destPiece) === getOpponentColor(srcPieceColor)
      ) {
        capture(_chessState, destPiece, moveEndPosition);
      }

      // enpassant capture move
      if (isEqual(srcPiece, PieceType.Pawn)) {
        const capturePosition = new Position(
          moveStartPosition!.x,
          moveEndPosition.y
        );
        if (
          _chessState.enPassantPawnPosition &&
          _chessState.enPassantPawnPosition.length > 0 &&
          _chessState.enPassantPawnPosition[0].isSamePosition(capturePosition)
        ) {
          capture(
            _chessState,
            _chessState.board[capturePosition.x][capturePosition.y],
            moveEndPosition
          );
          _chessState.board[capturePosition.x][capturePosition.y] =
            PieceType.Empty;
        }
      }

      // if (move.isEnPassantCaptureMove) {
      //   const capturePosition = new Position(
      //     moveStartPosition!.x,
      //     moveEndPosition.y
      //   );
      //   capture(
      //     _chessState,
      //     _chessState.board[capturePosition.x][capturePosition.y],
      //     moveEndPosition
      //   );
      //   _chessState.board[capturePosition.x][capturePosition.y] =
      //     PieceType.Empty;
      // }

      // enpassant move
      if (
        isEqual(srcPiece, PieceType.Pawn) &&
        Math.abs(moveStartPosition!.x - moveEndPosition.x) === 2
      ) {
        _chessState.enPassantPawnPosition.push(
          new Position(moveEndPosition.x, moveEndPosition.y)
        );
      } else {
        _chessState.enPassantPawnPosition = [];
      }

      // castle move
      if (
        isEqual(srcPiece, PieceType.King) &&
        Math.abs(moveStartPosition!.y - moveEndPosition.y) === 2
      ) {
        // same as (isEqual(srcPiece, PieceType.King) && move.isCastleMove)
        const castleSide = moveEndPosition.y === 2 ? 0 : 7; // 2 on left and 6 on right (as king is always in column 4 initially)
        const newRookPos = new Position(
          moveEndPosition.x,
          moveEndPosition.y === 2 ? 3 : 5
        );
        // move rook to its new position
        _chessState.board[newRookPos.x][newRookPos.y] =
          _chessState.board[newRookPos.x][castleSide];
        // set rook's old position as empty
        _chessState.board[newRookPos.x][castleSide] = PieceType.Empty;
      }

      // pawn promotion
      if (isEqual(srcPiece, PieceType.Pawn) && moveEndPosition.x === endRow) {
        promotionModalRef.current!.classList.remove("hidden");
        setPromotionPawnPosition(moveEndPosition);
      } else {
        // add this move notation to playedMoves list
        const notation = move.getNotation({ srcPiece, destPiece });
        addNotation(_chessState, notation);
      }

      // special checks for castle move disqualification
      if (isEqual(srcPiece, PieceType.King)) {
        // update King position
        getColor(srcPiece) === Color.White
          ? (_chessState.whiteKingPos = moveEndPosition)
          : (_chessState.blackKingPos = moveEndPosition);
        // disqualify king from castle move.
        _chessState.isEligibleForCastle = _chessState.isEligibleForCastle.map(
          (obj) =>
            obj.color === srcPieceColor && obj.value
              ? { ...obj, value: false }
              : { ...obj }
        );
      } else if (isEqual(srcPiece, PieceType.Rook)) {
        // disqualify rook from castle move
        const side =
          curMove.startPosition.y === 0
            ? CastleSide.Queenside
            : CastleSide.Kingside; // #int# change condition maybe
        _chessState.isEligibleForCastle = _chessState.isEligibleForCastle.map(
          (obj) =>
            obj.color === srcPieceColor && obj.value && obj.side === side
              ? { ...obj, value: false }
              : { ...obj }
        );
      }

      // move srcPiece to destination tile and set source tile as empty
      _chessState.board[moveStartPosition!.x][moveStartPosition!.y] =
        PieceType.Empty;
      _chessState.board[moveEndPosition.x][moveEndPosition.y] = srcPiece;

      // update board and the most recent move
      _chessState.lastMove = {
        startPosition: curMove.startPosition,
        endPosition: curMove.endPosition,
      };
    } else {
      alert("No such move found");
    }

    // perform post move steps if the move is not a pawn promotion move (in case of pawn promotion, the move has not yet been completed)
    if (!(srcPiece === PieceType.Pawn && moveEndPosition.x === endRow)) {
      postMoveSteps(_chessState);
    }
    _chessState.activePlayer = getOpponentColor(_chessState.activePlayer);
    setChessState(_chessState);
  }

  // increment the count of piece captured
  function capture(_chessState: Board, piece: string, position: Position) {
    const color = getColor(piece);
    color === Color.White
      ? (_chessState.capturedWhite = _chessState.capturedWhite.map((obj) =>
          isEqual(piece, obj.type) ? { ...obj, value: obj.value + 1 } : obj
        ))
      : (_chessState.capturedBlack = _chessState.capturedBlack.map((obj) =>
          isEqual(piece, obj.type) ? { ...obj, value: obj.value + 1 } : obj
        ));

    if (isEqual(piece, PieceType.Rook)) {
      // disqualify rook from castle move
      const side =
        position.y === 0 ? CastleSide.Queenside : CastleSide.Kingside;
      _chessState.isEligibleForCastle = _chessState.isEligibleForCastle.map(
        (obj) =>
          obj.color === color && obj.value && obj.side === side
            ? { ...obj, value: false }
            : { ...obj }
      );
    }
  }

  // fiter moves based on starting position
  function showValidMoves(posClicked: Position) {
    if (chessState!.board[posClicked.x][posClicked.y] === PieceType.Empty) {
      // no moves start from an empty tile
      setMoveStartPosition(null);
    } else {
      // the tile clicked is occupied by a piece. Hence, filter moves starting from this position
      setValidMoves(
        moves.filter((move) => move.startPos.isSamePosition(posClicked))
      );
      setMoveStartPosition(posClicked);
    }
  }

  // find all moves
  function getMoves() {
    const { _isChecked, _moves } = findMoves(chessState);
    const _chessState = chessState.cloneBoard();

    // not useful since this information is already sent by the opponent in json property checked_king
    if (_isChecked) {
      _chessState.checkedKing = _chessState.player;
    } else {
      // not under check
      _chessState.checkedKing = null;
    }

    setMoves(_moves);

    if (_moves.length === 0) {
      _chessState.isConcluded = true;
      _chessState.winner =
        _chessState.player === Color.White ? Winner.Black : Winner.White; // getOpponentColor(_chessState.player);
      // no valid moves
      if (_isChecked) {
        ///another function ******************************* #int#
        _chessState.endReason = EndReason.Checkmate;
      } else {
        _chessState.endReason = EndReason.StaleMate;
      }
      setChessState(_chessState);
      // showHideModal();
    } else {
      // #int# is this necessary? also once game ends, set moves to null so no new move is allowed to be played
      _chessState.isConcluded = false;
      _chessState.winner = null;
      _chessState.endReason = null;
    }
  }

  //
  function isTileUnderAttack(position: Position, _board: string[][]): boolean {
    // const color = getOpponentColor(player)
    // let moves: Move[] = []
    //findMoves(_board, [])
    return false;
  }

  // function called after user selects a piece type to promote the pawn into
  function promotePawn(type: PieceType) {
    // clone the chessState
    const _chessState = chessState!.cloneBoard();

    // hide the modal
    promotionModalRef.current?.classList.add("hidden");

    // #int# set isPawnPromotion = true?????????
    // add notation of the move to state playedMoves
    const move = new Move({
      startPos: moveStartPosition!,
      endPos: promotionPawnPosition!,
    });
    const notation = move.getNotation({
      srcPiece: PieceType.Pawn, //could cause issues********************
      destPiece:
        _chessState!.board[promotionPawnPosition!.x][promotionPawnPosition!.y],
      isPawnPromotionMove: true,
      promotionType: type,
    });
    addNotation(_chessState, notation);

    // update the board
    _chessState.board[promotionPawnPosition!.x][promotionPawnPosition!.y] =
      _chessState.player === Color.White
        ? type.toLowerCase()
        : type.toUpperCase();

    setPromotionPawnPosition(null);
    postMoveSteps(_chessState);
    _chessState.activePlayer = getOpponentColor(_chessState.activePlayer);
    setChessState(_chessState);
  }

  // add notation to state playedMoves
  function addNotation(_chessState: Board, notation: string) {
    const movePlayedBy = _chessState.player;
    if (notation) {
      if (movePlayedBy === Color.Black) {
        // push notation to last moveSet
        _chessState.playedMoves[_chessState.playedMoves.length - 1].push(
          notation
        );
      } else {
        // add a new moveSet and push notation into it
        _chessState.playedMoves.push([notation]);
      }
    }
  }

  // toggle the endGame modal
  function showHideModal() {
    endGameRef.current!.classList.toggle("hidden");
  }

  const handleResign = () => {
    const _chessState = chessState.cloneBoard();
    _chessState.isConcluded = true;
    _chessState.winner =
      _chessState.player === Color.White ? Winner.Black : Winner.White; //getOpponentColor(_chessState.player);
    _chessState.endReason = EndReason.Resign;
    setChessState(_chessState);
    // showHideModal();
  };

  const handleDrawRequest = () => {
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } relative flex w-full max-w-md translate-y-0 flex-row items-center justify-center rounded-xl bg-gradient-to-b from-amber-400 to-amber-100 px-4 py-6 text-gray-900 shadow-2xl hover:translate-y-1 hover:shadow-none`}
        >
          <div className="text-3xl md:text-5xl">
            <FaHandshake />
          </div>
          <div className="ml-4 flex cursor-default flex-col items-start justify-center">
            <h1 className="text-base font-semibold leading-none tracking-wider text-gray-900 md:text-lg">
              Draw offered
            </h1>
            <p className="mt-2 text-sm leading-relaxed tracking-wider text-gray-600 md:text-base">
              to {chessState.player === Color.White ? blackPlayer : whitePlayer}
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
    let _chessState = chessState.cloneBoard();
    _chessState.draw =
      chessState.player === Color.White
        ? DrawStatus.WhiteOffered
        : chessState.player === Color.Black
        ? DrawStatus.BlackOffered
        : null;
    setChessState(_chessState);
  };

  const acceptDraw = () => {
    let _chessState = chessState.cloneBoard();
    _chessState.isConcluded = true;
    _chessState.winner = Winner.Draw;
    _chessState.endReason = EndReason.Agreement;
    _chessState.draw =
      _chessState.player === Color.White
        ? DrawStatus.WhiteAccepted
        : DrawStatus.BlackAccepted;
    setChessState(_chessState);
    showHideDrawModal();
  };

  const rejectDraw = () => {
    let _chessState = chessState.cloneBoard();
    _chessState.draw =
      _chessState.player === Color.White
        ? DrawStatus.WhiteRejected
        : DrawStatus.BlackRejected;
    setChessState(_chessState);
    showHideDrawModal();
  };

  const boardProps = {
    board: chessState!.board,
    validMoves,
    lastMove: chessState.lastMove, //*********chang this to just position object */
    moveStartPosition,
    capturedBlack: chessState!.capturedBlack,
    capturedWhite: chessState!.capturedWhite,
    checkedKing: chessState!.checkedKing,
    handleClick,
    flipBoard: chessState?.player === Color.Black,
    activePlayer: chessState?.activePlayer,
    whitePlayer: whitePlayer,
    blackPlayer: blackPlayer,
  };

  const promotionModalProps = {
    promotePawn,
    color: chessState!.player, // getOpponentColor(player) #int# /********************************************* */
  };

  const endGameProps = {
    winner: chessState!.winner, // getOpponentColor(player!), //************************************* */
    reason: EndReason[chessState!.endReason!], // #int# Check if this is correct
    showHideModal,
  };

  const drawModalProps = {
    message: `${getOpponentColor(chessState.player)} offered a draw`, // getOpponentColor(player!), //************************************* */
    buttons: [
      { label: "Accept", handleButtonClick: acceptDraw },
      { label: "Reject", handleButtonClick: rejectDraw },
    ],
  };

  const movesProps = {
    moves: chessState!.playedMoves,
    handleResign,
    handleDrawRequest,
  };

  return (
    <div
      className="flex h-full w-full flex-col border-2 border-red-500 bg-gradient-to-b from-slate-200 to-slate-400"
      // ref={gameRef}
    >
      <Toaster />
      {/* <div className="">
        <ToastContainer className="rounded-lg bg-gradient-to-b from-amber-400 to-amber-100 text-lg text-red-500 md:text-xl" />
      </div> */}

      <div className="flex flex-col border-2 border-purple-400 md:flex-row">
        {/*relative*/}
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
        {/*className="hidden" */}
        <EndGame {...endGameProps} />
      </div>
    </div>
  );
}

export default Referee;
