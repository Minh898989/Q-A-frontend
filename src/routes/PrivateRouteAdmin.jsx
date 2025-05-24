import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteAdmin = ({ children }) => {
  const role = localStorage.getItem('role');
  return role === 'admin' ? children : <Navigate to="/" />;
};

export default PrivateRouteAdmin;