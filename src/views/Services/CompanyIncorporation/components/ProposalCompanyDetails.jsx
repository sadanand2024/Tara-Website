import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid2, Card, Autocomplete, Button,Stack} from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import {openSnackbar} from 'store/slices/snackbar';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';



const typeOfBusinessActivityOptions = [
  'Agriculture',
  'Forestry',
  'Fishing',
  'Mining And Quarrying',
  'Construction',
  'Manufacturing',
  'Education',
  'Art And Entertainment',
  'Healthcare',
  'Social Work',
  'Transport And Logistics',
  'Electricity',
  'Gas Supply',
  'Steam',
  'Water Supply',
  'Waste Management',
  'Rental And Leasing Services',
  'Hotel And Restaurant',
  'Information And Communication',
  'Wholesale And Retail Trade',
  'Accommodation And Food Services',
  'Support Services',
  'Real Estate',
  'Financial Services',
  'Fund Management',
  'Financial And Insurance Activities',
  'Management Consultancy',
  'Legal And Accounting',
  'Business And Management Consultancy',
  'Other'
];


const ProposalCompanyDetails = ({taskId}) => {
  const [searchParams]= useSearchParams();
  const service_id = searchParams.get('service_id');
  const [proposedCompany, setproposedCompany] = useState({
    task_id:null,
    id: null
  });
  
  const dispatch = useDispatch();
  let fields = [
    {
      label: 'Proposed Company Name1',
      name: 'name_1',
      type: 'text'
    },
    {
      label: 'Proposed Company Name2',
      name: 'name_2',
      type: 'text'
    },
    {
      label: 'Proposed Company Name3',
      name: 'name_3',
      type: 'text'
    },
    {
      label: 'Main objectives of the company',
      name: 'objectives_of_company',
      type: 'text'
    },
    {
      label: 'Business Activity',
      name: 'business_activity',
      type: 'autocomplete',
      options: typeOfBusinessActivityOptions
    },
    {
      label: 'NIC Code',
      name: 'nic_code',
      type: 'text'
    },
    {
      label: 'Mobile Number',
      name: 'mobile_number',
      type: 'text'
    },
    {
      label: 'Email Address',
      name: 'email',
      type: 'text'
    }
  ];

  const formik = useFormik({
    initialValues: {
      name_1: '',
      name_2: '',
      name_3: '',
      objectives_of_company: '',
      business_activity: '',
      nic_code: '',
      mobile_number: '',
      email: ''
    },

    validationSchema: Yup.object({
      name_1: Yup.string().required('Proposed company names1 is required'),
      name_2: Yup.string().required('Proposed company names2 is required'),
      name_3: Yup.string().required('Proposed company names3 is required'),
      objectives_of_company: Yup.string().required('Main objectives of the company is required'),
      business_activity: Yup.mixed().required('Business Activity is required'),
      mobile_number: Yup.string()
                            .required('Mobile Number is required')
                            .matches(/^[0-9]+$/, 'Mobile Number must be a number')
                            .min(10, 'Mobile Number must be at least 10 digits')
                            .max(10, 'Mobile Number must not exceed 10 digits'),
      email: Yup.string().required('Email Address is required'),
      nic_code: Yup.string()
                .matches(/^[0-9]{5}$/, 'NIC Code must be exactly 5 digits')
                .max(5, 'NIC Code must be exactly 5 digits')
    }),

   onSubmit: async (values) => {
    let url = proposedCompany.id
      ? `/companyincorporation/proposed-company-detail/${proposedCompany.id}/`
      : `/companyincorporation/create-proposed-company-details/`;
    const usedTaskId = proposedCompany.service_task || taskId;

    let formData = new FormData();
    formData.append('service_request', service_id);
    formData.append('service_task', usedTaskId);
  

    formData.append('proposed_company_names', JSON.stringify({
      name_1: values.name_1,
      name_2: values.name_2,
      name_3: values.name_3
    }));

    formData.append('objectives_of_company', values.objectives_of_company);
    formData.append('business_activity', values.business_activity);
    formData.append('nic_code', values.nic_code);
    formData.append('email', values.email);
    formData.append('mobile_number', values.mobile_number);
    formData.append('status', 'in progress');
    
    const { res } = await Factory(proposedCompany.id ? 'put' : 'post', url, formData);
    if (res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: proposedCompany.id ? 'Data updated successfully' : 'Data saved successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      getproposedCompany();
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data) || 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  }

  });

 const getproposedCompany = async () => {
  const url = `/companyincorporation/proposed-company-details-by-service-request/?service_request_id=${service_id}`;
  
  const { res } = await Factory('get', url);

  if (res.status_cd === 0 && res.data) {
    const data = res.data;
    const names = data.proposed_company_names || {};
    formik.setValues({
      name_1: names.name_1 || '',
      name_2: names.name_2 || '',
      name_3: names.name_3 || '',
      objectives_of_company: data.objectives_of_company || '',
      business_activity: data.business_activity || '',
      nic_code: data.nic_code || '',
      mobile_number: data.mobile_number || '',
      email: data.email || '',     
    });

    setproposedCompany({
      ...data,
      id: data.id || null,
      
    });
  } 
  else {
    setproposedCompany({
      task_id: res?.data?.task_data?.["Proposed Company Details"]?.task_id || null
    });
  }
};



  const renderField = (field) => {
    switch (field.type) {
      case 'autocomplete':
        return (
          <Autocomplete
            fullWidth
            size="small"
            options={field.options}
            value={values[field.name]}
            onChange={(e, value) => setFieldValue(field.name, value)}
            renderInput={(params) => (
              <TextField
                {...params}
                name={field.name}
                onChange={handleChange}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
                 sx={{
                 width: '100%',
                '& .MuiInputBase-input': {
                 color: 'grey.600'
              }
            }}
              />
            )}
          />
        );
      case 'text':
        const isNumericField = ['pincode', 'nic_code', 'mobile_number'].includes(field.name);
        let maxLength = undefined;
        if (field.name === 'mobile_number') maxLength = 10;
        if (field.name === 'nic_code') maxLength = 5;
        return (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            value={values[field.name]}
            onChange={e => {
              if (isNumericField) {
                let onlyNums = e.target.value.replace(/[^0-9]/g, '');
                if (typeof maxLength === 'number') {
                  onlyNums = onlyNums.slice(0, maxLength);
                }
                setFieldValue(field.name, onlyNums);
              } else {
                handleChange(e);
              }
            }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            onBlur={handleBlur}
            inputProps={{
              ...(isNumericField ? { inputMode: 'numeric', pattern: '[0-9]*' } : {}),
              ...(typeof maxLength === 'number' ? { maxLength } : {})
            }}
             sx={{
              width: '100%',
              '& .MuiInputBase-input': {
                color: 'grey.600'
              }
            }}
          />
        );

      default:
        return null;
    }
  };

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;

  useEffect(() => {
    getproposedCompany();
  }, []);

  return (
    <Box mt={4}>
      <Card sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            <span style={{ textDecoration: 'underline' }}>Proposed Company Details</span>
          </Typography>

          <Box >
            <RaiseRequest
              fields={[
                'Proposed Company Name1',
                'Proposed Company Name2',
                'Proposed Company Name3',
                'Main objectives of the company',
                'Business Activity',
                'NIC Code',
                'Mobile Number',
                'Email Address'
              ]}
              task_id={proposedCompany.service_task || taskId}
            />
          </Box>
        </Box>


        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            {fields.map((field) => (
              <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                <Typography variant='subtitle1' mb={1}>
                  {field.label}
                </Typography>
                {renderField(field)}
              </Grid2>
            ))}
          </Grid2>

          <Grid2 size={12}>
            <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}>
              <Button variant="contained"  color="primary" type="submit">
                 Save 
              </Button>
              {proposedCompany.id && proposedCompany.status && (
                <GetActionButtons
                  variant="contained"
                  color="primary"
                  type="put"
                  urlEndpoint="proposed-company-detail"
                  recId={proposedCompany.id}
                  status={proposedCompany.status}
                  data={proposedCompany}
                  service_request={service_id}
                  task_id={taskId}
                  urlKey="companyincorporation"
                  urlBool={true}
                />
              )}
            </Stack>

          </Grid2>
          
        </form>
      </Card>
    </Box>
  );
};

export default ProposalCompanyDetails;
