import { BOARD_SIZE, CastleSide, Color, PieceType } from "../Constants";
import { Position } from "../models";
import { Move } from "../models/Move";
import { BoardType } from "./commonInterfaces";
import { getColor, getOpponentColor, isEqual } from "./pieceUtilities";

function findMoves(_chessState: BoardType) {
  let _moves: Move[] = [];
  const kingColor = _chessState.player;
  const kingPosition =
    kingColor === Color.White
      ? _chessState.whiteKingPos
      : _chessState.blackKingPos;
  const { _isChecked, _checkingPieces, _pins } = getPinsandCheckingPieces(
    _chessState.board,
    kingColor,
    kingPosition
  );

  if (_isChecked) {
    // check given by just 1 piece
    if (_checkingPieces.length === 1) {
      const checking = _checkingPieces[0];
      const checkingPiece =
        _chessState.board[checking.position.x][checking.position.y];
      const validTiles: Position[] = [];
      // kill checking piece OR block checking piece OR move king
      // get a list of valid tiles that will kill/block:
      if (checkingPiece === PieceType.Knight) {
        // if checking piece is a knight, need to kill knight so just 1 valid tile
        validTiles.push(checking.position);
      } else {
        // for other checking pieces, any tile in the direction of the checking piece from king upto the checking piece is a valid tile
        for (let i = 1; i < BOARD_SIZE; i += 1) {
          const validPos = new Position(
            kingPosition.x + checking.direction.x * i,
            kingPosition.y + checking.direction.y * i
          );
          validTiles.push(validPos);
          if (validPos.isSamePosition(checking.position)) {
            break;
          }
        }
      }

      // get all moves as usual
      getAllMoves(_chessState, _moves, _pins);
      // filter the moves to keep just the moves whose destination is a valid square OR the valid king moves
      _moves = _moves.filter(
        (move) =>
          validTiles.some((tile) => tile.isSamePosition(move.endPosition)) ||
          move.startPosition.isSamePosition(kingPosition) // we already check if king is moving into checked position while calculating king moves
      );
    } else {
      // double-check so king has to move
      // call function to get just king moves
      // const directions = [[-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]]
      getKingMoves(_chessState, kingPosition, _moves);
    }
  } else {
    //get all moves as usual
    getAllMoves(_chessState, _moves, _pins);
  }
  return { _isChecked, _moves };
}

// find moves for pieces from the opponent team
function getAllMoves(
  _chessState: BoardType,
  _moves: Move[],
  _pins: { position: Position; direction: Position }[]
) {
  const color = _chessState.player;
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = _chessState.board[row][col];
      if (piece !== "-" && getColor(piece) === color) {
        getMoves(_chessState, piece, new Position(row, col), _moves, _pins);
      }
    }
  }
}

// find moves for a piece based on piece type
function getMoves(
  _chessState: BoardType,
  piece: string,
  position: Position,
  moves: Move[],
  pins: { position: Position; direction: Position }[]
) {
  let directions: Array<Array<number>> = [];
  switch (piece.toLowerCase()) {
    case PieceType.Pawn:
      getPawnMoves(_chessState, piece, position, moves, pins);
      return;
    case PieceType.Rook:
      directions = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
      ]; //left, right, top, bottom
      break;
    case PieceType.Bishop:
      directions = [
        [-1, -1],
        [-1, 1],
        [1, 1],
        [1, -1],
      ]; //south-west, north-west, north-east, south-east
      break;
    case PieceType.Knight:
      directions = [
        [-1, 2],
        [1, 2],
        [-2, 1],
        [-2, -1],
        [2, 1],
        [2, -1],
        [-1, -2],
        [1, -2],
      ];
      break;
    case PieceType.Queen:
      directions = [
        [-1, 0],
        [-1, 1],
        [0, 1],
        [1, 1],
        [1, 0],
        [1, -1],
        [0, -1],
        [-1, -1],
      ];
      break;
    case PieceType.King:
      getKingMoves(_chessState, position, moves);
      return;
    case PieceType.Empty:
    default:
      return;
  }
  getPieceMoves(_chessState.board, directions, piece, position, moves, pins);
}

