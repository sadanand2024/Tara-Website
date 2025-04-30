import React, { useState, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  CircularProgress
} from '@mui/material';
import { IconPlus, IconReload, IconFilter } from '@tabler/icons-react';
import { useSearchParams } from 'react-router-dom';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';

import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';
import Factory from 'utils/Factory';
import HolidayManagementDialog from './HolidayManagementDialog';
import FilterDialog from './FilterDialog';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
function HolidayManagement() {
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

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

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
          message: 'Holiday deleted successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete holiday',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  return (
    <MainCard
      title={
        <Stack direction="row" spacing={1}>
          <Button variant="outlined" startIcon={<IconFilter />} onClick={() => setFilterDialog(true)}>
            Filter
          </Button>
          <Button variant="outlined" startIcon={<IconReload />} onClick={fetchHolidayManagementData}>
            Reset
          </Button>
        </Stack>
      }
      secondary={
        <Button variant="contained" startIcon={<IconPlus />} onClick={handleOpenDialog}>
          Add Holiday
        </Button>
      }
    >
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
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  {['Holiday Name', 'Date', 'Description', 'Locations', 'Actions'].map((header, idx) => (
                    <TableCell key={idx} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ height: 250 }}>
                      <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new Data." />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id} hover>
                      <TableCell align="center">{item.holiday_name}</TableCell>
                      <TableCell align="center">{`${item.start_date} - ${item.end_date}`}</TableCell>
                      <TableCell align="center">
                        {item.description?.length > 30 ? `${item.description.slice(0, 30)}...` : item.description || 'N/A'}
                      </TableCell>
                      <TableCell align="center">{item.applicable_for}</TableCell>
                      <TableCell align="center">
                        <ActionCell
                          row={item}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item)}
                          open={openDialog}
                          onClose={handleCloseDialog}
                          deleteDialogData={{
                            title: 'Delete Record',
                            heading: 'Are you sure you want to delete this holiday?',
                            description: `This action will remove ${item.holiday_name}.`,
                            successMessage: 'Holiday deleted successfully'
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

        {holidayManagementData.length > rowsPerPage && (
          <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
            <Pagination count={Math.ceil(holidayManagementData.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
          </Stack>
        )}
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

      {filterDialog && (
        <FilterDialog
          financialYear={financialYear}
          setFinancialYear={setFinancialYear}
          filterDialog={filterDialog}
          setFilterDialog={setFilterDialog}
          workLocations={workLocations}
          setSelectedWorkLoacation={setSelectedWorkLocation}
          fetch_by_filter={fetchByFilter}
        />
      )}
    </MainCard>
  );
}

export default HolidayManagement;
