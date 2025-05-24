import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from '../pages/Form/RegisterForm';
import LoginForm from '../pages/Form/LoginForm';
import HomePage from '../pages//Home/HomePage';
import ForumPage from '../pages/Forum/ForumPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import PrivateRouteAdmin from './PrivateRouteAdmin';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManagePosts from '../pages/Admin/ManagePosts';
import Post from '../pages/Forum/Post';
import Group from '../pages/Forum/Group';
import MessagePage from '../pages/Message/MessagePage';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/forum" element={<ForumPage />}>
        <Route index element={<Navigate to="post" replace />} />
        <Route path="post" element={<Post />} />
        <Route path="group" element={<Group />} />
      </Route>
      <Route path="/message" element={<MessagePage />} />
      <Route
        path="/admin"
        element={
          <PrivateRouteAdmin>
            <AdminDashboard />
          </PrivateRouteAdmin>
        }
      >
        <Route path="users" element={<ManageUsers />} />
        <Route path="posts" element={<ManagePosts />} />
      </Route>
    </Routes>
  </Router>
);

export default AppRouter;
