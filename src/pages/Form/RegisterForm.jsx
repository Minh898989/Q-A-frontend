import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3009/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: form.fullname,
          email: form.email,
          password_hash: form.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || 'Đăng ký thất bại!');
        return;
      }

      toast.success('Đăng ký thành công! Vui lòng đăng nhập.');
      setTimeout(() => navigate('/login'), 2000); // đợi 2s để hiển thị toast
    } catch (error) {
      console.error('Lỗi khi đăng ký:', error);
      toast.error('Đã xảy ra lỗi khi gửi yêu cầu đăng ký.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full bg-white p-6 rounded-2xl shadow-md"
      >
        <div className="relative">
          <h2 className="text-[28px] text-royalblue font-semibold pl-7 relative">
            Đăng ký
            <span className="absolute left-0 top-1.5 w-[18px] h-[18px] bg-royalblue rounded-full" />
            <span className="absolute left-0 top-1.5 w-[18px] h-[18px] bg-royalblue rounded-full animate-ping" />
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Đăng ký để bắt đầu sử dụng ứng dụng.
          </p>
        </div>

        <LabelInputTop
          label="Họ và tên"
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
        />
        <LabelInputTop
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />
        <LabelInputTop
          label="Mật khẩu"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />
        <LabelInputTop
          label="Xác nhận mật khẩu"
          type="password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-royalblue hover:bg-blue-700 text-white py-2 rounded-lg text-lg"
        >
          Đăng ký
        </button>

        <p className="text-sm text-center text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-royalblue hover:underline">
            Đăng nhập
          </Link>
        </p>
      </form>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
};

const LabelInputTop = ({ label, type, name, value, onChange }) => {
  const id = name;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm text-gray-700 font-medium">
        {label}
      </label>
      <input
        required
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md outline-none leading-6 focus:border-royalblue focus:ring-1 focus:ring-royalblue"
      />
    </div>
  );
};

export default RegisterForm;