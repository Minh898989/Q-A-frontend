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
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3009/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userId = String(res.data.data.id);
        setPeerId(userId);

        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        userStream.current = stream;
        if (localVideoRef.current) localVideoRef.current.srcObject = stream;

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

  const allStreams = [
    { id: peerId, stream: userStream.current, isLocal: true },
    ...Object.entries(remoteStreams).map(([id, stream]) => ({ id, stream }))
  ].slice(0, 4); // optional limit to 4 users

  const gridStyle = (() => {
    const count = allStreams.length;
    if (count === 1) return 'grid-cols-1 grid-rows-1';
    if (count === 2) return 'grid-cols-2 grid-rows-1';
    if (count <= 4) return 'grid-cols-2 grid-rows-2';
    return 'grid-cols-3 grid-rows-2'; // fallback if >4
  })();
 

  


  

  return (
    <div className="min-h-screen bg-black text-white flex flex-col"
     >
      {/* Header */}
      <div className="p-4 flex justify-between items-center bg-gray-900">
        <div className="text-lg font-bold">Phòng: {roomId}</div>
        <button
          onClick={leaveRoom}
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-medium"
        >
          Rời phòng
        </button>
      </div>

      {/* Video Grid */}
      <div className={`grid ${gridStyle} gap-2 flex-1 overflow-auto max-h-screen p-2`}>
        {allStreams.map(({ id, stream, isLocal }) => (
          <div key={id} className="relative bg-gray-800 rounded overflow-hidden">
            <video
              id={`video-${id}`}
              autoPlay
              playsInline
              muted={isLocal}

              ref={(video) => {
                if (video && stream && video.srcObject !== stream) {
                  video.srcObject = stream;
                }
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 px-2 py-1 rounded text-sm">
              {isLocal ? `Bạn (ID: ${id.slice(0, 6)})` : `Khách (ID: ${id.slice(0, 6)})`}
            </div>
          </div>
        ))}
      </div>
      

    </div>
  );
};

export default VideoCallRoom;
