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
  Box,
  Pagination,
  Grid2,
  Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from '../../../ui-component/extended/ActionCell';
import WorkLocationDialog from './WorkLocationDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';

function Worklocation() {
  const [openDialog, setOpenDialog] = useState(false);
  const [workLocations, setWorkLocations] = useState([]);
  const [payrollid, setPayrollId] = useState(null);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const paginatedData = workLocations.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handlePageChange = (event, value) => setCurrentPage(value);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    if (payrollid !== null) fetchWorkLocations();
  }, [payrollid]);

  const fetchWorkLocations = async () => {
    setLoading(true);
    const url = `/payroll/work-locations/?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setWorkLocations(res.data);
    } else {
      setWorkLocations([]);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const handleEdit = (location) => {
    setPostType('edit');
    setSelectedRecord(location);
    handleOpenDialog();
  };

  const handleDelete = async (location) => {
    const url = `/payroll/work-locations/delete/${location.id}/`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Record Deleted Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      fetchWorkLocations();
    }
  };

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <MainCard
          title="Work Location Details"
          secondary={
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
          }
        >
          <Grid2 container spacing={{ xs: 2, sm: 3 }}>
            <Grid2 xs={12}>
              <WorkLocationDialog
                open={openDialog}
                handleClose={handleCloseDialog}
                fetchWorkLocations={fetchWorkLocations}
                selectedRecord={selectedRecord}
                type={postType}
                setType={setPostType}
              />
            </Grid2>

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
                    {['S No', 'Name', 'Address', 'State', 'No of Employees', 'Actions'].map((header, idx) => (
                      <TableCell
                        key={idx}
                        align={['S No', 'State', 'No of Employees', 'Actions'].includes(header) ? 'center' : 'left'}
                        sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
                        <EmptyDataPlaceholder title="No Departments Found" subtitle="Start by adding a new department." />
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((location, index) => (
                      <TableRow
                        key={location.id}
                        hover
                        sx={{
                          minHeight: 56,
                          '&:hover': { bgcolor: 'action.hover' }
                        }}
                      >
                        <TableCell align="center">{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                        <TableCell>{location.location_name || 'N/A'}</TableCell>
                        <TableCell>
                          <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {location.address_line1 && location.address_line2
                              ? `${location.address_line1}, ${location.address_line2}`
                              : 'N/A'}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{location.address_state || 'N/A'}</TableCell>
                        <TableCell align="center">{location.employees || 0}</TableCell>
                        <TableCell align="center">
                          {index !== 0 && (
                            <ActionCell
                              row={location}
                              onEdit={() => handleEdit(location)}
                              onDelete={() => handleDelete(location)}
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
              <Grid2 size={12}>
                <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
                  <Pagination
                    count={Math.ceil(workLocations.length / rowsPerPage)}
                    page={currentPage}
                    onChange={handlePageChange}
                    shape="rounded"
                    color="primary"
                  />
                </Stack>
              </Grid2>
            )}
          </Grid2>
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
              Back to Dashboard
            </Button>
          </Box>
        </MainCard>
      )}
    </>
  );
}

export default Worklocation;
