import { Color, PieceType } from "../Constants"

interface Props {
    promotePawn: (type: PieceType) => void
    color: Color
}

function PromotionModal({ promotePawn, color }: Props) {
    const imgStyle = "m-2 p-2 object-contain display-none rounded-3xl hover:bg-slate-300 hover:shadow-inner hover:shadow-white cursor-pointer transition duration-300"

    return (
        <div className='bg-slate-400/80 inset-0 fixed w-full h-full flex flex-col justify-center'>
            <div className="w-full bg-orange-300 flex flex-col items-center justify-center">
                <div className='text-center pt-6'>
                    <h4 className='font-semibold text-xl'>Promote pawn to?</h4>
                </div>
                <div className='flex items-center justify-center p-4 md:w-2/3 lg:w-3/5 xl:w-1/2'>
                    <div>
                        <img
                            src={`../../assets/images/rook_${color}.png`}
                            alt="Rook"
                            className={imgStyle}
                            onClick={() => promotePawn(PieceType.Rook)} />
                    </div>
                    <div>
                        <img
                            src={`../../assets/images/knight_${color}.png`}
                            alt="Knight"
                            className={imgStyle}
                            onClick={() => promotePawn(PieceType.Knight)} />
                    </div>
                    <div>
                        <img
                            src={`../../assets/images/bishop_${color}.png`}
                            alt="Bishop"
                            className={imgStyle}
                            onClick={() => promotePawn(PieceType.Bishop)} />
                    </div>
                    <div>
                        <img
                            src={`../../assets/images/queen_${color}.png`}
                            alt="Queen"
                            className={imgStyle}
                            onClick={() => promotePawn(PieceType.Queen)} />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default PromotionModal