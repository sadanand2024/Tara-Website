import React, { useRef, useState } from 'react';
import { Button, Box, Stack, Typography, Radio, RadioGroup, FormControlLabel, FormLabel, Paper, Link, LinearProgress } from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

export default function BulkUploadDialog({ open, handleClose, getData, payrollid, bulkUploadUrl, xlsxTemplateUrl, csvTemplateUrl, type }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [salaryFile, setSalaryFile] = useState(null);
  const [duplicateHandling, setDuplicateHandling] = useState('overwrite');
  const [currentStep, setCurrentStep] = useState(1); // 1: Employee upload, 2: Salary upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);
  const salaryFileInputRef = useRef(null);
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

  const handleSalaryTemplateDownload = async () => {
    const url = `/payroll/employee-salary-template/${payrollid}/`;

    const { res, error } = await Factory('get', url, null, {}, { responseType: 'blob' });

    if (error || !res?.data) {
      dispatch(
        openSnackbar({
          open: true,
          message: (error && error.message) || 'Error downloading salary template file',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', 'salary_template.xlsx');
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

  const handleSalaryFileChange = (e) => {
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

      setSalaryFile(selected);
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

  const handleSalaryDrop = (e) => {
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

      setSalaryFile(droppedFile);
    }

    if (salaryFileInputRef.current) {
      salaryFileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const uploadEmployeeData = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('payroll_id', payrollid);

    const url = bulkUploadUrl;
    const { res } = await Factory('post', url, formData, null, true);
    // Check if the response indicates success (status_cd === 0) or if there are validation errors
    if (res?.status_cd === 0) {
      setUploadProgress(50);
      return { success: true, data: res.data };
    } else if (res?.data?.data?.errors && res?.data?.data?.errors.length > 0) {
      // Handle validation errors from the API
      const errorMessages = res.data.data.errors.join('\n');
      throw new Error(`Upload completed with errors:\n${errorMessages}`);
    } else {
      throw new Error(JSON.stringify(res.data?.data?.errors || res.data?.data?.error) || 'Employee upload failed');
    }
  };

  const uploadSalaryData = async () => {
    const formData = new FormData();
    formData.append('file', salaryFile);
    formData.append('payroll_id', payrollid);

    const url = '/payroll/employee-salary-bulk-upload/';
    const { res } = await Factory('post', url, formData, null, true);

    // Check if the response indicates success (status_cd === 0) or if there are validation errors
    if (res?.status_cd === 0) {
      setUploadProgress(100);
      return { success: true, data: res.data };
    } else if (res?.data?.data?.errors && res?.data?.data?.errors.length > 0) {
      // Handle validation errors from the API
      const errorMessages = res.data.data.errors.join('\n');
      throw new Error(`Salary upload completed with errors:\n${errorMessages}`);
    } else {
      throw new Error(JSON.stringify(res.data?.data?.errors || res.data?.data?.error) || 'Salary upload failed');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select an employee file to upload.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    if (currentStep === 2 && !salaryFile) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please select a salary template file to upload.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Step 1: Upload employee data
      if (currentStep === 1) {
        setUploadProgress(25);
        await uploadEmployeeData();

        dispatch(
          openSnackbar({
            open: true,
            message: 'Employee data uploaded successfully! Now please upload salary template data.',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );

        setCurrentStep(2);
        setUploading(false);
        return;
      }

      // Step 2: Upload salary data
      if (currentStep === 2) {
        setUploadProgress(75);
        await uploadSalaryData();

        dispatch(
          openSnackbar({
            open: true,
            message: 'Salary template data uploaded successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );

        getData();
        // Reset and close
        setTimeout(() => {
          handleClose();
          resetDialog();
        }, 50);
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

      // Clear uploaded data on error
      if (currentStep === 1) {
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else if (currentStep === 2) {
        setSalaryFile(null);
        if (salaryFileInputRef.current) {
          salaryFileInputRef.current.value = '';
        }
      }
    } finally {
      setUploading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setSalaryFile(null);
    setCurrentStep(1);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (salaryFileInputRef.current) {
      salaryFileInputRef.current.value = '';
    }
  };

  const handleCloseDialog = () => {
    // Prevent closing if we're on step 2 (salary upload step)
    if (currentStep === 2) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Please complete the salary template upload to finish the process.',
          variant: 'alert',
          alert: { color: 'warning' },
          close: false
        })
      );
      return;
    }
    resetDialog();
    handleClose();
  };

  const renderStepContent = () => {
    if (currentStep === 1) {
      return (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Step 1: Download a sample{' '}
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
              {file ? file.name : 'Drop employee file here or click here to upload'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum File Size: 15 MB | File Format: XLSX
            </Typography>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.csv" style={{ display: 'none' }} />
          </Paper>
        </Box>
      );
    }

    if (currentStep === 2) {
      return (
        <Box sx={{ mt: 1 }}>
          <Typography variant="subtitle1" color="text.secondary" mb={2}>
            Step 2: Download a sample{' '}
            <Link component="button" onClick={handleSalaryTemplateDownload}>
              salary template
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
            onClick={() => salaryFileInputRef.current?.click()}
            onDrop={handleSalaryDrop}
            onDragOver={handleDragOver}
          >
            <CloudUploadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography mt={1} mb={1}>
              {salaryFile ? salaryFile.name : 'Drop salary template file here or click here to upload'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Maximum File Size: 15 MB | File Format: XLSX
            </Typography>
            <input type="file" ref={salaryFileInputRef} onChange={handleSalaryFileChange} accept=".xlsx,.csv" style={{ display: 'none' }} />
          </Paper>
        </Box>
      );
    }
  };

  return (
    <Modal
      open={open}
      showClose={currentStep === 1}
      handleClose={handleCloseDialog}
      maxWidth="sm"
      title={`Bulk Upload ${type} - Step ${currentStep} of 2`}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={handleCloseDialog}
            variant="outlined"
            color="error"
            disabled={uploading || currentStep === 2}
            sx={{
              opacity: currentStep === 2 ? 0.5 : 1,
              cursor: currentStep === 2 ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleUpload} variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : currentStep === 1 ? 'Upload Employees' : 'Upload Salary Data'}
          </Button>
        </Stack>
      }
    >
      {uploading && (
        <Box sx={{ width: '100%', mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary">
            {uploadProgress}% Complete
          </Typography>
        </Box>
      )}

      {renderStepContent()}

      {currentStep === 2 && (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
          <Typography variant="body2" color="warning.dark" sx={{ fontWeight: 500 }}>
            ⚠️ Please complete the salary template upload to finish the bulk upload process.
          </Typography>
        </Box>
      )}
    </Modal>
  );
}
