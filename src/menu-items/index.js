import pages from './pages';
import getDashboardMenu from './dashboard';

// ==============================|| MENU ITEMS ||============================== //

// Usage: menuItems(user, subscriptions)


const menuItems = (user, subscriptions) => ({
  items: [getDashboardMenu(user, subscriptions)]
});

export default menuItems;
