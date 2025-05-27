import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import RegisterForm from '../pages/Form/RegisterForm';
import GoogleAuthHandler from '../pages/Form/GoogleAuthHandler';
import LoginForm from '../pages/Form/LoginForm';
import ForgotPassword from '../pages/Form/ForgotPassword';
import HomePage from '../pages//Home/HomePage';
import ForumPage from '../pages/Forum/ForumPage';
import AdminDashboard from '../pages/Admin/AdminDashboard';
import PrivateRouteAdmin from './PrivateRouteAdmin';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManagePosts from '../pages/Admin/ManagePosts';
import ResetPassword from '../pages/Admin/ResetPassword';
import Post from '../pages/Forum/Post';
import Group from '../pages/Forum/Group';
import MessagePage from '../pages/Message/MessagePage';
import VideoCallRoom from '../pages/Message/VideoCallRoom'; // Đường dẫn này chỉnh lại theo đúng project bạn

;

const AppRouter = () => (

  <Router>
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/google-auth" element={<GoogleAuthHandler />} />

      <Route path="/" element={<HomePage />} />
      <Route path="/forum" element={<ForumPage />}>
        <Route index element={<Navigate to="post" replace />} />
        <Route path="post" element={<Post />} />
        <Route path="group" element={<Group />} />
      </Route>
      <Route path="/message" element={<MessagePage />} />
      <Route path="/video-call/:roomId" element={<VideoCallRoom />} />
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
        <Route path="lock" element={< ResetPassword/>} />
      </Route>
    </Routes>
    
  </Router>

);

export default AppRouter;
