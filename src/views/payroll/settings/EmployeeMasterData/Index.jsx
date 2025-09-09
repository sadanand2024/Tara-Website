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
  Grid2,
  Autocomplete,
  TextField,
  CircularProgress
} from '@mui/material';
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
import CircularProgressComponent from 'utils/CircularProgressComponent';

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
  const [payrollId, setPayrollId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reportingTo, setReportingTo] = useState({});
  const [headOfDepartment, setHeadOfDepartment] = useState({});
  const [reportingEmployees, setReportingEmployees] = useState({});
  const [headsOfDepartment, setHeadsOfDepartment] = useState({});
  const [loadingReporting, setLoadingReporting] = useState({});
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

  // Filter employees based on searchQuery from props (search across all relevant fields)
  const filteredEmployees = employees.filter((employee) => {
    const query = (searchQuery || '').trim().toLowerCase();
    if (!query) return true;
    const fullName = `${employee.first_name || ''} ${employee.last_name || ''}`;
    const fieldsToSearch = [
      employee.associate_id,
      fullName,
      employee.department_name,
      employee.designation_name,
      employee.work_email,
      employee.work_location_name,
      employee.phone,
      employee.status,
      employee.id
    ];
    return fieldsToSearch.some((field) =>
      String(field ?? '')
        .toLowerCase()
        .includes(query)
    );
  });

  const paginatedEmployees = filteredEmployees.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    const url = `/payroll/employees?payroll_id=${payrollId}`;
    const { res } = await Factory('get', url, {});
    setIsLoading(false);
    if (res?.status_cd === 0) {
      const employeesData = res?.data || [];
      setEmployees(employeesData);

      // Extract and set existing reporting manager data
      const reportingToData = {};
      const headOfDepartmentData = {};

      employeesData.forEach((employee) => {
        if (employee.employee_reporting_manager) {
          // Set reporting manager if exists
          if (employee.employee_reporting_manager.reporting_manager) {
            reportingToData[employee.id] = employee.employee_reporting_manager.reporting_manager;
          }

          // Set head of department if exists
          if (employee.employee_reporting_manager.head_of_department) {
            headOfDepartmentData[employee.id] = employee.employee_reporting_manager.head_of_department;
          }
        }
      });

      setReportingTo(reportingToData);
      setHeadOfDepartment(headOfDepartmentData);
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
    setIsLoading(true);
    const url = `/payroll/employees/${item.id}`;
    const { res } = await Factory('delete', url, {});
    setIsLoading(false);
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

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const fetchReportingEmployees = async (employeeId) => {
    // Check if already loaded
    if (reportingEmployees[employeeId] && headsOfDepartment[employeeId]) {
      return { reportingEmployees: reportingEmployees[employeeId], headsOfDepartment: headsOfDepartment[employeeId] };
    }

    setLoadingReporting((prev) => ({ ...prev, [employeeId]: true }));

    try {
      const url = `/payroll/employee-reporting-manager?payroll_id=${payrollId}&employee_id=${employeeId}`;
      const { res } = await Factory('get', url, {});

      if (res?.status_cd === 0) {
        // Extract both reporting_managers and heads_of_department from the API response
        const responseData = res?.data || {};
        console.log('API Response for employee', employeeId, ':', responseData);

        let reportingData = responseData.reporting_managers || [];
        if (!Array.isArray(reportingData)) {
          reportingData = [];
        }

        let headsData = responseData.heads_of_department || [];
        if (!Array.isArray(headsData)) {
          headsData = [];
        }

        console.log('Reporting managers for employee', employeeId, ':', reportingData);
        console.log('Heads of department for employee', employeeId, ':', headsData);

        setReportingEmployees((prev) => ({ ...prev, [employeeId]: reportingData }));
        setHeadsOfDepartment((prev) => ({ ...prev, [employeeId]: headsData }));
        setLoadingReporting((prev) => ({ ...prev, [employeeId]: false }));

        return { reportingEmployees: reportingData, headsOfDepartment: headsData };
      } else {
        setReportingEmployees((prev) => ({ ...prev, [employeeId]: [] }));
        setHeadsOfDepartment((prev) => ({ ...prev, [employeeId]: [] }));
        setLoadingReporting((prev) => ({ ...prev, [employeeId]: false }));
        return { reportingEmployees: [], headsOfDepartment: [] };
      }
    } catch (error) {
      console.error('Error fetching reporting employees:', error);
      setReportingEmployees((prev) => ({ ...prev, [employeeId]: [] }));
      setHeadsOfDepartment((prev) => ({ ...prev, [employeeId]: [] }));
      setLoadingReporting((prev) => ({ ...prev, [employeeId]: false }));
      return { reportingEmployees: [], headsOfDepartment: [] };
    }
  };

  if (isLoading) {
    return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading Employee Data'} />;
  }
  return (
    <>
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
                  {[
                    'S No',
                    'Employee ID',
                    'Name',
                    'Department',
                    'Designation',
                    // 'Email',
                    'Reporting to',
                    'Head of Department',
                    'Actions'
                  ].map((header, idx) => (
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
                      {/* <TableCell>{employee.work_email || 'N/A'}</TableCell> */}
                      <TableCell>
                        <Autocomplete
                          options={(() => {
                            const currentOptions = Array.isArray(reportingEmployees[employee.id]) ? reportingEmployees[employee.id] : [];
                            const currentValue = reportingTo[employee.id];

                            // If we have a current value but it's not in options, add it to show the selected value
                            if (currentValue && !currentOptions.find((opt) => opt.id === currentValue.id)) {
                              return [currentValue, ...currentOptions];
                            }
                            return currentOptions;
                          })()}
                          value={reportingTo[employee.id] || null}
                          getOptionLabel={(option) => option?.name || 'Self'}
                          getOptionKey={(option) => option?.id || Math.random()}
                          isOptionEqualToValue={(option, value) => option?.id === value?.id}
                          loading={loadingReporting[employee.id] || false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Reporting To"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingReporting[employee.id] ? <CircularProgress size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                          fullWidth
                          size="small"
                          onOpen={() => {
                            if (!reportingEmployees[employee.id] && !loadingReporting[employee.id]) {
                              fetchReportingEmployees(employee.id);
                            }
                          }}
                          onFocus={() => {
                            if (!reportingEmployees[employee.id] && !loadingReporting[employee.id]) {
                              fetchReportingEmployees(employee.id);
                            }
                          }}
                          onChange={(event, value) => {
                            setReportingTo((prev) => ({ ...prev, [employee.id]: value }));
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Autocomplete
                          options={(() => {
                            const currentOptions = Array.isArray(headsOfDepartment[employee.id]) ? headsOfDepartment[employee.id] : [];
                            const currentValue = headOfDepartment[employee.id];

                            // If we have a current value but it's not in options, add it to show the selected value
                            if (currentValue && !currentOptions.find((opt) => opt.id === currentValue.id)) {
                              return [currentValue, ...currentOptions];
                            }
                            return currentOptions;
                          })()}
                          value={headOfDepartment[employee.id] || null}
                          loading={loadingReporting[employee.id] || false}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Select Head of Department"
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                  <>
                                    {loadingReporting[employee.id] ? <CircularProgress size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                  </>
                                )
                              }}
                            />
                          )}
                          getOptionLabel={(option) => option?.name || 'Self'}
                          onChange={(event, value) => {
                            setHeadOfDepartment((prev) => ({ ...prev, [employee.id]: value }));
                          }}
                          getOptionKey={(option) => option?.id || Math.random()}
                          isOptionEqualToValue={(option, value) => option?.id === value?.id}
                          fullWidth
                          size="small"
                          onOpen={() => {
                            if (!headsOfDepartment[employee.id] && !loadingReporting[employee.id]) {
                              fetchReportingEmployees(employee.id);
                            }
                          }}
                          onFocus={() => {
                            if (!headsOfDepartment[employee.id] && !loadingReporting[employee.id]) {
                              fetchReportingEmployees(employee.id);
                            }
                          }}
                        />
                      </TableCell>
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
    </>
  );
}

export default function EmployeeMasterDataIndex(props) {
  return <EmployeeList {...props} />;
}
