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
      title: 'dashboard',
      type: 'item',
      url: '/dashboard/personal',
      icon: icons.IconDashboard,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'my-services',
      title: 'my-services',
      type: 'item',
      url: '/app/my-services',
      icon: icons.IconBriefcase,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'task-manager',
      title: 'task-manager',
      type: 'item',
      url: '/app/tasks',
      icon: icons.IconClipboardList,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'document-wallet',
      title: 'document-wallet',
      type: 'item',
      url: '/app/documents',
      icon: icons.IconFolder,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'document-drafting',
      title: 'document-drafting',
      type: 'item',
      url: '/app/drafting',
      icon: icons.IconFileText,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'income-tax',
      title: 'income-tax',
      type: 'item',
      url: '/app/income-tax',
      icon: icons.IconReceipt2,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'tds',
      title: 'tds',
      type: 'item',
      url: '/app/tds',
      icon: icons.IconReceiptTax,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'insurance',
      title: 'insurance',
      type: 'item',
      url: '/app/insurance',
      icon: icons.IconShieldCheck,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'loan',
      title: 'loan',
      type: 'item',
      url: '/app/loan',
      icon: icons.IconCoin,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'investments',
      title: 'investments',
      type: 'item',
      url: '/app/investments',
      icon: icons.IconPigMoney,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'subscriptions',
      title: 'subscriptions',
      type: 'item',
      url: '/app/subscriptions',
      icon: icons.IconCreditCard,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'support&chat',
      title: 'support&chat',
      type: 'item',
      url: '/app/support-chat',
      icon: icons.IconHeadset,
      breadcrumbs: false,
      caption: ''
    }
  ]
};

export default dashboard;
