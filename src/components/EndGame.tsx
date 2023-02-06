import Confetti from "react-confetti"
import { Color, IMAGE_LOC } from "../Constants"

interface Props {
    winner: Color | null
    reason: string
    showHideModal: () => void
}

const EndGame = ({ winner, reason, showHideModal }: Props) => {

    let winningPlayer, result
    if (winner === Color.White) {
        winningPlayer = "White"
        result = "1 - 0"
    } else {
        winningPlayer = "Black"
        result = "0 - 1"
    }

    return (
        <div className='bg-slate-400/80 inset-0 fixed w-full h-full flex flex-col justify-center'>
            <Confetti />
            <div className="m-auto w-5/6 h-4/6 md:w-4/5 md:h-2/3 lg:h-1/2 lg:w-2/3 xl:w-1/2 bg-slate-100 rounded-2xl shadow-2xl shadow-slate-700 overflow-clip">
                <div className="rounded-t-none rounded-b-full w-full h-full -top-2/3 relative bg-amber-300 flex justify-center items-center">
                    <div className=" w-5/6 h-5/6 relative top-2/3 flex flex-col items-center justify-between gap-2 capitalize p-4 text-2xl font-semibold overflow-y-auto">
                        <p>{winningPlayer} Wins by {reason}</p>
                        <div className="flex flex-col md:flex-row justify-around items-center flex-1 w-full text-base md:text-lg lg:text-xl text-slate-600">
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <img
                                    src={`${IMAGE_LOC}user_slate_200.png`}
                                    alt="user"
                                    className="bg-slate-100 rounded-lg"
                                />
                                <p className="overflow-x-auto">Shruti2008.sawant@gmail.com</p>
                            </div>
                            <p className="text-2xl text-black shrink-0">{result}</p>
                            <div className="flex flex-col items-center gap-2 shrink-0">
                                <img
                                    src={`${IMAGE_LOC}user_slate_200.png`}
                                    alt="user"
                                    className="bg-slate-100 rounded-lg"
                                />
                                <p className="overflow-x-auto">Shruti2008.sawant@gmail.com</p>
                            </div>
                        </div>
                        <button
                            className={`rounded-md mx-auto px-8 py-4 text-white text-lg bg-blue-600 hover:bg-blue-800 "}`}
                            onClick={showHideModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EndGame