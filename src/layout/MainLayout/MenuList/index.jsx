import { memo, useState, useEffect, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'store';

// project imports
import NavItem from './NavItem';
import NavGroup from './NavGroup';
import { MenuOrientation } from 'config';
import menuItems from 'menu-items';
import useConfig from 'hooks/useConfig';

// import { Menu } from 'menu-items/widget';
import { HORIZONTAL_MAX_ITEM } from 'config';
import { useGetMenuMaster } from 'api/menu';

// ==============================|| SIDEBAR MENU LIST ||============================== //

function MenuList() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { menuOrientation } = useConfig();
  // const { menuLoading } = useGetMenu();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const user = useSelector((state) => state.accountReducer.user);
  const subscriptions = user?.module_subscriptions || [];
  const menu = useMemo(() => menuItems(user, subscriptions), [user, subscriptions]);
  const [selectedID, setSelectedID] = useState('');

  // let widgetMenu = Menu();

  // useLayoutEffect(() => {
  //   const isFound = menuItem.items.some((element) => {
  //     if (element.id === 'group-widget') {
  //       return true;
  //     }
  //     return false;
  //   });
  //   if (menuLoading) {
  //     menuItem.items.splice(1, 0, widgetMenu);
  //     setMenuItems({ items: [...menuItem.items] });
  //   } else if (!menuLoading && widgetMenu?.id !== undefined && !isFound) {
  //     menuItem.items.splice(1, 1, widgetMenu);
  //     setMenuItems({ items: [...menuItem.items] });
  //   } else {
  //     setMenuItems({ items: [...menuItem.items] });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [menuLoading]);

  // last menu-item to show in horizontal menu bar
  const lastItem = isHorizontal ? HORIZONTAL_MAX_ITEM : null;

  let lastItemIndex = menu.items.length - 1;
  let remItems = [];
  let lastItemId;

  if (lastItem && lastItem < menu.items.length) {
    lastItemId = menu.items[lastItem - 1].id;
    lastItemIndex = lastItem - 1;
    remItems = menu.items.slice(lastItem - 1, menu.items.length).map((item) => ({
      title: item.title,
      elements: item.children,
      icon: item.icon,
      ...(item.url && {
        url: item.url
      })
    }));
  }

  const navItems = menu.items.slice(0, lastItemIndex + 1).map((item, index) => {
    switch (item.type) {
      case 'group':
        if (item.url && item.id !== lastItemId) {
          return (
            <List key={item.id}>
              <NavItem item={item} level={1} isParents setSelectedID={() => setSelectedID('')} />
              {!isHorizontal && index !== 0 && <Divider sx={{ py: 0.5 }} />}
            </List>
          );
        }

        return (
          <NavGroup
            key={item.id}
            setSelectedID={setSelectedID}
            selectedID={selectedID}
            item={item}
            lastItem={lastItem}
            remItems={remItems}
            lastItemId={lastItemId}
          />
        );
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return !isHorizontal ? (
    <Box key={user.active_context?.id} {...(drawerOpen && { sx: { mt: 1.5 } })}>{navItems}</Box>
  ) : (
    <Box key={user.active_context?.id}>{navItems}</Box>
  );
}

export default memo(MenuList);
