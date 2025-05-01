// components/payroll/PayrollSummaryGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid, Paper, Divider, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';

const PayrollSummaryGrid = ({ data, config, showJoineesExits = true }) => {
  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {config.map((card, idx) => (
        <Grid key={idx} item xs={12} sm={6} md={4} lg={2.4}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderColor: 'primary.main'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  {data ? Number(data[card.key] ?? 0).toLocaleString() : '0'}
                </Typography>
              </Box>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle1" fontWeight="600" textAlign="center" sx={{ color: 'text.primary', fontSize: '0.95rem' }}>
                {card.title}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      ))}

      {showJoineesExits && (
        <Grid item xs={12} sm={6} md={4} lg={2.4}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              border: '1px solid',
              borderColor: 'divider',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderColor: 'primary.main'
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
              <Typography variant="h5" textAlign="center" sx={{ fontWeight: 600, color: 'primary.main' }}>
                {data ? Number(data.total_new_joinees ?? 0).toLocaleString() : '0'} /{' '}
                {data ? Number(data.total_exits ?? 0).toLocaleString() : '0'}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="subtitle1" fontWeight="600" textAlign="center" sx={{ color: 'text.primary', fontSize: '0.95rem' }}>
                Joinees / Exits
              </Typography>
            </Box>
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

PayrollSummaryGrid.propTypes = {
  data: PropTypes.object,
  config: PropTypes.array,
  showJoineesExits: PropTypes.bool
};

export default PayrollSummaryGrid;
