import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
    Box,
    Button,
    Card, CardContent,
    Chip,
    CircularProgress,
    Grid,
    IconButton,
    Paper,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Typography
} from '@mui/material';
import React from 'react';

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

const SelectedEvent = ({
  eventName = 'Company Incorporation',
  createdOn = '03/07/2025',
  status = 'In progress',
  progress = { completed: 3, total: 5 },
  documents = [
    { id: 1, document_name: 'Articles of Association', template: 'Template', status: 'Processed', lastEdited: '23/12/22' },
    { id: 2, document_name: 'Agreement', template: 'Template', status: 'Completed', lastEdited: '23/12/22' },
    { id: 3, document_name: 'Statutory Declaration', template: 'Template', status: 'Declined', lastEdited: '23/12/22' },
    { id: 4, document_name: 'Payment of fees', template: 'Template', status: 'Declined', lastEdited: '23/12/22' },
  ],
  onBack
}) => {
  return (
    <Box sx={{ p: 4 }}>
      {/* Breadcrumb */}
      <Typography variant="body2" color="text.secondary" mb={1}>
        <b>Document Drafting</b> &gt; <b>Event Creation</b> &gt; <b>{eventName}</b>
      </Typography>

      {/* Title and Back Button */}
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight={700}>Document Drafting</Typography>
        <Button variant="outlined" onClick={onBack}>Back to Dashboard</Button>
      </Box>

      {/* Summary Card */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Typography color="text.secondary" fontWeight={500}>Event Name</Typography>
              <Typography fontWeight={600}>{eventName}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography color="text.secondary" fontWeight={500}>Created On</Typography>
              <Typography fontWeight={600}>{createdOn}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography color="text.secondary" fontWeight={500}>Status</Typography>
              <Chip
                label={status}
                sx={{
                  ...statusColor(status),
                  fontWeight: 600,
                  px: 2,
                  fontSize: 16,
                  borderRadius: 2,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <Typography color="text.secondary" fontWeight={500}>Progress</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress
                  variant="determinate"
                  value={(progress.completed / progress.total) * 100}
                  size={28}
                  thickness={5}
                  sx={{ color: '#1976d2', mr: 1 }}
                />
                <Typography fontWeight={600}>{progress.completed}/{progress.total} Docs Completed</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Documents Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Document Name</TableCell>
              <TableCell>Template</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Edited</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.document_name}</TableCell>
                <TableCell>
                  <Chip label="Template" sx={{ bgcolor: '#1976d2', color: '#fff', fontWeight: 600, px: 2, borderRadius: 2 }} />
                </TableCell>
                <TableCell>
                  <Chip
                    label={doc.status}
                    sx={{
                      ...statusColor(doc.status),
                      fontWeight: 600,
                      px: 2,
                      borderRadius: 2,
                    }}
                  />
                </TableCell>
                <TableCell>{doc.lastEdited}</TableCell>
                <TableCell>
                  {doc.status === 'Processed' || doc.status === 'Completed' ? (
                    <Button variant="contained" size="small" endIcon={<EditIcon />} sx={{ bgcolor: '#1976d2', color: '#fff', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                      Start Drafting
                    </Button>
                  ) : doc.status === 'Declined' ? (
                    <Button variant="outlined" size="small" sx={{ color: '#D32F2F', borderColor: '#D32F2F', borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                      Continue
                    </Button>
                  ) : (
                    <IconButton>
                      <VisibilityIcon />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SelectedEvent;
