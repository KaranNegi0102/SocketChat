const UserList = ({ users , selectedUSer}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Friend List</h2>
      <ul className="space-y-3">
        {users.map((user) => (
          <li
            key={user._id}
            onClick={()=>{selectedUSer(user)}}
            className="flex items-center justify-between bg-gray-100 rounded-lg px-4 py-2 hover:shadow transition-shadow"
          >
            <span className="text-gray-700 font-medium">{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
