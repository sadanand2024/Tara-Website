import React, { useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// project imports
import LogoSection from '../LogoSection';
import SearchSection from './SearchSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';
import LocalizationSection from './LocalizationSection';
import MegaMenuSection from './MegaMenuSection';
import FullScreenSection from './FullScreenSection';
import NotificationSection from './NotificationSection';
import AddBusiness from './AddBusiness';
import { useDispatch as useReduxDispatch } from 'react-redux';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';
import { MenuOrientation, ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import Factory from 'utils/Factory';

// assets
import { IconMenu2 } from '@tabler/icons-react';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { storeUser } from 'store/slices/account'; // redux slice
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

import { useSelector } from 'store';
import { Stack } from '@mui/material';

export default function Header() {
  const dispatch = useDispatch();
  const reduxDispatch = useReduxDispatch(); // ✅ Redux dispatcher
  const user = useSelector((state) => state.accountReducer.user);
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));

  const { mode, menuOrientation } = useConfig();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downMD;

  const [selectedOption, setSelectedOption] = React.useState(user.active_context || null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [userData, setUserData] = React.useState(user || null);

  const getContext = async () => {
    const response = await Factory('get', '/user_management/user/contexts?user_id=' + userData.user.id, {}, {});
    if (response.res.status_cd === 0) {
      let data = response.res.data;
      let __storedData = { ...user };
      __storedData.all_contexts = data.contexts;
      setUserData(__storedData);
      localStorage.setItem('user', JSON.stringify(__storedData));
    }
  };

  const handleOptionChange = async (event, newValue) => {
    if (newValue?.isAddOption) {
      setOpenAddDialog(true);
      return;
    }

    try {
      const response = await Factory('post', '/user_management/switch-context/', { context_id: newValue.id, user_id: userData.user.id });
      if (response.res.status_cd === 0) {
        setSelectedOption(newValue);
        let data = { ...user };
        data.active_context = response.res.data.active_context;
        data.module_subscriptions = response.res.data.module_subscriptions;
        data.user_role = response.res.data.user_role;
        localStorage.setItem('user', JSON.stringify(data));
        reduxDispatch(storeUser(data));
        dispatch(
          openSnackbar({
            open: true,
            message: 'Switched to ' + response.res.data.active_context.name,
            variant: 'alert',
            anchorOrigin: { vertical: 'top', horizontal: 'right' },
            alert: { color: 'success' },
            close: false,
            severity: 'success'
          })
        );
      }
    } catch (error) {
      console.error('Error switching context:', error);
    }
  };

  const handleEditBusiness = (option) => {
    console.log(option);
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  // Create options array with all contexts
  const options = [...userData.all_contexts, { id: 'add_business', name: 'Add Business', isAddOption: true }];

  return (
    <>
      {/* logo & toggler button */}
      <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        {!isHorizontal && (
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
              color: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
              '&:hover': {
                bgcolor: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                color: mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
              }
            }}
            onClick={() => handlerDrawerOpen(!drawerOpen)}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
        )}
      </Box>

      {/* header search */}
      <SearchSection />
      <Box sx={{ flexGrow: 1 }} />

      {/* mega-menu */}
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MegaMenuSection />
      </Box>

      {/* live customization & localization */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <LocalizationSection />
      </Box>

      {/* notification */}
      <NotificationSection />

      {/* full screen toggler */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <FullScreenSection />
      </Box>

      {/* business selector */}
      <Box sx={{ display: { xs: 'none', sm: 'block' }, mx: 2, width: 300 }}>
        <Autocomplete
          value={selectedOption}
          onChange={handleOptionChange}
          options={options}
          getOptionLabel={(option) => option.name || option.context_name || 'Unnamed Option'}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.light'
              },
              '&:hover fieldset': {
                borderColor: 'primary.main'
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main'
              }
            }
          }}
          renderOption={(props, option) => {
            const { key, ...otherProps } = props;

            if (option.isAddOption) {
              return [
                <Divider key="divider" sx={{ my: 1 }} />,
                <Box
                  {...otherProps}
                  component="li"
                  key={option.id}
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.lighter'
                    }
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" sx={{ mr: 1 }} />
                  Add Business
                </Box>
              ];
            }

            return (
              <Box {...otherProps} component="li" key={option.id} sx={{ p: 4 }}>
                <BusinessIcon fontSize="small" sx={{ mr: 1 }} />
                <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', width: '100%', py: 0.6 }}>
                  {option.name || option.context_name || 'Unnamed Option'}
                </Stack>
              </Box>
            );
          }}
          renderInput={(params) => <TextField {...params} size="small" placeholder="Select Business" />}
          disableClearable
          ListboxProps={{
            sx: { maxHeight: 250 }
          }}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      </Box>

      {/* profile */}
      <ProfileSection />

      {/* mobile header */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <MobileSection />
      </Box>

      {/* Add Business Dialog */}
      <AddBusiness
        open={openAddDialog}
        onClose={handleAddDialogClose}
        userData={userData}
        setUserData={setUserData}
        getContext={getContext}
      />
    </>
  );
}
