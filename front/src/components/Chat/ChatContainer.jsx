import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import "./ChatContainer.css";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Loader_transition from "../Loading";

import {
  sendMessageRoute,
  recieveMessageRoute,
  getImage,
} from "../../utils/APIRoutes";

// import { sendMessageRoute, recieveMessageRoute } from "../utils/APIRoutes";
import { v4 as uuidv4 } from "uuid";

import InputMessage from "./InputMessage";
var Push = require("push.js");

const ChatContainer = ({ user, currentChat, setConv, socket }) => {
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const [accroche, setAccroche] = useState([
    "Salut, comment vas-tu ?",
    "Coucou, tu cherches quoi sur Sparkly ?",
    "Hey, j'adore ta photo de profil !",
    "Salut, je suis ravi de matcher avec toi !",
  ]);

  useEffect(() => {
    console.log(currentChat);
  }, []);

  useEffect(() => {
    async function get_messages() {
      const response = await axios.get(recieveMessageRoute, {
        params: {
          from: user._id,
          convId: currentChat.conversationId,
        },
      });
      setMessages(response.data);
      setLoading(false);
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
        scrollToBottom();
      });
      scrollToBottom();
    }
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  const formatMessage = (message) => {
    return message.split("\n").map((line, index) => <p key={index}>{line}</p>);
  };

  return (
    <>
      {loading ? (
        <Loader_transition></Loader_transition>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h2 onClick={() => setConv(undefined)}>Retour</h2>
            <div className="user-details">
              <img src={getImage + currentChat.meta.pdp} alt="" />
              <h3>
                {currentChat.meta.name + " " + currentChat.meta.firstName}
              </h3>
            </div>
          </div>
          <div className="chat-messages" id="chat">
            {messages.length > 0 ? (
              <>
                {messages.map((message) => {
                  return (
                    <div id="scroll_ref" key={uuidv4()}>
                      <div
                        className={`message ${
                          message.fromSelf ? "sended" : "recieved"
                        }`}
                      >
                        <div className="content ">
                          {formatMessage(message.message)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="accroches">
                {accroche.map((accroche) => {
                  return (
                    <div
                      className="accroche"
                      onClick={() => handleSendMsg(accroche)}
                    >
                      <h2>{accroche}</h2>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <InputMessage handleSendMsg={handleSendMsg}></InputMessage>
        </div>
      )}
    </>
  );
};

export default ChatContainer;
