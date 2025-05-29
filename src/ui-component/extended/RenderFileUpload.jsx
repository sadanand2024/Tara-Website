import React from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

const truncateFileName = (fileName, maxLength = 6) => {
  if (fileName.length <= maxLength) return fileName;
  return fileName.substring(0, maxLength) + '...';
};

const RenderFileUpload = ({ label, fieldName, file, setFieldValue, touched, errors }) => {
  const isUrl = typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));
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
          <CloudDownloadIcon sx={{ cursor: 'pointer' }} color="primary" fontSize="large" onClick={() => window.open(file, '_blank')} />
          <Tooltip title={file.split('/').pop()}>
            <Typography variant="subtitle1" color="text.secondary" display="block">
              {truncateFileName(file.split('/').pop())}
            </Typography>
          </Tooltip>
          <Button size="small" color="error" onClick={() => setFieldValue(fieldName, null)} sx={{ minWidth: 0, p: 0.5 }}>
            <DeleteIcon fontSize="small" />
          </Button>
        </Box>
      ) : (
        <Box display="flex" alignItems="center" gap={1}>
          <InsertDriveFileIcon color="action" fontSize="small" />
          <Tooltip title={file.name}>
            <Typography variant="caption" display="block" sx={{ flexGrow: 1 }}>
              {truncateFileName(file.name)}
            </Typography>
          </Tooltip>
          <Button size="small" color="error" onClick={() => setFieldValue(fieldName, null)} sx={{ minWidth: 0, p: 0.5 }}>
            <CloseIcon fontSize="small" />
          </Button>
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
