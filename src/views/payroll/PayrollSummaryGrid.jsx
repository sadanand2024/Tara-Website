// components/payroll/PayrollSummaryGrid.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Grid2, Paper, Divider, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

const getIconForCard = (key) => {
  const iconMap = {
    total_employees: <PeopleIcon sx={{ fontSize: 28 }} />,
    total_salary: <AttachMoneyIcon sx={{ fontSize: 28 }} />,
    total_department: <AccountBalanceIcon sx={{ fontSize: 28 }} />,
    total_new_joinees: <PersonAddIcon sx={{ fontSize: 28 }} />,
    total_exits: <PersonRemoveIcon sx={{ fontSize: 28 }} />,
    default: <TrendingUpIcon sx={{ fontSize: 28 }} />
  };
  return iconMap[key] || iconMap.default;
};

const PayrollSummaryGrid = ({ data, config, showJoineesExits = true }) => {
  return (
    <Grid2 container spacing={{ xs: 2, md: 3 }}>
      {config.map((card, idx) => (
        <Grid2 key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid',
              borderColor: 'divider',
              background: (theme) =>
                `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderColor: 'primary.main',
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                    color: 'primary.main',
                    mb: 0.5
                  }}
                >
                  {getIconForCard(card.key)}
                </Box>
              </Box>
              <Typography
                variant="h3"
                sx={{
                  color: 'primary.main',
                  textAlign: 'center',
                  mb: 0.5,
                  letterSpacing: '-0.5px'
                }}
              >
                {data ? Number(data[card.key] ?? 0).toLocaleString('en-IN') : '0'}
              </Typography>
              <Divider sx={{ my: 1, opacity: 0.6 }} />
              <Typography
                variant="subtitle1"
                fontWeight="600"
                textAlign="center"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  letterSpacing: '0.2px'
                }}
              >
                {card.title}
              </Typography>
            </Box>
          </Paper>
        </Grid2>
      ))}

      {showJoineesExits && (
        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <Paper
            elevation={0}
            sx={{
              height: '100%',
              borderRadius: 2,
              overflow: 'hidden',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              border: '1px solid',
              borderColor: 'divider',
              background: (theme) =>
                `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: (theme) => `0 12px 32px ${alpha(theme.palette.primary.main, 0.15)}`,
                borderColor: 'primary.main',
                background: (theme) =>
                  `linear-gradient(145deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, 0.08)} 100%)`
              }
            }}
          >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 0.5 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                    color: 'success.main'
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 20 }} />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    color: 'error.main'
                  }}
                >
                  <PersonRemoveIcon sx={{ fontSize: 20 }} />
                </Box>
              </Box>
              <Typography
                variant="h4"
                textAlign="center"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  letterSpacing: '-0.5px'
                }}
              >
                <Box component="span" sx={{ color: 'success.main' }}>
                  {data ? Number(data.total_new_joinees ?? 0).toLocaleString('en-IN') : '0'}
                </Box>
                {' / '}
                <Box component="span" sx={{ color: 'error.main' }}>
                  {data ? Number(data.total_exits ?? 0).toLocaleString('en-IN') : '0'}
                </Box>
              </Typography>
              <Divider sx={{ my: 1.5, opacity: 0.6 }} />
              <Typography
                variant="subtitle1"
                fontWeight="600"
                textAlign="center"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.95rem',
                  letterSpacing: '0.2px'
                }}
              >
                Joinees / Exits
              </Typography>
            </Box>
          </Paper>
        </Grid2>
      )}
    </Grid2>
  );
};

PayrollSummaryGrid.propTypes = {
  data: PropTypes.object,
  config: PropTypes.array,
  showJoineesExits: PropTypes.bool
};

export default PayrollSummaryGrid;
