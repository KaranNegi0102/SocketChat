import React, { useState } from "react";

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: "Karan Negi",
    email: "karan.negi@example.com",
    bio: "Full-stack developer skilled in the MERN stack. Passionate about building user-friendly applications.",
    profilePicture: "https://via.placeholder.com/150", // Default placeholder image
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setUser({ ...formData });
    setIsEditing(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <div className="text-center">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500"
          />
          {isEditing ? (
            <div className="mt-4">
              <input
                type="text"
                name="profilePicture"
                value={formData.profilePicture}
                onChange={handleInputChange}
                placeholder="Profile Picture URL"
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          ) : null}
        </div>
        <div className="mt-6">
          {isEditing ? (
            <>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-bold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="border border-gray-300 rounded p-2 w-full"
                />
              </div>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-center">{user.name}</h2>
              <p className="text-sm text-gray-600 text-center">{user.email}</p>
              <p className="mt-4 text-gray-700">{user.bio}</p>
            </>
          )}
        </div>
        <div className="mt-6 text-center">
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Save
            </button>
          ) : (
            <button
              onClick={handleEditToggle}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleEditToggle}
              className="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
