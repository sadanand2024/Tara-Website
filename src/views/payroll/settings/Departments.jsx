// 📁 File: Departments.jsx

'use client';
import React, { useState, useEffect } from 'react';
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
  Typography,
  Grid2
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';
import DepartmentDialog from './DepartmentDialog';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function Departments() {
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [postType, setPostType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rowsPerPage = 8;
  const paginatedData = departments.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const payrollid = searchParams.get('payrollid');

  useEffect(() => {
    if (payrollid) fetchDepartments();
  }, [payrollid]);

  const handlePageChange = (event, value) => setCurrentPage(value);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const fetchDepartments = async () => {
    const url = `/payroll/departments/?payroll_id=${payrollid}`;
    const { res } = await Factory('get', url, {});

    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setDepartments(res.data);
    } else {
      setDepartments([]);
    }
  };

  const handleEdit = (department) => {
    setPostType('edit');
    setSelectedRecord(department);
    handleOpenDialog();
  };

  const handleDelete = async (department) => {
    const url = `/payroll/departments/${department.id}/`;
    const { res } = await Factory('delete', url, {});

    if (res?.status_cd === 0) {
      fetchDepartments();
    }
  };

  return (
    <MainCard
      title="Departments Details"
      secondary={
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setPostType('post');
            handleOpenDialog();
          }}
        >
          Add Department
        </Button>
      }
    >
      <Grid2 container spacing={{ xs: 2, sm: 3 }}>
        <Grid2 xs={12}>
          <DepartmentDialog
            open={openDialog}
            handleClose={handleCloseDialog}
            handleOpenDialog={handleOpenDialog}
            selectedRecord={selectedRecord}
            type={postType}
            setType={setPostType}
            fetchDepartments={fetchDepartments}
          />
        </Grid2>

        <TableContainer component={Paper} sx={{ width: '100%', borderRadius: 2, boxShadow: 1, overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {['S No', 'Department Name', 'Department Code', 'Description', 'No of Employees', 'Actions'].map((header, idx) => (
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
                  <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
                    No Data
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((department, idx) => (
                  <TableRow key={department.id} hover sx={{ minHeight: 56, '&:hover': { bgcolor: 'action.hover' } }}>
                    <TableCell align="center">{(currentPage - 1) * rowsPerPage + idx + 1}</TableCell>
                    <TableCell>{department.dept_name || 'N/A'}</TableCell>
                    <TableCell>{department.dept_code || 'N/A'}</TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {department.description || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{department.numOfEmployees || 0}</TableCell>
                    <TableCell align="center">
                      <ActionCell
                        row={department}
                        onEdit={() => handleEdit(department)}
                        onDelete={() => handleDelete(department)}
                        open={openDialog}
                        onClose={handleCloseDialog}
                        deleteDialogData={{
                          title: 'Delete Record',
                          heading: 'Are you sure you want to delete this Record?',
                          description: `This action will remove ${department.dept_name} from the list.`,
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

        {departments.length > rowsPerPage && (
          <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
            <Pagination count={Math.ceil(departments.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
          </Stack>
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

export default Departments;
