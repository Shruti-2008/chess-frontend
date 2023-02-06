import { nanoid } from "nanoid"
import { PieceType, Color } from "../Constants"

// return color of piece
function getColor(symbol: string) {
    return symbol.toLowerCase() === symbol ? Color.White : Color.Black
}

// returns true if the piece = PieceType passed
function isEqual(piece: string, type: PieceType) {
    return piece.toLowerCase() === type
}

// return name of PieceType
function getName(symbol: string) {
    switch (symbol.toLowerCase()) {
        case "p": return "pawn"
        case "r": return "rook"
        case "b": return "bishop"
        case "n": return "knight"
        case "q": return "queen"
        case "k": return "king"
    }
}

export {getColor, getName, isEqual}