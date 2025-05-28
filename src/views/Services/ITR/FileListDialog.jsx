import React from 'react';
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

const FileListDialog = ({ open, onClose, files, onDelete }) => {
  console.log(files);
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{ p: 0, m: 0, '& .MuiDialog-paper': { p: 0, m: 0 } }}
      id="file-list-dialog1"
    >
      {files?.length === 0 ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography>No files to display</Typography>
        </Box>
      ) : (
        <Card sx={{ borderRadius: 2, boxShadow: 1, p: 0 }} id="file-list-dialog2">
          <TableContainer id="file-list-dialog3" sx={{ p: 0 }}>
            <Table size="small" sx={{ width: '100%', px: 0, py: 0 }}>
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white !important', px: 2, py: 1.5 }}>Filename</TableCell>
                  <TableCell sx={{ color: 'white !important', px: 2, py: 1.5 }} align="right">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {files?.map((file, index) => (
                  <TableRow key={index}>
                    <TableCell>{file.name}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" color="error" onClick={() => onDelete(index)}>
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
