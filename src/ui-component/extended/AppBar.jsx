import PropTypes from 'prop-types';
import { cloneElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import useScrollTrigger from '@mui/material/useScrollTrigger';

// project imports
import { ThemeMode } from 'config';
// import Logo from 'ui-component/Logo';
import CardMedia from '@mui/material/CardMedia';
import Tarafirstlogo_png from 'assets/images/Tarafirstlogo_png.png'; // Tarafirstlogo_png

// assets
import MenuIcon from '@mui/icons-material/Menu';
import {
  IconApps,
  IconBrain,
  IconBuildingSkyscraper,
  IconBuildingStore,
  IconCalendarTime
} from '@tabler/icons-react';
import ProductsPanel from './ProductsPanel';
import ServicesPanel from './ServicesPanel';
function ElevationScroll({ children, window }) {
  const theme = useTheme();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window
  });

  return cloneElement(children, {
    elevation: trigger ? 1 : 0,
    style: {
      backgroundColor: theme.palette.mode === ThemeMode.DARK && trigger ? theme.palette.dark[800] : theme.palette.background.default,
      color: theme.palette.text.dark
    }
  });
}

// ==============================|| MINIMAL LAYOUT APP BAR ||============================== //

export default function AppBar({ ...others }) {
  const [drawerToggle, setDrawerToggle] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const theme = useTheme();

  const handleToggle = () => setOpenServices(!openServices);
  const handleClose = () => setOpenServices(false);

  const handleProductsToggle = () => setOpenProducts(!openProducts);
  const handleProductsClose = () => setOpenProducts(false);

  const drawerToggler = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerToggle(open);
  };

  return (
    <ElevationScroll {...others}>
      <MuiAppBar>
        {/* <Container> */}
        <Toolbar sx={{ py: 0.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Logo */}
          <Box>
            <RouterLink to="/">
              <CardMedia component="img" src={Tarafirstlogo_png} alt="Tara First Logo" sx={{ width: 200 }} />
            </RouterLink>
          </Box>

          {/* Center: Navigation Buttons */}
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 3 }}
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              display: { xs: 'none', md: 'flex' }
            }}
          >
            <Button color="inherit" onClick={handleToggle}>
              Services
            </Button>
            <Button color="inherit" onClick={handleProductsToggle}>
              Products
            </Button>
            <Button color="inherit" component={Link} href="/company">
            company
            </Button>
            <Button color="inherit" component={Link} href="/knowledge">
              Knowledge
            </Button>
            <Button color="inherit" component={Link} href="/book-consultation">
              Book Consultation
            </Button>
          </Stack>

          <Box sx={{ display: { xs: 'block', md: 'none' } }}>
            <IconButton color="inherit" onClick={drawerToggler(true)} size="large">
              <MenuIcon />
            </IconButton>
            <Drawer anchor="top" open={drawerToggle} onClose={drawerToggler(false)}>
              {drawerToggle && (
                <Box
                  sx={{
                    width: 'auto',
                    py: 2
                  }}
                  role="presentation"
                >
                  <List>
                    <ListItemButton
                      onClick={() => {
                        setOpenServices(!openServices);
                        setOpenProducts(false);
                      }}
                    >
                      <ListItemIcon>
                        <IconBuildingStore />
                      </ListItemIcon>
                      <ListItemText primary="Services" />
                    </ListItemButton>
                    {openServices && (
                      <Box sx={{ pl: 2, bgcolor: 'background.default' }}>
                        <ServicesPanel onClose={() => setOpenServices(false)} />
                      </Box>
                    )}

                    <ListItemButton
                      onClick={() => {
                        setOpenProducts(!openProducts);
                        setOpenServices(false);
                      }}
                    >
                      <ListItemIcon>
                        <IconApps />
                      </ListItemIcon>
                      <ListItemText primary="Products" />
                    </ListItemButton>
                    {openProducts && (
                      <Box sx={{ pl: 2, bgcolor: 'background.default' }}>
                        <ProductsPanel onClose={() => setOpenProducts(false)} />
                      </Box>
                    )}

                    <ListItemButton component={Link} href="/company">
                      <ListItemIcon>
                        <IconBuildingSkyscraper />
                      </ListItemIcon>
                      <ListItemText primary="company"/>
                    </ListItemButton>

                    <ListItemButton component={Link} href="/knowledge">
                      <ListItemIcon>
                        <IconBrain />
                      </ListItemIcon>
                      <ListItemText primary="Knowledge" />
                    </ListItemButton>

                    <ListItemButton component={Link} href="/book-consultation">
                      <ListItemIcon>
                        <IconCalendarTime />
                      </ListItemIcon>
                      <ListItemText primary="Book Consultation" />
                    </ListItemButton>

                    <Box
                      sx={{
                        pt: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2
                      }}
                    >
                      <Button
                        component={RouterLink}
                        to="/register"
                        disableElevation
                        color="secondary"
                        variant="outlined"
                        fullWidth
                        sx={{ maxWidth: 200 }}
                      >
                        Signup
                      </Button>
                      <Button component={RouterLink} to="/login" variant="contained" color="secondary" fullWidth sx={{ maxWidth: 200 }}>
                        Login
                      </Button>
                    </Box>
                  </List>
                </Box>
              )}
            </Drawer>
          </Box>
          {/* Right: Auth Buttons */}
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, display: { xs: 'none', md: 'flex' } }}>
            <Button component={RouterLink} to="/register" disableElevation color="secondary" variant="outlined">
              Signup
            </Button>
            <Button component={RouterLink} to="/login" variant="contained" color="secondary">
              Login
            </Button>
          </Stack>
        </Toolbar>

        {openServices && (
          <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
            <ServicesPanel onClose={handleClose} />
          </Box>
        )}
        {openProducts && (
          <Box sx={{ position: 'absolute', top: '100%', left: 0, right: 0 }}>
            <ProductsPanel onClose={handleProductsClose} />
          </Box>
        )}
        {/* </Container> */}
      </MuiAppBar>
    </ElevationScroll>
  );
}

ElevationScroll.propTypes = { children: PropTypes.node, window: PropTypes.any };
