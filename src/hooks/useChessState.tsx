import { useState } from "react";
import {
  BOARD_SIZE,
  CastleSide,
  Color,
  DrawStatus,
  EndReason,
  PieceType,
  Winner,
} from "../Constants";
import { Position } from "../models";
import { Move } from "../models/Move";
import { BoardType, MovePosition } from "../utilities/commonInterfaces";
import {
  findMoves,
  isOpponentKingUnderCheck,
} from "../utilities/moveUtilities";
import {
  getColor,
  getOpponentColor,
  isEqual,
} from "../utilities/pieceUtilities";
import { getStepNotationFromPosition } from "../utilities/responseUtilities";

function useChessState(id: number, initialChessState: BoardType) {
  const [chessState, setChessState] = useState<BoardType>(initialChessState);
  const [moves, setMoves] = useState<Move[]>([]);
  const [validMoves, setValidMoves] = useState<Move[]>([]);

  // play the move and update the board
  // capture piece if applicable
  // add notation of move to the state playedMoves
  // update the state lastMove
  // update the states whiteKingPosition, blackKingPosition if applicable
  // disqualify king, rook for further castle moves as applicable
  function makeMove(
    moveStartPosition: Position,
    moveEndPosition: Position,
    player: Color,
    promotionType: PieceType = PieceType.Empty
  ) {
    // clone the board
    const _chessState: BoardType = { ...chessState };
    let _board = _chessState.board.map((row) => row.slice());
    let isCheck = false;
    let isCastleMove = false;
    let isEnPassantCaptureMove = false;
    let isPawnPromotionMove = false;

    // if the current player is making a move, the draw request by current player is considered to be cancelled (If opponent has offered draw, current player can't make a move until draw has been accepted or rejected)
    _chessState.draw = null;

    // retreive start and end pieces
    const srcPiece = _board[moveStartPosition!.x][moveStartPosition!.y];
    const destPiece = _board[moveEndPosition.x][moveEndPosition.y];
    const srcPieceColor = player;
    const endRow = srcPieceColor === Color.White ? BOARD_SIZE - 1 : 0;

    // find the move played from list of moves
    const curMove: MovePosition = {
      startPosition: moveStartPosition!,
      endPosition: moveEndPosition,
    };
    const move = moves.find((move) => move.isSameMove(curMove));

    // move found
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
            _board[capturePosition.x][capturePosition.y],
            moveEndPosition
          );
          _board[capturePosition.x][capturePosition.y] = PieceType.Empty;
          isEnPassantCaptureMove = true;
        }
      }

      // enpassant move
      if (
        isEqual(srcPiece, PieceType.Pawn) &&
        Math.abs(moveStartPosition!.x - moveEndPosition.x) === 2
      ) {
        _chessState.enPassantPawnPosition = [
          new Position(moveEndPosition.x, moveEndPosition.y),
        ];
      } else {
        _chessState.enPassantPawnPosition = [];
      }

      // castle move
      if (
        isEqual(srcPiece, PieceType.King) &&
        Math.abs(moveStartPosition!.y - moveEndPosition.y) === 2
      ) {
        // same as (isEqual(srcPiece, PieceType.King) && move.isCastleMove)
        isCastleMove = true;
        const castleSide = moveEndPosition.y === 2 ? 0 : 7; // 2 on left and 6 on right (as king is always in column 4 initially)
        const newRookPos = new Position(
          moveEndPosition.x,
          moveEndPosition.y === 2 ? 3 : 5
        );
        // move rook to its new position
        _board[newRookPos.x][newRookPos.y] = _board[newRookPos.x][castleSide];
        // set rook's old position as empty
        _board[newRookPos.x][castleSide] = PieceType.Empty;
      }

      // pawn promotion
      if (isEqual(srcPiece, PieceType.Pawn) && moveEndPosition.x === endRow) {
        isPawnPromotionMove = true;
        // update the board
        _board[moveEndPosition!.x][moveEndPosition!.y] =
          player === Color.White
            ? promotionType.toLowerCase()
            : promotionType.toUpperCase();
      } else {
        // move srcPiece to destination tile
        _board[moveEndPosition.x][moveEndPosition.y] = srcPiece;
      }

      // special checks for castle move disqualification
      if (isEqual(srcPiece, PieceType.King)) {
        // update King position
        getColor(srcPiece) === Color.White
          ? (_chessState.whiteKingPos = new Position(
              moveEndPosition.x,
              moveEndPosition.y
            ))
          : (_chessState.blackKingPos = new Position(
              moveEndPosition.x,
              moveEndPosition.y
            ));
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

      // set source tile as empty
      _board[moveStartPosition!.x][moveStartPosition!.y] = PieceType.Empty;

      // update board and the most recent move
      _chessState.lastMove = {
        startPosition: curMove.startPosition,
        endPosition: curMove.endPosition,
      };

      // update board
      _chessState.board = _board;

      // find if opponent king is under check
      if (isOpponentKingUnderCheck(_chessState, player)) {
        isCheck = true;
        _chessState.checkedKing = getOpponentColor(player);
      } else {
        _chessState.checkedKing = null;
      }

      // add this move notation to playedMoves list
      const notation = move.getNotation({
        srcPiece,
        destPiece,
        isCheck,
        isCastleMove,
        isEnPassantCaptureMove,
        isPawnPromotionMove,
        promotionType,
      });
      addNotation(_chessState, notation, player);

      // add this move to the steps list
      addStep(_chessState, moveStartPosition, moveEndPosition);
    } else {
      alert("No such move found");
    }

    setChessState(_chessState);

    // set valid moves to null
    setValidMoves([]);
    // set moves to null
    setMoves([]);
  }

  // increment the count of piece captured
  function capture(_chessState: BoardType, piece: string, position: Position) {
    const color = getColor(piece);
    color === Color.White
      ? (_chessState.capturedWhite = _chessState.capturedWhite.map((obj) =>
          isEqual(piece, obj.type)
            ? { ...obj, value: obj.value + 1 }
            : { ...obj }
        ))
      : (_chessState.capturedBlack = _chessState.capturedBlack.map((obj) =>
          isEqual(piece, obj.type)
            ? { ...obj, value: obj.value + 1 }
            : { ...obj }
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
  function updateValidMoves(posClicked: Position) {
    // the tile clicked is occupied by a piece and is the start tile of a move. Hence, filter moves starting from this position
    setValidMoves(
      moves.filter((move) => move.startPosition.isSamePosition(posClicked))
    );
  }

  // no moves can be played by the current player
  function clearMoves() {
    setValidMoves([]);
    setMoves([]);
  }

  // find all moves
  function getMoves(player: Color) {
    const { _isChecked, _moves } = findMoves(chessState, player);
    const _chessState = { ...chessState };
    // not useful since this information is already sent by the opponent in json property checked_king
    if (_isChecked) {
      _chessState.checkedKing = player;
    } else {
      // not under check
      _chessState.checkedKing = null;
    }

    setMoves(_moves);

    // no valid moves
    if (_moves.length === 0) {
      _chessState.isConcluded = true;
      _chessState.winner = player === Color.White ? Winner.Black : Winner.White;
      // add notation to playedMoves
      const result = player === Color.White ? "0-1" : "1-0";
      addNotation(_chessState, result, player);

      if (_isChecked) {
        ///another function *******************************
        _chessState.endReason = EndReason.Checkmate;
      } else {
        _chessState.endReason = EndReason.StaleMate;
      }
      setChessState(_chessState);

      // no further moves can be played after game has been concluded
      setValidMoves([]);
      setMoves([]);
    } else {
      // never executed
      _chessState.isConcluded = false;
      _chessState.winner = null;
      _chessState.endReason = null;
    }
  }

  // add notation to state playedMoves
  function addNotation(
    _chessState: BoardType,
    notation: string,
    player: Color
  ) {
    // const movePlayedBy = player;
    // if (notation) {
    //   if (movePlayedBy === Color.Black) {
    //     let _playedMoves = _chessState.playedMoves.map((move) => [...move]);
    //     _playedMoves[_playedMoves.length - 1].push(notation);
    //     _chessState.playedMoves = _playedMoves;
    //   } else {
    //     _chessState.playedMoves = [..._chessState.playedMoves, [notation]];
    //   }
    // }
    if (notation) {
      const lastMove =
        _chessState.playedMoves[_chessState.playedMoves.length - 1];
      if (lastMove && lastMove.length === 1) {
        // black played
        let _playedMoves = _chessState.playedMoves.map((move) => [...move]);
        _playedMoves[_playedMoves.length - 1].push(notation);
        _chessState.playedMoves = _playedMoves;
      } else if (!lastMove || lastMove.length === 2) {
        // white played
        _chessState.playedMoves = [..._chessState.playedMoves, [notation]];
      }
    }
  }

  function addStep(
    _chessState: BoardType,
    moveStartPosition: Position,
    moveEndPosition: Position
  ) {
    const step = [
      getStepNotationFromPosition(moveStartPosition),
      getStepNotationFromPosition(moveEndPosition),
    ].join("");
    _chessState.steps = [..._chessState.steps, step];
  }

  const resign = (player: Color) => {
    const _chessState = { ...chessState };
    _chessState.isConcluded = true;
    _chessState.winner = player === Color.White ? Winner.Black : Winner.White;
    _chessState.endReason = EndReason.Resignation;
    // add notation to playedMoves
    const result = player === Color.White ? "0-1" : "1-0";
    addNotation(_chessState, result, player);

    setChessState(_chessState);
    // no further moves can be played after game has been concluded
    setValidMoves([]);
    setMoves([]);
  };

  const requestDraw = (player: Color) => {
    let _chessState = { ...chessState };
    _chessState.draw =
      player === Color.White
        ? DrawStatus.WhiteOffered
        : player === Color.Black
        ? DrawStatus.BlackOffered
        : null;
    setChessState(_chessState);
  };

  const acceptDraw = (player: Color) => {
    let _chessState = { ...chessState };
    _chessState.isConcluded = true;
    _chessState.winner = Winner.Draw;
    _chessState.endReason = EndReason.Agreement;
    _chessState.draw =
      player === Color.White
        ? DrawStatus.WhiteAccepted
        : DrawStatus.BlackAccepted;
    // add notation to playedMoves
    addNotation(_chessState, "1/2-1/2", player);
    setChessState(_chessState);
    // no further moves can be played after game has been concluded
    setValidMoves([]);
    setMoves([]);
  };

  const rejectDraw = (player: Color) => {
    let _chessState = { ...chessState };
    _chessState.draw =
      player === Color.White
        ? DrawStatus.WhiteRejected
        : DrawStatus.BlackRejected;
    setChessState(_chessState);
  };

  return {
    validMoves,
    chessState,
    getMoves,
    makeMove,
    updateValidMoves,
    resign,
    requestDraw,
    acceptDraw,
    rejectDraw,
    clearMoves,
    setChessState,
  };
}

export default useChessState;
