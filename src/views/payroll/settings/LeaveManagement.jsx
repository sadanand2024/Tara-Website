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
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'store';
const ROWS_PER_PAGE = 5;

function LeaveManagement() {
  const [leaveType, setLeaveType] = useState('Paid');
  const [loading, setLoading] = useState(false);
  const [payrollId, setPayrollId] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [postType, setPostType] = useState('');
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    if (payrollId) fetchData();
  }, [payrollId]);

  useEffect(() => {
    const filtered = data.filter((d) => d.leave_type.toLowerCase() === leaveType.toLowerCase());
    setFilteredData(filtered);
    setPage(1);
  }, [leaveType, data]);

  const fetchData = async () => {
    setLoading(true);
    const { res } = await Factory('get', `/payroll/leave-management?payroll_id=${payrollId}`, {});
    setLoading(false);
    if (res?.status_cd === 0) {
      setData(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res.error || 'Unkown Error',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setData([]);
    }
  };

  const handleDelete = async (item) => {
    const { res } = await Factory('delete', `/payroll/leave-management/${item.id}`, {});
    if (res?.status_cd === 0) fetchData();
  };

  const openDialog = (type = '', record = null) => {
    setPostType(type);
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const paginatedData = filteredData.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  return (
    <MainCard
      title={
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="subtitle1">Leave Type</Typography>
            <CustomAutocomplete
              value={leaveType}
              options={['Paid', 'UnPaid']}
              onChange={(_, val) => setLeaveType(val)}
              sx={{ minWidth: 220 }}
            />
          </Box>
          <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={() => openDialog('add')}>
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
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  {['Leave Name', 'Code', 'Type', 'Period', 'No of Leaves', 'Actions'].map((head, idx) => (
                    <TableCell key={idx} align="center" sx={{ fontWeight: 'bold' }}>
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
                          onEdit={() => openDialog('edit', item)}
                          onDelete={() => handleDelete(item)}
                          open={dialogOpen}
                          onClose={() => setDialogOpen(false)}
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
        {filteredData.length > 0 && (
          <Stack direction="row" justifyContent="center" py={2}>
            <Pagination
              count={Math.ceil(filteredData.length / ROWS_PER_PAGE)}
              page={page}
              onChange={(_, val) => setPage(val)}
              shape="rounded"
              color="primary"
            />
          </Stack>
        )}
      </Stack>

      <LeaveManagementDialog
        open={dialogOpen}
        handleClose={() => setDialogOpen(false)}
        selectedRecord={selectedRecord}
        type={postType}
        setType={setPostType}
        fetchLeaveManagementData={fetchData}
      />
    </MainCard>
  );
}

export default LeaveManagement;
