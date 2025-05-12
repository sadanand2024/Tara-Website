// assets
import { IconAddressBook, IconReservedLine, IconShadow, IconWindmill } from '@tabler/icons-react';

// constant
const icons = {
  IconAddressBook,
  IconReservedLine,
  IconShadow,
  IconWindmill
};

// Should Only work for Admin

const adminItems = {
  id: 'admin',
  title: 'admin',
  type: 'group',
  children: [
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
