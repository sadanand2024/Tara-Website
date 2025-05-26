import adminItems from './adminItems';
import getDashboardMenu from './dashboard';
import TaraUsers from './tarausers';

// ==============================|| MENU ITEMS ||============================== //

// Usage: menuItems(user, subscriptions)

const menuItems = (user, subscriptions) => {
  const items = [];
  if (user?.user?.is_super_admin) items.push(adminItems);
  else if (user.active_context?.is_platform_context) items.push(TaraUsers);
  else items.push(getDashboardMenu(user, subscriptions));
  return { items };
};

export default menuItems;
