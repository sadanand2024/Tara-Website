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

const validationSchema = Yup.object({
  // template_name: Yup.string().required('Template Name is required'),
  annual_ctc: Yup.number().required('Annual CTC is required').positive('Annual CTC must be a positive number')
});
const initialEarnings = [{ component_name: 'Basic', calculation_type: 'Fixed', monthly: 0, annually: 0, calculation: 0 }];

function SalaryDetails({ fetchEmployeeData, employeeData, createdEmployeeId }) {
  // console.log(employeeData);
  const [open, setOpen] = useState(false);
  const [payrollid, setPayrollId] = useState(null);
  const [salary_teamplates_data, setSalary_teamplates_data] = useState([]);
  const [searchParams] = useSearchParams();
  const [enablePreviewButton, setEnablePreviewButton] = useState(false);
  const dispatch = useDispatch();

  const fields = [
    { name: 'salary_template', label: 'Salary Template' },
    { name: 'annual_ctc', label: 'Annual CTC' }
  ];
  useEffect(() => {
    const id = searchParams.get('payrollid');

    if (id) setPayrollId(id);
  }, [searchParams]);

  const formik = useFormik({
    initialValues: {
      template_name: '',
      description: '',
      annual_ctc: 0,

      earnings: [...initialEarnings],
      gross_salary: { monthly: '', annually: '' },
      benefits: [],
      total_ctc: { monthly: '', annually: '' },
      deductions: [],
      net_salary: { monthly: '', annually: '' }
    },
    validationSchema,

    onSubmit: async (values) => {
      let postData = { ...values };

      if (employeeData?.id) {
        postData.employee = employeeData.id;
      } else if (createdEmployeeId) {
        postData.employee = createdEmployeeId;
      }

      let method = 'post';
      let url = '/payroll/employee-salary';

      if (employeeData?.employee_salary?.length > 0) {
        const lastSalaryRecord = employeeData.employee_salary[employeeData.employee_salary.length - 1];
        if (lastSalaryRecord?.id) {
          method = 'put';
          url = `/payroll/employee-salary/${lastSalaryRecord.id}`;
        }
      }

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
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Data Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        const employeeId = employeeData?.id || createdEmployeeId;
        await fetchEmployeeData(employeeId);
      }
    }
  });
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        {field.name === 'salary_template' ? (
          <>
            {employeeData?.employee_salary?.length !== 0 && (
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
              value={values.annual_ctc}
              onChange={(e) => {
                const { name, value } = e.target;
                const numericValue = value === '' ? '' : Number(value);
                setFieldValue(name, numericValue);

                if (name === 'annual_ctc') {
                  setEnablePreviewButton(true);
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
    if (employeeData?.employee_salary?.length > 0) {
      let lastSalary = employeeData.employee_salary[employeeData?.employee_salary?.length - 1];
      // console.log(lastSalary);
      setValues((prev) => ({
        ...prev,
        ...lastSalary
      }));
    }
  }, [employeeData]);
  // console.log(values);
  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <Grid2 container spacing={3}>
          {renderFields(fields)}
        </Grid2>

        <RenderSalaryTemplateTable
          source="salarydetails"
          values={values}
          setValues={setValues}
          setFieldValue={setFieldValue}
          enablePreviewButton={enablePreviewButton}
          setEnablePreviewButton={setEnablePreviewButton}
          createdEmployeeId={employeeData?.id || createdEmployeeId}
        />

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Save Template
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default SalaryDetails;
