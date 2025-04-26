'use client';
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
  Grid2
} from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';
import ActionCell from 'ui-component/extended/ActionCell';
import Factory from 'utils/Factory';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
function SalaryTemplateList() {
  const [salaryTemplates, setSalaryTemplates] = useState([]);
  const [payrollid, setPayrollId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

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
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {['S.No', 'Template Name', 'Description', 'Status', 'Actions'].map((header, idx) => (
                  <TableCell key={idx} align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {salaryTemplates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ height: 300 }}>
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                salaryTemplates.map((template, index) => (
                  <TableRow key={template.id} hover>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="left">{template.template_name}</TableCell>
                    <TableCell align="left">{template.description || '-'}</TableCell>
                    <TableCell align="center">{template.status === true ? 'Active' : 'Inactive'}</TableCell>
                    <TableCell align="center">
                      <ActionCell
                        row={template}
                        onEdit={() => handleEdit(template)}
                        onDelete={() => handleDelete(template)}
                        open={openDialog}
                        deleteDialogData={{
                          title: 'Delete Template',
                          heading: 'Are you sure you want to delete this template?',
                          description: `This will permanently remove "${template.template_name}".`,
                          successMessage: 'Template has been deleted.'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid2 xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
              Back to Dashboard
            </Button>
          </Box>
        </Grid2>
      </Grid2>
    </MainCard>
  );
}

export default SalaryTemplateList;
