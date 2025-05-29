import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid2,
  Pagination
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';
import Factory from 'utils/Factory';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { Edit, Delete } from '@mui/icons-material';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import IconButton from '@mui/material/IconButton';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';

function SalaryTemplateList() {
  const [salaryTemplates, setSalaryTemplates] = useState([]);
  const [payrollid, setPayrollId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const paginatedData = salaryTemplates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleOpenDeleteDialog = (template) => {
    setSelectedRow(template);
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

  const fetchSalaryTemplates = async () => {
    const url = `/payroll/salary-templates?payroll_id=${payrollid}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setSalaryTemplates(res.data || []);
    } else {
      setSalaryTemplates([]);
    }
  };

  const handleEdit = (template) => {
    navigate(`/payroll/settings/salary-template?template_id=${template.id}&payrollid=${payrollid}`);
  };

  const handleDelete = async (template) => {
    const url = `/payroll/salary-templates/${template.id}`;
    const { res } = await Factory('delete', url, {});
    if (res?.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Template deleted successfully!',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      fetchSalaryTemplates();
    }
  };

  useEffect(() => {
    if (payrollid) fetchSalaryTemplates();
  }, [payrollid]);

  return (
    <MainCard
      title="Salary Templates"
      secondary={
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary" onClick={() => navigate(`/payroll/settings/salary-template?payrollid=${payrollid}`)}>
            Create New Template
          </Button>
        </Stack>
      }
    >
      <Grid2 container spacing={3}>
        <Grid2 size={{ xs: 12 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.100' }}>
                  {['S.No', 'Template Name', 'Description', 'Status', 'Actions'].map((header, idx) => (
                    <TableCell key={idx} align={idx === 4 ? 'center' : 'left'} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ height: 300 }}>
                      <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new Data." />
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((template, index) => (
                    <TableRow key={template.id} hover>
                      <TableCell align="left">{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                      <TableCell align="left">{template.template_name}</TableCell>
                      <TableCell align="left">{template.description || '-'}</TableCell>
                      <TableCell align="left">{template.status === true ? 'Active' : 'Inactive'}</TableCell>
                      <TableCell align="center">
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <IconButton color="primary" onClick={() => handleEdit(template)}>
                            <Edit />
                          </IconButton>
                          <IconButton color="error" onClick={() => handleOpenDeleteDialog(template)}>
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
          {salaryTemplates.length > rowsPerPage && (
            <Grid2 size={{ xs: 12 }}>
              <Stack direction="row" justifyContent="center" alignItems="center" sx={{ mt: 2, width: '100%' }}>
                <Pagination
                  count={Math.ceil(salaryTemplates.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="primary"
                />
              </Stack>
            </Grid2>
          )}
        </Grid2>
      </Grid2>
      <Grid2 size={{ xs: 12 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Back to Dashboard
          </Button>
        </Box>
      </Grid2>
    </MainCard>
  );
}

export default SalaryTemplateList;
