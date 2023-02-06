import React from "react"
import { BOARD_SIZE, Color, PieceType } from "../Constants"
import { Position } from "../models"
import Tile from "./Tile"
import UserCard from "./UserCard"
import { Move } from "../models/Move"

interface Props {
    board: string[][]
    validMoves: Move[]
    lastMove: Move | null
    moveStartPosition: Position | null
    capturedBlack: { type: PieceType, value: number }[]
    capturedWhite: { type: PieceType, value: number }[]
    checkedKing: Color | null
    handleClick: (event: React.MouseEvent, piece: Position, valid: boolean) => void
    flipBoard: boolean
}

function Chessboard({ board, validMoves, lastMove, moveStartPosition, capturedBlack, capturedWhite, checkedKing, handleClick, flipBoard }: Props) {

    let tiles: JSX.Element[] = []

    if (flipBoard) {
        for (let row = 0; row <= BOARD_SIZE - 1; row += 1) {
            for (let col = BOARD_SIZE - 1; col >= 0; col -= 1) {
                tiles.push(getTile(row, col))
            }
        }
    } else {
        for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
            for (let col = 0; col <= BOARD_SIZE - 1; col += 1) {
                tiles.push(getTile(row, col))
            }
        }
    }

    const userCardBlack = <UserCard
        key="top"
        alignright={flipBoard ? true : false}
        captured={capturedWhite}
        color={Color.White} />

    const userCardWhite = <UserCard
        key="bottom"
        alignright={flipBoard ? false : true}
        captured={capturedBlack}
        color={Color.Black} />

    function getTile(row: number, col: number) {
        const piece = board[row][col]
        const position = new Position(row, col)
        const backgroundColor = (row + col) % 2 === 0 ? Color.Black : Color.White
        const valid = validMoves.some(move => move.endPos.isSamePosition(new Position(row, col)));
        const highlight = (lastMove !== null && (position.isSamePosition(lastMove?.startPos) || position.isSamePosition(lastMove.endPos))) || (moveStartPosition !== null && position.isSamePosition(moveStartPosition))
        const tileProps = {
            piece,
            position,
            backgroundColor,
            valid,
            highlight,
            checkedKing,
            handleClick,
            flipBoard
        }
        return (<Tile key={`${row}${col}`} {...tileProps} />)
    }

    return (
        <div className="w-full md:w-2/3 p-4 border-2 border-amber-300">
            <div className="flex flex-col gap-4 box-border w-full h-full">
                {flipBoard ? userCardWhite : userCardBlack}
                <div className="grow grid grid-cols-8 border-8 border-slate-500 m-auto aspect-square box-border w-full max-w-screen-md">
                    {tiles}
                </div>
                {flipBoard ? userCardBlack : userCardWhite}
            </div>
        </div>
    )
}
export default Chessboard