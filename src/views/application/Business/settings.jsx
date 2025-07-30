import { useEffect } from 'react';
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
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';
import MainCard from 'ui-component/cards/MainCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';
import { useSelector } from 'store';
import { useSearchParams } from 'react-router-dom';

// assets
import ApartmentTwoToneIcon from '@mui/icons-material/ApartmentTwoTone'; // Business Profile
import GroupsTwoToneIcon from '@mui/icons-material/GroupsTwoTone'; // Key Managerial Personnel
import AccountBalanceTwoToneIcon from '@mui/icons-material/AccountBalanceTwoTone'; // Business Bank Details
import BusinessCenterTwoToneIcon from '@mui/icons-material/BusinessCenterTwoTone'; // MSME Settings
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone'; // GST Settings
import MoneyTwoToneIcon from '@mui/icons-material/MoneyTwoTone'; // TDS & Income Tax
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone'; // Payroll Compliance
import GavelTwoToneIcon from '@mui/icons-material/GavelTwoTone'; // Licenses
import UsbTwoToneIcon from '@mui/icons-material/UsbTwoTone'; // DSC Register
import BusinessProfile from './BusinessProfile';
import BusinessBankDetails from './BusinessBankDetails';
import KeyManagerialPersonnel from './KeyManagerialPersonnel';
import MSMESettings from './MSMESettings';
import GSTSettings from './GSTSettings';
import TDSAndIncomeTax from './TDSAndIncomeTax';
import PayrollCompliance from './PayrollCompliance';
import Licenses from './Licenses';
import DSCRegister from './DSCRegister';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Card, CardHeader } from '@mui/material';
// tabs
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
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
    label: 'Business Bank Details',
    icon: <AccountBalanceTwoToneIcon />,
    caption: 'Bank Accounts, IFSC & Statements'
  },
  {
    label: 'Key Managerial Personnel',
    icon: <GroupsTwoToneIcon />,
    caption: 'Directors, Partners, Key Staff'
  },
  // {
  //   label: 'MSME Settings',
  //   icon: <BusinessCenterTwoToneIcon />,
  //   caption: 'Udyam Reg. & MSME Category'
  // },
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
  // {
  //   label: 'Payroll Compliance',
  //   icon: <BadgeTwoToneIcon />,
  //   caption: 'EPF, ESI, PT Compliance'
  // },
  {
    label: 'Licenses',
    icon: <GavelTwoToneIcon />,
    caption: 'Trade, Shops, FSSAI & Other Licenses'
  },
  {
    label: 'DSC Register',
    icon: <UsbTwoToneIcon />,
    caption: 'Digital Signature Mapping'
  }
];

// ==============================|| PROFILE 2 ||============================== //

export default function Profile2() {
  const theme = useTheme();
  const { mode, borderRadius } = useConfig();
  const [value, setValue] = React.useState(0);
  const user = useSelector((state) => state.accountReducer.user);
  const [searchParams] = useSearchParams();
  const tabvalue = searchParams.get('tabvalue');
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    if (tabvalue) {
      setValue(Number(tabvalue));
    }
  }, [tabvalue]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleNext = () => {
    setValue(value + 1);
  };
  const handleBack = () => {
    setValue(value - 1);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // or 'auto'
  }, [value]);
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '800px',
        overflow: 'hidden'
      }}
    >
      {/* Header at the top */}
      <CardHeader title="Business Settings" />
      <Divider />
      {/* Main content area: Tabs + TabPanels */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isSmallScreen ? 'column' : 'row',
          flexGrow: 1,
          overflow: 'hidden'
        }}
      >
        {/* Tabs section */}
        <Tabs
          value={value}
          onChange={handleChange}
          orientation={isSmallScreen ? 'horizontal' : 'vertical'}
          variant="scrollable"
          sx={{
            minWidth: isSmallScreen ? '100%' : 320,
            borderRight: isSmallScreen ? 'none' : '1px solid',
            borderBottom: isSmallScreen ? '1px solid' : 'none',
            borderColor: 'divider',
            '& .MuiTabs-flexContainer': {
              flexDirection: isSmallScreen ? 'row' : 'column'
            },
            '& button': {
              color: mode === 'dark' ? 'grey.600' : 'grey.900',
              minHeight: 'auto',
              minWidth: isSmallScreen ? 'auto' : '100%',
              py: 1.5,
              px: 2,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: 1,
              borderRadius: `${borderRadius}px`,
              mx: isSmallScreen ? 0.5 : 0
            },
            '& button.Mui-selected': {
              color: 'primary.main',
              bgcolor: mode === 'dark' ? 'dark.main' : 'primary.light'
            },
            '& button > svg': {
              height: 20,
              width: 20
            },
            '& > div > span': {
              display: 'none'
            },
            padding: 2
          }}
        >
          {tabsOption.map((tab, index) => (
            <Tab
              key={index}
              icon={tab.icon}
              sx={{
                mt: 0.5,
                '&:hover': {
                  backgroundColor: 'primary.light'
                }
              }}
              label={
                <Box>
                  <Typography variant="subtitle1" color="inherit" noWrap sx={{ textAlign: 'left' }}>
                    {tab.label}
                  </Typography>
                  <Typography variant="caption" sx={{ textTransform: 'capitalize', textAlign: 'left', whiteSpace: 'break-spaces' }}>
                    {tab.caption}
                  </Typography>
                </Box>
              }
              {...a11yProps(index)}
            />
          ))}
        </Tabs>

        {/* TabPanels content section */}
        <Box sx={{ flexGrow: 1, width: '100%', overflowY: 'auto' }}>
          <CardContent
            sx={{
              paddingTop: 0,
              paddingBottom: 0,
              paddingLeft: isSmallScreen ? 0 : 0,
              paddingRight: 0
            }}
          >
            <TabPanel value={value} index={0}>
              <BusinessProfile user={user} tabChange={handleChange} tabval={value} />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <BusinessBankDetails user={user} handleNext={handleNext} handleBack={handleBack} tabChange={handleChange} tabval={value} />
            </TabPanel>
            <TabPanel value={value} index={2}>
              <KeyManagerialPersonnel user={user} handleNext={handleNext} handleBack={handleBack} tabChange={handleChange} tabval={value} />
            </TabPanel>
            {/* <TabPanel value={value} index={3}>
              <MSMESettings />
            </TabPanel> */}
            <TabPanel value={value} index={3}>
              <GSTSettings user={user} handleNext={handleNext} handleBack={handleBack} tabChange={handleChange} tabval={value} />
            </TabPanel>
            <TabPanel value={value} index={4}>
              <TDSAndIncomeTax user={user} handleNext={handleNext} handleBack={handleBack} tabChange={handleChange} tabval={value} />
            </TabPanel>
            {/* <TabPanel value={value} index={5}>
              <PayrollCompliance user={user} tabChange={handleChange} tabval={value} />
            </TabPanel> */}
            <TabPanel value={value} index={5}>
              <Licenses user={user} handleNext={handleNext} handleBack={handleBack} tabChange={handleChange} tabval={value} />
            </TabPanel>
            <TabPanel value={value} index={6}>
              <DSCRegister user={user} handleNext={handleNext} handleBack={handleBack} tabChange={handleChange} tabval={value} />
            </TabPanel>
          </CardContent>
        </Box>
      </Box>
      <Divider />
    </Card>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
