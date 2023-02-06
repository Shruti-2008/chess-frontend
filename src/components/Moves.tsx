import { useEffect, useRef } from "react"

interface Props {
    moves: string[][]
}

const Moves = ({ moves }: Props) => {
    //moves = [["a", "b"], ["c", "d"], ["c", "d"], ["e", "f"], ["g", "h"], ["i", "j"], ["k", "l"], ["m", "n"], ["o", "p"], ["q", "r"], ["s", "t"], ["u", "v"], ["w", "x"], ["y", "z"], ["a", "b"], ["c", "d"], ["c", "d"], ["e", "f"], ["g", "h"], ["i", "j"], ["k", "l"], ["m", "n"], ["o", "p"], ["q", "r"], ["s", "t"], ["u", "v"], ["w", "x"], ["y", "z"]]

    const styleHeader = "bg-gradient-to-b from-slate-400 to-slate-500 text-white p-2 rounded-lg drop-shadow-xl shadow-slate-400"
    const headingStyle = "sticky top-0 px-4 bg-amber-300 first:rounded-l-md last:rounded-r-md border-b-2 border-slate-400 border-collapse font-medium text-base md:text-lg"
    const rowStyle = "m-1 bg-slate-200 hover:bg-amber-100"
    const cellStyle = "p-2 text-center first:rounded-l-lg last:rounded-r-lg border-b-2 border-slate-400 border-collapse"

    const moveRef = useRef<HTMLDivElement>(null)
    
    useEffect(()=>{
        if(moveRef.current){
            moveRef.current.scrollTop= moveRef.current.scrollHeight
        }
    },[])

    let moveSet: JSX.Element[] = [];
    moves.forEach((move: string[], i: number) => {
        moveSet.push(
            <tr className={rowStyle} key={i}>
                <td className={cellStyle}>{i+1}</td>
                <td className={cellStyle}>{move[0]}</td>
                <td className={cellStyle}>{move[1]}</td>
            </tr>
        )
    })
    if (moveSet.length < 20){
        let k = moveSet.length
        while (k < 20){
            moveSet.push(<tr className={rowStyle} key={moveSet.length + 1}>
                <td className={cellStyle}>{moveSet.length + 1}</td>
                <td className={cellStyle}>{}</td>
                <td className={cellStyle}>{}</td>
            </tr>)
            k+= 1
        }
    }

    return (
        <div className="overflow-y-auto md:absolute md:left-2/3 md:bottom-0 md:right-0 md:top-0 mx-auto w-full md:w-1/3 border-cyan-300 border-2 mt-8 mb-8 p-2 pt-0" ref={moveRef}>
            <table className="table-fixed w-full md:w-auto border-b-4 border-amber-300 m-auto text-md ">
                <thead className="">
                    <tr>
                        <th className={headingStyle}>No</th>
                        <th className={headingStyle}>White move</th>
                        <th className={headingStyle}>Black move</th>
                    </tr>
                </thead>
                <tbody className="">
                {moveSet}
                </tbody>
            </table>
            
        </div>
    )
}

export default Moves