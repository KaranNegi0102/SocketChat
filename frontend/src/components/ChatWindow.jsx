import React, { useState } from "react";

const ChatWindow = ({ selectedUser, messages, onSendMessage }) => {
  const [text, setText] = useState("");

  const handleSendMessage = () => {
    if (text.trim()) {
      onSendMessage(text);
      setText("");
    }
  };

  return (
    <div>
      <h2>Chat with {selectedUser}</h2>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div key={index} className={msg.from === selectedUser ? "received" : "sent"}>
            <strong>{msg.from}: </strong>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;