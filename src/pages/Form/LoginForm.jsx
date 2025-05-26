import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3009/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Đăng nhập thất bại!');
        return;
      }

      const token = data.token;
      localStorage.setItem('token', token);

      const profileRes = await fetch('http://localhost:3009/api/auth/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const profileData = await profileRes.json();

      if (!profileRes.ok) {
        alert(profileData.message || 'Không lấy được thông tin người dùng!');
        return;
      }

      const user = profileData.data;
      const name = user?.name || '';
      const role = user?.role || '';

      localStorage.setItem('username', name);
      localStorage.setItem('role', role);

      toast.success('Đăng nhập thành công!');
      setTimeout(() => navigate('/'), 1500);

      if (role === 'admin') {
        setTimeout(() => navigate('/admin'), 1500);
      } else {
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      console.error(err);
      toast.error('Lỗi kết nối đến server.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-royalblue">Đăng nhập</h2>

        <LabelInputTop label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <LabelInputTop label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <div className="text-right">
          <Link to="/forgot-password" className="text-sm text-royalblue hover:underline">
            Quên mật khẩu?
          </Link>
        </div>


        <button type="submit" className="bg-royalblue hover:bg-blue-700 text-white py-2 rounded-lg text-lg">Đăng nhập</button>

        <p className="text-sm text-center text-gray-600">
          Chưa có tài khoản? <Link to="/register" className="text-royalblue hover:underline">Đăng ký</Link>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

const LabelInputTop = ({ label, type, value, onChange }) => {
  const id = label.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-700 font-medium">{label}</label>
      <input
        required
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none leading-6 focus:border-royalblue focus:ring-1 focus:ring-royalblue"
      />
    </div>
  );
};

export default LoginForm;