import { Piece } from "./Piece";
import { Position } from "./Position";

export class Move{
    startPos: Position
    endPos: Position
    isEnPassantMove: boolean

    constructor(startPos: Position, endPos: Position, isEnPassantMove=false){
        this.startPos = startPos
        this.endPos = endPos
        this.isEnPassantMove = isEnPassantMove
    }

    isEqual(move:Move){
        return this.startPos.samePosition(move.startPos) && this.endPos.samePosition(move.endPos)
    }
}