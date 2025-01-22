import React from "react";
import Message from "./Message";

function MessageList({ chat, username }) {
  return (
    <div className="flex-1 overflow-y-scroll p-4">
      {chat.map((msg, index) => (
        <Message
          key={index}
          message={msg.message}
          sender={msg.sender}
          isOwnMessage={msg.sender === username}
        />
      ))}
    </div>
  );
}

export default MessageList;
