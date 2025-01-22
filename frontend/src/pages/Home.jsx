import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const joinChat = () => {
    if (username.trim() !== "") {
      navigate("/chat", { state: { username } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Welcome to Chat App</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="p-2 border rounded mb-4 w-1/2"
      />
      <button
        onClick={joinChat}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Join Chat
      </button>
    </div>
  );
}

export default Home;
