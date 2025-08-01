import { Box, Button, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Modal from 'ui-component/extended/Modal';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
export default function HolidayManagementDialog({ open, handleClose, selectedRecord, type, fetchHolidayManagementData, workLocations }) {
  const [searchParams] = useSearchParams();
  const [payrollid, setPayrollId] = useState(null); // Payroll ID fetched from URL
  const [loading, setLoading] = useState(false); // State for loader

  // Update payroll ID from search params
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const dispatch = useDispatch();

  const departmentFields = [
    { name: 'holiday_name', label: 'Holiday Name', required: true },
    { name: 'start_date', label: 'Start Date', required: true },
    { name: 'end_date', label: 'End Date', required: true },
    { name: 'applicable_for', label: 'This holiday applicable for?', required: true },
    { name: 'description', label: 'Description', required: true }
  ];

  // Formik validation schema
  const validationSchema = Yup.object({
    holiday_name: Yup.string().required('Holiday Name is required'),
    start_date: Yup.string().required('Start Date is required'),
    end_date: Yup.string().required('End Date is required'),
    // applicable_for: Yup.string().required('This field is required'),
    applicable_for: Yup.array().min(1, 'At least one location is required'),
    description: Yup.string().required('Description is required')
  });
  const getLabelWithAsterisk = (label, isRequired) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red', fontSize: '1.2em', marginLeft: 2 }}>*</span>}
    </span>
  );

  // Helper function to convert DD-MM-YYYY to YYYY-MM-DD
  const convertDateFormat = (dateString) => {
    if (!dateString) return '';
    // Check if date is already in YYYY-MM-DD format
    if (dateString.includes('-') && dateString.split('-')[0].length === 4) {
      return dateString;
    }
    // Convert from DD-MM-YYYY to YYYY-MM-DD
    const parts = dateString.split('-');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  const formik = useFormik({
    initialValues: {
      holiday_name: '',
      start_date: '',
      end_date: '',
      description: '',
      applicable_for: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      const currentYear = dayjs().year();
      const currentMonth = dayjs().month(); // month is 0-based, so January is 0

      // If the current month is before April (0-2), the financial year starts from last year
      const financialYearStart = currentMonth < 3 ? currentYear - 1 : currentYear;
      const financialYear = `${financialYearStart}-${String(financialYearStart + 1).slice(-2)}`;

      const postData = {
        ...values,
        payroll: Number(payrollid),
        financial_year: financialYear // Set the financial year in the correct format
      };
      const url = type === 'edit' ? `/payroll/holiday-management/${selectedRecord.id}` : `/payroll/holiday-management`;
      const postType = type === 'edit' ? 'put' : 'post';

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
        resetForm();
        handleClose();
        fetchHolidayManagementData(); // Assuming getESI_Details is a function to fetch department details
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
        resetForm();
      }
    }
  });
  const combinedWorkLocations = [{ id: 'all', location_name: 'All Locations' }, ...(workLocations || [])];

  const renderFields = (fields) => {
    return fields.map((field) => {
      if (field.name === 'start_date' || field.name === 'end_date') {
        return (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>

            <DatePicker
              value={values[field.name] ? dayjs(values[field.name]) : null}
              onChange={(newDate) => {
                setFieldValue(field.name, newDate ? newDate.format('YYYY-MM-DD') : '');
              }}
              format="DD/MM/YYYY"
              slotProps={{
                textField: {
                  fullWidth: true,
                  size: 'small',
                  error: touched[field.name] && Boolean(errors[field.name]),
                  helperText: touched[field.name] && errors[field.name]
                }
              }}
            />
          </Grid2>
        );
      } else if (field.name === 'applicable_for') {
        return (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>

            {/* <CustomAutocomplete
              value={workLocations.find((loc) => loc.location_name === values[field.name]) || null} // Find the full object based on location_name
              onChange={(e, newValue) => {
                const index = workLocations.findIndex(loc => loc.location_name === newValue?.location_name);
                // Set the full object, not just the location_name
                setFieldValue(field.name, newValue ? newValue.location_name : '');
              }}
              options={workLocations || []}
              getOptionLabel={(option) => option?.location_name || ''} // Safely access location_name
              sx={{ width: '100%' }}
              onBlur={handleBlur} // Handle Formik's blur event
              error={touched[field.name] && Boolean(errors[field.name])} // Display error based on validation
              helperText={touched[field.name] && errors[field.name]} // Show error message
              size="small"
            /> */}

            <CustomAutocomplete
              multiple
              value={(() => {
                if (!Array.isArray(values[field.name])) return [];
                if (values[field.name].includes('all')) {
                  return [combinedWorkLocations[0]]; // show "All Locations" only
                }
                return combinedWorkLocations.filter((loc) => values[field.name]?.includes(loc.id));
              })()}
              onChange={(e, newValues) => {
                if (newValues.some((val) => val.id === 'all')) {
                  // If "All Locations" is selected, override with all real IDs
                  const allRealIds = workLocations.map((loc) => loc.id);
                  setFieldValue(field.name, allRealIds);
                } else {
                  const ids = newValues.map((val) => val.id);
                  setFieldValue(field.name, ids);
                }
              }}
              options={combinedWorkLocations}
              getOptionLabel={(option) => option?.location_name || ''}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ width: '100%' }}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              size="small"
            />
          </Grid2>
        );
      } else {
        return (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
            {/* <Typography variant="body2" sx={{ mb: 1 }}>
              {field.label}
            </Typography> */}
            <Typography variant="body2" sx={{ mb: 1 }}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>

            <CustomInput
              fullWidth
              name={field.name}
              multiline={field.name === 'description'}
              minRows={field.name === 'description' ? 4 : undefined}
              value={values[field.name]}
              onChange={(e) => setFieldValue(field.name, e.target.value)}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
            />
          </Grid2>
        );
      }
    });
  };
  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;
  // useEffect(() => {
  //   if (type === 'edit' && selectedRecord) {
  //     setValues(selectedRecord); // Ensure values are set for editing
  //   }
  // }, [type, selectedRecord]);

  useEffect(() => {
    if (open && type === 'edit' && selectedRecord) {
      let applicableIds = [];

      if (Array.isArray(selectedRecord.applicable_for)) {
        applicableIds = selectedRecord.applicable_for
          .map((name) => {
            const match = workLocations.find((loc) => loc.location_name === name);
            return match?.id;
          })
          .filter(Boolean);
      } else if (typeof selectedRecord.applicable_for === 'string') {
        const match = workLocations.find((loc) => loc.location_name === selectedRecord.applicable_for);
        if (match) applicableIds = [match.id];
      } else if (Array.isArray(selectedRecord.applicable_for_ids)) {
        applicableIds = selectedRecord.applicable_for_ids;
      }

      setValues({
        ...selectedRecord,
        applicable_for: applicableIds,
        start_date: selectedRecord.start_date ? convertDateFormat(selectedRecord.start_date) : '',
        end_date: selectedRecord.end_date ? convertDateFormat(selectedRecord.end_date) : ''
      });
    } else if (open && type === 'add') {
      resetForm();
    }
  }, [open, type, selectedRecord]);

  return (
    <Modal
      open={open}
      maxWidth={'md'}
      showClose={true}
      handleClose={() => {
        resetForm();
        handleClose(); // Reset form and close dialog
      }}
      title={'Add/ Update Holiday'}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              resetForm();
              handleClose(); // Reset form and close dialog
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        <Grid2 container spacing={3}>
          {renderFields(departmentFields)}
        </Grid2>
      </Box>
    </Modal>
  );
}
