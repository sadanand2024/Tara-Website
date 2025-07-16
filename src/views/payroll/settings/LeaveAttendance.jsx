import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { Box, Button, Stack, Tabs, Tab, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

const LeaveAttendance = ({
  type,
  handleBack,
  handleNext,
  activeTab = 0,
  setActiveTab,
  leaveType = 'All',
  setLeaveType,
  onAddHoliday,
  onAddLeave
}) => {
  const navigate = useNavigate();

  const tabLabels = ['Holiday Management', 'Leave Management'];

  const handleTabChange = (_e, newValue) => {
    if (setActiveTab) {
      setActiveTab(newValue);
    }
  };

  const handleNextTab = () => {
    if (activeTab < tabLabels.length - 1) {
      if (setActiveTab) {
        setActiveTab((prev) => prev + 1);
      }
    }
  };

  const handleBackTab = () => {
    if (activeTab > 0) {
      if (setActiveTab) {
        setActiveTab((prev) => prev - 1);
      }
    }
  };

  // Custom handleNext for Holiday Management tab
  const handleHolidayNext = () => {
    if (activeTab === 0) {
      // If on Holiday Management tab, go to Leave Management tab
      handleNextTab();
    } else {
      // If on Leave Management tab, navigate to /app/payroll
      navigate('/app/payroll');
    }
  };

  // Custom handleBack for tab navigation
  const handleHolidayBack = () => {
    if (activeTab === 1) {
      // If on Leave Management tab, go back to Holiday Management tab
      handleBackTab();
    } else {
      // If on Holiday Management tab, use the original handleBack
      handleBack();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' }); // or 'auto'
  }, [activeTab]);

  return (
    <Box>
      <Box sx={{ width: '100%' }}>
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
        <HolidayManagement handleBack={handleHolidayBack} handleNext={handleHolidayNext} onAddClick={onAddHoliday} />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <LeaveManagement
          handleBack={handleHolidayBack}
          handleNext={handleHolidayNext}
          leaveType={leaveType}
          setLeaveType={setLeaveType}
          onAddClick={onAddLeave}
        />
      </TabPanel>
    </Box>
  );
};

LeaveAttendance.propTypes = {
  type: PropTypes.any,
  handleBack: PropTypes.func,
  handleNext: PropTypes.func,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func,
  leaveType: PropTypes.string,
  setLeaveType: PropTypes.func,
  onAddHoliday: PropTypes.func,
  onAddLeave: PropTypes.func
};

export default LeaveAttendance;
