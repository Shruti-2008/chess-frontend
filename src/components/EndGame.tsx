import Confetti from "react-confetti";
import { Color, IMAGE_LOC, Winner } from "../Constants";
import { EndGameProps } from "../utilities/commonInterfaces";

const EndGame = ({
  winner,
  reason,
  player,
  whitePlayer,
  blackPlayer,
  toggleConclusionModal,
}: EndGameProps) => {
  const [heading, result, isWinnerPlayer] =
    winner === Winner.Draw
      ? ["Draw", "1/2 - 1/2", false]
      : winner === Winner.White && player === Color.White
      ? ["You Won", "1 - 0", true]
      : winner === Winner.Black && player === Color.Black
      ? ["You Won", "0 - 1", true]
      : player === Color.White
      ? ["Black Won", "0 - 1", false]
      : player === Color.Black
      ? ["White Won", "1 - 0", false]
      : ["Game Aborted", "0 - 0", false];

  const highlight = "ring-green-400 ring-2 xl:ring-4 ring-offset-2";
  const bgColor = isWinnerPlayer ? "bg-amber-300" : "bg-slate-300";

  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center bg-slate-400/80">
      {isWinnerPlayer && <Confetti />}
      <div className="m-auto w-5/6 overflow-clip rounded-2xl bg-slate-100 shadow-2xl shadow-slate-700 md:w-4/5 lg:w-2/3 xl:w-1/2">
        <div
          className={`relative -top-2/3 flex h-full w-full items-center justify-center rounded-t-none rounded-b-full ${bgColor}`}
        >
          <div className=" relative top-2/3 flex flex-col items-center justify-between gap-2 overflow-y-auto p-4 font-semibold md:gap-6 lg:gap-12 lg:p-8 xl:gap-16">
            <div className="flex flex-col items-center  gap-2 lg:gap-6">
              <p className="text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl">
                {heading}
              </p>
              <p className="text-base lowercase text-gray-700 lg:text-lg xl:text-xl 2xl:text-2xl">
                by {reason}
              </p>
            </div>
            <div className="flex w-full flex-1 flex-col items-center justify-around gap-4 p-2 text-base text-slate-600 md:text-lg lg:text-xl 2xl:flex-row">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <img
                  src={`${IMAGE_LOC}user_slate_400.png`}
                  alt="user"
                  className={`h-8 rounded-lg bg-slate-100 lg:h-12 xl:h-16 ${
                    winner === Winner.White ? highlight : ""
                  }`}
                />
                <p className="overflow-x-auto text-sm lg:text-base xl:text-lg 2xl:text-xl">
                  {whitePlayer}
                </p>
              </div>
              <p className="shrink-0 text-2xl text-black xl:text-4xl">
                {result}
              </p>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <img
                  src={`${IMAGE_LOC}user_slate_400.png`}
                  alt="user"
                  className={`h-8 rounded-lg bg-slate-100 lg:h-12 xl:h-16 ${
                    winner === Winner.Black ? highlight : ""
                  }`}
                />
                <p className="overflow-x-auto text-sm lg:text-base xl:text-lg 2xl:text-xl">
                  {blackPlayer}
                </p>
              </div>
            </div>
            <button
              className={`mx-auto rounded-md bg-blue-600 px-8 py-2 text-base text-white hover:bg-blue-800 lg:py-3 lg:text-lg xl:text-xl 2xl:py-4`}
              onClick={toggleConclusionModal}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EndGame;
