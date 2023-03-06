import { Color, initialBoard } from "../Constants";
import { Position } from "../models";
import { BoardType } from "./commonInterfaces";

const getInitialChessState = (id: number) => {
  const initialChessState: BoardType = {
    gameId: id,
    player: Color.White,
    activePlayer: Color.White,
    board: initialBoard,
    capturedWhite: [],
    capturedBlack: [],
    whiteKingPos: new Position(0, 4),
    blackKingPos: new Position(7, 4),
    enPassantPawnPosition: [],
    lastMove: null,
    playedMoves: [],
    checkedKing: null,
    isConcluded: false,
    endReason: null,
    winner: null,
    draw: null,
    isEligibleForCastle: [],
  };
  return initialChessState;
};

const getClonedChessState = (_chessState: BoardType): BoardType => {
  return {
    gameId: _chessState.gameId,
    player: _chessState.player,
    activePlayer: _chessState.activePlayer,
    checkedKing: _chessState.checkedKing,
    isConcluded: _chessState.isConcluded,
    endReason: _chessState.endReason,
    winner: _chessState.winner,
    draw: _chessState.draw,
    enPassantPawnPosition: [..._chessState.enPassantPawnPosition],
    lastMove:
      _chessState.lastMove === null
        ? null
        : {
            startPosition: new Position(
              _chessState.lastMove.startPosition.x,
              _chessState.lastMove.startPosition.y
            ),
            endPosition: new Position(
              _chessState.lastMove.endPosition.x,
              _chessState.lastMove.endPosition.y
            ),
          },
    isEligibleForCastle: _chessState.isEligibleForCastle.map((obj) => {
      return { ...obj };
    }),
    whiteKingPos: new Position(
      _chessState.whiteKingPos.x,
      _chessState.whiteKingPos.y
    ),
    blackKingPos: new Position(
      _chessState.blackKingPos.x,
      _chessState.blackKingPos.y
    ),
    board: _chessState.board.map((row) => [...row]),
    capturedWhite: _chessState.capturedWhite.map((obj) => {
      return { ...obj };
    }),
    capturedBlack: _chessState.capturedBlack.map((obj) => {
      return { ...obj };
    }),
    playedMoves: [],
  };
};

export { getInitialChessState };
