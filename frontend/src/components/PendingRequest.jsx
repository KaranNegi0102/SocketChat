import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import SocketContext from "../Context/SocketContext";

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/friend-requests/pending-requests", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("this is response -> ", response.data);
        setPendingRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error.message);
      }
    };
    fetchRequests();
  }, []);

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

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
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
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Accept
              </button>
              <button
                onClick={() => handleReject(req._id)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
