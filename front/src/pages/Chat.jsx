import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import ChatContainer from "../components/Chat/ChatContainer";
const Chat = ({ user, conv }) => {
  const socket = useRef();

  return (
    <div className="app-page">
      {conv === undefined ? (
        <>
          <div>
            <h1>Selectionne une conversation !</h1>
          </div>
        </>
      ) : (
        // <ChatContainer conv={conv} socket={socket} />
        <></>
      )}
    </div>
  );
};

export default Chat;
