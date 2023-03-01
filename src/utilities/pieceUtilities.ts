import { nanoid } from "nanoid";
import { PieceType, Color } from "../Constants";

// return color of piece
function getColor(symbol: string) {
  return symbol.toLowerCase() === symbol ? Color.White : Color.Black;
}

// returns true if the piece = PieceType passed
function isEqual(piece: string, type: PieceType) {
  return piece.toLowerCase() === type;
}

// return color of opponent
function getOpponentColor(color: Color) {
  return color === Color.White ? Color.Black : Color.White;
}

// return name of PieceType
function getName(symbol: string) {
  switch (symbol.toLowerCase()) {
    case "p":
      return "pawn";
    case "r":
      return "rook";
    case "b":
      return "bishop";
    case "n":
      return "knight";
    case "q":
      return "queen";
    case "k":
      return "king";
  }
}

// return pieceType from string
function getPieceType(symbol: string) {
  switch (symbol.toLowerCase()) {
    case "p":
      return PieceType.Pawn;
    case "r":
      return PieceType.Rook;
    case "b":
      return PieceType.Bishop;
    case "n":
      return PieceType.Knight;
    case "q":
      return PieceType.Queen;
    case "k":
      return PieceType.King;
    default:
      return PieceType.Empty;
  }
}

export { getColor, getOpponentColor, getName, isEqual, getPieceType };
