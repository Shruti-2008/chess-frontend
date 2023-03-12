import { useEffect, useRef } from "react";
import { IMAGE_LOC } from "../Constants";
import { ActiveGameMoveProps } from "../utilities/commonInterfaces";
import MoveList from "./MoveList";

const Moves = ({
  moves,
  handleResign,
  handleDrawRequest,
  isConcluded,
}: ActiveGameMoveProps) => {
  const resignRef = useRef<HTMLDivElement>(null);
  const moveRef = useRef<HTMLDivElement>(null);
  const buttonBg = isConcluded
    ? " from-slate-200 to-slate-200 cursor-not-allowed"
    : " from-amber-400 to-amber-100 hover:ring-4 hover:ring-amber-100 hover:ring-offset-2 hover:ring-offset-amber-100 cursor-pointer";
  const buttonStyle = `p-2 md:p-4 text-center font-semibold rounded-lg shadow-lg bg-gradient-to-t transition duration-300 flex flex-row items-center justify-center gap-2 lg:gap-0.5 xl:gap-2 text-base md:text-lg xl:text-xl grow h-8 w-8 box-content ${buttonBg}`;
  const gridHeaderStyle =
    "text-center text-lg lg:text-xl bg-gradient-to-b from-slate-400 to-slate-500 text-white font-semibold p-2 ";

  useEffect(() => {
    if (moveRef.current) {
      moveRef.current.scrollTop = moveRef.current.scrollHeight;
    }
  }, []);

  const moveProps = {
    moves,
    addEmptyRows: 20,
  };

  function toggleResignRef() {
    resignRef.current?.classList.toggle("hidden");
    resignRef.current?.classList.toggle("flex");
  }

  function confirmResign() {
    toggleResignRef();
    handleResign();
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4 md:gap-8 lg:flex-col">
      <div className="flex flex-col gap-3.5">
        <div className="flex w-full flex-row gap-4 lg:gap-8">
          <button
            className={buttonStyle}
            onClick={handleDrawRequest}
            disabled={isConcluded}
          >
            <img
              src={`${IMAGE_LOC}draw.png`}
              alt="draw"
              className="object-contain"
            />
            <p>DRAW</p>
          </button>
          <button
            className={buttonStyle}
            onClick={toggleResignRef}
            disabled={isConcluded}
          >
            <img
              src={`${IMAGE_LOC}resign.png`}
              alt="resign"
              className="object-contain"
            />
            <p>RESIGN</p>
          </button>
        </div>
        <div
          ref={resignRef}
          className="relative hidden flex-col gap-4 rounded-xl border-2 border-black bg-slate-100 p-2 after:absolute after:right-7 after:-top-4 after:border-t-0 after:border-r-16 after:border-l-16 after:border-b-16 after:border-x-transparent after:border-b-black lg:p-4"
        >
          <p className="text-center text-lg sm:text-xl">
            Are you sure you want to resign?
          </p>
          <div className="flex flex-row justify-center gap-4">
            <button className={buttonStyle} onClick={confirmResign}>
              Yes
            </button>
            <button className={buttonStyle} onClick={toggleResignRef}>
              No
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full max-h-full w-full flex-col">
        <div className="w-full rounded-lg bg-gradient-to-b from-amber-300 to-amber-200 p-2 text-center text-lg font-semibold shadow-lg shadow-slate-300 lg:text-xl">
          Moves
        </div>
        <div className="grid grid-cols-3">
          <div className={`${gridHeaderStyle} rounded-l-lg`}>No.</div>
          <div className={gridHeaderStyle}>White</div>
          <div className={`${gridHeaderStyle} rounded-r-lg`}>Black</div>
        </div>
        <div className="relative w-full grow">
          <div
            className="absolute bottom-0 top-0 left-0 right-0 overflow-y-auto"
            ref={moveRef}
          >
            <MoveList {...moveProps} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Moves;
