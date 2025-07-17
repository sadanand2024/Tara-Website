import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
// import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgressComponent from 'utils/CircularProgressComponent';
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
import { useNavigate } from 'react-router-dom';

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

// ColoredCircularProgress component for colored progress circles
const getProgressColor = (value) => {
  if (value <= 25) return '#FBC02D';      // Yellow for 0-25%
  if (value <= 50) return '#AB47BC';      // Purple for 26-50%
  if (value <= 75) return '#1976d2';      // Blue for 51-75%
  return '#388E3C';                       // Green for 76-100%
};

function ColoredCircularProgress({ value = 0, size = 28, thickness = 5 }) {
  return (
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center">
      {/* Background circle */}
      <CircularProgress
        variant="determinate"
        value={100}
        size={size}
        thickness={thickness}
        sx={{ color: '#E0E0E0', position: 'absolute', left: 0, top: 0 }}
      />
      {/* Foreground progress */}
      <CircularProgress
        variant="determinate"
        value={value}
        size={size}
        thickness={thickness}
        sx={{ color: getProgressColor(value) }}
      />
      {/* Centered label */}
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="caption" component="div" color="text.secondary" fontWeight={600}>
          {`${Math.round(value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

const MyEvents = ({ id }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const navigate = useNavigate();

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
    <>
      {loading ? (
        <Box sx={{
          // borderBottom: '2px solid rgb(196, 191, 191)',
          // borderLeft: '0.1px solid #b0b8c4',
          // borderTop: '0.1px solid #b0b8c4',
          // borderRight: '0.1px solid #b0b8c4',
          borderRadius: 3,
          p: 4,
          background: '#fff',
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <CircularProgressComponent isLoading displayContent={'Loading Events...'} />
        </Box>
      ) : (
        <Box 
          sx={{
            borderBottom: '2px solid rgb(196, 191, 191)',
            borderLeft: '0.1px solid #b0b8c4',
            borderTop: '0.1px solid #b0b8c4',
            borderRight: '0.1px solid #b0b8c4',
            borderRadius: 3,
            p: 4,
            background: '#fff',
          }}
        >
          <Typography variant="h3" fontWeight={700} mb={3} sx={{ color: '#0A1F44' }}>
            My Events
          </Typography>
          <Box
            mb={-3}
            ml={-4}
            mr={-4}
          >
            <TableContainer  sx={{ background: 'transparent', border: 'none' }}>
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
                  {events.length === 0 ? (
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
                        <TableCell sx={{ fontWeight: 500 }}>
                        {event.created_at ? new Date(event.created_at).toLocaleDateString('en-GB') : '-'}
                    </TableCell>
                        <TableCell>
                          {statusChip(event.status)}
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                              {event.progress === 0 ? (
                                <CircularProgress
                                  variant="determinate"
                                  value={100}
                                  size={28}
                                  thickness={5}
                                  sx={{ color: '#E0E0E0' }}
                                />
                              ) : (
                                <CircularProgress
                                  variant="determinate"
                                  value={event.progress}
                                  size={28}
                                  thickness={5}
                                  sx={{ color: getProgressColor(Math.round(event.progress)) }}
                                />
                              )}
                            </Box>
                            <Typography fontWeight={600} sx={{ color: '#0A1F44' }}>
                              {`${Math.round(event.progress)}%`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            sx={{
                              color: '#2F54EB',
                              '&:hover': { color: '#1d39c4', background: 'transparent' },
                            }}
                            onClick={() => {
                              navigate(`/app/drafting/selected-event/${event.id}`);
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      )}
      {/* Pagination Controls */}
      {!loading && pageCount > 1 && (
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
    </>
  );
};

export default MyEvents;