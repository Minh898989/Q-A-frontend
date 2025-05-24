import React from 'react';
import { Layout, Menu, Button, message } from 'antd';
import {FileTextOutlined,UserOutlined,LogoutOutlined,} from '@ant-design/icons';
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
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sider breakpoint="lg" collapsedWidth="0" style={{ background: '#fff' }}>
        <div className="logo" style={{ padding: '20px', textAlign: 'center' }}>
          <h2 style={{ fontWeight: 'bold', color: '#1890ff' }}>Admin Panel</h2>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          style={{ borderRight: 0 }}
        >
          <Menu.Item key="/admin/posts" icon={<FileTextOutlined />}>
            <Link to="/admin/posts">Quản lý bài viết</Link>
          </Menu.Item>
          <Menu.Item key="/admin/users" icon={<UserOutlined />}>
            <Link to="/admin/users">Quản lý người dùng</Link>
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
          }}
        >
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            danger
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </Header>

        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;