// find moves for rook, bishop, knight, queen
function getPieceMoves(
  _board: string[][],
  directions: Array<Array<number>>,
  srcPiece: string,
  srcPosition: Position,
  moves: Move[],
  pins: { position: Position; direction: Position }[]
) {
  const srcPieceColor = getColor(srcPiece);
  const opponentColor = getOpponentColor(srcPieceColor);
  let possibleMoves: Move[] = [];
  const pin = pins.find((pin) => pin.position.isSamePosition(srcPosition));
  const isPinned = pin ? true : false;

  directions.forEach((move_direction, idx) => {
    // if the current piece is not pinned or if it is pinned, the direction of piece movement still keeps it pinned i.e. protects king from checking piece.
    if (
      !isPinned ||
      (pin!.direction.x === move_direction[0] &&
        pin!.direction.y === move_direction[1]) ||
      (-pin!.direction.x === move_direction[0] &&
        -pin!.direction.y === move_direction[1])
    ) {
      for (let index = 1; index < BOARD_SIZE; index++) {
        const destPosition = new Position(
          srcPosition.x + move_direction[0] * index,
          srcPosition.y + move_direction[1] * index
        );
        if (destPosition.isInRange()) {
          const destPiece = _board[destPosition.x][destPosition.y];
          // blank tile
          if (isEqual(destPiece, PieceType.Empty)) {
            possibleMoves.push(
              new Move({
                startPosition: srcPosition,
                endPosition: destPosition,
              })
            );
          }
          // tile occupied by opponent piece
          else if (getColor(destPiece) === opponentColor) {
            possibleMoves.push(
              new Move({
                startPosition: srcPosition,
                endPosition: destPosition,
              })
            );
            break;
          }
          // tile occupied by ally piece
          else {
            break;
          }
        } else {
          // tile out of range
          break;
        }
        if (isEqual(srcPiece, PieceType.Knight)) {
          // since knight can just move one step at a time
          break;
        }
      }
    }
  });
  moves.push(...possibleMoves);
}

// get possible castle moves for given king
function getCastleMoves(
  _chessState: BoardType,
  kingPosition: Position,
  side: CastleSide,
  possibleCastleMoves: Move[]
) {
  const kingColor = _chessState.player;
  _chessState.isEligibleForCastle.forEach((obj) => {
    if (obj.color === kingColor && obj.side === side && obj.value) {
      // eligible for castle
      const [direction, y] = side === CastleSide.Queenside ? [-1, 0] : [1, 7]; // [y-direction of king movement, y position of rook]
      const rookPosition = new Position(kingPosition.x, y);
      if (
        isCastlePathClear(
          _chessState.board,
          kingPosition,
          rookPosition,
          direction
        )
      ) {
        possibleCastleMoves.push(
          new Move({
            startPosition: kingPosition,
            endPosition: new Position(
              kingPosition.x,
              kingPosition.y + 2 * direction
            ),
          })
        );
      }
    }
  });
}

// return true if there is no piece between the king and rook
function isCastlePathClear(
  _board: string[][],
  kingPos: Position,
  rookPos: Position,
  direction: number
) {
  for (
    let col = kingPos.y + direction;
    col - rookPos.y !== 0;
    col += direction
  ) {
    const piece = _board[kingPos.x][col];
    if (piece !== PieceType.Empty) {
      return false;
    }
  }
  return true;
}

