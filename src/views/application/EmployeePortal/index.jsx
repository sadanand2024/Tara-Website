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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  // Mock data - in real app, this would come from API
  const userName = user?.employee?.full_name || 'Rahul';
  const currentDate = currentTime.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const currentTimeString = currentTime.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Box sx={{ p: 1.5, background: '#f8fafc', minHeight: '100vh' }}>
      {/* Header Section */}
      <Card
        sx={{
          mb: 1.5,
          p: 1.5,
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
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'white', mb: 0.5 }}>
          Welcome, {userName}! 👋
        </Typography>
        <Typography variant="body1" sx={{ fontSize: '1rem', opacity: 0.9 }}>
          April 2024 ▼
        </Typography>
      </Card>

      <Grid2 container spacing={1.5} sx={{ mb: 1.5 }}>
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconClock size={20} style={{ marginRight: 6, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Today's Status
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 0.5, fontSize: '0.9rem', color: 'text.secondary' }}>
                {currentDate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1.5, fontSize: '0.9rem', fontWeight: 500 }}>
                Checked in at {currentTimeString}
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconCurrencyDollar size={20} style={{ marginRight: 6, color: '#10b981' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  My Earnings (Net pay)
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.85rem' }}>
                This month:
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#10b981', mb: 0.75, fontSize: '1.5rem' }}>
                ₹98,262
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.85rem' }}>
                YTD:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1.5, fontSize: '1.2rem' }}>
                ₹6,20,000
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconEye />}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#10b981',
                  color: '#10b981',
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconFileDescription size={20} style={{ marginRight: 6, color: '#f59e0b' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  My Payslips
                </Typography>
              </Box>
              <List dense sx={{ py: 0 }}>
                {['April 2024', 'March 2024', 'Feb 2024'].map((month, index) => (
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 0.25,
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
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.75rem', color: 'text.secondary' }}
                    />
                    <IconDownload size={16} style={{ color: '#f59e0b', cursor: 'pointer' }} />
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
      <Grid2 container spacing={1.5} sx={{ mb: 1.5 }}>
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconCalendarEvent size={20} style={{ marginRight: 6, color: '#8b5cf6' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Leave & LoP
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, py: 0.5, color: 'text.primary' }}>Type</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, py: 0.5, color: 'text.primary' }}>Paid leaves</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, py: 0.5, color: 'text.primary' }}>LoPs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ '&:hover': { backgroundColor: alpha('#8b5cf6', 0.05) } }}>
                      <TableCell sx={{ fontSize: '0.85rem', py: 0.5, fontWeight: 500 }}>This month</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', py: 0.5, color: '#10b981', fontWeight: 600 }}>2</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', py: 0.5, color: '#ef4444', fontWeight: 600 }}>1</TableCell>
                    </TableRow>
                    <TableRow sx={{ '&:hover': { backgroundColor: alpha('#8b5cf6', 0.05) } }}>
                      <TableCell sx={{ fontSize: '0.85rem', py: 0.5, fontWeight: 500 }}>YTD</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', py: 0.5, color: '#10b981', fontWeight: 600 }}>5</TableCell>
                      <TableCell sx={{ fontSize: '0.85rem', py: 0.5, color: '#ef4444', fontWeight: 600 }}>3</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1.5, gap: 1 }}>
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconReceipt size={20} style={{ marginRight: 6, color: '#06b6d4' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Tax Deducted (TDS)
                </Typography>
              </Box>
              <Chip
                label="Regime: New"
                size="small"
                sx={{
                  mb: 0.75,
                  backgroundColor: alpha('#06b6d4', 0.1),
                  color: '#06b6d4',
                  fontWeight: 600,
                  fontSize: '0.75rem'
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.3rem', color: '#06b6d4' }}>
                ₹1,800
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                This month
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.3rem' }}>
                ₹24,600
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                YTD
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconEye />}
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
                  }
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconFileText size={20} style={{ marginRight: 6, color: '#84cc16' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  Tax Declaration
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: alpha('#84cc16', 0.05),
                  borderRadius: 1.5,
                  border: `2px dashed ${alpha('#84cc16', 0.3)}`
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.85rem', textAlign: 'center' }}>
                  Tax declaration details will appear here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Bottom Section */}
      <Grid2 container spacing={1.5}>
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconCalendar size={20} style={{ marginRight: 6, color: '#ec4899' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  My Attendance
                </Typography>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, py: 0.5, color: 'text.primary' }}>This month</TableCell>
                      <TableCell sx={{ fontSize: '0.8rem', fontWeight: 600, py: 0.5, color: 'text.primary' }}>YTD</TableCell>
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
                        <TableCell sx={{ fontSize: '0.8rem', py: 0.5, fontWeight: 500 }}>{row.label}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', py: 0.5, fontWeight: 600, color: '#ec4899' }}>{row.thisMonth}</TableCell>
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconChartPie size={20} style={{ marginRight: 6, color: '#f97316' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
                  My PF Contribution
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.8rem' }}>
                EPF Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.75, fontSize: '0.8rem' }}>
                (Employee + Employer Contribution)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.3rem', color: '#f97316' }}>
                ₹3,600
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.8rem' }}>
                This month
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.3rem' }}>
                ₹43,200
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5, fontSize: '0.8rem' }}>
                YTD
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<IconFileText />}
                sx={{
                  borderRadius: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#f97316',
                  color: '#f97316',
                  '&:hover': {
                    borderColor: '#ea580c',
                    backgroundColor: alpha('#f97316', 0.1)
                  }
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
            <CardContent sx={{ p: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                <IconReceipt size={20} style={{ marginRight: 6, color: '#6366f1' }} />
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
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
                  <ListItem
                    key={index}
                    sx={{
                      px: 0,
                      py: 0.25,
                      borderRadius: 1,
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: alpha(item.color, 0.1),
                        transform: 'translateX(4px)'
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      secondary={item.value}
                      primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 500 }}
                      secondaryTypographyProps={{ fontSize: '0.8rem', fontWeight: 600, color: item.color }}
                    />
                  </ListItem>
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
