import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const UserList = ({ users, selectedUser }) => {
  const userRefs = useRef([]); // Array of refs for each user item

  // Function to get initials
  const getInitials = (name) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map((part) => part[0].toUpperCase()).join('');
    return initials.slice(0, 2); // Limit to 2 characters
  };

  // GSAP animation for expanding the name and changing colors
  const expandName = (index) => {
    const userItem = userRefs.current[index];
    const nameElement = userItem.querySelector('.user-name');
    const profileCircle = userItem.querySelector('.profile-circle');

    // Animate the name expansion
    gsap.to(nameElement, {
      width: 'auto', // Expand to full width
      opacity: 1, // Fade in
      duration: 0.3, // Animation duration
      ease: 'power2.out', // Smooth easing
    });

    // Animate the background color and text color
    gsap.to(userItem, {
      backgroundColor: '#FFFFFF', // Black background
      color: '#FFFFFF', // White text
      duration: 0.3,
      ease: 'power2.out',
    });

    // Animate the profile circle background
    gsap.to(profileCircle, {
      backgroundColor: '#000000', // White background
      color: '#FFFFFF', // Black text
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // GSAP animation for collapsing the name and reverting colors
  const collapseName = (index) => {
    const userItem = userRefs.current[index];
    const nameElement = userItem.querySelector('.user-name');
    const profileCircle = userItem.querySelector('.profile-circle');

    // Animate the name collapse
    gsap.to(nameElement, {
      width: 0, // Collapse to 0 width
      opacity: 0, // Fade out
      duration: 0.3, // Animation duration
      ease: 'power2.out', // Smooth easing
    });

    // Revert the background color and text color
    gsap.to(userItem, {
      backgroundColor: '#FFFFFF', // Original gray background
      color: '#000000', // Original black text
      duration: 0.3,
      ease: 'power2.out',
    });

    // Revert the profile circle background
    gsap.to(profileCircle, {
      backgroundColor: '#3B82F6', // Original blue background
      color: '#FFFFFF', // Original white text
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  // Initialize refs for each user item
  useEffect(() => {
    userRefs.current = userRefs.current.slice(0, users.length);
  }, [users]);

  return (
    <div className="bg-gray-00 rounded-lg  p-4">
      <ul className="space-y-3">
        {users.map((user, index) => (
          <li
            key={index}
            ref={(el) => (userRefs.current[index] = el)} // Assign ref to each user item
            onClick={() => selectedUser(user)}
            onMouseEnter={() => expandName(index)} // Expand on hover
            onMouseLeave={() => collapseName(index)} // Collapse on hover out
            className="flex items-center justify-between bg-white rounded-lg px-4 py-2 hover:shadow  transition-shadow cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              {/* Profile Circle */}
              <div className="profile-circle flex items-center justify-center w-10 h-10 bg-blue-500 text-white font-semibold rounded-full">
                {getInitials(user.name)}
              </div>
              {/* User Name (initially hidden) */}
              <span
                className="user-name text-black font-medium"
                style={{ width: 0, opacity: 0, overflow: 'hidden' }}
              >
                {user.name}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;