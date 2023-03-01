import { JsxElement } from "typescript";
import { Color, PieceType } from "../Constants";

interface Props {
  message: string;
  buttons: { label: string; handleButtonClick: () => void }[];
}

function Modal(props: Props) {
  const imgStyle =
    "m-2 p-2 object-contain display-none rounded-3xl hover:bg-slate-300 hover:shadow-inner hover:shadow-white cursor-pointer transition duration-300";

  const buttonList: JSX.Element[] = [];
  props.buttons.forEach((button, idx) => {
    buttonList.push(
      <button
        id={idx.toString()}
        onClick={button.handleButtonClick}
        className="bg-blue-500 p-4 text-lg font-semibold text-white lg:text-xl"
      >
        {button.label}
      </button>
    );
  });

  return (
    <div className="fixed inset-0 flex h-full w-full flex-col justify-center bg-slate-400/80">
      <div className="flex w-full flex-col items-center justify-center bg-orange-300">
        <div className="pt-6 text-center">
          <h4 className="text-xl font-semibold">{props.message}</h4>
        </div>
        <div className="flex items-center justify-center gap-4 p-4 md:w-2/3 lg:w-3/5 xl:w-1/2"></div>
        {buttonList}
      </div>
    </div>
  );
}

export default Modal;
