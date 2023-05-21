import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import "./ChatContainer.css";

const InputMessage = ({ handleSendMsg }) => {
  const [msg, setMsg] = useState("");

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <div id="input_msg">
      {/* <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
                    {showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />}
                </div>
            </div> */}

      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <textarea
          type="text"
          placeholder="Entre ton message ici..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
};

export default InputMessage;
