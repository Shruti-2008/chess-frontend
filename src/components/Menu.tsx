import { Link } from "react-router-dom"

function Menu() {
    const buttonStyle = "bg-amber-300 p-6 rounded-xl align-middle shadow-lg text-center hover:bg-amber-400"
    const isOngoingGame = false
    function showModal() {
        document.getElementById("modal")!.style.display = "block"
    }

    function hideModal(){
        document.getElementById("modal")!.style.display = "none"
        // https://www.w3schools.com/howto/howto_js_filter_dropdown.asp
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
                        <input id="opponent" type="text" placeholder="Search..." className="p-2 rounded-lg border-2 border-slate-300"/>
                        <div className="flex-1 border-2 border-amber-300">

                        </div>
                        <button className=" bg-blue-600 text-white text-lg rounded-md mx-auto px-8 py-4 hover:bg-blue-800">START</button>
                    
                    </div>
                </div>
            </div>
        </div>)
}

export default Menu