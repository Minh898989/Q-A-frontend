import React, { useState } from "react";
import { GrEdit, GrCheckmark, GrClose } from "react-icons/gr";
import { FaKey } from "react-icons/fa";
import { toast } from "react-toastify";
import { MdWork, MdCalendarToday, MdCheckCircle, MdCancel } from "react-icons/md";

export default function ProfileModal({ detailedUser, setShowProfileModal, setUser, setDetailedUser  }) {
    const [editingName, setEditingName] = useState(false);
    const [newName, setNewName] = useState("");
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [, setIsUploading] = useState(false);

    const handleUpdateName = async () => {
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`http://localhost:3009/api/users/${detailedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ name: newName }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Tên đã được cập nhật!", { autoClose: 1000 });
                setDetailedUser(data.data);
                setUser(data.data);
                setEditingName(false);
            } else {
                toast.error(data.message || "Cập nhật thất bại", { autoClose: 1000 });
            }
        } catch (err) {
            console.error("Lỗi khi cập nhật tên:", err);
            toast.error("Đã xảy ra lỗi.", { autoClose: 1000 });
        }
    };

    const handleChangePassword = async () => {
        const token = localStorage.getItem("token");

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.error("Vui lòng nhập đầy đủ thông tin.", { autoClose: 1000 });
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới không khớp.", { autoClose: 1000 });
            return;
        }

        try {
            const loginRes = await fetch("http://localhost:3009/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: detailedUser.email,
                    password: currentPassword,
                }),
            });

            if (!loginRes.ok) {
                toast.error("Mật khẩu hiện tại không đúng.", { autoClose: 1000 });
                return;
            }

            const res = await fetch(`http://localhost:3009/api/users/${detailedUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ password_hash: newPassword }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Đổi mật khẩu thành công!", { autoClose: 1000 });
                setShowChangePassword(false);
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.error(data.message || "Đổi mật khẩu thất bại", { autoClose: 1000 });
            }
        } catch (err) {
            console.error("Lỗi khi đổi mật khẩu:", err);
            toast.error("Đã xảy ra lỗi.", { autoClose: 1000 });
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);
        const token = localStorage.getItem("token");

        setIsUploading(true);

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
                setDetailedUser(result.data);
                toast.success("Cập nhật ảnh đại diện thành công!", { autoClose: 1000 });
            } else {
                toast.error(result.message || "Upload thất bại", { autoClose: 1000 });
            }
        } catch (error) {
            console.error("Lỗi upload:", error);
            toast.error("Lỗi khi upload ảnh", { autoClose: 1000 });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">

                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl"
                    onClick={() => setShowProfileModal(false)}
                >
                    ✕
                </button>

                <div className="flex flex-col items-center text-center space-y-3">

                    <div className="relative">
                        <img
                            src={detailedUser.avt || "/default-avatar.png"}
                            alt="avatar"
                            className="w-24 h-24 rounded-full object-cover border-4 border-blue-400 shadow"
                        />
                        <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer text-xs hover:bg-blue-600">
                            ✎
                            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                    </div>

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
                                <div className="flex items-center gap-2">
                                    <h2 className="text-xl font-bold text-blue-700">{detailedUser.name}</h2>
                                    <button
                                        onClick={() => {
                                            setEditingName(true);
                                            setNewName(detailedUser.name);
                                        }}
                                        title="Sửa tên"
                                        className="-translate-y-0.5"
                                    >
                                        <GrEdit className="text-blue-500 hover:text-blue-700" />
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    <p className="text-sm text-gray-600">{detailedUser.email}</p>

                    <div className="w-full mt-4 space-y-2 text-left text-sm text-gray-700 px-4">
                        <div className="flex items-center gap-2">
                            <MdWork size={20} className="text-blue-500" />
                            <span><strong>Vai trò:</strong> {detailedUser.role}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MdCalendarToday size={20} className="text-purple-500" />
                            <span><strong>Ngày tạo:</strong> {new Date(detailedUser.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {detailedUser.is_active ? (
                                <MdCheckCircle size={20} className="text-green-500" />
                            ) : (
                                <MdCancel size={20} className="text-red-500" />
                            )}
                            <span>
                                <strong>Trạng thái:</strong>{" "}
                                <span className={detailedUser.is_active ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                                    {detailedUser.is_active ? "Đang hoạt động" : "Bị khóa"}
                                </span>
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => setShowChangePassword(!showChangePassword)}
                        className="text-sm text-blue-600 hover:text-blue-800 mt-3 flex items-center gap-1"
                    >
                        <FaKey /> Đổi mật khẩu
                    </button>

                    {showChangePassword && (
                        <div className="mt-2 space-y-2 w-full">
                            <input
                                type="password"
                                placeholder="Mật khẩu hiện tại"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="Mật khẩu mới"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <input
                                type="password"
                                placeholder="Xác nhận mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                            />
                            <button
                                onClick={handleChangePassword}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                            >
                                Cập nhật mật khẩu
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
