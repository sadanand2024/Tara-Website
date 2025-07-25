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
import CircularProgressComponent from 'utils/CircularProgressComponent';

function SalaryTemplateList({ handleBack, handleNext, searchQuery = '' }) {
  const [salaryTemplates, setSalaryTemplates] = useState([]);
  const [payrollid, setPayrollId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  // Filter salaryTemplates based on searchQuery from props
  const filteredTemplates = salaryTemplates.filter((template) => {
    const query = searchQuery.toLowerCase();
    return template.template_name?.toLowerCase().includes(query) || template.description?.toLowerCase().includes(query);
  });
  const paginatedData = filteredTemplates.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
    setIsLoading(true);
    const url = `/payroll/salary-templates?payroll_id=${payrollid}`;
    const { res } = await Factory('get', url, {});
    if (res?.status_cd === 0) {
      setSalaryTemplates(res.data || []);
    } else {
      setSalaryTemplates([]);
    }
    setIsLoading(false);
  };

  const handleEdit = (template) => {
    const params = new URLSearchParams(searchParams);
    params.set('template_id', template.id);
    navigate({ search: params.toString() });
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
  if (isLoading) {
    return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading Salary Template Data'} />;
  }
  return (
    <Box>
      <Grid2 container>
        <Grid2 size={{ xs: 12 }}>
          <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
            <Table size="small">
              <TableHead sx={{ backgroundColor: 'primary.main' }}>
                <TableRow>
                  {['S.No', 'Template Name', 'Description', 'Status', 'Actions'].map((header, idx) => (
                    <TableCell
                      key={idx}
                      align={idx === 4 ? 'center' : 'left'}
                      sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', color: '#fff !important' }}
                    >
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
                          <IconButton size="small" color="primary" onClick={() => handleEdit(template)}>
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(template)}>
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

          <Grid2 size={{ xs: 12 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, width: '100%' }}>
              <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
                Back
              </Button>
              {filteredTemplates.length > 0 && (
                <Pagination
                  count={Math.ceil(filteredTemplates.length / rowsPerPage)}
                  page={currentPage}
                  onChange={(e, value) => setCurrentPage(value)}
                  color="primary"
                />
              )}
              <Button size="small" variant="contained" onClick={handleNext}>
                Next
              </Button>
            </Stack>
          </Grid2>
        </Grid2>
      </Grid2>
    </Box>
  );
}

export default SalaryTemplateList;
