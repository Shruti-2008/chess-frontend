import { Color, EndReason, Winner } from "../Constants";
import {
  GameDetails,
  GameDetailsIn,
  GameOverview,
  GameOverviewIn,
  UserStats,
} from "../utilities/commonInterfaces";
import { processResponse } from "../utilities/responseUtilities";
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
    chessState: processResponse(response.data),
    whitePlayer: data.white_player,
    blackPlayer: data.black_player,
    player:
      data.player_color === Color.White
        ? Color.White
        : data.player_color === Color.Black
        ? Color.Black
        : Color.None,
    activePlayer:
      data.active_player === Color.White
        ? Color.White
        : data.active_player === Color.Black
        ? Color.Black
        : Color.None,
    result:
      data.winner === Winner.White
        ? "1-0"
        : data.winner === Winner.Black
        ? "0-1"
        : data.winner === Winner.Draw
        ? "1/2-1/2"
        : "",
    flipBoard: TokenService.getUser().username === data.black_player,
  };
  return game;
};

// return details of active game of current user
const getActiveGame = async () => {
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
