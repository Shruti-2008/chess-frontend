import React from "react";
import { IMAGE_LOC, Color, PieceType } from "../Constants";
import { Position } from "../models";

interface Props {
    piece: string
    position: Position
    backgroundColor: Color
    valid: boolean;
    highlight: boolean
    checkedKing: Color|null
    handleClick: (event: React.MouseEvent, piece: Position, valid: boolean) => void
    flipBoard: boolean
  }

function Tile({piece, backgroundColor, valid, position, handleClick, highlight, checkedKing, flipBoard} : Props) {
    
    // returns true if the piece = PieceType passed
    function isEqual(piece: string, type: PieceType) {
        return piece.toLowerCase() === type
    }

    // return color of piece
    function getColor(symbol: string) {
        return symbol.toLowerCase() === symbol ? Color.White : Color.Black
    }

    // return name of PieceType
    function getName(symbol: string){
        switch(symbol.toLowerCase()){
            case "p": return "pawn"
            case "r": return "rook"
            case "b": return "bishop"
            case "n": return "knight"
            case "q": return "queen"
            case "k": return "king"
        }
    }

    const validImage = isEqual(piece, PieceType.Empty) ? "valid_pos.png":"valid_pos_capture.png"
    const tileBackgroundImage = checkedKing && isEqual(piece, PieceType.King) && getColor(piece) === checkedKing ? "linear-gradient(rgb(248, 113, 113, 1), rgb(248, 113, 113, 1))" : `url(${IMAGE_LOC}spot_${backgroundColor}.png)`
    const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8]
    const colToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const firstLine = flipBoard ? 7 : 0
    const rowCoordinate = position.y === firstLine? rowToRank[position.x] : undefined
    const colCoordinate = position.x === firstLine? colToFile[position.y] : undefined
    const textColor = backgroundColor === Color.White ? "text-slate-700" : "text-white" 
    const highlightImage = "linear-gradient(rgb(253, 230, 148, 0.45), rgb(253, 230, 148, 0.45))"

    let img : Array<string> = []

    if (piece !== PieceType.Empty){
        img.push(`url(${IMAGE_LOC}${getName(piece)}_${getColor(piece)}.png)`)
    }
    highlight && img.push(highlightImage)
    img.push(tileBackgroundImage)
    
    const bgImg: string = img.join(", ")
    
    return(
        <div  style={
            {
                backgroundImage: bgImg,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
            }}
            className={`aspect-square flex justify-center items-center object-contain relative hover:cursor-pointer active:cursor-grabbing`}
            onClick={(event) => {handleClick(event, position, valid)}}
        >
            {valid && <div className="w-full h-full opacity-70" style={
                {
                    backgroundImage:`url(${IMAGE_LOC}${validImage})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "contain",
                }
            }></div>}
            {rowCoordinate && <p className={`text-lg font-semibold opaciy-80 absolute left-1 top-0.5 ${textColor}`}>{rowCoordinate}</p>}
            {colCoordinate && <p className={`text-lg font-semibold opaciy-80 absolute right-1 bottom-0.5 ${textColor}`}>{colCoordinate}</p>}
        </div>
    )
}

export default Tile