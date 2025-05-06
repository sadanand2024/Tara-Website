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
import Button from '@mui/material/Button';

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
import { useSnackbar } from 'notistack';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

import { useSelector } from 'store';
import { Stack } from '@mui/material';
import Personal from 'views/KYC/Personal';

const Header = ({ hamburgerDisplay = 'block' }) => {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
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
  const [openPersonalKYC, setOpenPersonalKYC] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const getContext = async () => {
    const response = await Factory('get', '/user_management/user/contexts?user_id=' + userData.user.id, {}, {});
    if (response.res.status_cd === 0) {
      let data = response.res.data;
      let __storedData = { ...user };
      __storedData.all_contexts = data.contexts;
      setUserData(__storedData);
      localStorage.setItem('user', JSON.stringify(__storedData));
      reduxDispatch(storeUser(__storedData));
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
        enqueueSnackbar(`Switched to ${response.res.data.active_context.name}`, {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    } catch (error) {
      console.error('Error switching context:', error);
    }
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  const hasPersonalContext = userData.all_contexts.some((context) => context.context_type === 'personal');

  const options = [
    ...userData.all_contexts
      .filter((context) => context.context_type === 'personal')
      .map((context) => ({
        ...context,
        isPersonal: true
      })),
    ...userData.all_contexts
      .filter((context) => context.context_type !== 'personal')
      .map((context) => ({
        ...context,
        isPersonal: false,
        personalContext:
          userData.all_contexts.find((pc) => pc.type === 'personal' && pc.id === context.personal_context_id)?.name || 'Personal'
      })),
    {
      id: 'add_options',
      name: hasPersonalContext ? 'Add Business' : 'Add Personal or Business',
      isAddOption: true
    }
  ];

  const handlePersonalKYCSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        user_id: userData.user.id,
        context_type: 'personal',
        user_kyc: {
          name: values.name,
          pan_number: values.pan_number,
          aadhaar_number: values.aadhaar_number,
          date: values.date,
          icai_number: null,
          address: {
            address_line1: values.address.address_line1,
            address_line2: values.address.address_line2 || '',
            pincode: parseInt(values.address.pinCode, 10),
            state: values.address.state,
            city: values.address.city,
            country: values.address.country
          },
          have_firm: false
        }
      };

      const response = await Factory('post', '/user_management/select-context', formattedData, {});
      if (response.res.status_cd === 0) {
        enqueueSnackbar('Personal details added successfully', {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        setOpenPersonalKYC(false);
        // Refresh contexts after adding personal details
        getContext();
      } else {
        enqueueSnackbar(response.res.status_msg || 'Failed to add personal details', {
          variant: 'error',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      }
    } catch (error) {
      console.error('Error submitting personal KYC:', error);
      enqueueSnackbar('Failed to add personal details', {
        variant: 'error',
        anchorOrigin: { vertical: 'top', horizontal: 'right' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box
          component="span"
          sx={{
            display: { xs: 'none', md: 'block' },
            flexGrow: 1,
            mr: 2
          }}
        >
          <LogoSection />
        </Box>
        {!isHorizontal && (
          <Avatar
            variant="rounded"
            sx={{
              display: hamburgerDisplay,
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'secondary.light',
              color: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
              '&:hover': {
                bgcolor: mode === ThemeMode.DARK ? 'secondary.main' : 'secondary.dark',
                color: mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.light'
              },
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              padding: '6px'
            }}
            onClick={() => handlerDrawerOpen(!drawerOpen)}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.3rem" />
          </Avatar>
        )}
      </Box>

      {/* header search */}
      {/* <SearchSection /> */}
      <Box sx={{ flexGrow: 1 }} />

      {/* mega-menu */}
      {/* <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <MegaMenuSection />
      </Box> */}

      {/* live customization & localization */}
      {/* <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <LocalizationSection />
      </Box> */}

      {/* notification */}
      {/* <NotificationSection /> */}

      {/* full screen toggler */}
      <Box sx={{ display: { xs: 'none', lg: 'block' } }}>
        <FullScreenSection />
      </Box>

      {/* business selector */}
      <Box sx={{ display: { xs: 'block', sm: 'block' }, mx: 2, width: 300 }}>
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
                    p: 1,
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'center'
                  }}
                >
                  {!hasPersonalContext && (
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddCircleOutlineIcon />}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenPersonalKYC(true);
                      }}
                      sx={{ flex: 1 }}
                    >
                      Add Personal
                    </Button>
                  )}
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<BusinessIcon />}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setOpenAddDialog(true);
                    }}
                    sx={{ flex: 1 }}
                  >
                    Add Business
                  </Button>
                </Box>
              ];
            }

            return (
              <Box {...otherProps} component="li" key={option.id} sx={{ p: 1 }}>
                {option.isPersonal ? (
                  <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', width: '100%' }}>
                    <Stack direction="row" alignItems="center">
                      <Avatar
                        sx={{
                          width: 24,
                          height: 24,
                          mr: 1,
                          py: 2,
                          bgcolor: 'secondary.light',
                          color: 'secondary.dark'
                        }}
                      >
                        {option.name?.charAt(0) || 'P'}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {option.name || option.context_name || 'Personal'}
                      </Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Personal
                    </Typography>
                  </Stack>
                ) : (
                  <Stack direction="column" sx={{ width: '100%', py: 0.8 }}>
                    <Stack direction="row" alignItems="center" sx={{ justifyContent: 'space-between', width: '100%' }}>
                      <Stack direction="row" alignItems="center">
                        <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="body2">{option.name || option.context_name || 'Unnamed Business'}</Typography>
                      </Stack>
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        Business
                      </Typography>
                    </Stack>
                  </Stack>
                )}
              </Box>
            );
          }}
          renderInput={(params) => <TextField {...params} size="small" placeholder="Select or Add Business" />}
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
      {/* <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <MobileSection />
      </Box> */}

      {/* Add Business Dialog */}
      <AddBusiness
        open={openAddDialog}
        onClose={handleAddDialogClose}
        userData={userData}
        setUserData={setUserData}
        getContext={getContext}
      />

      {/* Personal KYC Dialog */}
      <Personal
        open={openPersonalKYC}
        onClose={() => setOpenPersonalKYC(false)}
        onSubmit={handlePersonalKYCSubmit}
        isSubmitting={isSubmitting}
        cancel={true}
      />
    </>
  );
};

export default Header;
