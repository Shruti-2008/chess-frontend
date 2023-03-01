import { PieceType } from "../Constants";
import { MovePosition } from "../utilities/commonInterfaces";
import { isEqual } from "../utilities/pieceUtilities";
import { Position } from "./Position";

interface MoveParams {
  startPos: Position;
  endPos: Position;
  isEnPassantCaptureMove?: boolean;
  isCastleMove?: boolean;
  // isPawnPromotion: boolean
}

interface NotationParams {
  srcPiece: string;
  destPiece: string;
  isPawnPromotionMove?: boolean;
  promotionType?: PieceType;
}

export class Move {
  startPos: Position;
  endPos: Position;
  isEnPassantCaptureMove: boolean;
  isCastleMove: boolean;
  // isPawnPromotion: boolean

  constructor({
    startPos,
    endPos,
    isEnPassantCaptureMove = false,
    isCastleMove = false,
  }: MoveParams) {
    this.startPos = startPos;
    this.endPos = endPos;
    this.isEnPassantCaptureMove = isEnPassantCaptureMove;
    this.isCastleMove = isCastleMove;
    // this.isPawnPromotion = isPawnPromotion
  }

  // isEqual(move: Move) {
  //   return (
  //     this.startPos.isSamePosition(move.startPos) &&
  //     this.endPos.isSamePosition(move.endPos)
  //   );
  // }

  isEqual(move: MovePosition) {
    return (
      this.startPos.isSamePosition(move.startPosition) &&
      this.endPos.isSamePosition(move.endPosition)
    );
  }

  getNotation({
    srcPiece,
    destPiece,
    isPawnPromotionMove = false,
    promotionType = PieceType.Empty,
  }: NotationParams) {
    const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8];
    const colToFile = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const typeToAbbr = [
      { type: PieceType.King, abbr: "K" },
      { type: PieceType.Queen, abbr: "Q" },
      { type: PieceType.Rook, abbr: "R" },
      { type: PieceType.Bishop, abbr: "B" },
      { type: PieceType.Knight, abbr: "N" },
    ];

    function isEqual2(piece: string, type: PieceType) {
      console.log(piece, type);
      return piece.toLowerCase() === type;
    }

    // const srcPiece = _board[this.startPos.x][this.startPos.y]
    // const destPiece = _board[this.endPos.x][this.endPos.y]
    let notation = [];

    if (this.isCastleMove) {
      //need to change logic here?????
      return Math.abs(this.startPos.y - this.endPos.y) === 2 ? "0-0" : "0-0-0";
    }

    // remove the condition and just keep body for full notation
    if (!isEqual(srcPiece, PieceType.Pawn)) {
      notation.push(
        typeToAbbr.find((obj) => isEqual2(srcPiece, obj.type))!.abbr
      );
    }

    if (destPiece !== PieceType.Empty) {
      if (isEqual(srcPiece, PieceType.Pawn)) {
        notation.push(colToFile[this.endPos.y]);
      }
      //captured so append x
      notation.push("x");
    }

    notation.push(colToFile[this.endPos.y]);
    notation.push(rowToRank[this.endPos.x]);

    if (this.isEnPassantCaptureMove) {
      notation.push(" e.p.");
    }

    if (isPawnPromotionMove) {
      //(this.isPawnPromotion){
      notation.push(
        typeToAbbr.find((obj) => isEqual(promotionType, obj.type))!.abbr
      );
    }

    return notation.join("");
    //To Do: Disambiguating moves
  }
}
