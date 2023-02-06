interface ErrorPageProps {
    errorText: string
}
const ErrorPage = ({errorText}: ErrorPageProps) => {
    return (
        <div className="flex justify-center border-black border-2">
            <div className="bg-slate-200 border-2 border-slate-300 mx-4 my-20 p-4 text-lg text-center font-medium text-red-500 rounded-lg shadow-2xl shadow-slate-200 md:w-2/3 lg:w-1/2" >
                <p>There was an error while fetching your game.</p>
                <p>Details: {errorText}</p>
            </div>

        </div>
    )
}

export default ErrorPage