import CustomAutocomplete from 'utils/CustomAutocomplete';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
  Grid2,
  Stack,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  Paper,
  TableRow,
  InputAdornment,
  Divider,
  Pagination
} from '@mui/material';
import Modal from 'ui-component/extended/Modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ActionCell from 'ui-component/extended/ActionCell';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import BlockIcon from '@mui/icons-material/Block';
import { IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import DeleteDialog from 'ui-component/extended/DeleteDialog';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
const validationSchema = Yup.object({
  component_name: Yup.string().required('Name is required'),
  component_type: Yup.string().required('Type is required'),
  calculation_type: Yup.object().when('component_name', {
    is: (val) => val !== 'Commission' && val !== 'Bonus',
    then: (schema) =>
      schema.shape({
        type: Yup.string().required('Calculation type is required'),
        value: Yup.number()
          .required('Value is required')
          .min(0, 'Value must be greater than or equal to 0')
          .typeError('Please enter a valid number')
      }),
    otherwise: (schema) => schema.nullable()
  })
});

function EarningsComponent({ handleNext, handleBack, open, setOpen, postType, setPostType }) {
  const [earningsData, setEarningsData] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const handleOpenDeleteDialog = (designation) => {
    setSelectedRow(designation);
    setOpenDeleteDialog(true);
  };
  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };
  const paginatedData = earningsData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
    setPostType('');
    resetForm();
  };

  const handleEdit = async (item) => {
    let url = `/payroll/earnings/${item.id}`;
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
      setValues(res.data);
      handleOpen();
    }
  };
  const handleDelete = async (item) => {
    let url = `/payroll/earnings/${item.id}`;
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
      getEarnings_Details(payrollid);
    }
  };
  const formik = useFormik({
    initialValues: {
      component_name: '',
      component_type: '',
      is_active: false,
      calculation_type: {
        type: '',
        value: 0
      },
      is_part_of_employee_salary_structure: false,
      is_taxable: false,
      is_pro_rate_basis: false,
      is_flexible_benefit_plan: false,
      includes_epf_contribution: false,
      includes_esi_contribution: false,
      is_included_in_payslip: false,
      tax_deduction_preference: null,
      is_scheduled_earning: false,
      pf_wage_less_than_15k: false,
      always_consider_epf_inclusion: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = { ...values };
      postData.payroll = Number(payrollid);
      const url = postType === 'post' ? `/payroll/earnings` : `/payroll/earnings/${values.id}`;
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
        getEarnings_Details(payrollid);
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
  const getEarnings_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/earnings?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setEarningsData(res.data);
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
      getEarnings_Details(payrollid);
    }
  }, [payrollid]);
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  if (loading) {
    return <CircularProgressComponent isLoading={loading} displayContent={'Loading Earnings Data'} />;
  }

  return (
    <Box>
      <Grid2 size={{ xs: 12 }}>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table size="small">
            <TableHead sx={{ backgroundColor: 'primary.main' }}>
              <TableRow>
                {['Sr. No.', 'Component Name', 'Calculation', 'Consider for EPF', 'Consider for ESI', 'Status', 'Actions'].map(
                  (head, idx) => (
                    <TableCell
                      key={idx}
                      sx={{
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        fontSize: '0.9rem',
                        color: '#fff !important',
                        textAlign: idx === 6 ? 'center' : 'left'
                      }}
                    >
                      {head}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ height: 300 }}>
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
                    <TableCell align="left">{index + 1 + (currentPage - 1) * rowsPerPage}</TableCell>
                    <TableCell
                      align="left"
                      sx={{ cursor: 'pointer', color: 'primary.main', textDecoration: 'underline' }}
                      onClick={() => {
                        setPostType('put');
                        handleEdit(item);
                      }}
                    >
                      {item.component_name}
                    </TableCell>

                    <TableCell align="left">{item.calculation}</TableCell>
                    <TableCell align="left">{item.consider_for_epf ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="left">{item.consider_for_esi ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="left">{item.is_active ? 'Active' : 'Inactive'}</TableCell>

                    <TableCell align="left">
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

        <Grid2 size={12} sx={{ mt: 2 }}>
          <Stack direction="row" justifyContent="space-between">
            <Button size="small" variant="outlined" startIcon={<ArrowBackIcon />} onClick={handleBack}>
              Back
            </Button>
            {earningsData.length > 0 && (
              <Pagination
                count={Math.ceil(earningsData.length / rowsPerPage)}
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
          <Box component="form">
            <Grid2 container spacing={3}>
              {/* Left Column */}
              <Grid2 size={{ xs: 6 }}>
                <Grid2 container direction="column" spacing={2}>
                  <Grid2>
                    <Typography variant="subtitle1">Name</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value={values.component_name}
                      onChange={(e) => setFieldValue('component_name', e.target.value)}
                      onBlur={handleBlur}
                      error={touched.component_name && Boolean(errors.component_name)}
                      helperText={touched.component_name && errors.component_name}
                      disabled={
                        values.component_name === 'Fixed Allowance' ||
                        values.component_name === 'Conveyance Allowance' ||
                        values.component_name === 'HRA' ||
                        values.component_name === 'Basic'
                      }
                      sx={{
                        '& .MuiInputBase-input': {
                          color: 'grey.600'
                        }
                      }}
                    />
                  </Grid2>
                  {values.component_name !== 'Commission' && values.component_name !== 'Bonus' && (
                    <Grid2>
                      <Typography variant="subtitle1">
                        Calculation Type <span style={{ color: 'red' }}>*</span>
                      </Typography>
                      <FormGroup row sx={{ mt: 1 }}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={values.calculation_type.type === 'Flat Amount'}
                              onChange={(e) => {
                                setFieldValue('calculation_type', {
                                  type: 'Flat Amount',
                                  value: 0
                                });
                              }}
                              // disabled={values.component_name === 'Basic'}
                            />
                          }
                          label="Flat Amount"
                        />
                        {values.component_name === 'Overtime Allowance' ? (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  values.calculation_type.type === 'Percentage of CTC' ||
                                  values.calculation_type.type === 'Percentage of Basic'
                                }
                                onChange={(e) => {
                                  setFieldValue('calculation_type', {
                                    type: 'Percentage of Basic',
                                    value: 0
                                  });
                                }}
                              />
                            }
                            label={'Custom Formula'}
                          />
                        ) : (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={
                                  values.calculation_type.type === 'Percentage of CTC' ||
                                  values.calculation_type.type === 'Percentage of Basic'
                                }
                                onChange={(e) => {
                                  if (values.component_name === 'Basic') {
                                    setFieldValue('calculation_type', {
                                      type: 'Percentage of CTC',
                                      value: 0
                                    });
                                  } else {
                                    setFieldValue('calculation_type', {
                                      type: 'Percentage of Basic',
                                      value: 0
                                    });
                                  }
                                }}
                              />
                            }
                            label={values.component_name === 'Basic' ? 'Percentage of CTC' : 'Percentage of Basic'}
                          />
                        )}
                      </FormGroup>
                      <Grid2>
                        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                          {values.calculation_type.type === 'Flat Amount' ? 'Enter Amount ' : 'Enter Percentage'}
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
                          error={touched.calculation_type?.value && Boolean(errors.calculation_type?.value)}
                          helperText={touched.calculation_type?.value && errors.calculation_type?.value}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ display: 'flex', alignItems: 'center' }}>
                                <span>{values.calculation_type.type === 'Flat Amount' ? '₹' : '%'}</span>
                                <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '24px' }} />
                              </InputAdornment>
                            )
                          }}
                        />
                      </Grid2>
                    </Grid2>
                  )}
                  <Grid2>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={values.is_active}
                          onChange={(e) => {
                            let val = e.target.checked;
                            setFieldValue('is_active', val);
                          }}
                          disabled={values.component_name === 'Fixed Allowance'}
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
                      options={['Fixed', 'Variable']}
                      error={touched.component_type && Boolean(errors.component_type)}
                      helperText={touched.component_type && errors.component_type}
                      sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                      disabled={
                        values.component_name === 'Basic' ||
                        values.component_name === 'HRA' ||
                        values.component_name === 'Fixed Allowance' ||
                        values.component_name === 'Conveyance Allowance'
                      }
                    />
                  </Grid2>
                  <Grid2>
                    <Typography variant="subtitle1"> Other Configuration</Typography>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.is_part_of_employee_salary_structure}
                            onChange={(e) => {
                              setFieldValue('is_part_of_employee_salary_structure', e.target.checked);
                            }}
                            disabled={
                              values.component_name === 'Basic' ||
                              values.component_name === 'HRA' ||
                              values.component_name === 'Fixed Allowance' ||
                              values.component_name === 'Conveyance Allowance' ||
                              values.component_name === 'Children Education Allowance' ||
                              values.component_name === 'Transport Allowance' ||
                              values.component_name === 'Travelling Allowance' ||
                              values.component_name === 'Overtime Allowance'
                            }
                          />
                        }
                        label="This is part of employee salary structure"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'black !important'
                          }
                        }}
                      />

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.is_taxable}
                            onChange={(e) => {
                              let val = e.target.checked;
                              setFieldValue('is_taxable', val);
                            }}
                            disabled={
                              values.component_name === 'Basic' ||
                              values.component_name === 'Fixed Allowance' ||
                              values.component_name === 'HRA' ||
                              values.component_name === 'Conveyance Allowance' ||
                              values.component_name === 'Bonus' ||
                              values.component_name === 'Commission' ||
                              values.component_name === 'Children Education Allowance' ||
                              values.component_name === 'Transport Allowance' ||
                              values.component_name === 'Travelling Allowance' ||
                              values.component_name === 'Overtime Allowance'
                            }
                          />
                        }
                        label="This is taxable"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'black !important'
                          }
                        }}
                      />
                      {values.component_name !== 'Bonus' &&
                        values.component_name !== 'Commission' &&
                        values.component_name !== 'Overtime Allowance' && (
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.is_pro_rate_basis}
                                onChange={(e) => {
                                  let val = e.target.checked;
                                  setFieldValue('is_pro_rate_basis', val);
                                }}
                                disabled={
                                  values.component_name === 'Basic' ||
                                  values.component_name === 'Fixed Allowance' ||
                                  values.component_name === 'Children Education Allowance'
                                }
                              />
                            }
                            label="Calculate on Pro rata basis"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                color: 'black !important'
                              }
                            }}
                          />
                        )}
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.includes_epf_contribution}
                            onChange={(e) => {
                              let val = e.target.checked;
                              setFieldValue('includes_epf_contribution', val);
                              setFieldValue('always_consider_epf_inclusion', val);
                              setFieldValue('pf_wage_less_than_15k', val);
                            }}
                            disabled={
                              values.component_name === 'Basic' ||
                              values.component_name === 'HRA' ||
                              values.component_name === 'Overtime Allowance' ||
                              values.component_name === 'Bonus'
                            }
                          />
                        }
                        label="Consider for EPF Contribution"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'black !important'
                          }
                        }}
                      />
                      {values.includes_epf_contribution === true && (
                        <Box sx={{ ml: 3 }}>
                          <FormControlLabel
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                            control={
                              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                                <Checkbox
                                  checked={values.always_consider_epf_inclusion}
                                  onChange={(e) => setFieldValue('always_consider_epf_inclusion', e.target.checked)}
                                  disabled={values.component_name === 'Conveyance Allowance'}
                                />
                                {hovered && values.component_name === 'Conveyance Allowance' && (
                                  <BlockIcon
                                    color="error"
                                    fontSize="small"
                                    sx={{
                                      position: 'absolute',
                                      top: '50%',
                                      left: '50%',
                                      transform: 'translate(-50%, -50%)',
                                      pointerEvents: 'none',
                                      opacity: 0.9
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            label="Always"
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={values.pf_wage_less_than_15k}
                                onChange={(e) => setFieldValue('pf_wage_less_than_15k', e.target.checked)}
                                disabled={values.component_name === 'Basic' || values.component_name === 'Fixed Allowance'}
                              />
                            }
                            label="Only when PF Wage is less than ₹ 15,000"
                            sx={{
                              '& .MuiFormControlLabel-label': {
                                color: 'black !important'
                              }
                            }}
                          />
                        </Box>
                      )}

                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.includes_esi_contribution}
                            onChange={(e) => {
                              let val = e.target.checked;
                              setFieldValue('includes_esi_contribution', val);
                            }}
                            disabled={values.component_name === 'Basic' || values.component_name === 'Fixed Allowance'}
                          />
                        }
                        label="Consider for ESI Contribution"
                        sx={{
                          '& .MuiFormControlLabel-label': {
                            color: 'black !important'
                          }
                        }}
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={values.is_included_in_payslip}
                            onChange={(e) => {
                              let val = e.target.checked;
                              setFieldValue('is_included_in_payslip', val);
                            }}
                            disabled={
                              values.component_name === 'Basic' ||
                              values.component_name === 'HRA' ||
                              values.component_name === 'Fixed Allowance' ||
                              values.component_name === 'Conveyance Allowance' ||
                              values.component_name === 'Bonus' ||
                              values.component_name === 'Commission' ||
                              values.component_name === 'Travelling Allowance' ||
                              values.component_name === 'Overtime Allowance' ||
                              values.component_name === 'Children Education Allowance' ||
                              values.component_name === 'Transport Allowance'
                            }
                          />
                        }
                        label="Show this component in payslip"
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
export default EarningsComponent;
