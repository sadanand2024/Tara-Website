'use client';
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import MainCard from '../../../ui-component/cards/MainCard';
import { useNavigate } from 'react-router';
import EarningsComponent from './Earnings';

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

const SalaryComponentTabs = ({ type }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState('');

  const handleTabChange = (_event, newValue) => setActiveTab(newValue);

  const handleNext = () => {
    if (activeTab < tabLabels.length - 1) setActiveTab((prev) => prev + 1);
  };

  const tabLabels = ['Earnings' /*, 'Deductions'*/]; // Future tabs can be added here

  return (
    <MainCard
      title="Salary Components"
      secondary={
        <Stack direction="row" spacing={2}>
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
      }
    >
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Salary Component Tabs">
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
          ))}
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        <EarningsComponent handleNext={handleNext} open={open} setOpen={setOpen} postType={postType} setPostType={setPostType} />
      </TabPanel>
    </MainCard>
  );
};

SalaryComponentTabs.propTypes = {
  type: PropTypes.any
};

export default SalaryComponentTabs;
