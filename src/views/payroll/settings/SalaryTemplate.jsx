'use client';
import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, TextField, Typography, Button, Grid2, InputAdornment, Divider } from '@mui/material';
import HomeCard from '@/components/cards/HomeCard';
import CustomInput from '@/utils/CustomInput';
import CustomAutocomplete from '@/utils/CustomAutocomplete';
import { IconTrash } from '@tabler/icons-react';
import { usePathname, useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import Factory from '@/utils/Factory';
import MainCard from '@/components/MainCard';
import { useSnackbar } from '@/components/CustomSnackbar';
import { CoPresentOutlined } from '@mui/icons-material';
import RenderSalaryTemplateTable from './RenderSalaryTemplateTable';

const validationSchema = Yup.object({
  template_name: Yup.string().required('Template Name is required'),
  description: Yup.string().required('Description is required'),
  annual_ctc: Yup.number().required('Annual CTC is required').positive('Annual CTC must be a positive number')
});
const initialEarnings = [{ component_name: 'Basic', calculation_type: 'Fixed', monthly: 0, annually: 0, calculation: 0 }];

function SalaryTemplate({}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [template_id, setTemplate_id] = useState(null);
  const { showSnackbar } = useSnackbar();
  const [enablePreviewButton, setEnablePreviewButton] = useState(false);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  useEffect(() => {
    const id = searchParams.get('template_id');
    if (id) {
      setTemplate_id(id);
    }
  }, [searchParams]);
  // Initial fields for template
  const fields = [
    { name: 'template_name', label: 'Template Name' },
    { name: 'description', label: 'Description' }
  ];

  // Formik initialization
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
      setLoading(true);
      if (values.errorMessage) {
        showSnackbar(values.errorMessage, 'error');
        return; // Prevent form submission
      }
      let postData = { ...values };
      postData.payroll = payrollid;
      let url = template_id ? `/payroll/salary-templates/${template_id}` : `/payroll/salary-templates`;
      let method = template_id ? 'put' : 'post';
      const { res } = await Factory(method, url, postData);
      setLoading(false);

      if (res.status_cd === 1) {
        showSnackbar(JSON.stringify(res.data), 'error');
      } else {
        router.back();
      }
    }
  });

  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        <div style={{ paddingBottom: '5px' }}>
          <label>{field.label}</label>
        </div>
        <TextField
          fullWidth
          name={field.name}
          value={values[field.name]}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched[field.name] && Boolean(errors[field.name])}
          helperText={touched[field.name] && errors[field.name]}
        />
      </Grid2>
    ));
  };

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  return (
    <HomeCard title="New Salary Template" tagline="Set up your organization before starting payroll">
      <MainCard>
        <Box component="form" onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Template Fields */}
            <Grid2 container spacing={3}>
              {renderFields(fields)}
            </Grid2>

            {/* Annual CTC */}
            <Grid2 container spacing={3}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Box style={{ paddingBottom: '5px' }}>
                  <Typography variant="subtitle1">Annual CTC</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CustomInput
                    fullWidth
                    name="annual_ctc"
                    value={values.annual_ctc}
                    onChange={(e) => {
                      const annualCtc = e.target.value;
                      setFieldValue('annual_ctc', annualCtc);
                      setEnablePreviewButton(true);
                    }}
                    // onBlur={() => recalculate()}
                    error={touched.annual_ctc && Boolean(errors.annual_ctc)}
                    helperText={touched.annual_ctc && errors.annual_ctc}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" sx={{ display: 'flex', alignItems: 'center' }}>
                          <span>₹</span>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: '24px' }} />
                        </InputAdornment>
                      )
                    }}
                  />

                  <Typography variant="body1" sx={{ whiteSpace: 'nowrap', ml: 1 }}>
                    Per Year
                  </Typography>
                </Box>
              </Grid2>
            </Grid2>
            <RenderSalaryTemplateTable
              values={values}
              setValues={setValues}
              setFieldValue={setFieldValue}
              enablePreviewButton={enablePreviewButton}
              setEnablePreviewButton={setEnablePreviewButton}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="outlined" onClick={() => router.back()}>
                Back
              </Button>
              <Button variant="contained" color="primary" type="submit">
                Save Template
              </Button>
            </Box>
          </Box>
        </Box>
      </MainCard>
    </HomeCard>
  );
}

export default SalaryTemplate;
