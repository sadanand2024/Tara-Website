import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import AuthGuard from 'utils/route-guard/AuthGuard';
// import RoleGuard from 'utils/route-guard/roleguard';
// payroll module
const PayrollDashboard = Loadable(lazy(() => import('views/payroll'))); // ✅ works because index.jsx exists

const EmployeeDashboard = Loadable(lazy(() => import('views/payroll/EmployeeDashboard')));
const PayrollWorkflows = Loadable(lazy(() => import('views/payroll/PayrollWorkflows')));
const PayrollSettings = Loadable(lazy(() => import('views/payroll/settings')));
const PayrollSettingsLayout = Loadable(lazy(() => import('views/payroll/settings')));
const OrganizationDetails = Loadable(lazy(() => import('views/payroll/settings/Organizationdetails')));
const WorkLocation = Loadable(lazy(() => import('views/payroll/settings/Worklocation')));
const Departments = Loadable(lazy(() => import('views/payroll/settings/Departments')));
const Designations = Loadable(lazy(() => import('views/payroll/settings/Designations')));
const StatuitoryComponents = Loadable(lazy(() => import('views/payroll/settings/StatuitoryComponents')));
const SalaryComponents = Loadable(lazy(() => import('views/payroll/settings/SalaryComponents')));
const SalaryTemplateList = Loadable(lazy(() => import('views/payroll/settings/SalaryTemplateList')));
const SalaryTemplate = Loadable(lazy(() => import('views/payroll/settings/SalaryTemplate')));
const PaySchedule = Loadable(lazy(() => import('views/payroll/settings/PaySchedule')));
const LeaveAttendance = Loadable(lazy(() => import('views/payroll/settings/LeaveAttendance')));
const EmployeeMaster = Loadable(lazy(() => import('views/payroll/settings/EmployeeMasterData/Index')));
const AddEmployee = Loadable(lazy(() => import('views/payroll/settings/EmployeeMasterData/AddEmployee')));

// invoicing module
const Invoicing = Loadable(lazy(() => import('views/invoicing'))); // ✅ works because index.jsx exists
const GenerateInvoice = Loadable(lazy(() => import('views/invoicing/InvoicingComponent')));
const Settings = Loadable(lazy(() => import('views/invoicing/InvoiceSettings')));
const PaymentHistory = Loadable(lazy(() => import('views/invoicing/PaymentHistory')));
const RecordPayment = Loadable(lazy(() => import('views/invoicing/RecordPayment')));
const EditInvoice = Loadable(lazy(() => import('views/invoicing/InvoicingComponent')));
const Support = Loadable(lazy(() => import('views/application/Support')));

// dashboard routing
const Dashboard = Loadable(lazy(() => import('views/dashboard')));
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));
const DashboardSuperAdmin = Loadable(lazy(() => import('views/dashboard/SuperAdmin')));
const DashboardPersonal = Loadable(lazy(() => import('views/dashboard/Personal')));
const DashboardBusiness = Loadable(lazy(() => import('views/dashboard/Business')));
const ManageUsers = Loadable(lazy(() => import('views/ManageUsers')));
const ManageSubscriptions = Loadable(lazy(() => import('views/ManageSubscriptions')));
const ManageModulesAndServices = Loadable(lazy(() => import('views/ManageSubscriptions/ModulesAndServices')));
// application - user social & account profile routing
const AppUserAccountProfile2 = Loadable(lazy(() => import('views/application/users/Profile')));
const AppBusinessSettings = Loadable(lazy(() => import('views/application/Business/settings')));
const AppAccountSettings = Loadable(lazy(() => import('views/application/users/Account')));
const ManagePlans = Loadable(lazy(() => import('views/ManageSubscriptions/ManagePlans')));
const ManageTasks = Loadable(lazy(() => import('views/application/ManageTasks')));
const DocumentDrafting = Loadable(lazy(() => import('views/application/DocumentDrafting')));

const DocumentWallet = Loadable(lazy(() => import('views/application/Document-Wallet')));
const ContactUsInfo = Loadable(lazy(() => import('views/ContactUsInfo')));
const ConsultationInfo = Loadable(lazy(() => import('views/ConsultationInfo')));

// Service Dashboards
const MyServices = Loadable(lazy(() => import('views/Services')));
const ITRSummary = Loadable(lazy(() => import('views/Services/ITR')));
const MSMEDashboard = Loadable(lazy(() => import('views/Services/MSME')));
const TradeLicence = Loadable(lazy(() => import('views/Services/TradeLicence')));
const LabourLicence = Loadable(lazy(() => import('views/Services/LabourLicence')));
const GstRegistration = Loadable(lazy(() => import('views/Services/GST')));
const CompanyIncorporation = Loadable(lazy(() => import('views/Services/CompanyIncorporation')));

