import React, { useEffect, useState } from 'react';
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
  Typography,
  Grid2,
  CircularProgress
} from '@mui/material';
import ActionCell from 'ui-component/extended/ActionCell';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import Factory from 'utils/Factory';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import EmployeeBulkUploadDialog from 'ui-component/extended/EmployeeBulkUploadDialog';
import AddEmployee from './AddEmployee';

function EmployeeList({
  handleBack,
  handleNext,
  searchQuery = '',
  openDialog = false,
  setOpenDialog,
  openBulkDialog = false,
  setOpenBulkDialog
}) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payrollId, setPayrollId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const closeBulkDialog = () => {
    setOpenBulkDialog(false);
  };
  const handleOpenDeleteDialog = (designation) => {
    setSelectedRow(designation);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter employees based on searchQuery from props
  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.toLowerCase();
    return (
      employee.associate_id?.toLowerCase().includes(query) ||
      `${employee.first_name || ''} ${employee.last_name || ''}`.toLowerCase().includes(query) ||
      employee.department_name?.toLowerCase().includes(query) ||
      employee.designation_name?.toLowerCase().includes(query) ||
      employee.work_email?.toLowerCase().includes(query)
    );
  });

  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  const fetchEmployees = async () => {
    setLoading(true);
    const url = `/payroll/employees?payroll_id=${payrollId}`;
    const { res } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setEmployees(res?.data || []);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || 'something went wrong please try again later'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setEmployees([]);
    }
  };

  const handleDelete = async (item) => {
    setLoading(true);
    const url = `/payroll/employees/${item.id}`;
    const { res } = await Factory('delete', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      fetchEmployees();
      dispatch(
        openSnackbar({
          open: true,
          message: 'Record deleted Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || 'something went wrong'),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setEmployees([]);
    }
  };
  useEffect(() => {
    if (payrollId) fetchEmployees();
  }, [payrollId]);

  const handleEdit = (item) => {
    const params = new URLSearchParams(searchParams);
    params.set('employee_id', item.id);
    navigate({ search: params.toString() });
  };

  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <EmployeeBulkUploadDialog
            open={openBulkDialog}
            handleClose={closeBulkDialog}
            getData={fetchEmployees}
            payrollid={payrollId}
            type="Employees"
            bulkUploadUrl="/payroll/employees/upload/"
            xlsxTemplateUrl={`/payroll/download-template/${payrollId}/`}
            // csvTemplateUrl="/payroll/download-template/csv?type=employee"
          />
          <Grid2 container spacing={2}>
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
                <TableHead sx={{ backgroundColor: 'primary.main' }}>
                  <TableRow>
                    {['S No', 'Employee ID', 'Name', 'Department', 'Designation', 'Email', 'Actions'].map((header, idx) => (
                      <TableCell
                        key={idx}
                        align={['S No', 'Actions'].includes(header) ? 'center' : 'left'}
                        sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', color: '#fff !important' }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ height: 300 }}>
                        <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding new data." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEmployees.map((employee, index) => (
                      <TableRow key={employee.id} hover sx={{ minHeight: 56, '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell align="center">{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{employee.associate_id || 'N/A'}</TableCell>
                        <TableCell>{`${employee.first_name || ''} ${employee.last_name || ''}`.trim() || 'N/A'}</TableCell>
                        <TableCell>{employee.department_name || 'N/A'}</TableCell>
                        <TableCell>{employee.designation_name || 'N/A'}</TableCell>
                        <TableCell>{employee.work_email || 'N/A'}</TableCell>
                        <TableCell align="center">
                          <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                            <IconButton size="small" color="primary" onClick={() => handleEdit(employee)}>
                              <Edit />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(employee)}>
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
                  heading: 'Are you sure you want to delete this Record?',
                  description: 'This action will permanently delete the record.'
                }}
              />
            </TableContainer>

            <Grid2 size={{ xs: 12 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, width: '100%' }}>
                <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                  Back
                </Button>
                {filteredEmployees.length > 0 && (
                  <Pagination
                    count={Math.ceil(filteredEmployees.length / rowsPerPage)}
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
      )}
    </>
  );
}

export default function EmployeeMasterDataIndex(props) {
  return <EmployeeList {...props} />;
}
