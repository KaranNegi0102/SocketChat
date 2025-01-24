import React, { useState, useEffect, useContext } from "react";
import UserList from "../components/UserLists";
import axios from "axios";
import SocketContext from "../Context/SocketContext";
import { useLocation } from "react-router-dom";
import ChatWindow from "../components/ChatWindow";
import { Link } from "react-router-dom";
const Home = () => {
  const socket = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser,setSelectedUser] = useState(null);
  const location = useLocation();
  const name = location.state?.name;

  //storing userId in local storage
  

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/users/get-friends", {
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
    fetchFriends();
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-2/4 bg-white p-4 border-r border-gray-200">
       <h2>Welcome, {name}</h2>
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <UserList users={users} selectedUser={setSelectedUser} />
        <Link to='/send-requests'>
          <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Send Request to other uses
          </button> 
        </Link>
        <Link to='/pending-requests'>
          <button  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          See All requests
          </button> 
        </Link>
       
      </div>

      
    </div>
  );
};

export default Home;
