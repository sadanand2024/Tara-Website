import React, { useState, useEffect } from 'react';
import { Button, Typography, Box, Stack, IconButton, Tooltip } from '@mui/material';
import { IconUpload, IconTrash } from '@tabler/icons-react';

/**
 * CustomUpload Component
 * @param {Object} props
 * @param {string} props.title - Button text for upload
 * @param {Function} props.setData - Callback to set the uploaded file
 * @param {File|string} props.initialValue - Initial file or URL
 * @param {Function} props.onDelete - Callback when file is deleted
 * @param {Object} props.previewStyles - Custom styles for preview image
 * @param {string[]} props.acceptedFileTypes - Array of accepted file types
 * @param {number} props.maxFileSize - Maximum file size in MB
 * @param {string} props.error - Error message to display
 * @param {Object} props.sx - Additional styles for the container
 */
const CustomUpload = ({
  title = 'Upload File',
  setData,
  initialValue,
  onDelete,
  previewStyles = {},
  acceptedFileTypes = ['image/*'],
  maxFileSize = 5, // 5MB default
  error,
  sx = {}
}) => {
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState('');

  useEffect(() => {
    if (initialValue) {
      if (typeof initialValue === 'string') {
        // Handle AWS S3 URL or any other URL
        setPreview(initialValue);
      } else if (initialValue instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(initialValue);
      }
    } else {
      setPreview(null);
    }
  }, [initialValue]);

  const handleDeleteFile = () => {
    setPreview(null);
    setData(null);
    setFileError('');
    if (onDelete) {
      onDelete();
    }
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxFileSize * 1024 * 1024) {
      return `File size must be less than ${maxFileSize}MB`;
    }
    return '';
  };

  const handleOnChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setFileError(validationError);
      return;
    }

    setFileError('');
    setData(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const defaultPreviewStyles = {
    maxWidth: '120px',
    maxHeight: '80px',
    objectFit: 'contain',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    padding: '4px',
    backgroundColor: '#f5f5f5'
  };

  return (
    <Box sx={{ width: '100%', ...sx }}>
      <Stack spacing={1}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'center' },
            gap: 2,
            width: '100%'
          }}
        >
          <Box sx={{ flex: 1 }}>
            <label htmlFor="custom-upload" style={{ width: '100%', display: 'block' }}>
              <input
                id="custom-upload"
                type="file"
                accept={acceptedFileTypes.join(',')}
                style={{ display: 'none' }}
                onChange={handleOnChange}
              />
              <Button
                component="span"
                variant="outlined"
                color="secondary"
                size="medium"
                startIcon={<IconUpload size={18} stroke={1.5} />}
                fullWidth
                sx={{
                  height: '40px',
                  justifyContent: 'flex-start',
                  textTransform: 'none'
                }}
              >
                {title}
              </Button>
            </label>
          </Box>

          {preview && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flex: 1,
                justifyContent: 'space-between'
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{ ...defaultPreviewStyles, ...previewStyles }}
                onError={(e) => {
                  console.error('Error loading image:', e);
                  setPreview(null);
                }}
              />
              <Tooltip title="Remove file">
                <IconButton color="error" onClick={handleDeleteFile} aria-label="delete" size="small">
                  <IconTrash size={18} stroke={1.5} />
                </IconButton>
              </Tooltip>
            </Box>
          )}
        </Box>

        {(fileError || error) && (
          <Typography color="error" variant="caption">
            {fileError || error}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};

export default CustomUpload;
