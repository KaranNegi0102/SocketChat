// import React, { useState, useEffect } from "react";
// import { io } from "socket.io-client";
// import { useLocation } from "react-router-dom";
// import MessageList from "../components/MessageList";
// import MessageInput from "../components/MessageInput";

// const socket = io("http://localhost:5000");

// function Chat() {
//   const [chat, setChat] = useState([]);

//   const location = useLocation();
//   const username = location.state?.username ;
//   console.log(username);

//   useEffect(() => {
    
//     socket.on("receive_message", (data) => {
//       setChat((prevChat) => [...prevChat, data]);
//     });

//     return () => {
//       socket.off("receive_message");
//     };
//   }, []);

//   const sendMessage = (message) => {
//     if (message.trim() !== "") {
//       const data = { message, sender: username };
//       socket.emit("send_message", data);
//       setChat((prevChat) => [...prevChat, data]);
//     }
//   };

//   console.log("this is chat" , chat)

//   return (
//     <div className="flex flex-col h-screen bg-gray-100">
//       <h1 className="text-2xl font-bold p-4 bg-blue-500 text-white">Chat</h1>
//       <MessageList chat={chat} username={username} />
//       <MessageInput sendMessage={sendMessage} />
//     </div>
//   );
// }

// export default Chat;
