import { useEffect, useRef } from "react";
import Board from "../models/Board";
import { MoveResponse } from "../utilities/commonInterfaces";
import { processResponse } from "../utilities/responseUtilities";

const useSocket = (
  id: string,
  auth: string,
  handleResponse: (_chessState: Board) => void
) => {
  useEffect(() => {
    // intializing websocket here so that it is not reinitialized on every re-render
    // const closeConnection = (e: Event) => {
    //     e.preventDefault()
    //     console.log("Closing Connection")
    //     if (ws.current?.readyState === WebSocket.OPEN)
    //         ws.current.close();
    // }
    // gameRef.current?.addEventListener('beforeunload', closeConnection);
    // return () => {
    //     gameRef.current?.removeEventListener('beforeunload', closeConnection);
    // }
  }, []);

  const sendMessage = (obj: MoveResponse) => {};

  //   return ws.current;
};

export default useSocket;
