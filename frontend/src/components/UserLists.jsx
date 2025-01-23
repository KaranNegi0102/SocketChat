import React from "react";

const UserList = ({ users, onSelectUser }) => {
  return (
    <ul>
      {users.map((user,index) => (
        <li key={index} onClick={() => onSelectUser(user)}>
          {user.name}   
        </li>
      ))}
    </ul>
  );
};

export default UserList;