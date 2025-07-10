import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Chip,
    CircularProgress,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import Factory from 'utils/Factory';

const statusColor = (status) => {
  switch (status) {
    case 'Processed':
      return { bgcolor: '#FFF9C4', color: '#FBC02D' };
    case 'Completed':
      return { bgcolor: '#C8E6C9', color: '#388E3C' };
    case 'Declined':
      return { bgcolor: '#FFCDD2', color: '#D32F2F' };
    default:
      return { bgcolor: '#E0E0E0', color: '#757575' };
  }
};

const MyEvents = ({ id }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Factory('get', `/documentdrafting/my-events-list/?doc_drafts_id=${id}`, {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        setEvents(data || []);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight={700} mb={3}>
        My Events
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Created On</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Loading...</TableCell>
              </TableRow>
            ) : events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">No events found</TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    {event.event_name?.event_name || event.event_name || '-'}
                  </TableCell>
                  <TableCell>{event.created_at}</TableCell>
                  <TableCell>
                    <Chip
                      label={event.status}
                      sx={{
                        ...statusColor(event.status),
                        fontWeight: 600,
                        px: 2,
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={1}>
                      <CircularProgress
                        variant="determinate"
                        value={event.progress}
                        size={28}
                        thickness={5}
                        sx={{ color: '#1976d2' }}
                      />
                      <Typography fontWeight={600}>{event.progress}%</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton>
                      <EditIcon />
                    </IconButton>
                    <IconButton>
                      <DownloadIcon />
                    </IconButton>
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MyEvents;
