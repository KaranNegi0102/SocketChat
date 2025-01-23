import React from "react";

const UserList = ({ users, onSelectUser }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user} onClick={() => onSelectUser(user)}>
          {user}
        </li>
      ))}
    </ul>
  );
};

export default UserList;