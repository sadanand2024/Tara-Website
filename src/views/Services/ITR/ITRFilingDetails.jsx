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
  IconButton
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ChatIcon from '@mui/icons-material/Chat';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EventIcon from '@mui/icons-material/Event';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export default function ITRFilingDetails() {
  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Service Detail
        </Typography>
        <IconButton size="small" color="primary">
          <InfoOutlinedIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={3}>
        {/* Left Section */}
        <Box sx={{ flex: 2 }}>
          {/* Service Header */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              Service Filling - FY 2023-24 (Salaried)
            </Typography>
            <Stack direction="row" spacing={4} sx={{ mb: 2 }}>
              <Box>
                <Typography color="text.secondary" variant="body2">Status:</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>In Progress</Typography>
                </Stack>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">Progress:</Typography>
                <Typography>3/5 tasks Done</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2">Started On</Typography>
                <Typography>12 Apr 2025</Typography>
              </Box>
              <Button
                variant="outlined"
                startIcon={<ChatIcon />}
                size="small"
                sx={{ ml: 'auto' }}
              >
                Chat with Support
              </Button>
            </Stack>
          </Paper>

          {/* Task Timeline */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
              Task Timeline
            </Typography>
            <List sx={{ width: '100%' }}>
              {/* Collect Documents */}
              <ListItem>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>Collect Documents</Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload Now
                      </Button>
                    </Stack>
                  }
                  secondary={
                    <List dense sx={{ mt: 1 }}>
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
                          <CheckCircleIcon color="success" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText primary="Upload 26AS" />
                      </ListItem>
                    </List>
                  }
                />
                <Typography variant="body1" color="success.main" sx={{ fontWeight: 500 }}>
                  Completed
                </Typography>
              </ListItem>

              {/* Prepare Draft Return */}
              <ListItem>
                <ListItemIcon>
                  <RadioButtonUncheckedIcon color="disabled" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Prepare Draft Return</Typography>
                  }
                  secondary="Awaiting internal draft finalization"
                />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Pending
                </Typography>
              </ListItem>

              {/* Review Draft with User */}
              <ListItem>
                <ListItemIcon>
                  <RadioButtonUncheckedIcon color="disabled" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Review Draft with User</Typography>
                  }
                />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Pending
                </Typography>
              </ListItem>

              {/* File the Return */}
              <ListItem>
                <ListItemIcon>
                  <RadioButtonUncheckedIcon color="disabled" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>File the Return</Typography>
                  }
                />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Pending
                </Typography>
              </ListItem>

              {/* Share Acknowledgement */}
              <ListItem>
                <ListItemIcon>
                  <RadioButtonUncheckedIcon color="disabled" />
                </ListItemIcon>
                <ListItemText 
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>Share Acknowledgement</Typography>
                  }
                />
                <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Pending
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </Box>

        {/* Right Section */}
        <Box sx={{ flex: 1 }}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
              Document Summary
            </Typography>
            
            <Stack spacing={3}>
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Uploaded Documents:
                </Typography>
                <Typography variant="body2">Uploaded: 3</Typography>
                <Typography variant="body2">Pending: 1</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Missing:
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                  <Typography variant="body2">26AS</Typography>
                  <Button 
                    size="small" 
                    sx={{ 
                      color: 'primary.main',
                      p: 0,
                      minWidth: 'auto',
                      textTransform: 'none',
                      '&:hover': {
                        background: 'none',
                        textDecoration: 'underline'
                      }
                    }}
                  >
                    Upload
                  </Button>
                </Stack>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Recent Uploads
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InsertDriveFileIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">PAN Card.pdf (04 Apr)</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InsertDriveFileIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">Form 16.pdf (03 Apr)</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <InsertDriveFileIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                    <Typography variant="body2">Aadhaar.jpg (Rejected - reupload)</Typography>
                  </Stack>
                </Stack>
              </Box>

              <Stack spacing={1}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{
                    textTransform: 'none',
                    bgcolor: 'primary.main'
                  }}
                >
                  Upload More Documents
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    textTransform: 'none',
                    color: 'primary.main'
                  }}
                >
                  View All Uploads
                </Button>
              </Stack>

              <Divider />

              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  Need help with this step?
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  TARA Assist is here
                </Typography>
                <Stack spacing={1}>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<QuestionAnswerIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Ask A Question
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<CloudUploadIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Upload A Notice
                  </Button>
                  <Button
                    variant="outlined"
                    fullWidth
                    startIcon={<EventIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Schedule A Callback
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Box>
      </Stack>
    </Box>
  );
}
