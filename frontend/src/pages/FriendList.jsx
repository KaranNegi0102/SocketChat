import React, { useEffect, useState } from "react";
import axios from "axios";

const FriendsList = ({ userToken }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch friends list from backend
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
          setFriends(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchFriends();
  }, []);
  console.log("this is friends -> ", friends);

  const removeFriend = async (friendId) => {
    console.log("this is friendId in remove friend page -> ", friendId); 
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/users/remove-friend",
        { friendId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update UI instantly
      setFriends((prevFriends) => prevFriends.filter((friend) => friend._id !== friendId));
    } catch (error) {
      console.error("Error removing friend:", error);
    }
  };

  if (loading) return <p className="text-center text-gray-600">Loading friends...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-lg mx-auto mt-10 p-5 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">My Friends</h2>

      {friends.length === 0 ? (
        <p className="text-center text-gray-600">No friends yet.</p>
      ) : (
        <ul className="divide-y divide-gray-300">
          {friends.map((friend) => (
            <li key={friend._id} className="flex justify-between items-center py-3 px-4">
              <span className="text-lg text-gray-700">{friend.name}</span>
              <button
                onClick={() => removeFriend(friend._id)}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
