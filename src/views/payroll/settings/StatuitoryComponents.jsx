'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs, Typography, Stack, Avatar, Card, Paper, Divider, useMediaQuery, Fade, Grow } from '@mui/material';
import EpfComponent from './EPFComponent';
import ESIComponent from './ESIComponent';
import ProfessionalTax from './ProfessionalTax';
import HomeCard from '@/components/cards/HomeCard';
import { IconBolt, IconBuildingBank, IconReceipt, IconCertificate } from '@tabler/icons-react';
import MainCard from '@/components/MainCard';

/***************************  NAVIGATION - TABS  ***************************/

// TabPanel component to render the content for each tab
const TabPanel = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`simple-tabpanel-${index}`}
    aria-labelledby={`simple-tab-${index}`}
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      overflow: 'auto'
    }}
  >
    {value === index && (
      <Fade in={value === index} timeout={300} mountOnEnter unmountOnExit>
        <Box sx={{ pt: 3, pb: 2, height: '100%' }}>{children}</Box>
      </Fade>
    )}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

const StatutoryComponents = ({ type }) => {
  const [activeTab, setActiveTab] = useState(0); // State to manage active tab
  const theme = useTheme(); // Getting the theme
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Function to handle tab changes
  const handleTabChange = (_event, newTabIndex) => setActiveTab(newTabIndex);

  // Accessibility props for tabs
  const a11yProps = (index) => ({
    value: index,
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  });

  // Tab configuration with icons
  const tabConfig = [
    {
      label: 'EPF',
      icon: <IconBuildingBank size={20} />,
      description: 'Employee Provident Fund'
    },
    {
      label: 'ESI',
      icon: <IconCertificate size={20} />,
      description: 'Employee State Insurance'
    },
    {
      label: 'Professional Tax',
      icon: <IconReceipt size={20} />,
      description: 'Professional Tax Registration'
    }
  ];

  const handleNext = () => {
    setActiveTab((prev) => (prev < tabConfig.length - 1 ? prev + 1 : prev));
  };

  const handleBack = () => {
    setActiveTab((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <HomeCard title="Statutory Components" tagline="Setup your organization before starting payroll">
      <MainCard
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
          p: 0,
          height: 'calc(100vh - 200px)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(145deg, rgba(30,30,30,0.8) 0%, rgba(40,40,40,0.8) 100%)'
                : 'linear-gradient(145deg, rgba(255,255,255,0.8) 0%, rgba(245,245,245,0.8) 100%)',
            borderRadius: '8px 8px 0 0'
          }}
        >
          <Tabs
            variant={isMobile ? 'scrollable' : 'fullWidth'}
            scrollButtons={isMobile ? 'auto' : false}
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                height: 3,
                borderRadius: '3px 3px 0 0',
                backgroundColor: theme.palette.primary.main,
                transition: 'all 0.2s ease-in-out'
              },
              '& .MuiTab-root': {
                minHeight: 36,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)'
                }
              }
            }}
          >
            {tabConfig.map((tab, index) => (
              <Tab
                key={`Tab${index}`}
                label={
                  <Stack direction={isMobile ? 'column' : 'row'} spacing={0.5} alignItems="center" sx={{ py: 0.5 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: activeTab === index ? 600 : 500,
                          color: activeTab === index ? theme.palette.primary.main : theme.palette.text.primary,
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {tab.label}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: isMobile ? 'none' : 'block',
                          color: theme.palette.text.secondary,
                          fontSize: '0.7rem'
                        }}
                      >
                        {tab.description}
                      </Typography>
                    </Box>
                  </Stack>
                }
                {...a11yProps(index)}
                sx={{
                  fontSize: '0.7rem',
                  textTransform: 'none',
                  p: 0.25,
                  minWidth: isMobile ? 80 : 'auto'
                }}
              />
            ))}
          </Tabs>
        </Paper>

        <Divider />

        <Box
          sx={{
            p: 2,
            position: 'relative',
            minHeight: '600px',
            flex: 1,
            overflow: 'auto'
          }}
        >
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
    </HomeCard>
  );
};

StatutoryComponents.propTypes = {
  type: PropTypes.any
};

export default StatutoryComponents;
