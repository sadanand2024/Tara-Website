import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Stack, Typography, Tabs, Tab, Divider, Paper, Button, Grid2 } from '@mui/material';
import { IconBuildingBank, IconCertificate, IconReceipt } from '@tabler/icons-react';
import EpfComponent from './EPFComponent';
import ESIComponent from './ESIComponent';
import ProfessionalTax from './ProfessionalTax';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index} style={{ width: '100%', height: '100%' }}>
    {value === index && <Box sx={{ p: 0 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const StatutoryComponents = ({ handleNextTab, handleBackTab }) => {
  const [activeTab, setActiveTab] = useState(0);

  const tabLabels = [
    { label: 'EPF', description: 'Employee Provident Fund', icon: <IconBuildingBank size={24} /> },
    { label: 'ESI', description: 'Employee State Insurance', icon: <IconCertificate size={24} /> },
    { label: 'Professional Tax', description: 'Professional Tax Registration', icon: <IconReceipt size={24} /> }
  ];

  const handleTabChange = (_event, newValue) => setActiveTab(newValue);
  const handleNext = () => {
    if (activeTab === tabLabels.length - 1) {
      handleNextTab();
    } else {
      setActiveTab((prev) => (prev < tabLabels.length - 1 ? prev + 1 : prev));
    }
  };
  const handleBack = () => {
    if (activeTab === 0) {
      handleBackTab();
    } else {
      setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  return (
    <Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Salary Component Tabs">
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label.label} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <EpfComponent />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <ESIComponent />
      </TabPanel>
      <TabPanel value={activeTab} index={2}>
        <ProfessionalTax />
      </TabPanel>
      <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 3 }}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleBack} disabled={activeTab === 0}>
          Back
        </Button>
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Stack>
    </Box>
  );
};

StatutoryComponents.propTypes = {};

export default StatutoryComponents;
