import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GrLogout,GrEdit, GrCheckmark, GrClose,  } from "react-icons/gr";
import { FaKey,  FaCheckCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import { io } from "socket.io-client";

export default function Header() {
  const [user, setUser] = useState(null);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [detailedUser, setDetailedUser] = useState(null);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const socketRef = useRef(null);

  const isHomeActive = location.pathname === "/";
  const isForumActive = location.pathname.startsWith("/forum");
  const isMessageActive = location.pathname.startsWith("/message");

  // Fetch profile
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://localhost:3009/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (res.ok && data?.data) {
          setUser(data.data);
        } else {
          console.warn("Lỗi khi lấy profile:", data.message);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API profile:", error);
      }
    };

    fetchProfile();
  }, []);

  // Fetch total notifications
  const fetchNotifications = async (userId) => {
    try {
      const res = await fetch(`http://localhost:3009/api/total/${userId}`);
      const data = await res.json();
      setTotalNotifications(data.totalNotifications || 0);
      
    } catch (err) {
      console.error("Lỗi khi lấy tổng thông báo:", err);
    }
  };

  // Setup socket when user is loaded
  useEffect(() => {
    if (!user?.id) return;

    // Kết nối socket chỉ 1 lần
    socketRef.current = io("http://localhost:3009", {
  transports: ["websocket"],
});

    const socket = socketRef.current;

    socket.emit("joinNotificationRoom", user.id);
    socket.on("notificationUpdate", () => {
      fetchNotifications(user.id);
    });

    fetchNotifications(user.id);

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:3009/api/auth/upload-avatar", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        setUser(result.data);
        toast.success("Cập nhật ảnh đại diện thành công!");
      } else {
        toast.error(result.message || "Upload thất bại");
      }
    } catch (error) {
      console.error("Lỗi upload:", error);
      toast.error("Lỗi khi upload ảnh");
    }
  };
  const fetchUserDetails = async () => {
  if (!user?.id) return;

  try {
    const res = await fetch(`http://localhost:3009/api/users/${user.id}`);
    const data = await res.json();

    if (res.ok) {
      const detailed = {
        ...data.data,
        isLecturer: data.data.role === "lecturer", // ✅ Thêm flag
      };

      setDetailedUser(detailed);
      setShowProfileModal(true);
    } else {
      toast.error("Không thể tải thông tin người dùng.");
    }
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết user:", error);
    toast.error("Đã xảy ra lỗi.");
  }
};

