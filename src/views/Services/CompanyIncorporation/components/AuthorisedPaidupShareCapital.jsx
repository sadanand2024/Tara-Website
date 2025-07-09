import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid2, Card, Button, Stack } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {openSnackbar} from 'store/slices/snackbar';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';
import CircularProgressComponent from 'utils/CircularProgressComponent';


// Utility function to format numbers with commas
const formatNumber = (value) => {
  if (!value) return '';
  const num = parseFloat(value.toString().replace(/,/g, ''));
  return isNaN(num) ? '' : num.toLocaleString('en-IN');
};

// Utility function to parse formatted number
const parseFormattedNumber = (value) => {
  if (!value) return 0;
  return parseFloat(value.toString().replace(/,/g, '')) || 0;
};

const AuthorisedPaidupShareCapital = ({ taskId }) => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const service_id = searchParams.get('service_id');
  const dispatch = useDispatch();
  const [authorisedPaidUp, setAuthorisedPaidUp] = useState({
    task_Id: null,
    id: null
  });

  const formFields = [
    {
      label: 'Authorised Share Capital',
      name: 'authorized_share_capital',
      type: 'text',
      placeholder: 'Enter amount',
      fullWidth: true,
      required: true
    },
    {
      label: 'Paid Up Share Capital',
      name: 'paid_up_share_capital',
      type: 'text',
      placeholder: 'Enter amount',
      fullWidth: true,
      required: true
    },
    {
      label: 'Face Value Per Share',
      name: 'face_value_per_share',
      type: 'text',
      placeholder: 'Enter face value',
      fullWidth: true,
      required: true
    },
    {
      label: 'No. of Shares',
      name: 'no_of_shares',
      type: 'text',
      placeholder: 'Auto-calculated',
      disabled: true,
      fullWidth: true,
      required: true
    },
    {
      label: 'Name of the Bank',
      name: 'bank_name',
      type: 'text',
      placeholder: 'Enter bank name',
      fullWidth: true,
      required: true
    }
  ];

  const validationSchema = Yup.object({
    authorized_share_capital: Yup.string()
      .required('Authorised Share Capital is required')
      .test('is-positive', 'Amount must be positive', value => 
        parseFormattedNumber(value) > 0
      ),
    paid_up_share_capital: Yup.string()
      .required('Paid Up Share Capital is required')
      .test('is-positive', 'Amount must be positive', value => 
        parseFormattedNumber(value) > 0
      ),
    face_value_per_share: Yup.string()
      .required('Face Value Per Share is required')
      .test('is-positive', 'Face value must be positive', value => 
        parseFormattedNumber(value) > 0
      )
      .test('divides-paidup', 'Paid Up Share Capital must be divisible by Face Value', function(value) {
        const paidUp = parseFormattedNumber(this.parent.paid_up_share_capital);
        const faceValue = parseFormattedNumber(value);
        if (!paidUp || !faceValue) return true;
        return paidUp % faceValue === 0;
      }),
    bank_name: Yup.string()
      .required('Bank name is required')
      .min(2, 'Bank name must be at least 2 characters')
  });

  const formik = useFormik({
    initialValues: {
      authorized_share_capital: '',
      paid_up_share_capital: '',
      face_value_per_share: '',
      no_of_shares: '',
      bank_name: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true); // Start loading
      try {
        setIsLoading(true);
        const task_id = authorisedPaidUp.task_Id || taskId;
        const url = authorisedPaidUp.id 
          ? `/companyincorporation/authorized-paid-up-capital-detail/${authorisedPaidUp.id}/`
          : `/companyincorporation/create-authorized-paid-up-capital/`;

        const formData = new FormData();
        formData.append('service_request', service_id);
        formData.append('service_task', task_id);
        formData.append('authorized_share_capital', parseFormattedNumber(values.authorized_share_capital));
        formData.append('paid_up_share_capital', parseFormattedNumber(values.paid_up_share_capital));
        formData.append('face_value_per_share', parseFormattedNumber(values.face_value_per_share));
        formData.append('no_of_shares', parseFormattedNumber(values.no_of_shares));
        formData.append('bank_name', values.bank_name);
        formData.append('status', 'in progress');

        const { res } = await Factory(authorisedPaidUp.id ? 'put' : 'post', url, formData);
        setIsLoading(false); // Stop loading

        if (res.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: authorisedPaidUp.id ? 'Data updated successfully' : 'Data saved successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          fetchAuthorisedPaidUp();
        } else {
          throw new Error(res.data?.message || 'Something went wrong');
        }
      } catch (error) {
        dispatch(
          openSnackbar({
            open: true,
            message: error.message,
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      } finally {
        setIsLoading(false);
      }
    }
  });

  const fetchAuthorisedPaidUp = async () => {
    try {
      setIsLoading(true);
      const url = `/companyincorporation/authorized-paid-up-capital-by-service-request/?service_request_id=${service_id}`;
      const { res } = await Factory('get', url);

      if (res.status_cd === 0 && res.data) {
        const data = res.data;
        const taskId = res.data?.task_data?.["Authorized PaidUp Share Capital"]?.task_id;
        
        formik.setValues({
          authorized_share_capital: formatNumber(data.authorized_share_capital),
          paid_up_share_capital: formatNumber(data.paid_up_share_capital),
          face_value_per_share: formatNumber(data.face_value_per_share),
          no_of_shares: formatNumber(data.no_of_shares),
          bank_name: data.bank_name || ''
        });

        setAuthorisedPaidUp({
          ...data,
          task_Id: taskId || null,
          id: data.id || null
        });
      }
    } catch (error) {
      dispatch({
        type: 'OPEN_SNACKBAR',
        payload: {
          open: true,
          message: 'Failed to fetch data',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        }
      });
    } finally {
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  // Calculate number of shares when paid up capital or face value changes
  useEffect(() => {
    const paidUp = parseFormattedNumber(formik.values.paid_up_share_capital);
    const faceValue = parseFormattedNumber(formik.values.face_value_per_share);

    if (paidUp && faceValue && faceValue !== 0) {
      const shares = Math.floor(paidUp / faceValue);
      formik.setFieldValue('no_of_shares', formatNumber(shares));
    } else {
      formik.setFieldValue('no_of_shares', '');
    }
  }, [formik.values.paid_up_share_capital, formik.values.face_value_per_share]);

  // Fetch initial data
  useEffect(() => {
    fetchAuthorisedPaidUp();
  }, [service_id]);
  if (isLoading) {
        return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading Authorised & Paidup Share Capital...'} />;
      }

  const handleNumberInput = (e, fieldName) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    formik.setFieldValue(fieldName, formatNumber(value));
  };

  const renderField = (field) => (
    <TextField
      fullWidth
      size="small"
      name={field.name}
      placeholder={field.placeholder}
       sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
 
      value={formik.values[field.name]}
      onChange={(e) => {
        if (field.name === 'bank_name') {
          formik.setFieldValue(field.name, e.target.value.toUpperCase());
        } else if (!field.disabled) {
          handleNumberInput(e, field.name);
        }
      }}
      onBlur={formik.handleBlur}
      error={formik.touched[field.name] && Boolean(formik.errors[field.name])}
      helperText={formik.touched[field.name] && formik.errors[field.name]}
      disabled={field.disabled || isLoading}
    />
  );
  const getLabelWithAsterisk = (label, isRequired = true) => (
  <span>
    {label}
    {isRequired && <span style={{ color: 'red', fontSize: '1.2em' }}> *</span>}
  </span>
);

  return (
    <Box mt={4}>
      <Card sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            <span style={{ textDecoration: 'underline' }}>Authorised & Paidup Share Capital</span>
          </Typography>

          <Box>
            <RaiseRequest
              fields={[
                'Authorised Share Capital',
                'Paid Up Share Capital',
                'Face Value Per Share',
                'No. of Shares',
                'Name of the Bank'
              ]}
              task_id={taskId}
            />
          </Box>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={2}>
            {formFields.map((field) => (
              <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                {/* <Typography variant='subtitle1' mb={1}>
                  {field.label}
                </Typography> */}
                 <Typography variant='subtitle1' mb={1}>
                   {getLabelWithAsterisk(field.label, field.required)}

                </Typography>
                
                {renderField(field)}
              </Grid2>
            ))}
          </Grid2>
          <Grid2>
            <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}>
              <Button 
                variant="contained" 
                color="primary" 
                type="submit"
                
                disabled={isLoading}
              >
                Save
              </Button>
               <GetActionButtons
                  type="put"
                  urlEndpoint="authorized-paid-up-capital-detail"
                  recId={authorisedPaidUp.id}
                  status={authorisedPaidUp.status}
                  data={authorisedPaidUp}
                  service_request={service_id}
                  task_id={taskId}
                  urlKey="companyincorporation"
                  urlBool={true}
                />
            </Stack>
          </Grid2>
        </form>
      </Card>
    </Box>
  );
};


export default AuthorisedPaidupShareCapital;
