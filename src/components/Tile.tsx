import {
  IMAGE_LOC,
  Color,
  PieceType,
  HIGHLIGHT_TINT,
  CHECKED_TINT,
} from "../Constants";
import { isEqual, getColor, getName } from "../utilities/pieceUtilities";
import { TileProps } from "../utilities/commonInterfaces";

function Tile({
  piece,
  backgroundColor,
  valid,
  position,
  handleClick,
  highlight,
  checkedKing,
  flipBoard,
}: TileProps) {
  // pieceImage           : display image of the piece based on type and color of the piece, null if tile does not hold a piece
  // validImage           : used to show the end position of all valid moves for the currently selected piece
  //                        displays a filled green circle if the end position is empty, else shows a green circle
  //                        outlining the opponent piece at the end pocition (to be captured)
  // tileBackgroundImage  : if current piece is checked king, show a red background, else, show a white or black image as tile background
  // highlightImage       : display a yellow tint over the last move and currently selected move start tile.

  const pieceImage =
    piece !== PieceType.Empty
      ? `url(${IMAGE_LOC}${getName(piece)}_${getColor(piece)}.png)`
      : null;
  const validImage = isEqual(piece, PieceType.Empty)
    ? `url(${IMAGE_LOC}valid_pos.png)`
    : `url(${IMAGE_LOC}valid_pos_capture.png`;
  const validImage2 = isEqual(piece, PieceType.Empty)
    ? "valid_pos"
    : "valid_pos_capture";
  const highlightImage = HIGHLIGHT_TINT;
  const tileBackgroundImage =
    checkedKing &&
    isEqual(piece, PieceType.King) &&
    getColor(piece) === checkedKing
      ? CHECKED_TINT
      : `url(${IMAGE_LOC}spot_${backgroundColor}.png)`;

  // rowLabel, colLabel : if set, indicates that the row and/or col label will be printed on the tile
  const rowToRank = [1, 2, 3, 4, 5, 6, 7, 8];
  const colToFile = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const firstLine = flipBoard ? 7 : 0;
  const rowLabel = position.y === firstLine ? rowToRank[position.x] : undefined;
  const colLabel = position.x === firstLine ? colToFile[position.y] : undefined;
  const textColor =
    backgroundColor === Color.White ? "text-slate-700" : "text-white";

  // img: Array to hold the piece image, highlight image & tile background image in that order. (piece image will be foremost and tile background the last)
  // valid image is displayed on top of all other images.
  let img: Array<string> = [];
  pieceImage && img.push(pieceImage);
  highlight && img.push(highlightImage);
  img.push(tileBackgroundImage);
  const bgImg: string = img.join(", ");

  return (
    <div
      style={{
        backgroundImage: bgImg,
      }}
      className={`relative flex aspect-square items-center justify-center bg-contain bg-center bg-no-repeat object-contain hover:cursor-pointer`}
      onClick={(event) => {
        handleClick(event, position, valid);
      }}
    >
      {valid && (
        <div
          className={`h-full w-full bg-contain bg-center bg-no-repeat opacity-70 `}
          style={{
            backgroundImage: validImage,
          }}
        ></div>
      )}
      {rowLabel && (
        <p
          className={`opaciy-80 absolute left-1 top-0.5 text-lg font-semibold ${textColor}`}
        >
          {rowLabel}
        </p>
      )}
      {colLabel && (
        <p
          className={`opaciy-80 absolute right-1 bottom-0.5 text-lg font-semibold ${textColor}`}
        >
          {colLabel}
        </p>
      )}
    </div>
  );
}

export default Tile;
