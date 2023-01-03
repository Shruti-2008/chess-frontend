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
    const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8]
    const colToFile = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    
    return(
        <div  style={
            {
                backgroundImage: bgImg,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                backgroundSize: "contain",
            }}
            className="aspect-square flex justify-center items-center object-contain relative hover:cursor-pointer active:cursor-grabbing "
            onClick={(event) => {handleClick(event, position, highlight)}}
        >
            <p className="text-cyan-400 text-lg font-semibold absolute right-2 bottom-2">{colToFile[position.y]}{rowToRank[position.x]}</p>
        </div>
    )
}

export default Tile