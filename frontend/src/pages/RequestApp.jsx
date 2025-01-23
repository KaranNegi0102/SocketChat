import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to the server

function RequestApp() {
  const [userId, setUserId] = useState(""); // Current user's ID
  const [otherUserId, setOtherUserId] = useState(""); // ID of the user to send a request to
  const [requests, setRequests] = useState([]); // List of incoming requests
  const [isRegistered, setIsRegistered] = useState(false); // Track if the user is registered

  // Register the user when the "Register" button is clicked
  const registerUser = () => {
    if (userId) {
      socket.emit("register", userId);
      setIsRegistered(true);
      alert(`User ${userId} registered successfully!`);
    } else {
      alert("Please enter a valid User ID.");
    }
  };

  useEffect(() => {
    // Listen for incoming requests
    socket.on("requestReceived", ({ fromUserId }) => {
      setRequests((prev) => [...prev, { fromUserId, status: "pending" }]);
      alert(`You have a new request from ${fromUserId}`);
    });

    // Listen for request responses
    socket.on("requestResponse", ({ toUserId, response }) => {
      alert(`User ${toUserId} responded with ${response}`);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Send a request to another user
  const sendRequest = () => {
    if (userId && otherUserId) {
      socket.emit("sendRequest", { fromUserId: userId, toUserId: otherUserId });
    } else {
      alert("Please enter both your ID and the other user's ID.");
    }
  };

  // Respond to a request (accept/reject)
  const respondToRequest = (fromUserId, response) => {
    socket.emit("respondToRequest", { fromUserId, toUserId: userId, response });
    // Remove the request from the list
    setRequests((prev) => prev.filter((req) => req.fromUserId !== fromUserId));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">Request App</h1>

      {/* User Registration Section */}
      <div className="bg-white shadow p-6 rounded mb-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">User Registration</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Your User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isRegistered} // Disable input after registration
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={registerUser}
            disabled={isRegistered}
            className={`px-4 py-2 text-white rounded ${
              isRegistered ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Register
          </button>
        </div>
      </div>

      {/* Send Request Section */}
      <div className="bg-white shadow p-6 rounded mb-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Send Request</h2>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Other User ID"
            value={otherUserId}
            onChange={(e) => setOtherUserId(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={sendRequest}
            disabled={!isRegistered}
            className={`px-4 py-2 text-white rounded ${
              !isRegistered ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Send Request
          </button>
        </div>
      </div>

      {/* Incoming Requests Section */}
      <div className="bg-white shadow p-6 rounded w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Incoming Requests</h2>
        <ul>
          {requests.length > 0 ? (
            requests.map((req) => (
              <li
                key={req.fromUserId}
                className="flex justify-between items-center p-2 bg-gray-50 border border-gray-300 rounded mb-2"
              >
                <span>{req.fromUserId} - {req.status}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => respondToRequest(req.fromUserId, "accepted")}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => respondToRequest(req.fromUserId, "rejected")}
                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No incoming requests.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default RequestApp;
