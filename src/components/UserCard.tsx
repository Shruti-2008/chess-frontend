import { IMAGE_LOC } from "../Constants";
import { UserCardProps } from "../utilities/commonInterfaces";
import { getName } from "../utilities/pieceUtilities";

function UserCard({
  alignright,
  captured,
  color,
  isActivePlayer,
  username,
}: UserCardProps) {
  const cardPosition = ""; // alignright ? "md:ml-auto md:mr-2" : "md:mr-auto md:ml-2";
  let piecesCaptured = [];

  for (let i = 0; i < captured.length; i += 1) {
    const piece = captured[i];
    let temp = [];

    if (piece.value > 0) {
      const srcUrl = `${IMAGE_LOC}${getName(piece.type)}_${color}.png`;
      const element = (
        <div key={`${i}_1`} className=" h-8 lg:h-10">
          <img
            src={srcUrl}
            alt={piece.type}
            className="h-full w-full object-contain"
          />
        </div>
      );
      temp.push(element);

      for (let j = 2; j <= piece.value; j++) {
        // push the rest shifted to left
        const element = (
          <div
            key={`${i}_${j}`}
            className="relative -left-5 -mr-5 h-8 lg:-left-6 lg:-mr-6 lg:h-10"
          >
            <img
              src={srcUrl}
              alt={piece.type}
              className="h-full w-full object-contain"
            />
          </div>
        );
        temp.push(element);
      }

      const finalElement = (
        <div className="flex shrink-0" key={i}>
          {temp}
        </div>
      );
      piecesCaptured.push(finalElement);
    }
  }

  return (
    <div
      className={`flex w-full flex-col justify-center gap-2 bg-gradient-to-b from-amber-300 to-amber-100 p-1 md:w-3/5 lg:w-1/2 lg:p-2 xl:w-2/5 ${cardPosition} rounded-lg shadow-lg shadow-stone-500/50`}
    >
      <details className="group flex">
        <summary className=" flex items-center gap-2 rounded-r-full bg-gradient-to-r from-amber-100 to-amber-200 py-2 px-2 text-slate-700 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="3.5"
            stroke="currentColor"
            className="h-6 w-6 transform text-slate-400 transition duration-300 group-open:rotate-90"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 4.5l7.5 7.5-7.5 7.5"
            />
          </svg>
          <img
            src="../../assets/images/user_slate_400.png"
            alt="captured_pieces"
            className="h-8 max-h-12 object-contain lg:h-10"
          />
          <p className="overflow-x-auto text-sm font-medium sm:text-base md:text-base lg:text-lg xl:text-xl">
            {username}
          </p>
        </summary>
        <div className="flex flex-row overflow-x-auto pt-2">
          {captured.filter((c) => c.value > 0).length > 0 ? (
            piecesCaptured
          ) : (
            <div className="h-8 lg:h-10"></div>
          )}
        </div>
      </details>
    </div>
  );
}

export default UserCard;
