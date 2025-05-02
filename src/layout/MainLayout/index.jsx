import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import HorizontalBar from './HorizontalBar';
import MainContentStyled from './MainContentStyled';
import Loader from 'ui-component/Loader';
import Breadcrumbs from 'ui-component/extended/Breadcrumbs';

import { MenuOrientation } from 'config';
import useConfig from 'hooks/useConfig';
import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

// ==============================|| MAIN LAYOUT ||============================== //

export default function MainLayout() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { borderRadius, container, miniDrawer, menuOrientation } = useConfig();
  const { menuMaster, menuMasterLoading } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened;
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!downMD) {
      handlerDrawerOpen(true);
    }
  }, [downMD]);

  useEffect(() => {
    if (downMD) {
      return;
    }
    handlerDrawerOpen(isHovering);
  }, [isHovering, downMD]);

  if (menuMasterLoading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar enableColorOnDark position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'background.default' }}>
        <Toolbar>
          <Header hamburgerDisplay={downMD ? 'block' : 'none'} />
        </Toolbar>
      </AppBar>

      <Box
        onMouseEnter={() => !downMD && setIsHovering(true)}
        onMouseLeave={() => !downMD && setIsHovering(false)}
        sx={{
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.shorter
          }),
          '& > *': {
            transition: theme.transitions.create(['width', 'margin'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.shorter
            })
          },
          '& .simplebar-scrollbar': {
            '&.simplebar-visible:before': {
              opacity: 0
            }
          },
          '& .simplebar-track.simplebar-vertical': {
            width: '0 !important'
          },
          '& .simplebar-track.simplebar-horizontal .simplebar-scrollbar': {
            height: '0 !important'
          },
          '& .simplebar-mask': {
            overflow: 'auto !important'
          },
          '& .simplebar-content-wrapper': {
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          }
        }}
      >
        <Sidebar />
      </Box>
      {/* main content */}
      <MainContentStyled {...{ borderRadius, menuOrientation, open: drawerOpen }}>
        <Container
          maxWidth={false}
          sx={{
            padding: '10px !important',
            ...(!container && { px: { xs: 0 } }),
            minHeight: 'calc(100vh - 128px)',
            display: 'flex',
            flexDirection: 'column',
            // bgcolor: 'white',
            borderRadius: 1
          }}
          // maxWidth={container ? 'lg' : false}
          // sx={{ ...(!container && { px: { xs: 0 } }), minHeight: 'calc(100vh - 128px)', display: 'flex', flexDirection: 'column' }}
        >
          {/* breadcrumb */}
          <Breadcrumbs />
          <Outlet />
          <Footer />
        </Container>
      </MainContentStyled>
    </Box>
  );
}
