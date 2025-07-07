import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import { Tooltip, Typography, Stack } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function searchUI({ files, MUIGrid, viewFile, getFileIcon, getFileType, handleMenuOpen, setActions }) {
  return (
    <>
      <Box sx={{ mb: 3 }}>
        {files === null || files?.length === 0 ? (
          <Typography>File Not Found </Typography>
        ) : (
          <>
            <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
              Files Found
            </Typography>
            <Grid container spacing={2}>
              {files.map((file, idx) => (
                <MUIGrid name={file.name} details={file} detailskey={'file'} key={idx} idx={idx} viewFile={viewFile}>
                  <Stack
                    direction="row"
                    className="file-item"
                    sx={{
                      border: '1px solid #ededed',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      borderRadius: 1.5,
                      p: 2,
                      gap: 1.5,
                      alignItems: 'center',
                      minWidth: 0,
                      width: '100%'
                    }}
                  >
                    {getFileIcon(getFileType(file))}
                    <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
                      <Tooltip title={file.name} placement="bottom">
                        <Typography
                          fontWeight={500}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                            maxWidth: '100%',
                            fontSize: { xs: 13, sm: 15 }
                          }}
                        >
                          {file.name}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        Uploaded :
                        {new Date(file.uploaded_at).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </Typography>
                    </Box>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        setActions({ data: file, edit: true, delete: false });
                        handleMenuOpen(e, file);
                      }}
                      sx={{ ml: 1 }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Stack>
                </MUIGrid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </>
  );
}
