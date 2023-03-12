import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import ChatContainer from "../components/Chat/ChatContainer";
const Chat = ({ user, conv }) => {
  const socket = useRef();

  return (
    <div className="app-page">
      {conv === undefined ? (
        <>
          <div className="no_conv">
            <h1>Tu n'as pas encore engagé de conversations !</h1>
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
