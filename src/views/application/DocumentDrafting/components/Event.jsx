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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import MainCard from 'ui-component/cards/MainCard';


import { Translate } from '@mui/icons-material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import EventIcon from '@mui/icons-material/Event';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


// const documents = [
//   {
//     title: 'Address proof of employee',
//     description: 'An Address Proof of Employee document, often a letter from your employer, verifies your current residential address',
//   },
//   {
//     title: 'Address proof of employee',
//     description: 'An Address Proof of Employee document, often a letter from your employer, verifies your current residential address',
//   },
//   {
//     title: 'Address proof of employee',
//     description: 'An Address Proof of Employee document, often a letter from your employer, verifies your current residential address',
//   },
// ];

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

// TabPanel component (copied from LeaveAttendance.jsx)
const TabPanel = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
  </div>
);

TabPanel.propTypes = {
  children: PropTypes.node,
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired
};

// Reusable DocumentCard component
function DocumentCard({ title, description, isFavorite, isSelected, onFavorite, onClick, showNote, setShowFirstCardNote }) {
  return (
    <Paper
      sx={{
        border: '1.5px solid #b0b8c4',
        borderRadius: 3,
        pl: 2,
        pr: 2,
        pt: 2.5,
        minWidth: 260,
        maxWidth: 400,
        minHeight: 160,
        maxHeight: 180,
        mt:-2,

        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        position: 'relative',
        transition: 'border 0.2s, box-shadow 0.2s, transform 0.2s',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        '&:hover': {
          border: '1.5px solid #00329E',
          boxShadow: '0 6px 24px rgba(2, 78, 153, 0.15)',
          transform: 'scale(1.03)',
          zIndex: 2,
        },
      }}
      onClick={onClick}
    >
      {/* Content (heading + paragraph) */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', minHeight: 0 }}>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 14,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.2,
            minHeight: '2.6em',
          }}
          title={title}
        >
          {title}
        </Box>
        <Typography fontSize={14} color="text.secondary">
          {description}
        </Typography>
      </Box>
      {/* Check/Selection indicator at bottom right (do not change logic) */}
      {isSelected && (
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            bgcolor: '#00329E',
            borderRadius: '50%',
            width: 28,
            height: 28,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3,
          }}
        >
          <CheckCircleIcon sx={{ color: '#fff', fontSize: 22 }} />
        </Box>
      )}
      {/* Tooltip note above the checked circle for first card only */}
      {showNote && isSelected && (
        <Box
          sx={{
            position: 'absolute',
            zIndex: 10,
            bgcolor: '#5B4FE9',
            color: '#fff',
            borderRadius: 2,
            px: 2,
            py: 2,
            minWidth: { xs: 180, sm: 220, md: 260 },
            maxWidth: { xs: 220, sm: 260, md: 320 },
            height: 'auto',
            fontSize: 14,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            boxShadow: 3,
            left: { xs: 0, sm: 'auto', md: '81%' },
            right: { xs: 'auto', sm: 0, md: 0 },
            top: { xs: '100%', sm: -55, md: -110 },
            transform: { xs: 'none', sm: 'none', md: 'none' },
            mt: { xs: 1, sm: 0 },
          }}
        >
          {/* Arrow */}
          <Box
            sx={{
              position: 'absolute',
              left: { xs: 32, sm: 18, md: 22 },
              right: { xs: 'auto', sm: 'auto', md: 'auto' },
              transform: { xs: 'none', sm: 'none', md: 'none' },
              top: { xs: -10, sm: '100%' },
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: { xs: 'none', sm: '10px solid #5B4FE9' },
              borderBottom: { xs: '10px solid #5B4FE9', sm: 'none' },
            }}
          />
          <Typography sx={{ flex: 1, fontSize: { xs: 12, sm: 13, md: 14 }, pr: 0, pb: 1 }}>
            All templates are selected by default. Uncheck any you don't need.
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{
              mt: 1,
              alignSelf: 'flex-end',
              bgcolor: '#fff',
              color: '#5B4FE9',
              fontWeight: 700,
              fontSize: 13,
              px: 2.5,
              py: 0.5,
              borderRadius: 2,
              boxShadow: 'none',
              textTransform: 'none',
              minWidth: 64,
              '&:hover': {
                bgcolor: '#ecebfa',
                color: '#5B4FE9',
              },
            }}
            onClick={e => {
              e.stopPropagation();
              setShowFirstCardNote(false);
            }}
          >
            Got it
          </Button>
        </Box>
      )}
    </Paper>
  );
}

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
  const tabNameToIndex = { document: 0, event: 1 };
  const indexToTabName = ['document', 'event'];

  const [activeTab, setActiveTab] = useState(tabNameToIndex[tab] || 0);

  // Sync tab state with route prop
  useEffect(() => {
    setActiveTab(tabNameToIndex[tab] || 0);
  }, [tab]);

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
        setEventOptions(eventData || []); // No events until category is selected
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
    console.log("wertyui", user.user.id)
  };


  const handleCardClick = (docId) => {
    setSelected((prev) =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleToggleFavorite = (docId) => {
    setDocuments(prevDocuments =>
      prevDocuments.map(doc =>
        doc.id === docId ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  const handleProceed = async (catId, eventId, documentIds, userId, contextId) => {
    const payload = {
      event: eventId,
      context: contextId,
      documents: documentIds, // send all selected document IDs
      status: 'yet_to_start',
      created_by: userId,
      category: catId
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
    navigate(`/app/drafting/selected-event/${selectedEventInstanceId}`);
  }

  // Tab click handlers
  const handleTabChange = (_e, newValue) => {
    const tabRoute = indexToTabName[newValue];
    navigate(`/app/drafting/${tabRoute}/${contextId || ''}`);
  };

  // In Event component, add state for note visibility
  const [showFirstCardNote, setShowFirstCardNote] = useState(true);

  return (
  <MainCard
  sx={{
    p: { xs: 2, md: 4 },
    height: {
      xs: '100vh',
      md: '100%'
    },
    overflowY: 'auto',
  }}
>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
        <Typography variant="h5" fontWeight={600} sx={{ m: 0, fontSize: { xs: 15, sm: 22 } }}>
          Document Drafting
        </Typography>
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
      {/* <Paper elevation={2} sx={{
  p: { xs: 2, md: 4 },
  borderRadius: 3,
  width: '100%',
  maxWidth: 1400,
  mx: 'auto',
  mt: 2,
  minHeight: { xs: 800, md: 700 },
  position: 'relative',
}}> */}
      <Paper elevation={2} sx={{
        p: { xs: 2, md: 4 },
        borderRadius: 3,
        width: '100%',
        maxWidth: 1400,
        mx: 'auto',
        mt: 2,
        minHeight: { xs: 800, md: 550 },
        position: 'relative',
      }}>
        {/* Tabs always centered, search bar right, responsive */}
        <Box
          sx={{
            width: '100%',
            mt: { xs: -2, md: -4.5 },
            display: 'flex',
            alignItems: 'center',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 2,
            ml: { xs: 0, md: -4 }
          }}
        >
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            textColor="primary"
            indicatorColor="primary"
            sx={{ flex: 1, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}
          >
            <Tab label="Document Selection" />
            <Tab label="Create an Event" />
          </Tabs>
          {activeTab === 0 && (
            <Box sx={{ width: { xs: '93%', sm: 350, md: '23.5%' }, ml: { md: 'auto' }, mt: { xs: 2 }, mb: { xs: 2, md: 0 } }}>
              <TextField
                fullWidth
                size="small"

                placeholder="Search "
                value={search}
                onChange={e => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  bgcolor: '#fff',
                  borderRadius: 2,
                  boxShadow: { xs: 1, md: 0 },
                  width: '100%',
                  minWidth: 0,
                  transform: {
                    xs: 'translateY(2px) translateX(-1px)',
                    md: 'translateY(2px) translateX(50px)'
                  }
                }}
              />
            </Box>
          )}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, width: { xs: '93%', sm: '35%' }, ml: { xs: 2, md: 4 }, mt: { xs: 2 }, mb: { xs: 2, md: 0 } }}>
              <TextField
                fullWidth
                select
                label="Category"
                size="small"
                sx={{
                  bgcolor: '#F5F7FA',
                  transform: {
                    xs: 'translateY(2px) translateX(-8px)',
                    md: 'translateY(2px) translateX(50px)'
                  }
                }}
                value={category}
                onChange={e => handleCategoryChange(e.target.value)}
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
              </TextField>
              <TextField
                fullWidth
                select
                label="Event"
                size="small"
                sx={{
                  bgcolor: '#F5F7FA',
                  transform: {
                    xs: 'translateY(2px) translateX(-8px)',
                    md: 'translateY(2px) translateX(50px)'
                  }
                }}
                value={event}
                onChange={e => handleEventChange(e.target.value)}
                disabled={filtersLoading}
              >
                <MenuItem value="">Select Event</MenuItem>
                {eventOptions.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>{ev.event_name}</MenuItem>
                ))}
              </TextField>
            </Box>
          )}
        </Box>
        {/* Tab Content */}
        <TabPanel value={activeTab} index={0}>
          <Box>
            <DocumentSelectionPage contextId={contextId} search={search} />
          </Box>
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          {(category === '' && event === '') && (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" sx={{ width: '100%', my: 12 }}>
              <EventIcon
                sx={{
                  color: 'rgb(175, 206, 239)',
                  // fontSize: { xs: 60, sm: 80, md: 120, lg: 160 },
                  width: { xs: 95, sm: 80, md: 120, lg: 90 },
                  height: { xs: 60, sm: 80, md: 120, lg: 160 },
                }}
              />
              <Box sx={{ mb: 6 }}>
                <Typography variant="body1" color="text.secondary" sx={{ mt: { xs: 0, md: -3 }, maxWidth: 480, mx: 'auto' }}>
                  Please select category and event to start drafting
                </Typography>
              </Box>


            </Box>

          )}
          {filtersLoading ? (
            <Box
              sx={{
                borderRadius: 3,
                p: 4,
                background: '#fff',
                minHeight: 300,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgressComponent isLoading displayContent={'Loading Events...'} />
            </Box>
          ) : (
            <>
              {/* Only show card grid, Proceed button, and note if bot category and event are selected and documents are available */}
              {(event && documents.length > 0) ? (
                <>
                  <Grid2
                    container
                    spacing={{ xs: 2, sm: 6, md: 6 }}
                    sx={{
                      mb: 4, mx: 'auto', mt: 4
                      ,
                      ml: { xs: 2 },
                      width: { xs: '93%', sm: '100%', md: '100%' },

                      minWidth: { xs: '93%', sm: 220, md: '100%' },
                      maxWidth: { xs: '100%', sm: 400, md: '105%' },
                    }}
                    alignItems="flex-start"
                    justifyContent="flex-start"
                  >
                    {documents.map((doc, idx) => (
                      <Grid2 size={{ xs: 12, sm: 6, md: 3 }} key={doc.id || idx} sx={{ position: 'relative' }}>
                        <DocumentCard
                          title={doc.title || doc.document_name}
                          description={doc.description}
                          isFavorite={doc.isFavorite}
                          isSelected={selected.includes(doc.id)}
                          onFavorite={() => handleToggleFavorite(doc.id)}
                          onClick={() => handleCardClick(doc.id)}
                          showNote={idx === 0 && selected.includes(doc.id) && showFirstCardNote}
                          setShowFirstCardNote={setShowFirstCardNote}
                        />
                      </Grid2>
                    ))}
                  </Grid2>
                  {/* Footer */}
                  <Box display="flex" alignItems="center" justifyContent="center" mt={4}>
                    <Button
                      variant="contained"
                      sx={{
                        height: 30,
                        minWidth: 100,
                        fontSize: 14,
                        fontWeight: 400,
                        borderRadius: 1,
                        bgcolor: '#00329E',
                        color: 'white',
                        pt: 1,
                      }}
                      disabled={selected.length === 0}
                      onClick={() => handleProceed(category, event, selected, user.user.id, contextId)}
                    >
                      Proceed
                    </Button>
                  </Box>
                  {/* <Typography variant="body2" sx={{ color: '#1976d2', mt: 2, fontStyle: 'none' }}>
            Note: By default, all templates are selected. If you do not want a template, please uncheck it.
          </Typography> */}
                </>
              ) : null}
            </>
          )}
        </TabPanel>
      </Paper>
    </MainCard>
  );
};

export default Event;