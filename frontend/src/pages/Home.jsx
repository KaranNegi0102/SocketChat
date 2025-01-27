import React, { useState, useEffect, useContext } from "react";
import UserList from "../components/UserLists";
import axios from "axios";
import SocketContext from "../Context/SocketContext";
import { useLocation, Link } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const location = useLocation();
  const name = location.state?.name;

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/users/get-friends",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.status === 200) {
          setUsers(response.data);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchFriends();
  }, []);

  const selectedUserHandler = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-1/3 bg-white p-6 border-r border-gray-300 shadow-lg">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Welcome, {name}</h1>

        <div>
          <h2 className="text-lg font-medium text-gray-700 mb-4">User List</h2>
          <UserList users={users} selectedUser={selectedUserHandler} />
        </div>

        <div className="mt-6 flex flex-col gap-4">
          <Link to="/send-requests">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              Send Request to Other Users
            </button>
          </Link>
          <Link to="/pending-requests">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
              See All Requests
            </button>
          </Link>
        </div>
      </div>

      <div className="w-2/3 p-6">
        {selectedUser ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chatting with: {selectedUser.name}
            </h2>
            <ChatWindow selectedUser={selectedUser} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <h2 className="text-lg font-medium text-gray-500">
              Select a user to start chatting.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
