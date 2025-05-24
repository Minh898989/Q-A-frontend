import React, { useEffect, useState } from 'react';
import { Table, Tag, Select, message, Spin,Popconfirm, Button  } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roleChangingUserId, setRoleChangingUserId] = useState(null);
  const [deletingUserId, setDeletingUserId] = useState(null);
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3009/api/users');
      const userData = res?.data?.data;

      if (!Array.isArray(userData)) {
        throw new Error('Invalid data format');
      }

      setUsers(userData);
    } catch (err) {
      console.error('Fetch error:', err);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
  setRoleChangingUserId(userId);
  try {
    await axios.patch(`http://localhost:3009/api/users/${userId}/role`, { role: newRole });
    message.success("Cập nhật vai trò thành công");
    fetchUsers();
  } catch (err) {
    if (err.response?.status === 403) {
      message.warning(err.response.data?.message || "Không được phép thay đổi vai trò");
    } else if (err.response?.status === 400) {
      message.error("Vai trò không hợp lệ");
    } else {
      message.error("Lỗi khi cập nhật vai trò");
    }
  } finally {
    setRoleChangingUserId(null);
  }
};
const handleDeleteUser = async (userId) => {
    setDeletingUserId(userId);
    try {
      await axios.delete(`http://localhost:3009/api/users/${userId}`);
      message.success("Xóa người dùng thành công");
      fetchUsers();
    } catch (err) {
      message.error("Lỗi khi xóa người dùng");
    } finally {
      setDeletingUserId(null);
    }
  };



  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
   {
  title: 'Vai trò',
  key: 'role',
  render: (_, record) => {
  const isAdmin = record.role === 'admin';

  return (
    <Select
      value={record.role}
      disabled={isAdmin}
      loading={roleChangingUserId === record.id}
      onChange={(value) => handleRoleChange(record.id, value)}
      style={{ width: 140 }}
    >
      <Option value="student">Student</Option>
      <Option value="lecturer">Lecturer</Option>
    </Select>
  );
}

},

    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (active) =>
        active ? (
          <Tag color="green">Đang hoạt động</Tag>
        ) : (
          <Tag color="red">Vô hiệu</Tag>
        ),
    },
    {
  title: 'Hành động',
  key: 'action',
  render: (_, record) => {
    if (record.role === 'admin') {
      return <span style={{ color: 'gray' }}>Không thể xóa admin</span>;
    }

    return (
      <Popconfirm
        title="Bạn có chắc muốn xóa người dùng này?"
        onConfirm={() => handleDeleteUser(record.id)}
        okText="Xóa"
        cancelText="Hủy"
      >
        <Button
          type="primary"
          danger
          loading={deletingUserId === record.id}
        >
          Xóa
        </Button>
      </Popconfirm>
    );
  },
}

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
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default UsersManagement;