import CloseIcon from '@mui/icons-material/Close';
import CreateIcon from '@mui/icons-material/Create';
import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import Grid2 from '@mui/material/Grid2';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { ThemeMode } from 'config';
import React, { useEffect } from 'react';
  const headerSX = { fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem', lg: '2.5rem' } };

const categories = [
  { key: 'ShowBys', label: 'Show By' },
  { key: 'all', label: 'All' },
  { key: 'hr', label: 'HR Templates' },
  { key: 'company', label: 'Company Structure' },
  { key: 'legal', label: 'Legal, Compliance & Investments' },
  { key: 'sales', label: 'Sales and Partnerships' },
  { key: 'pitch', label: 'Startup Pitch Decks' }
];

const FinalSection = () => {
  const theme = useTheme();
  const backgroundColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'dark.900';
  let baseURL = import.meta.env.VITE_APP_BASE_URL;

  const [activeKey, setActiveKey] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const [templates, setTemplates] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);

  // Fetch templates from API using axios
  useEffect(() => {
    axios
      .get(`${baseURL}/documentdrafting/documents/`)
      .then((res) => {
        const data = res.data;
        const templatesList = Array.isArray(data) ? data : data?.results || [];

        // Transform API data to match our template structure
        const transformedTemplates = templatesList.map((item, index) => ({
          id: item.id || index,
          title: item.document_name || item.name || item.title || 'Untitled Document',
          popular: item.is_popular || item.popular || false,
          category: item.category || item.category_name || 'all',
          template: item.template || '',
          description: item.description || ''
        }));

        setTemplates(transformedTemplates);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching templates:', err);
        setTemplates([]);
        setLoading(false);
      });
  }, []);

  // Filter templates by search and category, then limit to top 6
  const filteredTemplates = templates
    .filter((t) => (activeKey === 'all' || t.category === activeKey) && t.title.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 7);

  // Handle preview button click
  const handlePreviewClick = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  // Handle close preview
  const handleClosePreview = () => {
    setPreviewOpen(false);
    setSelectedTemplate(null);
  };

  return (
    <Box
      sx={{
        mt: { xs: -8, sm: -10, md: -16},
        position: 'relative',
        zIndex: 2,
        width: '100vw',
        left: '50%',
        right: '50%',
        marginLeft: '-50vw',
        marginRight: '-50vw',
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          py: { xs: 6, sm: 8, md: 5.5 },
          backgroundColor: '#f0f4ff'
        }}
      >
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* --- Add this block for title and description --- */}
          <Box sx={{ mb: { xs: 4, sm:10 ,md:10} }}>
            <Typography
              // variant="h3"
              // align="center"
              // sx={{
              //   fontWeight: 700,
               
              //   mb: 2,
              //   fontSize: { xs: '2rem', sm: '2.5rem', md: '2.75rem' }
              // }}
               variant="h2"
                component="h1"
                 sx={{
                      ...headerSX,
                      fontWeight: 600,
                      lineHeight: '50px',
                      display: 'block',
                       color: '#1b4ca8',
                      fontSize: { xs: '2rem', sm: '42px', md: '42px', lg: '42px' },
                      whiteSpace: { xs: 'normal', md: 'nowrap', lg: 'nowrap' }
                    }}
            >
              Document Drafting Templates
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                fontSize: { xs: '1.1rem', sm: '1.25rem', md: '1.35rem' },
                maxWidth: 700,
                mx: 'auto'
              }}
            >
              Explore ready-to-use legal, HR, and business document templates. Click to preview, edit, and download for your needs.
            </Typography>
          </Box>
          {/* --- End title and description block --- */}
          <Grid2 container spacing={{ xs: 2, sm: 3, md: 4 }}>
            {/* Left sidebar: categories */}
            <Grid2 size={{ xs: 12, sm: 12, md: 3 }}>
              <Box sx={{ color: 'text.secondary', mt: { xs: 3, md:8 } }}>
                <List disablePadding>
                  {categories.map((c) => (
                    <ListItemButton
                      key={c.key}
                      // selected={activeKey === c.key}
                      // onClick={() => setActiveKey(c.key)}
                      variant="body1"
                      sx={{
                        mt: { xs: 1, sm: 1.5, md: 2 },
                        textAlign: { xs: 'center', sm: 'center', md: 'left' },
                        color: 'text.secondary',
                        fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' },
                        // mb: { xs: 2, sm: 2.5, md: 3 },
                        // lineHeight: 0.5,
                        fontStyle: 'Inter',
                        // ml: { xs:'flex-start', sm:'flex-start', md:'flex-start', lg:'flex-start'},

                        fontWeight: 500
                        // px: { xs: 1, sm: 2, md: 0 }
                        // whiteSpace: { xs: 'nowrap', md: 'nowrap' }
                      }}
                    >
                      <ListItemText
                        primary={c.label}
                        primaryTypographyProps={{
                          variant: { xs: 'body1', md: 'h6' },
                          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.1rem' }
                        }}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Box>
            </Grid2>

            {/* Right: template list */}
            <Grid2 size={{ xs: 12, sm: 12, md: 9 }}>
              {/* Search Bar */}
              <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  size="medium"
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }
                  }}
                />
              </Box>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: { xs: 1, md: 2 },
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                  boxShadow: { xs: 2, md: 4 }
                }}
              >
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: { xs: 3, md: 4 } }}>
                    <CircularProgress size={{ xs: 24, md: 32 }} />
                  </Box>
                ) : filteredTemplates.length === 0 ? (
                  <Typography sx={{ p: { xs: 3, md: 4 }, textAlign: 'center', color: 'text.secondary' }}>No templates found.</Typography>
                ) : (
                  filteredTemplates.map((t, idx) => (
                    <Box key={t.id}>
                      <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={{ xs: 1, sm: 2 }}
                        sx={{
                          px: { xs: 2, sm: 2.5 },
                          py: { xs: 2, sm: 2.25 },
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        {t.popular && (
                          <Chip
                            size="small"
                            label="MOST POPULAR"
                            color="primary"
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              minWidth: { xs: 'auto', sm: 120 },
                              fontSize: { xs: '0.7rem', sm: '0.75rem' },
                              mb: { xs: 1, sm: 0 }
                            }}
                          />
                        )}
                        <Typography
                          variant="h3"
                          color="#00256B"
                          fontWeight="400"
                          fontFamily={'inter'}
                          mb={4}
                          sx={{
                            flex: 1,

                            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '18px' },
                            lneHeight: 1.4,

                            backgroundColor: 'transparent',
                            px: 0.5,
                            py: 0.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'normal',
                            wordBreak: 'break-word',
                            textAlign: { xs: 'left', sm: 'left' }
                          }}
                        >
                          {t.title}
                        </Typography>
                        <Stack direction="row" spacing={0.5}>
                          
                          <IconButton
                            size="small"
                            color="primary"
                            aria-label="create"
                            sx={{
                              p: { xs: 0.5, sm: 1 },
                              '& .MuiSvgIcon-root': { fontSize: { xs: '1.1rem', sm: '1.25rem' } }
                            }}
                            // You can add your onClick handler here if needed
                          >
                            <CreateIcon />
                          </IconButton>
                        </Stack>
                      </Stack>
                      {idx < filteredTemplates.length - 1 && <Divider />}
                    </Box>
                  ))
                )}
              </Box>
            </Grid2>
          </Grid2>
        </Container>
      </Box>

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth={false}
        sx={{
          '& .MuiDialog-paper': {
            width: { xs: '95vw', sm: '85vw', md: '70vw', lg: '60vw' },
            maxWidth: { xs: 'none', sm: '600px', md: '800px' },
            maxHeight: { xs: '90vh', sm: '85vh', md: '80vh' },
            borderRadius: { xs: 1, md: 2 },
            boxShadow: { xs: '0 5px 20px rgba(0,0,0,0.15)', md: '0 10px 30px rgba(0,0,0,0.2)' },
            margin: { xs: 1, sm: 2 }
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 1, sm: 0 },
            bgcolor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: { xs: 1.5, sm: 2 },
            px: { xs: 2, sm: 3 },
            borderRadius: { xs: '4px 4px 0 0', md: '8px 8px 0 0' }
          }}
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 600,
                fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
                lineHeight: 1.3,
                wordBreak: 'break-word'
              }}
            >
              {selectedTemplate?.title || 'Template Preview'}
            </Typography>
            {selectedTemplate?.description && (
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mt: 0.5,
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  lineHeight: 1.4
                }}
              >
                {selectedTemplate.description}
              </Typography>
            )}
          </Box>
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{
              color: 'white',
              bgcolor: 'rgba(255,255,255,0.1)',
              p: { xs: 0.5, sm: 1 },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.2)'
              },
              '& .MuiSvgIcon-root': {
                fontSize: { xs: '1.1rem', sm: '1.25rem' }
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            p: 0,
            bgcolor: 'background.default',
            minHeight: { xs: '50vh', sm: '55vh', md: '60vh' }
          }}
        >
          {selectedTemplate?.template ? (
            <Box
              sx={{
                height: { xs: '50vh', sm: '55vh', md: '60vh' },
                width: '100%'
              }}
            >
              <iframe
                src={selectedTemplate.template}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title={`Preview of ${selectedTemplate.title}`}
                onLoad={() => console.log('Iframe loaded successfully')}
                onError={() => console.log('Iframe failed to load')}
              />
            </Box>
          ) : (
            <Box
              sx={{
                p: { xs: 3, sm: 4 },
                textAlign: 'center',
                minHeight: { xs: '50vh', sm: '55vh', md: '60vh' },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <PreviewIcon
                sx={{
                  fontSize: { xs: 36, sm: 42, md: 48 },
                  color: 'text.disabled',
                  mb: 2
                }}
              />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{
                  mb: 1,
                  fontSize: { xs: '1rem', sm: '1.1rem' }
                }}
              >
                No Preview Available
              </Typography>
              <Typography variant="body2" color="text.disabled" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                This template doesn't have a preview available.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            bgcolor: 'background.paper',
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 2 },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: { xs: 0.5, sm: 0 }
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            Live Preview • Click outside to close
          </Typography>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FinalSection;
