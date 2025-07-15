import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Factory from 'utils/Factory';

const statusColor = (status) => {
  switch (status) {
    case 'Processed':
      return { bgcolor: '#FFF9C4', color: '#FBC02D' };
    case 'Completed':
      return { bgcolor: '#C8E6C9', color: '#388E3C' };
    case 'Declined':
      return { bgcolor: '#FFCDD2', color: '#D32F2F' };
    case 'In progress':
      return { bgcolor: '#FFF9C4', color: '#FBC02D' };
    default:
      return { bgcolor: '#E0E0E0', color: '#757575' };
  }
};

const summaryLabelStyle = {
  color: '#1976d2',
  fontWeight: 700,
  fontSize: 16,
  mb: 0.5
};

const summaryValueStyle = {
  fontWeight: 600,
  fontSize: 16
};

const SelectedEvent = ({ onBack }) => {
  const { eventInstanceId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!eventInstanceId) return;
    setLoading(true);
    setError(null);
    Factory('get', `/documentdrafting/context-events/${eventInstanceId}/`, {}, {})
      .then(response => {
        setEventData(response?.res?.data || response?.res || response);
      })
      .catch(err => {
        setError('Failed to fetch event data');
        setEventData(null);
      })
      .finally(() => setLoading(false));
  }, [eventInstanceId]);
  

  if (loading) return <Box p={4}><Typography>Loading...</Typography></Box>;
  if (error) return <Box p={4}><Typography color="error">{error}</Typography></Box>;
  if (!eventData) return <Box p={4}><Typography>No data found</Typography></Box>;

  // Extract and map data as needed
  const eventInstance = eventData.event_instance || {};
  const eventName = eventInstance.event_name?.event_name || 'N/A';
  const createdOn = eventInstance.created_at
    ? new Date(eventInstance.created_at).toLocaleDateString()
    : (eventData.created_at ? new Date(eventData.created_at).toLocaleDateString() : 'N/A');
  const status = eventInstance.status || eventData.status || 'N/A';
  const progress = eventInstance.progress || eventData.progress || { completed: 0, total: 0 };
  const documents = eventData.documents || [];
  const progressPercent = (progress.completed / progress.total) * 100;

  return (
    <Box
      sx={{
        p: { xs: 1, md: 4 },
        bgcolor: '#f7f9fb',
        minHeight: '50vh',
        width: '90vw',
      }}
    >
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="body2" color="#757575">
          <b>
            <span
              style={{ color: '#757575', textDecoration: 'none', cursor: 'pointer' }}
              // onClick={() => { window.location.href = '/app/drafting'; }}
            >
              Document Drafting
            </span>
          </b>
          &nbsp;&gt;&nbsp;
          <b>
            <span
              style={{ color: '#757575', textDecoration: 'none', cursor: 'pointer' }}
              // onClick={() => { window.location.href = '/app/event'; }}
            >
              Event Creation 
            </span>
          </b>
          &nbsp;&gt;&nbsp;
          <b style={{ color: '#1976d2' }}>{eventName}</b>
        </Typography>
        <Button
          variant="outlined"
          onClick={() => { window.location.href = '/app/drafting'; }} // Update path if needed
          startIcon={<ArrowBackIcon />}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2 }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Main Card with summary and table */}
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 1,
          p: 0,
          width: '100%',
          maxWidth: 'none',
          mx: 0
        }}
      >
        <CardContent sx={{ pb: 0 }}>
          <Grid2 container spacing={23} alignItems="center" sx={{ mb: 2 }}>
            <Grid2 xs={12} sm={3}>
              <Typography sx={summaryLabelStyle}>Event Name</Typography>
              <Typography sx={summaryValueStyle}>{eventName}</Typography>
            </Grid2>
            <Grid2 xs={12} sm={3}>
              <Typography sx={summaryLabelStyle}>Created On</Typography>
              <Typography sx={summaryValueStyle}>{createdOn}</Typography>
            </Grid2>
            <Grid2 xs={12} sm={3}>
              <Typography sx={summaryLabelStyle}>Status</Typography>
              <Chip
                label={status}
                sx={{
                  ...statusColor(status),
                  fontWeight: 600,
                  px: 2,
                  fontSize: 16,
                  borderRadius: 2,
                  boxShadow: 0
                }}
              />
            </Grid2>
            <Grid2 xs={12} sm={3}>
              <Typography sx={summaryLabelStyle}>Progress</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress
                  variant="determinate"
                  value={progressPercent}
                  size={32}
                  thickness={5}
                  sx={{ color: '#1976d2', mr: 1 }}
                />
                <Typography sx={summaryValueStyle}>{progress.completed}/{progress.total} Docs Completed</Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
        <Box sx={{ px: 3, pb: 3 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#f5f6fa' }}>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: 15, borderTopLeftRadius: 12 }}>Document Name</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: 15 }}>Template</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: 15 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: 15 }}>Last Edited</TableCell>
                  <TableCell sx={{ fontWeight: 700, color: '#1976d2', fontSize: 15, borderTopRightRadius: 12 }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {doc.document?.name || '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={'Template'}
                        sx={{
                          bgcolor: '#1138e7',
                          color: '#fff',
                          fontWeight: 600,
                          px: 2,
                          borderRadius: 2,
                          fontSize: 15,
                          cursor: 'pointer',
                          transition: 'box-shadow 0.2s',
                          boxShadow: 0,
                          '&:hover': {
                            boxShadow: 2,
                            bgcolor: '#00329E',
                          },
                        }}
                        onClick={() => navigate(`/app/drafting/fill/${doc.id}`)}
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doc.status}
                        sx={{
                          ...statusColor(doc.status),
                          fontWeight: 600,
                          px: 2,
                          borderRadius: 2,
                          fontSize: 15
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>
                      {doc.updated_at ? new Date(doc.updated_at).toLocaleDateString() : ''}
                    </TableCell>
                    <TableCell>
                      {doc.status === 'Processed' || doc.status === 'Completed' ? (
                        <Button variant="contained" size="small" endIcon={<EditIcon />} sx={{ bgcolor: '#1976d2', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 15, boxShadow: 0, px: 2 }}>
                          Start Drafting
                        </Button>
                      ) : doc.status === 'Declined' ? (
                        <Button variant="outlined" size="small" sx={{ color: '#FBC02D', borderColor: '#FBC02D', borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 15, px: 2 }}>
                          Continue
                        </Button>
                      ) : (
                        <IconButton sx={{ color: '#1976d2' }}>
                          <VisibilityIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Card>
    </Box>
  );
};

export default SelectedEvent;
