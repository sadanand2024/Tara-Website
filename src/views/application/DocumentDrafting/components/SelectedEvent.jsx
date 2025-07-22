import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Box,
  Button,
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
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';


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

// Add statusChip function for consistent status styling
const statusChip = (status) => {
  if (status === 'completed')
    return <Chip label="Completed" sx={{ bgcolor: '#C8E6C9', color: '#388E3C', fontWeight: 500 }} />;
  if (status === 'yet_to_start')
    return <Chip label="Yet to Start" sx={{ bgcolor: '#FFF1F0', color: '#FF4D4F', fontWeight: 500 }} />;
  if (status === 'draft')
    return <Chip label="Draft" sx={{ bgcolor: '#FFF7E3', color: '#FAAD14', fontWeight: 500, width: 90 }} />;
  if (status === 'in_progress')
    return <Chip label="In progress" sx={{ bgcolor: '#FFF9C4', color: '#FBC02D', fontWeight: 500 }} />;
  return <Chip label={status} />;
};

// Helper to format date as dd/mm/yyyy
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper to get progress color based on percent (match the image)
function getProgressColor(percent) {
  if (percent === 0) return '#E0E0E0';      // Gray
  if (percent <= 25) return '#FFC400';      // Yellow
  if (percent <= 50) return '#B388FF';      // Purple
  if (percent <= 75) return '#2979FF';      // Blue
  if (percent < 100) return '#FF9100';     // Orange (for 76-99%)
  return '#43A047';                         // Green for 100%
}

