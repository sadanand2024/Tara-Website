import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid2, TextField } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinearProgress from '@mui/material/LinearProgress';
import Factory from '/src/utils/Factory.js';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSelector, useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';


export default function DocumentSelectionPage({ onBreadcrumbClick, onProceed, contextId }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const { contextEventId } = useParams();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [splitView, setSplitView] = useState(false);
  const [fields, setFields] = useState([]);
  const [templateHtml, setTemplateHtml] = useState('');
  const [formValues, setFormValues] = useState({});
  const [templateLoading, setTemplateLoading] = useState(false);
  const [templateError, setTemplateError] = useState(null);
  const [draftDetailId, setDraftDetailId] = useState(null); // Store draft detail id after first save
  const [savingDraft, setSavingDraft] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [fileUrl, setFileUrl] = useState(null); // Store file URL for download
  const [favoriteStates, setFavoriteStates] = useState({});
  // Add: API call to add to favourites
  const handleToggleFavorite = async (id) => {
    // If already favorite, just toggle local state (no API for unfavorite as per user request)
    if (favoriteStates[id]) {
      setFavoriteStates((prev) => ({ ...prev, [id]: false }));
      return;
    }
    // POST to /documentdrafting/favourites/
    try {
      const payload = { document: id, draft: contextId };
      const result = await Factory('post', '/documentdrafting/favourites/', payload);
      if (result.res && result.res.status_cd === 0) {
        setFavoriteStates((prev) => ({ ...prev, [id]: true }));
        dispatch(openSnackbar({
          open: true,
          message: 'Added to favourites',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        }));
      } else {
        dispatch(openSnackbar({
          open: true,
          message: result.message || 'Failed to add to favourites',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        }));
      }
    } catch (err) {
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to add to favourites',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    }
  };

  // Fetch favorites on mount to make love symbol persistent
  useEffect(() => {
    if (!contextId) return;
    Factory('get', `/documentdrafting/favourites/by-draft/${contextId}/`, {}, {})
      .then(response => {
        const data = response?.res?.data || response?.res || response;
        // Build a map of { [documentId]: true }
        const favMap = {};
        (data || []).forEach(fav => {
          const docId = typeof fav.document === 'object' ? fav.document.id : fav.document;
          favMap[docId] = true;
        });
        setFavoriteStates(favMap);
      })
      .catch(() => setFavoriteStates({}));
  }, [contextId]);

  useEffect(() => {
    if (contextEventId) {
      // If contextEventId is present, fetch fields and template directly (split view mode)
      setSplitView(true);
      setTemplateLoading(true);
      setTemplateError(null);
      Factory('get', `/documentdrafting/document-fields-and-template/${contextEventId}/`)
        .then(async (getResult) => {
          if (getResult.res && getResult.res.status_cd === 0) {
            const { fields, template, draft_info } = getResult.res.data;
            const draft_data = draft_info && draft_info.length > 0 ? draft_info[0].draft_data : undefined;
            const draftDetailIdFromApi = draft_info && draft_info.length > 0 ? draft_info[0].id : null;
            setDraftDetailId(draftDetailIdFromApi);
            setFields(fields || []);
            setFormValues(draft_data || (fields ? Object.fromEntries(fields.filter(f => f.field_name).map(f => [f.field_name, ''])) : {}));
            try {
              const resp = await fetch(template);
              if (!resp.ok) throw new Error('Failed to fetch template HTML');
              const html = await resp.text();
              setTemplateHtml(html);
            } catch (err) {
              setTemplateHtml('');
              setTemplateError('Failed to load template HTML');
            }
            setTemplateLoading(false);
          } else {
            setTemplateError(getResult.message || 'Failed to load document fields/template');
            setTemplateLoading(false);
          }
        })
        .catch(() => {
          setTemplateError('Failed to load document fields/template');
          setTemplateLoading(false);
        });
    } else {
      // No contextEventId, show document selection step
    setLoading(true);
    setError(null);
    Factory('get', '/documentdrafting/documents/')
      .then(result => {
        if (result.res && result.res.status_cd === 0) {
          const docs = result.res.data?.results || result.res.data || [];
          setTemplates(docs);
        } else {
          setError(result.message || 'Failed to load templates');
        }
        setLoading(false);
      })
        .catch(() => {
        setError('Failed to load templates');
        setLoading(false);
      });
    }
  }, [contextEventId]);

  const handleCardProceed = async (templateId) => {
    console.log('User:', user);
    console.log('Context ID:', user.active_context.id);
    // POST API call to create context-wise event document
    const payload = {
      context: contextId, // use contextId prop passed from parent
      document: templateId,
      status: 'yet_to_start',
      created_by: user.user.id // TODO: replace with dynamic user id
    };
    try {
      const result = await Factory('post', '/documentdrafting/context-wise-event-document-create/', payload);
      if (result.res && result.res.status_cd === 0 && result.res.id) {
        const contextEventId = result.res.id;
        // Navigate to split view route
        navigate(`/app/drafting/fill/${contextEventId}`);
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

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Replace placeholders in templateHtml with formValues
  const renderTemplateWithValues = () => {
    let html = templateHtml;
    Object.entries(formValues).forEach(([key, value]) => {
      let displayValue = value;
      // If this key is a date field, format it
      const field = fields.find(f => f.field_name === key);
      if (field && field.field_type === 'date' && value) {
        // Format YYYY-MM-DD to DD-MM-YYYY if value is in that format
        if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
          const [yyyy, mm, dd] = value.split('-');
          displayValue = `${dd}-${mm}-${yyyy}`;
        }
      }
      // Wrap in highlight span
      const highlighted = `<span style="background:rgba(54, 80, 174, 0.24); border-radius: 4px; padding: 0 4px;">${displayValue}</span>`;
      html = html.replaceAll(new RegExp(`{{\s*${key}\s*}}`, 'g'), value ? highlighted : '');
    });
    // Extract and scope <style> tags from the HTML
        let scopedStyles = '';
        let offerLetterHtmlNoStyles = html;
        const styleTagRegex = /<style[\s\S]*?<\/style>/gi;
        const styleContentRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let match;
        while ((match = styleContentRegex.exec(html)) !== null) {
            // Prefix all selectors with .offer-letter-preview
            let css = match[1];
            css = css.replace(/(^|\})\s*([^@\{\}][^\{\}]*)\{/g, (m, p1, selector) => {
                const prefixed = selector
                    .split(',')
                    .map((s) => `.offer-letter-preview ${s.trim()}`)
                    .join(', ');
                return `${p1} ${prefixed} {`;
            });
            scopedStyles += css;
        }
        // Remove all <style> tags from the HTML
        offerLetterHtmlNoStyles = html.replace(styleTagRegex, '');
        // Remove fixed widths
        const offerLetterHtmlNoWidths = offerLetterHtmlNoStyles.replace(/width\s*:\s*\d+[^;]+;/g, '');
        // Inject the scoped original styles and our own scoped CSS
        const styledHtml = `
      <style>
        ${scopedStyles}
        .offer-letter-preview { font-family: 'Roboto', Arial, sans-serif !important; background: #fff !important; color: #222 !important; }
        .offer-letter-preview h1, .offer-letter-preview h2, .offer-letter-preview h3, .offer-letter-preview h4, .offer-letter-preview h5, .offer-letter-preview h6 { font-family: 'Roboto', Arial, sans-serif !important; }
        .offer-letter-preview p { margin: 1em 0 !important; line-height: 1.7 !important; }
        .offer-letter-preview table { width: 100% !important; border-collapse: collapse !important; }
        .offer-letter-preview td, .offer-letter-preview th { padding: 12px !important; font-size: 1rem !important; }
        .offer-letter-preview table, .offer-letter-preview tr, .offer-letter-preview td, .offer-letter-preview th { width: auto !important; max-width: 100% !important; }
        .offer-letter-preview * { box-sizing: border-box !important; }
      </style>
      <div class="offer-letter-preview">
        ${offerLetterHtmlNoWidths}
      </div>
    `;
        return styledHtml;
  };

  // Helper to fetch latest draft details and update fileUrl
  const fetchAndSetFileUrl = async (id) => {
    try {
      const result = await Factory('get', `/documentdrafting/document-drafts-details/${id}/`);
      if (result.res && result.res.status_cd === 0 && result.res.data && (result.res.data.file_url || result.res.data.file)) {
        setFileUrl(result.res.data.file_url || result.res.data.file);
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  // Save Draft handler
  const handleSaveDraft = async () => {
    if (!contextEventId) {
      dispatch(openSnackbar({
        open: true,
        message: 'Context event ID missing. Please try again.',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
      return;
    }
    // Check if all fields are filled
    const emptyField = (fields || []).find(f => !formValues[f.field_name] || String(formValues[f.field_name]).trim() === '');
    if (emptyField) {
      dispatch(openSnackbar({
        open: true,
        message: `Please fill all fields before saving. Missing: ${emptyField.label || emptyField.field_name}`,
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
      return;
    }
    setSavingDraft(true);
    const payload = {
      draft: contextEventId,
      draft_data: formValues,
      status: 'draft'
    };
    try {
      if (!draftDetailId) {
        // First time: POST
        const result = await Factory('post', '/documentdrafting/document-drafts-details/', payload);
        if (result.res && result.res.status_cd === 0 && result.res.id) {
          setDraftDetailId(result.res.id);
          if (result.res.file_url || result.res.file) {
            setFileUrl(result.res.file_url || result.res.file);
          } else {
            fetchAndSetFileUrl(result.res.id);
          }
          dispatch(openSnackbar({
            open: true,
            message: 'Draft saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          }));
        } else {
          dispatch(openSnackbar({
            open: true,
            message: result.message || 'Failed to save draft',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          }));
        }
      } else {
        // Subsequent: PUT
        const result = await Factory('put', `/documentdrafting/document-drafts-details/${draftDetailId}/`, payload);
        if (result.res && result.res.status_cd === 0) {
          if (result.res.file_url || result.res.file) {
            setFileUrl(result.res.file_url || result.res.file);
          } else {
            fetchAndSetFileUrl(draftDetailId);
          }
          dispatch(openSnackbar({
            open: true,
            message: 'Draft updated successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          }));
        } else {
          dispatch(openSnackbar({
            open: true,
            message: result.message || 'Failed to update draft',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          }));
        }
      }
    } catch (err) {
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to save draft',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    }
    setSavingDraft(false);
  };

  // Finalize handler
  const handleFinalize = async () => {
    if (!contextEventId) {
      dispatch(openSnackbar({
        open: true,
        message: 'Context event ID missing. Please try again.',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
      return;
    }
    // Check if all fields are filled
    const emptyFieldFinalize = (fields || []).find(f => !formValues[f.field_name] || String(formValues[f.field_name]).trim() === '');
    if (emptyFieldFinalize) {
      dispatch(openSnackbar({
        open: true,
        message: `Please fill all fields before finalizing. Missing: ${emptyFieldFinalize.label || emptyFieldFinalize.field_name}`,
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
      return;
    }
    setFinalizing(true);
    const payload = {
      draft: contextEventId,
      draft_data: formValues,
      status: 'completed'
    };
    try {
      if (!draftDetailId) {
        // First time: POST
        const result = await Factory('post', '/documentdrafting/document-drafts-details/', payload);
        if (result.res && result.res.status_cd === 0 && result.res.id) {
          setDraftDetailId(result.res.id);
          if (result.res.file_url || result.res.file) {
            setFileUrl(result.res.file_url || result.res.file);
          } else {
            fetchAndSetFileUrl(result.res.id);
          }
          dispatch(openSnackbar({
            open: true,
            message: 'Document finalized successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          }));
        } else {
          dispatch(openSnackbar({
            open: true,
            message: result.message || 'Failed to finalize',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          }));
        }
      } else {
        // Subsequent: PUT
        const result = await Factory('put', `/documentdrafting/document-drafts-details/${draftDetailId}/`, payload);
        if (result.res && result.res.status_cd === 0) {
          if (result.res.file_url || result.res.file) {
            setFileUrl(result.res.file_url || result.res.file);
          } else {
            fetchAndSetFileUrl(draftDetailId);
          }
          dispatch(openSnackbar({
            open: true,
            message: 'Document finalized successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          }));
        } else {
          dispatch(openSnackbar({
            open: true,
            message: result.message || 'Failed to finalize',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          }));
        }
      }
    } catch (err) {
      dispatch(openSnackbar({
        open: true,
        message: 'Failed to finalize',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    }
    setFinalizing(false);
  };

  // Download handler (presigned URL logic)
  const handleDownload = async () => {
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
    try {
      const result = await Factory('get', `/docwallet/generate_presigned_url?url=${encodeURIComponent(fileUrl)}`, {}, {});
      console.log('Presigned URL response:', result);
      const presignedUrl = result.res.data.presigned_url || result.res.data.url;
      if (result.res && result.res.status_cd === 0 && result.res.data && presignedUrl) {
        // Open the presigned URL in a new tab (temporary workaround for CORS)
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
          message: result.message || 'Failed to get presigned URL',
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
      console.error('Download error:', err);
    }
  };

  // Reset All handler
  const handleResetAll = () => {
    // Reset all form fields to empty
    const resetValues = (fields || []).reduce((acc, field) => {
      acc[field.field_name] = '';
      return acc;
    }, {});
    setFormValues(resetValues);
    dispatch(openSnackbar({
      open: true,
      message: 'All fields reset',
      variant: 'alert',
      alert: { color: 'success' },
      close: false
    }));
  };

  if (splitView) {
    // Only render the split view, no header/tabs, with a full white background
  return (
    <Box
      sx={{
        p: { xs: 1.5, sm: 2, md: 4 },
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'white', // set app background
        borderRadius: '8px',
      }}
    >
      
      <Typography variant="h5" fontWeight={600} sx={{ m: 0, mb: 2, fontSize: { xs: 18, sm: 22 } }}>
            Document Drafting
          </Typography>
      
          {/* Your inner content */}
            <Box
            sx={{
                display: 'flex',
                flexWrap: { xs: 'wrap', md: 'nowrap' }, // Wrap on small screens, side-by-side on md+
                gap: 3, // space between the papers
                justifyContent: 'center', // center the row
                width: '100%',
            }}
            > 
          {/* Left: Dynamic Form */}
          <Paper elevation={2} sx={{flex: 1, minWidth: { xs: '100%', sm: 320, md: 400 }, maxWidth: 700, height: 585, maxHeight: 1000, display: 'flex', flexDirection: 'column', pb: 2, mr: 2, overflow: 'hidden' }}>
            {/* Progress Bar */}
            {fields.length > 0 && (
              <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
                {(() => {
                  const totalFields = fields.length;
                  const filledFields = fields.filter(f => formValues[f.field_name] && String(formValues[f.field_name]).trim() !== '').length;
                  const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
                  return <>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#E3EAFE',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3650AE',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ position: 'absolute', right: 16, top: 4, color: '#3650AE', fontWeight: 600 }}>
                      {Math.round(progress)}%
                    </Typography>
                  </>;
                })()}
              </Box>
            )}
            {/* Fixed Fill Details Heading */}
            <Typography variant="h5" fontWeight={700} mb={2} sx={{ p: 2, pb: 0 }}>Fill Details</Typography>
            <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
              <ScrollableCard showArrows>
                <Box sx={{ p: 2.5, pb: 2 }}>
                  {(fields || []).length > 0 ? (
                    <Grid2 container spacing={2}>
                      {fields.map((field, idx) => (
                        <Grid2 size={{xs:12,md:6}} key={field.field_name}>
                          <TextField
                            fullWidth
                            label={field.label || field.field_name}
                            value={formValues[field.field_name] || ''}
                            onChange={e => handleFormChange(field.field_name, e.target.value)}
                            type={field.field_type || 'text'}
                            variant="outlined"
                            slotProps={{ inputLabel: { shrink: true } }}
                            placeholder={field.placeholder || (field.field_type === 'date' ? 'DD-MM-YYYY' : '')}
                            sx={
                              field.field_type === 'date'
                                ? {
                                    backgroundColor: '#f7f9fb',
                                    '& .MuiOutlinedInput-root': {
                                      backgroundColor: '#f7f9fb',
                                      borderRadius: '24px',
                                      '& input::placeholder': {
                                        color: '#b0b8c4',
                                        opacity: 1,
                                        fontWeight: 600,
                                        fontSize: 32,
                                        textAlign: 'center',
                                      },
                                    },
                                  }
                                : {}
                            }
                          />
                        </Grid2>
                      ))}
                    </Grid2>
                  ) : (
                    <Typography>No fields to fill.</Typography>
                  )}
                </Box>
              </ScrollableCard>
            </Box>
          </Paper>
          {/* Right: Live Template Preview */}
          <Paper elevation={2} sx={{ position: 'relative', flex: 1, minWidth: { xs: '100%', sm: 320, md: 400 }, maxWidth: 700, height: 585, maxHeight: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Progress Bar (same as left) */}
            {fields.length > 0 && (
              <Box sx={{ width: '100%', mb: 2, position: 'relative' }}>
                {(() => {
                  const totalFields = fields.length;
                  const filledFields = fields.filter(f => formValues[f.field_name] && String(formValues[f.field_name]).trim() !== '').length;
                  const progress = totalFields > 0 ? (filledFields / totalFields) * 100 : 0;
                  return <>
                    <LinearProgress
                      variant="determinate"
                      value={progress}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#E3EAFE',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: '#3650AE',
                        },
                      }}
                    />
                    <Typography variant="caption" sx={{ position: 'absolute', right: 16, top: 4, color: '#3650AE', fontWeight: 600 }}>
                      {Math.round(progress)}%
                    </Typography>
                  </>;
                })()}
              </Box>
            )}
            {(() => {
              const templateBoxRef = React.createRef();
              return (
                <ScrollableCard showArrows containerRef={templateBoxRef}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" fontWeight={700} mb={2} sx={{ p: 2, pb: 0 }}>Document Preview</Typography>
                    <Box
                      ref={templateBoxRef}
                      sx={{
                        flex: 1,
                        p: 0,
                        height: '100%',
                        maxHeight: 500,
                        overflow: 'auto',
                        width: '100%',
                        maxWidth: '100%',
                        background: 'transparent',
                        borderRadius: 0,
                        boxSizing: 'border-box',
                        // Custom scrollbar styles
                        '&::-webkit-scrollbar': {
                          width: 8,
                          backgroundColor: '#E3EAFE',
                          borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: '#3650AE',
                          borderRadius: 4,
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                          backgroundColor: '#00329E',
                        },
                        scrollbarWidth: 'thin',
                        scrollbarColor: '#3650AE #E3EAFE',
                        '& .offer-letter-preview': {
                          width: '100%',
                          marginTop: 2,
                          marginBottom: 2,
                          padding: 2,
                        },
                        '& *': {
                          maxWidth: '100%',
                          wordBreak: 'break-word',
                        },
                      }}
                    >
                      {templateLoading ? (
                        <Typography>Loading template...</Typography>
                      ) : templateError ? (
                        <Typography color="error">{templateError}</Typography>
                      ) : (
                        <div dangerouslySetInnerHTML={{ __html: renderTemplateWithValues() }} />
                      )}
                    </Box>
                  </Box>
                </ScrollableCard>
              );
            })()}
          </Paper>
          </Box>
        
        {/* Action Buttons: centered below both columns */}
        <Box sx={{ display: 'flex', gap: 2, mt: 6, justifyContent: 'center' }}>
          <Button variant="outlined" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0, borderColor: '#00329E', color: '#00329E', '&:hover': { borderColor: '#00329E', background: 'rgba(0,50,158,0.04)' } }} onClick={() => navigate('/app/drafting', { state: { showEvent: true, eventInitialTab: 'document' } })}>{'< Back'}</Button>
          <Button variant="contained" color="primary" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0, background: '#00329E', color: '#fff', '&:hover': { background: '#002266' } }} onClick={handleSaveDraft} disabled={savingDraft}>
            {savingDraft ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="contained" color="primary" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0, background: '#00329E', color: '#fff', '&:hover': { background: '#002266' } }} onClick={handleFinalize} disabled={finalizing}>
            {finalizing ? 'Finalizing...' : 'Finalize'}
        </Button>
        <Button
            variant="contained"
            color="success"
          sx={{
              height: 40,
              minWidth: 120,
              fontSize: 16,
              px: 3,
              py: 0,
              background: '#00329E',
              color: '#fff',
              '&:hover': { background: '#002266' },
              '&.Mui-disabled': {
                backgroundColor: '#00329E',
                color: '#fff',
                opacity: 1,
              },
            }}
            onClick={handleDownload}
            disabled={!fileUrl}
          >
            Download
        </Button>
          <Button variant="outlined" color="primary" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0, borderColor: '#00329E', color: '#00329E', '&:hover': { borderColor: '#00329E', background: 'rgba(0,50,158,0.04)' } }} onClick={handleResetAll}>Reset All</Button>
        </Box>
      
    </Box>
  );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      {/* Document Cards Grid */}
      {loading ? (
        <Box sx={{ textAlign: 'center', my: 4 }}>Loading templates...</Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', color: 'red', my: 4 }}>{error}</Box>
      ) : (
        <Grid2 container spacing={3} sx={{ mb: 4, maxWidth: 1200, mx: 'auto' }} justifyContent="flex-start">
          {(templates || []).map((template) => (
              <Grid2 size={{xs:12,sm:6,md:4}} key={template.id}>
                <Paper
                  sx={{
                    border: '1.5px solid #b0b8c4',
                    borderRadius: 3,
                    p: 3,
                    minWidth: 350,
                    maxWidth: 350,
                    minHeight: 180,
                    maxHeight: 180,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    position: 'relative',
                    transition: 'border 0.2s, box-shadow 0.2s, transform 0.2s',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      border: '1.5px solid #00329E',
                      boxShadow: '0 6px 24px rgba(2, 78, 153, 0.15)',
                      transform: 'scale(1.03)',
                      zIndex: 2,
                    },
                  }}
              >
                  {/* Love (heart) icon at top right */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      zIndex: 3,
                      cursor: 'pointer',
                      transition: 'color 0.2s',
                      color: favoriteStates[template.id] ? '#00329E' : '#b0b8c4',
                    }}
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleFavorite(template.id);
                    }}
                  >
                    {favoriteStates[template.id] ? (
                      <FavoriteIcon sx={{ fontSize: 28 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 28 }} />
                    )}
                  </Box>
                  <Typography fontWeight={700} fontSize={18} mb={1}>
                  {template.title || template.document_name}
                  </Typography>
                  <Typography fontSize={15} color="text.secondary" sx={{ flex: 1 }}>
                    {template.description}
                  </Typography>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      width: 160,
                      height: 35,
                      fontSize: 16,
                      fontWeight: 600,
                      borderRadius: 2,
                      mt: 2,
                      alignSelf: 'center',
                      background: '#00329E',
                    }}
                    onClick={() => handleCardProceed(template.id)}
                  >
                    Proceed
                  </Button>
              </Paper>
            </Grid2>
          ))}
        </Grid2>
      )}
    </Box>
  );
}

function ScrollableCard({ children, showArrows, containerRef: externalRef }) {
  const internalRef = React.useRef(null);
  const containerRef = externalRef || internalRef;
  const [showUp, setShowUp] = React.useState(false);
  const [showDown, setShowDown] = React.useState(false);

  const checkScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    setShowUp(el.scrollTop > 0);
    setShowDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1); // -1 for rounding
  };

  React.useEffect(() => {
    checkScroll();
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    return () => el.removeEventListener('scroll', checkScroll);
  }, [children]); // re-check when children change

  const handleScroll = (direction) => {
    const el = containerRef.current;
    if (!el) return;
    const amount = 100;
    if (direction === 'up') {
      el.scrollBy({ top: -amount, behavior: 'smooth' });
    } else if (direction === 'down') {
      el.scrollBy({ top: amount, behavior: 'smooth' });
    }
  };

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      {showArrows && showUp && (
        <Box sx={{ position: 'absolute', top: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <Box
            component="button"
            onClick={() => handleScroll('up')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              p: 0,
              m: 0,
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowUpwardIcon fontSize="small" sx={{ bgcolor: '#fff', borderRadius: '50%', boxShadow: 1, p: 0.2 }} />
          </Box>
        </Box>
      )}
      {/* Only attach ref to direct child if not provided externally */}
      {externalRef ? children : <Box ref={containerRef} sx={{
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        pr: 1,
        // Custom scrollbar styles
        '&::-webkit-scrollbar': {
          width: 8,
          backgroundColor: '#E3EAFE',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#3650AE',
          borderRadius: 4,
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: '#00329E',
        },
        scrollbarWidth: 'thin',
        scrollbarColor: '#3650AE #E3EAFE',
      }}>{children}</Box>}
      {showArrows && showDown && (
        <Box sx={{ position: 'absolute', bottom: 8, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 2 }}>
          <Box
            component="button"
            onClick={() => handleScroll('down')}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              p: 0,
              m: 0,
              outline: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ArrowDownwardIcon fontSize="small" sx={{ bgcolor: '#fff', borderRadius: '50%', boxShadow: 1, p: 0.2 }} />
          </Box>
        </Box>
      )}
    </Box>
  );
} 
