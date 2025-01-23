import React, { useState, useEffect, useContext } from "react";
import UserList from "../components/UserLists";
import ChatWindow from "../components/ChatWindow";
import axios from "axios";
import SocketContext from "../Context/SocketContext";

const Home = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/get-users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("newFriendRequest", ({ senderId }) => {
        alert(`You have a new friend request from user ${senderId}`);
      });

      return () => {
        socket.off("newFriendRequest");
      };
    }
  }, [socket]);

  const sendFriendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/friend-requests/send-request",
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const senderId = localStorage.getItem("userId");
      socket.emit("sendFriendRequest", { senderId, receiverId });
      alert("Friend request sent!");
    } catch (error) {
      console.error("Failed to send request:", error.response?.data || error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <UserList users={users} onSelectUser={setSelectedUser} onSendRequest={sendFriendRequest} />
      </div>
      <div className="flex-1 p-4">
        {selectedUser ? (
          <ChatWindow
            selectedUser={selectedUser}
            messages={messages.filter(
              (msg) => msg.from === selectedUser || msg.to === selectedUser
            )}
          />
        ) : (
          <p className="text-gray-500">Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default Home;
