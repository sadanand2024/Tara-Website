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
  IconHistory
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
  IconHistory
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
      id: 'leave-management',
      title: 'Leaves',
      type: 'collapse',
      icon: icons.IconCalendarEvent,
      children: [
        {
          id: 'apply-leave',
          title: 'My Leaves',
          type: 'item',
          url: '/app/employee-portal/leave-management',
          breadcrumbs: false
        },
        {
          id: 'leave-balance',
          title: 'Leave Balances',
          type: 'item',
          url: '/app/employee-portal/leave-balance',
          breadcrumbs: false
        },
        {
          id: 'leave-calendar',
          title: 'Leave Calendar',
          type: 'item',
          url: '/app/employee-portal/leave-calendar',
          breadcrumbs: false
        },
        {
          id: 'holiday-calendar',
          title: 'Holiday Calendar',
          type: 'item',
          url: '/app/employee-portal/holiday-calendar',
          breadcrumbs: false
        },
        {
          id: 'team-on-leave',
          title: 'Team on Leave',
          type: 'item',
          url: '/app/employee-portal/team-on-leave',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'attendance-management',
      title: 'Attendance',
      type: 'item',
      url: '/app/employee-portal/attendance-management',
      icon: icons.IconClock,
      breadcrumbs: false
    },
    {
      id: 'salary-management',
      title: 'Salary',
      type: 'collapse',
      icon: icons.IconCurrencyDollar,
      children: [
        {
          id: 'pay-slips',
          title: 'Pay Slips',
          type: 'item',
          url: '/app/employee-portal/pay-slips',
          breadcrumbs: false
        },
        {
          id: 'ytd-reports',
          title: 'YTD Reports',
          type: 'item',
          url: '/app/employee-portal/ytd-reports',
          breadcrumbs: false
        },
        {
          id: 'it-statements',
          title: 'IT Statements',
          type: 'item',
          url: '/app/employee-portal/it-statements',
          breadcrumbs: false
        },
        {
          id: 'it-declaration',
          title: 'IT Declaration',
          type: 'item',
          url: '/app/employee-portal/it-declaration',
          breadcrumbs: false
        },
        {
          id: 'loan-statement',
          title: 'Loan Statement',
          type: 'item',
          url: '/app/employee-portal/loan-statement',
          breadcrumbs: false
        }
      ]
    },
    {
      id: 'upcoming-events',
      title: 'Upcoming Events',
      type: 'item',
      url: '/app/employee-portal/upcoming-events',
      icon: icons.IconCalendarEvent,
      breadcrumbs: false
    },
    {
      id: 'documents',
      title: 'Documents',
      type: 'item',
      url: '/app/employee-portal/documents',
      icon: icons.IconFileText,
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
