import React from "react"
import { PieceType } from "../Constants"

interface Props{
    promotePawn: (type:PieceType) => void
}

function PromotionModal({promotePawn}:Props) {
    const imgStyle = "m-2 object-contain hover:bg-slate-400 cursor-pointer p-2 rounded-3xl display-none "


    return (
        <div className='bg-slate-400/80 inset-0 absolute flex flex-col items-center justify-center'>
            <div className='bg-orange-300 w-full text-center pt-6'>
                <h4 className='font-semibold text-xl'>Promote pawn to?</h4>
            </div>
            <div className='flex items-center justify-center w-full bg-orange-300 p-4'>
                <div><img src="../../assets/images/rook_w.png" alt="Rook" className={imgStyle} onClick={() => promotePawn(PieceType.Rook)} /></div>
                <div><img src="../../assets/images/knight_w.png" alt="Knight" className={imgStyle} onClick={() => promotePawn(PieceType.Knight)} /></div>
                <div><img src="../../assets/images/bishop_w.png" alt="Bishop" className={imgStyle} onClick={() => promotePawn(PieceType.Bishop)} /></div>
                <div><img src="../../assets/images/queen_w.png" alt="Queen" className={imgStyle} onClick={() => promotePawn(PieceType.Queen)} /></div>
            </div>
        </div>

    )
}

export default PromotionModal