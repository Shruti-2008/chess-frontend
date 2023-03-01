import { CastleSide, Color, EndReason, PieceType } from "../Constants";
import { Position } from "../models";
import { Move } from "../models/Move";

interface Captures {
  type: PieceType;
  value: number;
}

interface CastleEligibility {
  color: Color;
  side: CastleSide;
  value: boolean;
}

interface MovePosition {
  startPosition: Position;
  endPosition: Position;
}

interface User {
  access_token: string;
  refresh_token: string;
}

interface CaptureResponse {
  p: number;
  r: number;
  n: number;
  b: number;
  q: number;
  k: number;
  P: number;
  R: number;
  N: number;
  B: number;
  Q: number;
  K: number;
}

interface MoveResponse {
  id: number;
  board: string;
  player_color: string;
  active_player: string;
  enpassant_position: number[];
  last_move_start: number[] | null;
  last_move_end: number[] | null;
  move_history: string[];
  white_king_pos: number[];
  black_king_pos: number[];
  castle_eligibility: boolean[];
  checked_king: string | null;
  is_concluded: boolean;
  winner: number | null;
  end_reason: string;
  draw: number | null;
  Capture: CaptureResponse;
  // white_player: string | null;
  // black_player: string | null;
}

interface GameOverview {
  id: number;
  opponent: string;
  opponentColor: Color;
  whitePlayer: string;
  blackPlayer: string;
  result: string;
  endReason: string;
  noOfMoves: number;
  date: Date;
}

interface GameOverviewIn {
  id: number;
  white_player: string;
  black_player: string;
  winner: string;
  end_reason: string;
  no_of_moves: number;
  created_at: string;
}

interface GameDetailsIn {
  board: string;
  white_player: string;
  black_player: string;
  winner: string;
  end_reason: string;
  checked_king: string | null;
  last_move_start: number[] | null;
  last_move_end: number[] | null;
  move_history: string[];
  Capture: {
    p: number;
    r: number;
    n: number;
    b: number;
    q: number;
    k: number;
    P: number;
    R: number;
    N: number;
    B: number;
    Q: number;
    K: number;
  };
}

interface GameDetails {
  board: string[][];
  whitePlayer: string;
  blackPlayer: string;
  winner: Color | null;
  result: string;
  endReason: string;
  checkedKing: Color | null;
  lastMove: MovePosition | null;
  moves: string[][];
  capturedWhite: Captures[];
  capturedBlack: Captures[];
  flipBoard: boolean;
}

interface OpponentUser {
  id: number;
  email: string;
  // created_at: string;
}

interface UserStats {
  result: string;
  count: number;
}

interface ErrorPageProps {
  obj: string;
  errorText: string;
}

interface ActiveGameMoveProps {
  moves: string[][];
  handleResign: () => void;
  handleDrawRequest: () => void;
}

interface ChessboardProps {
  board: string[][];
  validMoves: Move[];
  lastMove: MovePosition | null;
  moveStartPosition: Position | null;
  capturedBlack: { type: PieceType; value: number }[];
  capturedWhite: { type: PieceType; value: number }[];
  checkedKing: Color | null;
  handleClick: (
    event: React.MouseEvent,
    piece: Position,
    valid: boolean
  ) => void;
  flipBoard: boolean;
  activePlayer: Color;
  whitePlayer: string;
  blackPlayer: string;
}

interface TileProps {
  piece: string;
  position: Position;
  backgroundColor: Color;
  valid: boolean;
  highlight: boolean;
  checkedKing: Color | null;
  handleClick: (
    event: React.MouseEvent,
    piece: Position,
    valid: boolean
  ) => void;
  flipBoard: boolean;
}

interface UserCardProps {
  alignright: boolean;
  captured: { type: PieceType; value: number }[];
  color: Color;
  username: string;
  isActivePlayer: boolean;
}

export type {
  Captures,
  CastleEligibility,
  MoveResponse,
  MovePosition,
  User,
  GameOverview,
  GameOverviewIn,
  GameDetails,
  GameDetailsIn,
  OpponentUser,
  UserStats,
  ErrorPageProps,
  ActiveGameMoveProps,
  ChessboardProps,
  TileProps,
  UserCardProps,
  CaptureResponse,
};
