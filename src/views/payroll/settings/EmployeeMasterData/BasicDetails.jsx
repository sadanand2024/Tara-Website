import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FormControlLabel, Checkbox, Stack, Button, Box, Grid2, Typography, Divider, FormGroup, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import dayjs from 'dayjs';
import CustomDatePicker from 'utils/CustomDateInput';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
const employeeFields = [
  { name: 'first_name', label: 'First Name' },
  { name: 'middle_name', label: 'Middle Name' },
  { name: 'last_name', label: 'Last Name' },
  { name: 'associate_id', label: 'Employee ID' },
  { name: 'doj', label: 'Date of Joining' },
  { name: 'work_email', label: 'Work Email' },
  { name: 'mobile_number', label: 'Mobile Number' },
  { name: 'gender', label: 'Gender', options: ['Male', 'Female'] },
  { name: 'work_location', label: 'Work Location' },
  { name: 'designation', label: 'Designation' },
  { name: 'department', label: 'Department' }
];
function BasicDetails({ employeeData, setCreatedEmployeeId }) {
  const [loading, setLoading] = useState(false); // State for loader
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const [workLocations, setWorkLocations] = useState([]); // Stores the list of work locations
  const [designations, setDesignations] = useState([]); // State to store designations data
  const [departments, setDepartments] = useState([]); // State to store departments data

  useEffect(() => {
    const id = searchParams.get('payrollid');
    const empId = searchParams.get('employee_id');

    if (id) setPayrollId(id);
    if (empId) setEmployeeId(empId);
  }, [searchParams]);

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    // middle_name: Yup.string(),
    last_name: Yup.string().required('Last Name is required'),
    associate_id: Yup.string().required('Employee ID is required'),
    doj: Yup.date().required('Date of Joining is required'),
    work_email: Yup.string().email('Invalid email format').required('Work Email is required'),
    mobile_number: Yup.string()
      .required('Mobile Number is required')
      .matches(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),

    gender: Yup.string().required('Gender is required'),
    work_location: Yup.string().required('Work Location is required'),
    designation: Yup.string().required('Designation is required'),
    department: Yup.string().required('Department is required')
  });

  const formik = useFormik({
    initialValues: {
      first_name: '',
      middle_name: '',
      last_name: '',
      associate_id: '',
      doj: '',
      work_email: '',
      mobile_number: '',
      gender: '',
      work_location: '',
      designation: '',
      department: '',
      enable_portal_access: false,
      statutory_components: {
        epf_enabled: false,
        esi_enabled: false,
        professional_tax: false,
        employee_provident_fund: {
          pf_account_number: '',
          uan: ''
        },
        employee_state_insurance: {
          esi_number: ''
        }
      }
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const postData = { ...values };
      postData.payroll = Number(payrollid);
      postData.gender = values.gender.toLowerCase();
      const url = employeeData?.id ? `/payroll/employees/${employeeData?.id}` : `/payroll/employees`;
      const { res, error } = await Factory(employeeData?.id ? 'put' : 'post', url, postData);
      setLoading(false);

      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Data Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        if (!employeeData?.id && res?.id) {
          setCreatedEmployeeId(res.id);
        }
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res?.data?.data || error),
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
        <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
          {field.label}
        </Typography>
        {field.name === 'gender' || field.name === 'work_location' || field.name === 'designation' || field.name === 'department' ? (
          <CustomAutocomplete
            value={
              field.name === 'work_location'
                ? workLocations?.find((location) => location?.id === values?.work_location) || null
                : field.name === 'designation'
                  ? designations.find((designation) => designation.id === values.designation) || null
                  : field.name === 'department'
                    ? departments.find((department) => department.id === values.department) || null
                    : (values[field.name] ?? null)
            }
            onChange={(e, newValue) => {
              const valueToSet =
                field.name === 'work_location'
                  ? newValue
                    ? newValue.id
                    : ''
                  : field.name === 'designation'
                    ? newValue
                      ? newValue.id
                      : ''
                    : field.name === 'department'
                      ? newValue
                        ? newValue.id
                        : ''
                      : newValue;

              setFieldValue(field.name, valueToSet);
            }}
            options={
              field.name === 'gender'
                ? ['Male', 'Female']
                : field.name === 'work_location'
                  ? workLocations // Add options here
                  : field.name === 'designation'
                    ? designations
                    : field.name === 'department'
                      ? departments
                      : []
            }
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            sx={{ width: '100%' }}
            {...(field.name === 'work_location'
              ? { getOptionLabel: (option) => option?.location_name || '' }
              : field.name === 'designation'
                ? { getOptionLabel: (option) => option?.designation_name || '' }
                : field.name === 'department' && { getOptionLabel: (option) => option?.dept_name || '' })}
          />
        ) : field.name === 'doj' ? (
          <CustomDatePicker
            value={dayjs(values[field.name]).isValid() ? dayjs(values[field.name]) : null}
            onChange={(newDate) => {
              if (newDate && dayjs(newDate).isValid()) {
                setFieldValue(field.name, dayjs(newDate).format('YYYY-MM-DD'));
              } else {
                setFieldValue(field.name, '');
              }
            }}
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                fontSize: '0.75rem',
                height: '40px'
              }
            }}
            name={field.name}
            onBlur={() => handleBlur({ target: { name: field.name } })}
            inputFormat="DD-MM-YYYY"
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        ) : (
          <CustomInput
            fullWidth
            value={values[field.name]}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        )}
      </Grid2>
    ));
  };
  const fetchWorkLocations = async () => {
    setLoading(true);
    const url = `/payroll/work-locations/?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});
    setLoading(false);
    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setWorkLocations(res?.data); // Successfully set work locations
    } else {
      setWorkLocations([]);
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const fetchDesignations = async () => {
    if (!payrollid) return; // If there's no payroll id, exit early

    const url = `/payroll/designations/?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setDesignations(res?.data); // Successfully set work locations
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setDesignations([]);
    }
  };

  const fetchDepartments = async () => {
    if (!payrollid) return; // If there's no payroll id, exit early

    const url = `/payroll/departments/?payroll_id=${payrollid}`;
    const { res, error } = await Factory('get', url, {});

    if (res?.status_cd === 0 && Array.isArray(res?.data)) {
      setDepartments(res?.data); // Successfully set work locations
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res?.data?.data || error),
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      setDepartments([]);
    }
  };
  useEffect(() => {
    if (payrollid !== null) {
      fetchWorkLocations();
      fetchDesignations();
      fetchDepartments();
    }
  }, [payrollid]);
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue } = formik;

  useEffect(() => {
    if (employeeData) {
      setValues((prev) => ({
        ...prev,
        first_name: employeeData.first_name,
        middle_name: employeeData.middle_name,
        last_name: employeeData.last_name,
        associate_id: employeeData.associate_id,
        doj: employeeData.doj,
        work_email: employeeData.work_email,
        mobile_number: employeeData.mobile_number,
        gender: employeeData.gender.charAt(0).toUpperCase() + employeeData.gender.slice(1),
        work_location: employeeData.work_location,
        designation: employeeData.designation,
        department: employeeData.department,
        enable_portal_access: employeeData.enable_portal_access,
        statutory_components: { ...employeeData.statutory_components }
      }));
    }
  }, [employeeData]);
  return (
    <Box sx={{ mt: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={3}>
          {renderFields(employeeFields)}
        </Grid2>

        <Box sx={{ marginTop: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.enable_portal_access}
                onChange={(e) => {
                  setFieldValue('enable_portal_access', e.target.checked);
                }}
              />
            }
            label="Enable Portal Access"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h6" sx={{ mb: 1 }}>
          Statutory Components
        </Typography>
        <FormGroup sx={{ mt: 1 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={values.statutory_components.epf_enabled}
                onChange={(e) => {
                  let checked = e.target.checked;
                  if (!checked) {
                    setFieldValue('statutory_components.employee_provident_fund.pf_account_number', '');
                    setFieldValue('statutory_components.employee_provident_fund.uan', '');
                  }
                  setFieldValue('statutory_components.epf_enabled', checked);
                }}
              />
            }
            label="Employees Provident Fund"
          />
          {values.statutory_components.epf_enabled && (
            <Grid2 container spacing={2} sx={{ mt: 1, ml: 3 }}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
                  PF Account Number
                </Typography>
                <TextField
                  fullWidth
                  value={values.statutory_components.employee_provident_fund.pf_account_number}
                  onChange={(e) => setFieldValue('statutory_components.employee_provident_fund.pf_account_number', e.target.value)}
                  onBlur={handleBlur}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
                  UAN Number
                </Typography>
                <TextField
                  fullWidth
                  value={values.statutory_components.employee_provident_fund.uan || ''}
                  onChange={(e) => setFieldValue('statutory_components.employee_provident_fund.uan', e.target.value)}
                  onBlur={handleBlur}
                />
              </Grid2>
            </Grid2>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={values.statutory_components.esi_enabled}
                onChange={(e) => {
                  let checked = e.target.checked;
                  if (!checked) {
                    setFieldValue('statutory_components.employee_state_insurance.esi_number', '');
                  }
                  setFieldValue('statutory_components.esi_enabled', checked);
                }}
              />
            }
            label="Employee State Insurance"
          />
          {values.statutory_components.esi_enabled && (
            <Grid2 container spacing={2} sx={{ mt: 1, ml: 3 }}>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
                  ESI Number
                </Typography>
                <TextField
                  fullWidth
                  value={values.statutory_components.employee_state_insurance.esi_number}
                  onChange={(e) => setFieldValue('statutory_components.employee_state_insurance.esi_number', e.target.value)}
                  onBlur={handleBlur}
                />
              </Grid2>
            </Grid2>
          )}
          <FormControlLabel
            control={
              <Checkbox
                checked={values.statutory_components.professional_tax}
                onChange={(e) => {
                  let checked = e.target.checked;
                  if (!checked) {
                    setFieldValue('statutory_components.professional_tax', '');
                  }
                  setFieldValue('statutory_components.professional_tax', checked);
                }}
              />
            }
            label="Professional tax"
          />
        </FormGroup>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default BasicDetails;
