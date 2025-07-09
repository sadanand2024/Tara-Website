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
  Tooltip,
  Paper,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector, useDispatch } from 'store';
import Factory from 'utils/Factory';
import { openSnackbar } from 'store/slices/snackbar';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';
import { Pagination } from '@mui/material';
import AddGSTDialog from './AddGSTDialog';
import { useNavigate } from 'react-router-dom';
import MainCard from 'ui-component/cards/MainCard';
import GroupIcon from '@mui/icons-material/Group';

const GSTSettings = ({ handleBack, handleNext }) => {
  const [gstList, setGstList] = useState([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [selectedGST, setSelectedGST] = useState(null);
  const user = useSelector((state) => state.accountReducer.user);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [isLoading, setIsLoading] = useState(false);
  const [paginatedData, setPaginatedData] = useState([]);
  const navigate = useNavigate();

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  useEffect(() => {
    if (gstList && Array.isArray(gstList)) {
      setPaginatedData(gstList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage));
    }
  }, [currentPage, gstList]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
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
    setIsLoading(true);
    const response = await Factory('get', `/user_management/gst-details/${user.active_context.business_id}/`, {}, {});
    if (response.res.status_cd === 0) {
      const results = response.res.data || [];
      setGstList(results);
      setPaginatedData(results.slice(0, rowsPerPage));
      dispatch(
        openSnackbar({
          open: true,
          message: 'GST details fetched successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      setGstList([]);
      setPaginatedData([]);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(response?.res?.data || 'Failed to fetch GST details'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchGSTList();
  }, []);

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h5" color="text.secondary">
          Loading Personnel...
        </Typography>
      </Box>
    );
  }

  return (
    <MainCard
      title="GST Settings"
      subtitle="Manage your business GST settings for seamless operations"
      action={
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          Add GST
        </Button>
      }
    >
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: 1,
          overflowX: 'auto'
        }}
      >
        <Table size="small">
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
              <TableCell>GST Number</TableCell>
              <TableCell>Trade Name</TableCell>
              <TableCell>Branch/Vertical</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Export/SEZ</TableCell>
              <TableCell>GST DOC</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData && paginatedData.length > 0 ? (
              paginatedData.map((row, idx) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    <GroupIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No GST Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your GST for business operations
                    </Typography>
                    <Button variant="outlined" onClick={handleOpen} startIcon={<AddIcon />} sx={{ borderRadius: 2, textTransform: 'none' }}>
                      Add First GST
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <AddGSTDialog open={open} selectedGST={selectedGST} handleClose={handleClose} fetchGSTList={fetchGSTList} />

      {paginatedData && paginatedData.length > 0 && gstList && gstList.length > 0 && (
        <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
          <Pagination count={Math.ceil(gstList.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
        </Stack>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', mt: 2 }}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleBack}>
          Back
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" onClick={handleNext}>
            Next
          </Button>
        </Stack>
      </Box>
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDelete}
        title="Delete GST"
        description="Are you sure you want to delete this GST detail? This action cannot be undone."
      />
    </MainCard>
  );
};

export default GSTSettings;
