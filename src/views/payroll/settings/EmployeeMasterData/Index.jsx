'use client';
import React, { useEffect, useState } from 'react';
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
  Grid2,
  Pagination,
  Box
} from '@mui/material';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import HomeCard from '@/components/cards/HomeCard';
import Factory from '@/utils/Factory';
import { useSearchParams } from 'next/navigation';
import ActionCell from '@/utils/ActionCell';
import { useSnackbar } from '@/components/CustomSnackbar';
import Loader from '@/components/PageLoader';
import MainCard from '@/components/MainCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { usePathname, useRouter } from 'next/navigation';

function EmployeeList() {
  const [openDialog, setOpenDialog] = useState(false); // Controls dialog visibility
  const [workLocations, setWorkLocations] = useState([]); // Stores the list of work locations
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const [postType, setPostType] = useState(''); // Payroll ID fetched from URL
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader
  const [currentPage, setCurrentPage] = useState(1);
  const [employeeMasterData, setEmployeeMasterData] = useState([]);
  const pathname = usePathname();

  const rowsPerPage = 8;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const paginatedData = employeeMasterData?.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const handleCloseDialog = () => setOpenDialog(false);

  const handleEdit = (item) => {
    setSelectedRecord(item);
    router.push(`/payrollsetup/add-employee?employee_id=${encodeURIComponent(item.id)}&payrollid=${encodeURIComponent(payrollid)}`);
  };
  const handleDelete = async (item) => {
    // let url = `/payroll/work-locations/delete/${item.id}/`;
    // const { res } = await Factory('delete', url, {});
    // if (res.status_cd === 1) {
    //   showSnackbar(JSON.stringify(res.data), 'error');
    // } else {
    //   showSnackbar('Record Deleted Successfully', 'success');
    //   fetchWorkLocations();
    // }
  };
  // Fetch data when payrollid changes

  const fetch_employee_master_data = async () => {
    setLoading(true);
    const url = `/payroll/employees?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setEmployeeMasterData(res?.data); // Successfully set work locations
    } else {
      setEmployeeMasterData([]);
      showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    }
  };
  useEffect(() => {
    if (payrollid) {
      fetch_employee_master_data();
    }
  }, [payrollid]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <HomeCard
          title="Employee Mater Data"
          tagline="Create and manage Employees of Your Organization."
          CustomElement={() => (
            <Stack direction="row" sx={{ gap: 2 }}>
              <Button variant="contained" onClick={() => router.push(`/payrollsetup/add-employee?payrollid=${payrollid}`)}>
                Add Employee
              </Button>
            </Stack>
          )}
        >
          <MainCard>
            <Grid2 container spacing={{ xs: 2, sm: 3 }}>
              <Grid2 size={12}>
                <TableContainer component={Paper}>
                  <Table size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Employee ID</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Employee Name</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Department</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Designation</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Email</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Status</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {/* Check if workLocations is valid and has data */}
                      {paginatedData?.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} sx={{ height: 300 }}>
                            <EmptyTable msg="No work locations available" />
                          </TableCell>
                        </TableRow>
                      ) : (
                        paginatedData?.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.first_name + ' ' + item.last_name}</TableCell>
                            <TableCell>{item.department_name}</TableCell>
                            <TableCell>{item.designation_name}</TableCell>
                            <TableCell>{item.work_email}</TableCell>
                            <TableCell>{item.work_email}</TableCell>
                            <TableCell>
                              <ActionCell
                                row={item} // Pass the customer row data
                                onEdit={() => handleEdit(item)} // Edit handler
                                onDelete={() => handleDelete(item)} // Delete handler
                                open={openDialog}
                                onClose={handleCloseDialog}
                                deleteDialogData={{
                                  title: 'Delete Record',
                                  heading: 'Are you sure you want to delete this Record?',
                                  description: `This action will remove ${item.location_name} from the list.`,
                                  successMessage: 'Record has been deleted.'
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {workLocations.length > 0 && (
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
                    <Pagination count={Math.ceil(workLocations.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
                  </Stack>
                )}
              </Grid2>
            </Grid2>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => {
                  router.back();
                }}
              >
                Back to Dashboard
              </Button>
            </Box>
          </MainCard>
        </HomeCard>
      )}
    </>
  );
}

export default EmployeeList;
