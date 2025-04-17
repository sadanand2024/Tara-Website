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
  Grid
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
  borderRadius: theme.shape.borderRadius,
  fontWeight: 500,
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

const TaskItem = ({ title, status, children }) => (
  <Box sx={{ mb: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 2 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
      <StatusChip
        label={status}
        status={status.toLowerCase()}
        size="small"
      />
    </Box>
    {children}
  </Box>
);

export default function ITRSummary() {
  const progress = 60;
  
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Service Summary - ITR Filing FY: 2023-24 (Personal)
      </Typography>

      {/* Status and Dates Section */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccessTimeIcon color="primary" />
            <Typography variant="body2">
              Status: <strong>In Progress</strong>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon color="primary" />
            <Typography variant="body2">
              Started on: <strong>05 April 2025</strong>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon color="primary" />
            <Typography variant="body2">
              Last updated: <strong>08 April 2025</strong>
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarTodayIcon color="primary" />
            <Typography variant="body2">
              Est. completion: <strong>12 April 2025</strong>
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Progress Bar */}
      <Box sx={{ mb: 4, maxWidth: '100%' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="bo152" color="text.secondary">
            Progress:
          </Typography>
          <Typography variant="body2" sx={{ ml: 'auto' }}>
            {progress}%
          </Typography>
        </Box>
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ 
            height: 8, 
            borderRadius: 1,
            bgcolor: 'secondary.lighter',
            '& .MuiLinearProgress-bar': {
              bgcolor: 'secondary.main'
            }
          }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Tasks Section */}
      <Box sx={{ mb: 4 }}>
        <TaskItem title="Task 1: Document Collection" status="Completed">
          <List dense>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Upload PAN" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Upload Form 16" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CancelIcon color="error" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Upload 26AS" />
            </ListItem>
          </List>
        </TaskItem>

        <TaskItem title="Task 2: Prepare Draft Return" status="In Progress">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3 }}>
            <PersonIcon fontSize="small" color="primary" />
            <Typography variant="body2">
              Assigned to: <strong>TARA FIRST</strong>
            </Typography>
          </Box>
        </TaskItem>

        <TaskItem title="Task 3: Review Draft with User" status="Pending" />
        <TaskItem title="Task 4: Final Filing" status="Pending" />
        <TaskItem title="Task 5: Share Acknowledgement" status="Pending" />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Footer Section */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2">
            Upload Docs: <strong>3 of 4</strong>
          </Typography>
          <Button 
            startIcon={<CloudUploadIcon />} 
            variant="outlined" 
            color="secondary" 
            size="small"
          >
            Upload More Docs
          </Button>
          <Button 
            startIcon={<ChatIcon />} 
            variant="outlined" 
            color="secondary" 
            size="small"
          >
            Chat Support
          </Button>
          <Button 
            startIcon={<DownloadIcon />} 
            variant="outlined" 
            color="secondary" 
            size="small"
          >
            Download Format
          </Button>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Last Update: 12-April-2025
          </Typography>
          <Chip label="Page 4.2" variant="outlined" size="small" />
        </Box>
      </Box>
    </Paper>
  );
}
