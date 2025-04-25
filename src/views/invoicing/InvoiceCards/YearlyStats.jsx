// File: src/sections/invoicing/YearlyStats.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { Grid2, Stack, Box, Typography, Autocomplete, TextField, IconButton, Menu, MenuItem } from '@mui/material';
import MainCard from '../../../ui-component/cards/MainCard';
import SubCard from '../../../ui-component/cards/SubCard';
import { IconCurrencyRupee, IconCalendarStats, IconChartBar } from '@tabler/icons-react';
const yearlyStatsData = [
  {
    id: 'total_revenue',
    title: 'Total Revenue',
    href: '',
    value: '0',
    icon: IconCurrencyRupee,
    color: 'success.main',
    bgcolor: 'success.lighter'
  },
  {
    id: 'today_revenue',
    title: "Today's Revenue",
    href: 'pending',
    value: '0',

    icon: IconCurrencyRupee,
    color: 'primary.main',
    bgcolor: 'primary.lighter'
  },
  {
    id: 'revenue_this_month',
    title: 'Revenue this month',
    href: 'in_progress',
    value: '0',

    icon: IconCalendarStats,
    color: 'info.main',
    bgcolor: 'info.lighter'
  },
  {
    id: 'revenue_last_month',
    title: 'Revenue last month',
    href: 'in_progress',
    value: '0',
    icon: IconCalendarStats,
    color: 'warning.main',
    bgcolor: 'warning.lighter'
  },
  {
    id: 'average_revenue_per_day',
    title: 'Average revenue per day',
    href: 'completed',
    value: '0',
    icon: IconChartBar,
    color: 'secondary.main',
    bgcolor: 'secondary.lighter'
  }
];
const YearlyStats = ({ theme, title, setTitle, financialYear, setFinancialYear, dashboardData, getInvoices, getStatsData, businessId }) => {
  return (
    <MainCard content={false} sx={{ pb: 2.5 }}>
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h4" sx={{ fontWeight: 400 }}>
                Select Financial year to get yearly stats
              </Typography>
              <Autocomplete
                options={['2021-22', '2022-23', '2023-24', '2024-25', '2025-26']}
                value={financialYear}
                onChange={(e, val) => setFinancialYear(val)}
                disableClearable
                renderInput={(params) => <TextField {...params} variant="outlined" size="small" sx={{ width: 200 }} />}
              />
            </Stack>
          </Stack>
        </Grid2>

        <Grid2 size={{ xs: 12 }}>
          <Grid2 container spacing={2}>
            {yearlyStatsData.map((item, index) => (
              <Grid2 key={index} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
                <SubCard
                  onClick={() => {
                    if (item.title === title) {
                      getInvoices(businessId);
                      setTitle('Over All Financial Year Invoices');
                    } else {
                      getStatsData(item.id);
                    }
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
        </Grid2>
      </Grid2>
    </MainCard>
  );
};

YearlyStats.propTypes = {
  theme: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  setTitle: PropTypes.func.isRequired,
  financialYear: PropTypes.string.isRequired,
  setFinancialYear: PropTypes.func.isRequired,
  dashboardData: PropTypes.object.isRequired,
  getInvoices: PropTypes.func.isRequired,
  getStatsData: PropTypes.func.isRequired,
  businessId: PropTypes.any
};

export default YearlyStats;
