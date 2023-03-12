import {
  CastleSide,
  Color,
  DrawStatus,
  EndReason,
  PieceType,
  Winner,
} from "../Constants";
import { Position } from "../models";
import { Move } from "../models/Move";

// #region -------- response interfaces --------
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
  steps: string[];
  white_king_pos: number[];
  black_king_pos: number[];
  castle_eligibility: boolean[];
  checked_king: string | null;
  is_concluded: boolean;
  winner: number | null;
  end_reason: string;
  draw: number | null;
  Capture: CaptureResponse;
}

interface GameOverviewIn {
  id: number;
  white_player: string;
  black_player: string;
  winner: number;
  end_reason: number;
  no_of_moves: number;
  created_at: string;
}

interface GameDetailsIn {
  id: number;
  board: string;
  white_player: string;
  black_player: string;
  winner: number;
  end_reason: number;
  checked_king: string | null;
  last_move_start: number[] | null;
  last_move_end: number[] | null;
  move_history: string[];
  steps: string[];
  Capture: CaptureResponse;

  player_color: string;
  active_player: string;
  enpassant_position: number[];
  white_king_pos: number[];
  black_king_pos: number[];
  castle_eligibility: boolean[];
  is_concluded: boolean;
  draw: number | null;
}
//#endregion

// #region -------- common interfaces --------

interface UserStats {
  result: string;
  count: number;
}

interface OpponentUser {
  id: number;
  email: string;
}
//#endregion

// #region -------- chessState interfaces -------

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

interface GameDetails {
  chessState: BoardType;
  whitePlayer: string;
  blackPlayer: string;
  player: Color;
  activePlayer: Color;
  result: string;
  flipBoard: boolean;
}

interface BoardType {
  gameId: number;
  board: string[][];
  capturedWhite: Captures[];
  capturedBlack: Captures[];
  whiteKingPos: Position;
  blackKingPos: Position;
  enPassantPawnPosition: Position[];
  lastMove: MovePosition | null;
  playedMoves: string[][];
  steps: string[];
  checkedKing: Color | null;
  isConcluded: boolean;
  endReason: EndReason | null;
  winner: Winner | null;
  draw: DrawStatus | null;
  isEligibleForCastle: CastleEligibility[];
}
//#endregion

// #region -------- render interfaces --------

interface ErrorPageProps {
  obj: string;
  errorText: string;
}

interface ActiveGameMoveProps {
  moves: string[][];
  handleResign: () => void;
  handleDrawRequest: () => void;
  isConcluded: boolean;
}

interface ChessboardProps {
  board: string[][];
  validMoves: Move[];
  lastMove: MovePosition | null;
  moveStartPosition: Position | null;
  capturedBlack: Captures[];
  capturedWhite: Captures[];
  checkedKing: Color | null;
  handleTileClick: (
    event: React.MouseEvent,
    piece: Position,
    valid: boolean
  ) => void;
  flipBoard: boolean;
  // activePlayer: Color;
  whitePlayer: string;
  blackPlayer: string;
  showNavigation: boolean;
  handleFirstButtonClick?: () => void;
  handleNextButtonClick?: () => void;
  handleLastButtonClick?: () => void;
}

interface TileProps {
  piece: string;
  position: Position;
  backgroundColor: Color;
  valid: boolean;
  highlight: boolean;
  checkedKing: Color | null;
  handleTileClick: (
    event: React.MouseEvent,
    piece: Position,
    valid: boolean
  ) => void;
  flipBoard: boolean;
}

interface MoveListProps {
  moves: string[][];
  addEmptyRows: number;
}

interface UserCardProps {
  alignright: boolean;
  captured: Captures[];
  color: Color;
  username: string;
  isActivePlayer: boolean;
}

interface EndGameProps {
  winner: Winner;
  reason: string;
  player: Color;
  whitePlayer: string;
  blackPlayer: string;
  toggleConclusionModal: () => void;
}

interface PromotionModalProps {
  promotePawn: (type: PieceType) => void;
  color: Color;
}

interface ModalProps {
  message: string;
  buttons: { label: string; handleButtonClick: () => void }[];
}

interface NavigationProps {
  handleFirstButtonClick?: () => void;
  handleNextButtonClick?: () => void;
  handleLastButtonClick?: () => void;
}
//#endregion

export type {
  User,
  CaptureResponse,
  MoveResponse,
  GameOverviewIn,
  GameDetailsIn,
  UserStats,
  OpponentUser,
  Captures,
  CastleEligibility,
  MovePosition,
  GameOverview,
  GameDetails,
  BoardType,
  ErrorPageProps,
  ActiveGameMoveProps,
  ChessboardProps,
  TileProps,
  MoveListProps,
  UserCardProps,
  EndGameProps,
  PromotionModalProps,
  ModalProps,
  NavigationProps,
};
