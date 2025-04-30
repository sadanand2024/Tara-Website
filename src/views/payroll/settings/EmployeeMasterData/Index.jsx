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
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';

import Factory from 'utils/Factory';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payrollId, setPayrollId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();

  const rowsPerPage = 8;
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handlePageChange = (_event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const paginatedEmployees = employees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
          message: JSON.stringify(res?.data?.data || error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setEmployees([]);
    }
  };

  const deleteEmployee = async (item) => {
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
    navigate(`/payroll/settings/add-employee?employee_id=${encodeURIComponent(item.id)}&payrollid=${encodeURIComponent(payrollId)}`);
  };
  return (
    <>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <MainCard
          title="Employee Master Data"
          secondary={
            <Button variant="contained" onClick={() => navigate(`/payroll/settings/add-employee?payrollid=${payrollId}`)}>
              Add Employee
            </Button>
          }
        >
          <Grid2 container spacing={2}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.100' }}>
                    {['Employee ID', 'Employee Name', 'Department', 'Designation', 'Email', 'Status', 'Actions'].map((header, idx) => (
                      <TableCell key={idx} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textAlign: 'center' }}>
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedEmployees.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ height: 300 }}>
                        <EmptyDataPlaceholder title="No Data Found" subtitle="Start Adding data." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedEmployees.map((employee) => (
                      <TableRow key={employee.id} hover sx={{ '&:nth-of-type(odd)': { backgroundColor: 'grey.50' } }}>
                        <TableCell align="center">{employee.associate_id}</TableCell>
                        <TableCell align="center">{`${employee.first_name || ''} ${employee.last_name || ''}`}</TableCell>
                        <TableCell align="center">{employee.department_name || '-'}</TableCell>
                        <TableCell align="center">{employee.designation_name || '-'}</TableCell>
                        <TableCell align="center">{employee.work_email || '-'}</TableCell>
                        <TableCell align="center">{employee.is_active ? 'Active' : 'Inactive'}</TableCell>
                        <TableCell align="center">
                          <ActionCell
                            row={employee}
                            onEdit={() => handleEdit(employee)}
                            open={openDialog}
                            deleteDialogData={{
                              title: 'Delete Employee',
                              heading: 'Are you sure you want to delete this employee?',
                              description: `This will remove ${employee.first_name} ${employee.last_name} from the list.`,
                              successMessage: 'Employee deleted successfully'
                            }}
                            // Deletion not implemented yet
                            onDelete={() => deleteEmployee(employee)}
                            onClose={() => setOpenDialog(false)}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {employees.length > rowsPerPage && (
              <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
                <Pagination count={Math.ceil(employees.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
              </Stack>
            )}

            <Grid2 xs={12}>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                  Back to Dashboard
                </Button>
              </Box>
            </Grid2>
          </Grid2>
        </MainCard>
      )}
    </>
  );
}

export default EmployeeList;
