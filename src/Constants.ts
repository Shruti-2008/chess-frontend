export enum Color {
    White = "w",
    Black = "b",
    None = "n"
}

export enum PieceType {
    Pawn = "p",
    Rook = "r",
    Bishop = "b",
    Knight = "n",
    King = "k",
    Queen = "q",
    Empty = "-"
}

export enum CastleSide {
    Queenside = "Q",
    Kingside = "K"
}

export const BOARD_SIZE = 8
export const IMAGE_LOC = "../../assets/images/"
export const capturedCount = [
    {type: PieceType.Pawn, value: 0},
    {type: PieceType.Rook, value: 0},
    {type: PieceType.Knight, value: 0},
    {type: PieceType.Bishop, value: 0},
    {type: PieceType.Queen, value: 0},
    {type: PieceType.King, value: 0}
]

function setInitialBoard(){
        let board: string[][] = []
        for(let row = 0 ; row < BOARD_SIZE; row += 1){
            board[row] = []
            for(let col = 0; col < BOARD_SIZE; col += 1){
                const color = row < 4 ? Color.White : Color.Black
                //set pawns
                if(row === 1 || row === 6){
                    board[row].push(color === Color.White ? PieceType.Pawn : PieceType.Pawn.toUpperCase())
                }
                //set other pieces
                else if(row === 0 || row === 7){
                    switch(col){
                        case 0:
                        case 7:
                            board[row].push(color === Color.White ? PieceType.Rook : PieceType.Rook.toUpperCase())
                            break
                        case 1:
                        case 6:
                            board[row].push(color === Color.White ? PieceType.Knight : PieceType.Knight.toUpperCase())
                            break
                        case 2:
                        case 5:
                            board[row].push(color === Color.White ? PieceType.Bishop : PieceType.Bishop.toUpperCase())
                            break
                        case 3:
                            board[row].push(color === Color.White ? PieceType.Queen : PieceType.Queen.toUpperCase())
                            break
                        case 4:
                            board[row].push(color === Color.White ? PieceType.King : PieceType.King.toUpperCase())
                    }
                }
                else{
                    //board[row][col] = new Piece(PieceType.Empty, Color.None)
                    board[row].push(color === Color.White ? PieceType.Empty : PieceType.Empty.toUpperCase())
                }
            }
        }
        return board
    }

export const initialBoard = setInitialBoard()