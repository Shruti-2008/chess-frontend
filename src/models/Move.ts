import { PieceType } from "../Constants";
import { Piece } from "./Piece";
import { Position } from "./Position";

export class Move {
    startPos: Position
    endPos: Position
    isEnPassantMove: boolean
    isCastleMove: boolean
    isPawnPromotion: boolean

    constructor(startPos: Position, endPos: Position, isEnPassantMove = false, isCastleMove = false, isPawnPromotion = false) {
        this.startPos = startPos
        this.endPos = endPos
        this.isEnPassantMove = isEnPassantMove
        this.isCastleMove = isCastleMove
        this.isPawnPromotion = isPawnPromotion
    }

    isEqual(move: Move) {
        return this.startPos.samePosition(move.startPos) && this.endPos.samePosition(move.endPos)
    }

    getNotation(_board: Piece[][], promotionType = PieceType.Empty) {
        const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8]
        const colToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const typeToAbbr = [{type:PieceType.King, abbr:'K'}, {type:PieceType.Queen, abbr:'Q'}, {type:PieceType.Rook, abbr:'R'}, {type:PieceType.Bishop, abbr:'B'}, {type:PieceType.Knight, abbr:'N'}]
        const srcPiece = _board[this.startPos.x][this.startPos.y]
        const destPiece = _board[this.endPos.x][this.endPos.y]
        let notation = []

        if(this.isCastleMove){
                return Math.abs(this.startPos.y-this.endPos.y)=== 2 ? "0-0" : "0-0-0"
            }

        if (srcPiece.type !== PieceType.Pawn){
            notation.push(typeToAbbr.find(obj => obj.type === srcPiece.type)!.abbr)
        }
        if(destPiece.type !== PieceType.Empty){
            if(srcPiece.type === PieceType.Pawn){
                notation.push(colToFile[this.endPos.y])
            }
            //captured so append x
            notation.push('x')
        }
        notation.push(colToFile[this.endPos.y])
        notation.push(rowToRank[this.endPos.x])

        if(this.isEnPassantMove){
            notation.push(" e.p.")
        }

        if(this.isPawnPromotion){
            notation.push(typeToAbbr.find(obj => obj.type === promotionType)!.abbr)
        }

        //To Do: Disambiguating moves
    }
}