import { Link } from "react-router-dom"
import { api } from "../services/authService"
import React, { useState, useRef, useContext } from "react"
import AuthContext from "../context/AuthProvider"

interface userType {
    id: number
    email: string
    created_at: string
}

function Menu() {
    const buttonStyle = "p-6 text-center align-middle rounded-xl shadow-lg bg-amber-300 hover:bg-amber-400 transition duration-300"
    const isOngoingGame = false
    const [users, setUsers] = useState<userType[]>([])
    const [filteredUsers, setFilteredUsers] = useState<userType[]>([])
    const [opponent, setOpponent] = useState("")
    const [searchText, setSearchText] = useState("")
    const { auth } = useContext(AuthContext)
    const [errorText, setErrorText] = useState("")
    const errRef = useRef<HTMLParagraphElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)

    function showModal() {
        try {
            const config = {
                headers: { Authorization: `Bearer ${auth}` }
            };

            api.get("/users", config)
                .then(response => {
                    setUsers(response.data)
                    setFilteredUsers(response.data)
                })
                .catch((error) => {
                    if (error.response && error.response.status === 401) {
                        setErrorText(error.response.data.detail)
                    } else if (error.request) {
                        setErrorText("No response from server")
                    } else {
                        setErrorText("Unexpected error occured")
                    }
                    errRef.current?.focus()
                })
        }
        catch (error) {
            setErrorText("Unexpected error occured")
            errRef.current?.focus()
        }
        modalRef.current?.classList.toggle("hidden")
    }

    function hideModal() {
        modalRef.current?.classList.toggle("hidden")
        setErrorText("")
        setSearchText("")
        setOpponent("")
    }

    const getUserElement = (user: userType) => {
        const selectedStyle = user.email === opponent ? " bg-green-400 text-white hover:text-white" : " text-slate-600 hover:bg-slate-200 "
        return (
            <div
                id={user.email}
                onClick={(e) => handleClick(e)}
                className={`flex items-center gap-4 p-2 m-2 text-lg overflow-x-auto no-scrollbar rounded-md shadow-md border-slate-200 border-solid border-2 transition duration-300 ${selectedStyle}`}
            >
                <img src="../../assets/images/user_slate_300.png" alt="user" className="object-contain w-12 h-12" />
                <p>{user.email}</p>
            </div>

        )
    }

    var userList = filteredUsers.map(user => getUserElement(user)
    )

    const handleChange = (e: React.ChangeEvent) => {
        const element = e.target as HTMLInputElement
        setSearchText(element.value)
        const filterValues = users.filter(user => user.email.indexOf(element.value) !== -1)
        setFilteredUsers(filterValues)
        userList = filterValues.map(filteredUser => getUserElement(filteredUser))
        setOpponent("")
        setErrorText("")
    }

    const handleClick = (e: React.FormEvent) => {
        const element = e.currentTarget as HTMLInputElement
        if (element.id === opponent) {
            setOpponent("")
        } else {
            setSearchText(element.id)
            setOpponent(element.id)
        }
    }

    const startGame = () => {
        alert("Starting game with opponent " + opponent)
        var temp = auth.slice(1)
        const ws = new WebSocket(`ws://localhost:8000/ws?token=1${temp}`)
        ws.onopen = () => {
            ws.send("Hello")
        }
        ws.onmessage = (event) => {
            console.log(event.data)
            // const json = JSON.parse(event.data);
            // try {
            // if ((json.event = "data")) {
            //     setBids(json.data.bids.slice(0, 5));
            // }
            // } catch (err) {
            // console.log(err);
            // }
        }
    }

    return (
        <div className="mx-auto px-4 py-8 h-full w-full md:w-3/5 lg:w-3/5 xl:w-1/3 flex flex-col gap-16 font-semibold md:text-xl">
            {/* <Link to="/game" className={isOngoingGame ? "hidden" : ""}> */}
            <div className={buttonStyle} onClick={showModal}>
                Start Game
            </div>
            {/* </Link> */}

            <Link to="/ongoing" className={!isOngoingGame ? "hidden" : ""}>
                <div className={buttonStyle}>
                    Ongoing Games
                </div>
            </Link>

            <Link to="/history">
                <div className={buttonStyle}>
                    Game History
                </div>
            </Link>

            <Link to="/profile">
                <div className={buttonStyle}>
                    View Stats
                </div>
            </Link>

            <div
                className="hidden fixed inset-0 h-full w-full bg-gray-600 bg-opacity-50"
                id="modal"
                ref={modalRef}
            >
                <div className="w-full h-full flex justify-center items-center">
                    <div className="mx-auto p-4 w-5/6 md:w-4/5 lg:w-3/5 xl:w-1/2 h-5/6 md:h-4/5 lg:h-3/5 border-2 border-slate-100 bg-slate-50 rounded-xl shadow-2xl flex flex-col justify-between gap-4">

                        <div className="relative flex items-center">
                            <label
                                htmlFor="opponent"
                                className="flex-1 text-xl text-center"
                            >
                                Select Opponent
                            </label>
                            <button
                                className="group absolute right-0"
                                onClick={hideModal}
                            >
                                <img
                                    src="../../assets/images/close.png"
                                    alt="close"
                                    className="group-hover:hidden object-fit h-6 xl:h-8 m-2" />
                                <img
                                    src="../../assets/images/close_hover.png"
                                    alt="close"
                                    className="group-hover:flex hidden object-fit h-8 xl:h-10 m-1" />
                            </button>
                        </div>
                        <input
                            id="opponent"
                            value={searchText}
                            onChange={(e) => handleChange(e)}
                            type="text" placeholder="Search..."
                            className="p-2 text-lg text-slate-500 rounded-lg border-2 border-slate-300 focus:outline-none focus:border-slate-100 focus:ring-2 focus:ring-amber-300 " />
                        <div className="flex-1 border-2 border-amber-300 font-normal overflow-y-auto rounded-lg">
                            {userList}
                        </div>
                        {errorText &&
                            <div
                                ref={errRef}
                                className="text-red-500 p-2 mb-4 font-semibold bg-red-100 shadow-md rounded-lg border-red-500 border-2"
                            >
                                {errorText}!
                            </div>}
                        <button
                            onClick={startGame}
                            disabled={opponent === ""}
                            className={`text-lg rounded-md mx-auto px-8 py-4 text-white ${opponent === "" ? " bg-slate-300 " : " bg-blue-600 hover:bg-blue-800 "}`}
                        >
                            START
                        </button>

                    </div>
                </div>
            </div>
        </div>)
}

export default Menu