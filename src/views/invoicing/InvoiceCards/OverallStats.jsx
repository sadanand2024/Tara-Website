// File: src/sections/invoicing/OverallStats.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Grid2, Stack, Typography, Box } from '@mui/material';
import SubCard from '../../../ui-component/cards/SubCard';
import { ThemeMode } from 'config';
import { IconCalendarEvent, IconCalendarTime, IconReceipt, IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react';

const overallStatsData = [
  {
    id: 'over_dues',
    title: 'Over due',
    value: '0',

    buttonLable: 'Create New',
    icon: IconAlertCircle,
    color: 'error.main',
    bgcolor: 'error.lighter'
  },
  {
    id: 'due_today',
    title: 'Due today',
    value: '0',

    icon: IconCalendarEvent,
    color: 'warning.main',
    bgcolor: 'warning.lighter'
  },
  {
    id: 'due_within_30_days',
    title: 'Due with in 30 days',
    value: '20',

    icon: IconCalendarTime,
    color: 'info.main',
    bgcolor: 'info.lighter'
  },
  {
    id: 'total_recievables',
    title: 'Total Receivable',
    value: '0',

    icon: IconReceipt,
    color: 'success.main',
    bgcolor: 'success.lighter'
  },
  {
    id: 'bad_debt',
    title: 'Bad Debt',
    value: '0',

    icon: IconAlertTriangle,
    color: 'error.main',
    bgcolor: 'error.lighter'
  }
];
const OverallStats = ({ theme, title, setTitle, dashboardData, getInvoices, getStatsData, businessId }) => {
  return (
    <Grid2 container spacing={2} sx={{ mb: 4 }}>
      {overallStatsData.map((item, index) => (
        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <SubCard
            onClick={() => {
              if (item.title === title) {
                getInvoices(businessId);
                setTitle('Over All Financial Year Invoices');
              } else getStatsData(item.id);
            }}
            content={false}
            sx={{
              p: 2,
              cursor: 'pointer',
              bgcolor: item.title === title ? 'primary.lighter' : 'background.paper',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.customShadows.z4
              }
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Box
                className="icon-box"
                sx={{
                  width: 56,
                  height: 56,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  bgcolor: item.bgcolor,
                  color: item.color
                }}
              >
                <item.icon size={30} />
              </Box>
              <Typography variant="h4" color="text.secondary">
                {item.title}
              </Typography>
              <Typography variant="h3">₹&nbsp;{dashboardData[item.id] || 0}</Typography>
            </Stack>
          </SubCard>
        </Grid2>
      ))}
    </Grid2>
  );
};

OverallStats.propTypes = {
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  dashboardData: PropTypes.object.isRequired,
  getInvoices: PropTypes.func.isRequired,
  getStatsData: PropTypes.func.isRequired,
  businessId: PropTypes.any
};

export default OverallStats;
