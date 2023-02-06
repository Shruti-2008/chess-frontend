import { Color, IMAGE_LOC, PieceType } from "../Constants"
import { getName } from "../utilities/pieceUtilities"

interface Props {
    alignright: boolean
    captured: { type: PieceType, value: number }[]
    color: Color
}

function UserCard(props: Props) {

    const pos = props.alignright ? "md:ml-auto md:mr-2" : "md:mr-auto md:ml-2"
    let piecesCaptured = []

    for (let i = 0; i < props.captured.length; i += 1) {
        const piece = props.captured[i]
        let temp = []

        if (piece.value > 0) {
            const srcUrl = `${IMAGE_LOC}${getName(piece.type)}_${props.color}.png`
            const element =
                <div key={`${i}_1`} className="h-10">
                    <img
                        src={srcUrl}
                        alt={piece.type}
                        className="object-contain w-full h-full"
                    />
                </div>
            temp.push(element)

            for (let j = 2; j <= piece.value; j++) {
                // push the rest shifted to left
                // const srcUrl = `${IMAGE_LOC}${piece.type}_${props.color}.png` #int# remove
                const element =
                    <div key={`${i}_${j}`} className="relative -left-6 -mr-6 h-10">
                        <img
                            src={srcUrl}
                            alt={piece.type}
                            className="object-contain w-full h-full"
                        />
                    </div>
                temp.push(element)
            }

            const finalElement = <div className="flex shrink-0" key={i}>
                {temp}
            </div>
            piecesCaptured.push(finalElement)
        }
    }

    return (
        <div className={`bg-gradient-to-b from-amber-300 to-amber-100 flex flex-col justify-center gap-2 w-full md:w-3/5 p-2 my-4 ${pos} rounded-lg shadow-lg shadow-stone-500/50`}>
            <details className="flex group">
                <summary className=" flex items-center gap-2 py-1 px-2 bg-gradient-to-r from-amber-100 to-amber-200 text-slate-700 rounded-r-full ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        className="w-6 h-6 text-slate-400 group-open:rotate-90 border transition transform duration-300"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                    <img
                        src="../../assets/images/user_slate_400.png"
                        alt="captured_pieces"
                        className="object-contain h-10 max-h-12"
                    />
                    <h4 className="font-medium text-lg border">Shruti2008</h4>
                </summary>
                <div className="flex flex-row overflow-x-auto pt-2">
                    {props.captured.filter(c => c.value > 0).length > 0 ?
                        piecesCaptured :
                        <div className="h-10"></div>}
                </div>
            </details>
        </div>
    )
}

export default UserCard