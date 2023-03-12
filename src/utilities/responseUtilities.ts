import {
  BOARD_SIZE,
  CastleSide,
  Color,
  DrawStatus,
  PieceType,
  Winner,
} from "../Constants";
import { Position } from "../models";
import {
  BoardType,
  CaptureResponse,
  Captures,
  MoveResponse,
} from "./commonInterfaces";
import { getOpponentColor, getPieceType, isEqual } from "./pieceUtilities";

//#region -------- utilities for processing message recieved --------

// return move history as a move-pair array
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

// return board as a 2-dimensional 8x8 array. ex: [[r,n,b,q,k,b,n,r], [p,p,p,p,p,p,p,p], [-,-,-,-,-,-,-,-], ...]
// black pieces (denoted using uppercase) : P, R, B, N, Q, K
// white pieces (denoted using lowercase) : p, r, b, n, q, k
// empty pieces (denoted using hyphen) : -
function getBoardFromResponse(board: string) {
  // create a board with all empty pieces
  let refreshedBoard: string[][] = [];
  for (let i = 0; i < BOARD_SIZE; i += 1) {
    let row = [];
    for (let j = 0; j < BOARD_SIZE; j += 1) {
      row.push(PieceType.Empty);
    }
    refreshedBoard.push(row);
  }

  // populate the board according to the response
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

// get captured white
function getCapturedWhite(capture: CaptureResponse) {
  return [
    { type: PieceType.Pawn, value: capture.p },
    { type: PieceType.Rook, value: capture.r },
    { type: PieceType.Knight, value: capture.n },
    { type: PieceType.Bishop, value: capture.b },
    { type: PieceType.Queen, value: capture.q },
    { type: PieceType.King, value: capture.k },
  ];
}

// get captured white
function getCapturedBlack(capture: CaptureResponse) {
  return [
    { type: PieceType.Pawn, value: capture.P },
    { type: PieceType.Rook, value: capture.R },
    { type: PieceType.Knight, value: capture.N },
    { type: PieceType.Bishop, value: capture.B },
    { type: PieceType.Queen, value: capture.Q },
    { type: PieceType.King, value: capture.K },
  ];
}

// return chessState
function processResponse(obj: MoveResponse): BoardType {
  const isEligibleForCastle = [
    { color: Color.White, side: CastleSide.Queenside, value: false },
    { color: Color.White, side: CastleSide.Kingside, value: false },
    { color: Color.Black, side: CastleSide.Queenside, value: false },
    { color: Color.Black, side: CastleSide.Kingside, value: false },
  ];

  const _gameId = +obj.id;
  const _whiteKingPos = new Position(
    obj.white_king_pos[0],
    obj.white_king_pos[1]
  );
  const _blackKingPos = new Position(
    obj.black_king_pos[0],
    obj.black_king_pos[1]
  );
  const _capturedWhite = getCapturedWhite(obj.Capture);
  const _capturedBlack = getCapturedBlack(obj.Capture);
  const _enPassantPawnPosition =
    obj.enpassant_position && obj.enpassant_position.length > 0
      ? [new Position(obj.enpassant_position[0], obj.enpassant_position[1])]
      : [];
  const _playedMoves = getMovesFromResponse(obj.move_history);
  const _steps = obj.steps;
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
      : null;
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

  const chessState: BoardType = {
    gameId: _gameId,
    board: _board,
    whiteKingPos: _whiteKingPos,
    blackKingPos: _blackKingPos,
    capturedWhite: _capturedWhite,
    capturedBlack: _capturedBlack,
    enPassantPawnPosition: _enPassantPawnPosition,
    lastMove: _lastMove,
    playedMoves: _playedMoves,
    steps: _steps,
    checkedKing: _checkedKing,
    isConcluded: _isConcluded,
    endReason: _endReason,
    winner: _winner,
    draw: _draw,
    isEligibleForCastle: _isEligibleForCastle,
  };

  return chessState;
}

// return tile number based on the tile name/notation ex. a -> 0, ? -> 63
const getNumberFromString = (char: string): number => {
  if (isNaN(Number(char))) {
    const asciiValue = char.charCodeAt(0);
    return asciiValue >= 97 && asciiValue <= 122
      ? asciiValue - 97
      : asciiValue >= 65 && asciiValue <= 90
      ? asciiValue - 39 // - 65 + 26 = -39
      : asciiValue === 33 // ascii value 33 = !
      ? 62
      : asciiValue; // ascii value 63 = ?
  } else {
    return 52 + Number(char);
  }
};

// return position based on tile number
const getPositionFromNumber = (num: number) => {
  return new Position(Math.floor(num / 8), num % 8);
};

// return move parameters based on step and move notation
const getMoveParameters = (move: string, notation: string) => {
  const moveStartPosition = getPositionFromNumber(getNumberFromString(move[0]));
  const moveEndPosition = getPositionFromNumber(getNumberFromString(move[1]));
  const lastChar = notation[notation.length - 1];
  const promotionType = getPieceType(lastChar);
  return {
    moveStartPosition,
    moveEndPosition,
    promotionType,
  };
};

//#endregion

//#region -------- utilities for constructing message to be sent --------

// return board as a string. each row is seperated by a '#'. ex: rnbqkbnr#pp4p1#2p2p2#.....
// black pieces (denoted using uppercase) : P, R, B, N, Q, K
// white pieces (denoted using lowercase) : p, r, b, n, q, k
// empty pieces (denoted by a number) : represents the number og consecutive empty pieces until the next occupied piece or row end
function getBoardAsString(board: string[][]) {
  var stringBoard: string[] = [];

  board.forEach((row) => {
    var stringBoardRow: string[] = [];
    var emptyCount = 0;

    row.forEach((col) => {
      if (isEqual(col, PieceType.Empty)) {
        emptyCount += 1;
      } else {
        if (emptyCount !== 0) {
          stringBoardRow.push(emptyCount.toString());
          emptyCount = 0;
        }
        stringBoardRow.push(col);
      }
    });

    if (emptyCount !== 0) {
      stringBoardRow.push(emptyCount.toString());
    }

    stringBoard.push(stringBoardRow.join(""));
  });

  return stringBoard.join("#");
}

// return move history as a flattened array ex: [e5, d2, a3, e8,......]
function getMoveHistory(moves: string[][]) {
  var moveOut: string[] = [];
  moves.forEach((move) => {
    moveOut.push(...move);
  });
  return moveOut;
}

// return CaptureResponse object
function getCapturedObject(
  capturedWhite: Captures[],
  capturedBlack: Captures[]
) {
  let capturedPieces: { [key: string]: number } = {};
  capturedWhite.forEach((piece) => {
    capturedPieces[piece.type] = piece.value;
  });
  capturedBlack.forEach((piece) => {
    capturedPieces[piece.type.toUpperCase()] = piece.value;
  });
  return capturedPieces;
}

function constructResponse(chessState: BoardType, player: Color) {
  return {
    id: chessState!.gameId,
    board: getBoardAsString(chessState!.board),
    player_color: player,
    active_player: getOpponentColor(player),
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
    steps: chessState!.steps,
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
    end_reason: chessState!.endReason,
    draw: getDrawValue(chessState.draw, player),
    Capture: getCapturedObject(
      chessState!.capturedWhite,
      chessState!.capturedBlack
    ),
  };
}

// return null if the draw status indicates that the draw has been offered/rejected by the opponent
// because the opponent already knows what action he performed
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

function getStepNotationFromPosition(pos: Position) {
  const num = pos.x * 8 + pos.y;
  return num <= 25
    ? String.fromCharCode(num + 97)
    : num <= 51
    ? String.fromCharCode(num + 65 - 26)
    : num <= 61
    ? (num - 52).toString()
    : num === 62
    ? "!"
    : num === 63
    ? "?"
    : "";
}

//#endregion

//#region -------- general functions --------

// return true if string passed can be converted to a valid number
function isNumber(n: string) {
  return !isNaN(parseFloat(n)) && !isNaN(+n - 0);
}

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

//#endregion

export {
  getMovesFromResponse,
  getBoardFromResponse,
  getCapturedWhite,
  getCapturedBlack,
  processResponse,
  getMoveParameters,
  getBoardAsString,
  getMoveHistory,
  getCapturedObject,
  constructResponse,
  getDrawValue,
  getStepNotationFromPosition,
  isNumber,
  handleError,
};
