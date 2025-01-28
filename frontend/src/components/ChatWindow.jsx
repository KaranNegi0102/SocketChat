import React, { useContext, useState, useEffect, useRef } from "react";
import { SocketContext } from "../Context/SocketContext";

const ChatWindow = ({ selectedUser }) => {
  const [messages, setMessages] = useState({}); // Dictionary to store messages for each user
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Typing indicator state
  const { socket } = useContext(SocketContext);
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the latest message

  // Auto-scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom(); // Scroll to bottom whenever messages change
  }, [messages]);

  useEffect(() => {
    // Listen for incoming messages
    socket.on("receiveMessage", (data) => {
      if (data.senderId === selectedUser._id) {
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser._id]: [
            ...(prevMessages[selectedUser._id] || []),
            { sender: selectedUser.name, text: data.text, timestamp: new Date() },
          ],
        }));
      }
    });

    // Listen for typing indicators
    socket.on("typing", (data) => {
      if (data.senderId === selectedUser._id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("typing");
    };
  }, [socket, selectedUser]);

  const sendMessageHandler = () => {
    if (message.trim() !== "") {
      const userId = localStorage.getItem("userId");
      socket.emit("sendMessage", {
        senderId: userId,
        receiverId: selectedUser._id,
        text: message,
      });

      // Update messages for the selected user
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser._id]: [
          ...(prevMessages[selectedUser._id] || []),
          { sender: "You", text: message, timestamp: new Date() },
        ],
      }));

      setMessage("");
      socket.emit("typing", { senderId: userId, receiverId: selectedUser._id, isTyping: false }); // Stop typing indicator
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
    const userId = localStorage.getItem("userId");
    socket.emit("typing", { senderId: userId, receiverId: selectedUser._id, isTyping: true }); // Start typing indicator
  };

  return (
    <div className="bg-gray-50 border border-gray-300 p-4 rounded-lg h-full flex flex-col">
      {/* Chat Messages */}
      <div className="overflow-y-auto h-4/5 mb-4">
        {(messages[selectedUser._id] || []).map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.sender === "You" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block  px-3 py-2 rounded-lg max-w-xs ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              <strong>{msg.sender}: </strong>
              {msg.text}
              <div className="text-xs text-white mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-lg bg-gray-200">
              <span className="text-gray-500 italic">Typing...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Empty div for auto-scrolling */}
      </div>

      {/* Message Input */}
      <div className="flex">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`Message ${selectedUser.name}`}
          value={message}
          onChange={handleInputChange}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              sendMessageHandler();
            }
          }}
        />
        <button
          onClick={sendMessageHandler}
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;