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
import { Box, Button, Chip, Grid2, IconButton, InputAdornment, MenuItem, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography, Avatar } from '@mui/material';
import Pagination from '@mui/material/Pagination';
import React, { useEffect, useState } from 'react';
import Factory from 'utils/Factory';
import Event from './Event';
import MyEvents from './MyEvent';
import DocumentSelectionPage from './DocumentSelectionPage';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import { useLocation } from 'react-router-dom';
import DraftingActionCell from './DraftingActionCell';
import { useDispatch, useSelector } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';

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
  if (status === 'Yet to Start')
    return <Chip label="Yet to Start" sx={{ bgcolor: '#FFF1F0', color: '#FF4D4F', fontWeight: 500 }} />;
  if (status === 'Draft')
    return <Chip label="Draft" sx={{ bgcolor: '#FFF7E3', color: '#FAAD14', fontWeight: 500, width:90}} />;
  return <Chip label={status} />;
};
 
export default function Drafting({ id, tab = 'document', contextId }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tableRows, setTableRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const myEventsRef = React.useRef(null);
  const [stats, setStats] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const [favourites, setFavourites] = useState([]);
  const [favouritesLoading, setFavouritesLoading] = useState(true);
  const [recentDocuments, setRecentDocuments] = useState([]);
  const [recentDocumentsLoading, setRecentDocumentsLoading] = useState(true);
  const [recentEvents, setRecentEvents] = useState([]);
  const [recentEventsLoading, setRecentEventsLoading] = useState(true);
  const [showDocumentSelection, setShowDocumentSelection] = useState(false);
  const user = useSelector((state) => state.accountReducer.user);
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(''); // No card selected by default
  // Add state for each filter
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCreator, setSelectedCreator] = useState('All');
  const [selectedDate, setSelectedDate] = useState(null);
 
  // Add state for dynamic filter options
  const [filterOptions, setFilterOptions] = useState({
    category_names: [],
    event_names: [],
    document_names: [],
    statuses: [],
    created_by: []
  });
  const [filterOptionsLoading, setFilterOptionsLoading] = useState(true);
 
  // Add a mapping for status labels and values at the top of the component
  const statusOptions = [
    { label: 'Yet to Start', value: 'yet_to_start' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in_progress' },
    { label: 'Draft', value: 'draft' },
    { label: 'All', value: 'All' },
  ];
 
  // Helper to build query string from selected filters
  const buildQueryString = () => {
    const params = [];
    if (selectedStatus && selectedStatus !== 'All') params.push(`status=${selectedStatus}`);
    if (selectedCategory && selectedCategory !== 'All') params.push(`category_name=${encodeURIComponent(selectedCategory)}`);
    if (selectedEvent && selectedEvent !== 'All') params.push(`event_name=${encodeURIComponent(selectedEvent)}`);
    if (selectedDocument && selectedDocument !== 'All') params.push(`document_name=${encodeURIComponent(selectedDocument)}`);
    if (selectedCreator && selectedCreator !== 'All') params.push(`created_by=${encodeURIComponent(selectedCreator)}`);
    if (selectedDate) params.push(`created_at=${encodeURIComponent(selectedDate.format ? selectedDate.format('YYYY-MM-DD') : selectedDate)}`);
    return params.length > 0 ? `?${params.join('&')}` : '';
  };
 
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    let url = `/documentdrafting/filtered-documents/${id}/` + buildQueryString();
    console.log('Fetching with filters:', {
      selectedCategory, selectedEvent, selectedDocument, selectedStatus, selectedCreator, selectedDate, url
    });
    Factory('get', url, {}, {})
      .then(response => {
        const resData = response?.res?.data || response?.res || response;
        const rows = (resData?.results || resData || []).map(item => ({
          name: item?.file_name || item?.document?.name || '-',
         
          category: item.category?.name || '-',
          event: item.event?.name || '-',
          status: item.status || '-',
          lastEdited: item.last_edited || item.created_date || '-',
          creator: item.creator || '-',
          id: item.id,
          file: item.file || null,
        }));
        setTableRows(rows);
      })
      .catch(() => setTableRows([]))
      .finally(() => setLoading(false));
  }, [id, selectedCategory, selectedEvent, selectedDocument, selectedStatus, selectedCreator, selectedDate]);
 
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
 
  useEffect(() => {
    if (!id) return;
    setFavouritesLoading(true);
    Factory('get', `/documentdrafting/favourites/by-draft/${id}/`, {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        setFavourites(data || []);
      })
      .catch(() => setFavourites([]))
      .finally(() => setFavouritesLoading(false));
  }, [id]);
 
  useEffect(() => {
    if (!id) return;
    setRecentDocumentsLoading(true);
    Factory('get', `/documentdrafting/context/${id}/recent-documents/`, {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        setRecentDocuments(data || []);
      })
      .catch(() => setRecentDocuments([]))
      .finally(() => setRecentDocumentsLoading(false));
  }, [id]);
 
  useEffect(() => {
    if (!id) return;
    setRecentEventsLoading(true);
    Factory('get', `/documentdrafting/context/${id}/recent-events/`, {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        setRecentEvents(data || []);
      })
      .catch(() => setRecentEvents([]))
      .finally(() => setRecentEventsLoading(false));
  }, [id]);
 
  useEffect(() => {
    setFilterOptionsLoading(true);
    Factory('get', '/documentdrafting/filter-dropdown-data/', {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        setFilterOptions({
          category_names: data.category_names || [],
          event_names: data.event_names || [],
          document_names: data.document_names || [],
          statuses: data.statuses || [],
          created_by: data.created_by || []
        });
      })
      .catch(() => setFilterOptions({
        category_names: [],
        event_names: [],
        document_names: [],
        statuses: [],
        created_by: []
      }))
      .finally(() => setFilterOptionsLoading(false));
  }, []);
 
  useEffect(() => {
    if (location.state?.showEvent) {
      // setShowEvent(true); // This state is removed
      // setEventInitialTab(location.state.eventInitialTab || 'document'); // This state is removed
    }
  }, [location.state]);
 
  // Always render Event component for both document and event tabs
  if ((tab === 'document' || tab === 'event') && contextId) {
    return <Event tab={tab} contextId={contextId} />;
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
 
  const handleDeleteDocument = async (row) => {
    if (!row?.id) return;
    try {
      const result = await Factory('delete', `/documentdrafting/context-wise-event-document/${row.id}/`);
      if (result.res && result.res.status_cd === 0) {
        dispatch(openSnackbar({
          open: true,
          message: 'Document deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        }));
        setTableRows((prev) => prev.filter((doc) => doc.id !== row.id));
      } else {
        dispatch(openSnackbar({
          open: true,
          message: result.message || 'Failed to delete document',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        }));
      }
    } catch (err) {
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to delete document',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    }
  };
 
  // Handler for clicking a favourite in Quick Access Panel
  const handleFavouriteProceed = async (favourite) => {
    if (!favourite?.document?.id && !favourite?.document) return;
    const documentId = favourite.document?.id || favourite.document;
    const payload = {
      context: favourite.draft, // Use 'draft' instead of 'context'
      document: documentId,
      status: 'yet_to_start',
      created_by: user?.user?.id
    };
    try {
      const result = await Factory('post', '/documentdrafting/context-wise-event-document-create/', payload);
      if (result.res && result.res.status_cd === 0 && result.res.id) {
        navigate(`/app/drafting/fill/${result.res.id}`);
        dispatch(openSnackbar({
          open: true,
          message: 'Drafting context created',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        }));
      } else {
        dispatch(openSnackbar({
          open: true,
          message: result.message || 'Failed to create document drafting context',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        }));
      }
    } catch (err) {
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to create document drafting context',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    }
  };
 
  // Card click handler
  const handleCardClick = (card) => {
    setSelectedCard(card);
    if (card === 'all') {
      setSelectedStatus('All');
    } else if (card === 'draft') {
      setSelectedStatus('draft');
    } else if (card === 'completed') {
      setSelectedStatus('completed');
    } else if (card === 'yet_to_start') {
      setSelectedStatus('yet_to_start');
    }
  };
 
  return (
    <Box sx={{ p: { xs: 2, md: 4 }, background: '#fff', borderRadius: 2, minHeight: '100vh', width: '100%' }}>
      {/* Title and Actions */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'stretch', md: 'center' }}
        justifyContent="space-between"
        mb={4}
        gap={2}
        width="100%"
      >
        <Typography
          variant="h5"
          fontWeight={600}
          sx={{ m: 0, mb: { xs: 2, md: 0 }, fontSize: { xs: 18, sm: 22 } }}
        >
          Document Drafting
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          width={{ xs: '100%', md: 'auto' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          sx={{ ml: { xs: 0, md: 'auto' } }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: '#F5F7FA',
              minWidth: { xs: 0, sm: 220, md: 200, lg: 250 },
              maxWidth: { xs: '100%', sm: 400, md: 200, lg: 250 },
            }}
          />
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 140 }}
            onClick={() => navigate(`/app/drafting/document/${id}`)}
          >
            Create New Document
          </Button>
          <Button
            variant="contained"
            startIcon={<EventIcon />}
            sx={{ width: { xs: '100%', md: 'auto' }, minWidth: 140 }}
            onClick={() => navigate(`/app/drafting/event/${id}`)}
          >
            Create New Event
          </Button>
          <Button
            variant="outlined"
            startIcon={<PersonIcon />}
            sx={{ bgcolor: '#F5F7FA', color: '#222', width: { xs: '100%', md: 'auto' }, minWidth: 120 }}
            onClick={scrollToMyEvents}
          >
            My Events
          </Button>
        </Stack>
      </Box>
 
      {/* Filters */}
      <Grid2 container spacing={2} mb={3}>
        {/* Category Filter */}
        <Grid2 size={{xs:12, sm:4,md:2}}>
          <TextField
            fullWidth
            select
            label="Category"
            size="small"
            sx={{ bgcolor: '#F5F7FA' }}
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            disabled={filterOptionsLoading}
          >
            <MenuItem value="All">All</MenuItem>
            {filterOptions.category_names.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid2>
        {/* Events Filter */}
        <Grid2 size={{xs:12, sm:4,md:2}}>
          <TextField
            fullWidth
            select
            label="Events"
            size="small"
            sx={{ bgcolor: '#F5F7FA' }}
            value={selectedEvent}
            onChange={e => setSelectedEvent(e.target.value)}
            disabled={filterOptionsLoading}
          >
            <MenuItem value="All">All</MenuItem>
            {filterOptions.event_names.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid2>
        {/* Documents Filter */}
        <Grid2 size={{xs:12, sm:4,md:2}}>
        <TextField
            fullWidth
            select
            label="Documents"
          size="small"
            sx={{ bgcolor: '#F5F7FA' }}
            value={selectedDocument}
            onChange={e => setSelectedDocument(e.target.value)}
            disabled={filterOptionsLoading}
          >
            <MenuItem value="All">All</MenuItem>
            {filterOptions.document_names.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid2>
        {/* Status Filter */}
        <Grid2 size={{xs:12, sm:4,md:2}}>
          <TextField
            fullWidth
            select
            label="Status"
            size="small"
            sx={{ bgcolor: '#F5F7FA' }}
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            disabled={filterOptionsLoading}
          >
            {statusOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
            ))}
          </TextField>
        </Grid2>
        {/* Creator Filter */}
        <Grid2 size={{xs:12, sm:4,md:2}}>
          <TextField
            fullWidth
            select
            label="Creator"
            size="small"
            sx={{ bgcolor: '#F5F7FA' }}
            value={selectedCreator}
            onChange={e => setSelectedCreator(e.target.value)}
            disabled={filterOptionsLoading}
          >
            <MenuItem value="All">All</MenuItem>
            {filterOptions.created_by.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </Grid2>
        {/* Date Filter (keep as DatePicker) */}
        <Grid2 size={{xs:12, sm:4,md:2}}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={newValue => setSelectedDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  sx: { bgcolor: '#F5F7FA' },
                  InputLabelProps: { shrink: true },
                }
              }}
            />
          </LocalizationProvider>
        </Grid2>
      </Grid2>
 
      {/* Stats Cards */}
      {statsLoading ? (
        <CircularProgressComponent isLoading displayContent={'Loading Stats...'} />
      ) : (
      <Grid2 container spacing={3} mb={4}>
          {stats.length === 0 ? (
            <Grid2 size={{ xs: 12 }}><Typography align="center">No stats found</Typography></Grid2>
        ) : (
          stats.map((stat) => {
              let cardKey = 'all';
              if (stat.label.toLowerCase().includes('draft')) cardKey = 'draft';
              else if (stat.label.toLowerCase().includes('finalized')) cardKey = 'completed';
              else if (stat.label.toLowerCase().includes('action pending')) cardKey = 'yet_to_start';
              const isSelected = selectedCard === cardKey;
            const style = statStyles[stat.label] || {};
              const cardBgGradient = `linear-gradient(135deg, ${style.iconBg || '#E3EAFE'} 0%, #fff 100%)`;
              const borderColor = isSelected ? style.iconColor : '#E5EAF2';
            return (
                <Grid2 size={{ xs: 12, md: 3, sm: 3 }} key={stat.label}>
                <Paper
                    elevation={isSelected ? 3 : 0}
                    sx={{
                      borderRadius: 3,
                      minHeight: 180,
                      border: `1.5px solid ${borderColor}`,
                      boxShadow: isSelected ? '0 4px 16px 0 rgba(2, 50, 158, 0.12)' : '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
                      transition: 'box-shadow 0.2s, border-color 0.2s',
                      p: 3,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: cardBgGradient,
                      '&:hover': {
                        boxShadow: '0 4px 16px 0 rgba(64, 66, 74, 0.18)',
                        borderColor: style.iconColor,
                        background: cardBgGradient,
                      },
                    }}
                    onClick={() => handleCardClick(cardKey)}
                  >
                    {/* Row 1: Icon and Heading */}
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                      <Avatar variant="circular" sx={{ width: 44, height: 44, bgcolor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {React.cloneElement(statIcons[stat.label] || <DescriptionOutlinedIcon />, {
                      style: { color: style.iconColor, fontSize: 28 }
                    })}
                      </Avatar>
                      <Typography variant="h6" fontWeight={800} fontSize={15} sx={{ color: '#0A1F44', mb: 0 }}>
                    {stat.label === "Total Document" ? "Total Documents" : stat.label}
                  </Typography>
                    </Box>
                    {/* Row 2: Description/Paragraph */}
                    <Box sx={{ width: '105%' }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {stat.label === 'Draft' && 'Manage draft documents and workflows'}
                        {stat.label === 'Finalized' && 'Manage finalized documents and workflows'}
                        {stat.label === 'Action Pending' && 'Manage pending documents and workflows'}
                        {stat.label === 'Total Document' && 'Manage all documents and workflows'}
                      </Typography>
                    </Box>
                    {/* Row 3: Count and View Button */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={0}>
                      <Typography variant="h4" fontWeight={700} sx={{ color: '#0A1F44', mb: 0 }}>
                    {String(stat.value).padStart(2, '0')}
                  </Typography>
                  <Button
                    className="stat-view-btn"
                    variant="contained"
                    disableElevation
                    sx={{
                          background: isSelected ? style.iconColor : '#F0F0F0',
                          color: isSelected ? '#fff' : '#595959',
                      fontWeight: 500,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: 'none',
                          minWidth: 48,
                          height: 32,
                          fontSize: 14,
                          px: 2,
                          py: 0.5,
                          transition: 'background 0.2s, color 0.2s',
                          '&:hover': {
                            background: style.iconColor,
                            color: '#fff',
                          }
                        }}
                        onClick={e => { e.stopPropagation(); handleCardClick(cardKey); }}
                  >
                    View
                  </Button>
                    </Box>
                </Paper>
              </Grid2>
            );
          })
        )}
      </Grid2>
      )}
 
      {/* Table */}
      {loading ? (
        <CircularProgressComponent isLoading={loading} displayContent={'Loading Documents...'} />
      ) : (
      <Paper elevation={1} sx={{ borderRadius: 3, overflowX: 'auto', width: '100%' }}>
        <Table sx={{ minWidth: 600 }}>
          
          <TableHead sx={{
                    backgroundColor: 'primary.main',
                    '& .MuiTableCell-root': {
                      color: '#ffffff !important'
                    }
                  }}>
            <TableRow >
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
              {tableRows.length === 0 ? (
              <TableRow>
                {/* <TableCell colSpan={7} align="center">No data found</TableCell> */}
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                  <EmptyDataPlaceholder
                    title="No Data Found"
                    subtitle="There is no content to display."
                  />
                </TableCell>
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
                      <DraftingActionCell
                        row={row}
                        status={row.status}
                        onEdit={() => navigate(`/app/drafting/fill/${row.id}`)}
                        onDownload={async () => {
                          try {
                            // 1. Fetch draft details to get file_url
                            const fileUrl = row.file;
                            if (!fileUrl) {
                              dispatch(openSnackbar({
                                open: true,
                                message: 'No file available for download. Please finalize the document first.',
                                variant: 'alert',
                                alert: { color: 'error' },
                                close: false
                              }));
                              return;
                            }
                            // 2. Get presigned URL
                            const presigned = await Factory('get', `/docwallet/generate_presigned_url?url=${encodeURIComponent(fileUrl)}`);
                            const presignedUrl = presigned?.res?.data?.presigned_url || presigned?.res?.data?.url;
                            if (presigned?.res && presigned?.res?.status_cd === 0 && presignedUrl) {
                              window.open(presignedUrl, '_blank');
                              dispatch(openSnackbar({
                                open: true,
                                message: 'Download started',
                                variant: 'alert',
                                alert: { color: 'success' },
                                close: false
                              }));
                            } else {
                              dispatch(openSnackbar({
                                open: true,
                                message: presigned?.res?.message || 'Failed to get presigned URL',
                                variant: 'alert',
                                alert: { color: 'error' },
                                close: false
                              }));
                            }
                          } catch (err) {
                            dispatch(openSnackbar({
                              open: true,
                              message: 'Failed to download file',
                              variant: 'alert',
                              alert: { color: 'error' },
                              close: false
                            }));
                          }
                        }}
                        onDelete={handleDeleteDocument}
                        deleteDialogData={{
                          title: 'Delete file',
                          heading: 'Are you sure you want to delete this file?',
                          description: 'This action will permanently remove this file from the list.'
                        }}
                      />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
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
      {/* Quick Access Panel */}
      <Box
        mt={5}
        mb={5}
        sx={{
          borderBottom: '2px solid rgb(196, 191, 191)',
          borderLeft: '0.1px solid #b0b8c4',
          borderTop: '0.1px solid #b0b8c4',
          borderRight: '0.1px solid #b0b8c4',
          borderRadius: 3,
          pb: 4,
          background: '#fff',
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <Typography
          variant="h3"
          fontWeight={700}
          mb={3}
          sx={{
            color: '#0A1F44',
            background: '#F5F6F8',
            padding: '16px 24px',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
            width: '100%',
            fontSize: { xs: 18, sm: 18 },
          }}
        >
          Quick Access Panel
        </Typography>
        {(favouritesLoading || recentDocumentsLoading || recentEventsLoading) ? (
          <CircularProgressComponent isLoading displayContent={'Loading Quick Access Panel...'} />
        ) : (
          (favourites.length === 0 && recentDocuments.length === 0 && recentEvents.length === 0) ? (
            <EmptyDataPlaceholder
              title="No Quick Access Data"
              subtitle="There are no favourites, recently used documents, or recent events to display."
            />
          ) : (
            <Box px={{ xs: 2, sm: 0, md: 0 }} py={2}>
              <Grid2 container spacing={4} marginLeft={{ xs: 0, md: 4 }}>
                {/* Favourites */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography fontWeight={500} sx={{ color: '#0A1F44', mb: 1, fontSize: 17 }}>Favourites</Typography>
                  <Stack spacing={0}>
                    {favouritesLoading ? (
                      <Typography>Loading favourites...</Typography>
                    ) : favourites.length === 0 ? (
                      <Typography>No favourites found</Typography>
                    ) : (
                      favourites.map((favourite) => (
                        <Box
                          key={favourite.id}
                          display="flex"
                          alignItems="center"
                          gap={1}
                          sx={{
                            cursor: 'pointer',
                            minWidth: 0,
                            px: 0,
                            height: 45,
                            py: 0.5,
                            borderRadius: 2,
                            '&:hover': { background: '#f5f5f5', width: 300, height: 45, }
                          }}
                          onClick={() => handleFavouriteProceed(favourite)}
                        >
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <DescriptionOutlinedIcon sx={{ color: '#A3AED0', fontSize: 28, bgcolor: '#F5F7FA', borderRadius: 2, p: 0.5 }} />
                            <FavoriteBorderIcon
                              sx={{
                                color: '#3B82F6',
                                fontSize: 14,
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                bgcolor: '#fff',
                                borderRadius: '50%',
                              }}
                            />
                          </Box>
                          <Typography sx={{ color: '#222', wordBreak: 'break-word' }}>{favourite.document?.name || favourite.name || favourite.title || favourite.document_name || 'Unnamed Document'}</Typography>
                        </Box>
                      ))
                    )}
                  </Stack>
                </Grid2>
                {/* Recently Used */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography fontWeight={500} sx={{ color: '#0A1F44', mb: 2, fontSize: 17 }}>Recently Used</Typography>
                  <Stack spacing={2}>
                    {recentDocumentsLoading ? (
                      <Typography>Loading recent documents...</Typography>
                    ) : recentDocuments.length === 0 ? (
                      <Typography>No recent documents found</Typography>
                    ) : (
                      recentDocuments.map((document) => (
                        <Box key={document.id} display="flex" alignItems="center" gap={1}>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <DescriptionOutlinedIcon sx={{ color: '#A3AED0', fontSize: 28, bgcolor: '#F5F7FA', borderRadius: 2, p: 0.5 }} />
                            <HistoryOutlinedIcon
                              sx={{
                                color: '#F59E42',
                                fontSize: 14,
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                bgcolor: '#fff',
                                borderRadius: '50%',
                              }}
                            />
                          </Box>
                          <Typography sx={{ color: '#222' }}>{document.document?.name || document.name || document.title || document.document_name || 'Unnamed Document'}</Typography>
                        </Box>
                      ))
                    )}
                  </Stack>
                </Grid2>
                {/* Recent Events */}
                <Grid2 size={{ xs: 12, md: 4 }}>
                  <Typography fontWeight={500} sx={{ color: '#0A1F44', mb: 2, fontSize: 17 }}>Recent Events</Typography>
                  <Stack spacing={2}>
                    {recentEventsLoading ? (
                      <Typography>Loading recent events...</Typography>
                    ) : recentEvents.length === 0 ? (
                      <Typography>No recent events found</Typography>
                    ) : (
                      recentEvents.map((event) => (
                        <Box key={event.id} display="flex" alignItems="center" gap={1}>
                          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                            <DescriptionOutlinedIcon sx={{ color: '#A3AED0', fontSize: 28, bgcolor: '#F5F7FA', borderRadius: 2, p: 0.5 }} />
                          </Box>
                          <Typography sx={{ color: '#222' }}>{event.event?.name || event.name || event.title || event.event_name || 'Unnamed Event'}</Typography>
                        </Box>
                      ))
                    )}
                  </Stack>
                </Grid2>
              </Grid2>
            </Box>
          )
        )}
      </Box>
      {/* MyEvents section at the bottom of the page */}
      <Box mt={6} ref={myEventsRef}>
        <MyEvents id={id} />
      </Box>
      
    </Box>
   
  );
  
}
