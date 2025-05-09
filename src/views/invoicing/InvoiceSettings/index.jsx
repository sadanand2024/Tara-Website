import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
// material-ui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';
import MainCard from '../../../ui-component/cards/MainCard';
import { ThemeMode } from 'config';
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import PanoramaTwoToneIcon from '@mui/icons-material/PanoramaTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import Factory from 'utils/Factory';
import TabOne from './BusinessProfile';
import TabTwo from './Customers';
import TabThree from './Goods&Services';
import TabFour from './InvoiceNumberFormat';
import { Grid2 } from '@mui/material';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
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
  const theme = useTheme();
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
    if (value < 3) setValue((prev) => prev + 1);
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
        invoice_format: invoicingProfile.invoice_format || []
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

  return (
    <MainCard title="Invoicing Settings">
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <Tabs
            value={value}
            variant="scrollable"
            onChange={handleChange}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                minHeight: 'auto',
                minWidth: 10,
                py: 1.5,
                px: 1,
                mr: 2.2,
                color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900'
              },
              '& .Mui-selected': { color: 'primary.main' }
            }}
          >
            <Tab
              icon={<PersonOutlineTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
              iconPosition="start"
              label="Business Profile"
              {...a11yProps(0)}
            />
            <Tab
              icon={<RecentActorsTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
              iconPosition="start"
              label="Customers"
              disabled={!businessDetails?.invoicing_profile_id}
              {...a11yProps(1)}
            />
            <Tab
              icon={<PeopleAltTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
              label={'Goods & Services'}
              iconPosition="start"
              disabled={!businessDetails?.invoicing_profile_id}
              {...a11yProps(2)}
            />
            <Tab
              icon={<PanoramaTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
              iconPosition="start"
              label="Invoice Number Format"
              disabled={!businessDetails?.invoicing_profile_id}
              {...a11yProps(3)}
            />
          </Tabs>

          <TabPanel value={value} index={0}>
            <TabOne businessDetails={businessDetails} setBusinessDetails={setBusinessDetails} postType={postType} handleNext={handleNext} />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <TabTwo
              getCustomersData={getCustomersData}
              customers={customers}
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <TabThree
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
              handleNext={handleNext}
              handleBack={handleBack}
            />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <TabFour
              getCustomersData={getCustomersData}
              customers={customers}
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
              handleBack={handleBack}
            />
          </TabPanel>
        </Grid2>
      </Grid2>
    </MainCard>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
