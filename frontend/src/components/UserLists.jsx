import React, { useRef, useEffect } from 'react';


const UserList = ({ users, selectedUser }) => {
  const userRefs = useRef([]); // Array of refs for each user item
  // console.log(users[0].isOnline);

  // Initialize refs for each user item
  useEffect(() => {
    userRefs.current = userRefs.current.slice(0, users.length);
  }, [users]);

  return (
    <div className="bg-gray-00 rounded-lg p-4">
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={() => selectedUser(user)}
            className={`flex items-center justify-between bg-white rounded-lg px-4 py-2 hover:shadow transition-shadow cursor-pointer ${
              user.isOnline ? "border-green-500 border-2" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`profile-circle flex items-center justify-center w-10 h-10 ${
                  user.isOnline ? "bg-green-500" : "bg-gray-300"
                } text-white font-semibold rounded-full`}
              >
                {user.name[0].toUpperCase()}
              </div>
              <span className="text-black font-medium">{user.name}</span>
            </div>
            <span
              className={`text-sm ${
                user.isOnline ? "text-green-500" : "text-gray-400"
              }`}
            >
              {user.isOnline ? "Online" : "Offline"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default UserList;