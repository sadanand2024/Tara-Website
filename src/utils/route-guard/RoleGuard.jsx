import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export const restrictedRoutes = {
  'service-provider': [
    '/dashboard/user/business',
    '/dashboard/user/indivial',
    '/dashboard/user/ca-firms',
    '/dashboard/user/service-providers'
  ],
  'corporate-admin': [],
  'charted-accountant-firm': ['/dashboard/user/ca-firms'],
  individual: ['/dashboard/user/indivial'],
  'super-admin': []
};

const RoleGuard = ({ allowedRoles, children }) => {
  const user = useSelector((state) => state).accountReducer.user;
  const location = useLocation();
  console.log(user);
  if (allowedRoles && !allowedRoles.includes(user?.user_role?.role_type)) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          textAlign: 'center',
          padding: '20px'
        }}
      >
        <h1 style={{ color: '#ff4d4f', marginBottom: '20px' }}>Access Denied</h1>
        <p style={{ fontSize: '18px', color: '#666' }}>You don't have permission to access this URL</p>
      </div>
    );
  }

  return children;
};

export default RoleGuard;

const allowedByRole = (item, user) => {
  if (!user || !user.user_role) return true;
  const role = user.user_role.role_type;
  const restricted = restrictedRoutes[role] || [];
  return !restricted.includes(item.url);
};
