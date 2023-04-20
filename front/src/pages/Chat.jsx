import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/Chat/ChatContainer";
import { io } from "socket.io-client";
import { getconv, host } from "../utils/APIRoutes";
import axios from "axios";

const Chat = ({ user }) => {
  const socket = useRef();

  const [selectedConv, setSelected] = useState(undefined);
  const [conversations, setConv] = useState([]);

  useEffect(() => {
    get_conv();
  }, []);

  useEffect(() => {
    if (user) {
      socket.current = io(host);
      socket.current.emit("add-user", user._id);
    }
  }, [user]);

  const get_conv = async () => {
    axios
      .get(getconv, {
        params: {
          userid: user._id,
        },
      })
      .then(function (response) {
        // handle success
        console.log(response.data.conversations);
        setConv(response.data.conversations);
      });
  };

  return (
    <div className="app-page chat-page">
      {conversations.length == 0 ? (
        <>
          <div className="no_conv">
            <h1>Tu n'as pas encore engagé de conversations !</h1>
          </div>
        </>
      ) : (
        <>
          {selectedConv ? (
            <ChatContainer
              user={user}
              currentChat={selectedConv}
              setConv={setSelected}
              socket={socket}
            ></ChatContainer>
          ) : (
            <div className="match-content">
              <div className="top">
                <h1>Vos conversations</h1>
                <input type="text" placeholder="Rechercher..." />
              </div>
              <div className="matchs-container">
                {conversations.map((conv) => {
                  return (
                    <div className="match" onClick={() => setSelected(conv)}>
                      <img src={conv.meta.pdp} alt="" />
                      <h2>{conv.meta.name + " " + conv.meta.firstName}</h2>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Chat;
