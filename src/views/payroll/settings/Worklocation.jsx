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
import SearchBar from 'ui-component/extended/SearchBar';
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
import DeleteDialog from '../../../ui-component/extended/DeleteDialog'; // adjust path accordingly
import { IconButton, Tooltip } from '@mui/material'; // Add these if not already
import { Edit, Delete } from '@mui/icons-material';
import BulkUploadDialog from 'ui-component/extended/BulkUploadDialog';
import AddIcon from '@mui/icons-material/Add';

function Worklocation({ handleBack, handleNext }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [workLocations, setWorkLocations] = useState([]);
  const [payrollid, setPayrollId] = useState(null);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  // Filter workLocations based on searchQuery
  const filteredWorkLocations = workLocations.filter((location) => {
    const query = searchQuery.toLowerCase();
    return (
      location.location_name?.toLowerCase().includes(query) ||
      location.location_code?.toLowerCase().includes(query) ||
      location.address?.toLowerCase().includes(query)
    );
  });
  const paginatedData = filteredWorkLocations.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenDeleteDialog = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  const closeBulkDialog = () => {
    setOpenBulkDialog(false);
  };

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
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2
        }}
      >
        <CircularProgress size={50} />
        <Typography variant="h5" color="text.secondary">
          Loading Work Location...
        </Typography>
      </Box>
    );
  }
  return (
    <MainCard
      title="Work Location"
      subtitle="Manage your work locations for seamless operations"
      secondary={
        <Stack direction="row" spacing={2} alignItems="center">
          <SearchBar
            placeholder="Search work location..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <Button
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            Add Work Location
          </Button>
        </Stack>
      }
    >
      <BulkUploadDialog
        open={openBulkDialog}
        handleClose={closeBulkDialog}
        getData={fetchWorkLocations}
        payrollid={payrollid}
        type="Work Locations"
        bulkUploadUrl="/payroll/work-locations/bulk-upload/"
        xlsxTemplateUrl="/payroll/download-template/xlsx?type=work_location"
        csvTemplateUrl="/payroll/download-template/csv?type=work_location"
      />

      <WorkLocationDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        fetchWorkLocations={fetchWorkLocations}
        selectedRecord={selectedRecord}
        type={postType}
        setType={setPostType}
      />

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
          <TableHead
            sx={{
              backgroundColor: 'primary.main',
              '& .MuiTableCell-root': {
                color: '#ffffff !important'
              }
            }}
          >
            <TableRow>
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
                  <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new Data." />
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
                      {location.address_line1
                        ? `${location.address_line1}${location.address_line2 ? `, ${location.address_line2}` : ''}`
                        : 'N/A'}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">{location.address_state || 'N/A'}</TableCell>
                  <TableCell align="center">{location.employee_count || 0}</TableCell>
                  <TableCell align="center">
                    {index !== 0 && (
                      <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                        <IconButton size="small" color="primary" onClick={() => handleEdit(location)}>
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(location)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    )}
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
            heading: 'Are you sure?',
            description: 'This action will permanently delete the record.'
          }}
        />
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
          Back
        </Button>
        {workLocations.length > 0 && (
          <Pagination
            count={Math.ceil(filteredWorkLocations.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            color="primary"
          />
        )}
        <Button size="small" variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </MainCard>
  );
}

export default Worklocation;