//Admin Panel
const UserManagement = Loadable(lazy(() => import('views/SuperAdmin/UserManagement')));
const NewRequests = Loadable(lazy(() => import('views/SuperAdmin/ServiceManagement/NewRequests')));
const TaskManagement = Loadable(lazy(() => import('views/SuperAdmin/ServiceManagement/TaskManagement')));
const ServiceSummary = Loadable(lazy(() => import('views/SuperAdmin/ServiceManagement/ServiceSummary')));

const FaceRecognition = Loadable(lazy(() => import('views/application/AttendanceTest')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: (
    <AuthGuard>
      {/* <RoleGuard> */}
      <MainLayout />
      {/* </RoleGuard> */}
    </AuthGuard>
  ),
  children: [
    {
      path: '/dashboard',
      element: <Dashboard />
    },
    {
      path: '/app/face-recognition',
      element: <FaceRecognition />
    },
    {
      path: '/dashboard/super-admin',
      element: <DashboardSuperAdmin />
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
      path: '/app/support-chat',
      element: <Support />
    },
    {
      path: '/apps/user/profile',
      element: <AppUserAccountProfile2 />
    },
    {
      path: '/apps/business-settings',
      element: <AppBusinessSettings />
    },
    {
      path: '/apps/account-settings',
      element: <AppAccountSettings />
    },

    //Services

    {
      path: '/app/my-services',
      element: <MyServices />
    },
    {
      path: '/app/my-services/itr-filing',
      element: <ITRSummary />
    },
    {
      path: '/app/task-management/itr-filing',
      element: <ITRSummary />
    },
    {
      path: '/app/task-management/msme-registration',
      element: <MSMEDashboard />
    },

    {
      path: '/app/my-services/msme-registration',
      element: <MSMEDashboard />
    },
    {
      path: '/app/task-management/trade-license',
      element: <TradeLicence />
    },
    {
      path: '/app/my-services/trade-license',
      element: <TradeLicence />
    },
    {
      path: '/app/task-management/labour-license',
      element: <LabourLicence />
    },
    {
      path: '/app/my-services/labour-license',
      element: <LabourLicence />
    },
    {
      path: '/app/my-services/registration',

      element: <GstRegistration />
    },
    {
      path: '/app/task-management/registration',
      element: <GstRegistration />
    },
    {
      path: '/app/my-services/private-limited',

      element: <CompanyIncorporation />
    },

    {
      path: '/app/task-management/private-limited',

      element: <CompanyIncorporation />
    },
    {
      path: '/app/users',
      element: <ManageUsers />
    },
    //Admin Panel
    {
      path: '/app/user-management',
      element: <UserManagement />
    },
    {
      path: '/app/new-requests',
      element: <NewRequests />
    },
    {
      path: '/app/task-management',
      element: <TaskManagement />
    },
    {
      path: '/app/service-summary',
      element: <ServiceSummary />
    },
    {
      path: '/app/manage-tasks',
      element: <ManageTasks />
    },
    {
      path: '/app/drafting',
      element: <DocumentDrafting />
    },

    {
      path: '/app/subscriptions',
      element: <ManageSubscriptions />
    },
    {
      path: '/app/subscriptions/modules-and-services',
      element: <ManageModulesAndServices />
    },
    {
      path: '/app/subscriptions/modules-and-services/plans',
      element: <ManagePlans />
    },
    {
      path: '/app/document-wallet',
      element: <DocumentWallet />
    },
    {
      path: '/app/contact-us',
      element: <ContactUsInfo />
    },
    {
      path: '/app/consultation',
      element: <ConsultationInfo />
    },
    {
      path: '/app/payroll',
      element: <PayrollDashboard />
    },
    {
      path: '/payroll/employee-dashboard',
      element: <EmployeeDashboard />
    },
    {
      path: '/payroll/payroll-workflows',
      element: <PayrollWorkflows />
    },
    {
      path: '/app/payroll/settings',
      element: <PayrollSettingsLayout />
    },
    {
      path: '/app/payroll/settings/*',
      element: <PayrollSettingsLayout />
    },
    {
      path: '/payroll/settings/*',
      element: <PayrollSettingsLayout />
    },
    {
      path: '/payroll/settings/salary-template',
      element: <SalaryTemplate />
    },
    {
      path: '/payroll/settings/add-employee',
      element: <AddEmployee />
    },
    {
      path: '/app/invoice',
      element: <Invoicing />
    },
    {
      path: '/app/invoice/settings',
      element: <Settings />
    },
    {
      path: '/app/invoice/generateInvoice',
      element: <GenerateInvoice />
    },
    {
      path: '/app/invoice/paymenthistory',
      element: <PaymentHistory />
    },
    {
      path: '/app/invoice/recordpayment',
      element: <RecordPayment />
    },
    {
      path: '/app/invoice/editInvoice',
      element: <EditInvoice />
    }
  ]
};

export default MainRoutes;
