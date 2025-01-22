import React from "react";
import { useLocation } from "react-router-dom";

const Chat = () => {
  const location = useLocation();
  const username = location.state?.username || "Guest"; // Get username from state

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Chat Page</h1>
      <p className="text-lg">Welcome to the chat, {username}!</p>
      {/* Add chat functionality here */}
    </div>
  );
};

export default Chat;
