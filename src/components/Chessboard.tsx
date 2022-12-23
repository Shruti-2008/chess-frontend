import React from "react"
import { BOARD_SIZE, Color, PieceType } from "../Constants"
import { Piece, Position } from "../models"
import Tile from "./Tile"
import UserCard from "./UserCard"
import { useBoard } from "../hooks/useBoard"

interface Props {
    pieces: Piece[]
    validPos: Position[]
    handleClick: (event: React.MouseEvent, piece: Piece, highlight: boolean) => void
}

function Chessboard({pieces, validPos, handleClick}: Props){//({ pieces, validPos, handleClick }: Props) {

    //const { pieces, validPos, handleClick } = useBoard()
    //const vertical_axis = [1, 2, 3, 4, 5, 6, 7, 8]
    //const horizontal_axis = ["a", "b", "c", "d", "e", "f", "g", "h"]

    let tiles: JSX.Element[] = []//: Array<typeof Tile> = []

    for (let i = BOARD_SIZE; i > 0; i -= 1) {
        for (let j = 0; j < BOARD_SIZE; j += 1) {

            let highlight: boolean = false
            let backgroundColor: Color = Color.None
            
            let piece = pieces.find(p => p.position.x === j && p.position.y === i - 1)
            if (!piece) {
                piece = new Piece(new Position(j, i - 1), PieceType.Empty, Color.None)
            }

            let pos = validPos.find(pos => pos.x === j && pos.y === i - 1)
            if (pos) {
                highlight = true
            }

            backgroundColor = (i + j) % 2 === 0 ? Color.White : Color.Black

            const tileProps = {
                piece,
                backgroundColor,
                highlight,
                handleClick
            }
            tiles.push(<Tile key={`${i}${j}`} {...tileProps} />)
        }
    }

    return (
        <div className="flex flex-col m-8 ">
            <UserCard alignright={false} />
            <div className="grid grid-cols-8 border-8 border-slate-500 m-auto w-full">
                {tiles}
            </div>
            <UserCard alignright={true} />
        </div>

    )
}
export default Chessboard