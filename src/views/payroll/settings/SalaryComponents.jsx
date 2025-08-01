import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack, Tab, Tabs } from '@mui/material';
import EarningsComponent from './Earnings';
import Deductions from './Deductions';

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

const SalaryComponentTabs = ({
  type,
  handleBack,
  handleNext,
  openDialog = false,
  setOpenDialog,
  activeTab: parentActiveTab,
  setActiveTab: setParentActiveTab
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [postType, setPostType] = useState('');

  // Set postType to 'post' when dialog opens for adding new component
  React.useEffect(() => {
    if (openDialog && !postType) {
      setPostType('post');
    }
  }, [openDialog, postType]);

  // Sync local activeTab with parent's activeTab
  React.useEffect(() => {
    if (parentActiveTab !== undefined && parentActiveTab !== activeTab) {
      setActiveTab(parentActiveTab);
    }
  }, [parentActiveTab, activeTab]);

  const handleTabChange = (_event, newValue) => {
    setActiveTab(newValue);
    // Update parent component's active tab state
    if (setParentActiveTab) {
      setParentActiveTab(newValue);
    }
  };

  const handleTabNext = () => {
    if (activeTab < tabLabels.length - 1) setActiveTab((prev) => prev + 1);
  };

  const tabLabels = ['Earnings', 'Deductions']; // Future tabs can be added here

  return (
    <Box>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="Salary Component Tabs">
          {tabLabels.map((label, index) => (
            <Tab key={index} label={label} id={`simple-tab-${index}`} aria-controls={`simple-tabpanel-${index}`} />
          ))}
        </Tabs>
      </Box>

      <TabPanel value={activeTab} index={0}>
        <EarningsComponent
          handleBack={handleBack}
          handleNext={handleNext}
          open={openDialog}
          setOpen={setOpenDialog}
          postType={postType}
          setPostType={setPostType}
        />
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        <Deductions
          handleBack={handleBack}
          handleNext={handleNext}
          open={openDialog}
          setOpen={setOpenDialog}
          postType={postType}
          setPostType={setPostType}
        />
      </TabPanel>
    </Box>
  );
};

SalaryComponentTabs.propTypes = {
  type: PropTypes.any,
  handleBack: PropTypes.func,
  handleNext: PropTypes.func,
  openDialog: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  activeTab: PropTypes.number,
  setActiveTab: PropTypes.func
};

export default SalaryComponentTabs;
