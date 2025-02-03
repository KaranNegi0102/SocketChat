import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import SocketContext from "../Context/SocketContext";
import gsap from "gsap"; // Import GSAP

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const socket = useContext(SocketContext);
  const navigate = useNavigate(); // Initialize useNavigate
  const containerRef = useRef(null); // Ref for GSAP animation

  // GSAP animation on component mount
  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current, {
        duration: 0.8,
        opacity: 0,
        y: 50,
        ease: "power3.out",
      });
    }
  }, []);

  // Fetch pending friend requests
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:5000/api/friend-requests/pending-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("this is response -> ", response.data);
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error.message);
      }
    };
    fetchRequests();
  }, []);

  // Handle accepting a friend request
  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/friend-requests/accept-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId)); // Remove accepted request
      alert("Friend request accepted!");
    } catch (error) {
      console.error("Failed to accept request:", error.message);
    }
  };

  // Handle rejecting a friend request
  const handleReject = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/friend-requests/reject-request",
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingRequests((prev) => prev.filter((req) => req._id !== requestId)); // Remove rejected request
      alert("Friend request rejected!");
    } catch (error) {
      console.error("Failed to reject request:", error.message);
    }
  };

  // Handle back button click
  const handleBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <div ref={containerRef} className="bg-gray-600 p-6 rounded-lg shadow-md max-w-2xl mx-auto mt-10">
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="mb-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition duration-200"
      >
        Back
      </button>

      {/* Pending Requests List */}
      <h2 className="text-xl font-bold mb-4">Pending Friend Requests</h2>
      <ul className="space-y-3">
        {pendingRequests.map((req) => (
          <li
            key={req._id}
            className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2"
          >
            <span className="text-gray-700 font-medium">{req.sender.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => handleAccept(req._id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingRequests;