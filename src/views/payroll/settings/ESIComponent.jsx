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
  Grid2,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import Modal from 'ui-component/extended/Modal';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

const esiFields = [
  { name: 'esi_number', label: 'ESI Number (17 digits)', required: true },
  { name: 'employee_contribution', label: 'Employee Contribution Rate (% of Gross Pay)' },
  { name: 'employer_contribution', label: 'Employer Contribution Rate (% of Gross Pay)' }
];

function ESIComponent({ handleNext, handleBack }) {
  const [open, setOpen] = useState(false);
  const [esidisableDialog, setEsidisableDialog] = useState(false);
  const [esiData, setEsiData] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);

  const validationSchema = Yup.object({
    esi_number: Yup.string()
      .matches(/^\d{17}$/, 'ESI number must be exactly 17 digits')
      .required('ESI number is required'),
    employee_contribution: Yup.number().required('Employee contribution is required'),
    employer_contribution: Yup.number().required('Employer contribution is required')
  });
  const getLabelWithAsterisk = (label, isRequired) => (
    <>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </>
  );

  const formik = useFormik({
    initialValues: {
      esi_number: '',
      employee_contribution: 0.75,
      employer_contribution: 3.25,
      include_employer_contribution_in_ctc: false,
      is_disabled: false
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = { ...values };
      postData.payroll = Number(payrollid);
      const url = postType === 'post' ? `/payroll/esi` : `/payroll/esi/${esiData.id}`;
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
        setOpen(false);
        resetForm();
        getESI_Details(payrollid);
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

  const getESI_Details = async (id) => {
    setLoading(true);
    const url = `/payroll/esi?payroll_id=${id}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res.status_cd === 0) {
      setEsiData(res.data);
      setPostType('put');
    } else {
      setPostType('post');
    }
  };

  useEffect(() => {
    if (payrollid) {
      getESI_Details(payrollid);
    }
  }, [payrollid]);

  const disable_save_func = async () => {
    setLoading(true);
    const postData = { ...values };
    postData.is_disabled = true;
    postData.payroll = Number(payrollid);
    const url = postType === 'post' ? `/payroll/esi` : `/payroll/esi/${esiData.id}`;
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
      setEsidisableDialog(false);
      getESI_Details(payrollid);
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

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

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
          Loading ESI Details...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 1 } }}>
      <Card elevation={3} sx={{ maxWidth: 700, mb: 3 }}>
        <CardHeader
          title={
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Employees State Insurance (ESI) Settings
            </Typography>
          }
          subheader={
            <Typography variant="subtitle2" color="text.secondary">
              Manage your organization's ESI details and CTC inclusions
            </Typography>
          }
          action={
            esiData ? (
              <Button
                variant="contained"
                type="button"
                size="small"
                startIcon={<IconEdit size={18} />}
                onClick={() => {
                  setPostType('put');
                  setValues(esiData);
                  handleOpen();
                }}
                sx={{ minWidth: 120 }}
              >
                Edit ESI
              </Button>
            ) : null
          }
        />
        <Divider />
        <CardContent>
          <Grid2 container spacing={2}>
            {esiData ? (
              <>
                <Grid2 size={6}>
                  <Typography variant="h5">ESI Number:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{esiData.esi_number}</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Employee Contribution Rate:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{esiData.employee_contribution} % of Gross Pay</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography variant="h5">Employer Contribution Rate:</Typography>
                </Grid2>
                <Grid2 size={6}>
                  <Typography>{esiData.employer_contribution} % of Gross Pay</Typography>
                </Grid2>
                <Grid2 size={12} sx={{ mt: 2 }}>
                  <Divider textAlign="center" sx={{ fontWeight: 'bold' }}>
                    CTC Inclusions
                  </Divider>
                </Grid2>
                <Grid2 size={12}>
                  <FormControlLabel
                    control={<Checkbox checked={esiData.include_employer_contribution_in_ctc} />}
                    label={<Typography variant="body2">Include Employer's Contribution in the CTC</Typography>}
                    disabled
                  />
                </Grid2>
              </>
            ) : (
              <Grid2 size={12}>
                <Paper elevation={0} sx={{ textAlign: 'center', py: 5, background: 'rgba(0,0,0,0.02)' }}>
                  <ErrorOutlineIcon color="disabled" fontSize="large" sx={{ mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No ESI details found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Enable ESI to start managing insurance settings for your organization.
                  </Typography>
                  <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
                    <Button variant="contained" startIcon={<IconPlus size={18} />} onClick={handleOpen} sx={{ mt: 1 }}>
                      Enable ESI
                    </Button>
                    <Button variant="outlined" color="error" onClick={() => setEsidisableDialog(true)} sx={{ mt: 1 }}>
                      Disable ESI
                    </Button>
                  </Stack>
                </Paper>
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>

      {/* Modal for Add/Edit ESI */}
      <Modal
        open={open}
        maxWidth={'sm'}
        title={'Add or Edit ESI Details'}
        showClose={true}
        handleClose={handleClose}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" size="small" color="error" onClick={handleClose}>
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
            ESI Details
          </Typography>
          <Grid2 container spacing={2}>
            {esiFields.map((field) => (
              <Grid2 size={{ xs: 12 }} key={field.name}>
                <Box>
                  {/* <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                    {field.label}
                  </Typography> */}
                  <Typography variant="subtitle1" gutterBottom component="label" htmlFor={field.name}>
                    {getLabelWithAsterisk(field.label, field.required)}
                  </Typography>

                  <TextField
                    size="small"
                    fullWidth
                    name={field.name}
                    value={values[field.name]}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                    sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                    type={field.name === 'esi_number' ? 'text' : 'number'}
                    disabled={field.name !== 'esi_number'}
                  />
                </Box>
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
                  checked={values.include_employer_contribution_in_ctc}
                  onChange={(e) => formik.setFieldValue('include_employer_contribution_in_ctc', e.target.checked)}
                />
              }
            />
          </Grid2>
        </Box>
      </Modal>

      {/* Modal for Disable ESI */}
      <Modal
        open={esidisableDialog}
        showClose={true}
        maxWidth={'sm'}
        handleClose={() => {
          resetForm();
          setEsidisableDialog(false);
        }}
        header={{ title: 'Employees State Insurance', subheader: '' }}
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button
              type="submit"
              variant="outlined"
              onClick={() => {
                resetForm();
                setEsidisableDialog(false);
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
          <Alert severity="error" sx={{ mb: 2 }}>
            If your organisation has 10 or more employees, it is necessary to register for the ESI scheme. Are you sure you want to disable
            ESI for this organisation?
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
            Loading ESI Details...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default ESIComponent;
