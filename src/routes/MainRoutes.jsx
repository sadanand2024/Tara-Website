import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardPersonal = Loadable(lazy(() => import('views/dashboard/Personal')));
const DashboardBusiness = Loadable(lazy(() => import('views/dashboard/Business')));
const MyServices = Loadable(lazy(() => import('views/Services')));
const ITRSummary = Loadable(lazy(() => import('views/Services/ITRSummary.jsx')));

// application - user social & account profile routing
const AppUserAccountProfile2 = Loadable(lazy(() => import('views/application/users/Profile')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      <MainLayout />
    </AuthGuard>
  ),
  children: [
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/dashboard/default',
      element: <DashboardDefault />
    },
    {
      path: '/dashboard/personal',
      element: <DashboardPersonal />
    },
    {
      path: '/dashboard/business',
      element: <DashboardBusiness />
    },
    {
      path: '/apps/user/profile',
      element: <AppUserAccountProfile2 />
    },
    {
      path: '/app/my-services',
      element: <MyServices />
    },
    {
      path: '/app/my-services/itr-summary',
      element: <ITRSummary />
    }
  ]
};

export default MainRoutes;
