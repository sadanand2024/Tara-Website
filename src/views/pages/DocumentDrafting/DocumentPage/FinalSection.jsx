import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Grid2 from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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


const FinalSection = () => {
  const baseURL = import.meta.env.VITE_APP1_BASE_URL;

  const [category, setCategory] = useState('all'); // logical state
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState(null);

  const navigate = useNavigate();

  // ----- fetch categories -----
  useEffect(() => {
    setCategoriesLoading(true);
    setCategoriesError(null);
    axios
      .get(`${baseURL}/documentdrafting/categories-name/`)
      .then((res) => {
        let data = res.data?.data;
        if (!Array.isArray(data)) {
          data = typeof data === 'object' && data ? Object.values(data) : [];
        }
        if (data.length && typeof data[0] === 'string') {
          data = data.map((str) => ({ key: String(str).toLowerCase().trim(), label: str }));
        } else if (data.length && typeof data[0] === 'object') {
          data = data.map((obj) => ({
            key: (obj.key || obj.label || obj.name || '').toString().toLowerCase().trim(),
            label: obj.label || obj.name || obj.key || ''
          }));
        }
        setCategories(data);
        setCategoriesLoading(false);
      })
      .catch(() => {
        setCategoriesError('Failed to load categories');
        setCategoriesLoading(false);
      });
  }, [baseURL]);

  // ----- fetch templates -----
  useEffect(() => {
    let mounted = true;
    axios
      .get(`${baseURL}/documentdrafting/documents/`)
      .then((res) => {
        const data = res.data;
        const templatesList = Array.isArray(data) ? data : data?.results || [];
        const transformed = templatesList.map((item, idx) => ({
          id: item.id ?? idx,
          title: item.document_name || item.name || item.title || 'Untitled Document',
          popular: item.is_popular || item.popular || false,
          category_name: item.category_name || '',
          template: item.template || '',
          description:
            item.description ||
            'a formal, legally binding document from an employer to a job candidate that confirms'
        }));
        if (mounted) {
          setTemplates(transformed);
          setLoading(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setTemplates([]);
          setLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, [baseURL]);

  // ----- compute a safe select value that always exists -----
  const keys = new Set(categories.map((c) => c.key));
  const selectValue = keys.has(category) ? category : 'all';

  // Normalize category whenever options change (prevents out-of-range)
  useEffect(() => {
    if (category !== 'all' && !keys.has(category)) {
      setCategory('all');
    }
  }, [category, keys]);

  const filtered = templates.filter((t) => {
    const byCategory =
      selectValue === 'all'
        ? true
        : t.category_name && t.category_name.toLowerCase() === selectValue.toLowerCase();
    const bySearch = t.title.toLowerCase().includes(search.toLowerCase());
    return byCategory && bySearch;
  });
  const limitedTemplates = filtered.slice(0, 8);

  const handleCardClick = (tpl) => {
    try {
      localStorage.setItem('selectedTemplateId', String(tpl.id));
      const target = `/app/drafting/fill/?templateId=${encodeURIComponent(tpl.id)}`;
      localStorage.setItem('postLoginRedirect', target);
      navigate(target);
    } catch {
      navigate(`/app/drafting/fill/?templateId=${encodeURIComponent(tpl.id)}`);
    }
  };

  return (
    <Box
      sx={{
        mt: 0,
        position: 'relative',
        zIndex: 2,
        width: '100vw',
        left: '50%',
        right: '50%',
        ml: '-50vw',
        mr: '-50vw',
        overflow: 'hidden',
        bgcolor: '#f0f4ff'
      }}
    >
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 6 } }}>
        {/* Controls */}
        <Grid2 container spacing={2} alignItems="center" sx={{ mb: { xs: 2.5, md: 3.5 } }}>
          <Grid2 size={{ xs: 12, md: 2.5 }}>
            <Select
              fullWidth
              value={selectValue}                  
              onChange={(e) => setCategory(e.target.value)}
              displayEmpty
              renderValue={(val) => {
                if (val === '') return 'Select category';
                if (val === 'all') return 'All';      {/* ✅ show All label */}
                return categories.find((c) => c.key === val)?.label || 'Select category';
              }}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                fontFamily: 'Inter',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                fontWeight: 400,
                color: '#64748B',
                '& .MuiSelect-select': {
                  padding: '12px 14px',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontFamily: 'Roboto, sans-serif',
                  fontWeight: 500,
                  color: '#64748B'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E2E8F0',
                  borderWidth: '1px'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#CBD5E0'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#3182CE',
                  borderWidth: '2px'
                }
              }}
            >
              {/* ✅ Always present "All" option solves out-of-range on first render */}
              <MenuItem value="all">
                <em>All</em>
              </MenuItem>

              {categoriesLoading && <MenuItem disabled>Loading...</MenuItem>}
              {categoriesError && <MenuItem disabled>{categoriesError}</MenuItem>}

              {!categoriesLoading &&
                !categoriesError &&
                categories
                  .filter((c) => c.key && c.key !== 'all')
                  .map((c) => (
                    <MenuItem
                      key={c.key}
                      value={c.key}
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: { xs: '0.875rem', sm: '1rem' },
                        fontWeight: 400,
                        color: '#374151',
                        '&:hover': { bgcolor: '#F3F4F6' },
                        '&.Mui-selected': {
                          bgcolor: '#EBF8FF',
                          color: '#3182CE',
                          '&:hover': { bgcolor: '#EBF8FF' }
                        }
                      }}
                    >
                      {c.label}
                    </MenuItem>
                  ))}
            </Select>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <TextField
              fullWidth
              placeholder='Enter search term, For ex "Legal Agreement"'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                transition: 'all 0.3s ease-in-out',
                transform: 'scale(1)',
                '& .MuiInputBase-root': { transition: 'all 0.3s ease-in-out' },
                '& .MuiInputBase-input': {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 500,
                  color: '#374151',
                  padding: '12px 14px',
                  transition: 'all 0.3s ease-in-out'
                },
                '& .MuiInputBase-input::placeholder': {
                  fontFamily: 'Roboto, sans-serif',
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 500,
                  color: '#64748B',
                  opacity: 1,
                  transition: 'all 0.3s ease-in-out'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#E2E8F0',
                  borderWidth: '1px',
                  transition: 'all 0.3s ease-in-out'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#CBD5E0',
                  transform: 'scale(1.01)'
                },
                '&.Mui-focused': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 4px 20px rgba(49, 130, 206, 0.15)',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3182CE',
                    borderWidth: '2px',
                    boxShadow: '0 0 0 3px rgba(49, 130, 206, 0.1)'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    opacity: 0.7,
                    transform: 'translateY(-2px)'
                  }
                },
                '& .MuiInputAdornment-root': {
                  color: '#64748B',
                  transition: 'all 0.3s ease-in-out'
                },
                '&.Mui-focused .MuiInputAdornment-root': {
                  color: '#3182CE',
                  transform: 'scale(1.1)'
                }
              }}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 1.5 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                height: 40,
                borderRadius: 2,
                fontWeight: 400,
                fontSize: { xs: '0.95rem', sm: '1rem' },
                textTransform: 'none',
                fontFamily: 'Inter',
                backgroundColor: '#0023AF',
                color: '#FFFFFF',
                '&:hover': {
                  backgroundColor: '#001A8A',
                  boxShadow: '0 4px 12px rgba(0, 35, 175, 0.3)'
                },
                '&:active': { backgroundColor: '#001470' }
              }}
              onClick={() => console.log('AI Search', { category: selectValue, search })}
            >
              AI Search
            </Button>
          </Grid2>
        </Grid2>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : filtered.length === 0 ? (
          <Typography sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
            No templates found.
          </Typography>
        ) : (
          <Grid2 container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
            {limitedTemplates.map((t) => {
              const colors = chipColor(t.category_name);
              return (
                <Grid2 key={t.id} size={{ xs: 12, sm: 6, md: 3, lg: 3 }}>
                  <Paper
                    variant="outlined"
                    onClick={() => handleCardClick(t)}
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
                      cursor: 'pointer'
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
                          letterSpacing: '0.02em'
                        }}
                      >
                        {t.category_name}
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
                          letterSpacing: '-0.01em'
                        }}
                      >
                        {t.title}
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
                          letterSpacing: '0.01em'
                        }}
                      >
                        {t.description}
                      </Typography>
                    </Stack>
                  </Paper>
                </Grid2>
              );
            })}
          </Grid2>
        )}
      </Container>
    </Box>
  );
};

export default FinalSection;
