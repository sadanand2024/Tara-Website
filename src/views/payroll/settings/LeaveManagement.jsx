import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Typography,
  Button,
  Box,
  Pagination,
  CircularProgress // Import CircularProgress
} from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
import LeaveManagementDialog from './LeaveManagementDialog';
import ActionCell from '@/utils/ActionCell';
import MainCard from '@/components/MainCard';
import { useSearchParams } from 'next/navigation';
import { useSnackbar } from '@/components/CustomSnackbar';
import Factory from '@/utils/Factory';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import HomeCard from '@/components/cards/HomeCard';
import Loader from '@/components/PageLoader';

function LeaveManagement() {
  const { showSnackbar } = useSnackbar();
  const [leaveType, setLeaveType] = useState('2024-25');
  const [loading, setLoading] = useState(false);
  const [payrollId, setPayrollId] = useState(null);
  const [leaveManagementData, setLeaveManagementData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [postType, setPostType] = useState('');
  const searchParams = useSearchParams();
  const rowsPerPage = 5;

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  const fetchLeaveManagementData = async () => {
    setLoading(true); // Set loading state to true when starting data fetch
    const url = `/payroll/leave-management?payroll_id=${payrollId}`;

    const { res, error } = await Factory('get', url, {});
    setLoading(false); // Set loading state to false once data fetching is complete

    console.log(res);

    if (res.status_cd === 0) {
      setLeaveManagementData(Array.isArray(res.data) ? res.data : []);
    } else {
      showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  const handleEdit = (item) => {
    setPostType('edit');
    setSelectedRecord(item);
    handleOpenDialog();
  };
  const handleDelete = async (item) => {
    let url = `/payroll/leave-management/${item.id}`;
    const { res } = await Factory('delete', url, {});
    console.log(res);
    if (res.status_cd === 1) {
      showSnackbar(JSON.stringify(res?.data?.data || error), 'error');
    } else {
      showSnackbar('Record Deleted Successfully', 'success');
      fetchLeaveManagementData();
    }
  };
  const handlePageChange = (event, value) => setCurrentPage(value);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const paginatedData = leaveManagementData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  useEffect(() => {
    if (payrollId) fetchLeaveManagementData();
  }, [payrollId]);
  return (
    <HomeCard
      title={
        <Box>
          <Typography variant="subtitle1">Leave Type</Typography>
          <CustomAutocomplete
            options={[]}
            value={leaveType}
            onChange={(e, val) => setLeaveType(val)}
            sx={{ minWidth: 200, maxWidth: 200 }}
          />
        </Box>
      }
      CustomElement={() => (
        <Stack direction="row" sx={{ gap: 2 }}>
          <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpenDialog}>
            Add Leave Management
          </Button>
        </Stack>
      )}
    >
      <MainCard>
        <Stack spacing={3}>
          {loading ? (
            <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: 400 }}>
              <Loader />
            </Stack>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Leave Name</TableCell>
                    <TableCell>Code</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Period</TableCell>
                    <TableCell>No of Leaves</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ height: 300 }}>
                        <EmptyTable msg="No Data available" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => (
                      <TableRow key={item.id || item.code}>
                        <TableCell>{item.name_of_leave}</TableCell>
                        <TableCell>{item.code}</TableCell>
                        <TableCell>{item.leave_type}</TableCell>
                        <TableCell>{item.employee_leave_period}</TableCell>
                        <TableCell>{item.number_of_leaves}</TableCell>
                        <TableCell>
                          <ActionCell
                            row={item}
                            onEdit={() => handleEdit(item)}
                            onDelete={() => handleDelete(item)}
                            open={openDialog}
                            onClose={handleCloseDialog}
                            deleteDialogData={{
                              title: 'Delete Record',
                              heading: 'Are you sure you want to delete this Record?',
                              description: `This action will remove ${item.name_of_leave} from the list.`,
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
          )}

          {leaveManagementData.length > 0 && !loading && (
            <Stack direction="row" justifyContent="center" py={1.5}>
              <Pagination count={Math.ceil(leaveManagementData.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
            </Stack>
          )}
        </Stack>

        <LeaveManagementDialog
          open={openDialog}
          handleClose={handleCloseDialog}
          selectedRecord={selectedRecord}
          type={postType}
          setType={setPostType}
          fetchLeaveManagementData={fetchLeaveManagementData}
        />
      </MainCard>
    </HomeCard>
  );
}

export default LeaveManagement;
