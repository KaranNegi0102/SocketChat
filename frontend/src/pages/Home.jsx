import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { SocketContext } from "../Context/SocketContext";
import { useLocation, Link, useNavigate } from "react-router-dom";
import UserList from "../components/UserLists";
import ChatWindow from "../components/ChatWindow";
import gsap from "gsap";
import { FaBars, FaTimes } from "react-icons/fa";
import profileImage from "../assets/icons8.gif";

const Home = () => {
  const { socket } = useContext(SocketContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const name = location.state?.name;
  const navigate = useNavigate();

  // Refs for GSAP animations
  const navRef = useRef(null);
  const sidebarRef = useRef(null);
  const chatWindowRef = useRef(null);

  // GSAP animations on component mount
  useEffect(() => {
    gsap.from(navRef.current, {
      duration: 1,
      y: -50,
      opacity: 0,
      ease: "power3.out",
    });

    gsap.from(sidebarRef.current, {
      duration: 1,
      x: -50,
      opacity: 0,
      ease: "power3.out",
      delay: 0.5,
    });

    gsap.from(chatWindowRef.current, {
      duration: 1,
      x: 50,
      opacity: 0,
      ease: "power3.out",
      delay: 1,
    });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    gsap.to(sidebarRef.current, {
      duration: 0.5,
      x: isSidebarOpen ? -250 : 0,
      opacity: isSidebarOpen ? 0 : 1,
      ease: "power3.out",
    });
  };


  // Fetch pending friend requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/friend-requests/pending-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 200) {
          setPendingRequests(response.data.length);
        }
      } catch (err) {
        console.error("Error fetching pending requests:", err);
      }
    };

    fetchPendingRequests();
  }, []);

  // Handle socket events for friend requests
  useEffect(() => {
    if (socket) {
      socket.on("newFriendRequest", () => {
        setPendingRequests((prev) => prev + 1);
      });
    }

    return () => {
      if (socket) {
        socket.off("newFriendRequest");
      }
    };
  }, [socket]);

  // Handle user login and online/offline status
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (socket && userId) {
      socket.emit("login", userId);
    }

    if (socket) {
      socket.on("friend-online", (userId) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isOnline: true } : user
          )
        );
      });

      socket.on("friend-offline", (userId) => {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isOnline: false } : user
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("friend-online");
        socket.off("friend-offline");
      }
    };
  }, [socket]);

  // Fetch friends list
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

  // Handle user selection
  const selectedUserHandler = (user) => {
    setSelectedUser(user);
    gsap.from(chatWindowRef.current, {
      duration: 0.5,
      x: 50,
      opacity: 0,
      ease: "power3.out",
    });
  };

  // Handle logout
  const handleLogout = () => {
    const userId = localStorage.getItem("userId");
    if (socket) {
      socket.emit("logout", userId);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Navbar */}
      <nav
        ref={navRef}
        className="bg-gray-800 shadow-md p-4 flex justify-between items-center"
      >
        <button onClick={toggleSidebar} className="text-white text-2xl focus:outline-none">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className="flex items-center space-x-4">
          <Link to="/profile" className="flex items-center space-x-3 cursor-pointer">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <span className="text-2xl font-semibold text-white hover:underline">
              {name}
            </span>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-white p-4">TalkAtive</h1>

        <div className="flex items-center space-x-4">
          <Link
            to="/send-requests"
            className="bg-white text-black hover:bg-black hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Add Friend
          </Link>
          <Link
            to="/pending-requests"
            className="bg-white text-black hover:bg-black hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-200 relative"
          >
            Pending Requests
            {pendingRequests > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded-full text-xs transform translate-x-1/2 -translate-y-1/2">
                {pendingRequests}
              </span>
            )}
          </Link>
          <Link
            to="/remove-friend"
            className="bg-white text-black hover:bg-black hover:text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            View Friends
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className="w-1/4 bg-gray-700 p-6 border-r border-gray-200 shadow-lg overflow-y-auto"
        >
          <h2 className="text-lg font-semibold text-white mb-4">Friends</h2>
          {isLoading ? (
            <div className="text-gray-500">Loading friends...</div>
          ) : (
            <UserList users={users} selectedUser={selectedUserHandler} />
          )}
        </aside>

        {/* Chat Window */}
        <main ref={chatWindowRef} className="flex-1 p-6 overflow-y-auto bg-gray-500">
          {selectedUser ? (
            <div className="h-full flex flex-col bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Chatting with:{" "}
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
        </main>
      </div>
    </div>
  );
};

export default Home;