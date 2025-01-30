import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

const socket = io("http://localhost:5000"); // Update with your backend URL

export default function NotificationButton() {
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    socket.on("friendRequest", () => {
      setNotifications((prev) => prev + 1);
    });

    return () => {
      socket.off("friendRequest");
    };
  }, []);

  return (
    <Button className="relative">
      <Bell className="w-6 h-6" />
      {notifications > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
          {notifications}
        </span>
      )}
    </Button>
  );
}
