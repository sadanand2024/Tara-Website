import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Chip from '@mui/material/Chip';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useSelector } from 'react-redux';

// project imports
import { ThemeMode } from 'config';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import PanoramaTwoToneIcon from '@mui/icons-material/PanoramaTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';

//
import Factory from 'utils/Factory';
import TabOne from './BusinessProfile';
import TabTwo from './Customers';
import TabThree from './Goods&Services';
import TabFour from './Invoices';
// tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

// ================================|| UI TABS - SAMPLE ||================================ //

export default function SimpleTabs() {
  const theme = useTheme();
  const [value, setValue] = React.useState(0);
  const [businessDetails, setBusinessDetails] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state).accountReducer.user;
  const [customers, setCustomers] = useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleNext = () => {
    if (activeTab < tabLabels.length - 1) setActiveTab((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeTab > 0) setActiveTab((prev) => prev - 1);
  };

  const getCustomersData = async (id) => {
    const { res } = await Factory('get', `/invoicing/customer_profiles/?invoicing_profile_id=${id}`, {});
    if (res?.status_cd === 0) {
      setCustomers(res.data.customer_profiles);
    }
  };

  const fetch_business_Details_by_businessId = async () => {
    let businessId = user.active_context.business_id;
    let url = `/user_management/businesses/${businessId}/`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setBusinessDetails(res?.data);
    }
  };
  const fetch_Invoicing_profile = async () => {
    let businessId = user.active_context.business_id;

    let url = `/invoicing/invoicing-profiles/?business_id=${businessId}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setBusinessDetails(res.data);
      setPostType('put');
      getCustomersData(res.data.id);
    } else if (res.status === 404 && res.data.message === 'Invoicing profile not found.') {
      await fetch_business_Details_by_businessId();
      setPostType('post');
    }
    setLoading(false);
  };
  useEffect(() => {
    fetch_Invoicing_profile();
  }, []);
  return (
    <>
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
        <Tab icon={<RecentActorsTwoToneIcon sx={{ fontSize: '1.3rem' }} />} iconPosition="start" label="Customers" {...a11yProps(1)} />
        <Tab
          icon={<PeopleAltTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
          label={'Goods & Services'}
          iconPosition="start"
          {...a11yProps(2)}
        />
        <Tab
          icon={<PanoramaTwoToneIcon sx={{ fontSize: '1.3rem' }} />}
          iconPosition="start"
          label="Invoice Number Format"
          {...a11yProps(3)}
        />
      </Tabs>
      <TabPanel value={value} index={0}>
        <TabOne businessDetails={businessDetails} setBusinessDetails={setBusinessDetails} postType={postType} />
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
    </>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
