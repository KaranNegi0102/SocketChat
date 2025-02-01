import { useState } from "react";
import { io } from "socket.io-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ImageIcon, SendIcon } from "lucide-react";

const socket = io("http://localhost:5000"); // Change to your server URL

export default function ImageUploadChat({ onSend }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSend = () => {
    if (!image) return;

    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = () => {
      socket.emit("sendImage", { image: reader.result });
      if (onSend) onSend(reader.result);
      setImage(null);
      setPreview(null);
    };
  };

  return (
    <Card className="p-4 flex flex-col gap-2">
      {preview && (
        <CardContent className="flex justify-center">
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg border"
          />
        </CardContent>
      )}
      <div className="flex gap-2 items-center">
        <Input type="file" accept="image/*" onChange={handleImageChange} className="hidden" id="upload" />
        <label htmlFor="upload" className="cursor-pointer">
          <ImageIcon className="w-6 h-6 text-gray-500" />
        </label>
        <Button onClick={handleSend} disabled={!image}>
          <SendIcon className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
}
