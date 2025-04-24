'use client';
import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Box, TextField, Checkbox, FormControlLabel, Card, CardContent, Typography, Stack, FormGroup, Grid2 } from '@mui/material';
import { IconPlus, IconEdit } from '@tabler/icons-react';
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
import EmptyTable from '@/components/third-party/table/EmptyTable';
import MainCard from '@/components/MainCard';
import { useRouter } from 'next/navigation';
import Factory from '@/utils/Factory';
import { useSearchParams } from 'next/navigation';
import Loader from '@/components/PageLoader';
import { useSnackbar } from '@/components/CustomSnackbar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const pfFields = [
  { name: 'epf_number', label: 'EPF Number' },
  { name: 'employee_contribution_rate', label: 'Employee Contribution Rate' },
  { name: 'employer_contribution_rate', label: 'Employer Contribution Rate' }
];

const employeeContributionRates = ['12% of Actual PF Wage', '12% of Restricted Wage of 15,000'];

function EpfComponent({ handleNext }) {
  const [open, setOpen] = useState(false);
  const [epfdisableDialog, setEpfdisableDialog] = useState(false);
  const [epfData, setEpfData] = useState(null);
  const [postType, setPostType] = useState('');
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const searchParams = useSearchParams();
  const { showSnackbar } = useSnackbar();

  const router = useRouter();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const validationSchema = Yup.object({
    epf_number: Yup.string()
      .required('EPF Number is required')
      .matches(/^[A-Za-z]{5}\d{17}$/, 'Invalid EPF Number format, EX: ABCDE12345678901234567'),
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
        showSnackbar(postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully', 'success');
        handleClose();
        getEPF_Details(payrollid);
        // router.back();
      } else {
        showSnackbar(JSON.stringify(res.data.data), 'error');
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
      showSnackbar(postType === 'post' ? 'Data Saved Successfully' : 'Data Updated Successfully', 'success');
      setEpfdisableDialog(false);
      getEPF_Details(payrollid);
    } else {
      showSnackbar(JSON.stringify(res.data.data), 'error');
    }
  };
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Grid2 container spacing={2}>
          <Grid2 size={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
              <Grid2 container spacing={2} sx={{ maxWidth: '600px' }}>
                <Grid2 container spacing={2}>
                  {epfData && (
                    <>
                      {' '}
                      <Grid2 size={6}>
                        <Typography variant="subtitle1" sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                          Employees Provident Fund
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Box sx={{ textAlign: 'left' }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={epfData ? <IconEdit size={16} /> : <IconPlus size={16} />}
                            onClick={() => {
                              setPostType('put');
                              setValues(epfData);
                              handleOpen();
                            }}
                            style={{ textAlign: 'left' }}
                          >
                            Edit EPF
                          </Button>
                        </Box>
                      </Grid2>
                    </>
                  )}
                  {epfData ? (
                    <>
                      {/* EPF Data display */}
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          EPF Number:
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          {epfData.epf_number}
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          Employee Contribution Rate:
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          {epfData.employee_contribution_rate}
                        </Typography>
                      </Grid2>

                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          Employer Contribution Rate:
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          {epfData.employer_contribution_rate}
                        </Typography>
                      </Grid2>

                      <Grid2 size={6}>
                        <Typography variant="subtitle1" sx={{ textAlign: 'left' }}>
                          CTC Inclusions:
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <FormGroup>
                          <FormControlLabel
                            control={<Checkbox checked={epfData.include_employer_contribution_in_ctc} />}
                            label="Include Employer's Contribution in the CTC"
                            sx={{ whiteSpace: 'nowrap' }}
                            disabled
                          />
                          <FormControlLabel
                            control={<Checkbox checked={epfData.employer_edil_contribution_in_ctc} />}
                            label="Include Employer's EDIL Contribution in the CTC"
                            sx={{ whiteSpace: 'nowrap' }}
                            disabled
                          />
                          <FormControlLabel
                            control={<Checkbox checked={epfData.admin_charge_in_ctc} />}
                            label="Include Admin Charges in the CTC"
                            disabled
                          />
                        </FormGroup>
                      </Grid2>

                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          Allow employee level override PF contribution rate:
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          {epfData?.allow_employee_level_override === true ? 'Yes' : 'No'}
                        </Typography>
                      </Grid2>

                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          Pro rate restricted PF wage:
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          {epfData?.prorate_restricted_pf_wage === true ? 'Yes' : 'No'}
                        </Typography>
                      </Grid2>

                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          Consider applicable salary components based on LOP.
                        </Typography>
                      </Grid2>
                      <Grid2 size={6}>
                        <Typography variant="body1" sx={{ textAlign: 'left' }}>
                          {epfData?.apply_components_if_wage_below_15k === true ? 'Yes' : 'No'}
                        </Typography>
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
                          {/* <Button
                            size="small"
                            variant="contained"
                            onClick={() => {
                              setPostType('put');
                              setValues(epfData);
                              setEpfdisableDialog(true);
                            }}
                          >
                            Disable EPF
                          </Button> */}
                          <Button size="small" variant="contained" onClick={handleNext}>
                            Next
                          </Button>
                        </Box>
                      </Grid2>
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {/* Empty Table */}
                      <Box>
                        <EmptyTable msg="No EPF YET!" sx={{ height: 300, fontWeight: 'bold' }} />
                      </Box>
                      {/* Add EPF Button */}
                      <Grid2 container justifyContent="center" mt={2}>
                        <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={handleOpen}>
                          Enable EPF
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
            maxWidth={ModalSize.MD}
            header={{ title: 'Employees Provident Fund', subheader: '' }}
            modalContent={
              <Box component="form" onSubmit={handleSubmit} p={2}>
                <Grid2 container spacing={2}>
                  {pfFields.map((field) => (
                    <Grid2 size={{ xs: 12 }} key={field.name}>
                      {field.name === 'employee_contribution_rate' || field.name === 'employer_contribution_rate' ? (
                        <Box style={{ paddingBottom: '5px' }}>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {field.label}
                          </Typography>
                          <CustomAutocomplete
                            value={values[field.name]}
                            name={field.name}
                            onChange={(e, newValue) => setFieldValue(field.name, newValue)}
                            options={employeeContributionRates}
                            error={touched[field.name] && Boolean(errors[field.name])}
                            helperText={touched[field.name] && errors[field.name]}
                            sx={{ width: '100%' }}
                          />
                        </Box>
                      ) : (
                        <Box>
                          <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                            {field.label}
                          </Typography>
                          <TextField
                            fullWidth
                            name={field.name}
                            value={values[field.name]}
                            onChange={(e) => setFieldValue(field.name, e.target.value)}
                            error={touched[field.name] && Boolean(errors[field.name])}
                            helperText={touched[field.name] && errors[field.name]}
                          />
                        </Box>
                      )}
                    </Grid2>
                  ))}
                </Grid2>

                <br />
                <Grid2 size={{ xs: 12, sm: 6 }}>
                  <div>
                    <FormControlLabel
                      label="Include Employer's Contribution in the CTC"
                      control={
                        <Checkbox
                          checked={formik.values.include_employer_contribution_in_ctc}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            formik.setFieldValue('include_employer_contribution_in_ctc', checked);
                            // When the employer CTC is checked, enable EDIL and Admin CTC
                            if (!checked) {
                              formik.setFieldValue('employer_edil_contribution_in_ctc', false); // Reset EDIL CTC
                              formik.setFieldValue('admin_charge_in_ctc', false); // Reset Admin CTC
                            }
                          }}
                        />
                      }
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', ml: 3 }}>
                      <FormControlLabel
                        label="Include Employer's EDIL Contribution in the CTC"
                        control={
                          <Checkbox
                            checked={formik.values.employer_edil_contribution_in_ctc}
                            onChange={(e) => formik.setFieldValue('employer_edil_contribution_in_ctc', e.target.checked)}
                            disabled={!formik.values.include_employer_contribution_in_ctc} // Disabled if Employer CTC is not checked
                          />
                        }
                      />
                      <FormControlLabel
                        label="Include Admin Charges in the CTC"
                        control={
                          <Checkbox
                            checked={formik.values.admin_charge_in_ctc}
                            onChange={(e) => formik.setFieldValue('admin_charge_in_ctc', e.target.checked)}
                            disabled={!formik.values.include_employer_contribution_in_ctc} // Disabled if Employer CTC is not checked
                          />
                        }
                      />
                    </Box>
                  </div>
                </Grid2>
                <br />

                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.allow_employee_level_override}
                        onChange={(e) => formik.setFieldValue('allow_employee_level_override', e.target.checked)}
                      />
                    }
                    label="Allow Employee Level Override"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.prorate_restricted_pf_wage}
                        onChange={(e) => formik.setFieldValue('prorate_restricted_pf_wage', e.target.checked)}
                      />
                    }
                    label="Pro-rate Restricted PF Wage"
                  />{' '}
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formik.values.apply_components_if_wage_below_15k}
                        onChange={(e) => formik.setFieldValue('apply_components_if_wage_below_15k', e.target.checked)}
                      />
                    }
                    label="Consider all applicable salary components if the PF wage is less than ₹150,000 after deducting loss of pay."
                  />{' '}
                </FormGroup>
              </Box>
            }
            footer={
              <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    resetForm();
                    handleClose(); // Reset form and close dialog
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained" onClick={handleSubmit}>
                  Save
                </Button>
              </Stack>
            }
          />

          <Modal
            open={epfdisableDialog}
            maxWidth={ModalSize.MD}
            header={{ title: 'Employees Provident Fund', subheader: '' }}
            modalContent={
              <Box onSubmit={handleSubmit} p={2}>
                <Box display="flex" justifyContent="center" mb={1}>
                  <ErrorOutlineIcon color="primary" fontSize="large" />
                </Box>

                <Typography>
                  If your organisation has 20 or more employees, it is necessary to register for the EPF scheme. Are you sure you want to
                  disable EPF for this organisation?
                </Typography>
              </Box>
            }
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
          />
        </Grid2>
      )}
    </>
  );
}

export default EpfComponent;
