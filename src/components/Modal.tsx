import { ModalProps } from "../utilities/commonInterfaces";

function Modal(props: ModalProps) {
  // const imgStyle =
  //   "m-2 p-2 object-contain display-none rounded-3xl hover:bg-slate-300 hover:shadow-inner hover:shadow-white cursor-pointer transition duration-300";
  const buttonStyle =
    "m-2 w-24 rounded-lg from-amber-400 to-amber-200 bg-gradient-to-t py-4 text-center text-lg lg:text-xl font-semibold shadow-lg transition duration-300 hover:ring-4 hover:ring-amber-200 hover:ring-offset-2 hover:ring-offset-amber-200 lg:m-3 xl:m-4 lg:w-36";

  const buttonList: JSX.Element[] = [];
  props.buttons.forEach((button, idx) => {
    buttonList.push(
      <button
        key={idx.toString()}
        onClick={button.handleButtonClick}
        className={buttonStyle}
      >
        {button.label}
      </button>
    );
  });

  return (
    <div className="fixed inset-0 flex h-full w-full flex-col items-center justify-center bg-slate-400/80">
      <div className="flex h-4/6 w-10/12 flex-col items-center justify-center gap-8 rounded-xl border-2 border-amber-200 bg-white p-4 shadow-xl shadow-amber-100 md:h-1/2 md:w-8/12 lg:w-6/12">
        <div className="text-center">
          <h4 className="text-lg font-semibold text-gray-900 md:text-xl lg:text-2xl ">
            {props.message}
          </h4>
        </div>
        <div className="flex items-center justify-center gap-4">
          {buttonList}
        </div>
      </div>
    </div>
  );
}

export default Modal;
