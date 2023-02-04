import React from "react"
import { BOARD_SIZE, Color, PieceType } from "../Constants"
import { Piece, Position } from "../models"
import Tile from "./Tile"
import UserCard from "./UserCard"
import { Move } from "../models/Move"

interface Props {
    board: Piece[][]
    validMoves: Move[]
    handleClick: (event: React.MouseEvent, piece: Position, valid: boolean) => void
    capturedBlack: { type: PieceType, value: number }[]
    capturedWhite: { type: PieceType, value: number }[]
    lastMove: Move|null
    moveStartPos: Position|null
    checkedKing: Color|null
}

function Chessboard({ board, validMoves, handleClick, capturedBlack, capturedWhite, lastMove, moveStartPos, checkedKing }: Props) {//({ pieces, validPos, handleClick }: Props) {

    let tiles: JSX.Element[] = [] //: Array<typeof Tile> = []

    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
        for (let col = 0; col < BOARD_SIZE; col += 1) {
            const piece = board[row][col]
            const backgroundColor = (row + col) % 2 === 0 ? Color.Black : Color.White
            const valid = validMoves.some(move => move.endPos.isSamePosition(new Position(row, col)));
            const position = new Position(row, col)
            const highlight = (lastMove !== null && ( position.isSamePosition(lastMove?.startPos) || position.isSamePosition(lastMove.endPos))) || (moveStartPos !== null && position.isSamePosition(moveStartPos))
            const tileProps = {
                piece,
                backgroundColor,
                valid,
                position,
                handleClick,
                highlight,
                checkedKing
            }
            tiles.push(<Tile key={`${row}${col}`} {...tileProps} />)
        }
    }

    return (
        <div className="w-full md:w-2/3 p-4 border-2 border-amber-300">
            <div className="flex flex-col gap-4 box-border w-full h-full">
                <UserCard
                    key="top"
                    alignright={false}
                    captured={capturedWhite}
                    color={Color.White} />
                <div className="grow grid grid-cols-8 border-8 border-slate-500 m-auto aspect-square box-border w-full max-w-screen-md">
                    {tiles}
                </div>
                <UserCard
                    key="bottom"
                    alignright={true}
                    captured={capturedBlack}
                    color={Color.Black} />
            </div>
        </div>
    )
}
export default Chessboard