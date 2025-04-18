import React from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
  Stack,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid,
  alpha
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ChatIcon from '@mui/icons-material/Chat';
import DownloadIcon from '@mui/icons-material/Download';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';

const StatusChip = styled(Chip)(({ theme, status }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  fontWeight: 600,
  textTransform: 'capitalize',
  padding: '0 12px',
  height: 24,
  '& .MuiChip-label': {
    padding: '0 8px'
  },
  ...(status === 'completed' && {
    backgroundColor: theme.palette.success.lighter,
    color: theme.palette.success.dark,
    border: `1px solid ${theme.palette.success.light}`
  }),
  ...(status === 'in-progress' && {
    backgroundColor: theme.palette.warning.lighter,
    color: theme.palette.warning.dark,
    border: `1px solid ${theme.palette.warning.light}`
  }),
  ...(status === 'pending' && {
    backgroundColor: theme.palette.info.lighter,
    color: theme.palette.info.dark,
    border: `1px solid ${theme.palette.info.light}`
  })
}));

const InfoCard = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  padding: theme.spacing(2),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.neutral,
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: theme.palette.background.default,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2]
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.primary.main
  }
}));

const TaskItem = ({ title, status, children }) => (
  <Box sx={{ mb: 3 }}>
    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
      <AssignmentIcon color="primary" />
      <Typography variant="h5" sx={{ fontWeight: 600, flex: 1 }}>
        {title}
      </Typography>
      <StatusChip label={status} status={status.toLowerCase()} size="small" />
    </Stack>
    <Box sx={{ pl: 4 }}>{children}</Box>
  </Box>
);

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  textTransform: 'none',
  fontWeight: 600,
  padding: theme.spacing(1.5, 2),
  borderWidth: 1.5,
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    borderWidth: 1.5,
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[2]
  }
}));

export default function ITRSummary() {
  const progress = 60;

  return (
    <Box sx={{ p: 4 }}>
      {/* Header Section */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h2" sx={{ 
          fontWeight: 700, 
          color: 'primary.main',
          letterSpacing: '-0.5px'
        }}>
          ITR Filing Summary
        </Typography>
        <Typography variant="h4" color="text.secondary" sx={{ opacity: 0.8 }}>
          Financial Year: 2023-24 (Personal)
        </Typography>
      </Stack>

      <Grid container spacing={4}>
        {/* Left Column - Main Content */}
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 3,
              bgcolor: '#fff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4]
              }
            }}
          >
            <Stack spacing={4}>
              {/* Progress Bar */}
              <Box sx={{ 
                p: 3, 
                borderRadius: 3, 
                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.04),
                border: 1,
                borderColor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.06),
                  borderColor: (theme) => alpha(theme.palette.secondary.main, 0.2)
                }
              }}>
                <Stack spacing={2}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Typography variant="h5" fontWeight={600}>
                      Overall Progress
                    </Typography>
                    <Typography variant="h5" color="secondary.main" fontWeight={700}>
                      {progress}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={progress} 
                    sx={{ 
                      height: 8, 
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: 'secondary.main',
                        borderRadius: 2
                      }
                    }}
                  />
                </Stack>
              </Box>

              {/* Tasks Section */}
              <Stack spacing={3}>
                <Typography variant="h5" fontWeight={600}>
                  Tasks Overview
                </Typography>
                
                <TaskItem title="Document Collection" status="Completed">
                  <List dense sx={{ pl: 2 }}>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography fontWeight={500}>Upload PAN</Typography>}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Completed on 05 April 2025
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography fontWeight={500}>Upload Form 16</Typography>}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            Completed on 06 April 2025
                          </Typography>
                        }
                      />
                    </ListItem>
                    <ListItem sx={{ py: 1 }}>
                      <ListItemIcon>
                        <CancelIcon color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={<Typography fontWeight={500}>Upload 26AS</Typography>}
                        secondary={
                          <Typography variant="body2" sx={{ color: 'error.light', mt: 0.5 }}>
                            Pending - Required for processing
                          </Typography>
                        }
                      />
                    </ListItem>
                  </List>
                </TaskItem>

                <TaskItem title="Prepare Draft Return" status="In Progress">
                  <Box sx={{ pl: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{
                      p: 1.5,
                      bgcolor: 'background.neutral',
                      borderRadius: 2
                    }}>
                      <PersonIcon color="primary" />
                      <Stack spacing={0.5}>
                        <Typography variant="body2" color="text.secondary">
                          Assigned to
                        </Typography>
                        <Typography fontWeight={600}>
                          TARA FIRST
                        </Typography>
                      </Stack>
                    </Stack>
                  </Box>
                </TaskItem>

                <TaskItem title="Review Draft with User" status="Pending" />
                <TaskItem title="Final Filing" status="Pending" />
                <TaskItem title="Share Acknowledgement" status="Pending" />
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Column - Status and Actions */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              height: '100%',
              border: 1, 
              borderColor: 'divider', 
              borderRadius: 3,
              bgcolor: '#fff',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: (theme) => theme.shadows[4]
              }
            }}
          >
            <Stack spacing={4} sx={{ height: '100%' }}>
              {/* Status Cards */}
              <Stack spacing={2}>
                <Typography variant="h5" fontWeight={600}>
                  Status Information
                </Typography>
                <InfoCard>
                  <AccessTimeIcon />
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      In Progress
                    </Typography>
                  </Stack>
                </InfoCard>
                <InfoCard>
                  <CalendarTodayIcon />
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Started on
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      05 April 2025
                    </Typography>
                  </Stack>
                </InfoCard>
                <InfoCard>
                  <CalendarTodayIcon />
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Last updated
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      08 April 2025
                    </Typography>
                  </Stack>
                </InfoCard>
                <InfoCard>
                  <CalendarTodayIcon />
                  <Stack spacing={0.5}>
                    <Typography variant="body2" color="text.secondary">
                      Est. completion
                    </Typography>
                    <Typography variant="subtitle1" fontWeight={600}>
                      12 April 2025
                    </Typography>
                  </Stack>
                </InfoCard>
              </Stack>

              {/* Quick Actions */}
              <Stack spacing={3}>
                <Typography variant="h4" fontWeight={600}>
                  Quick Actions
                </Typography>
                <Stack spacing={2}>
                  <ActionButton 
                    startIcon={<CloudUploadIcon />} 
                    variant="outlined" 
                    color="secondary"
                    fullWidth
                    sx={{ py: 1.25 }}
                  >
                    Upload Documents (3/4)
                  </ActionButton>
                  <ActionButton 
                    startIcon={<ChatIcon />} 
                    variant="outlined" 
                    color="secondary"
                    fullWidth
                    sx={{ py: 1.25 }}
                  >
                    Chat Support
                  </ActionButton>
                  <ActionButton 
                    startIcon={<DownloadIcon />} 
                    variant="outlined" 
                    color="secondary"
                    fullWidth
                    sx={{ py: 1.25 }}
                  >
                    Download Format
                  </ActionButton>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
