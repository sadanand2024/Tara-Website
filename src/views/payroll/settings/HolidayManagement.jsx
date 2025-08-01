import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress,
  Tooltip
} from '@mui/material';
import { IconPlus, IconReload, IconFilter } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

import ActionCell from 'ui-component/extended/ActionCell';
import Factory from 'utils/Factory';
import HolidayManagementDialog from './HolidayManagementDialog';
import FilterDialog from './FilterDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

function HolidayManagement({ handleBack, handleNext, onAddClick }) {
  const [holidayManagementData, setHolidayManagementData] = useState([]);
  const [workLocations, setWorkLocations] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [financialYear, setFinancialYear] = useState('2024-25');
  const [selectedWorkLocation, setSelectedWorkLocation] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [filterDialog, setFilterDialog] = useState(false);

  const [postType, setPostType] = useState('');
  const [payrollId, setPayrollId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const navigate = useNavigate();

  // Expose the dialog opening function to parent
  useEffect(() => {
    if (onAddClick) {
      window.triggerHolidayAddDialog = () => {
        setPostType('add');
        setSelectedRecord(null);
        setOpenDialog(true);
      };
    }
    return () => {
      delete window.triggerHolidayAddDialog;
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
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();
  const paginatedData = holidayManagementData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const dispatch = useDispatch();

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    if (payrollId) {
      fetchHolidayManagementData();
      fetchWorkLocations();
    }
  }, [payrollId]);

  const handlePageChange = (_, value) => setCurrentPage(value);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const fetchHolidayManagementData = async () => {
    setLoading(true);
    const { res } = await Factory('get', `/payroll/holiday-management?payroll_id=${payrollId}`, {});
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setHolidayManagementData(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch data, Please Try again',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setHolidayManagementData([]);
    }
    setLoading(false);
  };

  const fetchWorkLocations = async () => {
    setLoading(true);
    const { res } = await Factory('get', `/payroll/work-locations/?payroll_id=${payrollId}`, {});
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setWorkLocations(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch work locations, Please Try again',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setWorkLocations([]);
    }
    setLoading(false);
  };

  const fetchByFilter = async () => {
    setLoading(true);
    const { res } = await Factory(
      'get',
      `/payroll/holiday-management-filter?payroll_id=${payrollId}&financial_year=${financialYear}&applicable_for=${selectedWorkLocation || ''}`,
      {}
    );
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setHolidayManagementData(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch filtered data, Please Try again',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setHolidayManagementData([]);
    }
    setLoading(false);
    setFilterDialog(false);
  };

  const handleEdit = (item) => {
    setPostType('edit');
    setSelectedRecord(item);
    handleOpenDialog();
  };

  const handleDelete = async (item) => {
    const { res } = await Factory('delete', `/payroll/holiday-management/${item.id}`, {});
    if (res?.status_cd === 0) {
      fetchHolidayManagementData();
      dispatch(
        openSnackbar({
          open: true,
          message: 'Holiday Record deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete holiday record',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  return (
    <Box>
      {/* Action buttons */}
      {/* <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<IconFilter />} onClick={() => setFilterDialog(true)} size="small">
            Filter
          </Button>
          <Button variant="outlined" startIcon={<IconReload />} onClick={fetchHolidayManagementData} size="small">
            Reset
          </Button>
        </Stack>
      </Box> */}

      <Stack spacing={3}>
        {loading ? (
          <Stack direction="row" justifyContent="center" alignItems="center" sx={{ minHeight: 300 }}>
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
            <Table size="small">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  {['S.No', 'Holiday Name', 'Date', 'Description', 'Locations', 'Actions'].map((header, idx) => (
                    <TableCell
                      key={idx}
                      sx={{ fontWeight: 'bold', textAlign: idx === 0 || idx === 5 ? 'center' : 'left', color: '#fff !important' }}
                    >
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ height: 250 }}>
                      <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new Data." />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={item.id} hover>
                      <TableCell sx={{ whiteSpace: 'nowrap' }} align="center">
                        {(currentPage - 1) * rowsPerPage + index + 1}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
                        {item.holiday_name}
                      </TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">{`${item.start_date} - ${item.end_date}`}</TableCell>
                      <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
                        <Tooltip arrow title={item.description || 'N/A'}>
                          <span>{item.description?.length > 30 ? `${item.description.slice(0, 30)}...` : item.description || 'N/A'}</span>
                        </Tooltip>
                      </TableCell>
                      {/* <TableCell align="left">{item.applicable_for}</TableCell> */}
                      <TableCell align="left">
                        <Tooltip
                          arrow
                          title={
                            Array.isArray(item.applicable_for) && item.applicable_for.length > 0 ? item.applicable_for.join(', ') : 'N/A'
                          }
                        >
                          <span>
                            {Array.isArray(item.applicable_for) && item.applicable_for.length > 0
                              ? item.applicable_for.slice(0, 3).join(', ') + (item.applicable_for.length > 3 ? '...' : '')
                              : 'N/A'}
                          </span>
                        </Tooltip>
                      </TableCell>

                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <IconButton size="small" color="primary" onClick={() => handleEdit(item)}>
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

        <Stack direction="row" justifyContent="space-between" sx={{ py: 2 }}>
          <Button size="small" variant="outlined" onClick={handleBack}>
            Back
          </Button>
          {holidayManagementData.length > 0 && (
            <Pagination
              count={Math.ceil(holidayManagementData.length / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              shape="rounded"
              color="primary"
            />
          )}
          <Stack direction="row" spacing={2}>
            <Button size="small" variant="contained" onClick={handleNext}>
              Next
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Dialogs */}
      <HolidayManagementDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleOpenDialog={handleOpenDialog}
        selectedRecord={selectedRecord}
        type={postType}
        setType={setPostType}
        fetchHolidayManagementData={fetchHolidayManagementData}
        workLocations={workLocations}
      />

      <FilterDialog
        open={filterDialog}
        financialYear={financialYear}
        setFinancialYear={setFinancialYear}
        setFilterDialog={setFilterDialog}
        workLocations={workLocations}
        selectedWorkLocation={selectedWorkLocation}
        setSelectedWorkLocation={setSelectedWorkLocation}
        fetch_by_filter={fetchByFilter}
      />
    </Box>
  );
}

export default HolidayManagement;
