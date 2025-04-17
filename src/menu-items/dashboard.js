// assets
import {
  IconDashboard,
  IconBriefcase,
  IconClipboardList,
  IconFolder,
  IconFileText,
  IconReceipt2,
  IconReceiptTax,
  IconShieldCheck,
  IconCoin,
  IconPigMoney,
  IconCreditCard,
  IconHeadset
} from '@tabler/icons-react';

// constant
const icons = {
  IconDashboard,
  IconBriefcase,
  IconClipboardList,
  IconFolder,
  IconFileText,
  IconReceipt2,
  IconReceiptTax,
  IconShieldCheck,
  IconCoin,
  IconPigMoney,
  IconCreditCard,
  IconHeadset
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  title: 'Home',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.IconDashboard,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'my-services',
      title: 'My Services',
      type: 'item',
      url: '/dashboard/services',
      icon: icons.IconBriefcase,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'task-manager',
      title: 'Task Manager',
      type: 'item',
      url: '/dashboard/tasks',
      icon: icons.IconClipboardList,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'document-wallet',
      title: 'Document Wallet',
      type: 'item',
      url: '/dashboard/documents',
      icon: icons.IconFolder,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'document-drafting',
      title: 'Document Drafting',
      type: 'item',
      url: '/dashboard/drafting',
      icon: icons.IconFileText,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'income-tax',
      title: 'Income Tax',
      type: 'item',
      url: '/dashboard/income-tax',
      icon: icons.IconReceipt2,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'tds',
      title: 'TDS',
      type: 'item',
      url: '/dashboard/tds',
      icon: icons.IconReceiptTax,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'insurance',
      title: 'Insurance',
      type: 'item',
      url: '/dashboard/insurance',
      icon: icons.IconShieldCheck,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'loan',
      title: 'Loan',
      type: 'item',
      url: '/dashboard/loan',
      icon: icons.IconCoin,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'investments',
      title: 'Investments',
      type: 'item',
      url: '/dashboard/investments',
      icon: icons.IconPigMoney,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions & Payments',
      type: 'item',
      url: '/dashboard/subscriptions',
      icon: icons.IconCreditCard,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'support',
      title: 'Support & Chat',
      type: 'item',
      url: '/dashboard/support',
      icon: icons.IconHeadset,
      breadcrumbs: false,
      caption: ''
    }
  ]
};

export default dashboard;
