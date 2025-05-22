// assets
import {
  IconAddressBook,
  IconReservedLine,
  IconShadow,
  IconWindmill,
  IconGitPullRequest,
  IconBrandAsana,
  IconBriefcase,
  IconUsers
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
  IconUsers
};

// Should Only work for Admin

const adminItems = {
  id: 'super-admin',
  title: 'super-admin',
  type: 'group',
  children: [
    {
      id: 'new-requests',
      title: 'new-requests',
      type: 'item',
      url: '/app/new-requests',
      icon: icons.IconGitPullRequest,
      breadcrumbs: false
    },
    {
      id: 'service-summary',
      title: 'service-summary',
      type: 'item',
      url: '/app/service-summary',
      icon: icons.IconBriefcase,
      breadcrumbs: false
    },
    {
      id: 'task-management',
      title: 'task-management',
      type: 'item',
      url: '/app/task-management',
      icon: icons.IconBrandAsana,
      breadcrumbs: false
    },
    {
      id: 'user-management',
      title: 'user-management',
      type: 'item',
      url: '/app/user-management',
      icon: icons.IconUsers,
      breadcrumbs: false
    },
    {
      id: 'contact-us',
      title: 'contact-us',
      type: 'item',
      url: '/app/contact-us',
      icon: icons.IconAddressBook,
      breadcrumbs: false
    },
    {
      id: 'consultation',
      title: 'consultation',
      type: 'item',
      url: '/app/consultation',
      icon: icons.IconReservedLine,
      breadcrumbs: false
    }
  ]
};

export default adminItems;
