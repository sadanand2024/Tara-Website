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
import SelectedEvent from './SelectedEvent';

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

const statusChip = (status) => {
  if (!status) return null;
  const s = status.toLowerCase();
  if (s === 'completed')
    return <Chip label="Completed" sx={{ bgcolor: '#C8E6C9', color: '#388E3C', fontWeight: 500 }} />;
  if (s === 'in progress' || s === 'in_progress')
    return <Chip label="In Progress" sx={{ bgcolor: '#FFE7C2', color: '#FAAD14', fontWeight: 500 }} />;
  if (s === 'yet to start' || s === 'yet_to_start')
    return <Chip label="Yet to Start" sx={{ bgcolor: '#FFEAEA', color: '#D1293D', fontWeight: 500 }} />;
  return <Chip label={status} />;
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
    <Box 
    sx={{
      borderBottom: '2px solid rgb(196, 191, 191)', // thick, prominent grey border
      borderLeft: '0.1px solid #b0b8c4', // thick, prominent grey border
      borderTop: '0.1px solid #b0b8c4', // thick, prominent grey border
      borderRight: '0.1px solid #b0b8c4', // thick, prominent grey border
      borderRadius: 3,
      p: 4,
      background: '#fff',
      // boxShadow: '0 5px 10px 0 rgba(24, 39, 75, 0.06)', // thinner, more subtle shadow at the bottom

    }}
  >
      <Typography variant="h3" fontWeight={700} mb={3} sx={{ color: '#0A1F44' }}>
        My Events
      </Typography>
      {/* <Paper
        // elevation={0}
        // sx={{
        //   width: '100%', // Ensures Paper does not overflow Box
        //   border: '1.5px solid #d1d5db', // subtle grey border
        //   boxShadow: '0 4px 24px 0 rgba(24, 39, 75, 0.08)', // subtle shadow
        //   p: { xs: 2, md: 4 },
        //   borderRadius: 3,
        //   background: '#fff',
        // }}
        elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}
      > */}
      <Box
        // mt={5}
        mb={2}
        ml={3}
        mr={3}
        sx={{
          boxShadow: '0 4px 24px 0 rgba(24, 39, 75, 0.08)', // subtle shadow only
          borderRadius: 3,
          background: '#fff',
          border: '2px solid rgb(228, 224, 224)', // thick, prominent grey border
        }}
      >
        <TableContainer  sx={{ borderRadius: 3, background: 'transparent', border: 'none' }}>
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
                    }}
                  >
                    <TableCell sx={{ color: '#0A1F44', fontWeight: 500 }}>{event.event_name?.event_name || event.event_name || '-'}</TableCell>
                    {/* <TableCell sx={{ color: '#0A1F44' }}>{event.created_at}</TableCell> */}
                    <TableCell sx={{ fontWeight: 500 }}>
                    {event.created_at ? new Date(event.created_at).toLocaleDateString('en-GB') : '-'}
                  </TableCell>
                    <TableCell>
                      {statusChip(event.status)}
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <CircularProgress
                          variant="determinate"
                          value={event.progress}
                          size={28}
                          thickness={5}
                          sx={{
                            color:
                              event.status && event.status.toLowerCase() === 'completed'
                                ? '#52C41A'
                                : event.status && event.status.toLowerCase() === 'processed'
                                ? '#FAAD14'
                                : event.status && event.status.toLowerCase() === 'declined'
                                ? '#D1293D'
                                : '#E0E0E0', // grey for yet_to_start and others
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
                        onClick={() => {
                          window.location.href = `/app/selected-event/${event.id}`;
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
      </Box>
      {/* Pagination Controls */}
      {pageCount > 1 && (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Pagination
              count={pageCount}
              page={page}
              onChange={(e, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
    </Box>
  );
};

export default MyEvents;