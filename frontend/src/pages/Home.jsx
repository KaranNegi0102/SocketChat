import React, { useState, useEffect, useContext } from "react";
import UserList from "../components/UserLists";
import axios from "axios";
import SocketContext from "../Context/SocketContext";
import { useLocation, Link } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";

const Home = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
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
  console.log("this is users in home-> ", users);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/4 bg-white p-4 border-r border-gray-200">
        <h2>Welcome, {name}</h2>
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <UserList users={users} selectedUser={selectedUserHandler} />
        <Link to="/send-requests">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send Request to Other Users
          </button>
        </Link>
        <Link to="/pending-requests">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            See All Requests
          </button>
        </Link>

        {selectedUser && 
        <div>
          <h2 className="text-lg font-bold mb-2">
              Chatting with: {selectedUser.name}
          </h2>
          <ChatWindow selectedUser={selectedUser} />
        </div>
        }
      </div>
    </div>
  );
};

export default Home;
