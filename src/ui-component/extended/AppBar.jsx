import PropTypes from 'prop-types';
import { cloneElement, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import MuiAppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';

// project imports
import { ThemeMode } from 'config';
import tarafirstLogo from 'assets/images/Svgtarafirst.svg';
// import Logo from 'ui-component/Logo';
import Tarafirstlogo_png from 'assets/images/Tarafirstlogo_png.png'; // Tarafirstlogo_png
import CardMedia from '@mui/material/CardMedia';

// assets
import { IconBook, IconCreditCard, IconDashboard, IconHome2 } from '@tabler/icons-react';
import MenuIcon from '@mui/icons-material/Menu';
import ServicesPanel from './ServicesPanel';
import ProductsPanel from './ProductsPanel';
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
        <Toolbar sx={{ py: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Logo */}
          <Box>
            <RouterLink to="/">
              <CardMedia component="img" src={Tarafirstlogo_png} alt="Tarafirst Logo" sx={{ width: 200 }} />
            </RouterLink>
          </Box>

          {/* Center: Navigation Buttons */}
          <Stack
            direction="row"
            spacing={{ xs: 1.5, md: 3 }}
            sx={{
              flexGrow: 1,
              justifyContent: 'center',
              display: { xs: 'none', sm: 'flex' }
            }}
          >
            <Button color="inherit" onClick={handleToggle}>
              Services
            </Button>
            <Button color="inherit" onClick={handleProductsToggle}>
              Products
            </Button>
            <Button color="inherit">Knowledge</Button>
            <Button color="inherit">Company</Button>
            <Button color="inherit">Book Consultation</Button>
            <Button color="inherit" component={Link} href="https://codedthemes.gitbook.io/berry" target="_blank">
              Knowledge
            </Button>
          </Stack>

          {/* Right: Auth Buttons */}
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0, display: { xs: 'none', sm: 'flex' } }}>
            <Button component={RouterLink} to="/register" disableElevation color="secondary">
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
