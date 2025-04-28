import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Tabs, Tab, Divider, Paper, Button, Grid2 } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import { IconBuildingBank, IconCertificate, IconReceipt } from '@tabler/icons-react';
import EpfComponent from './EPFComponent';
import ESIComponent from './ESIComponent';
import ProfessionalTax from './ProfessionalTax';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} style={{ width: '100%', height: '100%' }}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const StatutoryComponents = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabConfig = [
    { label: 'EPF', description: 'Employee Provident Fund', icon: <IconBuildingBank size={24} /> },
    { label: 'ESI', description: 'Employee State Insurance', icon: <IconCertificate size={24} /> },
    { label: 'Professional Tax', description: 'Professional Tax Registration', icon: <IconReceipt size={24} /> }
  ];

  const handleTabChange = (_event, newValue) => setActiveTab(newValue);
  const handleNext = () => setActiveTab((prev) => (prev < tabConfig.length - 1 ? prev + 1 : prev));
  const handleBack = () => setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));

  return (
    <MainCard title="Statutory Components">
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 2,
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? 'linear-gradient(145deg, rgba(30,30,30,0.8) 0%, rgba(40,40,40,0.8) 100%)'
              : 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.8) 100%)'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: 'primary.main' },
            '& .MuiTab-root': {
              minHeight: 36,
              minWidth: 'auto'
            }
          }}
        >
          {tabConfig.map((tab, index) => (
            <Tab
              key={index}
              label={
                <Stack direction="row" spacing={2} alignItems="center">
                  {tab.icon}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'inherit' }}>
                    {tab.label}
                  </Typography>
                </Stack>
              }
              sx={{
                textTransform: 'none',
                fontWeight: activeTab === index ? 600 : 400,
                mr: 2,
                borderRadius: 1,
                bgcolor: activeTab === index ? 'action.selected' : 'transparent'
              }}
            />
          ))}
        </Tabs>
      </Paper>

      <Box>
        <TabPanel value={activeTab} index={0}>
          <EpfComponent handleNext={handleNext} />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <ESIComponent handleNext={handleNext} handleBack={handleBack} />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ProfessionalTax handleNext={handleNext} handleBack={handleBack} />
        </TabPanel>
      </Box>
    </MainCard>
  );
};

StatutoryComponents.propTypes = {
  type: PropTypes.any
};

export default StatutoryComponents;
