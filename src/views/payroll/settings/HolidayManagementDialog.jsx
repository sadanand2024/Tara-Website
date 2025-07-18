import { Box, Button, Stack, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import dayjs from 'dayjs';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Modal from 'ui-component/extended/Modal';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import CustomDatePicker from 'utils/CustomDateInput';
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
    applicable_for: Yup.string().required('This field is required'),
    description: Yup.string().required('Description is required')
  });
  const getLabelWithAsterisk = (label, isRequired) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red', fontSize: '1.2em', marginLeft: 2 }}>*</span>}
    </span>
  );


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

  const renderFields = (fields) => {
    return fields.map((field) => {
      if (field.name === 'start_date' || field.name === 'end_date') {
        return (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>

            <CustomDatePicker
              name={field.name}
              value={values[field.name] ? dayjs(values[field.name]) : null}
              onChange={(newDate) => {
                setFieldValue(field.name, newDate ? newDate.format('YYYY-MM-DD') : '');
              }}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
            />
          </Grid2>
        );
      } else if (field.name === 'applicable_for') {
        return (
          <Grid2 key={field.name} size={{ xs: 12, sm: 6 }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              {getLabelWithAsterisk(field.label, field.required)}
            </Typography>

            <CustomAutocomplete
              value={workLocations.find((loc) => loc.location_name === values[field.name]) || null} // Find the full object based on location_name
              onChange={(e, newValue) => {
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
    setValues({
      ...selectedRecord,
      start_date: selectedRecord.start_date || '',
      end_date: selectedRecord.end_date || ''
    });
  } else if (open && type === 'add') {
    resetForm(); // Empty fields when adding
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
