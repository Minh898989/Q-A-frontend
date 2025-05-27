import React, { useState, useEffect, useRef, useMemo } from "react";

import { io } from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import { Smile, Paperclip, Image, Send,Video  } from 'lucide-react';
import axios from "axios";

export default function ChatBox({ friend, initialMessages = [], onMarkedAsRead }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [userId, setUserId] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const messagesContainerRef = useRef(null);
  const imageInputRef = useRef(null);
  const inputRef = useRef(null);
 
  const socket = useMemo(() => io("http://localhost:3009"), []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:3009/api/auth/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data?.data?.id) {
          setUserId(data.data.id);
        } else {
          console.error("Không lấy được ID người dùng");
        }
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [friend]);

  useEffect(() => {
    if (!userId || !friend?.id) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:3009/api/messages/history/${userId}/${friend.id}`);
        const data = await res.json();
        const formatted = data.map((msg) => ({
          ...msg,
          fromMe: msg.sender_id === userId,
        }));
        setMessages(formatted);
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử tin nhắn:", error);
      }
    };

    fetchHistory();
  }, [userId, friend?.id]);

  useEffect(() => {
    const markAsRead = async () => {
      if (!friend || !userId) return;
      try {
        await axios.post("http://localhost:3009/api/messages/mark-as-read", {
          userId,
          friendId: friend.id,
        });
        onMarkedAsRead?.();
      } catch (err) {
        console.error("Lỗi đánh dấu đã đọc:", err);
      }
    };

    markAsRead();
  }, [friend, userId, onMarkedAsRead]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    socket.on("newMessage", (message) => {
      if (
        (message.sender_id === friend.id && message.receiver_id === userId) ||
        (message.sender_id === userId && message.receiver_id === friend.id)
      ) {
        setMessages((prev) => [...prev, { ...message, fromMe: message.sender_id === userId }]);
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [userId, friend.id, socket]);

  useEffect(() => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50);
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || !userId) return;

    const formData = new FormData();
    formData.append("sender_id", userId);
    formData.append("receiver_id", friend.id);
    formData.append("text", text);

    try {
      const res = await fetch("http://localhost:3009/api/messages/send", {
        method: "POST",
        body: formData,
      });

      const newMessage = await res.json();
      setMessages((msgs) => [...msgs, { ...newMessage, fromMe: true }]);
      setInput("");
    } catch (err) {
      console.error("Gửi tin nhắn thất bại", err);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/") || !userId) return;

    const formData = new FormData();
    formData.append("sender_id", userId);
    formData.append("receiver_id", friend.id);
    formData.append("text", "");
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3009/api/messages/send", {
        method: "POST",
        body: formData,
      });

      const newMessage = await res.json();
      setMessages((msgs) => [...msgs, { ...newMessage, fromMe: true }]);
    } catch (err) {
      console.error("Gửi ảnh thất bại", err);
    }

    e.target.value = null;
  };

  const handleAttachFile = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file || !userId) return;

      const formData = new FormData();
      formData.append("sender_id", userId);
      formData.append("receiver_id", friend.id);
      formData.append("text", "");
      formData.append("file", file);

      try {
        const res = await fetch("http://localhost:3009/api/messages/send", {
          method: "POST",
          body: formData,
        });

        const newMessage = await res.json();
        setMessages((msgs) => [...msgs, { ...newMessage, fromMe: true }]);
      } catch (err) {
        console.error("Gửi file thất bại", err);
      }
    };

    fileInput.click();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  if (!userId) return <div className="text-center p-4">Đang tải...</div>;

  return (
    <>
    <div
      className="flex flex-col w-full max-w-screen-lg mx-auto border rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-white"
      style={{ height: 'calc(100vh - 110px)', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", overflow: 'hidden' }}
    >
      <div
  className="flex items-center justify-between px-5"
  style={{ height: 60, background: "linear-gradient(90deg, #2c7be5, #1c54b2)" }}
>
  
  <div className="flex items-center gap-4">
    <div className="relative group">
      <img src={friend.avt} alt={friend.name} className="w-12 h-12 rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform" />
      <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white bg-green-400 animate-pulse" title="Online" />
    </div>
    <div className="text-white font-extrabold text-xl">{friend.name}</div>
  </div>

 
  <button
         
        className="text-white hover:bg-blue-500 p-2 rounded-full transition"
        title="Gọi điện"
      >
        <Video size={24} />
      </button>

</div>

      

      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-6 bg-gray-100 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.fromMe ? "justify-end" : "justify-start"}`}>
            {msg.image_url ? (
              <img src={msg.image_url} alt="img" className="w-full max-w-md h-auto object-contain rounded-2xl shadow-md my-1" />
            ) : (
              <div className={`max-w-[60%] px-6 py-4 rounded-2xl whitespace-pre-wrap break-words shadow-md ${msg.fromMe ? "bg-blue-600 text-white" : "bg-white text-gray-900"}`}>
                {msg.file_url ? (
                  <a href={msg.file_url} target="_blank" rel="noopener noreferrer" className="text-black underline">
                    📎 {msg.file_name || "Tệp đính kèm"}
                  </a>
                ) : (
                  msg.text
                )}
                <div className="text-xs text-blue-200 mt-1 text-right">
                  {new Date(msg.time_sent).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t flex items-center gap-3 bg-white rounded-b-xl relative">
        <button
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          title="Chọn biểu tượng cảm xúc"
          className="p-2 rounded-md hover:bg-blue-100"
        >
          <Smile size={24} className="text-yellow-500" />
        </button>

        {showEmojiPicker && (
          <div className="absolute bottom-16 left-4 z-50 shadow-lg">
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setInput((prev) => prev + emojiData.emoji);
              }}
              theme="light"
              lazyLoadEmojis
            />
          </div>
        )}

        <button onClick={handleAttachFile} title="Tạo file đính kèm" className="p-2 rounded-md hover:bg-blue-100 text-blue-500">
          <Paperclip size={20} />
        </button>

        <button onClick={() => imageInputRef.current.click()} title="Tải ảnh lên" className="p-2 rounded-md hover:bg-blue-100 text-green-500">
          <Image size={20} />
        </button>

        <input type="file" accept="image/*" ref={imageInputRef} onChange={handleImageChange} style={{ display: "none" }} />

        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Nhập tin nhắn..."
          className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{ maxHeight: 120, fontSize: 16, lineHeight: "1.4em" }}
        />
         
        <button
          onClick={() => sendMessage(input)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Send />

        </button>
      </div>
    </div>
    
    </>
  );
  
}