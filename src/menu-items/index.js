import adminItems from './adminItems';
import getDashboardMenu from './dashboard';
import TaraUsers from './tarausers';
import EmployeePortal from './employee-portal';

// ==============================|| MENU ITEMS ||============================== //

// Usage: menuItems(user, subscriptions)

const menuItems = (user, subscriptions) => {
  const items = [];
  if (user?.user?.is_super_admin) items.push(adminItems);
  else if (user?.employee) items.push(EmployeePortal);
  else if (user.active_context?.is_platform_context) items.push(TaraUsers);
  else items.push(getDashboardMenu(user, subscriptions));
  return { items };
};

export default menuItems;
