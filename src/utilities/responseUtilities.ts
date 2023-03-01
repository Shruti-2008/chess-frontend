import {
  CastleSide,
  Color,
  DrawStatus,
  EndReason,
  PieceType,
  Winner,
} from "../Constants";
import { Position } from "../models";
import Board from "../models/Board";
import { CaptureResponse, MoveResponse } from "./commonInterfaces";
import { isEqual } from "./pieceUtilities";

function getMovesFromResponse(moveHistory: string[]) {
  const movesLength = moveHistory.length;
  let moves = [];
  for (let i = 0; i < movesLength; i += 2) {
    const blackMove = i + 1 === movesLength ? "" : moveHistory[i + 1];
    blackMove
      ? moves.push([moveHistory[i], blackMove])
      : moves.push([moveHistory[i]]);
  }
  return moves;
}

function getBoardFromResponse(board: string) {
  let refreshedBoard: string[][] = [];
  for (let i = 0; i < 8; i += 1) {
    let row = [];
    for (let j = 0; j < 8; j += 1) {
      row.push(PieceType.Empty);
    }
    refreshedBoard.push(row);
  }

  const rows = board.split("#");
  rows.forEach((row, rowIdx) => {
    var colIdx = 0;
    for (var i = 0; i < row.length; i += 1) {
      if (isNumber(row[i])) {
        colIdx += +row[i];
      } else {
        refreshedBoard[rowIdx][colIdx] = row[i];
        colIdx += 1;
      }
    }
  });
  return refreshedBoard;
}

function isNumber(n: string) {
  return !isNaN(parseFloat(n)) && !isNaN(+n - 0);
}

function getBoardAsString(board: string[][]) {
  var res: string[] = [];
  board.forEach((row) => {
    var resRow: string[] = [];
    var emptyCount = 0;
    row.forEach((col) => {
      if (isEqual(col, PieceType.Empty)) {
        emptyCount += 1;
      } else {
        if (emptyCount !== 0) {
          resRow.push(emptyCount.toString());
          emptyCount = 0;
        }
        resRow.push(col);
      }
    });
    if (emptyCount !== 0) {
      resRow.push(emptyCount.toString());
    }
    res.push(resRow.join(""));
  });
  return res.join("#");
}

function getMoveHistory(moves: string[][]) {
  var res: string[] = [];
  moves.forEach((move) => {
    res.push(...move);
  });
  return res;
}

function getCapturedObject(
  capturedWhite: { type: PieceType; value: number }[],
  capturedBlack: { type: PieceType; value: number }[]
) {
  let res: { [key: string]: number } = {};
  capturedWhite.forEach((piece) => {
    res[piece.type] = piece.value;
  });
  capturedBlack.forEach((piece) => {
    res[piece.type.toUpperCase()] = piece.value;
  });
  return res;
}

const processResponse = (obj: MoveResponse) => {
  console.log("data recieved is", obj);
  const isEligibleForCastle = [
    { color: Color.White, side: CastleSide.Queenside, value: false },
    { color: Color.White, side: CastleSide.Kingside, value: false },
    { color: Color.Black, side: CastleSide.Queenside, value: false },
    { color: Color.Black, side: CastleSide.Kingside, value: false },
  ];

  // const whitePlayer = obj.white_player; //Check what happens when white_player is not sent
  // const blackPlayer = obj.black_player;
  const _gameId = +obj.id;
  const _player = obj.player_color === Color.White ? Color.White : Color.Black;
  const _activePlayer =
    obj.active_player === Color.White ? Color.White : Color.Black;
  const _whiteKingPos = new Position(
    obj.white_king_pos[0],
    obj.white_king_pos[1]
  );
  const _blackKingPos = new Position(
    obj.black_king_pos[0],
    obj.black_king_pos[1]
  );
  const _capturedWhite = [
    { type: PieceType.Pawn, value: obj.Capture.p },
    { type: PieceType.Rook, value: obj.Capture.r },
    { type: PieceType.Knight, value: obj.Capture.n },
    { type: PieceType.Bishop, value: obj.Capture.b },
    { type: PieceType.Queen, value: obj.Capture.q },
    { type: PieceType.King, value: obj.Capture.k },
  ];
  const _capturedBlack = [
    { type: PieceType.Pawn, value: obj.Capture.P },
    { type: PieceType.Rook, value: obj.Capture.R },
    { type: PieceType.Knight, value: obj.Capture.N },
    { type: PieceType.Bishop, value: obj.Capture.B },
    { type: PieceType.Queen, value: obj.Capture.Q },
    { type: PieceType.King, value: obj.Capture.K },
  ];
  const _enPassantPawnPosition =
    obj.enpassant_position && obj.enpassant_position.length > 0
      ? [new Position(obj.enpassant_position[0], obj.enpassant_position[1])]
      : [];
  const _playedMoves = getMovesFromResponse(obj.move_history);
  const _lastMove =
    obj.last_move_start &&
    obj.last_move_start.length > 0 &&
    obj.last_move_end &&
    obj.last_move_end.length > 0
      ? {
          startPosition: new Position(
            obj.last_move_start[0],
            obj.last_move_start[1]
          ),
          endPosition: new Position(obj.last_move_end[0], obj.last_move_end[1]),
        }
      : null;
  const _checkedKing =
    obj.checked_king === Color.White
      ? Color.White
      : obj.checked_king === Color.Black
      ? Color.Black
      : null; // is this required???????????
  const _isConcluded = obj.is_concluded;
  const _winner =
    obj.winner === Winner.White
      ? Winner.White
      : obj.winner === Winner.Black
      ? Winner.Black
      : obj.winner === Winner.Draw
      ? Winner.Draw
      : null;
  const _endReason = obj.end_reason ? +obj.end_reason : null;
  const _isEligibleForCastle = isEligibleForCastle.map((prev, idx) => {
    return { ...prev, value: obj.castle_eligibility[idx] };
  });
  const _board = getBoardFromResponse(obj.board);
  const _draw = obj.draw;
  const chessState = new Board(
    // _whitePlayer,
    // _blackPlayer,
    _gameId,
    false,
    _player,
    _activePlayer,
    _board,
    _whiteKingPos,
    _blackKingPos,
    _capturedWhite,
    _capturedBlack,
    _enPassantPawnPosition,
    _lastMove,
    _playedMoves,
    _checkedKing,
    _isConcluded,
    _endReason,
    _winner,
    _draw,
    _isEligibleForCastle
  );

  return chessState;
};

const getDrawValue = (draw: DrawStatus | null, player: Color) => {
  if (
    draw === null ||
    (player === Color.White &&
      (draw === DrawStatus.BlackOffered ||
        draw === DrawStatus.BlackRejected)) ||
    (player === Color.Black &&
      (draw === DrawStatus.WhiteOffered || draw === DrawStatus.WhiteRejected))
  ) {
    return null;
  }
  return draw;
};

const handleError = (error: any) => {
  let errorText = "";
  let logout = false;
  if (!error?.response && error?.request) {
    errorText = "No response from server";
  } else if (error.response && error.response.status === 403) {
    logout = true;
  } else if (error.response && error.response.status === 400) {
    // technical database details exposed
    errorText = error.response.data.detail;
  } else if (error.request) {
  } else {
    errorText = "Unexpected error occured";
  }
  return { errorText, logout };
};

export {
  getMovesFromResponse,
  isNumber,
  getBoardAsString,
  getMoveHistory,
  getCapturedObject,
  getBoardFromResponse,
  processResponse,
  handleError,
  getDrawValue,
};
