'use client';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Box,
  TextField,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import Factory from '@/utils/Factory';
import { useSnackbar } from '@/components/CustomSnackbar';

function ViewSlabs({ viewSlabsDialog, setViewSlabsDialog, selectedRecord, setSelectedRecord, get_pt_Details, payrollid }) {
  const [ptin, setPtin] = useState('');
  const { showSnackbar } = useSnackbar();

  const save_func = async () => {
    if (!ptin) {
      showSnackbar('Please Enter PTIN before Saving', 'error');
      return;
    }

    const url = `/payroll/pt/${selectedRecord.id}`;
    let postData = {
      payroll: payrollid,
      pt_number: ptin,
      work_location: selectedRecord.work_location
    };
    const { res, error } = await Factory('put', url, postData);

    if (res?.status_cd === 0) {
      setViewSlabsDialog(false);
      get_pt_Details(payrollid);
    } else {
      showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    }
  };
  useEffect(() => {
    if (selectedRecord) {
      setPtin(selectedRecord.pt_number);
    }
  }, [selectedRecord]);
  return (
    <Modal
      open={viewSlabsDialog}
      maxWidth={ModalSize.MD}
      header={{ title: 'Professional Tax Slabs', subheader: '' }}
      modalContent={
        <Box sx={{ padding: 2 }}>
          <Box>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body1">
                <strong>Work Location Name:</strong> {selectedRecord?.work_location_name}
              </Typography>
              <Typography variant="body1">
                <strong>State:</strong> {selectedRecord?.state}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body1">
                <strong>PTIN:</strong>
              </Typography>
              <TextField
                value={ptin || ''}
                onChange={(e) => {
                  const input = e.target.value;
                  if (/^\d{0,10}$/.test(input)) {
                    setPtin(input);
                  }
                }}
                size="small"
                sx={{ ml: 1 }}
                error={ptin?.length > 0 && (ptin?.length < 6 || ptin?.length > 10)}
                helperText={ptin?.length > 0 && (ptin?.length < 6 || ptin?.length > 10) ? 'PTIN must be 6-10 digits' : ''}
              />
            </Box>

            <TableContainer component={Paper} sx={{ mt: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Monthly Gross Salary (₹)</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Monthly Tax Amount (₹)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedRecord?.slab?.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item['Monthly Salary (₹)']}</TableCell>
                      <TableCell>{item['Professional Tax (₹ per month)']}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      }
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setViewSlabsDialog(false);
              setSelectedRecord(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              save_func();
            }}
          >
            Save
          </Button>
        </Stack>
      }
    />
  );
}

export default ViewSlabs;
