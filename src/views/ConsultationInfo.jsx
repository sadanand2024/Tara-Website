import React, { useState, useEffect } from 'react';
import { Box, Grid2, Card, CardContent, Avatar, Typography, Button, Stack, Pagination, IconButton, Paper, InputBase } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Delete from '@mui/icons-material/Delete';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SearchIcon from '@mui/icons-material/Search';
import Factory from '../utils/factory';

const PAGE_SIZE = 8;

const ConsultationInfo = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const response = await Factory('get', '/user_management/list-consultations/');
      if (response.res.status_cd === 0) {
        setData(response.res.data);
      } else {
        console.log(response.res.message);
      }
    };
    fetchData();
  }, []);

  const contacts = data.length > 0 ? data : [];

  const filtered = contacts.filter(
    (info) =>
      (info.name && info.name.toLowerCase().includes(search.toLowerCase())) ||
      (info.email && info.email.toLowerCase().includes(search.toLowerCase())) ||
      (info.mobile_number && info.mobile_number.toLowerCase().includes(search.toLowerCase()))
  );
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box sx={{ background: '#f7f8fa', minHeight: '100vh', p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper sx={{ maxWidth: '100%', borderRadius: 3, p: 0, mx: 'auto', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2, borderBottom: '1px solid #eee' }}>
          <Typography variant="h3" fontWeight={600}>
            Consultation Info
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              background: '#f7f8fa',
              borderRadius: 2,
              px: 1,
              py: 0.5,
              border: '1px solid #e3e3e3'
            }}
          >
            <InputBase
              placeholder="Search by name, mobile, email"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              sx={{ ml: 1, flex: 1, fontSize: 16 }}
            />
            <IconButton size="small" sx={{ color: '#888' }}>
              <SearchIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
          <Grid2 container spacing={3}>
            {paginated.map((info, idx) => (
              <Grid2 size={{ xs: 12, sm: 12, md: 6, lg: 3, xl: 3 }} key={info.id || info.email + idx}>
                <Card
                  sx={{
                    height: '400px',
                    border: '1px solid #e3e3e3',
                    backgroundColor: '#f8fafc',
                    boxShadow: 'none',
                    borderRadius: 2,
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }
                  }}
                >
                  <IconButton sx={{ position: 'absolute', top: 8, right: 8 }}>
                    <MoreVertIcon />
                  </IconButton>

                  <CardContent
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      height: '100%',
                      paddingBottom: '16px !important'
                    }}
                  >
                    <Stack spacing={2} sx={{ flexGrow: 1 }}>
                      {/* Avatar & Name */}
                      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                        <Avatar
                          alt={info.name}
                          sx={{
                            width: 56,
                            height: 56,
                            bgcolor: 'primary.light',
                            fontSize: '1.5rem',
                            fontWeight: 600
                          }}
                        >
                          {info.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h4" fontWeight={600}>
                            {info.name}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Message */}
                      <Typography variant="body2" color="text.secondary">
                        {info.message}
                      </Typography>

                      {/* Email */}
                      <Box>
                        <Typography variant="body2" mb={0.5}>
                          <b>Email</b>
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1976d2' }}>
                          {info.email}
                        </Typography>
                      </Box>

                      {/* Mobile & Date/Time */}
                      <Stack direction="row" spacing={2}>
                        <Typography variant="body2">
                          <b>Mobile</b>
                          <br />
                          {info.mobile_number}
                        </Typography>
                        <Typography variant="body2">
                          <b>Date & Time</b>
                          <br />
                          {info.created_date} {info.created_time}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={2} mt={2}>
                      <Button variant="outlined" startIcon={<ChatBubbleOutlineIcon />} sx={{ flex: 1 }}>
                        Reviewed
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        sx={{
                          flex: 1,
                          borderColor: '#f44336',
                          color: '#f44336',
                          '&:hover': { bgcolor: '#fdecea' }
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
          <Stack alignItems="center" mt={4}>
            <Pagination count={pageCount} page={page} onChange={(_, value) => setPage(value)} color="primary" />
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default ConsultationInfo;
