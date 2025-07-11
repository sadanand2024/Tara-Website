import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility';
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
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import Factory from 'utils/Factory';

const statusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'processed':
      return { bgcolor: '#FFF7E3', color: '#B6891A' };
    case 'completed':
      return { bgcolor: '#E6FAF0', color: '#179D7A' };
    case 'declined':
      return { bgcolor: '#FFEAEA', color: '#D1293D' };
    default:
      return { bgcolor: '#E0E0E0', color: '#757575' };
  }
};

const MyEvents = ({ id }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Factory('get',`/documentdrafting/my-events-list/?doc_drafts_id=${id}`, {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        setEvents(data || []);
      })
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [id]);

  const paginatedRows = events.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(events.length / rowsPerPage);

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1.5px solid #E5EAF2',
          boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
          p: { xs: 2, md: 4 },
        }}
      >
        <Typography variant="h5" fontWeight={700} mb={3} sx={{ color: '#0A1F44' }}>
          My Events
        </Typography>
        <TableContainer component={Box} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ background: '#F5F6F8' }}>
                <TableCell sx={{ fontWeight: 700, color: '#0A1F44', fontSize: 16 }}>Event Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0A1F44', fontSize: 16 }}>Created On</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0A1F44', fontSize: 16 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0A1F44', fontSize: 16 }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#0A1F44', fontSize: 16 }}>Action</TableCell>
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
                paginatedRows.map((event) => (
                  <TableRow
                    key={event.id}
                    sx={{
                      background: '#fff',
                      transition: 'background 0.2s',
                      '&:hover': {
                        background: '#F5F7FA',
                        cursor: 'pointer',
                      },
                    }}
                  >
                    <TableCell sx={{ color: '#0A1F44', fontWeight: 500 }}>{event.event_name?.event_name || event.event_name || '-'}</TableCell>
                    {/* <TableCell sx={{ color: '#0A1F44' }}>{event.created_at}</TableCell> */}
                    <TableCell sx={{ fontWeight: 500 }}>
                    {event.created_at ? new Date(event.created_at).toLocaleDateString('en-GB') : '-'}
                  </TableCell>
                    <TableCell>
                      <Chip
                        label={event.status}
                        sx={{
                          backgroundColor: statusColor(event.status).bgcolor,
                          color: statusColor(event.status).color,
                          fontWeight: 600,
                          px: 2,
                          borderRadius: 2,
                          fontSize: 14,
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
                          sx={{
                            color: event.status === 'Completed' ? '#52C41A' : event.status === 'Processed' ? '#FAAD14' : event.status === 'Declined' ? '#FF4D4F' : '#1976d2',
                            background: '#F5F6F8',
                            borderRadius: '50%',
                          }}
                        />
                        <Typography fontWeight={600} sx={{ color: '#0A1F44' }}>{event.progress}%</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        sx={{
                          color: '#2F54EB',
                          '&:hover': { color: '#1d39c4', background: 'transparent' },
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{
                          color: '#2F54EB',
                          '&:hover': { color: '#1d39c4', background: 'transparent' },
                        }}
                      >
                        <DownloadIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination Controls */}
        {pageCount > 1 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MyEvents;