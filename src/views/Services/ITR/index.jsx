import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  LinearProgress,
  alpha,
  Card
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChatIcon from '@mui/icons-material/Chat';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventIcon from '@mui/icons-material/Event';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: theme.shape.borderRadius * 2,
  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    width: '40%',
    height: '100%',
    background: (theme) => `linear-gradient(135deg, transparent 40%, ${alpha(theme.palette.primary.light, 0.1)})`,
    clipPath: 'path("M 100 0 Q 50 50 100 100")',
    transition: 'all 0.3s ease',
    opacity: 0.8,
    zIndex: 0
  }
}));

const StatusChip = styled(Box)(({ theme, status }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 1.5),
  borderRadius: theme.shape.borderRadius * 4,
  fontSize: '0.8rem',
  fontWeight: 500,
  ...(status === 'completed' && {
    backgroundColor: alpha(theme.palette.success.dark, 0.1),
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.success.dark}`
  }),
  ...(status === 'pending' && {
    backgroundColor: alpha(theme.palette.warning.dark, 0.1),
    color: theme.palette.text.primary,
    border: `1px solid ${theme.palette.warning.dark}`
  })
}));

const TimelineItem = styled(ListItem)(({ theme, completed }) => ({
  position: 'relative',
  '&:not(:last-child)': {
    marginBottom: theme.spacing(2)
  }
}));

export default function ITRFilingDetails() {
  const progress = 60;
  
  return (
    <Box>
      {/* Header Section */}
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            color: 'secondary.main',
            letterSpacing: '-0.5px'
          }}
        >
          ITR Filing Details
        </Typography>
        <Typography variant="h4" color="text.secondary" sx={{ opacity: 0.8 }}>
          Financial Year: 2023-24 (Salaried)
      </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        {/* Left Section */}
        <Box sx={{ flex: 2 }}>
          {/* Progress Overview */}
          <StyledCard sx={{ mb: 3 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
                Service Filling - FY 2023-24 (Salaried)
              </Typography>
              <Stack direction="row" alignItems="center">
                <Stack spacing={0.5} sx={{ borderRight: '1px solid #e0e0e0', pr: 4 }}>
                  <Typography color="text.secondary" variant="body2">
                    Status:
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                    <Typography variant="subtitle1" fontWeight={500}>
                      In Progress
                    </Typography>
                  </Stack>
                </Stack>
                <Stack spacing={0.5} sx={{ borderRight: '1px solid #e0e0e0', px: 4 }}>
                  <Typography color="text.secondary" variant="body2">
                    Progress:
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={500}>
                    3/5 Tasks Done
                  </Typography>
                </Stack>
                <Stack spacing={0.5} sx={{ px: 4 }}>
                  <Typography color="text.secondary" variant="body2">
                    Started On
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={500}>
                    12 Apr 2025
            </Typography>
                </Stack>
                <Button
                  variant="outlined"
                  startIcon={<ChatIcon />}
                  size="medium"
                  sx={{
                    ml: 'auto',
                    borderRadius: 1,
                    textTransform: 'none',
                    px: 2
                  }}
                >
                  Chat with Support
                </Button>
              </Stack>
          </Box>
          </StyledCard>

          {/* Task Timeline */}
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 1 }}>
                Filing Timeline
              </Typography>
              <List sx={{ '& .MuiListItem-root': { px: 0 } }}>
                {/* Document Collection */}
                <TimelineItem completed>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <CheckCircleIcon color="success" />
                            <Typography variant="subtitle1" fontWeight={600}>
                              Document Collection
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            All required documents for ITR filing
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <StatusChip status="completed">Completed</StatusChip>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                              borderColor: (theme) => alpha(theme.palette.success.main, 0.5),
                              color: 'success.darker',
                              '&:hover': {
                                borderColor: 'success.main',
                                bgcolor: (theme) => alpha(theme.palette.success.main, 0.04)
                              }
                            }}
                          >
                            View Files
                          </Button>
                        </Stack>
                      </Stack>
                    }
                    secondary={
                      <Box sx={{ mt: 1, ml: 4 }}>
                        <Stack spacing={2}>
                          {['PAN Card', 'Form 16', '26AS'].map((doc, index) => (
                            <Stack key={index} direction="row" alignItems="center" spacing={2}>
                              <CheckCircleIcon color="success" fontSize="small" />
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {doc}
                              </Typography>
                              <Typography variant="caption" color="success.darker">
                                Verified
            </Typography>
                            </Stack>
                          ))}
                        </Stack>
          </Box>
                    }
                  />
                </TimelineItem>

                {/* Prepare Draft Return */}
                <TimelineItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <RadioButtonUncheckedIcon color="primary" />
                            <Typography variant="subtitle1" fontWeight={600}>
                              Prepare Draft Return
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Our experts are preparing your draft return
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <StatusChip status="pending">In Progress</StatusChip>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloudUploadIcon />}
                            sx={{
                              borderColor: (theme) => alpha(theme.palette.primary.main, 0.5),
                              color: 'primary.main',
                              '&:hover': {
                                borderColor: 'primary.main',
                                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04)
                              }
                            }}
                          >
                            Upload Additional Docs
                          </Button>
                        </Stack>
                      </Stack>
                    }
                  />
                </TimelineItem>

                {/* Review Draft with User */}
                <TimelineItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <RadioButtonUncheckedIcon color="disabled" />
                            <Typography variant="subtitle1" fontWeight={600}>
                              Review Draft with User
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Schedule a call to review your draft return
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <StatusChip status="pending">Pending</StatusChip>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<EventIcon />}
                            sx={{
                              borderColor: (theme) => alpha(theme.palette.secondary.main, 0.5),
                              color: 'secondary.main',
                              '&:hover': {
                                borderColor: 'secondary.main',
                                bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.04)
                              }
                            }}
                          >
                            Schedule Review
                          </Button>
                        </Stack>
                      </Stack>
                    }
                  />
                </TimelineItem>

                {/* File the Return */}
                <TimelineItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <RadioButtonUncheckedIcon color="disabled" />
                            <Typography variant="subtitle1" fontWeight={600}>
                              File the Return
            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Final submission of your ITR
            </Typography>
                        </Stack>
                        <StatusChip status="pending">Pending</StatusChip>
                      </Stack>
                    }
                  />
                </TimelineItem>

                {/* Share Acknowledgement */}
                <TimelineItem>
                  <ListItemText
                    primary={
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                        <Stack spacing={0.5}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <RadioButtonUncheckedIcon color="disabled" />
                            <Typography variant="subtitle1" fontWeight={600}>
                              Share Acknowledgement
          </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary">
                            Download your ITR acknowledgement
          </Typography>
                        </Stack>
                        <StatusChip status="pending">Pending</StatusChip>
                      </Stack>
                    }
                  />
                </TimelineItem>
              </List>
            </Box>
          </StyledCard>
        </Box>

        {/* Right Section */}
        <Box sx={{ flex: 1 }}>
          <StyledCard>
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" fontWeight={600} sx={{ mb: 3 }}>
                Document Summary
              </Typography>

              <Stack spacing={4}>
                {/* Document Stats */}
                <Stack direction="row" spacing={3}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
                      justifyContent: 'space-between',
                      flex: 1
                    }}
                  >
                    <Typography variant="h4" color="success.darker" fontWeight={700}>
                      3
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Uploaded
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                      justifyContent: 'space-between',
                      flex: 1
                    }}
                  >
                    <Typography variant="h4" color="warning.dark" fontWeight={700}>
                      1
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                      justifyContent: 'space-between',
                      flex: 1
                    }}
                  >
                    <Typography variant="h4" color="error.dark" fontWeight={700}>
                      2
                    </Typography>
                    <Typography variant="body2" color="error.secondary">
                      Missing
                    </Typography>
                  </Stack>
                </Stack>

                {/* Missing Documents */}
                <Box>
                  <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                    Missing Documents
                  </Typography>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.04),
                      border: 1,
                      borderColor: (theme) => alpha(theme.palette.error.main, 0.1)
                    }}
                  >
                    <Stack spacing={2}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
          sx={{ 
                            width: 8,
            height: 8, 
                            borderRadius: '50%',
                            bgcolor: 'error.main'
                          }}
                        />
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={500}>
                            Form 26AS
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Required for income verification
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            borderColor: (theme) => alpha(theme.palette.error.main, 0.5),
                            color: 'error.main',
                            '&:hover': {
                              borderColor: 'error.main',
                              bgcolor: (theme) => alpha(theme.palette.error.main, 0.04)
                            }
                          }}
                        >
                          Upload
                        </Button>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'error.main'
                          }}
                        />
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={500}>
                            Bank Statement
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Required for bank interest details
                          </Typography>
                        </Box>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<CloudUploadIcon />}
                          sx={{
                            borderColor: (theme) => alpha(theme.palette.error.main, 0.5),
                            color: 'error.main',
                            '&:hover': {
                              borderColor: 'error.main',
                              bgcolor: (theme) => alpha(theme.palette.error.main, 0.04)
                            }
                          }}
                        >
                          Upload
                        </Button>
                      </Stack>
                    </Stack>
                  </Box>
      </Box>

                {/* Recent Uploads */}
                <Box>
                  <Typography variant="h4" fontWeight={600} sx={{ mb: 2 }}>
                    Recent Uploads
                  </Typography>
                  <Stack spacing={2}>
                    {['PAN Card.pdf', 'Form 16.pdf', 'Aadhaar.jpg'].map((doc, index) => (
                      <Stack
                        key={index}
                        direction="row"
                        spacing={2}
                        alignItems="center"
                        sx={{
                          p: 0.3,
                          borderRadius: 1,
                          bgcolor: 'background.neutral'
                        }}
                      >
                        <InsertDriveFileIcon sx={{ color: 'primary.main' }} />
                        <Box flex={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {doc}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded on 04 Apr
            </Typography>
          </Box>
                      </Stack>
                    ))}
                  </Stack>
      </Box>

                {/* Action Buttons */}
                <Stack spacing={2}>
          <Button 
                    variant="contained"
            startIcon={<CloudUploadIcon />} 
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    Upload Documents
          </Button>
          <Button 
                    variant="outlined"
            startIcon={<ChatIcon />} 
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 600
                    }}
                  >
                    View All Uploads
                  </Button>
                </Stack>

                {/* Help Section */}
                <Box
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                    border: 1,
                    borderColor: (theme) => alpha(theme.palette.primary.main, 0.1)
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
                    Need Assistance?
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Our experts are here to help you with your ITR filing
                  </Typography>
                  <Stack spacing={1}>
                    <Button
                      fullWidth
            variant="outlined" 
                      startIcon={<QuestionAnswerIcon />}
                      sx={{
                        justifyContent: 'flex-start',
                        py: 1,
                        textTransform: 'none'
                      }}
                    >
                      Ask a Question
          </Button>
          <Button 
                      fullWidth
            variant="outlined" 
                      startIcon={<EventIcon />}
                      sx={{
                        justifyContent: 'flex-start',
                        py: 1,
                        textTransform: 'none'
                      }}
                    >
                      Schedule a Call
          </Button>
                  </Stack>
                </Box>
              </Stack>
        </Box>
          </StyledCard>
        </Box>
      </Stack>
      </Box>
  );
}
