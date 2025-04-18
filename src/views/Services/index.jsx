import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Card,
  CardContent,
  Button,
  LinearProgress,
  Stack,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Tooltip,
  Zoom,
  Fade
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import ChatIcon from '@mui/icons-material/Chat';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import ReviewsIcon from '@mui/icons-material/Reviews';
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Styled Components

const AnimatedCard = styled(Card)(({ theme }) => ({
  transition: 'all 0.3s ease-in-out',
  width: '100%',
  height: '100%',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: theme.shadows[8],
    '& .MuiButton-root': {
      opacity: 1,
      transform: 'translateY(0)'
    }
  }
}));

const AnimatedButton = styled((props) => (
  <Button size="small" {...props} />
))(({ theme }) => ({
  opacity: 0.9,
  transform: 'translateY(10px)',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));



const ProgressWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  '& .MuiLinearProgress-root': {
    height: 8,
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.lighter,
    '& .MuiLinearProgress-bar': {
      borderRadius: 5,
      backgroundColor: theme.palette.secondary.main
    }
  }
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem',
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.palette.text.primary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '& .MuiSvgIcon-root': {
    fontSize: '1.8rem',
    color: theme.palette.secondary.main
  },
  position: 'relative',
  '&:after': {
    content: '""',
    position: 'absolute',
    bottom: -8,
    left: 0,
    width: 60,
    height: 3,
    backgroundColor: theme.palette.secondary.main,
    borderRadius: theme.shape.borderRadius
  }
}));

const ActiveBadge = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.success.lighter,
  color: theme.palette.success.darker,
  padding: theme.spacing(0.5, 2),
  borderRadius: theme.shape.borderRadius * 2,
  fontSize: '1.1rem',
  fontWeight: 500,
  //   border: `1px solid ${theme.palette.success.light}`,
  '& .MuiSvgIcon-root': {
    fontSize: '1.2rem'
  }
}));

const StatusCard = styled(AnimatedCard)(({ theme }) => ({
  height: '100%',
  minHeight: 100,
  display: 'flex',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius
  },
  '& .MuiCardContent-root': {
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing(2),
    width: '100%'
  }
}));

