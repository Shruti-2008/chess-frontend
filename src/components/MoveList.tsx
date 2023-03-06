import { MoveListProps } from "../utilities/commonInterfaces";

const MoveList = ({ moves, addEmptyRows }: MoveListProps) => {
  const gridTileStyle =
    "bg-slate-200 text-center p-2 text-base sm:text-lg lg:text-xl border-b-2 border-slate-300";

  let moveSet: JSX.Element[] = [];
  moves.forEach((move, i) => {
    moveSet.push(
      <div className={`${gridTileStyle} rounded-l-lg`} key={3 * i + 1}>
        {i + 1}
      </div>,
      <div className={gridTileStyle} key={3 * i + 2}>
        {move[0]}
      </div>,
      <div className={`${gridTileStyle} rounded-r-lg`} key={3 * i + 3}>
        {move[1]}
      </div>
    );
  });

  if (addEmptyRows) {
    let rowsAdded = Math.floor(moveSet.length / 3);
    while (rowsAdded < addEmptyRows) {
      moveSet.push(
        <div
          className={`${gridTileStyle} rounded-l-lg`}
          key={3 * rowsAdded + 1}
        >
          {rowsAdded + 1}
        </div>,
        <div className={gridTileStyle} key={3 * rowsAdded + 2}>
          {}
        </div>,
        <div
          className={`${gridTileStyle} rounded-r-lg`}
          key={3 * rowsAdded + 3}
        >
          {}
        </div>
      );
      rowsAdded += 1;
    }
  }

  return <div className="grid grid-cols-3">{moveSet}</div>;
};

export default MoveList;
