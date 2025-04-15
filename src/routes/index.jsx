import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';

// routes
import AuthenticationRoutes from './AuthenticationRoutes';
import LoginRoutes from './LoginRoutes';
import MainRoutes from './MainRoutes';
import Loadable from 'ui-component/Loadable';
import SimpleRoutes from './SimpleRoutes';

// ==============================|| ROUTING RENDER ||============================== //
const PagesLanding = Loadable(lazy(() => import('views/pages/landing')));

const router = createBrowserRouter(
  [{ path: '/', element: <PagesLanding /> }, LoginRoutes, SimpleRoutes, MainRoutes, AuthenticationRoutes],
  {
    basename: import.meta.env.VITE_APP_BASE_NAME
  }
);

export default router;
