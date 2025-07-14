import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Stack,
  FormGroup,
  Grid2,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Alert,
  Tooltip,
  Paper
} from '@mui/material';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import Modal from 'ui-component/extended/Modal';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MainCard from '../../../ui-component/cards/MainCard';
import { CircularProgress } from '@mui/material';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const pfFields = [
  { name: 'epf_number', label: 'EPF Number (EX: ABCDE2405151000)',required: true },
  { name: 'employee_contribution_rate', label: 'Employee Contribution Rate' },
  { name: 'employer_contribution_rate', label: 'Employer Contribution Rate' }
];

const employeeContributionRates = ['12% of Actual PF Wage', '12% of Restricted Wage of ₹ 15,000 [1800]'];

function EpfComponent({ handleNext }) {
  const [open, setOpen] = useState(false);
  const [epfdisableDialog, setEpfdisableDialog] = useState(false);
  const [epfData, setEpfData] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false); // Close the modal
    resetForm(); // Reset form state when modal closes
  };

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const validationSchema = Yup.object({
    epf_number: Yup.string()
      .required('EPF Number is required')
      .matches(/^[A-Z]{5}\d{10}$/, 'Invalid EPF Number format, EX: ABCDE2405151000'),

    employee_contribution_rate: Yup.string().required('EPF Contribution Rate is required')
  });

  const formik = useFormik({
    initialValues: {
      epf_number: '',
      employee_contribution_rate: '',
      employer_contribution_rate: '',
      include_employer_contribution_in_ctc: false,
      employer_edil_contribution_in_ctc: false,
      admin_charge_in_ctc: false,
      allow_employee_level_override: false,
      prorate_restricted_pf_wage: false,
      apply_components_if_wage_below_15k: false,
      is_disabled: false
    },

    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = { ...values };
      postData.payroll = Number(payrollid);
      const url = postType === 'post' ? `/payroll/epf` : `/payroll/epf/${epfData.id}`;
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
        setOpen(false); // ✅ Close the modal manually
        resetForm(); // ✅ Reset Form
        getEPF_Details(payrollid); // ✅ Fetch latest data
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

  const getEPF_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/epf?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);

    if (res.status_cd === 0) {
      setEpfData(res.data);
      setPostType('put');
    } else {
      setPostType('post');
    }
  };
    const getLabelWithAsterisk = (label, isRequired) => (
  <>
    {label}
    {isRequired && <span style={{ color: 'red', fontSize: '1.3rem' }}> *</span>}
  </>
);

  // Effect to trigger API call when either businessId or payrollid is set
  useEffect(() => {
    if (payrollid) {
      getEPF_Details(payrollid); // Trigger API call only when an ID is available
    }
  }, [payrollid]);
  const disable_save_func = async () => {
    setLoading(true);
    const postData = { ...values };
    postData.is_disabled = true;
    postData.payroll = Number(payrollid);
    const url = postType === 'post' ? `/payroll/epf` : `/payroll/epf/${epfData.id}`;
    const { res, error } = await Factory(postType, url, postData);
    setLoading(false);
    if (res.status_cd === 0) {
      dispatchSnackbar(
        openSnackbar({
          open: true,
          message: postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      setEpfdisableDialog(false);
      getEPF_Details(payrollid);
    } else {
      dispatchSnackbar(
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
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
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
          Loading EPF Details...
        </Typography>
      </Box>
    );
  }
  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 3 } }}>
      <Card elevation={3} sx={{ maxWidth: 700, mb: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Employees Provident Fund (EPF) Settings
            </Typography>
          }
          subheader={
            <Typography variant="subtitle2" color="text.secondary">
              Manage your organization's EPF details and CTC inclusions
            </Typography>
          }
          action={
            epfData ? (
              <Tooltip title="Edit EPF Details">
                <Button
                  variant="contained"
                  type="button"
                  size="small"
                  startIcon={<IconEdit size={18} />}
                  onClick={() => {
                    setPostType('put');
                    setValues(epfData);
                    handleOpen();
                  }}
                  sx={{ minWidth: 120 }}
                >
                  Edit EPF
                </Button>
              </Tooltip>
            ) : null
          }
        />
        <Divider />
        <CardContent>
          <Grid2 container spacing={2}>
            {epfData ? (
              <>
                <Grid2 size={12}></Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">EPF Number:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{epfData.epf_number}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Employee Contribution Rate:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{epfData.employee_contribution_rate}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Employer Contribution Rate:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{epfData.employer_contribution_rate}</Typography>
                </Grid2>
                <Grid2 size={12} sx={{ mt: 2 }}>
                  <Divider textAlign="center" sx={{ fontWeight: 'bold' }}>
                    CTC Inclusions
                  </Divider>
                </Grid2>
                <Grid2 size={12}>
                  <FormGroup row={false}>
                    <FormControlLabel
                      control={<Checkbox checked={epfData.include_employer_contribution_in_ctc} />}
                      label={<Typography variant="body2">Include Employer's Contribution in the CTC</Typography>}
                      disabled
                    />
                    <FormControlLabel
                      control={<Checkbox checked={epfData.employer_edil_contribution_in_ctc} />}
                      label={<Typography variant="body2">Include Employer's EDIL Contribution in the CTC</Typography>}
                      disabled
                    />
                    <FormControlLabel
                      control={<Checkbox checked={epfData.admin_charge_in_ctc} />}
                      label={<Typography variant="body2">Include Admin Charges in the CTC</Typography>}
                      disabled
                    />
                  </FormGroup>
                </Grid2>
                <Grid2 size={12} sx={{ mt: 2 }}>
                  <Divider textAlign="center" sx={{ fontWeight: 'bold' }}>
                    Advanced Options
                  </Divider>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Allow employee level override PF contribution rate:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{epfData?.allow_employee_level_override ? 'Yes' : 'No'}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Pro rate restricted PF wage:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{epfData?.prorate_restricted_pf_wage ? 'Yes' : 'No'}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Consider applicable salary components based on LOP:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{epfData?.apply_components_if_wage_below_15k ? 'Yes' : 'No'}</Typography>
                </Grid2>
              </>
            ) : (
              <Grid2 size={12}>
                <Paper elevation={0} sx={{ textAlign: 'center', py: 5, background: 'rgba(0,0,0,0.02)' }}>
                  <ErrorOutlineIcon color="disabled" fontSize="large" sx={{ mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No EPF details found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enable EPF to start managing provident fund settings for your organization.
                  </Typography>
                  <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={handleOpen} sx={{ mt: 1 }}>
                    Enable EPF
                  </Button>
                </Paper>
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>

      {/* Modal for Add/Edit EPF */}
      <Modal
        open={open}
        maxWidth={'sm'}
        title={'Add or Edit EPF Details'}
        showClose={true}
        handleClose={handleClose}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              color="error"
              onClick={() => {
                resetForm();
                handleClose();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" size="small" variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </Button>
          </Stack>
        }
      >
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 1 }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            EPF Details
          </Typography>
          <Grid2 container spacing={2}>
            {pfFields.map((field) => (
              <Grid2 size={{ xs: 12 }} key={field.name}>
                {field.name === 'employee_contribution_rate' || field.name === 'employer_contribution_rate' ? (
                  <Box sx={{ pb: 1 }}>
                    <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                      {field.label}
                    </Typography>
                   
                    <CustomAutocomplete
                      value={values[field.name]}
                      name={field.name}
                      onChange={(e, newValue) => setFieldValue(field.name, newValue)}
                      options={employeeContributionRates}
                      error={touched[field.name] && Boolean(errors[field.name])}
                      helperText={touched[field.name] && errors[field.name]}
                      sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                    />
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="subtitle1" gutterBottom>
                      {getLabelWithAsterisk(field.label, field.required)}
                    </Typography>
                    <TextField
                      size="small"
                      fullWidth
                      name={field.name}
                      value={values[field.name]}
                      onChange={(e) => setFieldValue(field.name, e.target.value)}
                      error={touched[field.name] && Boolean(errors[field.name])}
                      helperText={touched[field.name] && errors[field.name]}
                      sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                    />
                  </Box>
                )}
              </Grid2>
            ))}
          </Grid2>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
            CTC Inclusions
          </Typography>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <FormControlLabel
              label="Include Employer's Contribution in employees CTC"
              control={
                <Checkbox
                  checked={formik.values.include_employer_contribution_in_ctc}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    formik.setFieldValue('include_employer_contribution_in_ctc', checked);
                    if (!checked) {
                      formik.setFieldValue('employer_edil_contribution_in_ctc', false);
                      formik.setFieldValue('admin_charge_in_ctc', false);
                    }
                  }}
                />
              }
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
              <FormControlLabel
                label="Include Employer's EDIL Contribution in employees CTC"
                control={
                  <Checkbox
                    checked={formik.values.employer_edil_contribution_in_ctc}
                    onChange={(e) => formik.setFieldValue('employer_edil_contribution_in_ctc', e.target.checked)}
                    disabled={!formik.values.include_employer_contribution_in_ctc}
                  />
                }
              />
              <FormControlLabel
                label="Include Admin Charges in employees CTC"
                control={
                  <Checkbox
                    checked={formik.values.admin_charge_in_ctc}
                    onChange={(e) => formik.setFieldValue('admin_charge_in_ctc', e.target.checked)}
                    disabled={!formik.values.include_employer_contribution_in_ctc}
                  />
                }
              />
            </Box>
          </Grid2>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" sx={{ mb: 1, color: 'primary.main' }}>
            Advanced Options
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.allow_employee_level_override}
                  onChange={(e) => formik.setFieldValue('allow_employee_level_override', e.target.checked)}
                />
              }
              label="Allow Employee to override PF contribution rate"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.prorate_restricted_pf_wage}
                  onChange={(e) => formik.setFieldValue('prorate_restricted_pf_wage', e.target.checked)}
                />
              }
              label="Pro-Rate Restricted PF Wage"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.apply_components_if_wage_below_15k}
                  onChange={(e) => formik.setFieldValue('apply_components_if_wage_below_15k', e.target.checked)}
                />
              }
              label="Consider all applicable salary components if the PF wage is less than ₹15,000 after loss of pay."
            />
          </FormGroup>
        </Box>
      </Modal>

      {/* Modal for Disable EPF */}
      <Modal
        open={epfdisableDialog}
        showClose={true}
        maxWidth={'md'}
        handleClose={() => {
          resetForm();
          setEpfdisableDialog(false);
        }}
        header={{ title: 'Employees Provident Fund', subheader: '' }}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button
              type="submit"
              variant="outlined"
              onClick={() => {
                resetForm();
                setEpfdisableDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              onClick={() => {
                disable_save_func();
              }}
            >
              Proceed
            </Button>
          </Stack>
        }
      >
        <Box p={2}>
          <Box display="flex" justifyContent="center" mb={1}>
            <ErrorOutlineIcon color="primary" fontSize="large" />
          </Box>
          <Alert severity="warning" sx={{ mb: 2 }}>
            If your organisation has 20 or more employees, it is necessary to register for the EPF scheme. Are you sure you want to disable
            EPF for this organisation?
          </Alert>
        </Box>
      </Modal>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.7)',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={50} />
          <Typography variant="h5" color="text.secondary" sx={{ mt: 2 }}>
            Loading EPF Details...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default EpfComponent;
