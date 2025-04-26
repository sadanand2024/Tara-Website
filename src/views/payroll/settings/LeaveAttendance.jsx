'use client';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { Box, Button, Stack, Tabs, Tab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import HolidayManagement from './HolidayManagement';
import LeaveManagement from './LeaveManagement';

// Tab Panel Component
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const LeaveAttendance = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();

  const tabLabels = ['Holiday Management', 'Leave Management'];

  const handleTabChange = (_e, newValue) => setActiveTab(newValue);

  const handleNext = () => {
    if (activeTab < tabLabels.length - 1) setActiveTab((prev) => prev + 1);
  };

  const handleBack = () => {
    if (activeTab > 0) setActiveTab((prev) => prev - 1);
  };

  return (
    <MainCard title="Leave & Attendance" tagline="Setup your organization before starting payroll">
      <Box sx={{ width: '100%', mb: 2 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': { textTransform: 'none', fontWeight: 500 }
          }}
        >
          {tabLabels.map((label, idx) => (
            <Tab key={idx} label={label} />
          ))}
        </Tabs>
      </Box>

      {/* Render Content Based on Active Tab */}
      <TabPanel value={activeTab} index={0}>
        <HolidayManagement handleNext={handleNext} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <LeaveManagement handleNext={handleNext} />
      </TabPanel>

      {/* Navigation Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 3, justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back to Dashboard
        </Button>

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleBack} disabled={activeTab === 0}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext} disabled={activeTab === tabLabels.length - 1}>
            Next
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
};

LeaveAttendance.propTypes = {
  type: PropTypes.any
};

export default LeaveAttendance;
