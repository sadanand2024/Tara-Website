import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Card, CardContent, MenuItem, Select, Stack, Typography, Paper, TextField, InputAdornment } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import SelectedEvent from './SelectedEvent';
import DocumentSelectionPage from './DocumentSelectionPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
 

const documents = [
  {
    title: 'Address proof of employee',
    description: 'An Address Proof of Employee document, often a letter from your employer, verifies your current residential address',
  },
  {
    title: 'Address proof of employee',
    description: 'An Address Proof of Employee document, often a letter from your employer, verifies your current residential address',
  },
  {
    title: 'Address proof of employee',
    description: 'An Address Proof of Employee document, often a letter from your employer, verifies your current residential address',
  },
];

const tabButtonStyle = (active) => ({
  minWidth: 180,
  fontWeight: 600,
  bgcolor: active ? '#1976d2' : '#fff',
  color: active ? '#fff' : '#1976d2',
  border: '2px solid #1976d2',
  boxShadow: active ? '0 2px 8px 0 rgba(25, 118, 210, 0.08)' : 'none',
  '&:hover': {
    bgcolor: active ? '#1565c0' : '#f5faff',
    color: active ? '#fff' : '#1976d2',
  },
});

const Event = ({ tab = 'document', contextId }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.accountReducer.user);
  const [category, setCategory] = useState('');
  const [event, setEvent] = useState('');
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [eventOptions, setEventOptions] = useState([]);
  const [filtersLoading, setFiltersLoading] = useState(true);
  const [selected, setSelected] = useState([]); // array of selected document IDs
  // Remove local activeTab state
  const [documents, setDocuments] = useState([]);
  const [showSelectedEvent, setShowSelectedEvent] = useState(false);
  const [selectedEventInstanceId, setSelectedEventInstanceId] = useState(null);
  const [search, setSearch] = useState('');

  // useEffect(() => {
  //   setActiveTab(initialTab);
  // }, [initialTab]);

  useEffect(() => {
    setFiltersLoading(true);
    Promise.all([
      Factory('get', '/documentdrafting/categories/', {}, {}),
      Factory('get', '/documentdrafting/events/', {}, {})

    ])
      .then(([catRes, eventRes]) => {
        console.log(eventRes?.res?.data)
        const catData = catRes?.res?.data || catRes?.res || catRes;
        const eventData = eventRes?.res?.data || eventRes?.res || eventRes;
        setCategoryOptions(catData || []);
        setEventOptions(eventData ||[]); // No events until category is selected
        setCategory('');     // Always show "Select Category" by default
        setEvent('');        // Always show "Select Event" by default
      })
      
      .finally(() => setFiltersLoading(false));
  }, []);

  // When documents are loaded, select all by default
  useEffect(() => {
    if (documents && documents.length > 0) {
      setSelected(documents.map(doc => doc.id));
    }
  }, [documents]);

  const handleCategoryChange = (catId) => {
    setCategory(catId);
    const selectedCat = categoryOptions.find(cat => cat.id === catId);
    setEventOptions(selectedCat?.events || []);
    setEvent(''); // Reset event selection when category changes
  };

  // const handleEventChange = (eventId) => {
  //   setEvent(eventId);
  //   if (!category || !eventId) {
  //     setDocuments([]);
  //     return;
  //   }
  //   console.log('Sending payload:', { category_id: category, event_id: eventId });
  //   Factory(
  //     'get',
  //     '/documentdrafting/category-or-events-wise-document-list/',
  //     { category_id: category, event_id: eventId },
  //     {}
  //   ).then(response => {
  //     const docs = response?.res?.data || response?.res || response;
  //     setDocuments(docs || []);
  //   });
  // };
  const handleEventChange = (eventId) => {
    setEvent(eventId);

    if (!eventId) {
      setDocuments([]);
      return;
    }

    // Build query string dynamically
    // let queryString = ?event_id=${eventId};
    // if (category) {
    //   queryString += &category_id=${category};
    // }
//     let queryString = ?event_id=${eventId};
// if (category) {
//   queryString += &category_id=${category};
// }
let queryString = `?event_id=${eventId}`;
if (category) {
  queryString += `&category_id=${category}`;
}


    // Build payload dynamically
    const payload = { event_id: eventId };
    if (category) {
      payload.category_id = category;
    }

    Factory(
      'get', `/documentdrafting/category-or-events-wise-document-list/${queryString}`,

      payload,
      {}
    ).then(response => {
      const docs = response?.res?.data || response?.res || response;
      setDocuments(docs || []);
      setSelected([]); // Reset selection after new documents are loaded
    });
    console.log("wertyui",user.user.id)
  };
  

  const handleCardClick = (docId) => {
    setSelected((prev) =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleProceed = async (eventId, documentIds, userId, contextId) => {
    const payload = {
      event: eventId,
      context: contextId,
      documents: documentIds, // send all selected document IDs
      status: 'yet_to_start',
      created_by: userId
    };
    const response = await Factory(
      'post',
      '/documentdrafting/create-events/',
      payload
    );
    if (response.res?.status_cd === 0 && response.res?.event_instance_id) {
      setSelectedEventInstanceId(response.res.event_instance_id);
    } else {
      // handle error
    }
  };

  const handleBackToDashboard = () => {
    setSelectedEventInstanceId(null);
  };

  if (selectedEventInstanceId) {
    // return <SelectedEvent eventInstanceId={selectedEventInstanceId} onBack={handleBackToDashboard} />;
     window.location.href = `/app/selected-event/${selectedEventInstanceId}`;
 
  }

  // Tab click handlers
  const handleTabClick = (newTab) => {
    navigate(`/app/drafting/${newTab}/${contextId || ''}`);
  };

  return (
    <Box sx={{ p: { xs: 1, md: 4 }, background: 'white',borderRadius:2, minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{ m: 0, fontSize: { xs: 18, sm: 22 } }}>
          Document Drafting
        </Typography>
        <Button
          variant="outlined"
          onClick={() => { window.location.href = '/app/drafting'; }}
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600, px: 2 }}
          startIcon={<ArrowBackIcon />}
        >
          Back to Dashboard
        </Button>
      </Box>
      <Paper elevation={2} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, maxWidth: 1400, mx: 'auto', mt: 4, minHeight: { xs: 400, md: 700 }, position: 'relative' }}>
        {/* Tabs always centered, search bar right, responsive */}
        <Box
          sx={{
            position: 'relative',
            mb: 4,
            minHeight: 56,
            display: { xs: 'block', md: 'block' },
          }}
        >
          {/* Centered tabs: absolute center on md+, block on xs */}
          <Box
            sx={{
              position: { xs: 'static', md: 'absolute' },
              left: { md: '50%' },
              top: { md: '50%' },
              transform: { md: 'translate(-50%, -50%)' },
              width: { xs: '100%', md: 'auto' },
              display: 'flex',
              justifyContent: 'center',
              mb: { xs: 2, md: 0 },
              zIndex: 2,
            }}
          >
            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
              <Button
                sx={tabButtonStyle(tab === 'document')}
                onClick={() => handleTabClick('document')}
              >
                Document Selection
              </Button>
              <Button
                sx={tabButtonStyle(tab === 'event')}
                onClick={() => handleTabClick('event')}
              >
                Create an Event
              </Button>
            </Stack>
          </Box>
          {/* Search bar: right on md+, full width below on xs */}
          {tab === 'document' && (
            <Box
              sx={{
                position: { xs: 'static', md: 'absolute' },
                right: { md: 0 },
                top: { md: '50%' },
                transform: { md: 'translateY(-50%)' },
                width: { xs: '100%', sm: 285, md: 299 },
                maxWidth: 335,
                mt: { xs: 2, md: 0 },
                mx: { xs: 'auto', md: 0 },
                zIndex: 1,
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ bgcolor: '#F5F7FA' }}
              />
            </Box>
          )}
        </Box>
        {/* Tab Content */}
        {tab === 'document' ? (
          <Box>
            <DocumentSelectionPage contextId={contextId} search={search} />
          </Box>
        ) : (
          <>
            {/* Filters */}
            <Stack direction="row" spacing={4} mt={6} justifyContent="left">
              {/* Category Filter */}
              <Select
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 180,
                  bgcolor: '#f5f8ff',
                  border: '2px solid #1976d2',
                  borderRadius: 2,
                  fontWeight: 500,
                  color: '#222',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
                disabled={filtersLoading}
              >
                <MenuItem value="">Select Category</MenuItem>
                {filtersLoading ? (
                  <MenuItem value="">Loading...</MenuItem>
                ) : (
                  categoryOptions.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>{cat.category_name}</MenuItem>
                  ))
                )}
              </Select>
              {/* Event Filter (always shown, disabled until category is selected) */}
              <Select
                value={event}
                onChange={e => handleEventChange(e.target.value)}
                displayEmpty
                sx={{
                  minWidth: 180,
                  bgcolor: '#f5f8ff',
                  border: '2px solid #1976d2',
                  borderRadius: 2,
                  fontWeight: 500,
                  color: '#222',
                  '& .MuiOutlinedInput-notchedOutline': { border: 'none' },
                }}
                disabled={filtersLoading}
              >
                <MenuItem value="">Select Event</MenuItem>
                {eventOptions.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>{ev.event_name}</MenuItem>
                ))}
              </Select>
            </Stack>

            {/* Note about default selection */}
            {/* <Typography variant="body2" sx={{ color: '#1976d2', mb: 2, fontStyle: 'italic' }}>
            Note: By default, all templates are selected. If you do not want a template, please uncheck it.
          </Typography> */}

            {/* Document Cards */}
            <Grid2 container spacing={4} justifyContent="center" mt={6}>
              {(documents.length > 0 ? documents : documents).map((doc, idx) => (
                <Grid2 item xs={12} sm={6} md={4} key={idx} display="flex" justifyContent="center">
                  <Card
                    variant="outlined"
                    onClick={() => handleCardClick(doc.id)}
                    sx={{
                      borderRadius: 3,
                      borderColor: '#1976d2',
                      borderWidth: 2,
                      borderStyle: 'solid',
                      minWidth: 210,
                      minHeight: 160,
                      cursor: 'pointer',
                      position: 'relative',
                      // boxShadow: selected.includes(idx) ? '0 0 0 2px #1976d2' : undefined,
                      transition: 'box-shadow 0.2s',
                      '&:hover': {
                        // boxShadow: '0 0 0 3px #1976d2',
                      },
                    }}
                  >
                    {selected.includes(doc.id) && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: '#1976d2',
                          borderRadius: '50%',
                          width: 28,
                          height: 28,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          zIndex: 2,
                        }}
                      >
                        <CheckCircleIcon sx={{ color: '#fff', fontSize: 22 }} />
                      </Box>
                    )}
                    <CardContent>
                      <Typography fontWeight={600} mb={1}>
                        {doc.title || doc.document_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doc.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid2>
              ))}
            </Grid2>

            {/* Footer */}
            <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
              <Button
                variant="contained"
                disabled={selected.length === 0}
                onClick={() => handleProceed(event, selected, user.user.id, contextId)}
              >
                Proceed
              </Button>
              
            </Box>
            <Typography variant="body2" sx={{ color: '#1976d2', mt: 2, fontStyle: 'italic' }}>
              Note: By default, all templates are selected. If you do not want a template, please uncheck it.
            </Typography>

          </>
        )}
      </Paper>
    </Box>
  );
};

export default Event;