import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';
import { useSelector } from 'store';
import AttendanceInfoTab from './AttendanceInfoTab';
import AttendanceMasterTab from './AttendanceMasterTab';

const Attendance = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [tabValue, setTabValue] = useState(0);

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Box>
    );
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Attendance Info" />
          <Tab label="Attendance Master" />
        </Tabs>
      </Box>

      {/* Tab Content */}
      {tabValue === 0 && <AttendanceInfoTab />}
      {tabValue === 1 && <AttendanceMasterTab />}
    </Box>
  );
};

export default Attendance;