// find moves for pawns
// Pawn moves: 1 step forward move, 2 step forward move, diagonal capture move, diagonal enpassant capture move
function getPawnMoves(
  _chessState: BoardType,
  piece: string,
  srcPosition: Position,
  moves: Move[],
  pins: { position: Position; direction: Position }[]
) {
  const [rowDirection, specialRow, opponentColor] =
    getColor(piece) === Color.White
      ? [1, 1, Color.Black]
      : [-1, 6, Color.White]; // special row denotes the row from which pawn can move forwrd 2 steps i.e. start row of pawn
  const pin = pins.find((pin) => pin.position.isSamePosition(srcPosition));
  const isPinned = pin ? true : false;

  // move pawn one step ahead
  const forwardPosition = new Position(
    srcPosition.x + rowDirection,
    srcPosition.y
  );
  if (
    forwardPosition.isInRange() &&
    isEqual(
      _chessState.board[forwardPosition.x][forwardPosition.y],
      PieceType.Empty
    )
  ) {
    // pawn is not pinned or even if it is pinned, the direction of movement of pawn keeps it pinned
    if (
      !isPinned ||
      (pin!.direction.x === rowDirection && pin!.direction.y === 0) ||
      (-pin!.direction.x === rowDirection && pin!.direction.y === 0)
    ) {
      moves.push(
        new Move({ startPosition: srcPosition, endPosition: forwardPosition })
      );
      if (srcPosition.x === specialRow) {
        // move pawn 2 steps ahead
        const doubleForwardPosition = new Position(
          forwardPosition.x + rowDirection,
          forwardPosition.y
        );
        const doubleForwardPiece =
          _chessState.board[doubleForwardPosition.x][doubleForwardPosition.y];
        if (isEqual(doubleForwardPiece, PieceType.Empty)) {
          moves.push(
            new Move({
              startPosition: srcPosition,
              endPosition: doubleForwardPosition,
            })
          );
        }
      }
    }
  }

  let colDirection = 1; // one step to the left or right
  for (let i = 0; i < 2; i += 1) {
    colDirection *= -1;
    const diagonalPosition = new Position(
      srcPosition.x + rowDirection,
      srcPosition.y + colDirection
    );

    if (diagonalPosition.isInRange()) {
      const diagonalPiece =
        _chessState.board[diagonalPosition.x][diagonalPosition.y];
      // pawn is not pinned or even if it is pinned, the direction of movement of pawn keeps it pinned
      if (
        !isPinned ||
        (pin!.direction.x === rowDirection &&
          pin!.direction.y === colDirection) ||
        (-pin!.direction.x === rowDirection &&
          -pin!.direction.y === colDirection)
      ) {
        // if previous move was an enpassant move right beside the current pawn
        if (
          _chessState.enPassantPawnPosition.length > 0 &&
          _chessState.enPassantPawnPosition[0].isSamePosition(
            new Position(srcPosition.x, srcPosition.y + colDirection)
          )
        ) {
          moves.push(
            new Move({
              startPosition: srcPosition,
              endPosition: diagonalPosition,
            })
          );
        }
        // possible to diagonally capture an opponent piece
        else if (
          !isEqual(diagonalPiece, PieceType.Empty) &&
          getColor(diagonalPiece) === opponentColor
        ) {
          moves.push(
            new Move({
              startPosition: srcPosition,
              endPosition: diagonalPosition,
            })
          );
        }
      }
    }
  }
}

