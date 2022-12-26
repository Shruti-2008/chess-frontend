import React from "react";
import { IMAGE_LOC, Color } from "../Constants";
import { Piece, Position } from "../models";

interface Props {
    piece: Piece
    backgroundColor: Color
    highlight: boolean;
    position: Position
    handleClick: (event: React.MouseEvent, piece: Position, highlight: boolean) => void
  }

function Tile({piece, backgroundColor, highlight, position, handleClick} : Props) {

    const highlightImage = "valid_pos.png"
    const tileBackgroundImage = `spot_${backgroundColor}.png`//props.color ? "spot_b.png" : "spot_w.png" 

    let img : Array<string> = []
    piece.image && img.push(piece.image) //? props.image.slice() : [] )
    highlight && img.push(highlightImage)
    img.push(tileBackgroundImage)
    
    const bgImg: string = img.map(pic => `url(${IMAGE_LOC}${pic})`).join(", ")
    
    return(
        <div  style={
            {
                backgroundImage: bgImg,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "cover"
            }}
            className="aspect-square flex justify-center items-center object-contain hover:cursor-pointer active:cursor-grabbing"
            onClick={(event) => {handleClick(event, position, highlight)}}
        >
            <p className="text-cyan-400 text-lg font-semibold">{position.x}, {position.y}</p>
        </div>
    )
}

export default Tile