// import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';
// import { useTheme } from '@mui/material/styles';
// import { IconBolt } from '@tabler/icons-react';
// import { Avatar, Box, Button, Grid2, Tab, Tabs, Typography } from '@mui/material';

// import Factory from 'utils/Factory';
// import TabOne from './BusinessProfile';
// // import TabTwo from './Customers';
// // import TabThree from './Goods&Services';
// // import TabFour from './Invoices';
// import MainCard from '../../../ui-component/cards/MainCard';
// // import useCurrentUser from '@/hooks/useCurrentUser';

// const TabPanel = ({ children, value, index }) => (
//   <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
//     {value === index && <Box sx={{ pt: 2.5 }}>{children}</Box>}
//   </div>
// );

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   value: PropTypes.number.isRequired,
//   index: PropTypes.number.isRequired
// };

// const BasicTabs = ({ type }) => {
//   // const { userData } = useCurrentUser();
//   const [activeTab, setActiveTab] = useState(0);
//   const [businessDetails, setBusinessDetails] = useState(null);
//   const [customers, setCustomers] = useState([]);
//   const [postType, setPostType] = useState('');
//   const [loading, setLoading] = useState(true);
//   const theme = useTheme();

//   const tabLabels = ['Business Profile', 'Customers', 'Goods & Services', 'Invoice Number Format'];

//   const handleTabChange = (_event, newTabIndex) => setActiveTab(newTabIndex);

//   const handleNext = () => {
//     if (activeTab < tabLabels.length - 1) setActiveTab((prev) => prev + 1);
//   };

//   const handleBack = () => {
//     if (activeTab > 0) setActiveTab((prev) => prev - 1);
//   };

//   const a11yProps = (index) => ({
//     value: index,
//     id: `simple-tab-${index}`,
//     'aria-controls': `simple-tabpanel-${index}`
//   });

// const getCustomersData = async (id) => {
//   const { res } = await Factory('get', `/invoicing/customer_profiles/?invoicing_profile_id=${id}`, {});
//   if (res?.status_cd === 0) {
//     setCustomers(res.data.customer_profiles);
//   }
// };

// const fetch_business_Details_by_businessId = async () => {
//   let id = userData.user_type === 'Business' ? userData.business_affiliated[0].id : userData.businesssDetails.business[0].id;
//   let url = `/user_management/businesses/${id}/`;
//   const { res } = await Factory('get', url, {});
//   if (res?.status_cd === 0) {
//     setBusinessDetails(res?.data);
//   }
// };

// const fetch_Invoicing_profile = async () => {
//   let id = userData.user_type === 'Business' ? userData.business_affiliated[0].id : userData.businesssDetails.business[0].id;
//   let url = `/invoicing/invoicing-profiles/?business_id=${id}`;
//   const { res } = await Factory('get', url, {});
//   if (res?.status_cd === 0) {
//     setBusinessDetails(res.data);
//     setPostType('put');
//     getCustomersData(res.data.id);
//   } else if (res.status === 404 && res.data.message === 'Invoicing profile not found.') {
//     await fetch_business_Details_by_businessId();
//     setPostType('post');
//   }
//   setLoading(false);
// };

// useEffect(() => {
//   fetch_Invoicing_profile();
// }, []);

//   return (
//     <Grid2 container spacing={{ xs: 2, sm: 3 }}>
//       <Grid2 size={{ xs: 12 }}>
//         <Box sx={{ display: 'flex', justifyContent: 'center' }}>
//           <Tabs
//             variant="scrollable"
//             scrollButtons="auto"
//             value={activeTab}
//             onChange={handleTabChange}
//             aria-label="business profile tabs"
//             {...{ type }}
//           >
//             {tabLabels.map((label, index) => (
//               <Tab
//                 key={index}
//                 label={
//                   <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
//                     <Avatar variant="rounded" sx={{ bgcolor: 'grey.300', width: 32, height: 30 }}>
//                       <IconBolt color={theme.palette.text.primary} />
//                     </Avatar>
//                     <Typography variant="subtitle1">{label}</Typography>
//                   </Box>
//                 }
//                 {...a11yProps(index)}
//               />
//             ))}
//           </Tabs>
//         </Box>
//       </Grid2>

//       <Grid2 size={{ xs: 12 }}>
//         <MainCard>
//           <TabPanel value={activeTab} index={0}>
//             {/* <TabOne businessDetails={businessDetails} setBusinessDetails={setBusinessDetails} handleNext={handleNext} postType={postType} /> */}
//           </TabPanel>
//           {/* <TabPanel value={activeTab} index={1}>
//             <TabTwo
//               getCustomersData={getCustomersData}
//               customers={customers}
//               businessDetails={businessDetails}
//               setBusinessDetails={setBusinessDetails}
//               handleNext={handleNext}
//               handleBack={handleBack}
//             />
//           </TabPanel>
//           <TabPanel value={activeTab} index={2}>
//             <TabThree
//               businessDetails={businessDetails}
//               setBusinessDetails={setBusinessDetails}
//               handleNext={handleNext}
//               handleBack={handleBack}
//             />
//           </TabPanel>
//           <TabPanel value={activeTab} index={3}>
//             <TabFour
//               getCustomersData={getCustomersData}
//               customers={customers}
//               businessDetails={businessDetails}
//               setBusinessDetails={setBusinessDetails}
//               handleBack={handleBack}
//             />
//           </TabPanel> */}
//         </MainCard>
//       </Grid2>
//     </Grid2>
//   );
// };

// BasicTabs.propTypes = {
//   type: PropTypes.any
// };

// export default BasicTabs;
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
// import TabThree from './Goods&Services';
// import TabFour from './Invoices';
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
        {/* <TabThree
          businessDetails={businessDetails}
          setBusinessDetails={setBusinessDetails}
          handleNext={handleNext}
          handleBack={handleBack}
        /> */}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* <TabFour
              getCustomersData={getCustomersData}
              customers={customers}
              businessDetails={businessDetails}
              setBusinessDetails={setBusinessDetails}
              handleBack={handleBack}
            /> */}
      </TabPanel>
    </>
  );
}

TabPanel.propTypes = { children: PropTypes.any, value: PropTypes.any, index: PropTypes.any, other: PropTypes.any };
