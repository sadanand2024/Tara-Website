import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// material-ui
import { useSelector } from 'react-redux';
import MainCard from '../../../ui-component/cards/MainCard';
import { ThemeMode } from 'config';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import PanoramaTwoToneIcon from '@mui/icons-material/PanoramaTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import Factory from 'utils/Factory';
import BusinessProfile from './BusinessProfile';
import BranchesInfo from './BranchesInfo';
import Customers from './Customers';
import GoodsServices from './Goods&Services';
import InvoiceNumberFormat from './InvoiceNumberFormat';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { Grid2, Typography, CardContent, Tabs, Tab, Divider, CardActions, Button, Box } from '@mui/material';
import { gridSpacing } from 'store/constant';
import useConfig from 'hooks/useConfig';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import GSTSettings from 'views/application/Business/GSTSettings';

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
  const { mode, borderRadius } = useConfig();
  const [value, setValue] = useState(0);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const user = useSelector((state) => state.accountReducer?.user);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleNext = () => {
    if (value < 4) setValue((prev) => prev + 1);
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
    fetch_Invoicing_profile();
  }, [value]);
  const tabsOption = [
    {
      label: 'Business Profile',
      icon: <PersonOutlineTwoToneIcon />
    },
    {
      label: 'GST Settings',
      icon: <ReceiptLongTwoToneIcon />
    },
    {
      label: 'Branches - Info',
      icon: <LocationCityIcon />
    },

    {
      label: 'Customers',
      icon: <RecentActorsTwoToneIcon />
    },
    {
      label: 'Goods & Services',
      icon: <PeopleAltTwoToneIcon />
    },
    {
      label: 'Invoice Number Format',
      icon: <PanoramaTwoToneIcon />
    }
  ];
  return (
    <MainCard title="Invoicing Settings">
      <Grid2 container spacing={gridSpacing}>
        <Grid2 size={{ xs: 12, lg: 2 }}>
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
                  px: 0,
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
                    <Grid2 container direction="column">
                      <Typography variant="subtitle1" color="inherit" sx={{ mt: 1 }}>
                        {tab.label}
                      </Typography>
                      {/* <Typography variant="caption" sx={{ textTransform: 'capitalize' }}>
                        {tab.caption}
                      </Typography> */}
                    </Grid2>
                  }
                  {...a11yProps(index)}
                />
              ))}
            </Tabs>
          </CardContent>
        </Grid2>
        <Grid2 size={{ xs: 12, lg: 10 }}>
          <CardContent sx={{ borderLeft: '1px solid', borderColor: 'divider', height: '100%' }}>
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
              <GSTSettings user={user} tabChange={handleChange} tabval={value} />
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
        </Grid2>
      </Grid2>
      <Divider />
    </MainCard>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
