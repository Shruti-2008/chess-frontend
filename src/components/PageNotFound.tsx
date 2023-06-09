import { IMAGE_LOC } from "../Constants";

function PageNotFound() {
  return (
    <div className="m-auto flex w-full items-center justify-center p-8 lg:pt-16">
      <div className="flex w-full flex-col-reverse items-center justify-center gap-16 lg:flex-row">
        <div className="flex w-60 md:w-80">
          <img
            src={`${IMAGE_LOC}fallenKing-min.png`}
            alt="404 page not found"
            className="object-contain"
          />
        </div>
        <div className="flex flex-col items-center gap-8 lg:items-start">
          <p className=" text-7xl sm:text-10xl xl:text-10xl">404</p>
          <p className=" text-center text-2xl sm:text-5xl xl:text-5xl">
            Sorry, Page Not Found
          </p>
          <p className="text-center text-lg sm:text-2xl xl:text-2xl">
            The page you requested could not be found
          </p>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
