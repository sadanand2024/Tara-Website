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
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import DesignationDialog from './DesignationDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import BulkUploadDialog from 'ui-component/extended/BulkUploadDialog';
function Designations() {
  const [designations, setDesignations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [openBulkDialog, setOpenBulkDialog] = useState(false);
  const handleOpenDeleteDialog = (designation) => {
    setSelectedRow(designation);
    setOpenDeleteDialog(true);
  };
  const closeBulkDialog = () => {
    setOpenBulkDialog(false);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
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
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="secondary" onClick={() => setOpenBulkDialog(true)}>
            Bulk Upload
          </Button>
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
        </Stack>
      }
    >
      <BulkUploadDialog
        open={openBulkDialog}
        handleClose={closeBulkDialog}
        getData={fetchDesignations}
        payrollid={payrollid}
        type="Designations"
        bulkUploadUrl="/payroll/designations/"
        xlsxTemplateUrl="/payroll/download-template/xlsx?type=designation"
        csvTemplateUrl="/payroll/download-template/csv?type=designation"
      />
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
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
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {['S No', 'Designation Name', 'No of Employees', 'Actions'].map((header, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      fontSize: '0.9rem',
                      textAlign: ['S No', 'No of Employees', 'Actions'].includes(header) ? 'center' : 'left'
                    }}
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
                    <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding new data." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((designation, idx) => (
                  <TableRow key={designation.id} hover sx={{ minHeight: 56, '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell align="center">{(currentPage - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{designation.designation_name || 'N/A'}</TableCell>
                    <TableCell align="center">{designation.employee_count || 0}</TableCell>
                    <TableCell align="center" sx={{ width: '120px' }}>
                      <Box display="flex" justifyContent="center" alignItems="center" gap={1} sx={{ width: '100%' }}>
                        <IconButton color="primary" onClick={() => handleEdit(designation)}>
                          <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDeleteDialog(designation)}>
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Delete Dialog */}
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

        {/* Pagination */}

        {designations.length > 0 && (
          <Grid2 size={{ xs: 12 }}>
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
