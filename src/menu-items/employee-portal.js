// assets
import {
  IconAddressBook,
  IconReservedLine,
  IconShadow,
  IconWindmill,
  IconGitPullRequest,
  IconBrandAsana,
  IconBriefcase,
  IconUsers,
  IconMessageCog,
  IconDashboard,
  IconCalendarEvent,
  IconClock,
  IconCurrencyDollar,
  IconFileText,
  IconPlus,
  IconClockHour4,
  IconHistory,
  IconReceipt,
  IconCalculator,
  IconPlane,
  IconUserCheck,
  IconFileInvoice,
  IconShieldCheck,
  IconSend
} from '@tabler/icons-react';

// constant
const icons = {
  IconAddressBook,
  IconShadow,
  IconWindmill,
  IconGitPullRequest,
  IconBrandAsana,
  IconReservedLine,
  IconBriefcase,
  IconUsers,
  IconMessageCog,
  IconDashboard,
  IconCalendarEvent,
  IconClock,
  IconCurrencyDollar,
  IconFileText,
  IconPlus,
  IconClockHour4,
  IconHistory,
  IconReceipt,
  IconCalculator,
  IconPlane,
  IconUserCheck,
  IconFileInvoice,
  IconShieldCheck,
  IconSend
};

// Should Only work for Admin

const EmployeePortal = {
  id: 'team-tara',
  title: 'team-tara',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'dashboard',
      type: 'item',
      url: '/app/employee-portal/dashboard',
      icon: icons.IconDashboard,
      breadcrumbs: false
    },
    {
      id: 'onboarding',
      title: 'Onboarding',
      type: 'item',
      url: '/app/employee-portal/onboarding',
      icon: icons.IconBriefcase,
      breadcrumbs: false
    },
    {
      id: 'leave-management',
      title: 'Leave Management',
      type: 'item',
      url: '/app/employee-portal/leave-management',
      icon: icons.IconPlane,
      breadcrumbs: false
    },
    {
      id: 'attendance',
      title: 'Attendance',
      type: 'item',
      url: '/app/employee-portal/attendance',
      icon: icons.IconClock,
      breadcrumbs: false
    },
    {
      id: 'tax-deductions',
      title: 'Tax Deductions',
      type: 'item',
      url: '/app/employee-portal/declarations',
      icon: icons.IconCalculator,
      breadcrumbs: false
    },
    {
      id: 'pay-slips',
      title: 'Salary',
      type: 'item',
      url: '/app/employee-portal/pay-slips',
      icon: icons.IconReceipt,
      breadcrumbs: false
    },
    {
      id: 'request-management',
      title: 'Request Management',
      type: 'item',
      url: '/app/employee-portal/request-management',
      icon: icons.IconSend,
      breadcrumbs: false
    },
    // {
    //   id: 'pay-slips',
    //   title: 'Pay Slips',
    //   type: 'item',
    //   url: '/app/employee-portal/pay-slips',
    //   icon: icons.IconReceipt,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'tax-tds',
    //   title: 'Tax & TDS',
    //   type: 'item',
    //   url: '/app/employee-portal/tax-tds',
    //   icon: icons.IconCalculator,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'apply-leave',
    //   title: 'Leave Tracker',
    //   type: 'item',
    //   url: '/app/employee-portal/leave-management',
    //   icon: icons.IconPlane,
    //   breadcrumbs: false
    // },

    // {
    //   id: 'tax-tds',
    //   title: 'Tax & TDS',
    //   type: 'item',
    //   url: '/app/employee-portal/tax-tds',
    //   icon: icons.IconCalculator,
    //   breadcrumbs: false
    // },

    // {
    //   id: 'my-earnings',
    //   title: 'My Earnings',
    //   type: 'item',
    //   url: '/app/employee-portal/my-earnings',
    //   icon: icons.IconCurrencyDollar,
    //   breadcrumbs: false
    // }
    {
      id: 'attandance-info',
      title: 'Attandance Info',
      type: 'item',
      url: '/app/employee-portal/attandance-info',
      icon: icons.IconClock,
      breadcrumbs: false
    }

    // {
    //   id: 'form-16',
    //   title: 'Form 16 & Compliances',
    //   type: 'item',
    //   url: '/app/employee-portal/form-16',
    //   icon: icons.IconShieldCheck,
    //   breadcrumbs: false
    // }

    // {
    //   id: 'service-summary',
    //   title: 'service-summary',
    //   type: 'item',
    //   url: '/app/service-summary',
    //   icon: icons.IconMessageCog,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'task-management',
    //   title: 'task-management',
    //   type: 'item',
    //   url: '/app/manage-tasks',
    //   icon: icons.IconBrandAsana,
    //   breadcrumbs: false
    // }
  ]
};

export default EmployeePortal;
