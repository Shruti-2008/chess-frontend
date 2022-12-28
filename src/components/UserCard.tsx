import React from "react"
import { capturedCount, Color, IMAGE_LOC, PieceType } from "../Constants"
import { Piece } from "../models"
// import user from "../../assets/images/user.png"

interface Props {
    alignright: boolean
    captured: { type: PieceType, value: number }[]
    color: Color
}

function UserCard(props: Props) {
    let piecesCaptured = []

    const pos = props.alignright ? "ml-auto mr-2" : "mr-auto ml-2"
    for (let i = 0; i < props.captured.length; i += 1) {
        const piece = props.captured[i]
        let temp = []
        if (piece.value > 0) {

            const srcUrl = `${IMAGE_LOC}${piece.type}_${props.color}.png`
            const element =
                <div className="border-2 border-red-500 h-12">
                    <img src={srcUrl} className="object-contain w-full h-full" />
                </div>
            temp.push(element)
            
            for (let j = 2; j <= piece.value; j++) {
                //push the rest shifted to left
                const srcUrl = `${IMAGE_LOC}${piece.type}_${props.color}.png`
                const leftShift = 1.5
                const element =
                    <div className={`relative -left-[${leftShift}rem] -mr-[${leftShift}rem] border-2 border-red-500 h-12`}>
                        <img src={srcUrl} className="object-contain w-full h-full" />
                    </div>
                temp.push(element)
            }

            const finalElement = <div className="border-4 border-green-400 flex">
                {temp}
            </div>
            piecesCaptured.push(finalElement)
        }
    }


    return (
        <div className={`bg-amber-200 flex w-3/5 rounded-lg items-center my-4 ${pos} shadow-lg shadow-stone-500/50`}>
            <div className="m-3">
                <img src="../../assets/images/user_slate_400.png" alt="profile" className="object-contain max-h-12" />
            </div>
            <div className="grid grid-rows-2 ml-2">
                <div className="flex items-center border-4 border-fuchsia-500 align-middle">
                    <h4 className="font-medium text-lg ">Shruti2008</h4>
                </div>

                <div className="flex flex-row border-4 border-fuchsia-500">
                    {piecesCaptured}
                </div>
            </div>
        </div>
    )
}

export default UserCard