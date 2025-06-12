import React from 'react';
import { Box, Typography } from '@mui/material';
import UploadIcon from '@mui/icons-material/Upload';

const FileUploadBox = ({ onFiles, size, accept }) => {
  const fileInputRef = React.useRef();

  const handleBoxClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (onFiles) onFiles(e.target.files);
  };

  return (
    <Box>
      {/* <Typography fontWeight={600} mb={1}>
        Upload file <span style={{ color: 'red' }}>*</span>
      </Typography> */}
      <Box
        onClick={handleBoxClick}
        sx={{
          border: '2px dashed #bbb',
          borderRadius: '8px',
          p: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          minHeight: 50,
          minWidth: 250,
          background: '#fff',
          transition: 'background 0.2s',
          '&:hover': { background: '#f5f5f5' }
        }}
      >
        <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} accept={accept} />
        <UploadIcon sx={{ mr: 1, color: '#888' }} />
        <Typography color="#888">
          <span style={{ fontWeight: 700, textDecoration: 'underline', color: 'inherit' }}>Browse file</span>
        </Typography>
      </Box>
      <Typography variant="caption" color="textSecondary" mt={1} display="block">
        Up to {size}.
      </Typography>
    </Box>
  );
};
export default FileUploadBox;
