import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import UserList from "../components/UserLists";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
const socket = io("http://localhost:5000"); // Connect to the server

const Chat = () => {
  

  const [users, setUsers] = useState([]); // List of all users

  useEffect(()=>{
    const fetchUserData = async () => {
      try{
        const token = localStorage.getItem('token')
        const response = await axios.get("http://localhost:5000/api/users/get-users",{
          headers: {
            'Authorization': `${token}`
          }
        });
        if(response.status===200){
          console.log("this is response -> ",response.data)
          setUsers(response.data)
        }
        }
        catch(err){
          console.log("this is the error -> ",err);
        }
      }
      fetchUserData()
    },[])

    console.log("this is users -> ",users)



  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [messages, setMessages] = useState([]); // Chat messages

  // Register the user when the component mounts
  // useEffect(() => {
  //   if (username) {
  //     socket.emit("register", username);
  //   }
  // }, [username]);

  // // Fetch all users from the server
  // useEffect(() => {
  //   socket.on("userList", (userList) => {
  //     setUsers(userList);
  //   });

  //   // Listen for incoming messages
  //   socket.on("receiveMessage", (message) => {
  //     setMessages((prev) => [...prev, message]);
  //   });

  //   // Cleanup on unmount
  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  // // Send a message to the selected user
  // const sendMessage = (text) => {
  //   if (selectedUser) {
  //     const message = {
  //       from: username,
  //       to: selectedUser,
  //       text,
  //     };
  //     socket.emit("sendMessage", message);
  //     setMessages((prev) => [...prev, message]);
  //   }
  // };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side Panel - User List */}
      <div className="w-1/4 bg-white p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <UserList users={users} onSelectUser={setSelectedUser} />
      </div>

      {/* Right Side Panel - Chat Window */}
      <div className="flex-1 p-4">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages.filter(
              (msg) => msg.from === selectedUser || msg.to === selectedUser
            )}
            // onSendMessage={sendMessage}
          />
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Chat;