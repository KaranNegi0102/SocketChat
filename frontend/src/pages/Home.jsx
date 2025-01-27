import React, { useState, useEffect, useContext } from "react";
import UserList from "../components/UserLists";
import axios from "axios";
import SocketContext from "../Context/SocketContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const name = location.state?.name;
  const navigate = useNavigate();

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
      } finally {
        setIsLoading(false);
      }
    };
    fetchFriends();
  }, []);

  const selectedUserHandler = (user) => {
    setSelectedUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navbar */}
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Profile Photo and Link */}
          <Link to="/profile">
            <div className="flex items-center space-x-3 cursor-pointer">
              <img
                src="https://via.placeholder.com/40" // Replace with actual profile photo URL
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
              <span className="text-lg font-semibold text-gray-800">{name}</span>
            </div>
          </Link>
        </div>

        {/* Navbar Buttons */}
        <div className="flex items-center space-x-4">
          <Link to="/send-requests">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
              Add Friend
            </button>
          </Link>
          <Link to="/pending-requests">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200">
              Pending Requests
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-6 border-r border-gray-200 shadow-lg overflow-y-auto">
          {/* Friend List Section */}
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Friends</h2>
          {isLoading ? (
            <div className="text-gray-500">Loading friends...</div>
          ) : (
            <UserList users={users} selectedUser={selectedUserHandler} />
          )}
        </div>

        {/* Chat Window */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedUser ? (
            <div className="h-full flex flex-col bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Chatting with: {" "}
                <span className="text-blue-600">{selectedUser.name}</span>
              </h2>
              <div className="flex-1 overflow-y-auto">
                <ChatWindow selectedUser={selectedUser} />
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center">
              <h2 className="text-xl font-semibold text-gray-400">
                Select a user to start chatting.
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
