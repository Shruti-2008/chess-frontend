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

// function setInitialBoard() {
//     let initial_pieces: Piece[] = []
//     let color: Color
//     let ypos: number
//     for (let type = 0; type < 2; type += 1) {

//         [color, ypos] = type & 1 ? [Color.Black, 7] : [Color.White, 0]

//         initial_pieces.push(new Piece(new Position(0, ypos), PieceType.Rook, color))
//         initial_pieces.push(new Piece(new Position(1, ypos), PieceType.Knight, color))
//         initial_pieces.push(new Piece(new Position(2, ypos), PieceType.Bishop, color))
//         initial_pieces.push(new Piece(new Position(3, ypos), PieceType.Queen, color))
//         initial_pieces.push(new Piece(new Position(4, ypos), PieceType.King, color))
//         initial_pieces.push(new Piece(new Position(5, ypos), PieceType.Bishop, color))
//         initial_pieces.push(new Piece(new Position(6, ypos), PieceType.Knight, color))
//         initial_pieces.push(new Piece(new Position(7, ypos), PieceType.Rook, color))

//         // push pawns
//         ypos = ypos === 0 ? ypos + 1 : ypos - 1
//         for (let i = 0; i < BOARD_SIZE; i += 1) {
//             initial_pieces.push(new Piece(new Position(i, ypos), PieceType.Pawn, color))
//         }
//     }
//     return initial_pieces
// }

function setInitialBoard(){
    let board: Piece[][] = []
    for(let row = 0 ; row < BOARD_SIZE; row += 1){
        board[row] = []
        for(let col = 0; col < BOARD_SIZE; col += 1){
            const color = row < 4 ? Color.White : Color.Black
            //set pawns
            if(row == 1 || row == 6){
                //board[row][col] = new Piece(PieceType.Pawn, color)
                board[row].push(new Piece(PieceType.Pawn, color))
            }
            //set other pieces
            else if(row == 0 || row == 7){
                switch(col){
                    case 0:
                    case 7:
                        //board[row][col] = new Piece(PieceType.Rook, color)
                        board[row].push(new Piece(PieceType.Rook, color))
                        break
                    case 1:
                    case 6:
                        //board[row][col] = new Piece(PieceType.Knight, color)
                        board[row].push(new Piece(PieceType.Knight, color))
                        break
                    case 2:
                    case 5:
                        //board[row][col] = new Piece(PieceType.Bishop, color)
                        board[row].push(new Piece(PieceType.Bishop, color))
                        break
                    case 3:
                        //board[row][col] = new Piece(PieceType.Queen, color)
                        board[row].push(new Piece(PieceType.Queen, color))
                        break
                    case 4:
                        //board[row][col] = new Piece(PieceType.King, color)
                        board[row].push(new Piece(PieceType.King, color))
                }
            }
            else{
                //board[row][col] = new Piece(PieceType.Empty, Color.None)
                board[row].push(new Piece(PieceType.Empty, Color.None))
            }
        }
    }
    return board
}

export const initialBoard = setInitialBoard()

export const capturedCount = [
    {type: PieceType.Pawn, value: 0},
    {type: PieceType.Rook, value: 0},
    {type: PieceType.Knight, value: 0},
    {type: PieceType.Bishop, value: 0},
    {type: PieceType.Queen, value: 0},
    {type: PieceType.King, value: 0}
]