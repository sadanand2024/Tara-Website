import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid2';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

// project imports
import UserProfile from './UserProfile';
import Billing from './Billing';
import Payment from './Payment';
import ChangePassword from './ChangePassword';
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone'; // Business Profile
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone'; // Key Managerial Personnel
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone'; // Business Bank Details
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone'; // MSME Settings
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone'; // GST Settings
import MoneyTwoToneIcon from '@mui/icons-material/MoneyTwoTone'; // TDS & Income Tax
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone'; // Payroll Compliance
import GavelTwoToneIcon from '@mui/icons-material/GavelTwoTone'; // Licenses
import SupervisorAccountTwoToneIcon from '@mui/icons-material/SupervisorAccountTwoTone'; // User Management
import UsbTwoToneIcon from '@mui/icons-material/UsbTwoTone'; // DSC Register

// tabs
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <div>{children}</div>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// tabs option
const tabsOption = [
  {
    label: 'Business Profile',
    icon: <ApartmentTwoToneIcon />,
    caption: 'General Business Info'
  },
  {
    label: 'Key Managerial Personnel',
    icon: <GroupsTwoToneIcon />,
    caption: 'Directors, Partners, Key Staff'
  },
  {
    label: 'Business Bank Details',
    icon: <AccountBalanceTwoToneIcon />,
    caption: 'Bank Accounts, IFSC & Statements'
  },
  {
    label: 'MSME Settings',
    icon: <BusinessCenterTwoToneIcon />,
    caption: 'Udyam Registration & MSME Category'
  },
  {
    label: 'GST Settings',
    icon: <ReceiptLongTwoToneIcon />,
    caption: 'GSTIN, LUT, E-way Bill, IEC'
  },
  {
    label: 'TDS & Income Tax',
    icon: <MoneyTwoToneIcon />,
    caption: 'TAN, TDS, PAN Details'
  },
  {
    label: 'Payroll Compliance',
    icon: <BadgeTwoToneIcon />,
    caption: 'EPF, ESI, PT Compliance'
  },
  {
    label: 'Licenses',
    icon: <GavelTwoToneIcon />,
    caption: 'Trade, Shops, FSSAI & Other Licenses'
  },
  {
    label: 'User Management',
    icon: <SupervisorAccountTwoToneIcon />,
    caption: 'Manage Users & Roles'
  },
  {
    label: 'DSC Register',
    icon: <UsbTwoToneIcon />,
    caption: 'Digital Signature Mapping'
  }
];

// ==============================|| PROFILE 2 ||============================== //

export default function Profile2() {
  const { mode, borderRadius } = useConfig();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={12}>
        <MainCard title="Business Settings" content={false}>
          <Grid container spacing={gridSpacing}>
            <Grid size={{ xs: 12, lg: 4 }}>
              <CardContent>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  orientation="vertical"
                  variant="scrollable"
                  sx={{
                    '& .MuiTabs-flexContainer': {
                      borderBottom: 'none'
                    },
                    '& button': {
                      color: mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
                      minHeight: 'auto',
                      minWidth: '100%',
                      py: 1.5,
                      px: 2,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'flex-start',
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      borderRadius: `${borderRadius}px`
                    },
                    '& button.Mui-selected': {
                      color: 'primary.main',
                      bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'grey.50'
                    },
                    '& button > svg': {
                      marginBottom: '0px !important',
                      marginRight: 1.25,
                      marginTop: 1.25,
                      height: 20,
                      width: 20
                    },
                    '& button > div > span': {
                      display: 'block'
                    },
                    '& > div > span': {
                      display: 'none'
                    }
                  }}
                >
                  {tabsOption.map((tab, index) => (
                    <Tab
                      key={index}
                      icon={tab.icon}
                      label={
                        <Grid container direction="column">
                          <Typography variant="subtitle1" color="inherit">
                            {tab.label}
                          </Typography>
                          <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                            {tab.caption}
                          </Typography>
                        </Grid>
                      }
                      {...a11yProps(index)}
                    />
                  ))}
                </Tabs>
              </CardContent>
            </Grid>
            <Grid size={{ xs: 12, lg: 8 }}>
              <CardContent sx={{ borderLeft: '1px solid', borderColor: 'divider', height: '100%' }}>
                <TabPanel value={value} index={0}>
                  <UserProfile />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <Billing />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <Payment />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <ChangePassword />
                </TabPanel>
              </CardContent>
            </Grid>
          </Grid>
          <Divider />
          <CardActions>
            <Grid container sx={{ width: 1, alignContent: 'center', justifyContent: 'space-between' }}>
              <Grid>
                {value > 0 && (
                  <AnimateButton>
                    <Button variant="outlined" size="large" onClick={(e) => handleChange(e, value - 1)}>
                      Back
                    </Button>
                  </AnimateButton>
                )}
              </Grid>
              <Grid>
                {value < 3 && (
                  <AnimateButton>
                    <Button variant="contained" size="large" onClick={(e) => handleChange(e, 1 + value)}>
                      Continue
                    </Button>
                  </AnimateButton>
                )}
              </Grid>
            </Grid>
          </CardActions>
        </MainCard>
      </Grid>
    </Grid>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
