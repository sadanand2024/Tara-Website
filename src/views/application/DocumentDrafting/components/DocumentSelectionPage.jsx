import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid2, TextField } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Factory from '/src/utils/Factory.js';
import { useNavigate, useParams } from 'react-router-dom';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSelector } from 'react-redux';


export default function DocumentSelectionPage({ onBreadcrumbClick, onProceed, contextId }) {
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
      } else {
        alert(result.message || 'Failed to create document drafting context');
      }
    } catch (err) {
      alert('Failed to create document drafting context');
    }
  };

  const handleFormChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Replace placeholders in templateHtml with formValues
  const renderTemplateWithValues = () => {
    let html = templateHtml;
    Object.entries(formValues).forEach(([key, value]) => {
      // Replace all occurrences of {{key}} with value
      html = html.replaceAll(new RegExp(`{{\s*${key}\s*}}`, 'g'), value || '');
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
        .offer-letter-preview, .offer-letter-preview * { font-family: 'Roboto', Arial, sans-serif !important; background: #fff !important; color: #222 !important; }
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
      alert('Context event ID missing. Please try again.');
      return;
    }
    // Check if all fields are filled
    const emptyField = (fields || []).find(f => !formValues[f.field_name] || String(formValues[f.field_name]).trim() === '');
    if (emptyField) {
      alert(`Please fill all fields before saving. Missing: ${emptyField.label || emptyField.field_name}`);
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
        } else {
          alert(result.message || 'Failed to save draft');
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
        } else {
          alert(result.message || 'Failed to update draft');
        }
      }
    } catch (err) {
      alert('Failed to save draft');
    }
    setSavingDraft(false);
  };

  // Finalize handler
  const handleFinalize = async () => {
    if (!contextEventId) {
      alert('Context event ID missing. Please try again.');
      return;
    }
    // Check if all fields are filled
    const emptyFieldFinalize = (fields || []).find(f => !formValues[f.field_name] || String(formValues[f.field_name]).trim() === '');
    if (emptyFieldFinalize) {
      alert(`Please fill all fields before finalizing. Missing: ${emptyFieldFinalize.label || emptyFieldFinalize.field_name}`);
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
        } else {
          alert(result.message || 'Failed to finalize');
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
        } else {
          alert(result.message || 'Failed to finalize');
        }
      }
    } catch (err) {
      alert('Failed to finalize');
    }
    setFinalizing(false);
  };

  // Download handler (presigned URL logic)
  const handleDownload = async () => {
    if (!fileUrl) {
      alert('No file available for download. Please finalize the document first.');
      return;
    }
    try {
      const result = await Factory('get', `/docwallet/generate_presigned_url?url=${encodeURIComponent(fileUrl)}`, {}, {});
      console.log('Presigned URL response:', result);
      const presignedUrl = result.res.data.presigned_url || result.res.data.url;
      if (result.res && result.res.status_cd === 0 && result.res.data && presignedUrl) {
        // Open the presigned URL in a new tab (temporary workaround for CORS)
        window.open(presignedUrl, '_blank');
      } else {
        alert(result.message || 'Failed to get presigned URL');
      }
    } catch (err) {
      alert('Failed to download file');
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
            
            <ScrollableCard showArrows>
              <Typography variant="h5" fontWeight={700} mb={2} sx={{ p: 2.5, pb: 0 }}>Fill Details</Typography>
              <Box sx={{ p: 2.5, pt: 0 }}>
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
          </Paper>
          {/* Right: Live Template Preview */}
          <Paper elevation={2} sx={{ position: 'relative', flex: 1, minWidth: { xs: '100%', sm: 320, md: 400 }, maxWidth: 700, height: 585, maxHeight: 1000, display: 'flex', flexDirection: 'column', overflow: 'hidden', p: 2 }}>
            {(() => {
              const templateBoxRef = React.createRef();
              return (
                <ScrollableCard showArrows containerRef={templateBoxRef}>
                  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" fontWeight={700} mb={2}>Document Preview</Typography>
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
                        '& .offer-letter-preview': {
                          width: '100%',
                          marginTop: 2,
                          marginBottom: 2,
                          padding: 0,
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
          <Button variant="outlined" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0 }} onClick={() => navigate('/app/drafting', { state: { showEvent: true, eventInitialTab: 'document' } })}>{'< Back'}</Button>
          <Button variant="contained" color="primary" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0 }} onClick={handleSaveDraft} disabled={savingDraft}>
            {savingDraft ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button variant="contained" color="primary" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0 }} onClick={handleFinalize} disabled={finalizing}>
            {finalizing ? 'Finalizing...' : 'Finalize'}
        </Button>
        <Button
            variant="contained"
            color="primary"
          sx={{
              height: 40,
              minWidth: 120,
              fontSize: 16,
            px: 3,
              py: 0,
              '&.Mui-disabled': {
                backgroundColor: '#2196f3',
                color: '#fff',
                opacity: 1,
              },
            }}
            onClick={handleDownload}
            disabled={!fileUrl}
          >
            Download
        </Button>
          <Button variant="outlined" color="primary" sx={{ height: 40, minWidth: 120, fontSize: 16, px: 3, py: 0 }} onClick={handleResetAll}>Reset All</Button>
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
        <Grid2 container spacing={3} sx={{ mb: 4, maxWidth: 1200, mx: 'auto' }} justifyContent="center">
          {(templates || []).map((template) => (
              <Grid2 size={{xs:12,sm:6,md:4}} key={template.id}>
                <Paper
                  sx={{
                  border: '1.5px solid #b0b8c4',
                    borderRadius: 3,
                    p: 3,
                    minWidth: 350,
                    maxWidth: 350,
                    minHeight: 190,
                    maxHeight: 190,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    position: 'relative',
                    transition: 'border 0.2s',
                  cursor: 'default',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                  }}
              >
                  <Typography fontWeight={700} fontSize={18} mb={1}>
                  {template.title || template.document_name}
                  </Typography>
                  <Typography fontSize={15} color="text.secondary">
                    {template.description}
                  </Typography>
        <Button
          variant="contained"
          endIcon={<ArrowForwardIcon />}
          sx={{
            background: '#00329E',
            borderRadius: 2,
            height: 40,
            minWidth: 120,
            fontSize: 16,
            px: 3,
            py: 0,
            fontWeight: 600,
            mt: 2
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
      {externalRef ? children : <Box ref={containerRef} sx={{ height: '100%', width: '100%', overflowY: 'auto', pr: 1 }}>{children}</Box>}
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
