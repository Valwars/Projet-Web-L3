import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/Chat/ChatContainer";
import { io } from "socket.io-client";
import { deleteR, getImage, getconv, host } from "../utils/APIRoutes";
import axios from "axios";
import Loader_transition from "../components/Loading";

const Chat = ({ user }) => {
  const socket = useRef();

  const [selectedConv, setSelected] = useState(undefined);
  const [conversations, setConv] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searsh, setSearsh] = useState("");
  const [sort, setSort] = useState(1);

  useEffect(() => {
    get_conv();
  }, [searsh, sort]);

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
          searchString: searsh,
          order: sort,
        },
      })
      .then(function (response) {
        // handle success
        console.log(response.data.conversations);
        setConv(response.data.conversations);
        setLoading(false);
      });
  };

  const handle_sort = (e) => {
    document
      .getElementsByClassName("filter-order-active")[0]
      .classList.remove("filter-order-active");
    e.target.classList.add("filter-order-active");
  };

  const delete_document = async (item) => {
    const result = await axios.post(deleteR, {
      collection: "Conversations",
      id: item.conversationId,
    });

    if (result.data.status === "ok") {
      setConv(
        conversations.filter((i) => i.conversationId !== item.conversationId)
      );
    }
  };

  const handleContextMenu = (event, item) => {
    event.preventDefault();
    delete_document(item);
  };
  return (
    <div className="app-page chat-page">
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <>
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
                  <div className="order-filters">
                    <i
                      className="fa fa-chevron-down filter-order-active"
                      onClick={(e) => {
                        handle_sort(e);
                        setSort(1);
                      }}
                    ></i>

                    <i
                      className="fa fa-chevron-up"
                      onClick={(e) => {
                        handle_sort(e);
                        setSort(-1);
                      }}
                    ></i>
                  </div>
                  <input
                    id="convtp"
                    type="text"
                    placeholder="Rechercher..."
                    onChange={(e) => setSearsh(e.target.value)}
                  />
                </div>
                {conversations.length == 0 ? (
                  <>
                    <div className="no_conv">
                      {searsh.length > 0 ? (
                        <h2>Pas de résulats correspondants !</h2>
                      ) : (
                        <h2>Tu n'as pas encore engagé de conversations !</h2>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="matchs-container">
                    {conversations.map((conv) => {
                      return (
                        <div
                          onContextMenu={(e) => handleContextMenu(e, conv)}
                          className="match"
                          onClick={() => setSelected(conv)}
                        >
                          <img src={getImage + conv.meta.pdp} alt="" />
                          <h2>{conv.meta.name + " " + conv.meta.firstName}</h2>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        </>
      )}
    </div>
  );
};

export default Chat;
