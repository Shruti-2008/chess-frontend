import Confetti from "react-confetti";
import { Color, IMAGE_LOC, Winner } from "../Constants";

interface Props {
  winner: Winner | null;
  reason: string;
  showHideModal: () => void;
}

const EndGame = ({ winner, reason, showHideModal }: Props) => {
  let winningPlayer, result;
  if (winner === Winner.White) {
    winningPlayer = "White";
    result = "1 - 0";
  } else if (winner === Winner.Black) {
    winningPlayer = "Black";
    result = "0 - 1";
  } else if (winner === Winner.Draw) {
    winningPlayer = "Draw";
    result = "1/2 - 1/2";
  }

  return (
    <div className="fixed inset-0 flex h-full w-full flex-col justify-center bg-slate-400/80">
      <Confetti />
      <div className="m-auto h-4/6 w-5/6 overflow-clip rounded-2xl bg-slate-100 shadow-2xl shadow-slate-700 md:h-2/3 md:w-4/5 lg:h-1/2 lg:w-2/3 xl:w-1/2">
        <div className="relative -top-2/3 flex h-full w-full items-center justify-center rounded-t-none rounded-b-full bg-amber-300">
          <div className=" relative top-2/3 flex h-5/6 w-5/6 flex-col items-center justify-between gap-2 overflow-y-auto p-4 text-2xl font-semibold capitalize">
            <p>
              {winningPlayer} Wins by {reason}
            </p>
            <div className="flex w-full flex-1 flex-col items-center justify-around text-base text-slate-600 md:flex-row md:text-lg lg:text-xl">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <img
                  src={`${IMAGE_LOC}user_slate_200.png`}
                  alt="user"
                  className="rounded-lg bg-slate-100"
                />
                <p className="overflow-x-auto">Shruti2008.sawant@gmail.com</p>
              </div>
              <p className="shrink-0 text-2xl text-black">{result}</p>
              <div className="flex shrink-0 flex-col items-center gap-2">
                <img
                  src={`${IMAGE_LOC}user_slate_200.png`}
                  alt="user"
                  className="rounded-lg bg-slate-100"
                />
                <p className="overflow-x-auto">Shruti2008.sawant@gmail.com</p>
              </div>
            </div>
            <button
              className={`"} mx-auto rounded-md bg-blue-600 px-8 py-4 text-lg text-white hover:bg-blue-800`}
              onClick={showHideModal}
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
