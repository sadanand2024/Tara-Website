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
  DialogContent
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
      <Card sx={{ p: 2 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
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
    <Box sx={{ p: 0.25 }}>
      {/* Header Section */}
      <Card sx={{ mb: 1, p: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: 'white' }}>
          Welcome, {userName}!
        </Typography>
        <Typography variant="body1" sx={{ mr: 2, fontSize: '1.1rem' }}>
          April 2024 ▼
        </Typography>
      </Card>
      <Grid2 container spacing={1} sx={{ mb: 1 }}>
        {/* Welcome and Check-in */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="body1" sx={{ mb: 0.25, fontSize: '1.05rem' }}>
                Today: {currentDate}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontSize: '1.05rem' }}>
                Checked in at {currentTimeString}
              </Typography>
              <Button variant="contained" color="primary" size="small">
                Check-out
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My Earnings */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem', whiteSpace: 'nowrap' }}>
                My Earnings (Net pay)
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.95rem' }}>
                This month :
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main', mb: 0.25, fontSize: '1.4rem' }}>
                ₹98,262
              </Typography>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.95rem' }}>
                YTD :
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.2rem' }}>
                ₹6,20,000
              </Typography>
              <Button variant="outlined" size="small" startIcon={<IconEye />}>
                View salary Breakdown
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My Payslips */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                My Payslips
              </Typography>
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText
                    primary="April 2024"
                    secondary="View/Download"
                    primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                    secondaryTypographyProps={{ fontSize: '0.85rem' }}
                  />
                  <IconDownload size={16} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText
                    primary="March 2024"
                    secondary="View/Download"
                    primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                    secondaryTypographyProps={{ fontSize: '0.85rem' }}
                  />
                  <IconDownload size={16} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText
                    primary="Feb 2024"
                    secondary="View/Download"
                    primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }}
                    secondaryTypographyProps={{ fontSize: '0.85rem' }}
                  />
                  <IconDownload size={16} />
                </ListItem>
              </List>
              <Button variant="outlined" size="small">
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
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Leave & LoP (Leaves taken)
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.9rem', fontWeight: 600, py: 0.25 }}>Type</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', fontWeight: 600, py: 0.25 }}>Paid leaves</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', fontWeight: 600, py: 0.25 }}>LoPs</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.95rem', py: 0.25 }}>This month</TableCell>
                      <TableCell sx={{ fontSize: '0.95rem', py: 0.25 }}>2</TableCell>
                      <TableCell sx={{ fontSize: '0.95rem', py: 0.25 }}>1</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.95rem', py: 0.25 }}>YTD</TableCell>
                      <TableCell sx={{ fontSize: '0.95rem', py: 0.25 }}>5</TableCell>
                      <TableCell sx={{ fontSize: '0.95rem', py: 0.25 }}>3</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', m: 2 }}>
                <Button variant="outlined" size="small">
                  View Leave ledger
                </Button>
                <Button variant="contained" color="error" size="small" startIcon={<IconPlus />}>
                  APPLY
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid2>

        {/* Tax Deducted */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Tax Deducted (TDS)
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.25, fontSize: '0.95rem' }}>
                Regime: New
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.2rem' }}>
                ₹1,800
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.9rem' }}>
                This month
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.2rem' }}>
                ₹24,600
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                YTD
              </Typography>
              <Button variant="outlined" size="small" startIcon={<IconEye />} onClick={() => setShowTaxDetails(true)}>
                View Details
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Tax Declaration */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Tax Declaration
              </Typography>
              <Box sx={{ height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
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
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                My Attendance
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.9rem', fontWeight: 600, py: 0.25 }}>This month</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', fontWeight: 600, py: 0.25 }}>YTD</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}>Working days</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}>Present</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}>LoP</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}>Paid leaves</TableCell>
                      <TableCell sx={{ fontSize: '0.9rem', py: 0.25 }}></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Button variant="outlined" size="small" startIcon={<IconEye />}>
                View Full Attendance
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* My PF Contribution */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.1rem' }}>
                My PF Contribution
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.9rem' }}>
                EPF Tracker
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                (Employee + Employer Contribution)
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.2rem' }}>
                ₹3,600
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25, fontSize: '0.9rem' }}>
                This month
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.25, fontSize: '1.2rem' }}>
                ₹43,200
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                YTD
              </Typography>
              <Button variant="outlined" size="small" startIcon={<IconFileText />}>
                View PF Passbook
              </Button>
            </CardContent>
          </Card>
        </Grid2>

        {/* Reimbursements */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1.1rem' }}>
                Reimbursements
              </Typography>
              <List dense sx={{ py: 0 }}>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText primary="Applied:" secondary="" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText primary="Approved:" secondary="" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText primary="Processed:" secondary="" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.25 }}>
                  <ListItemText primary="Pending:" secondary="" primaryTypographyProps={{ fontSize: '1rem', fontWeight: 500 }} />
                </ListItem>
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
