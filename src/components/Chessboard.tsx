import { BOARD_SIZE, Color } from "../Constants";
import { Position } from "../models";
import Tile from "./Tile";
import UserCard from "./UserCard";
import { ChessboardProps } from "../utilities/commonInterfaces";

function Chessboard({
  board,
  validMoves,
  lastMove,
  moveStartPosition,
  capturedBlack,
  capturedWhite,
  checkedKing,
  handleClick,
  flipBoard,
  activePlayer,
  whitePlayer,
  blackPlayer,
}: ChessboardProps) {
  let tiles: JSX.Element[] = [];

  if (flipBoard) {
    for (let row = 0; row <= BOARD_SIZE - 1; row += 1) {
      for (let col = BOARD_SIZE - 1; col >= 0; col -= 1) {
        tiles.push(getTile(row, col));
      }
    }
  } else {
    for (let row = BOARD_SIZE - 1; row >= 0; row -= 1) {
      for (let col = 0; col <= BOARD_SIZE - 1; col += 1) {
        tiles.push(getTile(row, col));
      }
    }
  }

  function getTile(row: number, col: number) {
    const piece = board[row][col];
    const position = new Position(row, col);
    const backgroundColor = (row + col) % 2 === 0 ? Color.Black : Color.White;
    const valid = validMoves.some((move) =>
      move.endPos.isSamePosition(new Position(row, col))
    );
    const highlight =
      (lastMove !== null &&
        (position.isSamePosition(lastMove.startPosition) ||
          position.isSamePosition(lastMove.endPosition))) ||
      (moveStartPosition !== null &&
        position.isSamePosition(moveStartPosition));
    const tileProps = {
      piece,
      position,
      backgroundColor,
      valid,
      highlight,
      checkedKing,
      handleClick,
      flipBoard,
    };
    return <Tile key={`${row}${col}`} {...tileProps} />;
  }

  const userCardBlack = (
    <UserCard
      key="top"
      alignright={flipBoard ? true : false}
      captured={capturedWhite}
      color={Color.White}
      isActivePlayer={activePlayer == Color.Black}
      username={blackPlayer}
    />
  );

  const userCardWhite = (
    <UserCard
      key="bottom"
      alignright={flipBoard ? false : true}
      captured={capturedBlack}
      color={Color.Black}
      isActivePlayer={activePlayer == Color.White}
      username={whitePlayer}
    />
  );

  return (
    <div className="w-full border-2 border-amber-300 p-4">
      {" "}
      {/*  md:w-2/3 lg:w-3/4 */}
      <div className="box-border flex h-full w-full flex-col gap-4">
        {flipBoard ? userCardWhite : userCardBlack}
        <div className="m-auto box-border grid aspect-square w-full max-w-screen-md grow grid-cols-8 border-8 border-slate-500">
          {tiles}
        </div>
        {flipBoard ? userCardBlack : userCardWhite}
      </div>
    </div>
  );
}
export default Chessboard;
