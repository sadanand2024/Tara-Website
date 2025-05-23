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

const TaraUsers = {
  id: 'team-tara',
  title: 'team-tara',
  type: 'group',
  children: [
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
      url: '/app/manage-tasks',
      icon: icons.IconBrandAsana,
      breadcrumbs: false
    }
  ]
};

export default TaraUsers;
