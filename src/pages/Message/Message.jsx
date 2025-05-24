import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from './ChatBox';

export default function FriendSearch() {
  const [tab, setTab] = useState("search"); // search | requests | friends
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [friendList, setFriendList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [incomingCount, setIncomingCount] = useState(0);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const fetchCurrentUserId = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3009/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCurrentUserId(response.data.data.id);
      } catch (error) {
        console.error("Lỗi khi lấy profile:", error);
      }
    };
    fetchCurrentUserId();
  }, []);
  const fetchIncomingCount = async () => {
  try {
    const res = await axios.get(`http://localhost:3009/api/friend/incoming-count/${currentUserId}`);
    setIncomingCount(res.data.count);
  } catch (err) {
    console.error("Lỗi lấy số lượng lời mời:", err);
  }
};
const fetchUnreadCounts = async () => {
  try {
    const res = await axios.get(`http://localhost:3009/api/messages/unread/${currentUserId}`);
    const countMap = {};
    res.data.forEach((item) => {
      countMap[item.sender_id] = item.unread_count;
    });
    setUnreadCounts(countMap);
  } catch (err) {
    console.error("Lỗi lấy số tin nhắn chưa đọc:", err);
  }
};
 const fetchTotalUnread = async () => {
  try {
    const res = await axios.get(`http://localhost:3009/api/messages/unread/total/${currentUserId}`);
    setTotalUnread(res.data.totalUnread);
  } catch (err) {
    console.error("Lỗi lấy tổng tin nhắn chưa đọc:", err);
  }
};




  useEffect(() => {
    if (!currentUserId) return;

    if (tab === "search") {
      if (query.trim()) handleSearch();
      else setResults([]);
    } else if (tab === "requests") {
      fetchIncomingRequests();
    } else if (tab === "friends") {
      fetchFriendList();
      fetchUnreadCounts();
      fetchTotalUnread(); 
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, tab, currentUserId]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3009/api/friend/search", {
        params: { query, userId: currentUserId },
      });
      setResults(res.data);
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    } finally {
      setLoading(false);
    }
  };
  
  const sendFriendRequest = async (receiverId) => {
    try {
      await axios.post("http://localhost:3009/api/friend/request", {
        senderId: currentUserId,
        receiverId,
      });
      handleSearch();
    } catch (err) {
      console.error("Lỗi gửi lời mời:", err.response?.data?.message);
    }
  };

  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get(`http://localhost:3009/api/friend/incoming/${currentUserId}`);
      setIncomingRequests(res.data);
    } catch (err) {
      console.error("Lỗi lấy lời mời đến:", err);
    }
  };
  useEffect(() => {
  if (currentUserId) {
    fetchIncomingCount(currentUserId);
    fetchTotalUnread();
  }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentUserId]);

  const respondToRequest = async (requestId, status) => {
    try {
      await axios.post(`http://localhost:3009/api/friend/respond`, {
        requestId,
        status,
      });
      fetchIncomingRequests();
      fetchIncomingCount(); 
    } catch (err) {
      console.error("Lỗi phản hồi:", err);
    }
  };

  const fetchFriendList = async () => {
    try {
      const res = await axios.get(`http://localhost:3009/api/friend/list/${currentUserId}`);
      setFriendList(res.data);
    } catch (err) {
      console.error("Lỗi lấy danh sách bạn:", err);
    }
  };
 

  return (
    <div className="flex min-h-screen bg-white text-black">
      {/* Sidebar */}
      <div className="w-[350px] p-4 bg-gray-50 rounded-lg shadow-sm">

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <span role="img" aria-label="friend">🧑‍🤝‍🧑</span> Quản lý bạn bè
        </h2>

        {/* Tabs */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setTab("search")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${tab === "search"
              ? "bg-blue-100 text-blue-700"
              : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            🔍 Tìm bạn bè
          </button>

          {tab === "search" && (
            <div className="mt-2">
              <input
                type="text"
                placeholder="Nhập tên người dùng..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 leading-normal"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {loading && <p className="mt-4 text-gray-500">Đang tìm kiếm...</p>}
              {!loading && query.trim() && results.length === 0 && (
                <p className="mt-4 text-gray-500 italic">Không tìm thấy người dùng phù hợp.</p>
              )}
              <div className="mt-4 space-y-3">
                {results.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-blue-100 cursor-pointer transition min-h-[64px]"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avt?.trim() ? user.avt : "/default-avatar.png"}
                        alt="avatar"
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">
                          {user.isFriend
                            ? "Đã là bạn"
                            : user.isPending
                              ? "Đang chờ xác nhận"
                              : "Chưa kết bạn"}
                        </p>
                      </div>
                    </div>
                    {!user.isFriend && !user.isPending ? (
                      <button
                        onClick={() => sendFriendRequest(user.id)}
                        className="text-sm bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600"
                      >
                        Kết bạn
                      </button>
                    ) : (
                      <span
                        className={`text-sm font-medium ${user.isFriend ? "text-green-600" : "text-yellow-500"
                          }`}
                      >
                        {user.isFriend ? "✓ Đã là bạn" : "⏳ Đang chờ"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
  onClick={() => setTab("requests")}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${tab === "requests"
    ? "bg-yellow-100 text-yellow-700"
    : "hover:bg-gray-100 text-gray-700"
    }`}
>
  🤝 Lời mời đến
  {incomingCount > 0 && (
    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {incomingCount}
    </span>
  )}
</button>


          {tab === "requests" && (
            <div className="mt-2 space-y-3">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-green-50 transition"
                >
                  {/* Tên trên - avatar dưới */}
                  <div className="flex flex-col items-center gap-1 w-24">
                    <p className="font-medium text-center">{req.name}</p>
                    <img
                      src={req.avt?.trim() ? req.avt : "/default-avatar.png"}
                      alt="avatar"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => respondToRequest(req.id, "accepted")}
                      className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Chấp nhận
                    </button>
                    <button
                      onClick={() => respondToRequest(req.id, "rejected")}
                      className="text-sm bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}

            </div>
          )}

          <button
  onClick={() => setTab("friends")}
  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition font-medium ${tab === "friends"
    ? "bg-green-100 text-green-700"
    : "hover:bg-gray-100 text-gray-700"
    }`}
>
  📋 Danh sách bạn bè
  {totalUnread > 0 && (
    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
      {totalUnread}
    </span>
  )}
</button>


          {tab === "friends" && (
            <div className="mt-2 space-y-3">
             {friendList.length === 0 ? (
  <p className="text-gray-500 italic">Chưa có bạn bè.</p>
) : (
  friendList.map((friend) => (
    <div
      key={friend.id}
      className="flex items-center justify-between px-4 py-2 rounded-lg hover:bg-blue-50 cursor-pointer transition min-h-[64px]"
      onClick={() => setSelectedFriend(friend)}
    >
      <div className="flex items-center gap-3">
        <img
          src={friend.avt?.trim() ? friend.avt : "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <p className="font-medium">{friend.name}</p>
          <p className="text-sm text-gray-500">Bạn bè</p>
        </div>
      </div>

      {unreadCounts[friend.id] > 0 && (
        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
          {unreadCounts[friend.id]}
        </span>
      )}
    </div>
  ))
)}

            </div>
          )}
        </div>
      </div>

      {/* Content right (tạm thời trống) */}
      {/* Content right */}
      <div className="flex-1 bg-white p-6">
        {tab === "friends" && selectedFriend ? (
          <ChatBox
  friend={selectedFriend}
  currentUserId={currentUserId}
  onMarkedAsRead={() => {
    fetchUnreadCounts();
    fetchTotalUnread();
  }}
/>

        ) : (
          <div className="text-gray-400 italic">
            {tab === "friends"
              ? "Chọn một người bạn để bắt đầu trò chuyện."
              : "Chọn một tab để quản lý bạn bè..."}
          </div>
        )}
      </div>

    </div>
  );
}
