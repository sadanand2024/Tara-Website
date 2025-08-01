import React, { useRef, useState } from 'react';
import {
  Button,
  Box,
  Stack,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Paper,
  Link,
  LinearProgress,
  Tabs,
  Tab,
  Alert,
  Chip
} from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

// TabPanel component for MUI tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`bulk-upload-tabpanel-${index}`}
      aria-labelledby={`bulk-upload-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

// Accessibility props for tabs
function a11yProps(index) {
  return {
    id: `bulk-upload-tab-${index}`,
    'aria-controls': `bulk-upload-tabpanel-${index}`
  };
}

export default function BulkUploadDialog({ open, handleClose, getData, payrollid, bulkUploadUrl, xlsxTemplateUrl, csvTemplateUrl, type }) {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [salaryFile, setSalaryFile] = useState(null);
  const [duplicateHandling, setDuplicateHandling] = useState('overwrite');
  const [activeTab, setActiveTab] = useState(0); // 0: Employee upload, 1: Salary upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [employeeUploadCompleted, setEmployeeUploadCompleted] = useState(false);
  const [salaryUploadCompleted, setSalaryUploadCompleted] = useState(false);
  const [employeeUploadError, setEmployeeUploadError] = useState(null);
  const [salaryUploadError, setSalaryUploadError] = useState(null);
  const fileInputRef = useRef(null);
  const salaryFileInputRef = useRef(null);
  const dispatch = useDispatch();
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15 MB

  const handleTabChange = (event, newValue) => {
    // Allow free navigation between tabs
    setActiveTab(newValue);
  };

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
      setEmployeeUploadError(null);
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
      setSalaryUploadError(null);
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
      setEmployeeUploadError(null);
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
      setSalaryUploadError(null);
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

  const handleEmployeeUpload = async () => {
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

    setUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(25);
      await uploadEmployeeData();

      setEmployeeUploadCompleted(true);
      setEmployeeUploadError(null);

      dispatch(
        openSnackbar({
          open: true,
          message: 'Employee data uploaded successfully! Moving to salary upload...',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );

      // Automatically navigate to step 2 after successful upload
      setTimeout(() => {
        setActiveTab(1);
      }, 1000);
    } catch (error) {
      setEmployeeUploadError(error.message);
      dispatch(
        openSnackbar({
          open: true,
          message: error.message || 'Error uploading employee file',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );

      // Clear uploaded data on error
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSalaryUpload = async () => {
    if (!salaryFile) {
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
      setUploadProgress(75);
      await uploadSalaryData();

      setSalaryUploadCompleted(true);
      setSalaryUploadError(null);

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
    } catch (error) {
      setSalaryUploadError(error.message);
      dispatch(
        openSnackbar({
          open: true,
          message: error.message || 'Error uploading salary file',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );

      // Clear uploaded data on error
      setSalaryFile(null);
      if (salaryFileInputRef.current) {
        salaryFileInputRef.current.value = '';
      }
    } finally {
      setUploading(false);
    }
  };

  const resetDialog = () => {
    setFile(null);
    setSalaryFile(null);
    setActiveTab(0);
    setUploadProgress(0);
    setEmployeeUploadCompleted(false);
    setSalaryUploadCompleted(false);
    setEmployeeUploadError(null);
    setSalaryUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (salaryFileInputRef.current) {
      salaryFileInputRef.current.value = '';
    }
  };

  const handleCloseDialog = () => {
    resetDialog();
    handleClose();
  };

  const renderEmployeeUploadTab = () => (
    <Box>
      <Typography variant="subtitle1" color="text.secondary">
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
          cursor: employeeUploadCompleted ? 'default' : 'pointer',
          backgroundColor: employeeUploadCompleted ? '#f0f8f0' : '#fafafa',
          opacity: employeeUploadCompleted ? 0.7 : 1
        }}
        onClick={employeeUploadCompleted ? undefined : () => fileInputRef.current?.click()}
        onDrop={employeeUploadCompleted ? undefined : handleDrop}
        onDragOver={handleDragOver}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: employeeUploadCompleted ? 'success.darker' : 'primary.main' }} />
        <Typography mt={1} mb={1}>
          {file ? file.name : 'Drop employee file here or click here to upload'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Maximum File Size: 15 MB | File Format: XLSX
        </Typography>
        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".xlsx,.csv" style={{ display: 'none' }} />
      </Paper>

      <Button
        onClick={handleEmployeeUpload}
        variant="contained"
        color="primary"
        disabled={uploading || !file || employeeUploadCompleted}
        fullWidth
      >
        {uploading ? 'Uploading...' : employeeUploadCompleted ? 'Uploaded Successfully' : 'Upload Employees'}
      </Button>
    </Box>
  );

  const renderSalaryUploadTab = () => (
    <Box>
      <Typography variant="subtitle1" color="text.secondary">
        Step 2: Download a sample{' '}
        <Link component="button" onClick={handleSalaryTemplateDownload}>
          salary template
        </Link>{' '}
        file and compare it with your import file to ensure that the file is ready to import.
      </Typography>

      {salaryUploadCompleted && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <CheckCircleIcon />
            <Typography>Salary template data uploaded successfully!</Typography>
          </Stack>
        </Alert>
      )}

      {salaryUploadError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography>{salaryUploadError}</Typography>
        </Alert>
      )}

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          mb: 2,
          textAlign: 'center',
          borderStyle: 'dashed',
          cursor: salaryUploadCompleted ? 'default' : 'pointer',
          backgroundColor: salaryUploadCompleted ? '#f0f8f0' : '#fafafa',
          opacity: salaryUploadCompleted ? 0.7 : 1
        }}
        onClick={salaryUploadCompleted ? undefined : () => salaryFileInputRef.current?.click()}
        onDrop={salaryUploadCompleted ? undefined : handleSalaryDrop}
        onDragOver={handleDragOver}
      >
        <CloudUploadIcon sx={{ fontSize: 40, color: salaryUploadCompleted ? 'success.darker' : 'primary.main' }} />
        <Typography mt={1} mb={1}>
          {salaryFile ? salaryFile.name : 'Drop salary template file here or click here to upload'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Maximum File Size: 15 MB | File Format: XLSX
        </Typography>
        <input type="file" ref={salaryFileInputRef} onChange={handleSalaryFileChange} accept=".xlsx,.csv" style={{ display: 'none' }} />
      </Paper>

      <Button
        onClick={handleSalaryUpload}
        variant="contained"
        color="primary"
        disabled={uploading || !salaryFile || salaryUploadCompleted}
        fullWidth
      >
        {uploading ? 'Uploading...' : salaryUploadCompleted ? 'Uploaded Successfully' : 'Upload Salary Data'}
      </Button>
    </Box>
  );

  return (
    <Modal
      open={open}
      showClose={true}
      handleClose={handleCloseDialog}
      maxWidth="sm"
      title={`Bulk Upload ${type}`}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button onClick={handleCloseDialog} variant="outlined" color="error" disabled={uploading}>
            Cancel
          </Button>
          <Stack direction="row" spacing={1}>
            {employeeUploadCompleted && salaryUploadCompleted && (
              <Chip label="All Steps Completed" color="success" icon={<CheckCircleIcon />} variant="outlined" />
            )}
          </Stack>
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

      {/* Tabs */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          mb: 2
        }}
      >
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="bulk upload tabs">
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: 'center' }}>
                <Typography variant="h5">Step 1: Employee Upload</Typography>
                {employeeUploadCompleted && <CheckCircleIcon fontSize="small" />}
              </Stack>
            }
            {...a11yProps(0)}
            disabled={uploading}
          />
          <Tab
            label={
              <Stack direction="row" spacing={1} alignItems="center" sx={{ justifyContent: 'center' }}>
                <Typography variant="h5">Step 2: Salary Upload</Typography>
                {salaryUploadCompleted && <CheckCircleIcon fontSize="small" />}
              </Stack>
            }
            {...a11yProps(1)}
            disabled={uploading}
          />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <TabPanel value={activeTab} index={0}>
        {renderEmployeeUploadTab()}
      </TabPanel>
      <TabPanel value={activeTab} index={1}>
        {renderSalaryUploadTab()}
      </TabPanel>
    </Modal>
  );
}
