import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// material-ui
import { useSelector } from 'react-redux';
import MainCard from '../../../ui-component/cards/MainCard';
import { ThemeMode } from 'config';
import {
  IconBuilding,
  IconMapPin,
  IconGitBranch,
  IconIdBadge,
  IconGavel,
  IconCurrencyDollar,
  IconFileDescription,
  IconUsers,
  IconCalendarTime,
  IconCalendarEvent
} from '@tabler/icons-react';
import Factory from 'utils/Factory';
import BusinessProfile from './BusinessProfile';
import BranchesInfo from './BranchesInfo';
import Customers from './Customers';
import GoodsServices from './Goods&Services';
import InvoiceNumberFormat from './InvoiceNumberFormat';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Grid2, Typography, CardContent, Tabs, Tab, Divider, CardActions, Button, Box, CardHeader, Card } from '@mui/material';
import { gridSpacing } from 'store/constant';
import useConfig from 'hooks/useConfig';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import GSTSettings from 'views/application/Business/GSTSettings';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useSearchParams } from 'react-router-dom';
import InvoiceOnboarding from '../../../ui-component/onBoarding/InvoiceOnboarding';
import { useNavigate } from 'react-router-dom';
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function SimpleTabs() {
  // Inside your component:
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md')); // Change layout for md and below

  const { mode, borderRadius } = useConfig();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const user = useSelector((state) => state.accountReducer?.user);
  const [searchParams] = useSearchParams();
  const [invoiceOnboarding, setInvoiceOnboarding] = useState(false);
  const navigate = useNavigate();
  const getInvoicingUsage = async () => {
    //   const moduleUsageRes = await Factory('post', `/user_management/usage-summary/${}`, {});
    //   if (moduleUsageRes.res.status_cd === 0) {
    //     console.log(moduleUsageRes.res);
    //   }
  };
  useEffect(() => {
    getInvoicingUsage();
  }, []);

  useEffect(() => {
    const from = searchParams.get('from');
    const tabValue = Number(searchParams.get('tab'));
    if (from === 'invoice') {
      setValue(tabValue);
    }
  }, [searchParams]);

  useEffect(() => {
    const tabValue = searchParams.get('tabValue');
    if (tabValue) setValue(Number(tabValue));
  }, [searchParams]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const params = new URLSearchParams(searchParams);
    params.set('tabValue', newValue);
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleNext = () => {
    if (value < 5) setValue((prev) => prev + 1);
  };

  const handleBack = () => {
    if (value > 0) setValue((prev) => prev - 1);
  };

  const getCustomersData = async (id) => {
    const { res } = await Factory('get', `/invoicing/customer_profiles/?invoicing_profile_id=${id}`, {});
    if (res?.status_cd === 0) {
      setCustomers(res.data.customer_profiles);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data) || 'Failed to load customers',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const fetch_business_Details_by_businessId = async () => {
    const businessId = user.active_context.business_id;
    const url = `/user_management/businesses/${businessId}/`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setBusinessDetails(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data) || 'Failed to load business details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const fetch_Invoicing_profile = async () => {
    const businessId = user.active_context.business_id;
    const url = `/invoicing/invoicing-profiles/?business_id=${businessId}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      const invoicingProfile = res.data;
      const normalized = {
        ...invoicingProfile.business,
        gstin: invoicingProfile.gstin,
        gst_registered: invoicingProfile.gst_registered,
        bank_name: invoicingProfile.bank_name,
        account_number: invoicingProfile.account_number,
        ifsc_code: invoicingProfile.ifsc_code,
        swift_code: invoicingProfile.swift_code,
        gst_details: invoicingProfile.gst_details || [],
        invoicing_profile_id: invoicingProfile.id,
        invoice_format: invoicingProfile.invoice_format || [],
        signature: invoicingProfile.signature || null
      };

      setBusinessDetails(normalized);
      setPostType('put');
      getCustomersData(invoicingProfile.id);
    } else if (res.status === 404 && res.data.message === 'Invoicing profile not found.') {
      await fetch_business_Details_by_businessId(); // this returns already flattened structure
      setPostType('post');
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data) || 'Failed to load invoicing profile',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setPostType('post');
    }
    setLoading(false);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // or 'auto'
  }, [value]);
  useEffect(() => {
    fetch_Invoicing_profile();
  }, [value]);

  const tabsOption = [
    {
      label: 'Business Profile',
      icon: <IconBuilding />
    },
    {
      label: 'GST Settings',
      icon: <ReceiptLongTwoToneIcon />
    },
    {
      label: 'Branches - Info',
      icon: <IconMapPin />
    },

    {
      label: 'Customers',
      icon: <IconUsers />
    },
    {
      label: 'Goods & Services',
      icon: <IconCurrencyDollar />
    },
    {
      label: 'Invoice Number Format',
      icon: <IconFileDescription />
    }
  ];

  return (
    <>
      {invoiceOnboarding && <InvoiceOnboarding onFinish={() => setInvoiceOnboarding(false)} />}
      <Card
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          // height: '100%',
          minHeight: '800px',
          overflow: 'hidden'
        }}
      >
        {/* Header at the top */}
        <CardHeader title="Invoicing Settings" />
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
          <div className="INV-Step-1">
            <Tabs
              value={value}
              onChange={handleChange}
              orientation={isSmallScreen ? 'horizontal' : 'vertical'}
              variant="scrollable"
              sx={{
                height: '100%',
                minWidth: isSmallScreen ? '100%' : 240,
                borderRight: isSmallScreen ? 'none' : '1px solid',
                borderBottom: isSmallScreen ? '1px solid' : 'none',
                borderColor: 'divider',
                '& .MuiTabs-flexContainer': {
                  flexDirection: isSmallScreen ? 'row' : 'column'
                },
                '& button': {
                  color: mode === ThemeMode.DARK ? 'grey.600' : 'grey.900',
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
                '& .Mui-selected': {
                  color: 'primary.main',
                  bgcolor: mode === ThemeMode.DARK ? 'dark.main' : 'primary.light'
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
                    color: 'text.primary',
                    '&:hover': {
                      backgroundColor: 'primary.light'
                    }
                  }}
                  label={tab.label}
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </div>
          {/* TabPanels content section */}
          <div
            className="INV-Step-2"
            style={{
              width: '100%'
            }}
          >
            <CardContent
              sx={{
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: isSmallScreen ? 0 : 0,
                paddingRight: 0,
                flexGrow: 1,
                width: '100%',
                overflowY: 'auto'
              }}
            >
              <TabPanel value={value} index={0}>
                <BusinessProfile
                  businessDetails={businessDetails}
                  setBusinessDetails={setBusinessDetails}
                  postType={postType}
                  handleNext={handleNext}
                  setTabValue={setValue}
                />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <GSTSettings
                  user={user}
                  tabChange={handleChange}
                  tabval={value}
                  from="invoice"
                  handleBack={handleBack}
                  handleNext={handleNext}
                />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <BranchesInfo
                  businessDetails={businessDetails}
                  setBusinessDetails={setBusinessDetails}
                  postType={postType}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              </TabPanel>
              <TabPanel value={value} index={3}>
                <Customers
                  getCustomersData={getCustomersData}
                  customers={customers}
                  businessDetails={businessDetails}
                  setBusinessDetails={setBusinessDetails}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              </TabPanel>
              <TabPanel value={value} index={4}>
                <GoodsServices
                  businessDetails={businessDetails}
                  setBusinessDetails={setBusinessDetails}
                  handleNext={handleNext}
                  handleBack={handleBack}
                />
              </TabPanel>
              <TabPanel value={value} index={5}>
                <InvoiceNumberFormat
                  getCustomersData={getCustomersData}
                  customers={customers}
                  businessDetails={businessDetails}
                  setBusinessDetails={setBusinessDetails}
                  handleBack={handleBack}
                />
              </TabPanel>
            </CardContent>
          </div>
        </Box>
      </Card>
    </>
  );
}
