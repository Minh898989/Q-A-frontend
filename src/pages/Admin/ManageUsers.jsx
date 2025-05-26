import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Select,
  message,
  Spin,
  Popconfirm,
  Button,
  Space,
} from 'antd';
import axios from 'axios';

const { Option } = Select;

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState({
    role: null,
    delete: null,
    lock: null,
  });

  // Fetch user list
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3009/api/users');
      const userData = res?.data?.data;
      if (!Array.isArray(userData)) throw new Error('Invalid user data');
      setUsers(userData);
    } catch (err) {
      console.error(err);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Local update
  const updateUser = (userId, updates) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...updates } : u))
    );
  };

  // Handle role change
  const handleRoleChange = async (userId, role) => {
    setActionLoading((prev) => ({ ...prev, role: userId }));
    try {
      await axios.patch(`http://localhost:3009/api/users/${userId}/role`, {
        role,
      });
      message.success('Đã cập nhật vai trò');
      updateUser(userId, { role });
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Lỗi khi thay đổi vai trò người dùng';
      message.error(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, role: null }));
    }
  };

  // Handle delete
  const handleDeleteUser = async (userId) => {
    setActionLoading((prev) => ({ ...prev, delete: userId }));
    try {
      await axios.delete(`http://localhost:3009/api/users/${userId}`);
      message.success('Đã xóa người dùng');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      message.error('Lỗi khi xóa người dùng');
    } finally {
      setActionLoading((prev) => ({ ...prev, delete: null }));
    }
  };

  // Handle lock/unlock
  const handleLockToggle = async (userId, shouldLock) => {
    setActionLoading((prev) => ({ ...prev, lock: userId }));
    try {
      const token = localStorage.getItem('token');
      const endpoint = shouldLock ? 'lock-user' : 'unlock-user';
      await axios.patch(
        `http://localhost:3009/api/admin/${endpoint}`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      message.success(shouldLock ? 'Đã khóa tài khoản' : 'Đã mở khóa tài khoản');
      updateUser(userId, { isLock: shouldLock });
    } catch (err) {
      const msg =
        err.response?.data?.message || 'Lỗi khi thay đổi trạng thái tài khoản';
      message.error(msg);
    } finally {
      setActionLoading((prev) => ({ ...prev, lock: null }));
    }
  };

  // Table columns
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Vai trò',
      key: 'role',
      render: (_, record) => (
        <Select
          value={record.role}
          disabled={record.role === 'admin'}
          style={{ width: 140 }}
          loading={actionLoading.role === record.id}
          onChange={(val) => handleRoleChange(record.id, val)}
        >
          <Option value="student">Student</Option>
          <Option value="lecturer">Lecturer</Option>
        </Select>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isLock',
      render: (isLock) =>
        isLock ? (
          <Tag color="red">Đã khóa</Tag>
        ) : (
          <Tag color="green">Đang hoạt động</Tag>
        ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => {
        const isAdmin = record.role === 'admin';
        const isLocked = record.isLock;

        if (isAdmin) {
          return <span style={{ color: 'gray' }}>Không thể thao tác</span>;
        }

        return (
          <Space>
            <Popconfirm
              title="Bạn có chắc muốn xóa người dùng này?"
              onConfirm={() => handleDeleteUser(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button
                danger
                type="primary"
                loading={actionLoading.delete === record.id}
              >
                Xóa
              </Button>
            </Popconfirm>

            <Button
              style={{ width: 90 }}
              type={isLocked ? 'dashed' : 'default'}
              loading={actionLoading.lock === record.id}
              onClick={() => handleLockToggle(record.id, !isLocked)}
            >
              {isLocked ? 'Mở khóa' : 'Khóa'}
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Quản lý người dùng</h2>
      {loading ? (
        <Spin tip="Đang tải người dùng..." />
      ) : (
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={{ pageSize: 6 }}
        />
      )}
    </div>
  );
};

export default UsersManagement;
