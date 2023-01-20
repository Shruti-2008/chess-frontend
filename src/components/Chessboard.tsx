import React from "react"
import { BOARD_SIZE, Color, PieceType } from "../Constants"
import { Piece, Position } from "../models"
import Tile from "./Tile"
import UserCard from "./UserCard"
import { Move } from "../models/Move"

interface Props {
    board: Piece[][]
    validMoves: Move[]
    handleClick: (event: React.MouseEvent, piece: Position, highlight: boolean) => void
    capturedBlack: {type: PieceType, value:number}[]
    capturedWhite: {type: PieceType, value:number}[]
}

function Chessboard({ board, validMoves, handleClick, capturedBlack, capturedWhite }: Props) {//({ pieces, validPos, handleClick }: Props) {

    //const { pieces, validPos, handleClick } = useBoard()
    //const vertical_axis = [1, 2, 3, 4, 5, 6, 7, 8]
    //const horizontal_axis = ["a", "b", "c", "d", "e", "f", "g", "h"]

    let tiles: JSX.Element[] = []//: Array<typeof Tile> = []

    // for (let i = BOARD_SIZE; i > 0; i -= 1) {
    //     for (let j = 0; j < BOARD_SIZE; j += 1) {

    //         let highlight: boolean = false
    //         let backgroundColor: Color = Color.None

    //         let piece = pieces.find(p => p.position.x === j && p.position.y === i - 1)
    //         if (!piece) {
    //             piece = new Piece(new Position(j, i - 1), PieceType.Empty, Color.None)
    //         }

    //         let pos = validPos.find(pos => pos.x === j && pos.y === i - 1)
    //         if (pos) {
    //             highlight = true
    //         }

    //         backgroundColor = (i + j) % 2 === 0 ? Color.White : Color.Black

    //         const tileProps = {
    //             piece,
    //             backgroundColor,
    //             highlight,
    //             handleClick
    //         }
    //         tiles.push(<Tile key={`${i}${j}`} {...tileProps} />)
    //     }
    // }

    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
                const piece = board[row][col]
                const backgroundColor = (row + col) % 2 === 0 ? Color.Black : Color.White
                const highlight = validMoves.some(move => move.endPos.samePosition(new Position(row, col)));
                const position = new Position(row, col)
                // if(highlight){
                //     console.log("highlight ",row,col)
                // }
            const tileProps = {
                piece,
                backgroundColor,
                highlight,
                position,
                handleClick
            }
            tiles.push(<Tile key={`${row}${col}`} {...tileProps} />)
        }
    }

    return (
        <div className="grow p-4">
            <div className="flex flex-col box-border w-full h-full">
                <UserCard key="top" alignright={false} captured={capturedWhite} color={Color.White}/>
                <div className=" grow grid grid-cols-8 border-8 border-slate-500 m-auto aspect-square box-border w-full max-w-screen-md">
                    {tiles}
                </div>
                <UserCard key="bottom" alignright={true} captured={capturedBlack} color={Color.Black}/>
            </div>
        </div>
    )
}
export default Chessboard