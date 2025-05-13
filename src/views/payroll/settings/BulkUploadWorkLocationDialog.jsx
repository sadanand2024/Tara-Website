import React, { useRef, useState } from 'react';
import { Button, Box, Stack, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Paper, Link } from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

export default function BulkUploadWorkLocationDialog({ open, handleClose, fetchWorkLocations, payrollid }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [duplicateHandling, setDuplicateHandling] = useState('overwrite');
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const handleDownload = (type) => {
    const url = `/payroll/work-locations/template/?type=${type}`;
    Factory('get', url, {}, 'blob').then(({ res }) => {
      const blob = new Blob([res], {
        type: type === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `work_locations_template.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && !selected.name.match(/\.(xlsx|xls|csv)$/)) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please upload only Excel or CSV files.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }
    setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      dispatch(
        openSnackbar({ open: true, message: 'Please select a file to upload.', variant: 'alert', alert: { color: 'error' }, close: false })
      );
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('payroll_id', payrollid);
    formData.append('duplicate_handling', duplicateHandling);
    try {
      const url = `/payroll/work-locations/upload/`;
      const { res } = await Factory('post', url, formData, null, true);
      if (res?.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Work locations uploaded successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        fetchWorkLocations();
        handleClose();
      } else {
        throw new Error(res?.data?.message || 'Upload failed');
      }
    } catch (error) {
      dispatch(
        openSnackbar({
          open: true,
          message: error.message || 'Error uploading file',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  return (
    <Modal
      open={open}
      showClose={true}
      handleClose={handleClose}
      maxWidth="sm"
      header={{ title: 'Bulk Upload Work Locations', subheader: '' }}
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={handleClose} variant="outlined" color="error" disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>
      }
    >
      <Box p={2}>
        <Typography mb={2}>
          Download a sample{' '}
          <Link component="button" onClick={() => handleDownload('csv')}>
            .csv format
          </Link>{' '}
          or{' '}
          <Link component="button" onClick={() => handleDownload('xls')}>
            .xls format
          </Link>{' '}
          file and compare it with your import file to ensure that the file is ready to import.
        </Typography>
        <Paper
          variant="outlined"
          sx={{ p: 3, mb: 2, textAlign: 'center', borderStyle: 'dashed', cursor: 'pointer' }}
          onClick={() => fileInputRef.current?.click()}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: 'grey.500' }} />
          <Typography mt={1} mb={1}>
            {file ? file.name : 'Drop files here or click here to upload'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maximum File Size: 5 MB | File Format: CSV or XLS
          </Typography>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.xls,.csv" style={{ display: 'none' }} />
        </Paper>
        <Box mb={2}>
          <FormLabel>How should duplicate entries be handled?*</FormLabel>
          <RadioGroup row value={duplicateHandling} onChange={(e) => setDuplicateHandling(e.target.value)}>
            <FormControlLabel value="skip" control={<Radio />} label="Skip" />
            <FormControlLabel value="overwrite" control={<Radio />} label="Overwrite" />
          </RadioGroup>
        </Box>
        <Button component="a" href="/templates/WorkLocationsfile.xlsx" download>
          Download Excel Template
        </Button>
      </Box>
    </Modal>
  );
}
