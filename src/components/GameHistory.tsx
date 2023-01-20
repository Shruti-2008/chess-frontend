import { gameHistory } from "./games"
function GameHistory() {
    const headingStyle = "p-1 bg-amber-300 first:rounded-l-md last:rounded-r-md border-b-2 border-slate-400 border-collapse"
    const rowStyle = "m-1 bg-slate-300 hover:bg-amber-100"
    const cellStyle = "p-2 text-center first:rounded-l-lg last:rounded-r-lg border-b-2 border-slate-400 border-collapse"

    let gameTiles:JSX.Element[] = []
    gameHistory.forEach((game, i) => {
        gameTiles.push(
            <tr className={rowStyle} key={i}>
                <td className={cellStyle}>{game.white}</td>
                <td className={cellStyle}>{game.black}</td>
                <td className={cellStyle}>{game.noOfMoves}</td>
                <td className={cellStyle}>{game.result}</td>
                <td className={cellStyle}>{game.date}</td>
            </tr>
           
        )
    })
    return (
        <div className="h-full m-auto p-4">
            <table className="table-fixed border-b-4 border-amber-300 m-auto w-full text-md md:text-xl md:w-3/4">
                <tbody>
                <tr>
                    <th className={headingStyle}>White</th>
                    <th className={headingStyle}>Black</th>
                    <th className={headingStyle}>Moves</th>
                    <th className={headingStyle}>Result</th>
                    <th className={`${headingStyle} w-1/4`}>Date</th>
                </tr>
                {gameTiles}
                </tbody>
            </table>
        </div>
    )
}

export default GameHistory