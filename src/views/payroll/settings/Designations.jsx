// 📁 File: Designations.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Grid2,
  Typography,
  CircularProgress
} from '@mui/material';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import DesignationDialog from './DesignationDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import BulkUploadDialog from 'ui-component/extended/BulkUploadDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
function Designations({
  handleBack,
  handleNext,
  searchQuery = '',
  openDialog = false,
  setOpenDialog,
  openBulkDialog = false,
  setOpenBulkDialog
}) {
  const [designations, setDesignations] = useState([]);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleOpenDeleteDialog = (designation) => {
    setSelectedRow(designation);
    setOpenDeleteDialog(true);
  };
  const closeBulkDialog = () => {
    setOpenBulkDialog(false);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const payrollid = searchParams.get('payrollid');

  // Filter designations based on searchQuery from props
  const filteredDesignations = designations.filter((designation) => {
    const query = searchQuery.toLowerCase();
    return designation.designation_name?.toLowerCase().includes(query);
  });
  const paginatedData = filteredDesignations.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (payrollid) fetchDesignations();
  }, [payrollid]);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleCloseDialog = () => setOpenDialog(false);

  const fetchDesignations = async () => {
    setLoading(true);
    const url = `/payroll/designations/?payroll_id=${payrollid}`;
    const { res } = await Factory('get', url, {});

    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setDesignations(res.data);
      setLoading(false);
    } else {
      setDesignations([]);
      setLoading(false);
    }
  };

  const handleEdit = (designation) => {
    setPostType('edit');
    setSelectedRecord(designation);
    setOpenDialog(true);
  };

  const handleDelete = async (designation) => {
    const url = `/payroll/designations/${designation.id}/`;
    const { res } = await Factory('delete', url, {});
    if (res?.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Record Deleted Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      fetchDesignations();
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data?.error || 'Unknown error'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  if (loading) {
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
          Loading Designations...
        </Typography>
      </Box>
    );
  }
  return (
    <Box>
      <BulkUploadDialog
        open={openBulkDialog}
        handleClose={closeBulkDialog}
        getData={fetchDesignations}
        payrollid={payrollid}
        type="Designations"
        bulkUploadUrl="/payroll/designations/bulk-designations-upload/"
        xlsxTemplateUrl="/payroll/download-template/xlsx?type=designation"
        csvTemplateUrl="/payroll/download-template/csv?type=designation"
      />
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <DesignationDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleOpenDialog={() => setOpenDialog(true)}
            selectedRecord={selectedRecord}
            type={postType}
            setType={setPostType}
            fetchDesignations={fetchDesignations}
          />
        </Grid2>

        <TableContainer component={Paper} sx={{ width: '100%', borderRadius: 2, boxShadow: 1, overflowX: 'auto' }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                {['S No', 'Designation Name', 'No of Employees', 'Actions'].map((header, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      color: '#fff !important',
                      textAlign: ['S No', 'No of Employees', 'Actions'].includes(header) ? 'center' : 'left'
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ height: 300 }}>
                    <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding new data." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((designation, idx) => (
                  <TableRow key={designation.id} hover sx={{ minHeight: 56, '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell align="center">{(currentPage - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{designation.designation_name || 'N/A'}</TableCell>
                    <TableCell align="center">{designation.employee_count || 0}</TableCell>
                    <TableCell align="center" sx={{ width: '120px' }}>
                      <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ width: '100%' }}>
                        <IconButton size="small" color="primary" onClick={() => handleEdit(designation)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(designation)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Delete Dialog */}
          <DeleteDialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            onConfirm={handleConfirmDelete}
            dialogData={{
              title: 'Delete Record',
              heading: 'Are you sure you want to delete this Record?',
              description: 'Deleting this designation will also delete all associated employee records. Proceed only if you are sure.'
            }}
          />
        </TableContainer>

        {/* Pagination */}

        <Grid2 size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Back
            </Button>
            {designations.length > 0 && (
              <Pagination
                count={Math.ceil(filteredDesignations.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
              />
            )}

            <Button size="small" variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default Designations;
