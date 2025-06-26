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
  Card,
  Pagination
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import Modal from 'ui-component/extended/Modal';
import CustomInput from 'utils/CustomInput';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconPlus } from '@tabler/icons-react';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';

import AddBranchDialog from './AddBranchDialog';
export default function BranchesInfo({ handleBack, handleNext, fetchBusinessDetails }) {
  const [branches, setBranches] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('add');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const handleClose = () => {
    setOpen(false);
    setType('');
    setSelectedRecord(null);
  };
  const getBranches = async () => {
    const { res } = await Factory('get', `/user_management/branches/${user.active_context.business_id}/`, {}, {});
    if (res.status_cd === 0) {
      setBranches(res.data);
    }
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          message: res.message || 'Failed to get branches',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  const handleRemoveBranch = async (index) => {
    let url = `/user_management/branches/${branches[index].id}/`;

    let response = await Factory('delete', url, {});
    if (response.res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Branch deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      getBranches();
    } else {
      dispatch(
        openSnackbar({
          message: response.res.message || 'Failed to delete branch',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
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
  return (
    <Grid2 container spacing={2}>
      <Grid2 size={{ xs: 12 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Branches Info</Typography>
          <Button size="small" startIcon={<IconPlus size={16} />} variant="contained" color="primary" onClick={handleOpenDialog}>
            Add Branch
          </Button>
        </Stack>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
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
              backgroundColor: 'primary.main',
              color: '#fff'
            }
          }}
        >
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Branch Name</TableCell>
                  <TableCell>Branch Code</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {branches.map((branch, index) => (
                  <TableRow key={branch.id}>
                    <TableCell>{branch.branch_name}</TableCell>
                    <TableCell>{branch.branch_code}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => handleEditBranch(index)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => handleRemoveBranch(index)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => {
              navigate('/app/invoice');
            }}
            size="small"
          >
            Back to Dashboard
          </Button>

          {branches.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 3,
                width: '100%',
                color: 'text.secondary'
              }}
            >
              No branches added yet
            </Box>
          )}
          {branches.length > 0 && (
            <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
              <Pagination count={Math.ceil(branches.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
            </Stack>
          )}
          <Stack direction="row" spacing={2}>
            <Button variant="outlined" size="small" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" size="small" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Box>
      </Grid2>
      <AddBranchDialog
        open={open}
        handleClose={handleClose}
        selectedRecord={selectedRecord}
        getBranches={getBranches}
        setSelectedRecord={setSelectedRecord}
      />
    </Grid2>
  );
}