export default function Services() {
  const [filter, setFilter] = React.useState('all');
  const navigate = useNavigate();

  const serviceCards = [
    {
      title: 'ITR Filing - FY: 2024-25 (Personal)',
      status: 'In Progress',
      progress: 60,
      tasks: '2 Pending',
      docs: '3/4 uploaded',
      icon: <AssignmentIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'ITR Filing - FY: 2024-25 (Business)',
      status: 'In Progress',
      progress: 20,
      tasks: '3 Pending',
      docs: '2/5 uploaded',
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'Company Incorporation - FY: 2024-25 (Business)',
      status: 'In Progress',
      progress: 80,
      tasks: '3 Pending',
      docs: '2/5 uploaded',
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'Auditing - FY: 2024-25 (Business)',
      status: 'In Progress',
      progress: 90,
      tasks: '4 Pending',
      docs: '1/5 uploaded',
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
    },
    {
      title: 'Business Loan - FY: 2024-25 (Business)',
      status: 'In Progress',
      progress: 10,
      tasks: '6 Pending',
      docs: '2/8 uploaded',
      icon: <DescriptionIcon color="primary" sx={{ fontSize: 40 }} />
    }
  ];

  const statusSummary = [
    {
      label: 'Services in Progress',
      count: 2,
      icon: <PendingIcon sx={{ fontSize: 35 }} />,
      trend: '+1 this week',
      trendIcon: <TrendingUpIcon color="success" />,
      color: 'warning.main',
      bgColor: 'warning.lighter'
    },
    {
      label: 'Awaiting Action',
      count: 1,
      icon: <AccessTimeIcon sx={{ fontSize: 35 }} />,
      trend: 'Due today',
      trendIcon: <TrendingDownIcon color="error" />,
      color: 'error.main',
      bgColor: 'error.lighter'
    },
    {
      label: 'Under Review',
      count: 1,
      icon: <ReviewsIcon sx={{ fontSize: 35 }} />,
      trend: '2 days left',
      trendIcon: <AccessTimeIcon color="info" />,
      color: 'info.main',
      bgColor: 'info.lighter'
    },
    {
      label: 'Completed',
      count: 1,
      icon: <CheckCircleIcon sx={{ fontSize: 35 }} />,
      trend: 'Last week',
      trendIcon: <CheckCircleOutlineIcon color="success" />,
      color: 'success.dark',
      bgColor: 'success.lighter'
    }
  ];

  return (
    <Box>
      {/* Header Section */}
      <Fade in timeout={800}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            gap: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 1
          }}
        >
          <Typography
            variant="h2"
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              color: 'text.primary',
              fontWeight: 600
            }}
          >
            <DashboardIcon
              sx={{
                color: 'secondary.main',
                fontSize: '2rem'
              }}
            />
            My Services
            <ActiveBadge>
              <CheckCircleOutlineIcon />5 Active
            </ActiveBadge>
          </Typography>

          <TextField
            placeholder="Search services..."
            size="small"
            sx={{
              width: 250,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '&:hover': {
                  '& > fieldset': { borderColor: 'secondary.main' }
                }
              }
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="secondary" />
                </InputAdornment>
              )
            }}
          />

          <Select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            size="small"
            sx={{
              width: 180,
              borderRadius: 2,
              '&:hover': {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'secondary.main'
                }
              },
              '& .MuiMenuItem-root': {
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }
            }}
            startAdornment={<FilterListIcon sx={{ mr: 1 }} color="secondary" />}
          >
            <MenuItem
              value="all"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              All Services
            </MenuItem>
            <MenuItem
              value="in-progress"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              In Progress
            </MenuItem>
            <MenuItem
              value="awaiting"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Awaiting Action
            </MenuItem>
            <MenuItem
              value="review"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Under Review
            </MenuItem>
            <MenuItem
              value="completed"
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              Completed
            </MenuItem>
          </Select>
        </Box>
      </Fade>

      {/* Service Cards */}

      <Box sx={{ mb: 4 }}>
        <Grid container spacing={4}>
          {serviceCards.map((service, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Zoom in timeout={500 + index * 200}>
                <AnimatedCard>
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mb: 3,
                        gap: 2,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        pb: 2
                      }}
                    >
                      {service.icon}
                      <Typography variant="h4" sx={{ fontWeight: 500 }}>
                        {service.title}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box sx={{ flexGrow: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <AccessTimeIcon sx={{ mr: 1, color: 'secondary.main' }} />
                          <Typography variant="body1" color="text.secondary">
                            Status: {service.status}
                          </Typography>
                        </Box>
                        <ProgressWrapper>
                          <LinearProgress variant="determinate" value={service.progress} />
                          <Typography
                            variant="caption"
                            sx={{
                              position: 'absolute',
                              right: 0,
                              top: -18,
                              color: 'secondary.main',
                              fontWeight: 500
                            }}
                          >
                            {service.progress}%
                          </Typography>
                        </ProgressWrapper>
                      </Box>
                      <Box sx={{ ml: 3, minWidth: 120 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <PendingIcon fontSize="small" color="warning" />
                          {service.tasks}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <DescriptionIcon fontSize="small" color="info" />
                          Docs: {service.docs}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={2} sx={{ mt: 'auto' }}>
                      <Tooltip title="View service details" arrow>
                        <AnimatedButton
                          startIcon={<VisibilityIcon />}
                          onClick={() => navigate('/app/my-services/itr-dashboard')}
                          variant="outlined"
                          color="secondary"
                          fullWidth
                        >
                          View Details
                        </AnimatedButton>
                      </Tooltip>
                      <Tooltip title="Upload required documents" arrow>
                        <AnimatedButton startIcon={<CloudUploadIcon />} variant="outlined" color="secondary" fullWidth>
                          Upload docs
                        </AnimatedButton>
                      </Tooltip>
                      <Tooltip title="Chat with support team" arrow>
                        <AnimatedButton startIcon={<ChatIcon />} variant="outlined" color="secondary" fullWidth>
                          Chat Support
                        </AnimatedButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </AnimatedCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Status Summary */}
      <Box>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontWeight: 500
          }}
        >
          <AssignmentIcon color="secondary" />
          Hey Ratan, You're currently working on 5 services.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          {statusSummary.map((status, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Zoom in timeout={500 + index * 100}>
                <StatusCard sx={{ '&::after': { backgroundColor: status.color } }}>
                  <CardContent>
                    <Box
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: status.bgColor,
                        color: status.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {status.icon}
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h4" sx={{ color: 'text.primary', mb: 0.5 }}>
                        {status.count}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        {status.label}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {status.trendIcon}
                        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                          {status.trend}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </StatusCard>
              </Zoom>
            </Grid>
          ))}
        </Grid>

        <Typography
          variant="body1"
          sx={{
            mb: 0,
            fontStyle: 'italic',
            color: 'text.secondary',
            textAlign: 'center'
          }}
        >
          Let's get one step closer to finishing everything.
        </Typography>

        <Stack direction="row" spacing={3} justifyContent="center" sx={{ mt: 3 }}>
          <Tooltip title="Start a new service request" arrow>
            <AnimatedButton startIcon={<AddIcon />} variant="contained" color="secondary" sx={{ px: 4, py: 1 }}>
              New Service
            </AnimatedButton>
          </Tooltip>
          <Tooltip title="Get expert assistance" arrow>
            <AnimatedButton startIcon={<ChatIcon />} variant="outlined" color="secondary" sx={{ px: 4, py: 1 }}>
              Chat with Expert
            </AnimatedButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );
}
