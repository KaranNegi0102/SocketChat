import React, { useState } from "react";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const sendMessageHandler = () => {
    if (message.trim() !== "") {
      setMessages([...messages, { sender: "You", text: message }]);
      setMessage("");
      // Add logic to send the message to the server/socket
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg h-full">
      <div className="overflow-y-auto h-4/5 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.sender === "You" ? "text-right" : "text-left"}`}>
            <span className={`inline-block px-3 py-2 rounded-lg ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200"}`}>
              <strong>{msg.sender}: </strong>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Message ${selectedUser.name}`}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessageHandler}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
