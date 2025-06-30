import React, { useRef, useState } from 'react';
import { Button, Box, Stack, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Paper, Link } from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

export default function BulkUploadDialog({ open, handleClose, getData, payrollid, bulkUploadUrl, xlsxTemplateUrl, csvTemplateUrl, type }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [duplicateHandling, setDuplicateHandling] = useState('overwrite');
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

  const handleDownload = async (type) => {
    const url = type === 'csv' ? csvTemplateUrl : xlsxTemplateUrl;

    const { res, error } = await Factory('get', url, null, {}, { responseType: 'blob' });

    if (error || !res?.data) {
      dispatch(
        openSnackbar({
          open: true,
          message: (error && error.message) || 'Error downloading file',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    const blob = new Blob([res.data], {
      type: type === 'csv' ? 'text/csv' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${type}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected) {
      if (!selected.name.match(/\.(xlsx|csv)$/)) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Please upload only .xlsx or .csv files. .xls is not supported.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      if (selected.size > MAX_FILE_SIZE) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'The selected file is too large. Maximum file size is 15 MB.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      setFile(selected);
    }
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];

    if (droppedFile) {
      if (!droppedFile.name.match(/\.(xlsx|csv)$/)) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Please upload only .xlsx or .csv files. .xls is not supported.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      if (droppedFile.size > MAX_FILE_SIZE) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'The selected file is too large. Maximum file size is 15 MB.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      setFile(droppedFile);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUpload = async () => {
    if (!file) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select a file to upload.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('payroll_id', payrollid);
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }

    try {
      const url = bulkUploadUrl;
      const { res } = await Factory('post', url, formData, null, true);
      console.log(res);
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
        getData();
        // ✅ Delay closure just a tick to ensure UI state is cleared
        setTimeout(() => {
          handleClose();
        }, 50);
      } else {
        throw new Error(JSON.stringify(res.data?.data?.errors || res.data?.data?.error) || 'Upload failed');
      }
    } catch (error) {
      console.log(error);
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
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <Modal
      open={open}
      showClose={true}
      handleClose={handleClose}
      maxWidth="sm"
      title={`Bulk Upload ${type}`}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button onClick={handleClose} variant="outlined" color="error" disabled={uploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </Stack>
      }
    >
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle1" color="text.secondary" mb={2}>
          Download a sample{' '}
          <Link component="button" onClick={() => handleDownload('csv')}>
            .csv format
          </Link>{' '}
          or{' '}
          <Link component="button" onClick={() => handleDownload('xlsx')}>
            .xls format
          </Link>{' '}
          file and compare it with your import file to ensure that the file is ready to import.
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            p: 3,
            mb: 2,
            textAlign: 'center',
            borderStyle: 'dashed',
            cursor: 'pointer',
            backgroundColor: '#fafafa'
          }}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography mt={1} mb={1}>
            {file ? file.name : 'Drop files here or click here to upload'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Maximum File Size: 15 MB | File Format: CSV or XLSX
          </Typography>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.csv" style={{ display: 'none' }} />
        </Paper>
      </Box>
    </Modal>
  );
}
