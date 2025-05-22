// File: src/sections/invoicing/OverallStats.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Grid2, Stack, Typography, Box } from '@mui/material';
import SubCard from '../../../ui-component/cards/SubCard';
import { ThemeMode } from 'config';
import { IconCalendarEvent, IconCalendarTime, IconReceipt, IconAlertCircle, IconAlertTriangle } from '@tabler/icons-react';
import BillCard from '../../../ui-component/cards/BillCard';
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
        <Grid2 key={item.id} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <BillCard
            onClick={() => {
              if (item.title === title) {
                getInvoices(businessId);
                setTitle('Over All Financial Year Invoices');
              } else getStatsData(item.id);
            }}
            title={item.title}
            secondary={`₹ ${dashboardData[item.id] || 0}`}
            color={item.color}
            bg={
              index === 0
                ? 'orange.light'
                : index === 1
                  ? 'warning.light'
                  : index === 2
                    ? 'success.light'
                    : index === 3
                      ? 'success.light'
                      : 'orange.light'
            }
            sx={{
              p: 2,
              cursor: 'pointer',
              bgcolor: item.title === title ? 'primary.lighter' : 'background.paper',
              transition: 'all 0.3s ease-in-out'
            }}
          ></BillCard>
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
