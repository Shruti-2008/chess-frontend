import { PieceType } from "../Constants";
import { MovePosition } from "../utilities/commonInterfaces";
import { isEqual } from "../utilities/pieceUtilities";
import { Position } from "./Position";

interface MoveParams {
  startPosition: Position;
  endPosition: Position;
}

interface NotationParams {
  srcPiece: string;
  destPiece: string;
  isCheck?: boolean;
  isCastleMove?: boolean;
  isEnPassantCaptureMove?: boolean;
  isPawnPromotionMove?: boolean;
  promotionType?: PieceType;
}

export class Move {
  startPosition: Position;
  endPosition: Position;

  constructor({ startPosition, endPosition }: MoveParams) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
  }

  isSameMove(move: MovePosition) {
    return (
      this.startPosition.isSamePosition(move.startPosition) &&
      this.endPosition.isSamePosition(move.endPosition)
    );
  }

  getNotation({
    srcPiece,
    destPiece,
    isCheck = false,
    isCastleMove = false,
    isEnPassantCaptureMove = false,
    isPawnPromotionMove = false,
    promotionType = PieceType.Empty,
  }: NotationParams) {
    const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8];
    const colToFile = ["a", "b", "c", "d", "e", "f", "g", "h"];

    let notation = [];

    // castle notation: 0-0 for kingside castle, 0-0-0 for queenside castle
    if (isCastleMove) {
      return this.endPosition.y === 2
        ? "0-0-0"
        : this.endPosition.y === 6
        ? "0-0"
        : "";
    }

    // remove the condition and just keep body for full notation
    // push the source piece making the move if it is not a pawn
    if (!isEqual(srcPiece, PieceType.Pawn)) {
      notation.push(
        srcPiece.toUpperCase()
        // can push image instead
      );
    }

    // if the move captures a piece, push 'x'
    if (destPiece !== PieceType.Empty || isEnPassantCaptureMove) {
      // if the source piece is pawn, push its source position file first
      if (isEqual(srcPiece, PieceType.Pawn)) {
        notation.push(colToFile[this.startPosition.y]);
      }
      //captured so append x
      notation.push("x");
    }

    // push the destination posiiton file and rank
    notation.push(colToFile[this.endPosition.y]);
    notation.push(rowToRank[this.endPosition.x]);

    // push 'e.p.' in case of enpassant captures
    if (isEnPassantCaptureMove) {
      notation.push(" e.p.");
    }

    // push the type promoted to in case of pawn promotion
    if (isPawnPromotionMove) {
      //(this.isPawnPromotion){
      notation.push(
        promotionType.toUpperCase()
        // can push image instead
      );
    }

    // push '+' in case of a check
    if (isCheck) {
      notation.push("+");
    }

    return notation.join("");
    //To Do: Disambiguating moves
  }
}
