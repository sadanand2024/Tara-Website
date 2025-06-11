import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TableContainer,
  Box,
  Typography,
  Card
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Factory from '../../../utils/Factory';
import { useSnackbar } from 'notistack';
import { Download, Visibility } from '@mui/icons-material';

const FileListDialog = ({ open, onClose, files, getStep1Data, getStep2Data, getStep3Data, step }) => {
  console.log('files', files);
  const { enqueueSnackbar } = useSnackbar();
  const [filesData, setFilesData] = useState([]);

  useEffect(() => {
    if (files.files) setFilesData(files.files);
  }, [files]);

  const getFileName = (file) => {
    if (file.url instanceof File) {
      return file.url.name;
    } else if (file.url) {
      return file.url.split('/').pop();
    } else if (file.file) {
      return file.file.split('/').pop();
    } else if (file.file_url) {
      return file.file_url.split('/').pop();
    }
    return file.name;
  };

  const viewFile = async (file, action) => {
    let url = file.url || file.file || file.file_url || file;
    if (file instanceof File) {
      window.open(URL.createObjectURL(file), '_blank');
    } else {
      const response = await Factory('get', `/docwallet/generate_presigned_url?url=${url}`, {}, {});
      if (response.res.status_cd === 0) {
        let url = response.res.data.url;
        window.open(url, '_blank');
      }
    }
  };

  const removefile = (index) => {
    let __files = JSON.parse(JSON.stringify(filesData));
    __files.splice(index, 1);
    setFilesData(__files);
    if (step === 0) getStep1Data();
    if (step === 1) getStep2Data();
    if (step === 2) getStep3Data();
  };
  const onDelete = async (index, id) => {
    if (!id) removefile(index);
    else {
      const response = await Factory('delete', `/income_tax_returns/${files.urlEndpoint}/files/${id}/delete/`, {});
      if (response.res.status_cd === 0) {
        removefile(index);
        enqueueSnackbar('File deleted successfully', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      } else {
        enqueueSnackbar('File deletion failed', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ p: 0, m: 0, '& .MuiDialog-paper': { p: 0, m: 0 } }}
      id="file-list-dialog1"
    >
      {filesData?.length === 0 ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography>No files to display</Typography>
        </Box>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: 1, p: 0 }} id="file-list-dialog2">
          <TableContainer id="file-list-dialog3" sx={{ p: 0 }}>
            <Table size="small" sx={{ width: '100%', px: 0, py: 0 }}>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white !important', px: 2, py: 1.5, width: '75%' }}>Filename</TableCell>
                  <TableCell sx={{ color: 'white !important', px: 2, py: 1.5, width: '25%' }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filesData?.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{getFileName(file)}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" color="primary" onClick={() => viewFile(file, 'view')}>
                        <Visibility />/
                        <Download />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => onDelete(index, file.id, file)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow key={'Close'}>
                  <TableCell></TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', px: 0.5, py: 0.5 }}>
                      <Button variant="outlined" size="small" onClick={onClose}>
                        Close
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Dialog>
  );
};

export default FileListDialog;
