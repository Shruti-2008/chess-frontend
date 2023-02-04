import { PieceType } from "../Constants";
import { Piece } from "./Piece";
import { Position } from "./Position";

interface MoveParams {
    startPos: Position
    endPos: Position
    isEnPassantMove?: boolean
    isCastleMove?: boolean
    // isPawnPromotion: boolean
}

interface NotationParams {
    srcPiece: Piece
    destPiece: Piece
    isPawnPromotionMove?: boolean
    promotionType?: PieceType
}

export class Move {
    startPos: Position
    endPos: Position
    isEnPassantMove: boolean
    isCastleMove: boolean
    // isPawnPromotion: boolean

    constructor({ startPos, endPos, isEnPassantMove = false, isCastleMove = false }: MoveParams) {
        this.startPos = startPos
        this.endPos = endPos
        this.isEnPassantMove = isEnPassantMove
        this.isCastleMove = isCastleMove
        // this.isPawnPromotion = isPawnPromotion
    }

    isEqual(move: Move) {
        return this.startPos.isSamePosition(move.startPos) && this.endPos.isSamePosition(move.endPos)
    }

    getNotation({ srcPiece, destPiece, isPawnPromotionMove = false, promotionType = PieceType.Empty }: NotationParams) {
        const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8]
        const colToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
        const typeToAbbr = [
            { type: PieceType.King, abbr: 'K' },
            { type: PieceType.Queen, abbr: 'Q' },
            { type: PieceType.Rook, abbr: 'R' },
            { type: PieceType.Bishop, abbr: 'B' },
            { type: PieceType.Knight, abbr: 'N' }
        ]

        // const srcPiece = _board[this.startPos.x][this.startPos.y]
        // const destPiece = _board[this.endPos.x][this.endPos.y]
        let notation = []

        if (this.isCastleMove) { //need to change logic here?????
            return Math.abs(this.startPos.y - this.endPos.y) === 2 ? "0-0" : "0-0-0"
        }

        // remove the condition and just keep body for full notation
        if (srcPiece.type !== PieceType.Pawn) {
            notation.push(typeToAbbr.find(obj => obj.type === srcPiece.type)!.abbr)
        }

        if (destPiece.type !== PieceType.Empty) {
            if (srcPiece.type === PieceType.Pawn) {
                notation.push(colToFile[this.endPos.y])
            }
            //captured so append x
            notation.push('x')
        }

        notation.push(colToFile[this.endPos.y])
        notation.push(rowToRank[this.endPos.x])

        if (this.isEnPassantMove) {
            notation.push(" e.p.")
        }

        if (isPawnPromotionMove) {//(this.isPawnPromotion){
            notation.push(typeToAbbr.find(obj => obj.type === promotionType)!.abbr)
        }

        return notation.join('')
        //To Do: Disambiguating moves
    }
}