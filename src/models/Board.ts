import {
  BOARD_SIZE,
  capturedCount,
  CastleSide,
  Color,
  DrawStatus,
  EndReason,
  initialBoard,
  PieceType,
  Winner,
} from "../Constants";
import {
  Captures,
  CastleEligibility,
  MovePosition,
} from "../utilities/commonInterfaces";
import { Position } from "./Position";

class Board {
  // whitePlayer: string;
  // blackPlayer: string;
  gameId: number;
  player: Color;
  activePlayer: Color;
  board: string[][];
  capturedWhite: { type: PieceType; value: number }[];
  capturedBlack: { type: PieceType; value: number }[];
  whiteKingPos: Position;
  blackKingPos: Position;
  enPassantPawnPosition: Position[];
  lastMove: MovePosition | null;
  playedMoves: string[][];
  checkedKing: Color | null;
  isConcluded: boolean;
  endReason: EndReason | null;
  winner: Winner | null;
  draw: DrawStatus | null;
  isEligibleForCastle: { color: Color; side: CastleSide; value: boolean }[];
  initialLoad: boolean;

  constructor(
    // whitePlayer: string,
    // blackPlayer: string,
    gameId: number,
    initialLoad: boolean = false,
    player: Color = Color.White,
    activePlayer: Color = Color.White,
    board: string[][] = initialBoard,
    whiteKingPos: Position = new Position(0, 4),
    blackKingPos: Position = new Position(7, 4),
    capturedWhite: Captures[] = [],
    capturedBlack: Captures[] = [],
    enPassantPawnPosition: Position[] = [],
    lastMove: MovePosition | null = null,
    playedMoves: string[][] = [],
    checkedKing: Color | null = null,
    isConcluded: boolean = false,
    endReason: EndReason | null = null,
    winner: Winner | null = null,
    draw: DrawStatus | null = null,
    isEligibleForCastle: CastleEligibility[] = []
  ) {
    // this.whitePlayer = whitePlayer;
    // this.blackPlayer = blackPlayer;
    this.gameId = gameId;
    this.initialLoad = initialLoad;
    this.player = player;
    this.activePlayer = activePlayer;
    this.board = board;
    this.capturedWhite = capturedWhite;
    this.capturedBlack = capturedBlack;
    this.whiteKingPos = whiteKingPos;
    this.blackKingPos = blackKingPos;
    this.enPassantPawnPosition = enPassantPawnPosition;
    this.lastMove = lastMove;
    this.playedMoves = playedMoves;
    this.checkedKing = checkedKing;
    this.isConcluded = isConcluded;
    this.endReason = endReason;
    this.winner = winner;
    this.draw = draw;
    this.isEligibleForCastle = isEligibleForCastle;
  }

  cloneBoard() {
    return new Board(
      // this.whitePlayer,
      // this.blackPlayer,
      this.gameId,
      this.initialLoad,
      this.player,
      this.activePlayer,
      this.board,
      this.whiteKingPos,
      this.blackKingPos,
      this.capturedWhite,
      this.capturedBlack,
      this.enPassantPawnPosition,
      this.lastMove,
      this.playedMoves,
      this.checkedKing,
      this.isConcluded,
      this.endReason,
      this.winner,
      this.draw,
      this.isEligibleForCastle
    );
  }
}

//_______________NOTES______________________
/*
1. changed lastMove from Move to {startPosition: Position, endPosition: Position}
2. castleside
3. removed checkmate and stalemate
4. added isConcluded and endReason
*/
export default Board;