const handleUpdateName = async () => {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`http://localhost:3009/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    });

    const data = await res.json();
    
    if (res.ok) {
      toast.success("Tên đã được cập nhật!");
      setDetailedUser(data.data);
      setUser(data.data);
      setEditingName(false);
    } else {
      toast.error(data.message || "Cập nhật thất bại");
    }
  } catch (err) {
    console.error("Lỗi khi cập nhật tên:", err);
    toast.error("Đã xảy ra lỗi.");
  }
};
const handleChangePassword = async () => {
  const token = localStorage.getItem("token");

  if (!currentPassword || !newPassword || !confirmPassword) {
    toast.error("Vui lòng nhập đầy đủ thông tin.");
    return;
  }

  if (newPassword !== confirmPassword) {
    toast.error("Mật khẩu mới không khớp.");
    return;
  }

  try {
    // Bước 1: Xác thực lại mật khẩu hiện tại bằng email
    const loginRes = await fetch("http://localhost:3009/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email, // dùng email thay vì username
        password: currentPassword,
      }),
    });

    if (!loginRes.ok) {
      toast.error("Mật khẩu hiện tại không đúng.");
      return;
    }

    // Bước 2: Gửi yêu cầu đổi mật khẩu
    const res = await fetch(`http://localhost:3009/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password_hash: newPassword }),
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Đổi mật khẩu thành công!");
      setShowChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(data.message || "Đổi mật khẩu thất bại");
    }
  } catch (err) {
    console.error("Lỗi khi đổi mật khẩu:", err);
    toast.error("Đã xảy ra lỗi.");
  }
};


  return (
    <>
    <header className="bg-white bg-opacity-90 backdrop-blur-sm shadow-md sticky top-0 z-50 font-varela">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center space-x-3 group">
          <div className="bg-blue-100 rounded-full p-2 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" strokeWidth={1.5} stroke="#3b82f6"
              className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5zm0 0v6.5m0 0h5m-5 0H7" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-wide text-blue-700 select-none">UniTalk</span>
        </a>

        <nav className="hidden md:flex space-x-8 font-medium text-blue-600">
          <Link to="/" className={`relative group px-1 py-2 transition-colors duration-300 hover:text-blue-400 ${isHomeActive ? "text-blue-400" : ""}`}>
            Trang chủ
            <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${isHomeActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
          </Link>

          <Link to="/forum" className={`relative group px-1 py-2 transition-colors duration-300 hover:text-blue-400 ${isForumActive ? "text-blue-400" : ""}`}>
            Hỏi đáp
            <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${isForumActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
          </Link>

          <Link to="/message" className={`relative group px-1 py-2 transition-colors duration-300 hover:text-blue-400 ${isMessageActive ? "text-blue-400" : ""}`}>
            Tin nhắn
            {totalNotifications > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                {totalNotifications}
              </span>
            )}
            <span className={`absolute left-0 bottom-0 h-0.5 bg-blue-400 transition-all duration-300 ${isMessageActive ? "w-full" : "w-0 group-hover:w-full"}`}></span>
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link to="/login" className="px-5 py-2 rounded-full bg-blue-100 text-blue-700 font-semibold shadow-sm hover:bg-blue-200 transition duration-300">
                Đăng nhập
              </Link>
              <Link to="/register" className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition duration-300">
                Đăng ký
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-blue-500 cursor-pointer" onClick={() => document.getElementById("avatar-upload").click()}>
                  <img src={user.avt || "/default-avatar.png"} alt="avatar" className="w-full h-full object-cover" />
                </div>
                <input type="file" accept="image/*" id="avatar-upload" onChange={handleFileChange} className="hidden" />
              </div>

              <span className="text-blue-700 font-semibold"
                    onClick={fetchUserDetails}>
                Xin chào, <strong>{user.name}</strong>
              </span>
              <GrLogout onClick={handleLogout} style={{ fontSize: "20px", color: "red", cursor: "pointer" }} title="Đăng xuất" />
            </div>
          )}
          
        </div>
      </div>
      
    </header>
    {showProfileModal && detailedUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">

      {/* Nút đóng */}
      <button
        className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
        onClick={() => setShowProfileModal(false)}
      >
        ✕
      </button>

      <div className="flex flex-col items-center text-center space-y-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={detailedUser.avt || "/default-avatar.png"}
            alt="avatar"
            className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow"
          />
          <span
            className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
              detailedUser.is_active ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
        </div>

        {/* Tên + biểu tượng sửa */}
        <div className="flex items-center gap-2">
          {editingName ? (
            <>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button onClick={handleUpdateName} title="Lưu">
                <GrCheckmark className="text-green-600 hover:text-green-800" />

              </button>
              <button
                onClick={() => {
                  setEditingName(false);
                  setNewName("");
                }}
                title="Hủy"
              >
                <GrClose className="text-red-500 hover:text-red-700" />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-blue-700">{detailedUser.name}</h2>
              <button
                onClick={() => {
                  setEditingName(true);
                  setNewName(detailedUser.name);
                }}
                title="Sửa tên"
              >
                <GrEdit className="text-blue-500 hover:text-blue-700" />
              </button>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600">{detailedUser.email}</p>

        {/* Thông tin thêm */}
        <div className="w-full mt-4 space-y-2 text-left text-sm text-gray-700 px-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-500">🎓</span>
            <span><strong>Vai trò:</strong> {detailedUser.role}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-purple-500">📅</span>
            <span><strong>Ngày tạo:</strong> {new Date(detailedUser.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-green-500">🟢</span>
            <span>
              <strong>Trạng thái:</strong>{" "}
              <span className={detailedUser.is_active ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {detailedUser.is_active ? "Đang hoạt động" : "Bị khóa"}
              </span>
            </span>
          </div>
        </div>

        {/* Đổi mật khẩu toggle */}
        <button
          onClick={() => setShowChangePassword(!showChangePassword)}
          className="text-sm text-blue-600 hover:text-blue-800 mt-3 flex items-center gap-1"
        >
          <FaKey /> Đổi mật khẩu
        </button>

        {/* Form đổi mật khẩu */}
        {showChangePassword && (
          <div className="mt-2 space-y-2 w-full">
            <input
  type="password"
  placeholder="Mật khẩu hiện tại"
  value={currentPassword}
  onChange={(e) => setCurrentPassword(e.target.value)}
/>
<input
  type="password"
  placeholder="Mật khẩu mới"
  value={newPassword}
  onChange={(e) => setNewPassword(e.target.value)}
/>
<input
  type="password"
  placeholder="Xác nhận mật khẩu mới"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
/>

            <button
              onClick={handleChangePassword}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 flex items-center justify-center gap-2"
            >
              < FaCheckCircle /> Xác nhận đổi
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
)}


    </>
  );
}