// find moves for king while ensuring that the move is safe i.e. it does not place the king in check
// King moves: 1 step in each direction, castle moves
function getKingMoves(
  _chessState: BoardType,
  srcPosition: Position,
  moves: Move[]
) {
  const pieceColor = _chessState.player;
  const directions = [
    [-1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
    [1, 0],
    [1, -1],
    [0, -1],
    [-1, -1],
  ];
  directions.forEach((direction) => {
    const destPos = new Position(
      srcPosition.x + direction[0],
      srcPosition.y + direction[1]
    );
    if (destPos.isInRange()) {
      const destPiece = _chessState.board[destPos.x][destPos.y];
      // destination is empty or holds an opponent piece
      if (
        isEqual(destPiece, PieceType.Empty) ||
        getColor(destPiece) !== pieceColor
      ) {
        // place king at destination position and find out if it leads to check
        const { _isChecked } = getPinsandCheckingPieces(
          _chessState.board,
          pieceColor,
          destPos
        );
        if (!_isChecked) {
          moves.push(
            new Move({
              startPosition: srcPosition,
              endPosition: destPos,
            })
          );
        }
      }
    }
  });

  let possibleCastleMoves: Move[] = [];
  // Queenside
  getCastleMoves(
    _chessState,
    srcPosition,
    CastleSide.Queenside,
    possibleCastleMoves
  );
  // Kingside
  getCastleMoves(
    _chessState,
    srcPosition,
    CastleSide.Kingside,
    possibleCastleMoves
  );

  // check if the castle move places the king under check
  possibleCastleMoves.forEach((move) => {
    const { _isChecked } = getPinsandCheckingPieces(
      _chessState.board,
      pieceColor,
      move.endPosition
    );
    if (!_isChecked) {
      moves.push(move);
    }
  });
}

// return an object with the following items:
// _isChecked : boolean => whether the king is in check
// _checkingPieces : array of objects => denoting the pieces which put the king into check and their direction with respect to the king
// _pins : array of objects => denoting the pinned pieces and the direction of pin with respect to the king
function getPinsandCheckingPieces(
  _board: string[][],
  kingColor: Color,
  kingPosition: Position
) {
  let _isChecked: boolean = false;
  let _pins: { position: Position; direction: Position }[] = [];
  let _checkingPieces: { position: Position; direction: Position }[] = [];

  let possiblePins: Position[];
  let directions = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [0, -1],
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  directions.forEach((direction, idx) => {
    possiblePins = [];
    for (let i = 1; i < BOARD_SIZE; i++) {
      // tile under evaluation
      let newPos = new Position(
        kingPosition.x + direction[0] * i,
        kingPosition.y + direction[1] * i
      );
      if (newPos.isInRange()) {
        const piece = _board[newPos.x][newPos.y];
        const pieceColor = getColor(piece);

        if (piece !== PieceType.Empty) {
          if (pieceColor === kingColor && !isEqual(piece, PieceType.King)) {
            // ally
            // second check in cases when we are trying out if moving king will put it into check
            if (possiblePins.length === 0) {
              possiblePins.push(newPos);
            } else {
              break;
            }
          } else if (pieceColor === getOpponentColor(kingColor)) {
            // enemy
            // 1. rook, 2. bishop, 3. pawn, 4. queen 5. king
            if (
              (isEqual(piece, PieceType.Rook) && 0 <= idx && idx < 4) ||
              (isEqual(piece, PieceType.Bishop) && idx >= 4 && idx < 8) ||
              (isEqual(piece, PieceType.Pawn) &&
                i === 1 &&
                ((pieceColor === Color.White && 4 <= idx && idx <= 5) ||
                  (pieceColor === Color.Black && 6 <= idx && idx <= 7))) ||
              isEqual(piece, PieceType.Queen) ||
              (isEqual(piece, PieceType.King) && i === 1) // should never happen ideally
            ) {
              if (possiblePins.length === 0) {
                _isChecked = true;
                _checkingPieces.push({
                  position: newPos,
                  direction: new Position(direction[0], direction[1]),
                });
                break;
              } else {
                _pins.push({
                  position: possiblePins[0],
                  direction: new Position(direction[0], direction[1]),
                });
                break;
              }
            } else {
              // opponent piece does not give check, so no need to explore this direction more
              break;
            }
          }
        }
      } else {
        // out of range
        break;
      }
    }
  });

  // since knight gives direct check (in 1 move) and knight moves in 2 + 1 steps
  const knightMoves = [
    [-1, 2],
    [1, 2],
    [-1, -2],
    [1, -2],
    [-2, 1],
    [2, 1],
    [-2, -1],
    [2, -1],
  ];
  knightMoves.forEach((move) => {
    const newPos = new Position(
      kingPosition.x + move[0],
      kingPosition.y + move[1]
    );
    if (newPos.isInRange()) {
      const piece = _board[newPos.x][newPos.y];
      if (isEqual(piece, PieceType.Knight) && getColor(piece) !== kingColor) {
        _isChecked = true;
        _checkingPieces.push({
          position: newPos,
          direction: new Position(move[0], move[1]),
        });
      }
    }
  });

  return { _isChecked, _checkingPieces, _pins };
}

// returns whether the opponent king is under check
function isOpponentKingUnderCheck(_chessState: BoardType) {
  const opponentKingColor = getOpponentColor(_chessState.player);
  const opponentKingPosition =
    opponentKingColor === Color.White
      ? _chessState.whiteKingPos
      : _chessState.blackKingPos;
  const { _isChecked } = getPinsandCheckingPieces(
    _chessState.board,
    opponentKingColor,
    opponentKingPosition
  );
  return _isChecked;
}

export { findMoves, isOpponentKingUnderCheck };
