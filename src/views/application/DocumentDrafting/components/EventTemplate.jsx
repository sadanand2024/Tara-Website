import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';




// Helper for category color
const chipColor = (categoryName) => {
  const key = (categoryName || '').toLowerCase();
  switch (key) {
    case 'business':
      return { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
    case 'hr':
    case 'hr department':
      return { color: '#10b981', bg: 'rgba(16,185,129,0.08)' };
    case 'company':
      return { color: '#a855f7', bg: 'rgba(168,85,247,0.08)' };
    default:
      return { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)' };
  }
};

const EventTemplate = ({ setShowEventTemplateAfterDownload, setIsDownload }) => {
  const baseURL = import.meta.env.VITE_APP1_BASE_URL;
  const [cardData, setCardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const templateIdFromQuery = searchParams.get('templateId');
  const selectedTemplateId = templateIdFromQuery || localStorage.getItem('selectedTemplateId');
  useEffect(() => {
    const selectedTemplateId = localStorage.getItem('selectedTemplateId') || 6;
    setLoading(true);
    axios
      .get(`${baseURL}/documentdrafting/documents/${selectedTemplateId}/related/`)
      .then((res) => {
        setCardData(res.data.documents || []);
      })
      .catch(() => setCardData([]))
      .finally(() => setLoading(false));
  }, [baseURL]);

  return (
    <div>
      <h1>Event Template</h1>
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : cardData.length === 0 ? (
          <Typography>No related documents found.</Typography>
        ) : (
          cardData.map((card, idx) => {
            const colors = chipColor(card.category_name);
            return (
              <Paper
                key={card.id || idx}
                variant="outlined"
                sx={{
                  width: 282,
                  height: 176,
                  p: 2.25,
                  borderRadius: 2.5,
                  borderColor: '#e6eaf2',
                  transition: 'box-shadow .2s ease, transform .1s ease',
                  '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  localStorage.removeItem('pendingFinalizePayload');
                  localStorage.removeItem('tplDraft');
                  localStorage.removeItem('file_name');
                  localStorage.setItem('selectedTemplateId', card.id);
                  if (typeof setShowEventTemplateAfterDownload === 'function') {
                    setShowEventTemplateAfterDownload(false);
                  }
                  if (typeof setIsDownload === 'function') {
                    setIsDownload(false);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  navigate(`/app/drafting/fill/?templateId=${card.id}`);
                }}
              >
                <Stack spacing={1.2} sx={{ width: 206, height: 124, flexGrow: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      color: colors.color,
                      fontSize: '0.75rem',
                      textAlign: 'left',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {card.category_name}
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'Inter, sans-serif',
                      color: '#111827',
                      fontWeight: 600,
                      fontSize: { xs: '1rem', md: '1.125rem' },
                      lineHeight: 1.3,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: 46,
                      textAlign: 'left',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {card.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Roboto, sans-serif',
                      color: 'text.secondary',
                      fontWeight: 400,
                      fontSize: '0.875rem',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      minHeight: 38,
                      textAlign: 'left',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {card.description}
                  </Typography>
                </Stack>
              </Paper>
            );
          })
        )}
      </Box>
    </div>
  );
};

export default EventTemplate;