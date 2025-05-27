import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const VideoCallModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [roomIdInput, setRoomIdInput] = useState('');
  const [generatedRoomId, setGeneratedRoomId] = useState('');
  const [step, setStep] = useState('choose'); // choose | created | join

  const handleCreateRoom = () => {
    const newRoomId = uuidv4();
    setGeneratedRoomId(newRoomId);
    setStep('created');
  };

  const handleJoinRoom = () => {
    if (roomIdInput.trim()) {
      navigate(`/video-call/${roomIdInput.trim()}`);
      onClose();
      resetModal();
    }
  };

  const handleEnterCreatedRoom = () => {
    navigate(`/video-call/${generatedRoomId}`);
    onClose();
    resetModal();
  };

  const resetModal = () => {
    setStep('choose');
    setRoomIdInput('');
    setGeneratedRoomId('');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedRoomId);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">Gọi Video</h2>

        {/* Bước 1: Chọn */}
        {step === 'choose' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={handleCreateRoom}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 font-medium"
            >
              Tạo phòng mới
            </button>
            <button
              onClick={() => setStep('join')}
              className="border border-blue-600 text-blue-600 rounded-lg px-4 py-2 font-medium hover:bg-blue-50"
            >
              Tìm phòng
            </button>
          </div>
        )}

        {/* Bước 2: Sau khi tạo phòng */}
        {step === 'created' && (
          <div className="flex flex-col gap-3 items-center">
            <p className="text-gray-700">ID phòng của bạn:</p>
            <div className="bg-gray-100 p-2 px-4 rounded-lg font-mono text-sm w-full text-center">
              {generatedRoomId}
            </div>
            <button
              onClick={copyToClipboard}
              className="text-blue-600 text-sm hover:underline"
            >
              Copy ID
            </button>
            <button
              onClick={handleEnterCreatedRoom}
              className="mt-3 bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-medium w-full"
            >
              Vào phòng ngay
            </button>
            <button
              onClick={resetModal}
              className="text-sm text-gray-500 hover:underline mt-1"
            >
              ← Quay lại
            </button>
          </div>
        )}

        {/* Bước 3: Nhập ID để vào */}
        {step === 'join' && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              placeholder="Nhập ID phòng..."
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
            <button
              onClick={handleJoinRoom}
              className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-2 font-medium"
            >
              Vào phòng
            </button>
            <button
              onClick={resetModal}
              className="text-sm text-gray-500 hover:underline"
            >
              ← Quay lại
            </button>
          </div>
        )}

        <button
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700"
          onClick={() => {
            onClose();
            resetModal();
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default VideoCallModal;
