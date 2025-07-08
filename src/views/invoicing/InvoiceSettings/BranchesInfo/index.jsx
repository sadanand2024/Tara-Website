import React, { useState, useEffect } from 'react';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import { Typography } from '@mui/material';
import { Grid2 } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import {
  Button,
  Stack,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Box,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { Edit, Delete, Add as AddIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteConfirmationDialog from 'utils/DeleteConfirmationDialog';

import AddBranchDialog from './AddBranchDialog';

export default function BranchesInfo({ handleBack, handleNext, fetchBusinessDetails }) {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('add');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleClose = () => {
    setOpen(false);
    setType('');
    setSelectedRecord(null);
  };

  const getBranches = async () => {
    setIsLoading(true);
    const { res } = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
    if (res.status_cd === 0) {
      setBranches(res.data);
    } else {
      dispatch(
        openSnackbar({
          message: JSON.stringify(res.data) || 'Failed to get branches',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    setIsLoading(false);
  };

  const handleDeleteClick = (index) => {
    setDeleteIndex(index);
    setDeleteDialogOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteDialogOpen(false);
    setDeleteIndex(null);
  };

  const handleRemoveBranch = async () => {
    let url = `/user_management/branches/${branches[deleteIndex].id}/`;
    let response = await Factory('delete', url, {});

    if (response.res.status_cd === 0) {
      setBranches(branches.filter((_, i) => i !== deleteIndex));
      dispatch(
        openSnackbar({
          open: true,
          message: 'Branch deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          message: JSON.stringify(response.res.data) || 'Failed to delete branch',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    handleDeleteClose();
  };

  const handleOpenDialog = () => {
    setOpen(true);
    setType('add');
  };

  const handleEditBranch = (index) => {
    setOpen(true);
    setType('edit');
    setSelectedRecord(branches[index]);
  };

  useEffect(() => {
    getBranches();
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
          Loading Branches...
        </Typography>
      </Box>
    );
  }

  return (
    <MainCard
      title="Branches Info"
      subtitle="Manage your business branches for invoice generation and business operations"
      action={
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '0.9rem'
          }}
        >
          Add Branch
        </Button>
      }
    >
      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: 1,
          overflowX: 'auto',
          mb: 3
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
              <TableCell sx={{ fontWeight: 600 }}>Branch Name</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Branch Code</TableCell>
              <TableCell align="center" sx={{ fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {branches.length > 0 ? (
              branches.map((branch, index) => (
                <TableRow key={branch.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {branch.branch_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{branch.branch_code}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Tooltip title="Edit Branch">
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEditBranch(index)}
                          sx={{
                            backgroundColor: 'primary.50',
                            '&:hover': { backgroundColor: 'primary.100' }
                          }}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Branch">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDeleteClick(index)}
                          sx={{
                            backgroundColor: 'error.50',
                            '&:hover': { backgroundColor: 'error.100' }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  <Box
                    sx={{
                      textAlign: 'center',
                      py: 4
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 60, color: 'grey.400', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      No Branches Added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Start by adding your first business branch for invoice generation
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={handleOpenDialog}
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 2, textTransform: 'none' }}
                    >
                      Add First Branch
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} variant="outlined" size="small" onClick={handleBack} sx={{ textTransform: 'none' }}>
          Back
        </Button>

        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="small" onClick={handleNext} sx={{ textTransform: 'none' }}>
            Next
          </Button>
        </Stack>
      </Box>

      <AddBranchDialog
        open={open}
        handleClose={handleClose}
        selectedRecord={selectedRecord}
        getBranches={getBranches}
        setSelectedRecord={setSelectedRecord}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleRemoveBranch}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone."
        itemName={deleteIndex !== null ? `Branch: ${branches[deleteIndex]?.branch_name}` : ''}
      />
    </MainCard>
  );
}
