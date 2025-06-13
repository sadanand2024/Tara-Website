import React from 'react';
import { Box, Typography, Button, Tooltip, IconButton } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';

const truncateFileName = (fileName, maxLength = 6) => {
  if (!fileName) return '';
  if (fileName.length <= maxLength) return fileName;
  return fileName.substring(0, maxLength) + '...';
};

const RenderFileUpload = ({ label, fieldName, file, setFieldValue, touched, errors }) => {
  const isUrl = typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));

  const handleFileDownload = (file) => {
    if (isUrl) {
      window.open(file, '_blank');
    } else {
      window.open(URL.createObjectURL(file), '_blank');
      // const url = URL.createObjectURL(file);
      // const link = document.createElement('a');
      // link.href = url;
      // link.download = file.name;
      // document.body.appendChild(link);
      // link.click();
      // document.body.removeChild(link);
      // URL.revokeObjectURL(url);
    }
  };

  return (
    <Box>
      <input id={fieldName} type="file" hidden onChange={(e) => setFieldValue(fieldName, e.currentTarget.files[0])} />
      {!file ? (
        <label htmlFor={fieldName}>
          <Button sx={{ whiteSpace: 'nowrap' }} variant="outlined" component="span" fullWidth size="small" startIcon={<UploadFileIcon />}>
            Upload {label}
          </Button>
        </label>
      ) : isUrl ? (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, mt: 1 }}>
          <IconButton onClick={() => handleFileDownload(file)} color="primary" size="small">
            <DownloadIcon />
          </IconButton>
          <Tooltip title={file.split('/').pop()}>
            <Typography variant="subtitle1" color="text.secondary" display="block" sx={{ flexGrow: 1 }}>
              {truncateFileName(file.split('/').pop())}
            </Typography>
          </Tooltip>
          <IconButton size="small" color="error" onClick={() => setFieldValue(fieldName, null)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" gap={1}>
          <Button onClick={() => handleFileDownload(file)} color="primary" size="small">
            {/* <DownloadIcon /> */}
            View or download
          </Button>
          <Tooltip title={file.name}>
            <Typography variant="caption" display="block" sx={{ flexGrow: 1 }}>
              {truncateFileName(file.name)}
            </Typography>
          </Tooltip>
          <IconButton size="small" color="error" onClick={() => setFieldValue(fieldName, null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      )}
      {touched && errors && (
        <Typography variant="caption" color="error">
          {errors}
        </Typography>
      )}
    </Box>
  );
};

export default RenderFileUpload;
