import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Button,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'store';
import Factory from 'utils/Factory';
import { openSnackbar } from 'store/slices/snackbar';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

import AddGSTDialog from './AddGSTDialog';

const GSTSettings = () => {
  const [gstList, setGstList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedGST, setSelectedGST] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    resetForm();
    setOpen(false);
    setSelectedGST(null);
  };
  const handleEdit = (index) => {
    setEditIndex(index);
    setSelectedGST(gstList[index]);
    setOpen(true);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleDelete = async () => {
    try {
      const response = await Factory('delete', `/user_management/gst-details/${gstList[deleteIndex].id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setGstList(gstList.filter((_, i) => i !== deleteIndex));
        dispatch(
          openSnackbar({
            open: true,
            message: 'GST details deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to delete GST details',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error deleting GST details:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete GST details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      handleDeleteClose();
    }
  };

  const handleDownload = (documentUrl, fileName) => {
    if (documentUrl) {
      const link = document.createElement('a');
      link.href = documentUrl;
      link.setAttribute('download', fileName || 'gst-document');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const fetchGSTList = async () => {
    try {
      const response = await Factory('get', `/user_management/gst-details/${user.active_context.business_id}/`, {}, {});
      if (response.res.status_cd === 0) {
        setGstList(response.res.data);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to fetch GST details',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (error) {
      console.error('Error fetching GST details:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch GST details',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    fetchGSTList();
  }, []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="h4" color="text.primary" gutterBottom>
          GST Settings
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpen}>
          Add GST
        </Button>
      </Box>
      <Card
        elevation={2}
        sx={{
          mb: 2,
          '& .MuiTableContainer-root': {
            borderRadius: 0
          },
          '& .MuiTableCell-root': {
            color: 'text.primary'
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            py: 1,
            backgroundColor: 'primary.dark',
            color: '#fff'
          }
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>GST Number</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Trade Name</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Branch/Vertical</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>State</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Type</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>Export/SEZ</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }}>GST DOC</TableCell>
                <TableCell sx={{ backgroundColor: 'primary.main', color: '#fff', fontWeight: 600 }} align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gstList.map((row, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>{row.gstin}</TableCell>
                  <TableCell>{row.trade_name}</TableCell>
                  <TableCell>{row.branch_name}</TableCell>
                  <TableCell>{row.state}</TableCell>
                  <TableCell>{row.type || (row.is_composition_scheme === 'yes' ? 'Composition' : 'Regular')}</TableCell>
                  <TableCell>{row.is_export_sez === 'yes' ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    {row.gst_document && (
                      <Tooltip title="Download GST Document">
                        <IconButton size="small" color="primary" onClick={() => handleDownload(row.gst_document, `GST_${row.gstin}`)}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Tooltip title="View/Edit">
                        <IconButton size="small" color="primary" onClick={() => handleEdit(idx)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(idx)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {gstList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    No GST records added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add/Edit GST Dialog */}
      <AddGSTDialog
        open={open}
        setOpen={setOpen}
        fetch_Business_Details={fetchGSTList}
        selectedGST={selectedGST}
        setSelectedGST={setSelectedGST}
        handleClose={handleClose}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={() => deleteIndex !== null && handleDelete()}
        title="Delete GST Details"
        message="Are you sure you want to delete this GST details? This action cannot be undone."
        itemName={deleteIndex !== null ? `GST Number: ${gstList[deleteIndex]?.gstin}` : ''}
      />
    </Box>
  );
};

export default GSTSettings;
