import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/Chat/ChatContainer";

const Chat = ({ user }) => {
  const socket = useRef();

  const [selectedConv, setSelected] = useState(undefined);

  const [conversations, setConv] = useState([
    {
      name: "Bénédicte",
      firstName: "Bedin",
      id: "23523",
      pdp: "https://randomuser.me/api/portraits/women/58.jpg",
    },
    {
      name: "Michelle",
      firstName: "Bedin",
      id: "23523",
      pdp: "https://randomuser.me/api/portraits/women/58.jpg",
    },
    {
      name: "Bichelle",
      firstName: "Bedin",
      id: "23523",
      pdp: "https://randomuser.me/api/portraits/women/58.jpg",
    },
    {
      name: "Mario",
      firstName: "Bedin",
      id: "23523",
      pdp: "https://randomuser.me/api/portraits/women/58.jpg",
    },
    {
      name: "Matchopeur",
      firstName: "Bedin",
      id: "23523",
      pdp: "https://randomuser.me/api/portraits/women/58.jpg",
    },
  ]);

  return (
    <div className="app-page">
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
                      <img src={conv.pdp} alt="" />
                      <h2>{conv.name + " " + conv.firstName}</h2>
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
