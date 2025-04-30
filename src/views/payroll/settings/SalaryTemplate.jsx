import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, TextField, Grid2, Divider, InputAdornment, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import RenderSalaryTemplateTable from './RenderSalaryTemplateTable';

const validationSchema = Yup.object({
  template_name: Yup.string().required('Template Name is required'),
  description: Yup.string().required('Description is required'),
  annual_ctc: Yup.number().required('Annual CTC is required').positive('Annual CTC must be a positive number')
});

const initialEarnings = [{ component_name: 'Basic', calculation_type: 'Fixed', monthly: 0, annually: 0, calculation: 0 }];

function SalaryTemplate() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null);
  const [templateId, setTemplateId] = useState(null);
  const [enablePreviewButton, setEnablePreviewButton] = useState(false);

  useEffect(() => {
    const pid = searchParams.get('payrollid');
    const tid = searchParams.get('template_id');
    if (pid) setPayrollId(pid);
    if (tid) setTemplateId(tid);
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      template_name: '',
      description: '',
      annual_ctc: '',
      earnings: [...initialEarnings],
      gross_salary: { monthly: '', annually: '' },
      benefits: [],
      total_ctc: { monthly: '', annually: '' },
      deductions: [],
      net_salary: { monthly: '', annually: '' }
    },
    validationSchema,
    onSubmit: async (values) => {
      const postData = { ...values, payroll: payrollid };
      const url = templateId ? `/payroll/salary-templates/${templateId}` : `/payroll/salary-templates`;
      const method = templateId ? 'put' : 'post';

      const { res } = await Factory(method, url, postData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Template saved successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        navigate(-1);
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res?.data?.data || 'Something went wrong!'),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });

  const { values, setValues, handleChange, handleSubmit, setFieldValue, errors, touched, handleBlur } = formik;

  return (
    <MainCard title="Create Salary Template">
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Grid2 container spacing={3}>
          <Grid2 xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Template Name <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              name="template_name"
              size="small"
              value={values.template_name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.template_name && Boolean(errors.template_name)}
              helperText={touched.template_name && errors.template_name}
            />
          </Grid2>

          <Grid2 xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Description <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && Boolean(errors.description)}
              helperText={touched.description && errors.description}
            />
          </Grid2>

          <Grid2 xs={12} sm={6}>
            <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
              Annual CTC <span style={{ color: 'red' }}>*</span>
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="annual_ctc"
              value={values.annual_ctc}
              onChange={(e) => {
                setFieldValue('annual_ctc', e.target.value);
                setEnablePreviewButton(true);
              }}
              onBlur={handleBlur}
              error={touched.annual_ctc && Boolean(errors.annual_ctc)}
              helperText={touched.annual_ctc && errors.annual_ctc}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    ₹<Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
                  </InputAdornment>
                )
              }}
            />
          </Grid2>
        </Grid2>

        <Box mt={4}>
          <RenderSalaryTemplateTable
            values={values}
            setValues={setValues}
            setFieldValue={setFieldValue}
            enablePreviewButton={enablePreviewButton}
            setEnablePreviewButton={setEnablePreviewButton}
          />
        </Box>

        <Stack direction="row" spacing={2} sx={{ mt: 4, justifyContent: 'space-between' }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Save Template
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
}

export default SalaryTemplate;
