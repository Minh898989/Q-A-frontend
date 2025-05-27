import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Peer from 'peerjs';
import io from 'socket.io-client';
import axios from 'axios';

const VideoCallRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const localVideoRef = useRef(null);
  const peerInstance = useRef(null);
  const socket = useRef(null);
  const userStream = useRef(null);
  const peers = useRef({});
  const [remoteStreams, setRemoteStreams] = useState({});
  const [peerId, setPeerId] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        // Get token and userId
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3009/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = String(res.data.data.id);
        setPeerId(userId);

        // Get media stream
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

        // Init peer
        const peer = new Peer(userId);
        peerInstance.current = peer;

        peer.on('open', () => {
          socket.current = io('http://localhost:3009');
          socket.current.emit('join-room', { roomId, peerId: userId });

          socket.current.on('user-joined', remotePeerId => {
            if (!peers.current[remotePeerId]) {
              const call = peer.call(remotePeerId, stream);
              handleCall(call);
            }
          });

          socket.current.on('all-users', userIds => {
  userIds.forEach(remotePeerId => {
    if (remotePeerId !== userId && !peers.current[remotePeerId]) {
      setTimeout(() => {
        const call = peer.call(remotePeerId, userStream.current);
        handleCall(call);
      }, 500);
    }
  });
});

        });

        // Listen for incoming calls
        peer.on('call', call => {
          call.answer(stream);
          handleCall(call);
        });
      } catch (err) {
        console.error('🚨 Init error:', err);
      }
    };

    init();

    return () => {
      if (peerInstance.current) peerInstance.current.destroy();
      if (socket.current) socket.current.disconnect();
      if (userStream.current) userStream.current.getTracks().forEach(track => track.stop());
      // eslint-disable-next-line react-hooks/exhaustive-deps
      Object.values(peers.current).forEach(call => call.close());
    };
  }, [roomId]);

  const handleCall = (call) => {
    if (peers.current[call.peer]) return;

    peers.current[call.peer] = call;

    call.on('stream', remoteStream => {
      setRemoteStreams(prev => {
        if (prev[call.peer]) return prev;
        return { ...prev, [call.peer]: remoteStream };
      });
    });

    call.on('close', () => {
      setRemoteStreams(prev => {
        const updated = { ...prev };
        delete updated[call.peer];
        return updated;
      });
      delete peers.current[call.peer];
    });
  };

  const leaveRoom = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex justify-between items-center bg-gray-900">
        <div className="text-lg font-bold">Phòng: {roomId}</div>
        <button
          onClick={leaveRoom}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
        >
          Rời phòng
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-6">
        {/* Local Video */}
        <div className="relative bg-gray-800 rounded overflow-hidden">
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
            Bạn (ID: {peerId.slice(0, 6)})
          </div>
        </div>

        {/* Remote Videos */}
        {Object.entries(remoteStreams).map(([id, stream]) => (
          <div key={id} className="relative bg-gray-800 rounded overflow-hidden">
            <video
              autoPlay
              playsInline
              ref={(video) => {
                if (video && !video.srcObject) {
                  video.srcObject = stream;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded">
              Khách (ID: {id.slice(0, 6)})
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoCallRoom;
