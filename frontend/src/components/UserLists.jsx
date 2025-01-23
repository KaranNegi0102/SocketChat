const UserList = ({ users, onSendRequest }) => {
  return (
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          {user.name}{" "}
          <button onClick={() => onSendRequest(user._id)}>Send Request</button>
        </li>
      ))}
    </ul>
  );
};

export default UserList;