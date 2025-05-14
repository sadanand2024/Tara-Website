import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

const restrictedRoutes = {
  'not-super-admin': ['/app/contact-us/', '/app/contact-us', '/app/consultation/', '/app/consultation'],
  'corporate-admin': [],
  'charted-accountant-firm': ['/dashboard/user/ca-firms'],
  individual: ['/dashboard/user/indivial']
};

const RoleGuard = ({ children }) => {
  const user = useSelector((state) => state).accountReducer.user;
  const location = useLocation();
  let isSuperAdmin = user.user.is_super_user;
  if (!isSuperAdmin && restrictedRoutes['not-super-admin'].includes(location.pathname))
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
  else return children;
};

export default RoleGuard;
