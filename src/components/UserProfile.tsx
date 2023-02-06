import { useState, useContext } from "react"
import { api } from "../services/authService"
import AuthContext from "../context/AuthProvider"

interface UserStats {
    name: string
    value: number
}

function UserProfile() {
    const [stats, setStats] = useState<UserStats[]>([{ name: "played", value: 0 }, { name: "won", "value": 0 }, { name: "lost", "value": 0 }, { name: "tie", "value": 0 }])
    const [errorText, setErrorText] = useState("")
    const { auth } = useContext(AuthContext)
    const user = "shruti97.sawant@gmail.com" //********************* change this ******************************/

    const getStats = () => {
        setStats([{ name: "played", value: 10 }, { name: "won", "value": 2 }, { name: "lost", "value": 3 }, { name: "tie", "value": 5 }])
        try {
            const config = {
                headers: { Authorization: `Bearer ${auth}` }
            };
            api.get(`/stats/${user}`, config)
                .then(response => {
                    console.log(response.data)
                    setStats(response.data)
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
    }

    const styleHeader = "bg-gradient-to-b from-slate-400 to-slate-500 text-white p-2 rounded-lg drop-shadow-xl shadow-slate-400 uppercase font-medium "
    let statsList: JSX.Element[] = [];

    stats?.forEach(stat => {
        statsList.push(
            <div className="basis-1/3 grow bg-slate-200 rounded-lg shadow-lg shadow-slate-100 p-4 text-center flex flex-col gap-4">
                <div className={styleHeader}>{stat.name}</div>
                <div className="">
                    <p className="">{stat.value}</p>
                </div>
            </div>
        )
    })

    return (
        <div className="w-full flex flex-col justify-center items-center gap-8 p-4 pt-8">
            <div className=" w-full md:w-2/3 lg:w-3/5 text-center text-xl font-semibold p-4 shadow-inner shadow-amber-200 rounded-xl bg-amber-300">
                My Statistics
            </div>
            <div className="flex flex-wrap flex-col md:flex-row gap-8 justify-between w-full md:w-2/3 lg:w-3/5">
                {statsList}
            </div>
        </div>
    )
}
export default UserProfile