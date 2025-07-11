import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import DraftsOutlinedIcon from '@mui/icons-material/DraftsOutlined';
import EditIcon from '@mui/icons-material/Edit';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Chip, Grid, IconButton, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import Factory from 'utils/Factory';
import Event from './Event';
import MyEvents from './MyEvent';

const filters = [
  { label: 'Category', options: ['All', 'Company', 'HR', 'Finance'] },
  { label: 'Events', options: ['All', 'Director Appointment', 'DIN'] },
  { label: 'Documents', options: ['All', 'Doc1', 'Doc2'] },
  { label: 'Status', options: ['All', 'Processed', 'Completed'] },
  { label: 'Creator', options: ['All', 'Srinivas', 'Surya'] },
  { label: 'Date', options: ['All', '23/12/22', '12/09/22'] },
];

const statusChip = (status) => {
  if (status === 'Processed')
    return <Chip label="Processed" sx={{ bgcolor: '#FFF9C4', color: '#FBC02D', fontWeight: 500 }} />;
  if (status === 'Completed')
    return <Chip label="Completed" sx={{ bgcolor: '#C8E6C9', color: '#388E3C', fontWeight: 500 }} />;
  return <Chip label={status} />;
};

export default function Drafting({ id, onShowMyEvents }) {
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEvent, setShowEvent] = useState(false);
  const myEventsRef = React.useRef(null);
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Factory('get', `/documentdrafting/document-list/${id}/`, {}, {})
      .then(response => {
        const resData = response?.res?.data || response?.res || response;
        const rows = (resData?.results || resData || []).map(item => ({
          name: item.document?.name || item.name || '-',
         
          category: item.category?.name || '-',
          event: item.event?.name || '-',
          status: item.status || '-',
          lastEdited: item.last_edited || item.created_date || '-',
          creator: item.creator || '-',
          id: item.id,
        }));
        setTableRows(rows);
      })
      .catch(() => setTableRows([]))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    setStatsLoading(true);
    // Factory('get', /documentdrafting/documents-summary-by-context/?doc_draft_id=${id}, {}, {})
    Factory('get', `/documentdrafting/documents-summary-by-context/?doc_draft_id=${id}`, {}, {})

      .then(response => {
        const resData = response?.res?.data || response?.res || response;
        // Convert object to array of { label, value }
        const statsArr = Object.entries(resData || {}).map(([label, value]) => ({ label, value }));
        setStats(statsArr);
      })
      .catch(() => setStats([]))
      .finally(() => setStatsLoading(false));
  }, [id]);

  if (showEvent) {
    return <Event contextId={id}/>;
  }

  const scrollToMyEvents = () => {
    myEventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const statIcons = {
    "Total Document": <DescriptionOutlinedIcon color="primary" fontSize="large" />,
    "Draft": <DraftsOutlinedIcon color="warning" fontSize="large" />,
    "Finalized": <CheckCircleOutlineIcon color="success" fontSize="large" />,
    "Action Pending": <ErrorOutlineIcon color="error" fontSize="large" />,
  };

  const statStyles = {
    "Total Document": {
      iconBg: "#E3EAFE",
      iconColor: "#2F54EB",
      buttonBg: "#E3EAFE",
      buttonColor: "#2F54EB"
    },
    "Draft": {
      iconBg: "#FFF7E3",
      iconColor: "#FAAD14",
      buttonBg: "#F0F0F0",
      buttonColor: "#595959"
    },
    "Finalized": {
      iconBg: "#E6FAF0",
      iconColor: "#52C41A",
      buttonBg: "#F0F0F0",
      buttonColor: "#595959"
    },
    "Action Pending": {
      iconBg: "#FFF1F0",
      iconColor: "#FF4D4F",
      buttonBg: "#F0F0F0",
      buttonColor: "#595959"
    }
  };

  // Calculate paginated rows
  const paginatedRows = tableRows.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const pageCount = Math.ceil(tableRows.length / rowsPerPage);

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: '#fff', minHeight: '100vh' }}>
      {/* Title and Actions */}
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" mb={4} gap={2}>
        <Typography variant="h4" fontWeight={700}>Document Drafting</Typography>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" startIcon={<AddIcon />}onClick={() => setShowEvent(true)} >Create New Document</Button>
          <Button variant="contained" startIcon={<EventIcon />} onClick={() => setShowEvent(true)}>Create New Event</Button>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            sx={{ bgcolor: '#F5F7FA', color: '#222' }}
            onClick={scrollToMyEvents}
          >
            My Events
          </Button>
        </Stack>
      </Box>

      {/* Filters */}
      <Box display="flex" flexWrap="wrap" gap={2} mb={3}>
        <TextField
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ minWidth: 180, bgcolor: '#F5F7FA' }}
        />
        {filters.map((filter) => (
          <TextField
            key={filter.label}
            select
            label={filter.label}
            size="small"
            sx={{ minWidth: 140, bgcolor: '#F5F7FA' }}
            defaultValue={filter.options[0]}
          >
            {filter.options.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        ))}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        {statsLoading ? (
          <Grid item xs={12}><Typography align="center">Loading stats...</Typography></Grid>
        ) : stats.length === 0 ? (
          <Grid item xs={12}><Typography align="center">No stats found</Typography></Grid>
        ) : (
          stats.map((stat) => {
            const style = statStyles[stat.label] || {};
            return (
              <Grid item xs={12} sm={6} md={3} key={stat.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    minHeight: 140,
                    border: '1.5px solid #E5EAF2',
                    boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                    transition: 'box-shadow 0.2s, border-color 0.2s',
                    '&:hover': {
                      boxShadow: '0 4px 16px 0 rgba(24, 39, 75, 0.12)',
                      borderColor: style.iconColor || '#2F54EB',
                      '.stat-view-btn': {
                        background: style.iconColor || '#2F54EB',
                        color: '#fff'
                      }
                    }
                  }}
                >
                  <Box
                    mb={2}
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: '50%',
                      background: style.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {React.cloneElement(statIcons[stat.label] || <DescriptionOutlinedIcon />, {
                      style: { color: style.iconColor, fontSize: 28 }
                    })}
                  </Box>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {stat.label === "Total Document" ? "Total Documents" : stat.label}
                  </Typography>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 1 }}>
                    {String(stat.value).padStart(2, '0')}
                  </Typography>
                  <Button
                    className="stat-view-btn"
                    variant="contained"
                    disableElevation
                    sx={{
                      mt: 1,
                      background: style.buttonBg,
                      color: style.buttonColor,
                      fontWeight: 500,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 'none',
                      minWidth: 64,
                      transition: 'background 0.2s, color 0.2s'
                    }}
                  >
                    View
                  </Button>
                </Paper>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Table */}
      <Paper elevation={1} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ background: '#F5F6F8' }}>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Edited</TableCell>
              <TableCell>Creator</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} align="center">Loading...</TableCell>
              </TableRow>
            ) : tableRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">No data found</TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, idx) => (
                <TableRow key={row.id || idx}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.category}</TableCell>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>{statusChip(row.status)}</TableCell>
                  <TableCell>{row.lastEdited}</TableCell>
                  <TableCell>{row.creator}</TableCell>
                  <TableCell>
                    <IconButton color="primary"><EditIcon /></IconButton>
                    <IconButton color="error"><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
      {/* Pagination Controls */}
      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            shape="rounded"
            // showFirstButton
            // showLastButton
          />
        </Box>
      )}
      {/* MyEvents section at the bottom of the page */}
      <Box mt={6} ref={myEventsRef}>
        <MyEvents id={id} />
      </Box>
    </Box>
  );
}