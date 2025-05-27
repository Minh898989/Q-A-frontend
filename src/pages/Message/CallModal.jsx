import React from "react";
import { Phone, PhoneOff } from "lucide-react";
import { Rnd } from "react-rnd";

export default function CallModal({ friend, onClose }) {
  const handleAccept = () => {
    console.log("Accept call from", friend.username);
    
  };

  const handleReject = () => {
    console.log("Reject call from", friend.username);
    onClose(); // Đóng modal
  };

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 320,
        height: 220,
      }}
      minWidth={280}
      minHeight={180}
      bounds="window"
      className="z-[9999]" // luôn nổi trên cùng
    >
      <div className="bg-white rounded-2xl shadow-xl p-4 w-full h-full flex flex-col justify-between animate-fade-in">
        <div>
          <h2 className="text-xl font-bold mb-1">📞 Cuộc gọi đến</h2>
          <p className="text-gray-700">{friend.username} đang gọi cho bạn...</p>
        </div>

        <div className="flex justify-around mt-4">
          <button
            onClick={handleAccept}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Phone size={20} />
            Trả lời
          </button>
          <button
            onClick={handleReject}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <PhoneOff size={20} />
            Từ chối
          </button>
        </div>
      </div>
    </Rnd>
  );
}