const SelectedEvent = ({ onBack }) => {
  const { eventInstanceId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

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
  if (!eventData) return (
    <Box p={4}>
      <EmptyDataPlaceholder title="No Data Found" subtitle="There is no content to display." />
    </Box>
  );

  // Extract and map data as needed
  const eventInstance = eventData.event_instance || {};
  const eventName = eventInstance.event_name?.event_name || 'N/A';
  const createdOn = eventInstance.created_at
    ? formatDate(eventInstance.created_at)
    : (eventData.created_at ? formatDate(eventData.created_at) : 'N/A');
  const status = eventInstance.status || eventData.status || 'N/A';
  const documents = eventData.documents || [];
  const progressTotal = documents.length;
  const progressCompleted = documents.filter(doc => (doc.status === 'completed')).length;
  const progressPercent = progressTotal > 0 ? (progressCompleted / progressTotal) * 100 : 0;

  const handleDownloadFile = async (fileUrl) => {
    try {
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
  };

  return (
    <Box
      sx={{ p: { xs: 2, md: 4 }, background: 'white', borderRadius: 2, minHeight: '100vh', width: '100%' }}

    >
      {/* Breadcrumb */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5" fontWeight={600} sx={{ m: 0, fontSize: { xs: 15, sm: 22 } }}>
          Document Drafting
        </Typography>
        {/* <Typography variant="body2" color="#757575">
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
        </Typography> */}
        <Button
          variant="outlined"
          onClick={() => { window.location.href = '/app/drafting'; }}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '0.875rem', md: 'none' }, // smaller font on xs
            px: { xs: 1, sm: 2 },  // smaller horizontal padding on xs
            py: { xs: 0.5, sm: 1 } // optional: smaller vertical padding
          }}
        >
          Back to Dashboard
        </Button>
      </Box>

      {/* Main Card with summary and table */}
      <Paper
        elevation={2} sx={{
          p: { xs: 2, md: 4 },
          borderRadius: 3,
          width: '100%',
          maxWidth: 1400,
          mx: 'auto',
          mt: 2,
          minHeight: { xs: 800, md: 700 },
          position: 'relative',
        }}
      >

        {/*elevation={3}
          sx={{
            borderRadius: 3,
            border: '1.5px solid #E3EAFE',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            p: { xs: 2, md: 4 },
            maxWidth: '100%',
            width: '100%',
            mx: 'auto',
            mt: 0,
            minHeight: { xs: 400, md: 700 },
            position: 'relative',
            background: '#fff',
            overflowX: 'auto',
            ml: { xs: 0, md: 0 },
            // borderBottom: '2px solid rgb(196, 191, 191)',
            // borderLeft: '0.1px solid #b0b8c4',
            // borderTop: '0.1px solid #b0b8c4',
            // borderRight: '0.1px solid #b0b8c4',
          }} */}


        {/* Summary Section - Flex Row */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'center',
            alignItems: 'center',
            gap: { xs: 2, sm: 0 },
            px: { xs: 0.5, sm: 2 },
            maxWidth: '180%',
            mx: 'auto',
            pb: 2,
            borderBottom: '1.5px solid #E3EAFE',
            mt: { xs: 0, md: -2 },
            ml: { xs: 0, md: -3 },
            width: '104%',
          }}
        >
          {/* Responsive summary: 2 rows on mobile, 1 row on desktop */}
          {/** xs: 2 rows, sm+: 1 row **/}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'row', width: '100%', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 120, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 16, sm: 18 }, mb: 0.5, textAlign: 'center' }}>Event Name</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, sm: 16 }, textAlign: 'center', ml: 0 }}>{eventName}</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 120, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 16, sm: 18 }, mb: 0.5, textAlign: 'center' }}>Created On</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, sm: 16 }, textAlign: 'center' }}>{createdOn}</Typography>
            </Box>
          </Box>
          {/* Mobile Progress: stack circle and text vertically */}
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexDirection: 'row', width: '100%', gap: 2, mt: 1 }}>
            <Box sx={{ flex: 1, minWidth: 120, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 15, sm: 16 }, mb: 0.5, textAlign: 'center' }}>Status</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', ml: 1 }}>{statusChip(status)}</Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 16, sm: 18 }, mb: 0.5, textAlign: 'center' }}>Progress</Typography>
              <Box display="flex" flexDirection="row" alignItems="center" gap={1} justifyContent="row">
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 1 }}>
                  {progressPercent === 0 ? (
                    <>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={30}
                        thickness={5}
                        sx={{ color: '#E0E0E0' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, fontSize: 10, color: '#000' }}>
                          0%
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <CircularProgress
                        variant="determinate"
                        value={progressPercent}
                        size={30}
                        thickness={5}
                        sx={{ color: getProgressColor(Math.round(progressPercent)) }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, fontSize: 8, color: '#000' }}>
                          {Math.round(progressPercent)}%
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: { xs: 12, sm: 10, md: 10 }, textAlign: 'center', mt: 0 }}>{progressCompleted}/{progressTotal} Docs Completed</Typography>
              </Box>
            </Box>
          </Box>
          {/* Desktop/tablet: all in one row */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexDirection: 'row', width: '100%' }}>
            <Box sx={{ flex: 1, minWidth: 120, mb: { xs: 1, sm: 0 }, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 16, sm: 18 }, mb: 2, ml: -6, textAlign: 'center' }}>Event Name</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, sm: 16 }, textAlign: 'center', ml: -3 }}>{eventName}</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 120, mb: { xs: 1, sm: 0 }, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 16, sm: 18 }, mb: 2, textAlign: 'center' }}>Created On</Typography>
              <Typography sx={{ fontWeight: 500, fontSize: { xs: 14, sm: 16 }, textAlign: 'center' }}>{createdOn}</Typography>
            </Box>
            <Box sx={{ flex: 1, minWidth: 120, mb: { xs: 1, sm: 0 }, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 15, sm: 16 }, mb: 2, textAlign: 'center' }}>Status</Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', ml: 1 }}>{statusChip(status)}</Box>
            </Box>
            <Box sx={{ flex: 1, minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, mb: { xs: 1, sm: 0 }, textAlign: 'center', mx: 'auto' }}>
              <Typography sx={{ color: '#1138e7', fontWeight: 500, fontSize: { xs: 16, sm: 18 }, mb: 0.5, textAlign: 'center' }}>Progress</Typography>
              <Box display="flex" alignItems="center" gap={1} justifyContent="center">
                <Box sx={{ position: 'relative', display: 'inline-flex', mr: 1, ml: 0 }}>
                  {progressPercent === 0 ? (
                    <>
                      <CircularProgress
                        variant="determinate"
                        value={100}
                        size={35}
                        thickness={5}
                        sx={{ color: '#E0E0E0' }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, fontSize: 10, color: '#000' }}>
                          0%
                        </Typography>
                      </Box>
                    </>
                  ) : (
                    <>
                      <CircularProgress
                        variant="determinate"
                        value={progressPercent}
                        size={35}
                        thickness={5}
                        sx={{ color: getProgressColor(Math.round(progressPercent)) }}
                      />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '100%',
                          height: '100%',
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, fontSize: 9, color: '#000' }}>
                          {Math.round(progressPercent)}%
                        </Typography>
                      </Box>
                    </>
                  )}
                </Box>
                <Typography sx={{ fontWeight: 500, fontSize: { xs: 10, sm: 14 }, textAlign: 'center' }}>{progressCompleted}/{progressTotal} Docs Completed</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        {/* Document Table Section (unchanged) */}
        <Box >
          <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2, overflowX: 'auto' }}>
            <Table sx={{ width: '100%', minWidth: 900, textAlign: 'center' }}>
              <TableHead sx={{
                backgroundColor: 'primary.main',
                '& .MuiTableCell-root': {
                  color: '#ffffff !important'
                }
              }}>
                <TableRow >
                  <TableCell align="left" sx={{ fontWeight: 700, color: '#1138e7', fontSize: 18, borderTopLeftRadius: 12, px: 6, minWidth: 160, whiteSpace: 'nowrap' }}>Document Name</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#1138e7', fontSize: 18, px: 4, minWidth: 140, whiteSpace: 'nowrap' }}>Template</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#1138e7', fontSize: 18, px: 4, minWidth: 120, whiteSpace: 'nowrap' }}>Status</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#1138e7', fontSize: 18, px: 4, minWidth: 140, whiteSpace: 'nowrap' }}>Last Edited</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 700, color: '#1138e7', fontSize: 18, borderTopRightRadius: 12, px: 4, minWidth: 160, whiteSpace: 'nowrap' }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell align="left" sx={{ fontWeight: 500, textAlign: 'left', pl: 6, minWidth: 160, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {doc.document?.name || '-'}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 8, pl: 8, minWidth: 140, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <Chip
                        label={'Template'}
                        sx={{
                          bgcolor: '#0039A6',
                          color: '#fff',
                          fontWeight: 500,
                          fontSize: 13,
                          borderRadius: '999px',
                          px: 3,
                          pl: 0,
                          height: 32,
                          boxShadow: 'none',
                          letterSpacing: 0.5,
                          cursor: 'pointer',
                          '& .MuiChip-label': {
                            paddingLeft: 4,
                          },
                        }}
                        onClick={() => navigate(`/app/drafting/fill/${doc.id}`)}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ px: 5, minWidth: 120, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <Box display="flex" alignItems="center" justifyContent="center" sx={{ ml: 2 }}>
                        {statusChip(doc.status)}
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500, px: 5, minWidth: 140, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {doc.updated_at ? formatDate(doc.updated_at) : ''}
                    </TableCell>
                    <TableCell align="center" sx={{ px: 5, minWidth: 160, verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {doc.status === 'yet_to_start' && (
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<EditIcon />}
                          sx={{
                            bgcolor: '#0062FF',
                            color: '#fff',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: 13,
                            boxShadow: 0,
                            ml: -2,
                            px: 2,
                            minWidth: 140,
                            '&:hover': {
                              color: '#fff',
                            }
                          }}
                          onClick={() => navigate(`/app/drafting/fill/${doc.id}`)}
                        >
                          Start Drafting
                        </Button>
                      )}
                      {doc.status === 'draft' && (
                        <Button
                          variant="contained"
                          size="small"
                          endIcon={<EditIcon sx={{ color: '#FFC400' }} />}
                          sx={{
                            bgcolor: '#FFF9C4',
                            color: '#FFC400',
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: 15,
                            boxShadow: 0,
                            px: 2,
                            minWidth: 120,
                            '&:hover': {
                              color: '#FFC400',
                            }
                          }}
                          onClick={() => navigate(`/app/drafting/fill/${doc.id}`)}
                        >
                          Continue
                        </Button>
                      )}
                      {doc.status === 'completed' && (
                        <Box display="flex" justifyContent="center">
                          <IconButton sx={{ color: '#0062FF', ml: 1 }} onClick={() => handleDownloadFile(doc.file)}>
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton sx={{ color: '#0062FF' }} onClick={() => handleDownloadFile(doc.file)}>
                            <DownloadIcon />
                          </IconButton>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
    </Box>
  );
};

export default SelectedEvent;