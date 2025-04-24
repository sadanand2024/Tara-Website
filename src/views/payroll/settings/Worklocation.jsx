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
import WorkLocationDialog from './WorkLocationDialog';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import HomeCard from '@/components/cards/HomeCard';
import Factory from '@/utils/Factory';
import { useSearchParams } from 'next/navigation';
import ActionCell from '@/utils/ActionCell';
import { useSnackbar } from '@/components/CustomSnackbar';
import { useRouter } from 'next/navigation';
import Loader from '@/components/PageLoader';
import MainCard from '@/components/MainCard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Worklocation() {
  const [openDialog, setOpenDialog] = useState(false); // Controls dialog visibility
  const [workLocations, setWorkLocations] = useState([]); // Stores the list of work locations
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const [postType, setPostType] = useState(''); // Payroll ID fetched from URL
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false); // State for loader
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const paginatedData = workLocations.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const { showSnackbar } = useSnackbar();
  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const handleOpenDialog = () => setOpenDialog(true);

  const handleCloseDialog = () => setOpenDialog(false);

  const fetchWorkLocations = async () => {
    setLoading(true);
    const url = `/payroll/work-locations/?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setWorkLocations(res?.data); // Successfully set work locations
    } else {
      setWorkLocations([]);
      showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    }
  };
  const handleEdit = (location) => {
    setPostType('edit');
    setSelectedRecord(location);
    handleOpenDialog();
  };
  const handleDelete = async (location) => {
    console.log(location);
    let url = `/payroll/work-locations/delete/${location.id}/`;
    const { res } = await Factory('delete', url, {});
    console.log(res);
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res.data), 'error');
    } else {
      showSnackbar('Record Deleted Successfully', 'success');
      fetchWorkLocations();
    }
  };
  // Fetch data when payrollid changes

  useEffect(() => {
    if (payrollid !== null) fetchWorkLocations();
  }, [payrollid]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <HomeCard
          title="Work Location Details"
          tagline="Create and manage different locations of Your Organization."
          CustomElement={() => (
            <Stack direction="row" sx={{ gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setPostType('post');
                  handleOpenDialog();
                }}
              >
                Add Work Location
              </Button>
              {/* <Button variant="outlined" color="primary" disabled>
                Import
              </Button> */}
            </Stack>
          )}
        >
          <MainCard>
            <Grid2 container spacing={{ xs: 2, sm: 3 }}>
              <Grid2 size={12}>
                <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                  <WorkLocationDialog
                    open={openDialog}
                    handleClose={handleCloseDialog}
                    fetchWorkLocations={fetchWorkLocations} // Pass the fetch function to the dialog
                    selectedRecord={selectedRecord}
                    type={postType}
                    setType={setPostType}
                  />
                </Stack>
              </Grid2>

              <Grid2 size={12}>
                <TableContainer component={Paper}>
                  <Table size="large">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>S No</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Address</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>State</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>No of Employees</TableCell>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Actions</TableCell>
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
                        paginatedData?.map((location, index) => (
                          <TableRow key={location.id}>
                            <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                            <TableCell>{location.location_name || 'N/A'}</TableCell>
                            <TableCell>
                              {`${location.address_line1}, ${location.address_line2}`?.length > 30
                                ? `${location.address_line1?.substring(0, 20)}...`
                                : `${location.address_line1} , ${location.address_line2}` || 'N/A'}
                            </TableCell>
                            <TableCell>{location.address_state || 'N/A'}</TableCell>
                            <TableCell>{location.employees || 0}</TableCell>
                            <TableCell>
                              {index !== 0 && (
                                <ActionCell
                                  row={location} // Pass the customer row data
                                  onEdit={() => handleEdit(location)} // Edit handler
                                  onDelete={() => handleDelete(location)} // Delete handler
                                  open={openDialog}
                                  onClose={handleCloseDialog}
                                  deleteDialogData={{
                                    title: 'Delete Record',
                                    heading: 'Are you sure you want to delete this Record?',
                                    description: `This action will remove ${location.location_name} from the list.`,
                                    successMessage: 'Record has been deleted.'
                                  }}
                                />
                              )}
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

export default Worklocation;
