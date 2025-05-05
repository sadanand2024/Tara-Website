import React, { useState } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Button,
  Select,
  MenuItem,
  Typography,
  Chip,
  Box
} from '@mui/material';
import dayjs from 'dayjs';
import MainCard from '../../../ui-component/cards/MainCard';
import CustomInput from 'utils/CustomInput';
import CustomDatePicker from 'utils/CustomDateInput';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';

const TABLE_HEADERS = ['Compliance Type', 'Due Date', 'Status', 'Filing Date', 'Reference Number'];

const MOCK_DATA = [
  { complianceType: 'EPF', dueDate: '25-04-2025', status: 'Filed', filingDate: '2025-04-10', referenceNumber: 'REF12345' },
  { complianceType: 'ESI', dueDate: '22-04-2025', status: 'Pending', filingDate: null, referenceNumber: null },
  { complianceType: 'PT', dueDate: '12-05-2025', status: 'Filed', filingDate: '2025-04-22', referenceNumber: 'REF67890' },
  { complianceType: 'TDS', dueDate: '15-05-2025', status: 'Pending', filingDate: null, referenceNumber: null }
];

export default function ComplianceSummary() {
  const [data, setData] = useState(MOCK_DATA);

  const handleInputChange = (index, field, value) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    setData(updatedData);
  };

  const handleSave = (index) => {
    const updatedRecord = data[index];
    console.log('Saving record:', updatedRecord);
    // Here you would call an API to save the record
    // showSnackbar('Record saved successfully!', 'success');
  };

  const isSaveDisabled = (item) => !item.filingDate || !item.referenceNumber;

  return (
    <MainCard title="Compliance Summary">
      <Stack spacing={3}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {TABLE_HEADERS.map((header, idx) => (
                  <TableCell key={idx} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {header}
                  </TableCell>
                ))}
                <TableCell sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={TABLE_HEADERS.length + 1} sx={{ height: 300 }}>
                    <EmptyDataPlaceholder title="No Compliance Data" subtitle="Start by adding a new compliance record." />
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.complianceType}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>
                      <Chip
                        label={item.status}
                        size="small"
                        color={item.status === 'Filed' ? 'success' : item.status === 'Pending' ? 'warning' : 'error'}
                      />
                      <Box mt={1}>
                        <Select
                          value={item.status || ''}
                          onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                          displayEmpty
                          size="small"
                          sx={{ mt: 0.5, minWidth: 120 }}
                        >
                          {['Overdue', 'Pending', 'Filed'].map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <CustomDatePicker
                        views={['year', 'month', 'day']}
                        value={item.filingDate ? dayjs(item.filingDate) : null}
                        onChange={(date) => handleInputChange(index, 'filingDate', date?.format('YYYY-MM-DD'))}
                      />
                    </TableCell>
                    <TableCell>
                      <CustomInput
                        value={item.referenceNumber || ''}
                        onChange={(e) => handleInputChange(index, 'referenceNumber', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="contained" size="small" disabled={isSaveDisabled(item)} onClick={() => handleSave(index)}>
                        Save
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </MainCard>
  );
}
