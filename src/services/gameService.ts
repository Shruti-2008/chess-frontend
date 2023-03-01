import { Color, EndReason, PieceType } from "../Constants";
import { Position } from "../models/Position";
import {
  GameDetails,
  GameDetailsIn,
  GameOverview,
  GameOverviewIn,
  UserStats,
} from "../utilities/commonInterfaces";
import {
  getBoardFromResponse,
  getMovesFromResponse,
} from "../utilities/responseUtilities";
import api from "./api";
import TokenService from "./tokenService";

const getConcludedGames = async () => {
  const player = TokenService.getUser()!.username;
  const response = await api.get(`/games/`);
  let games: GameOverview[] = [];
  const data: GameOverviewIn[] = response.data;
  data.forEach((game) => {
    const [opponent, opponentColor] =
      game.white_player === player
        ? [game.black_player, Color.Black]
        : [game.white_player, Color.White];
    games.push({
      id: game.id,
      whitePlayer: game.white_player,
      blackPlayer: game.black_player,
      opponent,
      opponentColor,
      endReason: EndReason[+game.end_reason],
      result:
        game.winner === Color.White
          ? "1-0"
          : game.winner === Color.Black
          ? "0-1"
          : "1/2-1/2",
      noOfMoves: game.no_of_moves ? game.no_of_moves : 0,
      date: new Date(game.created_at),
    });
  });
  return games;
};

const getGameDetails = async (id: number) => {
  const response = await api.get(`/games/${id}`);
  const data: GameDetailsIn = response.data;
  const game: GameDetails = {
    board: getBoardFromResponse(data.board),
    whitePlayer: data.white_player,
    blackPlayer: data.black_player,
    winner:
      data.winner == Color.White
        ? Color.White
        : data.winner == Color.Black
        ? Color.Black
        : null,
    endReason: EndReason[+data.end_reason],
    result:
      data.winner === Color.White
        ? "1-0"
        : data.winner === Color.Black
        ? "0-1"
        : "1/2-1/2",
    checkedKing: data.checked_king
      ? data.checked_king == Color.White
        ? Color.White
        : Color.Black
      : null,
    lastMove:
      data.last_move_start && data.last_move_end
        ? {
            startPosition: new Position(
              data.last_move_start[0],
              data.last_move_start[1]
            ),
            endPosition: new Position(
              data.last_move_end[0],
              data.last_move_end[1]
            ),
          }
        : null,
    moves: getMovesFromResponse(data.move_history),
    capturedWhite: [
      { type: PieceType.Pawn, value: data.Capture.p },
      { type: PieceType.Rook, value: data.Capture.r },
      { type: PieceType.Knight, value: data.Capture.n },
      { type: PieceType.Bishop, value: data.Capture.b },
      { type: PieceType.Queen, value: data.Capture.q },
      { type: PieceType.King, value: data.Capture.k },
    ],
    capturedBlack: [
      { type: PieceType.Pawn, value: data.Capture.P },
      { type: PieceType.Rook, value: data.Capture.R },
      { type: PieceType.Knight, value: data.Capture.N },
      { type: PieceType.Bishop, value: data.Capture.B },
      { type: PieceType.Queen, value: data.Capture.Q },
      { type: PieceType.King, value: data.Capture.K },
    ],
    flipBoard: TokenService.getUser().username === data.black_player,
  };
  return game;
};

const getActiveGame = async () => {
  const config = {
    headers: { Authorization: `Bearer ${TokenService.getAccessToken()}` },
  };
  const response = await api.get("/games/active", config);
  return response;
};

const createGame = async (opponent: number) => {
  const request = {
    opponent_id: opponent,
  };
  const response = api.post("/games/", request);
  return response;
};

const getUserStats = async () => {
  const response = await api.get("/users/stats");
  const obj: UserStats[] = response.data;
  let total = 0;
  obj.forEach((param) => {
    total += param.count;
  });
  return [{ result: "total", count: total }, ...obj];
};

const getEligibleOpponents = async () => {
  const response = await api.get("/users");
  return response;
};

const makeMove = () => {};

const acceptMove = () => {};

const GameService = {
  getConcludedGames,
  getGameDetails,
  getActiveGame,
  getEligibleOpponents,
  createGame,
  getUserStats,
};

export default GameService;
