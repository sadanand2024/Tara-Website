import { Box, Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid2, TextField, Typography } from '@mui/material';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomDatePicker from 'utils/CustomDateInput';
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
import DepartmentDialog from '../DepartmentDialog';
import DesignationDialog from '../DesignationDialog';

const employeeFields = [
  { name: 'first_name', label: 'First Name', required: true },
  { name: 'middle_name', label: 'Middle Name', required: false },
  { name: 'last_name', label: 'Last Name', required:true },
  { name: 'associate_id', label: 'Employee ID', required:true },
  { name: 'doj', label: 'Date of Joining', required: true },
  { name: 'work_email', label: 'Work Email', required: true },
  { name: 'mobile_number', label: 'Mobile Number', required: false },
  { name: 'gender', label: 'Gender', required: true },
  { name: 'work_location', label: 'Work Location', required: true },
  { name: 'designation', label: 'Designation', required: true },
  { name: 'department', label: 'Department', required: true }

];
function BasicDetails({ fetchEmployeeData, employeeData, setCreatedEmployeeId, onNext, setSubmitRef }) {
  const [loading, setLoading] = useState(false); // State for loader
  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const [workLocations, setWorkLocations] = useState([]); // Stores the list of work locations
  const [designations, setDesignations] = useState([]); // State to store designations data
  const [departments, setDepartments] = useState([]); // State to store departments data

  // Dialog state and handlers for Department
  const [openDepartmentDialog, setOpenDepartmentDialog] = useState(false);
  const [departmentDialogType, setDepartmentDialogType] = useState('add');
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const handleOpenDepartmentDialog = () => {
    setDepartmentDialogType('add');
    setSelectedDepartment(null);
    setOpenDepartmentDialog(true);
  };
  const handleCloseDepartmentDialog = () => setOpenDepartmentDialog(false);

  // Dialog state and handlers for Designation
  const [openDesignationDialog, setOpenDesignationDialog] = useState(false);
  const [designationDialogType, setDesignationDialogType] = useState('add');
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const handleOpenDesignationDialog = () => {
    setDesignationDialogType('add');
    setSelectedDesignation(null);
    setOpenDesignationDialog(true);
  };
  const handleCloseDesignationDialog = () => setOpenDesignationDialog(false);

  useEffect(() => {
    const id = searchParams.get('payrollid');
    const empId = searchParams.get('employee_id');

    if (id) setPayrollId(id);
    if (empId) setEmployeeId(empId);
  }, [searchParams]);

  const validationSchema = Yup.object({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    associate_id: Yup.string().required('Employee ID is required'),
    doj: Yup.date().required('Date of Joining is required'),
    work_email: Yup.string().email('Invalid email format').required('Work Email is required'),
    // mobile_number: Yup.string()
    //   .required('Mobile Number is required')
    //   .matches(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),
    gender: Yup.string().required('Gender is required'),
    work_location: Yup.string().required('Work Location is required'),
    designation: Yup.string().required('Designation is required'),
    department: Yup.string().required('Department is required'),

    statutory_components: Yup.object().shape({
      epf_enabled: Yup.boolean(),
      esi_enabled: Yup.boolean(),
      professional_tax: Yup.boolean(),

      employee_provident_fund: Yup.lazy((_, { parent }) => {
        return Yup.object().shape({
          pf_account_number: parent?.epf_enabled
            ? Yup.string()
              // .nullable()
              .required('Pf Account Number is required')
              .matches(/^[A-Z]{5}\d{10,14}$/, 'Invalid PF Account Number. Format: 5 letters followed by 10–14 digits')
            : Yup.string().nullable(),

          uan: parent?.epf_enabled
            ? Yup.string()
              .required('UAN is required')
              .matches(/^[0-9]{12}$/, 'UAN must be a 12-digit number')
            : Yup.string().nullable()
        });
      }),

      employee_state_insurance: Yup.lazy((_, { parent }) => {
        return Yup.object().shape({
          esi_number: parent?.esi_enabled
            ? Yup.string()
              .required('ESI Number is required')
              .matches(/^[0-9]{10}$/, 'ESI Number must be 10 digits')
            : Yup.string().nullable()
        });
      })
    })
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
        } else if (employeeData?.id) {
          // ✅ Refetch employee data after update
          fetchEmployeeData(employeeData.id);
        }
        onNext();
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
  const getLabelWithAsterisk = (label, isRequired) => (
    <>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </>
  );
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        {/* <Typography variant="subtitle1">{field.label}</Typography> */}
        <Typography variant="subtitle1">
          {getLabelWithAsterisk(field.label, field.required)}
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
            sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
            {...(field.name === 'work_location'
              ? { getOptionLabel: (option) => option?.location_name || '' }
              : field.name === 'designation'
                ? { getOptionLabel: (option) => option?.designation_name || '' }
                : field.name === 'department' && { getOptionLabel: (option) => option?.dept_name || '' })}
            ListboxProps={
              field.name === 'designation'
                ? {
                  style: { maxHeight: 250 },
                  component: React.forwardRef(function CustomListboxComponent(props, ref) {
                    const { children, ...rest } = props;
                    return (
                      <ul ref={ref} {...rest}>
                        {children}
                        <li style={{ padding: '8px 16px' }}>
                          <Button
                            startIcon={<IconPlus />}
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              bgcolor: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.dark'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDesignationDialog();
                            }}
                          >
                            Add Designation
                          </Button>
                        </li>
                      </ul>
                    );
                  })
                }
                : field.name === 'department'
                  ? {
                    style: { maxHeight: 250 },
                    component: React.forwardRef(function CustomListboxComponent(props, ref) {
                      const { children, ...rest } = props;
                      return (
                        <ul ref={ref} {...rest}>
                          {children}
                          <li style={{ padding: '8px 16px' }}>
                            <Button
                              startIcon={<IconPlus />}
                              variant="contained"
                              fullWidth
                              size="small"
                              sx={{
                                bgcolor: 'primary.main',
                                '&:hover': {
                                  bgcolor: 'primary.dark'
                                }
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDepartmentDialog();
                              }}
                            >
                              Add Department
                            </Button>
                          </li>
                        </ul>
                      );
                    })
                  }
                  : undefined
            }
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
            onChange={(e) => {
              let val = e.target.value;

              // Restrict first, middle, and last name to letters and space only
              if (['first_name', 'middle_name', 'last_name'].includes(field.name)) {
                val = val.replace(/[^a-zA-Z\s]/g, '');
              }

              // Associate ID - Alphanumeric, no special characters
              if (field.name === 'associate_id') {
                val = val.replace(/[^a-zA-Z0-9]/g, '');
              }

              // Work Email - let Yup handle validation, no need to filter input
              // Mobile Number - digits only
              if (field.name === 'mobile_number') {
                val = val.replace(/\D/g, '');
              }

              setFieldValue(field.name, val);
            }}
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
        first_name: employeeData.first_name || '',
        middle_name: employeeData.middle_name || '',
        last_name: employeeData.last_name || '',
        associate_id: employeeData.associate_id || '',
        doj: employeeData.doj || '',
        work_email: employeeData.work_email || '',
        mobile_number: employeeData.mobile_number || '',
        gender: employeeData.gender ? employeeData.gender.charAt(0).toUpperCase() + employeeData.gender.slice(1) : '',
        work_location: employeeData.work_location || '',
        designation: employeeData.designation || '',
        department: employeeData.department || '',
        enable_portal_access: employeeData.enable_portal_access || false,
        statutory_components: {
          epf_enabled: employeeData.statutory_components?.epf_enabled || false,
          esi_enabled: employeeData.statutory_components?.esi_enabled || false,
          professional_tax: employeeData.statutory_components?.professional_tax || false,
          employee_provident_fund: {
            pf_account_number: employeeData.statutory_components?.employee_provident_fund?.pf_account_number || '',
            uan: employeeData.statutory_components?.employee_provident_fund?.uan || ''
          },
          employee_state_insurance: {
            esi_number: employeeData.statutory_components?.employee_state_insurance?.esi_number || ''
          }
        }
      }));
    }
  }, [employeeData]);
  useEffect(() => {
    if (setSubmitRef) {
      setSubmitRef(formik.submitForm);
    }
  }, [setSubmitRef, formik.submitForm]);

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

        <Typography variant="h4" sx={{ mb: 1 }}>
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
                  {getLabelWithAsterisk(
                    <>
                      PF Account Number{' '}
                      <Typography component="span" sx={{ fontSize: '0.75rem', color: 'grey.600' }}>
                        (e.g. ABCD1234567)
                      </Typography>
                    </>,
                    true // or false based on conditional logic
                  )}
                </Typography>

                <TextField
                  fullWidth
                  value={values.statutory_components?.employee_provident_fund?.pf_account_number || ''}
                  onChange={(e) => setFieldValue('statutory_components.employee_provident_fund.pf_account_number', e.target.value)}
                  onBlur={handleBlur}
                  name="statutory_components.employee_provident_fund.pf_account_number"
                  error={
                    touched?.statutory_components?.employee_provident_fund?.pf_account_number &&
                    Boolean(errors?.statutory_components?.employee_provident_fund?.pf_account_number)
                  }
                  helperText={
                    touched?.statutory_components?.employee_provident_fund?.pf_account_number &&
                    errors?.statutory_components?.employee_provident_fund?.pf_account_number
                  }
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6 }}>
                {/* <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
                  UAN Number{' '}
                  <Typography component="span" sx={{ fontSize: '0.75rem', color: 'grey.600' }}>
                    (e.g. 123456789012)
                  </Typography>
                </Typography> */}
                <Typography variant="subtitle2" sx={{ color: 'grey.800', mb: 0.5 }}>
                  {getLabelWithAsterisk(
                    <>
                      UAN Number{' '}
                      <Typography component="span" sx={{ fontSize: '0.75rem', color: 'grey.600', display: 'inline' }}>
                        (e.g. 123456789012)
                      </Typography>
                    </>,
                    true // Set to `true` if UAN is required
                  )}
                </Typography>

                <TextField
                  fullWidth
                  value={values.statutory_components?.employee_provident_fund?.uan || ''}
                  onChange={(e) => setFieldValue('statutory_components.employee_provident_fund.uan', e.target.value)}
                  onBlur={handleBlur}
                  name="statutory_components.employee_provident_fund.uan"
                  error={
                    touched?.statutory_components?.employee_provident_fund?.uan &&
                    Boolean(errors?.statutory_components?.employee_provident_fund?.uan)
                  }
                  helperText={
                    touched?.statutory_components?.employee_provident_fund?.uan &&
                    errors?.statutory_components?.employee_provident_fund?.uan
                  }
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
                  {getLabelWithAsterisk(
                    <>
                      ESI Number{' '}
                      <Typography component="span" sx={{ fontSize: '0.75rem', color: 'grey.600', display: 'inline' }}>
                        (e.g. 1234567890)
                      </Typography>
                    </>,
                    true // Set this to `true` if ESI Number is required based on conditions
                  )}
                </Typography>

                <TextField
                  fullWidth
                  value={values.statutory_components?.employee_state_insurance?.esi_number || ''}
                  onChange={(e) => setFieldValue('statutory_components.employee_state_insurance.esi_number', e.target.value)}
                  onBlur={handleBlur}
                  name="statutory_components.employee_state_insurance.esi_number"
                  error={
                    touched?.statutory_components?.employee_state_insurance?.esi_number &&
                    Boolean(errors?.statutory_components?.employee_state_insurance?.esi_number)
                  }
                  helperText={
                    touched?.statutory_components?.employee_state_insurance?.esi_number &&
                    errors?.statutory_components?.employee_state_insurance?.esi_number
                  }
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
      </form>
      {/* Department and Designation Dialogs */}
      <DepartmentDialog
        open={openDepartmentDialog}
        handleClose={handleCloseDepartmentDialog}
        handleOpenDialog={handleOpenDepartmentDialog}
        selectedRecord={selectedDepartment}
        type={departmentDialogType}
        setType={setDepartmentDialogType}
        fetchDepartments={fetchDepartments}
      />
      <DesignationDialog
        open={openDesignationDialog}
        handleClose={handleCloseDesignationDialog}
        handleOpenDialog={handleOpenDesignationDialog}
        selectedRecord={selectedDesignation}
        type={designationDialogType}
        setType={setDesignationDialogType}
        fetchDesignations={fetchDesignations}
      />
    </Box>
  );
}

export default BasicDetails;
