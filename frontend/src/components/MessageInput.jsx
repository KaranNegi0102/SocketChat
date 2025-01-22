import React, { useState } from "react";

function MessageInput({ sendMessage }) {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    sendMessage(message);
    setMessage("");
  };
  
  return (
    <div className="flex p-4 border-t border-gray-300">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;
