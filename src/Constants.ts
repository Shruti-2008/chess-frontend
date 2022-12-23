import { Piece, Position } from "./models"


export enum Color {
    White = "w",
    Black = "b",
    None = "n"
}

export enum PieceType {
    Pawn = "pawn",
    Rook = "rook",
    Bishop = "bishop",
    Knight = "knight",
    King = "king",
    Queen = "queen",
    Empty = "empty"
}

export const BOARD_SIZE = 8
export const IMAGE_LOC = "../../assets/images/"

function setInitialBoard() {
    let initial_pieces: Piece[] = []
    let color: Color
    let ypos: number
    for (let type = 0; type < 2; type += 1) {

        // if (type & 1) {
        //     color = Color.Black
        //     ypos = 7
        // }
        // else {
        //     color = Color.White
        //     ypos = 0
        // }

        [color, ypos] = type & 1 ? [Color.Black, 7] : [Color.White, 0]

        initial_pieces.push(new Piece(new Position(0, ypos), PieceType.Rook, color))
        initial_pieces.push(new Piece(new Position(1, ypos), PieceType.Knight, color))
        initial_pieces.push(new Piece(new Position(2, ypos), PieceType.Bishop, color))
        initial_pieces.push(new Piece(new Position(3, ypos), PieceType.Queen, color))
        initial_pieces.push(new Piece(new Position(4, ypos), PieceType.King, color))
        initial_pieces.push(new Piece(new Position(5, ypos), PieceType.Bishop, color))
        initial_pieces.push(new Piece(new Position(6, ypos), PieceType.Knight, color))
        initial_pieces.push(new Piece(new Position(7, ypos), PieceType.Rook, color))

        // push pawns
        ypos = ypos === 0 ? ypos + 1 : ypos - 1
        for (let i = 0; i < BOARD_SIZE; i += 1) {
            initial_pieces.push(new Piece(new Position(i, ypos), PieceType.Pawn, color))
        }
    }
    return initial_pieces
}

export const initialBoard = setInitialBoard()