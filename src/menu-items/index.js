import adminItems from './adminItems';
import getDashboardMenu from './dashboard';

// ==============================|| MENU ITEMS ||============================== //

// Usage: menuItems(user, subscriptions)

const menuItems = (user, subscriptions) => {
  const items = [];
  if (user?.user?.is_super_user) {
    items.push(adminItems);
  }
  items.push(getDashboardMenu(user, subscriptions));
  return { items };
};

export default menuItems;
