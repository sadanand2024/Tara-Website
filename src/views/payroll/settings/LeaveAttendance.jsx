'use client';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Tab, Tabs } from '@mui/material';
import React, { useState } from 'react';
import { Button, Box, Typography, Stack } from '@mui/material';
import HomeCard from '@/components/cards/HomeCard';
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import HolidayManagement from './HolidayManagement';
import LeaveManagement from './LeaveManagement';

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

const LeaveAttendance = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab
  const router = useRouter();

  // Function to handle tab changes
  const handleTabChange = (_event, newTabIndex) => setActiveTab(newTabIndex);

  // Accessibility props for tabs
  const a11yProps = (index) => ({
    value: index,
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  // Tab labels
  const tabLabels = ['Holiday Management', 'leave Management'];
  const handleNext = () => {
    if (activeTab < tabLabels.length - 1) {
      setActiveTab((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeTab > 0) {
      setActiveTab((prev) => prev - 1);
    }
  };

  return (
    <HomeCard title="Leave & Attendance" tagline="Setup your organization before starting payroll">
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Statutory Components Tabs">
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} {...a11yProps(index)} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <HolidayManagement handleNext={handleNext} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <LeaveManagement handleNext={handleNext} />
      </TabPanel>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            router.back();
          }}
        >
          Back to Dashboard
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            handleBack();
          }}
          disabled={activeTab === 0}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleNext();
          }}
          disabled={activeTab === tabLabels.length - 1}
        >
          Next
        </Button>
      </Box>
    </HomeCard>
  );
};

LeaveAttendance.propTypes = {
  type: PropTypes.any
};

export default LeaveAttendance;
