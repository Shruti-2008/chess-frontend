interface MoveProps {
  moves: string[][];
  addEmptyRows: boolean;
}

const MoveList = ({ moves, addEmptyRows }: MoveProps) => {
  const gridTileStyle =
    "bg-slate-200 text-center p-2 text-lg lg:text-xl border-b-2 border-slate-300";

  let moveSet: JSX.Element[] = [];
  moves.forEach((move, i) => {
    moveSet.push(
      <div className={`${gridTileStyle} rounded-l-lg`}>{i + 1}</div>,
      <div className={gridTileStyle}>{move[0]}</div>,
      <div className={`${gridTileStyle} rounded-r-lg`}>{move[1]}</div>
    );
  });

  if (addEmptyRows) {
    let rowsAdded = moveSet.length / 3;
    while (rowsAdded < 20) {
      moveSet.push(
        <div className={`${gridTileStyle} rounded-l-lg`}>{rowsAdded + 1}</div>,
        <div className={gridTileStyle}>{}</div>,
        <div className={`${gridTileStyle} rounded-r-lg`}>{}</div>
      );
      rowsAdded += 1;
    }
  }

  return <div className="grid grid-cols-3">{moveSet}</div>;
};

export default MoveList;
