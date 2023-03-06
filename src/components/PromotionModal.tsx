import { PieceType } from "../Constants";
import { PromotionModalProps } from "../utilities/commonInterfaces";

function PromotionModal({ promotePawn, color }: PromotionModalProps) {
  const imgStyle =
    "m-2 p-2 object-contain display-none rounded-3xl hover:bg-slate-300 hover:shadow-inner hover:shadow-white cursor-pointer transition duration-300";

  return (
    <div className="fixed inset-0 flex h-full w-full flex-col justify-center bg-slate-400/80">
      <div className="flex w-full flex-col items-center justify-center bg-orange-300">
        <div className="pt-6 text-center">
          <h4 className="p-2 text-xl font-semibold md:text-2xl lg:text-3xl">
            Promote pawn to?
          </h4>
        </div>
        <div className="flex items-center justify-center p-4 md:w-2/3 lg:w-3/5 xl:w-1/2">
          <div>
            <img
              src={`../../assets/images/rook_${color}.png`}
              alt="Rook"
              className={imgStyle}
              onClick={() => promotePawn(PieceType.Rook)}
            />
          </div>
          <div>
            <img
              src={`../../assets/images/knight_${color}.png`}
              alt="Knight"
              className={imgStyle}
              onClick={() => promotePawn(PieceType.Knight)}
            />
          </div>
          <div>
            <img
              src={`../../assets/images/bishop_${color}.png`}
              alt="Bishop"
              className={imgStyle}
              onClick={() => promotePawn(PieceType.Bishop)}
            />
          </div>
          <div>
            <img
              src={`../../assets/images/queen_${color}.png`}
              alt="Queen"
              className={imgStyle}
              onClick={() => promotePawn(PieceType.Queen)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PromotionModal;
