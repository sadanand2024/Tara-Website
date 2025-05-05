import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// @mui
import { Button, Box, TextField, Checkbox, FormControlLabel, Typography, Stack, Grid2 } from '@mui/material';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import Modal from 'ui-component/extended/Modal';
import MainCard from '../../../ui-component/cards/MainCard';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';
import Factory from 'utils/Factory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const esiDetails = [
  { name: 'esi_number', label: 'ESI Number' },
  { name: 'employee_contribution', label: 'Employees Contribution' },
  { name: 'employer_contribution', label: 'Employers Contribution' }
];

function ESIComponent({ handleNext, handleBack }) {
  const [open, setOpen] = useState(false);
  const [esiData, setEsiData] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [searchParams] = useSearchParams();
  const router = useNavigate();
  const dispatch = useDispatch();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const formik = useFormik({
    initialValues: {
      esi_number: '',
      employee_contribution: 0.75,
      employer_contribution: 3.25,
      include_employer_contribution_in_ctc: false
    },
    validationSchema: Yup.object({
      esi_number: Yup.string()
        .matches(/^\d{17}$/, 'ESI number must be exactly 17 digits')
        .required('ESI number is required')
    }),
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
        handleClose();
        getESI_Details(payrollid);
        // router.back();
      } else {
        // showSnackbar(JSON.stringify(res.data.data), 'error');
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

  // Effect to trigger API call when either businessId or payrollid is set
  useEffect(() => {
    if (payrollid) {
      getESI_Details(payrollid); // Trigger API call only when an ID is available
    }
  }, [payrollid]);
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12 }}>
        <div style={{ paddingBottom: '5px' }}>
          <label>{field.label}</label>
        </div>
        <Box sx={{ display: 'flex' }}>
          <TextField
            fullWidth
            name={field.name}
            value={values[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            disabled={field.name !== 'esi_number'}
          />
          {field.name !== 'esi_number' && (
            <Typography variant="subtitle2" sx={{ whiteSpace: 'nowrap', ml: 1 }} alignContent="center">
              % of Gross Pay
            </Typography>
          )}
        </Box>
      </Grid2>
    ));
  };
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  return (
    <>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <MainCard title="Employees State Insurence">
          <Grid2 container spacing={{ xs: 2, sm: 3 }}>
            <Grid2 size={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                <Grid2 container spacing={2} sx={{ maxWidth: '600px' }}>
                  <Grid2 container spacing={2}>
                    {esiData && (
                      <>
                        {' '}
                        <Grid2 size={6}>
                          <Typography variant="subtitle1" sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                            Employees State Insurence
                          </Typography>
                        </Grid2>
                        <Grid2 size={6}>
                          <Box sx={{ textAlign: 'left' }}>
                            <Button
                              size="small"
                              variant="contained"
                              startIcon={esiData ? <IconEdit size={16} /> : <IconPlus size={16} />}
                              onClick={() => {
                                setPostType('put');
                                setValues(esiData);
                                handleOpen();
                              }}
                            >
                              Edit ESI
                            </Button>
                          </Box>
                        </Grid2>
                      </>
                    )}
                    {esiData ? (
                      <>
                        {/* EPF Data display */}
                        <Grid2 size={6}>
                          <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            ESI Number:
                          </Typography>
                        </Grid2>
                        <Grid2 size={6}>
                          <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            {esiData.esi_number}
                          </Typography>
                        </Grid2>
                        <Grid2 size={6}>
                          <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            Employee Contribution Rate:
                          </Typography>
                        </Grid2>
                        <Grid2 size={6}>
                          <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            {esiData.employee_contribution} % of Gross Pay
                          </Typography>
                        </Grid2>

                        <Grid2 size={6}>
                          <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            Employer Contribution Rate:
                          </Typography>
                        </Grid2>
                        <Grid2 size={6}>
                          <Typography variant="body1" sx={{ textAlign: 'left' }}>
                            {esiData.employer_contribution} % of Gross Pay
                          </Typography>
                        </Grid2>

                        <Grid2 size={6}>
                          <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
                            CTC Inclusions:
                          </Typography>
                        </Grid2>
                        <Grid2 size={6}>
                          <FormControlLabel
                            control={<Checkbox checked={esiData.include_employer_contribution_in_ctc} />}
                            label="Include Employer's Contribution in the CTC"
                            sx={{ whiteSpace: 'nowrap' }}
                            disabled
                          />
                        </Grid2>

                        <Grid2 size={12}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Button
                              variant="outlined"
                              startIcon={<ArrowBackIcon />}
                              onClick={() => {
                                router.back();
                              }}
                            >
                              Back to Dashboard
                            </Button>
                            {/* <Button size="small" variant="contained" onClick={handleBack} sx={{ mr: 2 }}>
                              Back
                            </Button>
                            <Button size="small" variant="contained" onClick={handleNext}>
                              Next
                            </Button> */}
                          </Box>
                        </Grid2>
                      </>
                    ) : (
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <Box textAlign="center" mt={4}>
                          <ErrorOutlineIcon color="disabled" fontSize="large" />
                          <Typography variant="subtitle1" color="text.secondary">
                            No EPF details found
                          </Typography>
                        </Box>
                        <Grid2 container justifyContent="center" mt={2}>
                          <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpen}>
                            Enable ESI
                          </Button>
                        </Grid2>
                      </Box>
                    )}
                  </Grid2>
                </Grid2>
              </Box>
            </Grid2>

            <Modal
              open={open}
              title={'Add Or Edit ESI Details'}
              maxWidth={'sm'}
              showClose={true}
              handleClose={() => {
                resetForm();
                handleClose();
              }}
              header={{ title: 'Employees State Insurence', subheader: '' }}
              footer={
                <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      resetForm();
                      handleClose();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" onClick={handleSubmit}>
                    Save
                  </Button>
                </Stack>
              }
            >
              <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
                <Grid2 container spacing={3}>
                  {renderFields(esiDetails)}
                </Grid2>
                <br />
                <Grid2 size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={values.include_employer_contribution_in_ctc}
                        onChange={(e) => formik.setFieldValue('include_employer_contribution_in_ctc', e.target.checked)}
                      />
                    }
                    label="Include employers contribution in the CTC"
                  />
                </Grid2>
              </Box>
            </Modal>
          </Grid2>
        </MainCard>
      )}
    </>
  );
}

export default ESIComponent;
