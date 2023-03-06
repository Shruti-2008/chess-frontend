import { Color, EndReason, PieceType, Winner } from "../Constants";
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

// return list of concluded games played by current user
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
        game.winner === Winner.White
          ? "1-0"
          : game.winner === Winner.Black
          ? "0-1"
          : game.winner === Winner.Draw
          ? "1/2-1/2"
          : "",
      noOfMoves: game.no_of_moves ? Math.ceil(game.no_of_moves / 2) : 0,
      date: new Date(game.created_at),
    });
  });
  return games;
};

// return details of the concluded game selected
const getGameDetails = async (id: number) => {
  const response = await api.get(`/games/${id}`);
  const data: GameDetailsIn = response.data;
  const game: GameDetails = {
    board: getBoardFromResponse(data.board),
    whitePlayer: data.white_player,
    blackPlayer: data.black_player,
    winner:
      data.winner === Winner.White
        ? Winner.White
        : data.winner === Winner.Black
        ? Winner.Black
        : Winner.Draw,
    endReason: EndReason[+data.end_reason],
    result:
      data.winner === Winner.White
        ? "1-0"
        : data.winner === Winner.Black
        ? "0-1"
        : data.winner === Winner.Draw
        ? "1/2-1/2"
        : "",
    checkedKing: data.checked_king
      ? data.checked_king === Color.White
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

// return details of active game of current user
const getActiveGame = async () => {
  // const config = {
  //   headers: { Authorization: `Bearer ${TokenService.getAccessToken()}` },
  // };
  const response = await api.get("/games/active");
  return response;
};

// create and return a new game with selected opponent
const createGame = async (opponent: number) => {
  const request = {
    opponent_id: opponent,
  };
  const response = api.post("/games/", request);
  return response;
};

// return stats based on the concluded games played by current user
const getUserStats = async () => {
  const response = await api.get("/users/stats");
  const data: UserStats[] = response.data;

  // count total concluded games played by current user
  let total = 0;
  data.forEach((outcome) => {
    total += outcome.count;
  });

  // save stats in the form of a dictionary. ex. {won:2, lost:3, draw:1}
  const statDict: { won?: number; lost?: number; draw?: number } = data.reduce(
    (accumulated, current) => ({
      ...accumulated,
      [current.result]: current.count,
    }),
    {}
  );

  return [
    { result: "total", count: total },
    { result: "won", count: statDict.won ? statDict.won : 0 },
    { result: "lost", count: statDict.lost ? statDict.lost : 0 },
    { result: "draw", count: statDict.draw ? statDict.draw : 0 },
  ];
};

// return list of users who do not currently have an active game
const getEligibleOpponents = async () => {
  const response = await api.get("/users");
  return response;
};

const GameService = {
  getConcludedGames,
  getGameDetails,
  getActiveGame,
  createGame,
  getUserStats,
  getEligibleOpponents,
};

export default GameService;
