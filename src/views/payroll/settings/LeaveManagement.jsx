import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Pagination,
  CircularProgress
} from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';

import MainCard from 'ui-component/cards/MainCard';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import ActionCell from 'ui-component/extended/ActionCell';
import LeaveManagementDialog from './LeaveManagementDialog';
import Factory from 'utils/Factory';

function LeaveManagement() {
  const [leaveType, setLeaveType] = useState('Paid');
  const [loading, setLoading] = useState(false);
  const [payrollId, setPayrollId] = useState(null);
  const [leaveManagementData, setLeaveManagementData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [postType, setPostType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [allLeaveManagementData, setAllLeaveManagementData] = useState([]);
  const [filteredLeaveData, setFilteredLeaveData] = useState([]);

  const rowsPerPage = 5;
  const [searchParams] = useSearchParams();
  const paginatedData = filteredLeaveData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    if (payrollId) fetchLeaveManagementData();
  }, [payrollId]);

  const handlePageChange = (_, value) => setCurrentPage(value);

  const fetchLeaveManagementData = async () => {
    setLoading(true);
    const { res } = await Factory('get', `/payroll/leave-management?payroll_id=${payrollId}`, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setAllLeaveManagementData(res.data);
    } else {
      setAllLeaveManagementData([]);
    }
  };
  useEffect(() => {
    const filtered = allLeaveManagementData.filter((item) => item.leave_type.toLowerCase() === leaveType.toLowerCase());
    setFilteredLeaveData(filtered);
    setCurrentPage(1); // Reset to first page on filter change
  }, [leaveType, allLeaveManagementData]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleEdit = (item) => {
    setPostType('edit');
    setSelectedRecord(item);
    handleOpenDialog();
  };

  const handleDelete = async (item) => {
    const { res } = await Factory('delete', `/payroll/leave-management/${item.id}`, {});
    if (res?.status_cd === 0) {
      fetchLeaveManagementData();
    }
  };

  return (
    <MainCard
      title={
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          {/* Left Side - Leave Type Dropdown */}
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Leave Type
            </Typography>
            <CustomAutocomplete
              value={leaveType}
              options={['Paid', 'UnPaid']}
              onChange={(e, val) => setLeaveType(val)}
              sx={{ minWidth: 220 }}
            />
          </Box>

          {/* Right Side - Add Leave Button */}
          <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpenDialog}>
            Add Leave
          </Button>
        </Stack>
      }
    >
      <Stack spacing={3}>
        {loading ? (
          <Stack justifyContent="center" alignItems="center" sx={{ height: 300 }}>
            <CircularProgress />
          </Stack>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              width: '100%',
              borderRadius: 2,
              boxShadow: 1,
              overflowX: 'auto'
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  {['Leave Name', 'Code', 'Type', 'Period', 'No of Leaves', 'Actions'].map((head, idx) => (
                    <TableCell key={idx} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold', textAlign: 'center' }}>
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
                      No Data
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{item.name_of_leave}</TableCell>
                      <TableCell align="center">{item.code}</TableCell>
                      <TableCell align="center">{item.leave_type}</TableCell>
                      <TableCell align="center">{item.employee_leave_period}</TableCell>
                      <TableCell align="center">{item.number_of_leaves}</TableCell>
                      <TableCell align="center">
                        <ActionCell
                          row={item}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item)}
                          open={openDialog}
                          onClose={handleCloseDialog}
                          deleteDialogData={{
                            title: 'Delete Leave',
                            heading: 'Are you sure you want to delete this Leave?',
                            description: `This action will remove ${item.name_of_leave}.`,
                            successMessage: 'Leave deleted successfully'
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

        {filteredLeaveData.length > 0 && (
          <Stack direction="row" justifyContent="center" py={2}>
            <Pagination count={Math.ceil(filteredLeaveData.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
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
  );
}

export default LeaveManagement;
