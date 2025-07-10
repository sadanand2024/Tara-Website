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
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import MainCard from 'ui-component/cards/MainCard';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import ActionCell from 'ui-component/extended/ActionCell';
import LeaveManagementDialog from './LeaveManagementDialog';
import Factory from 'utils/Factory';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'store';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function LeaveManagement({ handleBack, handleNext }) {
  const [leaveType, setLeaveType] = useState('All');
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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleOpenDeleteDialog = (designation) => {
    setSelectedRow(designation);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    if (payrollId) fetchData();
  }, [payrollId]);

  useEffect(() => {
    const filtered = leaveType === 'All' ? data : data.filter((d) => d.leave_type.toLowerCase() === leaveType.toLowerCase());
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

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <MainCard
      title={
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="subtitle1">Leave Type</Typography>
            <CustomAutocomplete
              value={leaveType}
              options={['All', 'Paid', 'UnPaid']}
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
            <Table size="small">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  {['S.No', 'Leave Name', 'Code', 'Type', 'Period', 'No of Leaves', 'Actions'].map((head, idx) => (
                    <TableCell key={idx} align="center" sx={{ fontWeight: 'bold', color: '#fff !important' }}>
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
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell align="center">{item.name_of_leave}</TableCell>
                      <TableCell align="center">{item.code}</TableCell>
                      <TableCell align="center">{item.leave_type}</TableCell>
                      <TableCell align="center">{item.employee_leave_period}</TableCell>
                      <TableCell align="center">{item.number_of_leaves}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <IconButton size="small" color="primary" onClick={() => openDialog('edit', item)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(item)}>
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
        )}
        {filteredData.length > 0 && (
          <Stack direction="row" justifyContent="space-between" py={2}>
            <Button size="small" startIcon={<ArrowBackIcon />} variant="outlined" onClick={handleBack}>
              Back
            </Button>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={(_, val) => setPage(val)}
              shape="rounded"
              color="primary"
            />
            <Typography></Typography>
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
