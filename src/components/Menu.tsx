import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import GameService from "../services/gameService";
import { OpponentUser, MoveResponse } from "../utilities/commonInterfaces";
import { IMAGE_LOC } from "../Constants";
import AuthService from "../services/authService";

function Menu() {
  const buttonStyle =
    "p-6 text-center align-middle rounded-xl shadow-lg from-amber-400 to-amber-200 bg-gradient-to-t text-lg md:text-2xl hover:ring-4 hover:ring-amber-200 hover:ring-offset-2 hover:ring-offset-amber-200 transition duration-300";

  const [users, setUsers] = useState<OpponentUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<OpponentUser[]>([]);
  const [opponent, setOpponent] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [ongoingGame, setOngoingGame] = useState<MoveResponse | null>(null);
  const navigate = useNavigate();

  const errRef = useRef<HTMLParagraphElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      GameService.getActiveGame()
        .then((response) => {
          setOngoingGame(response.data);
          console.log("Active Game is", response.data);
          setErrorText("");
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server");
          } else if (error.response && error.response.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response.status === 400) {
            //technical database details exposed
            setErrorText(error.response.data.detail);
          } else {
            setErrorText("Unexpected error occured");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured");
    }
  }, []);

  function showModal() {
    try {
      GameService.getEligibleOpponents()
        .then((response) => {
          setUsers(response.data);
          setFilteredUsers(response.data);
          setErrorText("");
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server");
          } else if (error.response && error.response?.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response?.status === 400) {
            // technical database details exposed
            setErrorText(error.response.data.detail);
          } else {
            setErrorText("Unexpected error occured");
          }
        });
    } catch (error) {
      setErrorText("Unexpected error occured");
    }
    modalRef.current!.classList.toggle("hidden");
  }

  function hideModal() {
    modalRef.current?.classList.toggle("hidden");
    setErrorText("");
    setSearchText("");
    setOpponent(null);
  }

  const getUserElement = (user: OpponentUser) => {
    const selectedStyle =
      opponent && user.id === opponent
        ? " bg-green-400 text-white hover:text-white"
        : " text-slate-600 hover:bg-slate-200 ";

    return (
      <button
        id={user.email}
        value={user.id}
        onClick={(e) => handleClick(e)}
        className={`no-scrollbar my-2 flex w-full items-center gap-4 overflow-x-auto rounded-md border-2 border-solid border-slate-200 p-2 shadow-md transition duration-300 md:text-lg xl:text-xl ${selectedStyle}`}
      >
        <img
          src={`${IMAGE_LOC}user_slate_300.png`}
          alt="user"
          className="h-12 w-12 object-contain"
        />
        <p>{user.email}</p>
      </button>
    );
  };

  var userList = filteredUsers.map((user) => getUserElement(user));

  const handleChange = (e: React.ChangeEvent) => {
    const element = e.target as HTMLInputElement;
    setSearchText(element.value);
    const filterValues = users.filter(
      (user) => user.email.indexOf(element.value) !== -1
    );
    setFilteredUsers(filterValues);
    userList = filterValues.map((filteredUser) => getUserElement(filteredUser));
    setOpponent(null);
    setErrorText("");
  };

  const handleClick = (e: React.FormEvent) => {
    const element = e.currentTarget as HTMLInputElement;
    if (opponent && Number(element.value) === opponent) {
      setOpponent(null);
    } else {
      setSearchText(element.id);
      setOpponent(+element.value);
    }
  };

  const startGame = () => {
    // e.preventDefault()
    try {
      GameService.createGame(opponent!)
        .then((response) => {
          navigate(`/game/${response.data.id}`, { state: response.data });
          setErrorText("");
        })
        .catch((error) => {
          if (!error?.response && error?.request) {
            setErrorText("No response from server");
          } else if (error.response && error.response?.status === 403) {
            AuthService.logout();
            navigate("/login");
          } else if (error.response && error.response?.status === 400) {
            // technical database details exposed
            setErrorText(error.response.data?.detail);
          } else {
            setErrorText("Unexpected error occured. Could not start game.");
          }
        });
    } catch (err) {
      setErrorText("Unexpected error occured. Could not start game.");
    }
  };

  return (
    <div className="mx-auto flex h-full w-full flex-col gap-16 px-4 py-8 font-semibold md:w-3/5 md:text-xl lg:w-3/5 xl:w-1/3">
      <div
        className={`${buttonStyle} ${
          ongoingGame === null && !errorText ? "" : "hidden"
        } `}
        onClick={showModal}
      >
        Start Game
      </div>
      {errorText && (
        <div className="mb-4 rounded-lg border-2 border-red-500 bg-red-100 p-2 text-center font-semibold text-red-500 shadow-md">
          Could not verify active game. {errorText}!
        </div>
      )}

      <Link
        to={`/game/${ongoingGame?.id}`}
        state={ongoingGame}
        className={ongoingGame === null ? "hidden" : ""}
      >
        <div className={buttonStyle}>Ongoing Game</div>
      </Link>

      <Link to="/history">
        <div className={buttonStyle}>Game History</div>
      </Link>

      <Link to="/profile">
        <div className={buttonStyle}>View Statistics</div>
      </Link>

      <div
        className="fixed inset-0 hidden h-full w-full bg-gray-600 bg-opacity-70"
        id="modal"
        ref={modalRef}
      >
        <div className="flex h-full w-full items-center justify-center">
          <div className="mx-auto flex h-5/6 w-5/6 flex-col justify-between gap-4 rounded-xl border-2 border-slate-100 bg-slate-50 p-4 shadow-2xl md:h-4/5 md:w-4/5 lg:h-3/5 lg:w-3/5 xl:w-1/2">
            <div className="relative flex items-center">
              <label
                htmlFor="opponent"
                className="flex-1 text-center text-lg md:text-xl lg:py-2 xl:text-2xl"
              >
                Select Opponent
              </label>
              <button className="group absolute right-0" onClick={hideModal}>
                <img
                  src={`${IMAGE_LOC}close.png`}
                  alt="close"
                  className="object-fit m-2 h-6 group-hover:hidden xl:h-8"
                />
                <img
                  src={`${IMAGE_LOC}close_hover.png`}
                  alt="close"
                  className="object-fit m-1 hidden h-8 group-hover:flex xl:h-10"
                />
              </button>
            </div>
            <input
              id="opponent"
              value={searchText}
              onChange={(e) => handleChange(e)}
              type="text"
              placeholder="Search..."
              className="rounded-lg border-2 border-slate-300 p-2 text-slate-500 focus:border-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-300 md:text-lg xl:text-xl"
            />
            <div className="flex-1 overflow-y-auto rounded-lg border-2 border-amber-300 px-2 font-normal">
              {userList}
            </div>
            {errorText && (
              <div
                ref={errRef}
                className="mb-4 rounded-lg border-2 border-red-500 bg-red-100 p-2 font-semibold text-red-500 shadow-md"
              >
                {errorText}!
              </div>
            )}
            <button
              onClick={startGame}
              disabled={!opponent}
              className={`mx-auto rounded-md px-8 py-4 text-lg text-white ${
                !opponent ? " bg-slate-300 " : " bg-blue-600 hover:bg-blue-800 "
              }`}
            >
              START
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Menu;

// add username to users fetched
// seperate config for active game request why?
