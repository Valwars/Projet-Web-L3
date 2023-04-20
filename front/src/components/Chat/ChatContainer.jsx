import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatContainer.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { sendMessageRoute, recieveMessageRoute } from "../../utils/APIRoutes";

// import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

import InputMessage from "./InputMessage";
var Push = require("push.js");

const ChatContainer = ({ user, currentChat, setConv, socket }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  useEffect(() => {
    console.log(currentChat);
  }, []);

  /*const [messages, setMessages] = useState([
    { fromSelf: false, message: "COUCOU" },
    { fromSelf: true, message: "Salut ! ça va ?" },
    { fromSelf: false, message: "Super et toi ?" },
    { fromSelf: true, message: "et bah super écoute" },
    { fromSelf: false, message: "COUCOU" },
    { fromSelf: true, message: "Salut ! ça va ?" },
    { fromSelf: false, message: "Super et toi ?" },
    { fromSelf: true, message: "et bah super écoute" },
    { fromSelf: false, message: "COUCOU" },
    { fromSelf: true, message: "Salut ! ça va ?" },
    { fromSelf: false, message: "Super et toi ?" },
    { fromSelf: true, message: "et bah super écoute" },
    {
      fromSelf: true,
      message:
        "Cupidatat enim laboris adipisicing laboris irure excepteur duis ea minim commodo pariatur sint. Ex qui ullamco do consequat. Ex ipsum excepteur nostrud adipisicing irure deserunt ea. Sunt aliqua sunt fugiat dolore. Tempor ut incididunt ullamco do pariatur nisi cillum culpa. Lorem aute mollit ex velit deserunt. Minim nisi fugiat velit eu ullamco excepteur ad cillum est consectetur esse eu officia aute.",
    },
    {
      fromSelf: false,
      message:
        "Cupidatat enim laboris adipisicing laboris irure excepteur duis ea minim commodo pariatur sint. Ex qui ullamco do consequat. Ex ipsum excepteur nostrud adipisicing irure deserunt ea. Sunt aliqua sunt fugiat dolore. Tempor ut incididunt ullamco do pariatur nisi cillum culpa. Lorem aute mollit ex velit deserunt. Minim nisi fugiat velit eu ullamco excepteur ad cillum est consectetur esse eu officia aute.",
    },
  ]);
*/
  useEffect(() => {
    async function get_messages() {
      const response = await axios.get(recieveMessageRoute, {
        params: {
          from: user._id,
          convId: currentChat.conversationId,
        },
      });
      setMessages(response.data);
    }
    get_messages();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    console.log("J'ENVOIE LE MESSAGE");

    socket.current.emit("send-msg", {
      to: currentChat.to,
      from: user._id,
      msg,
    });

    const result = await axios.post(sendMessageRoute, {
      from: user._id,
      convId: currentChat.conversationId,
      message: msg,
    });

    console.log(result);
    if (result.data.status === "ok") {
      const msgs = [...messages];
      msgs.push({ fromSelf: true, message: msg });
      setMessages(msgs);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    const chatMessages = document.getElementById("chat");
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 100);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });

        Push.create("Sparkly : nouveau message !", {
          body: msg,
          icon: "/Petit-logo.ico",
          timeout: 4000,
          onClick: function () {
            window.focus();
            this.close();
          },
        });

        console.log("message recu");
      });
      scrollToBottom();
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2 onClick={() => setConv(undefined)}>Retour</h2>
        <div className="user-details">
          <img src={currentChat.meta.pdp} alt="" />
          <h3>{currentChat.meta.name + " " + currentChat.meta.firstName}</h3>
        </div>
      </div>
      <div className="chat-messages" id="chat">
        {messages.map((message) => {
          return (
            <div id="scroll_ref" key={uuidv4()}>
              <div
                className={`message ${
                  message.fromSelf ? "sended" : "recieved"
                }`}
              >
                <div className="content ">
                  <p>{message.message}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <InputMessage handleSendMsg={handleSendMsg}></InputMessage>
    </div>
  );
};

export default ChatContainer;
