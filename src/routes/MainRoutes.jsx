import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';

// payroll module
const PayrollDashboard = Loadable(lazy(() => import('views/payroll'))); // ✅ works because index.jsx exists

// const EmployeeDashboard = Loadable(lazy(() => import('views/payroll/EmployeeDashboard')));
// const PayrollWorkflows = Loadable(lazy(() => import('views/payroll/PayrollWorkflows')));
const PayrollSettings = Loadable(lazy(() => import('views/payroll/settings')));
// const OrganizationDetails = Loadable(lazy(() => import('views/payroll/settings/OrganizationDetails')));
// const WorkLocation = Loadable(lazy(() => import('views/payroll/settings/WorkLocation')));
// const Departments = Loadable(lazy(() => import('views/payroll/settings/Departments')));
// const Designations = Loadable(lazy(() => import('views/payroll/settings/Designations')));
// const StatutoryComponents = Loadable(lazy(() => import('views/payroll/settings/StatutoryComponents')));
// const SalaryComponents = Loadable(lazy(() => import('views/payroll/settings/SalaryComponents')));
// const SalaryTemplateList = Loadable(lazy(() => import('views/payroll/settings/SalaryTemplateList')));
// const SalaryTemplate = Loadable(lazy(() => import('views/payroll/settings/SalaryTemplate')));
// const PaySchedule = Loadable(lazy(() => import('views/payroll/settings/PaySchedule')));
// const LeaveAttendance = Loadable(lazy(() => import('views/payroll/settings/LeaveAttendance')));
// const BusinessProfileSetup = Loadable(lazy(() => import('views/payroll/settings/BusinessProfileSetup')));
// const EmployeeMaster = Loadable(lazy(() => import('views/payroll/settings/employee-master/Index')));
// const AddEmployee = Loadable(lazy(() => import('views/payroll/settings/employee-master/AddEmployee')));

// invoicing module
const Invoicing = Loadable(lazy(() => import('views/invoicing'))); // ✅ works because index.jsx exists

const Settings = Loadable(lazy(() => import('views/invoicing/InvoiceSettings')));

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardPersonal = Loadable(lazy(() => import('views/dashboard/Personal')));
const DashboardBusiness = Loadable(lazy(() => import('views/dashboard/Business')));
const MyServices = Loadable(lazy(() => import('views/Services')));
const ITRSummary = Loadable(lazy(() => import('views/Services/ITR')));
const ManageUsers = Loadable(lazy(() => import('views/ManageUsers')));
const ManageSubscriptions = Loadable(lazy(() => import('views/ManageSubscriptions')));

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
      path: '/app/my-services/itr-dashboard',
      element: <ITRSummary />
    },
    {
      path: '/app/users',
      element: <ManageUsers />
    },
    {
      path: '/app/subscriptions',
      element: <ManageSubscriptions />
    },
    {
      path: '/app/payroll',
      element: <PayrollDashboard />
    },
    // {
    //   path: '/payroll/employee-dashboard',
    //   element: <EmployeeDashboard />
    // },
    // {
    //   path: '/payroll/payroll-workflows',
    //   element: <PayrollWorkflows />
    // },
    {
      path: '/app/payroll/settings',
      element: <PayrollSettings />
    },
    // {
    //   path: '/payroll/settings/organization-details',
    //   element: <OrganizationDetails />
    // },
    // {
    //   path: '/payroll/settings/work-location',
    //   element: <WorkLocation />
    // },
    // {
    //   path: '/payroll/settings/departments',
    //   element: <Departments />
    // },
    // {
    //   path: '/payroll/settings/designations',
    //   element: <Designations />
    // },
    // {
    //   path: '/payroll/settings/statutory-components',
    //   element: <StatutoryComponents />
    // },
    // {
    //   path: '/payroll/settings/salary-components',
    //   element: <SalaryComponents />
    // },
    // {
    //   path: '/payroll/settings/salary-template-list',
    //   element: <SalaryTemplateList />
    // },
    // {
    //   path: '/payroll/settings/salary-template',
    //   element: <SalaryTemplate />
    // },
    // {
    //   path: '/payroll/settings/pay-schedule',
    //   element: <PaySchedule />
    // },
    // {
    //   path: '/payroll/settings/leave-attendance',
    //   element: <LeaveAttendance />
    // },
    // {
    //   path: '/payroll/settings/business-profile',
    //   element: <BusinessProfileSetup />
    // },
    // {
    //   path: '/payroll/settings/employee-master',
    //   element: <EmployeeMaster />
    // },
    // {
    //   path: '/payroll/settings/employee-master/add',
    //   element: <AddEmployee />
    // }
    {
      path: '/app/invoice',
      element: <Invoicing />
    },
    {
      path: '/app/invoice/settings',
      element: <Settings />
    }
  ]
};

export default MainRoutes;
