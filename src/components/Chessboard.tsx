import { BOARD_SIZE, Color } from "../Constants";
import { Position } from "../models";
import Tile from "./Tile";
import UserCard from "./UserCard";
import { ChessboardProps, TileProps } from "../utilities/commonInterfaces";
import Navigation from "./Navigation";

function Chessboard({
  board,
  validMoves,
  lastMove,
  moveStartPosition,
  capturedBlack,
  capturedWhite,
  checkedKing,
  handleTileClick,
  flipBoard,
  whitePlayer,
  blackPlayer,
  showNavigation,
  handleFirstButtonClick,
  handleNextButtonClick,
  handleLastButtonClick,
}: ChessboardProps) {
  let tiles: JSX.Element[] = [];

  // if flipBoard is true, display black at the bottom and white at the top instead of the opposite
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
      move.endPosition.isSamePosition(new Position(row, col))
    );
    const highlight =
      (lastMove !== null &&
        (position.isSamePosition(lastMove.startPosition) ||
          position.isSamePosition(lastMove.endPosition))) ||
      (moveStartPosition !== null &&
        position.isSamePosition(moveStartPosition));
    const tileProps: TileProps = {
      piece,
      position,
      backgroundColor,
      valid,
      highlight,
      checkedKing,
      handleTileClick,
      flipBoard,
    };
    return <Tile key={`${row}${col}`} {...tileProps} />;
  }

  const userCardBlack = (
    <UserCard
      key="black"
      alignright={flipBoard ? true : false}
      captured={capturedWhite}
      color={Color.White}
      isActivePlayer={true} //{activePlayer === Color.Black}
      username={blackPlayer}
    />
  );

  const userCardWhite = (
    <UserCard
      key="white"
      alignright={flipBoard ? false : true}
      captured={capturedBlack}
      color={Color.Black}
      isActivePlayer={true} // {activePlayer === Color.White}
      username={whitePlayer}
    />
  );

  const navigationProps = {
    handleFirstButtonClick,
    handleNextButtonClick,
    handleLastButtonClick,
  };

  const navigationStyle = showNavigation
    ? "md:justify-between"
    : "md:justify-end";
  return (
    <div className="w-full p-4">
      <div className="box-border flex h-full w-full flex-col gap-4 md:gap-6 lg:gap-8">
        <div className="flex h-full w-full justify-start">
          {flipBoard ? userCardWhite : userCardBlack}
        </div>
        <div className="m-auto box-border grid aspect-square w-full max-w-2xl grow grid-cols-8 border-8 border-slate-500">
          {tiles}
        </div>
        <div
          className={`flex h-full w-full ${navigationStyle} flex-col-reverse items-center gap-4 md:flex-row md:items-start`}
        >
          {showNavigation && <Navigation {...navigationProps} />}
          {flipBoard ? userCardBlack : userCardWhite}
        </div>
      </div>
    </div>
  );
}
export default Chessboard;
