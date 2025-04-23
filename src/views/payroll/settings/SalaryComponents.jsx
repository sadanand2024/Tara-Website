'use client';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import EarningsComponent from './Earnings';
import HomeCard from '@/components/cards/HomeCard';
import MainCard from '@/components/MainCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/***************************  NAVIGATION - TABS  ***************************/

// TabPanel component to render the content for each tab
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`}>
    {value === index && <Box sx={{ pt: 2.5 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const SalaryComponnetTabs = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState('');

  // Function to handle tab changes
  const handleTabChange = (_event, newTabIndex) => setActiveTab(newTabIndex);

  // Accessibility props for tabs
  const a11yProps = (index) => ({
    value: index,
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  // Tab labels
  const tabLabels = [
    'Earnings'
    //  'Deductions'
  ];
  const handleNext = () => {
    setActiveTab((prev) => (prev < 3 ? prev + 1 : prev));
  };
  const handleBack = () => {
    setActiveTab((prev) => (prev < 3 ? prev - 1 : prev));
  };
  return (
    <HomeCard
      title="Salary Components"
      tagline="Create and manage different locations of Your Organization."
      CustomElement={() => (
        <Stack direction="row" sx={{ gap: 2 }}>
          <Button
            variant="contained"
            onClick={() => {
              setPostType('post');
              setOpen(true);
            }}
          >
            Add Component
          </Button>
        </Stack>
      )}
    >
      <MainCard>
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="Statutory Components Tabs">
            {tabLabels.map((label, index) => (
              <Tab key={index} label={label} {...a11yProps(index)} />
            ))}
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <EarningsComponent handleNext={handleNext} open={open} setOpen={setOpen} postType={postType} setPostType={setPostType} />
        </TabPanel>
      </MainCard>
    </HomeCard>
  );
};

SalaryComponnetTabs.propTypes = {
  type: PropTypes.any
};

export default SalaryComponnetTabs;
