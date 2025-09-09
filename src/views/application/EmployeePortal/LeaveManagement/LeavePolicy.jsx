import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid2,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Stack,
  IconButton,
  Tooltip,
  Fade,
  Button
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Schedule as ScheduleIcon,
  ExpandMore as ExpandMoreIcon,
  CalendarMonth as CalendarIcon,
  Business as BusinessIcon,
  ContactSupport as ContactIcon,
  Download as DownloadIcon,
  Print as PrintIcon
} from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';

const LeavePolicy = () => {
  const [expandedSection, setExpandedSection] = useState('overview');
  const leaveTypes = [
    {
      type: 'Annual Leave',
      allocation: '21 days',
      carryForward: '5 days max',
      encashment: 'Yes',
      description: 'Planned vacation and personal time off'
    },
    {
      type: 'Sick Leave',
      allocation: '12 days',
      carryForward: 'No',
      encashment: 'No',
      description: 'Medical emergencies and health issues'
    },
    {
      type: 'Casual Leave',
      allocation: '8 days',
      carryForward: 'No',
      encashment: 'No',
      description: 'Short-term personal work and emergencies'
    },
    {
      type: 'Maternity Leave',
      allocation: '26 weeks',
      carryForward: 'N/A',
      encashment: 'No',
      description: 'For female employees during childbirth'
    },
    {
      type: 'Paternity Leave',
      allocation: '15 days',
      carryForward: 'N/A',
      encashment: 'No',
      description: 'For male employees during childbirth'
    }
  ];

  const policyRules = [
    {
      title: 'Application Process',
      rules: [
        'Leave applications must be submitted at least 3 days in advance for planned leave',
        'Emergency leave can be applied retrospectively with proper justification',
        'All leave applications require manager approval',
        'Medical certificates required for sick leave exceeding 3 consecutive days'
      ]
    },
    {
      title: 'Approval Guidelines',
      rules: [
        'Leave requests are approved on first-come-first-served basis',
        'Maximum 20% of team members can be on leave simultaneously',
        'Annual leave during peak business periods may be restricted',
        'Backdated leave applications may result in LOP (Loss of Pay)'
      ]
    },
    {
      title: 'Carry Forward & Encashment',
      rules: [
        'Only Annual Leave can be carried forward (maximum 5 days)',
        'Unused annual leave can be encashed at year-end',
        'Carry forward leaves must be utilized within 6 months',
        'No encashment for sick leave or casual leave'
      ]
    }
  ];

  const holidayCalendar = [
    { date: 'January 26', occasion: 'Republic Day', type: 'National Holiday' },
    { date: 'March 8', occasion: 'Holi', type: 'Festival' },
    { date: 'August 15', occasion: 'Independence Day', type: 'National Holiday' },
    { date: 'October 2', occasion: 'Gandhi Jayanti', type: 'National Holiday' },
    { date: 'October 24', occasion: 'Dussehra', type: 'Festival' },
    { date: 'November 12', occasion: 'Diwali', type: 'Festival' },
    { date: 'December 25', occasion: 'Christmas', type: 'Festival' }
  ];

  return (
    <MainCard title="TaraFirst Leave Policy">
      <Box>
        {/* Enhanced Company Overview */}
        <Paper
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 3,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
              <BusinessIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight={700} mb={1}>
                TaraFirst Leave Policy
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Supporting work-life balance
              </Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ lineHeight: 1.8, opacity: 0.95, fontSize: '1.1rem' }}>
            At TaraFirst, we believe in maintaining a healthy work-life balance. Our comprehensive leave policy is designed to support our
            employees' personal and professional well-being while ensuring business continuity and operational excellence.
          </Typography>
        </Paper>

        {/* Enhanced Leave Types Table */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
              <ScheduleIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary">
              Leave Types & Entitlements
            </Typography>
          </Box>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}
          >
            <Table size="small">
              <TableHead
                sx={{
                  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                  '& .MuiTableCell-root': {
                    color: 'white !important',
                    fontSize: '0.95rem',
                    py: 2
                  }
                }}
              >
                <TableRow>
                  <TableCell>Leave Type</TableCell>
                  <TableCell>Annual Allocation</TableCell>
                  <TableCell>Carry Forward</TableCell>
                  <TableCell>Encashment</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leaveTypes.map((leave, index) => (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      '&:hover': {
                        bgcolor: 'rgba(25, 118, 210, 0.04)',
                        transition: 'all 0.2s ease-in-out'
                      },
                      '&:nth-of-type(even)': {
                        bgcolor: 'rgba(0, 0, 0, 0.02)'
                      }
                    }}
                  >
                    <TableCell sx={{ py: 2.5 }}>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar sx={{ bgcolor: 'primary.light', width: 32, height: 32 }}>
                          <CheckIcon sx={{ fontSize: 18 }} />
                        </Avatar>
                        <Typography fontWeight={600} color="primary" variant="subtitle1">
                          {leave.type}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography fontWeight={600} variant="body1">
                        {leave.allocation}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip
                        label={leave.carryForward}
                        size="small"
                        color={leave.carryForward.includes('max') || leave.carryForward === 'N/A' ? 'warning' : 'error'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Chip
                        label={leave.encashment}
                        size="small"
                        color={leave.encashment === 'Yes' ? 'success' : 'default'}
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2.5 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                        {leave.description}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Enhanced Policy Rules */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
              <WarningIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary">
              Policy Rules & Guidelines
            </Typography>
          </Box>
          <Grid2 container spacing={3}>
            {policyRules.map((section, index) => (
              <Grid2 size={{ xs: 12, md: 4 }} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    border: '2px solid transparent',
                    borderRadius: 3,
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.main',
                      transform: 'translateY(-8px)',
                      boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box display="flex" alignItems="center" gap={2} mb={3}>
                      <Avatar sx={{ bgcolor: 'primary.light', width: 48, height: 48 }}>
                        <ScheduleIcon />
                      </Avatar>
                      <Typography variant="h6" fontWeight={700} color="primary">
                        {section.title}
                      </Typography>
                    </Box>
                    <List dense>
                      {section.rules.map((rule, ruleIndex) => (
                        <ListItem key={ruleIndex} disableGutters>
                          <ListItemIcon sx={{ minWidth: 28 }}>
                            <CheckIcon fontSize="small" color="success" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                                {rule}
                              </Typography>
                            }
                          />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Box>

        {/* Holiday Calendar */}
        <Box mb={4}>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Avatar sx={{ bgcolor: 'white', width: 40, height: 40 }}>
              <CalendarIcon />
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary">
              Holiday Calendar
            </Typography>
          </Box>

          <Paper sx={{ p: 2 }}>
            <Grid2 container spacing={2}>
              {holidayCalendar.map((holiday, index) => (
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                  <Box
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      textAlign: 'center',
                      '&:hover': {
                        bgcolor: '#f8f9fa'
                      }
                    }}
                  >
                    <Typography variant="subtitle2" fontWeight={600} color="primary">
                      {holiday.date}
                    </Typography>
                    <Typography variant="body2" sx={{ my: 0.5 }}>
                      {holiday.occasion}
                    </Typography>
                    <Chip
                      label={holiday.type}
                      size="small"
                      color={holiday.type === 'National Holiday' ? 'error' : 'warning'}
                      variant="outlined"
                    />
                  </Box>
                </Grid2>
              ))}
            </Grid2>
          </Paper>
        </Box>

        {/* Important Notes */}
        <Paper sx={{ p: 3, bgcolor: '#fff3e0', border: '1px solid #ffcc02' }}>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
              <WarningIcon />
            </Avatar>
            <Typography variant="h6" fontWeight={600}>
              Important Notes
            </Typography>
          </Box>
          <List dense>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <InfoIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText primary="This policy is subject to change based on business requirements and regulatory updates." />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <InfoIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText primary="For any clarifications or special circumstances, please contact HR department." />
            </ListItem>
            <ListItem disableGutters>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <InfoIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText primary="Misuse of leave policy may result in disciplinary action as per company guidelines." />
            </ListItem>
          </List>
        </Paper>

        {/* Contact Information */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            For queries related to leave policy, contact HR at:
            <Typography component="span" fontWeight={600} color="primary" sx={{ ml: 1 }}>
              hr@tarafirst.com | +91-XXXX-XXXX-XX
            </Typography>
          </Typography>
        </Box>
      </Box>
    </MainCard>
  );
};

export default LeavePolicy;
