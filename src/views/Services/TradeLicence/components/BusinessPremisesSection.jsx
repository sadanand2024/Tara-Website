import { Autocomplete, Box, Button, Card, Grid2, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import * as Yup from 'yup';
import RaiseRequest from '../../RaiseRequest';
import AdditionalPlaceOfBusiness from './AdditionalPlaceOfBusiness';

const BusinessPremisesSection = ({ taskId }) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const [isLoading, setIsLoading] = useState(false);
  const [businessPremises, setBusinessPremises] = useState({
    id: null,
    additional_space: 'no'
  });
  const dispatch = useDispatch();
  const tradePremises = [
    'Shop',
    'Office',
    'Godown / Warehouse',
    'Factory / Workshop',
    'Restaurant / Hotel / Eateries',
    'Stall / Kiosk / Cabin',
    'Residential Premises (Commercial Use)',
    'Clinic / Dispensary / Lab',
    'Beauty Parlour / Salon / Spa',
    'Garage / Vehicle Repair Center',
    'Educational / Coaching Center',
    'Mobile Unit / Vehicle-based Trade',
    'Cold Storage / Refrigerated Unit',
    'Open Land / Yard'
  ];
  const tradeDescriptions = [
    'Grocery Store / Kirana Shop',
    'Vegetable and Fruit Seller',
    'Medical Shop / Pharmacy',
    'Restaurant / Dhaba / Café',
    'Tea Stall / Juice Shop',
    'Sweet Shop / Bakery',
    'Clothing / Garments Shop',
    'Footwear Shop',
    'Mobile and Electronics Shop',
    'Computer Sales and Service',
    'Printing Press / DTP Center',
    'Cyber Café / Internet Center',
    'Hardware / Electrical Goods Shop',
    'Salon / Hair Cutting / Beauty Parlour',
    'Jewelry / Goldsmith Shop',
    'Stationery / Book Shop',
    'Tailoring / Boutique',
    'Courier / Logistics Services',
    'Coaching Center / Tuition Classes',
    'Travel Agency / Tour Operator',
    'Auto Garage / Mechanic Workshop',
    'Furniture Shop / Wood Works',
    'Pet Shop / Aquarium',
    'Photography Studio',
    'Real Estate / Property Dealer Office',
    'Consultancy / CA / Legal Services Office',
    'Event Management Services',
    'Catering Services',
    'Cold Storage / Ice Factory',
    'Godown / Warehouse (Storage of Goods)'
  ];

  let mainFields = [
    {
      label: 'Address Line 1',
      name: 'addressLine1',
      type: 'text',
      required: true
    },
    {
      label: 'Address Line 2',
      name: 'addressLine2',
      type: 'text',
      required: true
    },
    {
      label: 'City',
      name: 'city',
      type: 'text',
      required: true
    },
    {
      label: 'District',
      name: 'district',
      type: 'text',
      required: true
    },
    {
      label: 'State',
      name: 'state',
      type: 'text',
      required: true
    },
    {
      label: 'Pincode',
      name: 'pincode',
      type: 'text',
      required: true
    },
    {
      label: 'Nature of possession',
      name: 'nature_of_possession',
      type: 'text',
      required: true
    },
    {
      label: 'Trade Area(In Sft)',
      name: 'trade_area',
      type: 'text',
      required: true
    },
    {
      label: 'Road Type',
      name: 'road_type',
      type: 'text',
      required: true
    },

    {
      label: 'Address proof',
      name: 'address_proof',
      type: 'file',
      required: true
    },

    {
      label: 'Rental Agreement/NOC',
      name: 'rental_agreement',
      type: 'file',
      required: true
    },
    {
      label: 'Bank Statement/Cancelled Cheque',
      name: 'bankStatement',
      type: 'file',
      required: true
    }
  ];

  const formik = useFormik({
    initialValues: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      district: '',
      state: '',
      pincode: '',
      nature_of_possession: '',
      trade_area: '',
      road_type: '',
      address_proof: null,
      rental_agreement: null,
      bankStatement: null,
      additional_space: businessPremises?.additional_space || '',
      trade_premises: '',
      trade_description: ''
    },
    validationSchema: Yup.object({
      addressLine1: Yup.string().required('Address Line 1 is required'),
      addressLine2: Yup.string().required('Address Line 2 is required'),
      city: Yup.string().required('City is required'),
      // district: Yup.string().required('District is required'),
      state: Yup.string().required('State is required'),
      pincode: Yup.string()
        .matches(/^[1-9][0-9]{5}$/, 'Pincode must be exactly 6 digits')
        .required('Pincode is required'),
      nature_of_possession: Yup.string().required('Nature of possession is required'),
      trade_area: Yup.string().required('Trade Area is required'),
      road_type: Yup.string().required('Road Type is required'),
      address_proof: Yup.mixed().required('Address proof is required'),
      rental_agreement: Yup.mixed().required('Rental Agreement/NOC is required')
      // bankStatement: Yup.mixed().required('Bank Statement/Cancelled Cheque is required'),
      // additional_space: Yup.string().required('Please select if you have additional space')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      let url = businessPremises.id ? `/tradelicense/business-location/${businessPremises.id}/` : `/tradelicense/business-location/`;
      let formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', taskId);
      formData.append(
        'address',
        JSON.stringify({
          address_line1: values.addressLine1,
          address_line2: values.addressLine2,
          city: values.city,
          district: values.district,
          state: values.state,
          pincode: values.pincode
        })
      );
      formData.append('nature_of_possession', values.nature_of_possession);
      formData.append('business_locations', businessPremises.id);
      // formData.append('additional_space', values.additional_space);
      formData.append('trade_area', values.trade_area);
      formData.append('road_type', values.road_type);
      formData.append('status', 'in progress');
      formData.append('trade_premises', values.trade_premises);
      formData.append('trade_description', values.trade_description);
      if (values.address_proof && typeof values.address_proof !== 'string') {
        formData.append('address_proof', values.address_proof);
      }
      if (values.rental_agreement && typeof values.rental_agreement !== 'string') {
        formData.append('rental_agreement', values.rental_agreement);
      }
      if (values.bankStatement && typeof values.bankStatement !== 'string') {
        formData.append('bank_statement', values.bankStatement);
      }

      const { res } = await Factory(businessPremises.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: businessPremises.id ? 'Data updated successfully' : 'Data saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getBusinessPremises();
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
      setIsLoading(false);
    }
  });

  const getBusinessPremises = async () => {
    
    const url = `/tradelicense/business-location/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0 && res.data) {
      const data = res.data;
      const formValues = {
        addressLine1: data.address?.address_line1 || '',
        addressLine2: data.address?.address_line2 || '',
        city: data.address?.city || '',
        district: data.address?.district || '',
        state: data.address?.state || '',
        pincode: data.address?.pincode || '',
        nature_of_possession: data.nature_of_possession || '',
        trade_area: data.trade_area || '',
        road_type: data.road_type || '',
        trade_premises: data.trade_premises || '',
        trade_description: data.trade_description || '',
        address_proof: data.address_proof || null,
        rental_agreement: data.rental_agreement || null,
        bankStatement: data.bank_statement || null
        // additional_space: data.additional_space || null,
      };

      formik.setValues(formValues);
      //  setbusinessPremises(res.data);
      setBusinessPremises({
        ...data
        // additional_space: data.additional_space || 'no'
      });
        
    }
  };
  const getLabelWithAsterisk = (label, isRequired) => (
  <span>
    {label}
    {isRequired && <span style={{ color: 'red' }}> *</span>}
  </span>
);
  const renderField = (field, formikContext) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formikContext;

    switch (field.type) {
      case 'text':
        return field.name === 'state' ||
          field.name === 'nature_of_possession' ||
          field.name === 'road_type' ||
          field.name === 'trade_premises' ||
          field.name === 'trade_description' ? (
          <>
            {/* <Typography variant="subtitle1" mb={1}>
              {field.label}
            </Typography> */}
            <Typography variant="subtitle1" mb={1}>
             {getLabelWithAsterisk(field.label, field.required)}
          </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={
                field.name === 'state'
                  ? indian_States_And_UTs
                  : field.name === 'nature_of_possession'
                    ? ['Self Owned', 'Rented', 'Leased']
                    : field.name === 'trade_premises'
                      ? tradePremises
                      : field.name === 'trade_description'
                        ? tradeDescriptions
                        : ['Single lane', 'Double lane', 'More than 2 lanes']
              }
              value={values[field.name]}
              onChange={(e, value) => setFieldValue(field.name, value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name={field.name}
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
          </>
        ) : (
          <>
            {/* <Typography variant="subtitle1" mb={1}>
              {field.label}
            </Typography> */}
            <Typography variant="subtitle1" mb={1}>
             {getLabelWithAsterisk(field.label, field.required)}
          </Typography>
            <TextField
              fullWidth
              size="small"
              name={field.name}
              // type={field.name === 'pincode' ? 'number' : 'text'}
              value={values[field.name]}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched[field.name] && Boolean(errors[field.name])}
              helperText={touched[field.name] && errors[field.name]}
              sx={{
                width: '100%',
                '& .MuiInputBase-input': {
                  color: 'grey.600'
                }
              }}
            />
          </>
        );
      case 'file':
        return (
          <>
            {/* <Typography variant="subtitle1" mb={1}>
              {field.label}
            </Typography> */}
            <Typography variant="subtitle1" mb={1}>
               {getLabelWithAsterisk(field.label, field.required)}
          </Typography>
            <RenderFileUpload
              label={field.label}
              fieldName={field.name}
              file={values[field.name]}
              setFieldValue={setFieldValue}
              touched={touched[field.name]}
              errors={errors[field.name]}
            />
          </>
        );
      default:
        return null;
    }
  };

  const { values, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;

  useEffect(() => {
    getBusinessPremises();
  }, []);
  if (isLoading) {
    return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading business premises data...'} />;
  }
  return (
    <>
      <Card sx={{ p: 3, mt: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
              <Grid2>
                <Typography variant="h4" fontWeight={700}>
                  <span style={{ textDecoration: 'underline' }}>Business premises, location & proofs</span>
                </Typography>
              </Grid2>
              <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <RaiseRequest
                    fields={[
                      'addressLine1',
                      'addressLine2',
                      'city',
                      'district',
                      'state',
                      'pincode',
                      'nature_of_possession',
                      'trade_area',
                      'road_type',
                      'address_proof',
                      'rental_agreement',
                      'bankStatement',
                      'additional_space',
                      'trade_premises',
                      'trade_description'
                    ]}
                    task_id={taskId}
                  />
                </Box>
              </Grid2>
            </Grid2>
            {[
              { label: 'Trade Premises', name: 'trade_premises', type: 'text',required: true },
              { label: 'Trade Description', name: 'trade_description', type: 'text', required: true }
            ].map((field) => (
              <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                {renderField(field, formik)}
              </Grid2>
            ))}
            <Grid2 size={12}>
              <Typography variant="subtitle1" color="text.secondary" fontWeight={700} mb={0}>
                Principal place of business
              </Typography>
            </Grid2>
            {mainFields.map((field) => (
              <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
                {renderField(field, formik)}
              </Grid2>
            ))}

            <Grid2 size={12}>
              <br />
            </Grid2>
            {/* <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Typography>Additional place of business?</Typography>
                <FormGroup row>
                  <FormControlLabel
                    label="Yes"
                    control={
                      <Radio
                        checked={values.additional_space === 'yes'}
                        onChange={() => {
                          setFieldValue('additional_space', 'yes');
                          setBusinessPremises((prev) => ({ ...prev, additional_space: 'yes' }));
                        }}
                      />
                    }
                  />
                  <FormControlLabel
                    label="No"
                    control={
                      <Radio
                        checked={values.additional_space === 'no'}
                        onChange={() => {
                          setFieldValue('additional_space', 'no');
                          setBusinessPremises((prev) => ({ ...prev, additional_space: 'no' }));
                        }}
                      />
                    }
                  />
                </FormGroup>
              </Box>
            </Grid2> */}

            <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>

                {/* <GetActionButtons
                  type="put"
                  urlEndpoint="business-location"
                  recId={businessPremises.id}
                  status={businessPremises.status}
                  data={businessPremises}
                  service_request={service_id}
                  task_id={taskId}
                  urlKey="tradelicense"
                  urlBool={true}
                /> */}
              </Stack>
            </Grid2>
          </Grid2>
        </form>
      </Card>
      <AdditionalPlaceOfBusiness
        businessPremises={businessPremises}
        setBusinessPremises={setBusinessPremises} // ✅ Pass this down
        taskId={taskId}
      />
    </>
  );
};

export default BusinessPremisesSection;
