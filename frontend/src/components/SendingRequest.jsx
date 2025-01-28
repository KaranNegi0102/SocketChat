import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SocketContext from "../Context/SocketContext";
import { useNavigate } from "react-router-dom";

const SendRequests = () => {
  const [users, setUsers] = useState([]);
  const socket = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch all registered users
        const response = await axios.get("http://localhost:5000/api/users/get-users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("this is response -> ", response.data);
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };
    fetchUsers();
  }, []);

  const sendFriendRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem("token");
      const senderId = localStorage.getItem("userId");

      // Send friend request
      await axios.post(
        "http://localhost:5000/api/friend-requests/send-request",
        { receiverId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Friend request sent successfully");
      console.log(" this is receiverId -> ", receiverId);
      console.log("this is senderId -> ", senderId);

      // Emit a socket event to notify the receiver
      socket.emit("sendFriendRequest", { receiverId, senderId });
      alert("Friend request sent!");
    } catch (error) {
      console.error("Failed to send friend request:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Send Friend Requests</h2>
        <ul className="space-y-4">
          {users.length > 0 ? (
            users.map((user) => (
              <li
                key={user._id}
                className="flex items-center justify-between bg-gray-100 px-4 py-2 rounded-lg shadow"
              >
                <span className="text-gray-700 font-medium">{user.name}</span>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Send Request
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-center">No users found.</p>
          )}
        </ul>
        <button
          onClick={() => navigate("/home")}
          className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors w-full"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SendRequests;
