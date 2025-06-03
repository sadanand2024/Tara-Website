import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Box, Typography, Button, Grid2 } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { useSearchParams } from 'react-router-dom';
import RenderSalaryTemplateTable from '../RenderSalaryTemplateTable';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { TextField } from '@mui/material';
import { FormGroup, FormControlLabel, Radio } from '@mui/material';
import SalaryTemplate from './SalaryTemplate';
import { useNavigate } from 'react-router-dom';
const validationSchema = Yup.object({
  // template_name: Yup.string().required('Template Name is required'),
  annual_ctc: Yup.number().required('Annual CTC is required').positive('Annual CTC must be a positive number')
});
const initialEarnings = [{ component_name: 'Basic', calculation_type: 'Fixed', monthly: 0, annually: 0, calculation: 0 }];

function SalaryDetails({
  fetchEmployeeData,
  employeeData,
  createdEmployeeId,
  setSubmitRef,
  onNext,
  setEnablePreviewButton,
  enablePreviewButton
}) {
  const [payrollid, setPayrollId] = useState(null);
  const [salary_teamplates_data, setSalary_teamplates_data] = useState([]);
  const [searchParams] = useSearchParams();
  const [from, setFrom] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fields = [
    { name: 'salary_template', label: 'Salary Template' },
    { name: 'annual_ctc', label: 'Annual CTC' }
  ];
  useEffect(() => {
    const id = searchParams.get('payrollid');

    if (id) setPayrollId(id);
  }, [searchParams]);

  useEffect(() => {
    const from = searchParams.get('from');

    if (from) setFrom(from);
  }, [searchParams]);
  const formik = useFormik({
    initialValues: {
      template_name: '',
      description: '',
      annual_ctc: 0,
      tax_regime_opted: 'old',
      earnings: [...initialEarnings],
      gross_salary: { monthly: 0, annually: 0 },
      benefits: [],
      total_ctc: { monthly: 0, annually: 0 },
      deductions: [],
      net_salary: { monthly: 0, annually: 0 }
    },
    validationSchema,

    onSubmit: async (values) => {
      const postData = { ...values };

      // Show error if present in form values
      if (postData.errorMessage) {
        dispatch(
          openSnackbar({
            open: true,
            message: postData.errorMessage,
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      // Assign employee ID
      const employeeId = employeeData?.id || createdEmployeeId;
      if (employeeId) {
        postData.employee = employeeId;
      }
      if (from === 'Salary Revisions') {
        postData.update_month = new Date().getMonth() + 1;
      }
      // Determine API method and URL
      const method = employeeData?.employee_salary?.id ? 'put' : 'post';
      const url = employeeData?.employee_salary?.id
        ? `/payroll/employee-salary/${employeeData.employee_salary.id}`
        : '/payroll/employee-salary';

      const { res } = await Factory(method, url, postData);

      if (res?.status_cd === 1) {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      // Success case
      dispatch(
        openSnackbar({
          open: true,
          message: 'Data Saved Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      if (from === 'Salary Revisions') {
        navigate(-1);
      } else {
        onNext();
        await fetchEmployeeData(employeeId);
      }
    }
  });
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        {field.name === 'salary_template' ? (
          <>
            {salary_teamplates_data?.length !== 0 && (
              <>
                <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
                  {field.label}
                </Typography>
                <CustomAutocomplete
                  value={values[field.name]}
                  options={salary_teamplates_data.map((item) => item.template_name)}
                  onChange={(e, newValue) => {
                    const selectedOption = salary_teamplates_data.find((item) => item.template_name === newValue);
                    setFieldValue('template_name', newValue);
                    setFieldValue('annual_ctc', selectedOption?.annual_ctc || 0);
                    setFieldValue('description', selectedOption?.description || '');
                    setFieldValue('earnings', selectedOption?.earnings || []);
                    setFieldValue('benefits', selectedOption?.benefits || []);
                    setFieldValue('deductions', selectedOption?.deductions || []);
                    setFieldValue('total_ctc', selectedOption?.total_ctc || { monthly: '', annually: '' });
                    setFieldValue('gross_salary', selectedOption?.gross_salary || { monthly: '', annually: '' });
                    setFieldValue('net_salary', selectedOption?.net_salary || { monthly: '', annually: '' });
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              name="annual_ctc"
              size="small"
              value={values.annual_ctc}
              onChange={(e) => {
                const { name, value } = e.target;
                const numericValue = value === '' ? '' : Number(value);
                setFieldValue(name, numericValue);

                if (name === 'annual_ctc') {
                  setEnablePreviewButton(true);
                  setFieldValue('errorMessage', ''); // ✅ clear previous error
                }
              }}
              inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            />
          </>
        )}
      </Grid2>
    ));
  };

  const fetch_salary_templates = async () => {
    if (!payrollid) return; // If there's no payroll id, exit early

    const url = `/payroll/salary-templates?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setSalary_teamplates_data(res?.data);
    } else {
      setSalary_teamplates_data([]);
    }
  };
  useEffect(() => {
    if (payrollid !== null) fetch_salary_templates();
  }, [payrollid]);
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  // useEffect(() => {
  //   // Recalculate earnings whenever annual_ctc changes
  //   setValues((prev) => ({
  //     ...prev,
  //     earnings: [...prev.earnings]
  //   }));
  // }, [values.annual_ctc]);

  useEffect(() => {
    if (employeeData?.employee_salary) {
      setValues((prev) => ({
        ...prev,
        ...employeeData?.employee_salary,
        tax_regime_opted: employeeData.employee_salary?.tax_regime_opted || 'old'
      }));
    }
  }, [employeeData]);
  useEffect(() => {
    if (setSubmitRef) {
      setSubmitRef(formik.submitForm);
    }
  }, [setSubmitRef, formik.submitForm]);
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid2 container spacing={3}>
          {renderFields(fields)}
        </Grid2>

        {/* <RenderSalaryTemplateTable
          source="salarydetails"
          values={values}
          setValues={setValues}
          setFieldValue={setFieldValue}
          enablePreviewButton={enablePreviewButton}
          setEnablePreviewButton={setEnablePreviewButton}
          createdEmployeeId={employeeData?.id || createdEmployeeId}
        /> */}
        <SalaryTemplate
          source="salarydetails"
          values={values}
          setValues={setValues}
          setFieldValue={setFieldValue}
          enablePreviewButton={enablePreviewButton}
          setEnablePreviewButton={setEnablePreviewButton}
          createdEmployeeId={employeeData?.id || createdEmployeeId}
        />
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="subtitle1" color="grey.800">
              Tax Regime Opted?
            </Typography>
            <FormGroup row>
              <FormControlLabel
                label="New"
                control={
                  <Radio
                    checked={values.tax_regime_opted === 'new'}
                    onChange={() => setValues((prev) => ({ ...prev, tax_regime_opted: 'new' }))}
                  />
                }
              />
              <FormControlLabel
                label="Old"
                control={
                  <Radio
                    checked={values.tax_regime_opted === 'old'}
                    onChange={() => setValues((prev) => ({ ...prev, tax_regime_opted: 'old' }))}
                  />
                }
              />
            </FormGroup>
          </Box>
        </Grid2>
      </Box>
    </Box>
  );
}

export default SalaryDetails;
