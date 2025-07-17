import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Box,
  Stack,
  Typography,
  FormControl,
  FormLabel,
  FormControlLabel,
  FormGroup,
  Checkbox,
  TextField,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Grid2 from '@mui/material/Grid2'; // Import Grid2 from MUI system
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import Modal from 'ui-component/extended/Modal';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import dayjs from 'dayjs';
import CustomDatePicker from 'utils/CustomDateInput';
import { months } from 'utils/MonthsList';
import { generateFinancialYears } from 'utils/FinancialYearsList';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
export default function RenderDialog({ from, openDialog, fields, setOpenDialog, setLoading, employeeMasterData, selectedRecord, getData }) {
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const [month, setMonth] = useState(null); // Payroll ID fetched from URL
  const [financial_year, setFinancialYear] = useState(null);
  const financialYearOptions = generateFinancialYears();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Update payroll ID from search params
  useEffect(() => {
    const id = searchParams.get('payrollid');
    const month = searchParams.get('month');
    const financial_year = searchParams.get('financial_year');
    if (id) {
      setPayrollId(Number(id));
    }
    if (month) {
      setMonth(Number(month));
    }
    if (financial_year) {
      setFinancialYear(financial_year);
    }
  }, [searchParams]);

  // Formik validation schema
  const getInitialValues = () => {
    switch (from) {
      case 'Exits':
        return {
          employee: '',
          doe: '',
          department: '',
          designation: '',
          exit_reason: '',
          regular_pay_schedule: true,
          specify_date: null,
          notes: ''
        };
      case 'Attendance':
        return {
          employee: '',
          financial_year: '',
          month: '',
          total_days_of_month: '',
          holidays: '',
          week_offs: '',
          present_days: '',
          balance_days: '',
          casual_leaves: '',
          sick_leaves: '',
          earned_leaves: '',
          loss_of_pay: ''
        };
      case 'Loans & Advances':
        return {
          employee: '',
          department: '',
          designation: '',
          loan_type: '',
          amount: '',
          no_of_months: '',
          start_month: ''
        };
      case 'Variable Bonus':
        return {
          employee: '',
          bonus_type: '',
          amount: '',
          month: '',
          financial_year: ''
        };
      case 'Adhoc Bonus & Incentives':
        return {
          employee: '',
          adhoc_type: '',
          amount: '',
          reason: '',
          month: '',
          financial_year: ''
        };
      case 'Salary Revisions':
        return {
          employee: '',
          department: '',
          designation: '',
          current_ctc: '',
          revision_date: ''
        };
      case 'Tds':
        return {
          employee: '',
          pan: '',
          regime: '',
          annual_tds: '',
          tds: '',
          tds_ytd: ''
        };
      default:
        return {
          employee: '',
          doe: '',
          department: '',
          designation: '',
          regular_pay_schedule: true,
          specify_date: null,
          notes: ''
        };
    }
  };

  // Define the validation schema dynamically based on the 'from' prop
  const getValidationSchema = () => {
    switch (from) {
      case 'Exits':
        return Yup.object({
          employee: Yup.string().required('Employee is required'),
          doe: Yup.string().required('Date of exit is required'),
          exit_reason: Yup.string().required('Exit reason is required'),
          notes: Yup.string().required('Exit reason is required'),
          regular_pay_schedule: Yup.string().required('Exit reason is required')
          // specify_date: Yup.date()
          //   .nullable()
          //   .when('regular_pay_schedule', {
          //     is: false,
          //     then: Yup.date().required('Specify date is required when regular pay schedule is unchecked')
          //   })
        });

      case 'Attendance':
        return Yup.object({
          employee: Yup.string().required('This Field is required'),
          financial_year: Yup.string().required('This Field is required'),
          month: Yup.string().required('This Field is required'),
          total_days_of_month: Yup.string().required('This Field is required'),
          holidays: Yup.string().required('This Field is required'),
          week_offs: Yup.string().required('This Field is required'),
          present_days: Yup.string().required('This Field is required'),
          balance_days: Yup.string().required('This Field is required'),
          casual_leaves: Yup.string().required('This Field is required'),
          sick_leaves: Yup.string().required('This Field is required'),
          earned_leaves: Yup.string().required('This Field is required'),
          loss_of_pay: Yup.string().required('This Field is required')
        });
      case 'Loans & Advances':
        return Yup.object({
          employee: Yup.string().required('Employee is required'),
          loan_type: Yup.string().required('Loan Type is required'),
          amount: Yup.number()
            .typeError('Amount must be a number') // Handles non-numeric input errors
            .positive('Amount must be positive') // Ensures only positive values
            .required('Amount is required'),
          no_of_months: Yup.number()
            .typeError('No of Months must be a number')
            .positive('No of Months must be positive')
            .integer('No of Months must be an integer')
            .required('No of Months is required'),
          start_month: Yup.string().required('Start Month is required')
        });
      case 'Variable Bonus':
        return Yup.object({
          employee: Yup.string().required('Employee is required'),
          bonus_type: Yup.string().required('Bonus Type is required'),
          amount: Yup.number()
            .typeError('Amount must be a number') // Handles non-numeric input errors
            .positive('Amount must be positive') // Ensures only positive values
            .required('Amount is required'),
          financial_year: Yup.string().required('Financial Year is required'),
          month: Yup.string().required('Month is required')
        });

      case 'Adhoc Bonus & Incentives':
        return Yup.object({
          employee: Yup.string().required('Employee is required'),
          type: Yup.string().required('Type is required'),
          amount: Yup.number().typeError('Amount must be a number').positive('Amount must be positive').required('Amount is required')
        });

      case 'Salary Revisions':
        return Yup.object({});
      case 'Tds':
        return Yup.object({
          employee: Yup.string().required('Employee is required'),
          pan: Yup.string().required('PAN is required'),
          regime: Yup.string().required('Regime is required'),
          annual_tds: Yup.string().required('Annual Estimate is required'),
          // annual_tax_libility: Yup.string().required('Annual tax liability is required'),
          tds: Yup.string().required('TDS (Month) is required'),
          tds_ytd: Yup.string().required('TDS YTD is required')
        });

      // Add more validation cases for different scenarios (e.g., Transfers)
      default:
        return Yup.object({
          employee: Yup.string().required('Employee is required'),
          doe: Yup.string().required('Date is required'),
          notes: Yup.string().nullable(),
          regular_pay_schedule: Yup.boolean().required(),
          specify_date: Yup.date()
            .nullable()
            .when('regular_pay_schedule', {
              is: false,
              then: Yup.date().required('Specify date is required when regular pay schedule is unchecked')
            })
        });
    }
  };

  // Initialize Formik with dynamic initial values and validation schema
  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: getValidationSchema(),
    onSubmit: async (values) => {
      if (from === 'Exits') {
        setLoading(true);
        let url = selectedRecord?.id ? `/payroll/employee-exit/${selectedRecord?.id}` : `/payroll/employee-exit`;
        let method = selectedRecord?.id ? 'put' : 'Post';
        let postData = { ...values };
        postData.payroll = payrollid;
        const { res, error } = await Factory(method, url, postData);
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
          getData();
          setOpenDialog(false);
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
      if (from === 'Attendance') {
        setLoading(true);
        let url = selectedRecord?.id ? `/payroll/employee-attendance/${selectedRecord?.id}` : `/payroll/employee-attendance`;
        let method = selectedRecord?.id ? 'put' : 'Post';

        const monthNumber = values.month;

        let postData = {
          ...values,
          month: monthNumber,
          total_days_of_month: Number(values.total_days_of_month),
          holidays: Number(values.holidays),
          week_offs: Number(values.week_offs),
          present_days: Number(values.present_days),
          balance_days: Number(values.balance_days),
          casual_leaves: Number(values.casual_leaves),
          sick_leaves: Number(values.sick_leaves),
          earned_leaves: Number(values.earned_leaves),
          loss_of_pay: Number(values.loss_of_pay)
        };
        postData.payroll = payrollid;
        const { res, error } = await Factory(method, url, postData);
        setLoading(false);
        if (res.status_cd === 0) {
          // showSnackbar('Data Saved Successfully', 'success');
          dispatch(
            openSnackbar({
              open: true,
              message: 'Data Saved Successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          getData();
          setOpenDialog(false);
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
      if (from === 'Loans & Advances') {
        setLoading(true);
        let url = selectedRecord?.id ? `/payroll/advance-loans/${selectedRecord?.id}` : `/payroll/advance-loans`;
        let method = selectedRecord?.id ? 'put' : 'Post';
        let postData = {
          ...values,
          amount: Number(values.amount),
          no_of_months: Number(values.no_of_months)
        };
        postData.payroll = payrollid;
        const { res, error } = await Factory(method, url, postData);
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
          getData();
          setOpenDialog(false);
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
      if (from === 'Variable Bonus') {
        setLoading(true);
        let url = selectedRecord?.id ? `/payroll/bonus-incentives/${selectedRecord?.id}` : `/payroll/bonus-incentives`;
        let method = selectedRecord?.id ? 'put' : 'Post';
        let postData = {
          bonus_type: values.bonus_type,
          amount: Number(values.amount)
        };
        const { res, error } = await Factory(method, url, postData);
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
          getData();
          setOpenDialog(false);
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

      if (from === 'Adhoc Bonus & Incentives') {
        setLoading(true);
        let url = selectedRecord?.id ? `/payroll/adhoc-bonus/${selectedRecord?.id}` : `/payroll/adhoc-bonus`;
        let method = selectedRecord?.id ? 'put' : 'Post';
        let postData = {
          type: values.type,
          amount: Number(values.amount)
        };
        const { res, error } = await Factory(method, url, postData);
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
          getData();
          setOpenDialog(false);
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
      if (from === 'Tds') {
        setLoading(true);
        let url = selectedRecord?.id ? `/payroll/employee-tds/${selectedRecord?.id}` : `/payroll/employee-tds`;
        let method = selectedRecord?.id ? 'put' : 'Post';
        let postData = {
          ...values
        };
        postData.payroll = payrollid;
        const { res, error } = await Factory(method, url, postData);
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
          getData();
          setOpenDialog(false);
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
    }
  });
  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
        <div style={{ paddingBottom: '5px' }}>
          <Typography variant="body2">{field.label}</Typography>
        </div>
        {field.name === 'employee' ? (
          <CustomAutocomplete
            value={employeeMasterData?.find((emp) => emp.id === values[field.name]) || null}
            onChange={(event, newValue) => {
              setFieldValue(field.name, newValue?.id || '');
              setFieldValue('department', newValue?.department_name || '');
              setFieldValue('designation', newValue?.designation_name || '');
              if (from === 'Salary Revisions' && newValue?.employee_salary?.annual_ctc) {
                setFieldValue('current_ctc', newValue.employee_salary.annual_ctc);
              }
            }}
            options={employeeMasterData || []}
            getOptionLabel={(option) => `${option.first_name || ''} ${option.middle_name || ''} ${option.last_name || ''}`.trim()}
            getOptionKey={(option) => option.id}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            sx={{ width: '100%' }}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            size="small"
            disabled={(from === 'Attendance' && field.name === 'employee') || (from === 'Tds' && field.name === 'employee')}
          />
        ) : field.name === 'loan_type' || field.name === 'bonus_type' || field.name === 'adhoc_type' || field.name === 'month' ? (
          <CustomAutocomplete
            value={field.name === 'month' ? months[values[field.name] - 1] || null : values[field.name] || null}
            onChange={(e, newValue) => {
              if (field.name === 'month') {
                setFieldValue(field.name, months.indexOf(newValue) + 1);
              } else {
                setFieldValue(field.name, newValue);
              }
            }}
            options={
              field.name === 'loan_type'
                ? [
                    'Personal Loan',
                    'Emergency Loan',
                    'Salary Advance',
                    'Transportation Loan',
                    'Auto Loan',
                    'Home Loan',
                    'Education Loan',
                    '401(k) or Retirement Plan Loan',
                    'Season Ticket Loan',
                    'Stock Option Loan'
                  ]
                : field.name === 'financial_year'
                  ? ['2021-22', '2022-23', '2023-24', '2024-25', '2025-26']
                  : field.name === 'bonus_type'
                    ? [
                        'Performance Bonus',
                        'Annual Bonus',
                        'Festival Bonus',
                        'Referral Bonus',
                        'Joining Bonus',
                        'Retention Bonus',
                        'Spot Bonus',
                        'Incentive Bonus',
                        'Holiday Bonus',
                        'Project Completion Bonus'
                      ]
                    : field.name === 'type'
                      ? [
                          'Special Recognition Bonus',
                          'Project Completion Bonus',
                          'Performance Incentive',
                          'Retention Bonus',
                          'Referral Bonus',
                          'Spot Bonus',
                          'Festival Bonus',
                          'Year-End Bonus',
                          'Sales Incentive',
                          'Other Adhoc Bonus'
                        ]
                      : months
            }
            sx={{ width: '100%' }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            disabled={(from === 'Attendance' || from === 'Variable Bonus') && field.name === 'month'}
          />
        ) : field.name === 'doe' || field.name === 'start_month' ? (
          <CustomDatePicker
            views={['year', 'month', 'day']}
            value={values[field.name] ? dayjs(values[field.name], 'YYYY-MM-DD') : null}
            onChange={(newDate) => {
              if (newDate) {
                setFieldValue(field.name, newDate.format('YYYY-MM-DD'));
              } else {
                setFieldValue(field.name, ''); // Clear the date if none is selected
              }
            }}
            sx={{ width: '100%' }}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            size="small"
            inputFormat="DD-MM-YYYY"
          />
        ) : field.name === 'financial_year' ? (
          <CustomAutocomplete
            value={values[field.name]}
            name={field.name}
            options={financialYearOptions}
            onChange={(e, newValue) => {
              setFieldValue(field.name, newValue);
            }}
            // sx={{ minWidth: 200, maxWidth: 200 }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Select Financial Year"
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
              />
            )}
            disabled={from === 'Variable Bonus'}
          />
        ) : field.name === 'reset_leave_balance_type' ? (
          <CustomAutocomplete
            value={values.reset_leave_balance_type || ''}
            name="reset_leave_balance_type"
            options={['Monthly', 'Yearly']}
            onChange={(e, newValue) => setFieldValue('reset_leave_balance_type', newValue)}
            onBlur={handleBlur}
            error={touched.reset_leave_balance_type && Boolean(errors.reset_leave_balance_type)}
            helperText={touched.reset_leave_balance_type && errors.reset_leave_balance_type}
            sx={{ minWidth: 200, maxWidth: 200 }}
            placeholder="Select"
          />
        ) : (
          <CustomInput
            fullWidth
            name={field.name}
            value={values[field.name]}
            multiline={field.name === 'notes'}
            minRows={field.name === 'notes' ? 4 : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            disabled={
              field.name === 'designation' ||
              field.name === 'department' ||
              field.name === 'financial_year' ||
              // field.name === 'month' ||
              field.name === 'total_days_of_month' ||
              field.name === 'holidays' ||
              field.name === 'present_days' ||
              field.name === 'week_offs' ||
              field.name === 'pan' ||
              field.name === 'regime' ||
              field.name === 'current_ctc'
            }
          />
        )}
      </Grid2>
    ));
  };

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  useEffect(() => {
    if (selectedRecord !== null) {
      // Convert month name to numeric value if it exists
      const updatedRecord = { ...selectedRecord };
      if (selectedRecord.month && typeof selectedRecord.month === 'string') {
        updatedRecord.month = months.indexOf(selectedRecord.month) + 1;
      }
      setValues(() => ({
        ...updatedRecord
      }));
    }
  }, [selectedRecord]);
  return (
    <Modal
      open={openDialog}
      maxWidth={'md'}
      title={
        from === 'Exits'
          ? 'Employee Exit'
          : from === 'Attendance'
            ? 'Employee Attendance'
            : from === 'Loans & Advances'
              ? 'Advance Loans'
              : from === 'Variable Bonus'
                ? 'Variable Bonus'
                : from === 'Adhoc Bonus & Incentives'
                  ? 'Adhoc Bonus & Incentives'
                  : from === 'Salary Revisions'
                    ? 'Salary Revisions'
                    : from === 'Tds'
                      ? 'TDS'
                      : ''
      }
      showClose={true}
      handleClose={() => {
        setOpenDialog(false);
        resetForm();
      }}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              resetForm();
              setOpenDialog(false);
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          {from !== 'Salary Revisions' && (
            <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
              Submit
            </Button>
          )}
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} mt={2}>
        <Grid2 container spacing={2}>
          {/* Render dynamic fields for department */}
          {from === 'Salary Revisions' && selectedRecord === null ? renderFields(fields.slice(0, 4)) : renderFields(fields)}
        </Grid2>
        {from === 'Exits' && (
          <Grid2 container spacing={3} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <FormLabel>When do you want to settle the final pay?</FormLabel>
              <FormGroup row>
                {/* Regular Pay Schedule Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.regular_pay_schedule}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFieldValue('regular_pay_schedule', isChecked); // Send boolean
                        if (isChecked) {
                          setFieldValue('specify_date', null); // Reset specify_date if checked
                        }
                      }}
                    />
                  }
                  label="Regular pay schedule"
                />

                {/* Specify Date Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.specify_date !== null}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFieldValue('regular_pay_schedule', !isChecked); // Set regular_pay_schedule to false
                        setFieldValue('specify_date', isChecked ? '' : null); // Reset if unchecked
                      }}
                    />
                  }
                  label="Specify date"
                />
              </FormGroup>

              {/* Date Picker (only shown when "Specify Date" is checked) */}
              {values.specify_date !== null && (
                <CustomDatePicker
                  name="specify_date"
                  views={['year', 'month', 'day']}
                  value={values.specify_date ? dayjs(values.specify_date, 'YYYY-MM-DD') : null}
                  onChange={(newDate) => {
                    if (newDate) {
                      setFieldValue('specify_date', newDate.format('YYYY-MM-DD'));
                    } else {
                      setFieldValue('specify_date', null); // Reset if no date selected
                    }
                  }}
                  sx={{ width: '100%' }}
                  size="small"
                  inputFormat="DD-MM-YYYY"
                />
              )}
            </FormControl>
          </Grid2>
        )}

        {values.regular_pay_schedule === 'false' && (
          <CustomDatePicker
            views={['year', 'month', 'day']}
            value={values['specify_date'] ? dayjs(values['specify_date'], 'YYYY-MM-DD') : null}
            onChange={(newDate) => {
              if (newDate) {
                // Save the date in 'YYYY-MM-DD' format to Formik
                setFieldValue('specify_date', newDate.format('YYYY-MM-DD'));
              } else {
                setFieldValue('specify_date', ''); // Clear the date if none is selected
              }
            }}
            sx={{ width: '100%' }}
            onBlur={handleBlur}
            // error={touched[field.name] && Boolean(errors[field.name])}
            // helperText={touched[field.name] && errors[field.name]}
            size="small"
            inputFormat="YYYY-MM-DD" // Display in YYYY-MM-DD format
          />
        )}
        {from === 'Salary Revisions' && (
          <Grid2 container spacing={3} sx={{ mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                if (values.employee !== '' && values.employee !== null) {
                  navigate(
                    `/app/payroll/settings/add-employee?employee_id=${values.employee}&payrollid=${payrollid}&from=${'Salary Revisions'}&tabValue=${Number(1)}&month=${month}&financial_year=${financial_year}`
                  );
                } else {
                  dispatch(
                    openSnackbar({
                      open: true,
                      message: 'Please select an employee',
                      variant: 'alert',
                      alert: { color: 'error' },
                      close: false
                    })
                  );
                }
              }}
            >
              Edit Pay Structure
            </Button>
          </Grid2>
        )}
      </Box>
    </Modal>
  );
}
