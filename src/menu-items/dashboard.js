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
  IconHeadset,
  IconUsers,
  IconLayoutRows,
  IconFileInvoice
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
  IconHeadset,
  IconUsers,
  IconLayoutRows,
  IconFileInvoice
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  id: 'dashboard',
  // title: 'Home',
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
      id: 'subscriptions',
      title: 'subscriptions',
      type: 'item',
      url: '/app/subscriptions',
      icon: icons.IconCreditCard,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'task-manager',
      title: 'task-manager',
      type: 'item',
      url: '/app/manage-tasks',
      icon: icons.IconClipboardList,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'manage-team',
      title: 'manage-team',
      type: 'item',
      url: '/app/users',
      icon: icons.IconUsers,
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
      id: 'payroll',
      title: 'payroll',
      type: 'item',
      url: '/app/payroll',
      icon: icons.IconCreditCard,
      breadcrumbs: false,
      caption: ''
    },
    {
      id: 'invoicing',
      title: 'invoicing',
      type: 'item',
      url: '/app/invoice',
      icon: icons.IconReceipt2,
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

// Helper: map module url/id to menu item id
const moduleToMenuId = {
  invoice: 'invoicing',
  payroll: 'payroll',
  documents: 'document-wallet',
  'income-tax': 'income-tax',
  tds: 'tds',
  insurance: 'insurance',
  loan: 'loan',
  investments: 'investments',
  'support&chat': 'support&chat'
  // add more mappings as needed
};

// Main function to get dashboard menu based on user and subscriptions
const getDashboardMenu = (user, subscriptions = []) => {
  // Example: Only show certain menu items for certain roles
  // You can expand this logic as needed
  const allowedByRole = (item) => {
    if (!user || !user.user_role) return true;
    // Example: restrict 'manage-team' to admin roles
    if (item.id === 'manage-team' && user.user_role.role_type !== 'admin') return false;
    // Add more role-based restrictions here
    return true;
  };

  // Example: Only show module menu items if user has a subscription
  const allowedBySubscription = (item) => {
    // If not a module-related menu, always show
    if (!Object.values(moduleToMenuId).includes(item.id)) return true;
    // If no subscriptions, show nothing (or show all if you want)
    if (!subscriptions || subscriptions.length === 0) return true;
    // If user has a subscription to the module, show
    return subscriptions.some((sub) => {
      const moduleKey = Object.keys(moduleToMenuId).find((key) => moduleToMenuId[key] === item.id);
      // Try to match by module_name, module.name, or module.id if available
      return (
        (sub.module_name && sub.module_name.toLowerCase().replace(/\\s/g, '').includes(moduleKey)) ||
        (sub.module && sub.module.name && sub.module.name.toLowerCase().replace(/\\s/g, '').includes(moduleKey)) ||
        (sub.module && sub.module.id && moduleKey && sub.module.id.toString() === moduleKey)
      );
    });
  };

  // Filter children based on both role and subscription
  const filteredChildren = dashboard.children.filter((item) => allowedByRole(item) && allowedBySubscription(item));

  return {
    ...dashboard,
    children: filteredChildren
  };
};

export default getDashboardMenu;
