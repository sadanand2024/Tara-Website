import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Stack,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import Factory from 'utils/Factory';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const ViewSlabs = ({ viewSlabsDialog, setViewSlabsDialog, selectedRecord, setSelectedRecord, get_pt_Details, payrollid }) => {
  const [ptin, setPtin] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedRecord) {
      setPtin(selectedRecord.pt_number || '');
    }
  }, [selectedRecord]);

  const savePTIN = async () => {
    if (!ptin || ptin.length < 6 || ptin.length > 10) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'PTIN must be between 6-10 digits.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    const postData = {
      payroll: payrollid,
      pt_number: ptin,
      work_location: selectedRecord.work_location
    };

    const { res } = await Factory('put', `/payroll/pt/${selectedRecord.id}`, postData);

    if (res?.status_cd === 0) {
      showSnackbar('PTIN Updated Successfully', 'success');
      setViewSlabsDialog(false);
      setSelectedRecord(null);
      get_pt_Details(payrollid);
    } else {
      showSnackbar(JSON.stringify(res?.data?.data || 'Unknown Error'), 'error');
    }
  };

  return (
    <Modal
      open={viewSlabsDialog}
      maxWidth={'md'}
      showClose={true}
      handleClose={() => {
        setViewSlabsDialog(false);
        setSelectedRecord(null);
      }}
      header={{ title: 'Professional Tax Slabs', subheader: '' }}
      footer={
        <Stack direction="row" justifyContent="space-between" sx={{ width: 1, gap: 2 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setViewSlabsDialog(false);
              setSelectedRecord(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" color="primary" onClick={savePTIN}>
            Save
          </Button>
        </Stack>
      }
    >
      <Box sx={{ padding: 2 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body1">
              <strong>Work Location:</strong> {selectedRecord?.work_location_name || '-'}
            </Typography>
            <Typography variant="body1">
              <strong>State:</strong> {selectedRecord?.state || '-'}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body1">
              <strong>PTIN:</strong>
            </Typography>
            <TextField
              value={ptin}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d{0,10}$/.test(val)) setPtin(val);
              }}
              size="small"
              sx={{ maxWidth: 200 }}
              error={ptin.length > 0 && (ptin.length < 6 || ptin.length > 10)}
              helperText={ptin.length > 0 && (ptin.length < 6 || ptin.length > 10) ? '6-10 digits allowed' : ''}
            />
          </Stack>
          {console.log(selectedRecord)}
          <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Monthly Salary Range (₹)</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Monthly Tax Amount (₹)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedRecord?.slab?.length > 0 ? (
                  selectedRecord.slab.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{item['Monthly Salary (₹)'] || '-'}</TableCell>
                      <TableCell>{item['Professional Tax (₹ per month)'] || '-'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      No Slab Data Available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Box>
    </Modal>
  );
};

export default ViewSlabs;
