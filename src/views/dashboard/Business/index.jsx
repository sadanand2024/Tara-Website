import {
  alpha,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';
import React from 'react';

// icons
import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DescriptionIcon from '@mui/icons-material/Description';
import GroupIcon from '@mui/icons-material/Group';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';

const StatCard = ({ title, value, trend, trendValue }) => {
  const theme = useTheme();
  return (
    <Card
      sx={{
        height: '100%',
        bgcolor: 'white',
        border: '1px solid',
        borderRadius: 1,
        boxShadow: 1,
        borderColor: 'divider',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-6px)'
          // boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.15)}`
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
              ₹ {value}
            </Typography>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                color: trend === 'up' ? 'success.main' : 'error.main',
                bgcolor: trend === 'up' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
                px: 1.5,
                py: 0.75,
                borderRadius: 2
              }}
            >
              {trend === 'up' ? <TrendingUpIcon fontSize="small" /> : <TrendingDownIcon fontSize="small" />}
              <Typography variant="body2" sx={{ ml: 0.5, fontWeight: 600 }}>
                {trendValue}%
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const TaskItem = ({ title, dueDate, priority }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        py: 2,
        px: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 1,
        '&:hover': {
          bgcolor: 'background.default'
        }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Checkbox
          sx={{
            '&.Mui-checked': {
              color: 'primary.main'
            }
          }}
        />
        <Box>
          <Typography color="text.primary" variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            Due: {dueDate}
          </Typography>
        </Box>
      </Stack>
      <Chip
        label={priority}
        size="small"
        color={priority === 'High' ? 'error' : priority === 'Medium' ? 'warning' : 'info'}
        sx={{
          textTransform: 'uppercase',
          fontWeight: 600,
          fontSize: '0.75rem',
          height: 24,
          '& .MuiChip-label': {
            px: 1.5
          }
        }}
      />
    </Box>
  );
};

const ComplianceItem = ({ title, dueDate, lastDate }) => (
  <Box
    sx={{
      py: 2,
      px: 1,
      borderRadius: 1,
      '&:hover': {
        bgcolor: 'background.default'
      }
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
      <Box>
        <Typography color="text.primary" variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            mt: 0.5,
            fontSize: '0.75rem'
          }}
        >
          Due on: {dueDate} | Last filed: {lastDate}
        </Typography>
      </Box>
      <Button
        size="small"
        variant="outlined"
        sx={{
          borderRadius: 2,
          px: 2,
          '&:hover': {
            bgcolor: 'primary.lighter'
          }
        }}
      >
        File Now
      </Button>
    </Stack>
  </Box>
);

export default function Business() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const companyInfo = {
    name: 'AQUA TECH SOLUTIONS PVT LTD',
    stats: {
      modules: 0,
      teamMembers: 0,
      docsUploaded: 0,
      ongoingReturns: 0
    },
    plan: {
      name: 'Growth',
      subscription: 0,
      nextRenewal: '7th May 2025'
    }
  };

  return (
    <Stack spacing={2}>
      {/* Company Header */}
      <Box
        sx={{
          p: 2.5,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 1,
          borderRadius: 1
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, letterSpacing: '-0.5px' }}>
          {companyInfo.name}
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 1,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                height: '100%'
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <DescriptionIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    {companyInfo.stats.modules}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Modules Active
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 1,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                height: '100%'
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <GroupIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    {companyInfo.stats.teamMembers}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Team Members
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 1,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                height: '100%'
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <UploadFileIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    {companyInfo.stats.docsUploaded}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Docs Uploaded
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                p: 1.5,
                bgcolor: alpha(theme.palette.primary.main, 0.04),
                borderRadius: 1,
                border: '1px solid',
                borderColor: alpha(theme.palette.primary.main, 0.1),
                height: '100%'
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box
                  sx={{
                    color: 'primary.main',
                    bgcolor: 'white',
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <PendingActionsIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, lineHeight: 1 }}>
                    {companyInfo.stats.ongoingReturns}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Ongoing Returns
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            mt: 2
          }}
        >
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            sx={{
              '& .MuiButton-root': {
                flex: { xs: '1', sm: '0 0 auto' }
              }
            }}
          >
            <Button
              size="medium"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.darker} 100%)`,
                  transform: 'translateY(-1px)',
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                }
              }}
            >
              Add Module
            </Button>
            <Button
              size="medium"
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Buy Service
            </Button>
            <Button
              size="medium"
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Invite Team
            </Button>
            <Button
              size="medium"
              variant="outlined"
              sx={{
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  bgcolor: alpha(theme.palette.primary.main, 0.08),
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Upload Doc
            </Button>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              p: 1.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: alpha(theme.palette.primary.main, 0.1),
              minWidth: { sm: '300px' }
            }}
          >
            <Stack spacing={1} sx={{ width: '100%' }}>
              <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle1" color="primary.main" sx={{ fontWeight: 600 }}>
                  {companyInfo.plan.name} Plan
                </Typography>
                <Chip
                  label="Active"
                  size="small"
                  color="success"
                  sx={{
                    height: 20,
                    fontSize: '0.75rem',
                    '& .MuiChip-label': { px: 1 }
                  }}
                />
              </Stack>
              <Stack spacing={0.5}>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                  Subscription{' '}
                  <Typography color="text.primary" fontWeight={600}>
                    {companyInfo.plan.subscription}
                  </Typography>
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                  Next Renewal
                  <Typography color="text.primary" fontWeight={600}>
                    {companyInfo.plan.nextRenewal}
                  </Typography>
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Monthly Revenue" value="0" trend="up" trendValue="0" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Expenses" value="0" trend="down" trendValue="0" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Receivables" value="0" trend="up" trendValue="0" />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Payroll" value="0" trend="down" trendValue="0" />
          </Grid>
        </Grid>

        {/* Financial Health & Tasks */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Financial Health
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack spacing={1.5}>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                        Monthly Revenue{' '}
                        <Typography component="span" color="text.primary" fontWeight={600}>
                          0
                        </Typography>
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                        Expenses{' '}
                        <Typography component="span" color="text.primary" fontWeight={600}>
                          0
                        </Typography>
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                        Cash Reserve{' '}
                        <Typography component="span" color="text.primary" fontWeight={600}>
                          0
                        </Typography>
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                        Net Profit{' '}
                        <Typography component="span" color="text.primary" fontWeight={600}>
                          0
                        </Typography>
                      </Typography>
                      <Typography variant="body1" sx={{ color: 'text.secondary', display: 'flex', justifyContent: 'space-between' }}>
                        Expense Ratio{' '}
                        <Typography component="span" color="text.primary" fontWeight={600}>
                          0
                        </Typography>
                      </Typography>
                    </Stack>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{
                        mt: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                      }}
                    >
                      View Reports
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Tasks Overview
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        bgcolor: alpha(theme.palette.primary.main, 0.04),
                        borderRadius: 1
                      }}
                    >
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          0
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          To Start
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="primary.main">
                          0
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          In Progress
                        </Typography>
                      </Box>
                      <Divider orientation="vertical" flexItem />
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="error.main">
                          0
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Overdue
                        </Typography>
                      </Box>
                    </Box>
                    <Stack spacing={1} sx={{ mt: 1 }}>
                      <TaskItem title="Bank Reconciliation" dueDate="Immediate" priority="High" />
                      <TaskItem title="GSTR2 Locking Overdue" dueDate="Immediate" priority="High" />
                      <TaskItem title="Update Employee Payroll" dueDate="28th April 2025" priority="Medium" />
                    </Stack>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{
                        mt: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                      }}
                    >
                      View All Tasks
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: '100%',
                bgcolor: alpha(theme.palette.background.paper, 0.95),
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <CardContent sx={{ p: 0 }}>
                <Box sx={{ p: 3, pb: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                    Compliance Snapshot
                  </Typography>
                </Box>
                <Divider />
                <Box sx={{ p: 3 }}>
                  <Stack spacing={2}>
                    <Stack spacing={1}>
                      <ComplianceItem title="GSTR-1" dueDate="10th May" lastDate="10th April" />
                      <ComplianceItem title="PF/ESI" dueDate="20th May" lastDate="20th April" />
                      <ComplianceItem title="TDS Payment" dueDate="7th May" lastDate="7th April" />
                    </Stack>
                    <Button
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      size="small"
                      sx={{
                        mt: 1,
                        '&:hover': {
                          bgcolor: alpha(theme.palette.primary.main, 0.08)
                        }
                      }}
                    >
                      View All
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
}
