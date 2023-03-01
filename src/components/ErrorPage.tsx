import { ErrorPageProps } from "../utilities/commonInterfaces";

const ErrorPage = ({ obj, errorText }: ErrorPageProps) => {
  return (
    <div className="flex justify-center border-2 border-black">
      <div className="mx-4 my-20 flex flex-col gap-4 rounded-lg border-2 border-slate-300 bg-slate-200 p-4 text-center text-lg font-medium text-red-500 shadow-2xl shadow-slate-200 md:w-2/3 md:text-xl lg:w-1/2 lg:text-2xl">
        <p>There was an error while fetching your {obj}.</p>
        <p>Details: {errorText}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
