// 📁 File: Designations.jsx

import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Grid2,
  Typography
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';
import DesignationDialog from './DesignationDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
function Designations() {
  const [designations, setDesignations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const payrollid = searchParams.get('payrollid');

  const paginatedData = designations.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    if (payrollid) fetchDesignations();
  }, [payrollid]);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const fetchDesignations = async () => {
    const url = `/payroll/designations/?payroll_id=${payrollid}`;
    const { res } = await Factory('get', url, {});

    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setDesignations(res.data);
    } else {
      setDesignations([]);
    }
  };

  const handleEdit = (designation) => {
    setPostType('edit');
    setSelectedRecord(designation);
    handleOpenDialog();
  };

  const handleDelete = async (designation) => {
    const url = `/payroll/designations/${designation.id}/`;
    const { res } = await Factory('delete', url, {});
    if (res?.status_cd === 0) {
      fetchDesignations();
    }
  };

  return (
    <MainCard
      title="Designation Details"
      secondary={
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setPostType('post');
            handleOpenDialog();
          }}
        >
          Add Designation
        </Button>
      }
    >
      <Grid2 container spacing={3}>
        <Grid2 xs={12}>
          <DesignationDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleOpenDialog={handleOpenDialog}
            selectedRecord={selectedRecord}
            type={postType}
            setType={setPostType}
            fetchDesignations={fetchDesignations}
          />
        </Grid2>

        <TableContainer component={Paper} sx={{ width: '100%', borderRadius: 2, boxShadow: 1, overflowX: 'auto' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {['S No', 'Designation Name', 'No of Employees', 'Actions'].map((header, idx) => (
                  <TableCell
                    key={idx}
                    align={['S No', 'No of Employees', 'Actions'].includes(header) ? 'center' : 'left'}
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
                  <TableCell colSpan={4} align="center" sx={{ height: 300 }}>
                    <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new Data." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((designation, idx) => (
                  <TableRow key={designation.id} hover sx={{ minHeight: 56, '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell align="center">{(currentPage - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{designation.designation_name || 'N/A'}</TableCell>
                    <TableCell align="center">{designation.employee_count || 0}</TableCell>
                    <TableCell align="center">
                      <ActionCell
                        row={designation}
                        onEdit={() => handleEdit(designation)}
                        onDelete={() => handleDelete(designation)}
                        open={openDialog}
                        onClose={handleCloseDialog}
                        deleteDialogData={{
                          title: 'Delete Record',
                          heading: 'Are you sure you want to delete this Record?',
                          description: `This action will remove ${designation.designation_name} from the list.`,
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

        {designations.length > 0 && (
          <Grid2 size={12}>
            <Stack direction="row" justifyContent="center" sx={{ mt: 2 }}>
              <Pagination
                count={Math.ceil(designations.length / rowsPerPage)}
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
  );
}

export default Designations;
