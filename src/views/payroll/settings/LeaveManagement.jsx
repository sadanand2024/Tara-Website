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
  CircularProgress,
  Autocomplete,
  TextField
} from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
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

function LeaveManagement({ handleBack, handleNext, leaveType = 'All', setLeaveType, onAddClick }) {
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
  const navigate = useNavigate();
  // Expose the dialog opening function to parent
  useEffect(() => {
    if (onAddClick) {
      window.triggerLeaveAddDialog = () => {
        setPostType('add');
        setSelectedRecord(null);
        setDialogOpen(true);
      };
    }
    return () => {
      delete window.triggerLeaveAddDialog;
    };
  }, [onAddClick]);

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
          message: res.error || 'Unknown Error',
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
    if (res?.status_cd === 0) {
      if (res?.status_cd === 0) {
        fetchData();
        dispatch(
          openSnackbar({
            open: true,
            message: 'Leave Record deleted successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to delete leave record',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  };

  const openDialog = (type = '', record = null) => {
    setPostType(type);
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box>
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
                    <TableCell
                      key={idx}
                      sx={{ fontWeight: 'bold', color: '#fff !important', textAlign: idx === 0 || idx === 6 ? 'center' : 'left' }}
                    >
                      {head}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ height: 300 }}>
                      No Data
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell align="center">{(page - 1) * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="left">{item.name_of_leave}</TableCell>
                      <TableCell align="left">{item.code}</TableCell>
                      <TableCell align="left">{item.leave_type}</TableCell>
                      <TableCell align="left">{item.employee_leave_period}</TableCell>
                      <TableCell align="left">{item.number_of_leaves}</TableCell>
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
            <Button size="small" variant="contained" onClick={() => navigate('/app/payroll')}>
              Next
            </Button>
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
    </Box>
  );
}

export default LeaveManagement;
