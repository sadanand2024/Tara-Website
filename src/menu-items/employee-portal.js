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
  IconShieldCheck
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
  IconShieldCheck
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
      id: 'pay-slips',
      title: 'Pay Slips',
      type: 'item',
      url: '/app/employee-portal/pay-slips',
      icon: icons.IconReceipt,
      breadcrumbs: false
    },
    {
      id: 'tax-tds',
      title: 'Tax & TDS',
      type: 'item',
      url: '/app/employee-portal/tax-tds',
      icon: icons.IconCalculator,
      breadcrumbs: false
    },
    {
      id: 'apply-leave',
      title: 'Leave Tracker',
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
      id: 'my-earnings',
      title: 'My Earnings',
      type: 'item',
      url: '/app/employee-portal/my-earnings',
      icon: icons.IconCurrencyDollar,
      breadcrumbs: false
    },
    {
      id: 'declarations',
      title: 'Declarations',
      type: 'item',
      url: '/app/employee-portal/declarations',
      icon: icons.IconFileText,
      breadcrumbs: false
    },
    {
      id: 'form-16',
      title: 'Form 16 & Compliances',
      type: 'item',
      url: '/app/employee-portal/form-16',
      icon: icons.IconShieldCheck,
      breadcrumbs: false
    }

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
