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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const personnel = [
  {
    id: 1,
    name: 'John Doe',
    designation: 'Director',
    din: 'DIN12345678',
    role: 'Executive',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    designation: 'CFO',
    din: 'DIN87654321',
    role: 'KMP',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Mike Johnson',
    designation: 'Company Secretary',
    din: 'DIN45678912',
    role: 'KMP',
    status: 'Active'
  }
];

const KeyManagerialPersonnel = () => {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">Key Managerial Personnel</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Personnel
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Designation</TableCell>
                  <TableCell>DIN/PAN</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {personnel.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.designation}</TableCell>
                    <TableCell>{person.din}</TableCell>
                    <TableCell>
                      <Chip
                        label={person.role}
                        color={person.role === 'Executive' ? 'primary' : 'secondary'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={person.status}
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

      <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
        * KMP - Key Managerial Personnel as per Companies Act, 2013
      </Typography>
    </Box>
  );
};

export default KeyManagerialPersonnel; 