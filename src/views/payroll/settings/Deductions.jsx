import { Delete, Edit } from '@mui/icons-material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid2,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Modal from 'ui-component/extended/Modal';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import * as Yup from 'yup';

import DeleteDialog from 'ui-component/extended/DeleteDialog';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import CircularProgressComponent from 'utils/CircularProgressComponent';
const validationSchema = Yup.object({
  component_name: Yup.string().required('Name is required'),
  component_type: Yup.string().oneOf(['Fixed'], 'Only Fixed type is allowed for deductions'),
  calculation_type: Yup.object().shape({
    type: Yup.string().oneOf(['Flat Amount'], 'Only Flat Amount is allowed for deductions'),
    value: Yup.number()
      .required('Value is required')
      .min(0, 'Value must be greater than or equal to 0')
      .typeError('Please enter a valid number')
  })
});

function Deductions({ handleNext, handleBack, open, setOpen, postType, setPostType }) {
  const [deductionsData, setDeductionsData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const handleOpenDeleteDialog = (designation) => {
    setSelectedRow(designation);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  const paginatedData = deductionsData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const dispatch = useDispatch();
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const handleOpen = (item) => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  const handleEdit = async (item) => {
    let url = `/payroll/deductions/${item.id}`;
    const { res } = await Factory('get', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } else {
      setPostType('put');
      // Map API response fields to form fields
      const formData = {
        ...res.data,
        component_name: res.data.deduction_name,
        component_type: res.data.component_type
      };
      setValues(formData);
      handleOpen();
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/deductions/${item.id}`;
    const { res } = await Factory('delete', url, {});
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data),
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
      getDeductions_Details(payrollid);
    }
  };
  const formik = useFormik({
    initialValues: {
      component_name: '',
      component_type: 'Fixed',
      is_active: false,
      calculation_type: {
        type: 'Flat Amount',
        value: 0
      },
      includes_epf_contribution: false,
      includes_esi_contribution: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      // Map form fields back to API format
      const postData = {
        deduction_name: values.component_name,
        component_type: values.component_type,
        calculation_type: values.calculation_type,
        includes_epf_contribution: values.includes_epf_contribution,
        includes_esi_contribution: values.includes_esi_contribution,
        is_active: values.is_active,
        payroll: Number(payrollid)
      };

      const url = postType === 'post' ? `/payroll/deductions/` : `/payroll/deductions/${values.id}`;
      const { res, error } = await Factory(postType, url, postData);
      setLoading(false);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        handleClose();
        getDeductions_Details(payrollid);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data.data),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });
  const getDeductions_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/deductions/?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setDeductionsData(res.data);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };
  useEffect(() => {
    if (payrollid) {
      getDeductions_Details(payrollid);
    }
  }, [payrollid]);
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  if (loading) {
    return <CircularProgressComponent isLoading={loading} displayContent={'Loading Deductions Data'} />;
  }

  return (
    <Box>
      <Grid2 size={{ xs: 12 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: 1,
            overflowX: 'auto',
            '& .MuiTable-root': {
              width: '100%'
            }
          }}
        >
          <Table size="small">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                {[
                  { label: 'Sr. No.', width: 'auto' },
                  { label: 'Component Name', width: 'auto' },
                  { label: 'Calculation', width: 'auto' },
                  { label: 'Consider for EPF', width: 'auto' },
                  { label: 'Consider for ESI', width: 'auto' },
                  { label: 'Status', width: 'auto' },
                  { label: 'Actions', width: 'auto' }
                ].map((head, idx) => (
                  <TableCell
                    key={idx}
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      color: '#fff !important',
                      textAlign: idx === 6 ? 'center' : 'left',
                      whiteSpace: 'nowrap',
                      padding: '8px 4px'
                    }}
                  >
                    {head.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ height: 300 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                      No Data Available
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow
                    key={item.id}
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover'
                      }
                    }}
                  >
                    <TableCell align="left" sx={{ whiteSpace: 'nowrap', padding: '8px 4px' }}>
                      {index + 1 + (currentPage - 1) * rowsPerPage}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        cursor: 'pointer',
                        color: 'primary.main',
                        textDecoration: 'underline',
                        whiteSpace: 'nowrap',
                        padding: '8px 4px'
                      }}
                      onClick={() => {
                        setPostType('put');
                        handleEdit(item);
                      }}
                    >
                      {item.deduction_name}
                    </TableCell>

                    <TableCell
                      align="left"
                      sx={{
                        whiteSpace: 'nowrap',
                        padding: '8px 4px'
                      }}
                    >
                      {item.calculation_type?.type === 'Flat Amount'
                        ? `₹${item.calculation_type?.value || 0}`
                        : item.calculation_type?.type === 'Percentage of Basic'
                          ? `${item.calculation_type?.value || 0}% of Basic`
                          : item.calculation_type?.type === 'Percentage of CTC'
                            ? `${item.calculation_type?.value || 0}% of CTC`
                            : item.calculation_type?.type || 'N/A'}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        whiteSpace: 'nowrap',
                        padding: '8px 4px'
                      }}
                    >
                      {item.includes_epf_contribution ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        whiteSpace: 'nowrap',
                        padding: '8px 4px'
                      }}
                    >
                      {item.includes_esi_contribution ? 'Yes' : 'No'}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        whiteSpace: 'nowrap',
                        padding: '8px 4px'
                      }}
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </TableCell>

                    <TableCell
                      align="center"
                      sx={{
                        padding: '8px 4px'
                      }}
                    >
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
        </TableContainer>

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

        <Grid2 size={12} sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Back
            </Button>
            {deductionsData.length > 0 && (
              <Pagination
                count={Math.ceil(deductionsData.length / rowsPerPage)}
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

      <Modal
        open={open}
        title="Add Deduction"
        maxWidth={'sm'}
        header={{ title: values.component_name || 'New Component', subheader: '' }}
        showClose={true}
        handleClose={handleClose}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                resetForm();
                setPostType('');
                handleClose(); // Reset form and close dialog
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              onClick={(e) => {
                setSubmitAttempted(true);
                console.log(Object.keys(errors));
                if (Object.keys(errors).length > 0) {
                  dispatch(
                    openSnackbar({
                      open: true,
                      message: 'Please fill all the required fields',
                      variant: 'alert',
                      alert: { color: 'error' },
                      close: false
                    })
                  );
                  return;
                }
                handleSubmit(e);
              }}
            >
              Save
            </Button>
          </Stack>
        }
      >
        <>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid2 container spacing={3}>
              {/* Left Column */}
              <Grid2 size={{ xs: 6 }}>
                <Grid2 container direction="column" spacing={2}>
                  <Grid2>
                    <Typography variant="subtitle1">
                      Name <span style={{ color: 'red' }}>*</span>
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={values.component_name}
                      onChange={(e) => setFieldValue('component_name', e.target.value)}
                      onBlur={handleBlur}
                      error={(touched.component_name || submitAttempted) && Boolean(errors.component_name)}
                      helperText={(touched.component_name || submitAttempted) && errors.component_name}
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'grey.600'
                        }
                      }}
                    />
                  </Grid2>
                  <Grid2>
                    <Typography variant="subtitle1">Calculation Type:</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Flat Amount (Fixed deduction amount)
                    </Typography>
                    <Grid2>
                      <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                        Enter Amount <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <TextField
                        fullWidth
                        size="small"
                        value={values.calculation_type.value}
                        onChange={(e) => {
                          // Allow only numbers and one decimal point
                          const numericValue = e.target.value
                            .replace(/[^0-9.]/g, '') // Remove non-numeric and non-decimal characters
                            .replace(/(\..*)\./g, '$1'); // Ensure only one decimal point is allowed
                          setFieldValue('calculation_type.value', numericValue);
                        }}
                        onBlur={handleBlur}
                        error={(touched.calculation_type?.value || submitAttempted) && Boolean(errors.calculation_type?.value)}
                        helperText={(touched.calculation_type?.value || submitAttempted) && errors.calculation_type?.value}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start" sx={{ display: 'flex', alignItems: 'center' }}>
                              <span>₹</span>
                              <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '24px' }} />
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid2>
                  </Grid2>
                  <Grid2>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.is_active}
                          onChange={(e) => {
                            setFieldValue('is_active', e.target.checked);
                          }}
                        />
                      }
                      label="Mark this as Active"
                    />
                  </Grid2>
                </Grid2>
              </Grid2>

              {/* Right Column */}
              <Grid2 size={{ xs: 6 }}>
                <Grid2 container direction="column" spacing={2}>
                  <Grid2>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      Type
                    </Typography>

                    <CustomAutocomplete
                      value={values.component_type}
                      component_name="component_type"
                      onChange={(e, newValue) => setFieldValue('component_type', newValue)}
                      options={['Fixed']}
                      disabled={true}
                      error={(touched.component_type || submitAttempted) && Boolean(errors.component_type)}
                      helperText={(touched.component_type || submitAttempted) && errors.component_type}
                      sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                    />
                  </Grid2>
                  <Grid2>
                    <Typography variant="subtitle1">Other Configuration</Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.includes_epf_contribution}
                            onChange={(e) => {
                              setFieldValue('includes_epf_contribution', e.target.checked);
                            }}
                          />
                        }
                        label="Consider for EPF Contribution"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'black !important'
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.includes_esi_contribution}
                            onChange={(e) => {
                              setFieldValue('includes_esi_contribution', e.target.checked);
                            }}
                          />
                        }
                        label="Consider for ESI Contribution"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'black !important'
                          }
                        }}
                      />
                    </FormGroup>
                  </Grid2>
                </Grid2>
              </Grid2>
            </Grid2>
          </Box>
        </>
      </Modal>
    </Box>
  );
}
export default Deductions;
