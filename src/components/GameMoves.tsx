import { api } from "../services/authService"
import AuthContext from "../context/AuthProvider"
import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ErrorPage from "./ErrorPage"

interface gameData {
    id: number
    moves: string[][]
    whitePlayer: string
    blackPlayer: string
    result: string
}

function GameMoves() {
    const { auth } = useContext(AuthContext)
    const { id } = useParams()
    const [game, setGame] = useState<gameData>()
    const [errorText, setErrorText] = useState("")

    useEffect(() => {
        // #int# comment below later
        setGame({
            id: 1,
            moves: [["a", "b"], ["c", "d"], ["c", "d"], ["e", "f"], ["g", "h"], ["i", "j"], ["k", "l"], ["m", "n"], ["o", "p"], ["q", "r"], ["s", "t"], ["u", "v"], ["w", "x"], ["y", "z"], ["a", "b"], ["c", "d"], ["c", "d"], ["e", "f"], ["g", "h"], ["i", "j"], ["k", "l"]],
            whitePlayer: "Savi99sawant@gmail.com",
            blackPlayer: "Shruti97sawant@gmail.com",
            result: "1-0"
        })
        try {
            const config = {
                headers: { Authorization: `Bearer ${auth}` }
            };
            api.get(`/games/${id}`, config)
                .then(response => {
                    console.log(response.data)
                    //setGame(response.data)
                })
                .catch((error) => {
                    let errorText = ""
                    if (error.response && error.response.status === 401) {
                        setErrorText(error.response.data.detail)
                    } else if (error.request) {
                        setErrorText("No response from server")
                    } else {
                        setErrorText("Unexpected error occured")
                    }
                })
        } catch (error) {
            setErrorText("Unexpected error occured")
        }
    }, [])

    const styleHeader = "bg-gradient-to-b from-slate-400 to-slate-500 text-white p-2 rounded-lg drop-shadow-xl shadow-slate-400"
    const headingStyle = "px-4 bg-amber-300 first:rounded-l-md last:rounded-r-md border-b-2 border-slate-400 border-collapse font-medium text-lg"
    const rowStyle = "m-1 bg-slate-200 hover:bg-amber-100"
    const cellStyle = "p-2 text-center first:rounded-l-lg last:rounded-r-lg border-b-2 border-slate-400 border-collapse"
    const statTileStyle = "basis-1/5 grow bg-slate-200 rounded-lg shadow-lg shadow-slate-100 p-4 text-center flex flex-col gap-4"

    if (game) {
        let moveSet: JSX.Element[] = [];
        game.moves.forEach((move, i) => {
            moveSet.push(
                <tr className={rowStyle} key={i}>
                    <td className={cellStyle}>{i}</td>
                    <td className={cellStyle}>{move[0]}</td>
                    <td className={cellStyle}>{move[1]}</td>
                </tr>
            )
        })

        return (
            <div className="mx-auto w-4/5">
                <div className="flex flex-col-reverse md:flex-col justify-center items-center gap-8 p-4">
                    <div className="flex flex-wrap flex-col md:flex-row gap-4 justify-between w-full">
                        <div className={statTileStyle}>
                            <div className={styleHeader}>White</div>
                            <div className="flex flex-row gap-4 items-center justify-center md:justify-start">
                                <img
                                    src="../../assets/images/user_slate_300.png"
                                    alt="user"
                                    className="object-contain w-8 h-8"
                                />
                                <p className="overflow-x-auto">{game.whitePlayer}</p>
                            </div>
                        </div>
                        <div className={statTileStyle}>
                            <div className={styleHeader}>Black</div>
                            <div className="flex flex-row gap-4 items-center justify-center md:justify-start">
                                <img
                                    src="../../assets/images/user_slate_300.png"
                                    alt="user"
                                    className="object-contain w-8 h-8"
                                />
                                <p className="overflow-x-auto">{game.blackPlayer}</p>
                            </div>
                        </div>
                        <div className={statTileStyle}>
                            <div className={styleHeader}>No. of Moves</div>
                            <div>
                                {game.moves.length}
                            </div>
                        </div>
                        <div className={statTileStyle}>
                            <div className={styleHeader}>Result</div>
                            <div>
                                {game.result}
                            </div>
                        </div>

                        {/* 
                        <div className={statTileStyle}>
                            <div className={styleHeader}>Date/Duration</div>
                            <div>
                                2 hr 3 min
                            </div>
                        </div> 
                        */}
                    </div>
                    <div className="w-full md:w-auto">
                        <table className="table-fixed w-full md:w-auto border-b-4 border-amber-300 m-auto text-md ">
                            <tbody className="sticky">
                                <tr>
                                    <th className={headingStyle}>No.</th>
                                    <th className={headingStyle}>White move</th>
                                    <th className={headingStyle}>Black move</th>
                                </tr>
                                {moveSet}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>)
    } else {
        const errorPageProps = {
            errorText: errorText,
        };
        
        return <ErrorPage {...errorPageProps}/>
    }
}
export default GameMoves