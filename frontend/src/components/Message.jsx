import React from "react";

function Message({ message, sender, isOwnMessage }) {
  return (
    <div
      className={`py-2 px-4 my-2 rounded-md max-w-[80%] break-words ${
        isOwnMessage
          ? "bg-blue-500 text-white ml-auto text-right"
          : "bg-gray-200 text-black mr-auto text-left"
      }`}
    >
      <span className="block text-sm font-semibold">
        {isOwnMessage ? "You" : sender}
      </span>
      <span>{message}</span>
    </div>
  );
}

export default Message;
