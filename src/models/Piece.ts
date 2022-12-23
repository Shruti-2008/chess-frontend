import { nanoid } from "nanoid"
import { Position } from "./Position"
import { PieceType, Color} from "../Constants"

export class Piece{
    image? : string
    position : Position
    type : PieceType
    color : Color
    id : string
    isMoved: boolean
    
    constructor(position: Position, type: PieceType, pieceColor: Color){
        this.image = `${type}_${pieceColor}.png`
        this.position = position
        this.type = type
        this.color = pieceColor
        this.id = nanoid()
        this.isMoved = false
    }

    set setPosition(pos: Position){
        this.position = pos
    }

    clone(){
        return new Piece(this.position, this.type, this.color)
    }
}