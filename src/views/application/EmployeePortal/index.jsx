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
  IconClock,
  IconCalendar,
  IconFileText,
  IconReceipt,
  IconChartPie,
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
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#667eea',
                background: 'linear-gradient(135deg, #E3EAFE 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconClock size={28} style={{ color: '#667eea' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                Today's Status
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {currentDate}
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                Checked in at {checkInTime}
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                Active
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#E3EAFE',
                  color: '#667eea',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#667eea',
                    color: '#fff'
                  }
                }}
              >
                Check-out
              </Button>
            </Box>
          </Paper>
        </Grid2>

        {/* My Earnings */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#10b981',
                background: 'linear-gradient(135deg, #E6FAF0 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconCurrencyDollar size={28} style={{ color: '#10b981' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                My Earnings (Net pay)
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                This month: ₹98,262
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                YTD: ₹6,20,000
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                ₹98K
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#E6FAF0',
                  color: '#10b981',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#10b981',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>

        {/* My Payslips */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #FFF7E3 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#f59e0b',
                background: 'linear-gradient(135deg, #FFF7E3 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconFileDescription size={28} style={{ color: '#f59e0b' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                My Payslips
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                April 2024, March 2024, Feb 2024
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                03
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#FFF7E3',
                  color: '#f59e0b',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#f59e0b',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Middle Section */}
      <Grid2 container spacing={1} sx={{ mb: 1 }}>
        {/* Leave & LoP */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #F3E8FF 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#8b5cf6',
                background: 'linear-gradient(135deg, #F3E8FF 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconCalendarEvent size={28} style={{ color: '#8b5cf6' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                Leave & LoP
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                This month: 2 Paid leaves, 1 LoP
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                YTD: 5 Paid leaves, 3 LoP
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                08
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#F3E8FF',
                  color: '#8b5cf6',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#8b5cf6',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>

        {/* Tax Deducted */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #E0F7FA 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#06b6d4',
                background: 'linear-gradient(135deg, #E0F7FA 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconReceipt size={28} style={{ color: '#06b6d4' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                Tax Deducted (TDS)
              </Typography>{' '}
              <Chip
                label="Regime: New"
                size="small"
                sx={{
                  backgroundColor: alpha('#06b6d4', 0.1),
                  color: '#06b6d4',
                  fontWeight: 600,
                  fontSize: '0.7rem'
                }}
              />
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                This month: ₹24,600
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                YTD: ₹1,800
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                ₹26K
              </Typography>
              <Button
                variant="contained"
                disableElevation
                onClick={() => setShowTaxDetails(true)}
                sx={{
                  background: '#E0F7FA',
                  color: '#06b6d4',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#06b6d4',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>

        {/* Tax Declaration */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#84cc16',
                background: 'linear-gradient(135deg, #F0FDF4 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconFileText size={28} style={{ color: '#84cc16' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                Tax Declaration
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Tax declaration details will appear here
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                00
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#F0FDF4',
                  color: '#84cc16',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#84cc16',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>
      </Grid2>

      {/* Bottom Section */}
      <Grid2 container spacing={1}>
        {/* My Attendance */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #FDF2F8 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#ec4899',
                background: 'linear-gradient(135deg, #FDF2F8 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconCalendar size={28} style={{ color: '#ec4899' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                My Attendance
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                This month: 19 Present, 1 LoP, 2 Paid leaves
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                YTD: 124 Present, 3 LoP, 5 Paid leaves
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                22
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#FDF2F8',
                  color: '#ec4899',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#ec4899',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>

        {/* My PF Contribution */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #FFF7ED 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#f97316',
                background: 'linear-gradient(135deg, #FFF7ED 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconChartPie size={28} style={{ color: '#f97316' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                My PF Contribution
              </Typography>
              EPF Tracker (Employee + Employer Contribution)
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                EPF Tracker (Employee + Employer Contribution)
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                This month: ₹3,600
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                YTD: ₹43,200
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                ₹43K
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#FFF7ED',
                  color: '#f97316',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#f97316',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
        </Grid2>

        {/* Reimbursements */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              height: 200,
              width: '100%',
              border: `1.5px solid #E5EAF2`,
              boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
              transition: 'box-shadow 0.2s, border-color 0.2s',
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              background: 'linear-gradient(135deg, #EEF2FF 0%, #fff 100%)',
              '&:hover': {
                boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                borderColor: '#6366f1',
                background: 'linear-gradient(135deg, #EEF2FF 0%, #fff 100%)'
              }
            }}
          >
            {/* Row 1: Icon and Heading */}
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Avatar
                variant="circular"
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <IconReceipt size={28} style={{ color: '#6366f1' }} />
              </Avatar>
              <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                Reimbursements
              </Typography>
            </Box>

            {/* Row 2: Description/Paragraph */}
            <Box sx={{ width: '100%' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Applied: ₹12,500 | Approved: ₹10,200
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, fontSize: '0.8rem', fontWeight: 500 }}>
                Processed: ₹8,750 | Pending: ₹1,800
              </Typography>
            </Box>

            {/* Row 3: Count and View Button */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                ₹33K
              </Typography>
              <Button
                variant="contained"
                disableElevation
                sx={{
                  background: '#EEF2FF',
                  color: '#6366f1',
                  fontWeight: 500,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: 'none',
                  minWidth: 48,
                  height: 32,
                  fontSize: 14,
                  px: 2,
                  py: 0.5,
                  transition: 'background 0.2s, color 0.2s',
                  '&:hover': {
                    background: '#6366f1',
                    color: '#fff'
                  }
                }}
              >
                View
              </Button>
            </Box>
          </Paper>
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
