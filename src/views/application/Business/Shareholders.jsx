import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PieChartIcon from '@mui/icons-material/PieChart';

const shareholders = [
  {
    id: 1,
    name: 'John Doe',
    shares: 5000,
    percentage: 50,
    type: 'Promoter',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    shares: 3000,
    percentage: 30,
    type: 'Individual',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Tech Ventures Ltd',
    shares: 2000,
    percentage: 20,
    type: 'Corporate',
    status: 'Active'
  }
];

const Shareholders = () => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Shareholders</Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<PieChartIcon />}
          >
            View Distribution
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
          >
            Add Shareholder
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Shareholding Pattern</Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Promoter Holding
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={50} 
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="body2">50%</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Individual Holding
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={30} 
                      color="secondary"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="body2">30%</Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      Corporate Holding
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={20} 
                      color="warning"
                      sx={{ height: 8, borderRadius: 1 }}
                    />
                    <Typography variant="body2">20%</Typography>
                  </Stack>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Number of Shares</TableCell>
                      <TableCell>Percentage</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {shareholders.map((shareholder) => (
                      <TableRow key={shareholder.id}>
                        <TableCell>{shareholder.name}</TableCell>
                        <TableCell>{shareholder.shares.toLocaleString()}</TableCell>
                        <TableCell>{shareholder.percentage}%</TableCell>
                        <TableCell>
                          <Chip
                            label={shareholder.type}
                            color={
                              shareholder.type === 'Promoter' 
                                ? 'primary' 
                                : shareholder.type === 'Individual'
                                ? 'secondary'
                                : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={shareholder.status}
                            color="success"
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton size="small" color="primary">
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error">
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        * Total number of shares: 10,000
      </Typography>
    </Box>
  );
};

export default Shareholders; 