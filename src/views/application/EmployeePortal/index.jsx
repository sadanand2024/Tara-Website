import React, { useState, useEffect } from 'react';
import {
  Grid2,
  Card,
  CardContent,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Stack,
  Button,
  Chip,
  Divider,
  IconButton,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogContent,
  alpha
} from '@mui/material';
import { useSelector } from 'store';
import {
  IconSearch,
  IconHelp,
  IconBell,
  IconArrowRight,
  IconClock,
  IconCalendar,
  IconFileText,
  IconReceipt,
  IconChartPie,
  IconUser,
  IconHome,
  IconCalendarEvent,
  IconCurrencyDollar,
  IconFileDescription,
  IconDownload,
  IconEye,
  IconPlus
} from '@tabler/icons-react';
import TaxTDSInfo from './components/TaxTDSInfo';

const EmployeePortalDashboard = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  // Static check-in time to avoid re-renders
  const checkInTime = '09:00 AM';

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Card
        sx={{
          p: 3,
          textAlign: 'center',
          background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          borderRadius: 2
        }}
      >
        <Typography variant="h5" color="white" sx={{ fontWeight: 600, mb: 1 }}>
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          This portal is only accessible to employees.
        </Typography>
      </Card>
    );
  }

  // Get employee name from the actual user data
  const userName =
    user?.employee?.profile?.first_name && user?.employee?.profile?.last_name
      ? `${user.employee.profile.first_name} ${user.employee.profile.last_name}`.trim()
      : user?.employee?.profile?.first_name || 'Employee';

  // Static date to avoid re-renders
  const currentDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Box sx={{ p: 1, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Card
        sx={{
          mb: 1,
          p: 1,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)'
          }
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'white', mb: 0.25 }}>
          Welcome, {userName}! 👋
        </Typography>
        <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>
          April 2024 ▼
        </Typography>
      </Card>

      <Grid2 container spacing={1} sx={{ mb: 1 }}>
        {/* Welcome and Check-in */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent
              sx={{ p: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                <IconClock size={18} style={{ marginRight: 4, color: '#667eea' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Today's Status
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 0.25, fontSize: '0.8rem', color: 'text.secondary' }}>
                {currentDate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1, fontSize: '0.8rem', fontWeight: 500 }}>
                Checked in at {checkInTime}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  width: 'fit-content',
                  mx: 'auto',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                    transform: 'translateY(-1px)'
                  }
                }}
              >
                Check-out
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My Earnings */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconCurrencyDollar size={18} style={{ marginRight: 4, color: '#10b981' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  My Earnings (Net pay)
                </Typography>
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                  <Typography variant="h5" color="text.secondary">
                    This month:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#10b981', fontSize: '1.1rem' }}>
                    ₹98,262
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h5" color="text.secondary">
                    YTD:
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#10b981', fontSize: '1.1rem' }}>
                    ₹6,20,000
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#10b981',
                  color: '#10b981',
                  width: 'fit-content',
                  mx: 'auto',
                  display: 'block',
                  '&:hover': {
                    borderColor: '#059669',
                    backgroundColor: alpha('#10b981', 0.1)
                  }
                }}
              >
                View Salary Breakdown
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My Payslips */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconFileDescription size={18} style={{ marginRight: 4, color: '#f59e0b' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  My Payslips
                </Typography>
              </Box>
              <List dense sx={{ py: 0 }}>
                {['April 2024', 'March 2024', 'Feb 2024'].map((month, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 0.2,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha('#f59e0b', 0.1),
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={month}
                      secondary="View/Download"
                      primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.7rem', color: 'text.secondary' }}
                    />
                    <IconDownload size={14} style={{ color: '#f59e0b', cursor: 'pointer' }} />
                  </ListItem>
                ))}
              </List>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  mt: 0.5,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#f59e0b',
                  color: '#f59e0b',
                  width: 'fit-content',
                  mx: 'auto',
                  display: 'block',
                  '&:hover': {
                    borderColor: '#d97706',
                    backgroundColor: alpha('#f59e0b', 0.1)
                  }
                }}
              >
                View ALL
              </Button>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Middle Section */}
      <Grid2 container spacing={1} sx={{ mb: 1 }}>
        {/* Leave & LoP */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconCalendarEvent size={18} style={{ marginRight: 4, color: '#8b5cf6' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Leave & LoP
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, py: 0.3, color: 'text.primary' }}>Type</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, py: 0.3, color: 'text.primary' }}>Paid leaves</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, py: 0.3, color: 'text.primary' }}>LoPs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '&:hover': { backgroundColor: alpha('#8b5cf6', 0.05) } }}>
                      <TableCell sx={{ fontSize: '0.75rem', py: 0.3, fontWeight: 500 }}>This month</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 0.3, color: '#10b981', fontWeight: 600 }}>2</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 0.3, color: '#ef4444', fontWeight: 600 }}>1</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:hover': { backgroundColor: alpha('#8b5cf6', 0.05) } }}>
                      <TableCell sx={{ fontSize: '0.75rem', py: 0.3, fontWeight: 500 }}>YTD</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 0.3, color: '#10b981', fontWeight: 600 }}>5</TableCell>
                      <TableCell sx={{ fontSize: '0.75rem', py: 0.3, color: '#ef4444', fontWeight: 600 }}>3</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderColor: '#8b5cf6',
                    color: '#8b5cf6',
                    '&:hover': {
                      borderColor: '#7c3aed',
                      backgroundColor: alpha('#8b5cf6', 0.1)
                    }
                  }}
                >
                  View Leave Ledger
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<IconPlus />}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    '&:hover': {
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.4)',
                      transform: 'translateY(-1px)'
                    }
                  }}
                >
                  APPLY
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Tax Deducted */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconReceipt size={18} style={{ marginRight: 4, color: '#06b6d4' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Tax Deducted (TDS)
                </Typography>
              </Box>
              <Chip
                label="Regime: New"
                size="small"
                sx={{
                  mb: 0.5,
                  backgroundColor: alpha('#06b6d4', 0.1),
                  color: '#06b6d4',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h5" color="text.secondary">
                  This month :
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#06b6d4', fontSize: '1.1rem' }}>
                  ₹24,600
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h5" color="text.secondary">
                  YTD :
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#06b6d4', fontSize: '1.1rem' }}>
                  ₹1,800
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                onClick={() => setShowTaxDetails(true)}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#06b6d4',
                  color: '#06b6d4',
                  '&:hover': {
                    borderColor: '#0891b2',
                    backgroundColor: alpha('#06b6d4', 0.1)
                  },
                  width: 'fit-content',
                  mx: 'auto',
                  display: 'block'
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Tax Declaration */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconFileText size={18} style={{ marginRight: 4, color: '#84cc16' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Tax Declaration
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 45,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha('#84cc16', 0.05),
                  borderRadius: 1.5,
                  border: `2px dashed ${alpha('#84cc16', 0.3)}`
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem', textAlign: 'center' }}>
                  Tax declaration details will appear here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Bottom Section */}
      <Grid2 container spacing={1}>
        {/* My Attendance */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconCalendar size={18} style={{ marginRight: 4, color: '#ec4899' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  My Attendance
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, py: 0.3, color: 'text.primary' }}>This month</TableCell>
                      <TableCell sx={{ fontSize: '0.7rem', fontWeight: 600, py: 0.3, color: 'text.primary' }}>YTD</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { label: 'Working days', thisMonth: '22', ytd: '132' },
                      { label: 'Present', thisMonth: '19', ytd: '124' },
                      { label: 'LoP', thisMonth: '1', ytd: '3' },
                      { label: 'Paid leaves', thisMonth: '2', ytd: '5' }
                    ].map((row, index) => (
                      <TableRow key={index} sx={{ '&:hover': { backgroundColor: alpha('#ec4899', 0.05) } }}>
                        <TableCell sx={{ fontSize: '0.75rem', py: 0.3, fontWeight: 500 }}>{row.label}</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', py: 0.3, fontWeight: 600, color: '#ec4899' }}>{row.thisMonth}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconEye />}
                sx={{
                  mt: 0.5,
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#ec4899',
                  color: '#ec4899',
                  '&:hover': {
                    borderColor: '#db2777',
                    backgroundColor: alpha('#ec4899', 0.1)
                  }
                }}
              >
                View Full Attendance
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My PF Contribution */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconChartPie size={18} style={{ marginRight: 4, color: '#f97316' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  My PF Contribution
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.75rem' }}>
                EPF Tracker (Employee + Employer Contribution)
              </Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h5" color="text.secondary">
                  This month :
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f97316', fontSize: '1.1rem' }}>
                  ₹3,600
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                <Typography variant="h5" color="text.secondary">
                  YTD :
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f97316', fontSize: '1.1rem' }}>
                  ₹43,200
                </Typography>
              </Box>

              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#f97316',
                  color: '#f97316',
                  '&:hover': {
                    borderColor: '#ea580c',
                    backgroundColor: alpha('#f97316', 0.1)
                  },
                  width: 'fit-content',
                  mx: 'auto',
                  display: 'block'
                }}
              >
                View PF Passbook
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Reimbursements */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: '100%',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              borderRadius: 2,
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.15)'
              }
            }}
          >
            <CardContent sx={{ p: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <IconReceipt size={18} style={{ marginRight: 4, color: '#6366f1' }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                  Reimbursements
                </Typography>
              </Box>
              <List dense sx={{ py: 0 }}>
                {[
                  { label: 'Applied', value: '₹12,500', color: '#6366f1' },
                  { label: 'Approved', value: '₹10,200', color: '#10b981' },
                  { label: 'Processed', value: '₹8,750', color: '#f59e0b' },
                  { label: 'Pending', value: '₹1,800', color: '#ef4444' }
                ].map((item, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                    <Typography variant="h5" color="text.secondary">
                      {item.label} :
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, color: item.color, fontSize: '1.1rem' }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Tax Details Dialog */}
      <Dialog open={showTaxDetails} onClose={() => setShowTaxDetails(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0 }}>
          <TaxTDSInfo onClose={() => setShowTaxDetails(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default EmployeePortalDashboard;
