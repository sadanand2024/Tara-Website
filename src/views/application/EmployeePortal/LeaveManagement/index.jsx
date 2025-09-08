import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Tabs, Tab, List, ListItem, ListItemText, Divider, Paper } from '@mui/material';
import { useSelector } from 'store';
import { useSearchParams } from 'react-router-dom';
import ApplyLeave from './ApplyLeave';
import PendingLeaves from './PendingLeaves';
import LeaveHistory from './LeaveHistory';
import MainCard from 'ui-component/cards/MainCard';


function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`leave-tabpanel-${index}`} aria-labelledby={`leave-tab-${index}`} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `leave-tab-${index}`,
    'aria-controls': `leave-tabpanel-${index}`
  };
}

const LeaveManagement = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      const tabIndex = parseInt(tabParam);
      if (tabIndex >= 0 && tabIndex <= 2) {
        setTabValue(tabIndex);
      }
    }
  }, [searchParams]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    setSearchParams({ tab: newValue.toString() });
  };

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Card>
    );
  }

  return (
    <MainCard>
      <Box sx={{ flexGrow: 1 }}>
        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="leave management tabs">
            <Tab label="Apply" {...a11yProps(0)} />
            <Tab label="Pending" {...a11yProps(1)} />
            <Tab label="History" {...a11yProps(2)} />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={tabValue} index={0}>
          <ApplyLeave />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PendingLeaves />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <LeaveHistory />
        </TabPanel>
      </Box>
    </MainCard>
  );
};

export default LeaveManagement;
