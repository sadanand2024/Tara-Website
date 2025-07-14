import React, { useState, useEffect } from 'react';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Stack,
  Box,
  Pagination,
  Typography,
  Grid2,
  CircularProgress
} from '@mui/material';
import SearchBar from 'ui-component/extended/SearchBar';
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';
import DepartmentDialog from './DepartmentDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import DeleteDialog from '../../../ui-component/extended/DeleteDialog'; // adjust path accordingly
import { IconButton, Tooltip } from '@mui/material'; // Add these if not already
import { Edit, Delete } from '@mui/icons-material';
import BulkUploadDialog from 'ui-component/extended/BulkUploadDialog';
function Departments({ handleBack, handleNext }) {
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const handleOpenDeleteDialog = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  // Filter departments based on searchQuery
  const filteredDepartments = departments.filter((department) => {
    const query = searchQuery.toLowerCase();
    return (
      department.department_name?.toLowerCase().includes(query) ||
      department.department_code?.toLowerCase().includes(query) ||
      department.description?.toLowerCase().includes(query)
    );
  });
  const paginatedData = filteredDepartments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const payrollid = searchParams.get('payrollid');
  const closeBulkDialog = () => {
    setOpenBulkDialog(false);
  };
  useEffect(() => {
    if (payrollid) fetchDepartments();
  }, [payrollid]);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const fetchDepartments = async () => {
    setLoading(true);
    const url = `/payroll/departments/?payroll_id=${payrollid}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setDepartments(res.data);
      setLoading(false);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.error) || 'An error occurred, Please Try again',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setDepartments([]);
      setLoading(false);
    }
  };

  const handleEdit = (department) => {
    setPostType('edit');
    setSelectedRecord(department);
    handleOpenDialog();
  };

  const handleDelete = async (department) => {
    const url = `/payroll/departments/${department.id}/`;
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
      fetchDepartments();
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
          Loading Departments...
        </Typography>
      </Box>
    );
  }
  return (
    <MainCard
      title="Departments Details"
      subtitle="Manage your departments for seamless operations"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <SearchBar
            placeholder="Search department..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button variant="outlined" color="secondary" onClick={() => setOpenBulkDialog(true)}>
            Bulk Upload
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setPostType('post');
              handleOpenDialog();
            }}
          >
            Add Department
          </Button>
        </Stack>
      }
    >
      <BulkUploadDialog
        open={openBulkDialog}
        handleClose={closeBulkDialog}
        getData={fetchDepartments}
        payrollid={payrollid}
        type="Departments"
        bulkUploadUrl="/payroll/departments/bulk-department-upload/"
        xlsxTemplateUrl="/payroll/download-template/xlsx?type=department"
        csvTemplateUrl="/payroll/download-template/csv?type=department"
      />
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <DepartmentDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleOpenDialog={handleOpenDialog}
            selectedRecord={selectedRecord}
            type={postType}
            setType={setPostType}
            fetchDepartments={fetchDepartments}
          />
        </Grid2>

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
            <TableHead sx={{ backgroundColor: 'primary.main', '& .MuiTableCell-root': { color: '#fff !important' } }}>
              <TableRow>
                {['S No', 'Department Name', 'Department Code', 'Description', 'No of Employees', 'Actions'].map((header, idx) => (
                  <TableCell
                    key={idx}
                    align={['S No', 'No of Employees', 'Actions'].includes(header) ? 'center' : 'left'}
                    sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
                    <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding new data." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((department, idx) => (
                  <TableRow key={department.id} hover sx={{ minHeight: 56, '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell align="center">{(currentPage - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{department.department_name || 'N/A'}</TableCell>
                    <TableCell>{department.department_code || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {department.description || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{department.employee_count || 0}</TableCell>
                    <TableCell align="center">
                      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <IconButton size="small" color="primary" onClick={() => handleEdit(department)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(department)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DeleteDialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            onConfirm={handleConfirmDelete}
            dialogData={{
              title: 'Delete Record',
              heading: 'Are you sure?',
              description: 'This action will permanently delete the record.'
            }}
          />
        </TableContainer>

        <Grid2 size={12} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Back
            </Button>
            {departments.length > 0 && (
              <Pagination
                count={Math.ceil(filteredDepartments.length / rowsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                shape="rounded"
                color="primary"
              />
            )}

            <Button size="small" variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </MainCard>
  );
}

export default Departments;
