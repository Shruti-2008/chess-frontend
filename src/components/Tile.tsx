import React from "react";
import { IMAGE_LOC, Color, PieceType } from "../Constants";
import { Piece, Position } from "../models";

interface Props {
    piece: Piece
    backgroundColor: Color
    valid: boolean;
    position: Position
    handleClick: (event: React.MouseEvent, piece: Position, valid: boolean) => void
    highlight: boolean
    checkedKing: Color|null
  }

function Tile({piece, backgroundColor, valid, position, handleClick, highlight, checkedKing} : Props) {

    const validImage = piece.type === PieceType.Empty? "valid_pos.png":"valid_pos_capture.png"
    const tileBackgroundImage = checkedKing && piece.type === PieceType.King && piece.color === checkedKing ? "linear-gradient(rgb(248, 113, 113, 1), rgb(248, 113, 113, 1))" : `url(${IMAGE_LOC}spot_${backgroundColor}.png)`//props.color ? "spot_b.png" : "spot_w.png" 
    const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8]
    const colToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    const rowCoordinate = position.y === 0? rowToRank[position.x] : undefined
    const colCoordinate = position.x === 0? colToFile[position.y] : undefined
    const textColor = backgroundColor === 'w' ? "text-slate-700" : "text-white" 
    const highlightImage = "linear-gradient(rgb(253, 230, 148, 0.45), rgb(253, 230, 148, 0.45))" //highlight? " bg-gradient-to-r from-amber-700 to-amber-300 ":""
    

    let img : Array<string> = []
    // valid && img.push(validImage)

    // piece.image && img.push(piece.image)
    // highlight && img.push(highlightImage)
    // img.push(tileBackgroundImage)

    piece.image && img.push(`url(${IMAGE_LOC}${piece.image})`)
    highlight && img.push(highlightImage)
    img.push(tileBackgroundImage)
    
    //const bgImg: string = img.map(pic => `url(${IMAGE_LOC}${pic})`).join(", ")
    const bgImg: string = img.join(", ")
    //if(checkedKing){console.log("Checked", position, bgImg)}
    
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
            {rowCoordinate && <p className={`text-lg font-semibold opaciy-80 absolute left-1 top-0.5 ${textColor}`}>{rowCoordinate}</p>} {/*text-amber-400  */}
            {colCoordinate && <p className={`text-lg font-semibold opaciy-80 absolute right-1 bottom-0.5 ${textColor}`}>{colCoordinate}</p>}
            {/*<p className="text-amber-400 text-lg font-semibold opacity-60">{colToFile[position.y]}{rowToRank[position.x]}</p> {/*absolute right-2 bottom-2 */}
        </div>
    )
}

export default Tile