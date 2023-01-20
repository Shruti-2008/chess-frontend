import { Link } from "react-router-dom"
import { api } from "../services/authService"
import React, { useState, useRef, useContext } from "react"
import AuthContext from "../context/AuthProvider"

interface userType{
    id: number
    email: string
    created_at: string
}

function Menu() {
    const buttonStyle = "bg-amber-300 p-6 rounded-xl align-middle shadow-lg text-center hover:bg-amber-400"
    const isOngoingGame = false
    const [users, setUsers] = useState<userType[]>([])
    const [filteredUsers, setFilteredUsers] = useState<userType[]>([])
    const [opponent, setOpponent] = useState("")
    const [searchText, setSearchText] = useState("")
    const {auth} = useContext(AuthContext) 
    const [errorText, setErrorText] = useState("")
    const errRef = useRef<HTMLParagraphElement>(null)
    function showModal() {
        try{ console.log("Auth = " + auth)
            const config = {
                headers: { Authorization: `Bearer ${auth}` }
            };
            
            api.get("/users", config)
                .then(response => {
                    console.log(response.data)
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
                    // errRef.current?.focus()
                    alert(errorText)
                })
        }
        catch(error) {
            setErrorText("Unexpected error occured")
            errRef.current?.focus()
        }
        document.getElementById("modal")!.style.display = "block"
    }

    function hideModal(){
        document.getElementById("modal")!.style.display = "none"
        // https://www.w3schools.com/howto/howto_js_filter_dropdown.asp
    }

    const getUserElement = (user: userType) => {
        const selectedStyle = user.email===opponent ? " bg-green-400 hover:bg-green-500 " : " hover:bg-amber-300 "
        return <div id={user.email} onClick={(e) => handleClick(e)} className={`flex items-center gap-4 p-2 m-2 rounded-md shadow-md  border-slate-200 border-solid border-2 ${selectedStyle}`}>
        <img src="../../assets/images/user_slate_200.png" alt="user"></img>
        <p>{user.email}</p>
    </div>
    }

    var userList = filteredUsers.map(user => getUserElement(user)
    )

    const handleChange = (e:React.ChangeEvent) => {
        const element = e.target as HTMLInputElement
        setSearchText(element.value)
        const filterValues = users.filter(user => user.email.indexOf(element.value) !== -1)
        setFilteredUsers(filterValues)
        userList = filterValues.map(filteredUser => getUserElement(filteredUser))
        console.log("searching...", userList)
        setOpponent("")
        
    }

    const handleClick = (e: React.FormEvent) => {
        const element = e.currentTarget as HTMLInputElement
        setSearchText(element.id)
        setOpponent(element.id)
        console.log("Clicked")
    }

    const startGame = () => {
        alert("Starting game with opponent "+opponent)
    }

    return (
        <div className="flex flex-col gap-16 font-semibold w-full px-4 flex-1 py-8 md:w-1/3 md:text-xl">
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

            <div
                className="fixed hidden inset-0 bg-gray-600 bg-opacity-50 h-full w-full"
                id="modal"
            >
                {/* overflow-y-auto  https://www.section.io/engineering-education/creating-a-modal-dialog-with-tailwind-css/*/}
                <div className="w-full h-full flex justify-center items-center">
                    <div className=" p-4 border-2 border-black bg-slate-50 w-4/5 h-4/5 rounded-xl shadow-2xl mx-auto flex flex-col justify-between gap-4 md:w-1/2 md:h-1/2">

                        <div className="flex items-center">
                            <button className="p-4 text-2xl mr-auto text-gray-400 hover:text-black" onClick={hideModal}>X</button>
                            <label htmlFor="opponent" className=" flex-1 text-xl text-center">Select Opponent</label>
                        </div>
                        <input id="opponent" value={searchText} onChange={(e) => handleChange(e)} type="text" placeholder="Search..." className="p-2 rounded-lg border-2 border-slate-300"/>
                        <div className="flex-1 border-2 border-amber-300 font-normal overflow-scroll">
                            {userList}
                        </div>
                        <p ref={errRef}>{errorText}</p>
                        <button onClick={startGame} disabled={opponent === ""} className={`text-lg rounded-md mx-auto px-8 py-4 text-white ${opponent === "" ? " bg-slate-300 ": " bg-blue-600 hover:bg-blue-800 "}`}>START</button>
                    
                    </div>
                </div>
            </div>
        </div>)
}

export default Menu