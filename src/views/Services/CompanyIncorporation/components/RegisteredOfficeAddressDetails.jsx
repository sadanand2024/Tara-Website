import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Grid2, Card, Autocomplete, Button, Radio, Stack, FormGroup, FormControlLabel } from '@mui/material';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import {openSnackbar} from 'store/slices/snackbar';
import RaiseRequest from '../../RaiseRequest';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useSearchParams } from 'react-router-dom';
import GetActionButtons from '../../FormHelpers';


const typeOfOwnershipOptions = ['Owned', 'Rented', 'Leased'];
const RegisteredOfficeAddressDetails = ({taskId}) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const [RegisteredOfficeAddress, setRegisteredOfficeAddress] = useState({
    task_Id:null,
    id: null
  });
  const dispatch = useDispatch();
  let fields = [
    {
      label: 'Ownership Type',
      name: 'ownership_type',
      type: 'autocomplete',
      options: typeOfOwnershipOptions
    },
    {
      label: 'Address Line 1',
      name: 'address_line_1',
      type: 'text'
    },
    {
      label: 'Address Line 2',
      name: 'address_line_2',
      type: 'text'
    },
    {
      label: 'City',
      name: 'city',
      type: 'text'
    },
    {
      label: 'District',
      name: 'district',
      type: 'text'
    },
    {
      label: 'State',
      name: 'state',
      type: 'text'
    },
    {
      label: 'Pincode',
      name: 'pincode',
      type: 'text'
    },
    {
      label: 'Utility Bill',
      name: 'utility_bill_file',
      type: 'file'
    },
    {
      label: 'NOC File',
      name: 'NOC_file',
      type: 'file'
    },
    {
      label: 'Rental Agreement',
      name: 'rent_agreement_file',
      type: 'file'
    },
    {
      label: 'Property tax Receipt',
      name: 'property_tax_receipt_file',
      type: 'file'
    }
  ];

  const formik = useFormik({
    initialValues: {
      ownership_type: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      district: '',
      pincode: '',
      state: '',
      utility_bill_file: '',
      NOC_file:'',
      rent_agreement_file:'',
      property_tax_receipt_file:''


    },

    validationSchema: Yup.object({
      ownership_type: Yup.string().required('Ownership Type is required'),
      address_line_1: Yup.string().required('Address Line 1 is required'),
      address_line_2: Yup.string().required('Address Line 2 is required'),
      city: Yup.string().required('City is required'),
      district: Yup.mixed().required('District is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string()
                .matches(/^[1-9][0-9]{5}$/, 'Pincode must be exactly 6 digits')
                .required('Pincode is required'),
      utility_bill_file: Yup.string().required('Utility Bill is required')
    }),
    onSubmit: async (values) => {
      const task_id = RegisteredOfficeAddress.task_id || taskId;
        let url = RegisteredOfficeAddress.id ? `/companyincorporation/registered-office-address-details/${RegisteredOfficeAddress.id}/` : 
        `/companyincorporation/create-registered-office-address/`;
        let formData = new FormData();
        formData.append('service_request', service_id);
        formData.append('service_task', task_id);
        formData.append('status', 'in progress');

        formData.append('ownership_type',values.ownership_type);
        formData.append('proposed_office_address',JSON.stringify({
            address_line_1: values.address_line_1,
            address_line_2: values.address_line_2,
            city: values.city,
            state: values.state,
            pincode: values.pincode,
            district: values.district

        }));

        if (values.utility_bill_file && typeof values.utility_bill_file !== 'string') {
          formData.append('utility_bill_file', values.utility_bill_file);
        }
        if (values.NOC_file && typeof values.NOC_file !== 'string') {
          formData.append('NOC_file', values.NOC_file);
        }
        if (values.rent_agreement_file && typeof values.rent_agreement_file !== 'string') {
          formData.append('rent_agreement_file', values.rent_agreement_file);
        }
        if (values.property_tax_receipt_file && typeof values.property_tax_receipt_file !== 'string') {
          formData.append('property_tax_receipt_file', values.property_tax_receipt_file);
        }
    

        const { res } = await Factory(RegisteredOfficeAddress.id ? 'put' : 'post', url, formData);
        if (res.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: RegisteredOfficeAddress.id ? 'Data updated successfully' : 'Data saved successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          getRegistredOfficeAddress();
        }
        if (res.status_cd === 1) {
          dispatch(
            openSnackbar({
              open: true,
              message: JSON.stringify(res.data.data) || 'Something went wrong',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
    }
  });

  const getRegistredOfficeAddress = async () => {
    const url = `/companyincorporation/registered-office-address-by-service-request/?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      const proposedAddress = data.proposed_office_address || {};
      const taskId = res.data?.task_data?.["Registered Office Address"]?.task_id;
      formik.setValues({
        ownership_type: data.ownership_type || '',
        address_line_1: proposedAddress.address_line_1 || '',
        address_line_2: proposedAddress.address_line_2 || '',
        city: proposedAddress.city || '',
        state: proposedAddress.state || '',
        pincode: proposedAddress.pincode || '',
        district: proposedAddress.district || '',
        utility_bill_file: data.utility_bill_file || null,
        NOC_file: data.NOC_file || null,
        rent_agreement_file: data.rent_agreement_file || null,
        property_tax_receipt_file: data.property_tax_receipt_file || null,
      });
      setRegisteredOfficeAddress({
        ...data,
        task_id: taskId || null,
        id: data.id || null
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
        // Only allow numeric input for pincode
        const isPincodeField = field.name === 'pincode';
        return (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            value={values[field.name]}
            onChange={e => {
              if (isPincodeField) {
                let onlyNums = e.target.value.replace(/[^0-9]/g, '');
                onlyNums = onlyNums.slice(0, 6);
                setFieldValue(field.name, onlyNums);
              } else {
                handleChange(e);
              }
            }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            onBlur={handleBlur}
            inputProps={isPincodeField ? { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 } : {}}
             sx={{
              width: '100%',
              '& .MuiInputBase-input': {
              color: 'grey.600'
              }
            }}
          />
        );
      case 'file':
        return (
          <>
            <RenderFileUpload
              label={field.label}
              fieldName={field.name}
              file={values[field.name]}
              setFieldValue={setFieldValue}
              touched={touched[field.name]}
              errors={errors[field.name]}
               sx={{
               width: '100%',
              '& .MuiInputBase-input': {
               color: 'grey.600'
              }
            }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  useEffect(() => {
    getRegistredOfficeAddress();
  }, []);

  return (
    <Box mt={4}>
      <Card sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>
            <span style={{ textDecoration: 'underline' }}>Registered Office Address Details</span>
          </Typography>

          <Box>
            <RaiseRequest
              fields={[
                'Ownership Type',
                'Address Line 1',
                'Address Line 2',
                'City',
                'District',
                'State',
                'Pincode',
                'Utility Bill',
                'NOC',
                'Rental Agreement',
                'Property tax Receipt'
              ]}
              task_id={taskId}
            />
          </Box>
        </Box>
        <Grid2 ml={50}>
          <Typography variant="subtitle1" mt={2}>
            Address Of Proposed Registered Office
          </Typography>
        </Grid2>
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
              <Button variant="contained" color="primary" type="submit">
                 Save
              </Button>
              <GetActionButtons
                type="put"
                urlEndpoint="registered-office-address-details"
                recId={RegisteredOfficeAddress.id}
                status={RegisteredOfficeAddress.status}
                data={RegisteredOfficeAddress}
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

export default RegisteredOfficeAddressDetails;
