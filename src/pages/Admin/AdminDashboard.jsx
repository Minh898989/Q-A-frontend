import React from 'react';
import { Layout, Menu, Button, message, } from 'antd';
import {
  FileTextOutlined,
  UserOutlined,
  LogoutOutlined,
  LockOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const { Sider, Content, Header } = Layout;

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    message.success('Đã đăng xuất');
    navigate('/login');
  };

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#C9E2FF' }}>
      {/* Sidebar */}
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          background: 'linear-gradient(to bottom right, #ffffff, #C9E2FF)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
        }}
      >
        <div className="logo" style={{ padding: '20px', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 'bold', color: '#4C6EF5', margin: 0 }}>
            🎓 UniAdmin
          </h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{
            borderRight: 0,
            backgroundColor: '#fff',
            fontWeight: '500',
            borderRadius: '12px',
          }}
        >
          <Menu.Item
            key="/admin/posts"
            icon={<FileTextOutlined />}
            style={{ borderRadius: '8px', margin: '4px 8px' }}
          >
            <Link to="/admin/posts">Quản lý bài viết</Link>
          </Menu.Item>
          <Menu.Item
            key="/admin/users"
            icon={<UserOutlined />}
            style={{ borderRadius: '8px', margin: '4px 8px' }}
          >
            <Link to="/admin/users">Quản lý người dùng</Link>
          </Menu.Item>
          <Menu.Item
            key="/admin/lock"
            icon={<LockOutlined/>}
            style={{ borderRadius: '8px', margin: '4px 8px' }}
          >
            <Link to="/admin/lock">Cấp lại mật khẩu </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            style={{
              backgroundColor: '#4C6EF5',
              borderColor: '#4C6EF5',
              borderRadius: '8px',
              fontWeight: 'bold',
            }}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
