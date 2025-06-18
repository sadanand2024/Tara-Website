import React from 'react';
import { Stack, Button, Typography } from '@mui/material';
import Factory from 'utils/Factory';

const FileUploadButtons = ({ fieldName, file, setFieldValue, label }) => {
  const isUrl = typeof file === 'string' && (file.startsWith('http://') || file.startsWith('https://'));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFieldValue(fieldName, selectedFile);
    }
  };

  const handleView = () => {
    if (isUrl) {
      window.open(file, '_blank');
    } else if (file instanceof File) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    }
  };

    const viewFile = async (url) => {
      const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
      if (response.res.status_cd === 0) {
        let url = response.res.data.url;
        window.open(url, '_blank');
      }
    };

  return (
    <Stack direction="row" spacing={1}>
      <input
        id={fieldName}
        type="file"
        hidden
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        size="small"
        fullWidth
        onClick={() => document.getElementById(fieldName).click()}
      >
        Upload
      </Button>
      {file && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          onClick={() => {
            console.log('file', file);
                            if (file instanceof File) {
                              window.open(URL.createObjectURL(file), '_blank');
                            } else if (typeof file === 'string') {
                              viewFile(file);
                            }
                          }}
        >
          View
        </Button>
      )}
    </Stack>
  );
};

export default FileUploadButtons;
