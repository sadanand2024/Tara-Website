import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Typography,
  TextField,
  MenuItem,
  Card,
  Grid2,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
  Checkbox
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { useFormik, getIn } from 'formik';
import RaiseRequest from '../../RaiseRequest';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useSearchParams } from 'react-router-dom';
import Factory from 'utils/Factory';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import GetActionButtons from '../../FormHelpers';

const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
};

const StepThree = ({ step, setStep, onShareholderDelete }) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [saveIndex, setSaveIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [taskIds, setTaskIds] = useState({
      shareHolder: null
    });

  // New state for backend common data
  const [commonShareholders, setCommonShareholders] = useState([]);

    const fetchTaskId = async () => {
          const url = `/companyincorporation/service-request-section-data?service_request_id=${service_id}&section=Shareholders`;
          const { res } = await Factory('get', url);
         if (res.status_cd === 0 && res.data?.task_data) {
           const taskId = res.data.task_data;
      setTaskIds({ shareHolder: taskId['Shareholders'] || {} });
          }
        };
      
  // Fetch common data from backend on mount
        useEffect(() => {
    const fetchCommonShareholders = async () => {
      setLoading(true);
      try {
        const url = `/companyincorporation/shareholders/by-request/?service_request_id=${service_id}`;
        const { res } = await Factory('get', url);
        if (res.status_cd === 0 && Array.isArray(res.data?.shareholders)) {
          setCommonShareholders(res.data.shareholders.map(sh => ({
            ...sh,
            address_line_1: sh.residential_address?.address_line_1 || '',
            address_line_2: sh.residential_address?.address_line_2 || '',
            city: sh.residential_address?.city || '',
            state: sh.residential_address?.state || '',
            pincode: sh.residential_address?.pincode || '',
            residential_same_as_aadhaar_address: Object.keys(sh.residential_address || {}).length === 0 ? 'Yes' : 'No',
          })));
        } else {
          setCommonShareholders([]);
        }
      } catch (error) {
        setCommonShareholders([]);
      } finally {
        setLoading(false);
      }
    };
          if (service_id) {
            fetchTaskId();
      fetchCommonShareholders();
          }
        }, [service_id]);


  const shareholderFields = [
    { label: 'First Name', name: 'shareholder_first_name', type: 'text' },
    { label: 'Middle Name', name: 'middle_name', type: 'text' },
    { label: 'Last Name', name: 'last_name', type: 'text' },
    { label: 'Shareholder Type', name: 'shareholder_type', type: 'autocomplete', 
      options: ['Individual Indian Resident',
      'Individual Non-Resident',
      'Individual Foreign National',
      'Body Corporate Indian Company',
      'Body Corporate Foreign Company',
      'Limited Liability Partnership'] 
    },
    { label: 'PAN', name: 'pan_card_file', type: 'file' },
    { label: 'Aadhar', name: 'aadhaar_card_file', type: 'file' },
    { label: 'Bank Statement', name: 'bank_statement_file', type: 'file' },
    { label: 'Mobile', name: 'mobile_number', type: 'text' },
    { label: 'Email', name: 'email', type: 'text' },
    { label: 'Percentage Holding', name: 'shareholding_percentage', type: 'text' },
    {
      label: 'Residential Address Proof Type',
      name: 'residential_address_proof',
      type: 'autocomplete',
      options: ['Bank Statement',
        'Utility Bill',
        'Telephone/Mobile Bill',
        'Electricity Bill',
        'Property Tax Receipt',
        'Lease/Rent Agreement']
    },
    
    { label: 'Residential Address Proof', name: 'residential_address_proof_file', type: 'file' }
  ];

  const nestedAddressFields = [
    { key: 'address_line_1', label: 'Address Line 1' },
    { key: 'address_line_2', label: 'Address Line 2' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' }
  ];

  const formik = useFormik({
    initialValues: {
      shareholders: commonShareholders.length
        ? commonShareholders.map(sh => ({
            ...sh,
            residential_same_as_aadhaar_address: sh.residential_same_as_aadhaar_address || (sh.residential_address && Object.keys(sh.residential_address).length === 0 ? 'Yes' : 'No'),
            address_line_1: sh.residential_address?.address_line_1 || '',
            address_line_2: sh.residential_address?.address_line_2 || '',
            city: sh.residential_address?.city || '',
            state: sh.residential_address?.state || '',
            pincode: sh.residential_address?.pincode || ''
          }))
        : [
            {
              shareholder_first_name: '',
              middle_name: '',
              last_name: '',
              shareholder_type: '',
              pan_card_file: null,
              aadhaar_card_file: null,
              bank_statement_file: null,
              mobile_number: '',
              email: '',
              shareholding_percentage: '',
              residential_address_proof: '',
              residential_address_proof_file: null,
              residential_same_as_aadhaar_address: 'No',
              address_line_1: '',
              address_line_2: '',
              city: '',
              state: '',
              pincode: ''
            }
          ]
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      shareholders: Yup.array().of(
        Yup.object({
          shareholder_first_name: Yup.string().required('First Name is required'),
          last_name: Yup.string().required('Last Name is required'),
          pan_card_file: Yup.mixed().required('PAN is required'),
          aadhaar_card_file: Yup.mixed().required('Aadhaar is required'),
          bank_statement_file: Yup.mixed().required('Bank Statement is required'),
          mobile_number: Yup.string().required('Mobile Number is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          shareholding_percentage: Yup.string().required('Percentage Holding is required'),
          residential_address_proof: Yup.string().required('Residential Address Proof Type is required'),
          residential_address_proof_file: Yup.string().required('Residential Address Proof is required'),
          address_line_1: Yup.string().when('residential_same_as_aadhaar_address', {
            is: 'No',
            then: (schema) => schema.required('Address Line 1 is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          address_line_2: Yup.string().when('residential_same_as_aadhaar_address', {
            is: 'No',
            then: (schema) => schema.required('Address Line 2 is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          city: Yup.string().when('residential_same_as_aadhaar_address', {
            is: 'No',
            then: (schema) => schema.required('City is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          state: Yup.string().when('residential_same_as_aadhaar_address', {
            is: 'No',
            then: (schema) => schema.required('State is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          pincode: Yup.string().when('residential_same_as_aadhaar_address', {
            is: 'No',
            then: (schema) => schema.required('Pincode is required'),
            otherwise: (schema) => schema.notRequired()
          })
        })
      )
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
      try {
        const shareholder = values.shareholders[tabIndex];
        const formData = new FormData();
        formData.append('service_request', service_id);
        formData.append('service_task', taskIds.shareHolder?.task_id);
        // Address fields
        formData.append(
          'residential_address',
          shareholder.residential_same_as_aadhaar_address === 'Yes'
            ? JSON.stringify({})
            : JSON.stringify({
                address_line_1: shareholder.address_line_1 || '',
                address_line_2: shareholder.address_line_2 || '',
                city: shareholder.city || '',
                state: shareholder.state || '',
                pincode: shareholder.pincode || ''
              })
        );
        formData.append(
          'residential_same_as_aadhaar_address',
          shareholder.residential_same_as_aadhaar_address
        );
        Object.entries(shareholder).forEach(([key, value]) => {
          if ([
            'address_line_1',
            'address_line_2',
            'city',
            'state',
            'pincode',
            'residential_address',
            'residential_same_as_aadhaar_address',
          ].includes(key)) {
            return;
          }
          if ([
            'pan_card_file',
            'aadhaar_card_file',
            'bank_statement_file',
            'residential_address_proof_file'
          ].includes(key)) {
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (typeof value === 'string' || typeof value === 'number') {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          }
        });
        const url = shareholder.id
          ? `/companyincorporation/shareholders/${shareholder.id}/`
          : '/companyincorporation/shareholders/';
        const { res } = await Factory(shareholder.id ? 'put' : 'post', url, formData);
        if (res.status_cd === 0) {
          dispatch(openSnackbar({
            open: true,
            message: shareholder.id ? 'Shareholder updated successfully!' : 'Shareholder saved successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          }));
          if (shareholder.id) {
            try {
              const formData = new FormData();
              formData.append('service_request', service_id);
              formData.append('service_task', taskIds?.shareHolder?.task_id);
              formData.append('status', 'in progress');
              await Factory('post', '/companyincorporation/shareholders/', formData);
              console.log('Shareholder status submitted successfully.');
            } catch (err) {
              console.error('Shareholder status API error:', err);
            }
          }
          await fetchShareholders();
          await fetchTaskId();
        } else {
          throw new Error(res.data?.message || 'Failed to save shareholder');
        }
      } catch (error) {
        dispatch(openSnackbar({
          open: true,
          message: error.message || 'Failed to save shareholder',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        }));
        setErrors({ submit: error.message });
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    }
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const fetchShareholders = async () => {
    setLoading(true);
    try {
      const url = `/companyincorporation/shareholders/by-request/?service_request_id=${service_id}`;
      const { res } = await Factory('get', url);
      if (res.status_cd === 0 && Array.isArray(res.data?.shareholders)) {
        // Map backend data to form fields if needed
        formik.setFieldValue('shareholders', res.data.shareholders.map(sh => ({
          ...sh,
          address_line_1: sh.residential_address?.address_line_1 || '',
          address_line_2: sh.residential_address?.address_line_2 || '',
          city: sh.residential_address?.city || '',
          state: sh.residential_address?.state || '',
          pincode: sh.residential_address?.pincode || '',
          residential_address: Object.keys(sh.residential_address || {}).length === 0 ? 'yes' : 'no',
        })));
      } else {
        formik.setFieldValue('shareholders', [
          {
            shareholder_first_name: '',
            middle_name: '',
            last_name: '',
            shareholder_type: '',
            pan_card_file: null,
            aadhaar_card_file: null,
            bank_statement_file: null,
            mobile_number: '',
            email: '',
            shareholding_percentage: '',
            residential_address_proof: '',
            residential_address_proof_file: null,
            residential_same_as_aadhaar_address: 'No',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pincode: ''
          }
        ]);
      }
    } catch (error) {
      dispatch(openSnackbar({
        open: true,
        message: error.message || 'Failed to fetch shareholders',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    } finally {
      setLoading(false);
    }
  };

  const addShareholder = () => {
    if (values.shareholders.length < 10) {
      const updated = [
        ...values.shareholders,
        {
          shareholder_first_name: '',
          middle_name: '',
          last_name: '',
          shareholder_type: '',
          pan_card_file: null,
          aadhaar_card_file: null,
          bank_statement_file: null,
          mobile_number: '',
          email: '',
          shareholding_percentage: '',
          residential_address_proof: '',
          residential_address_proof_file: null,
          residential_same_as_aadhaar_address: 'No'
        }
      ];

      setFieldValue('shareholders', updated);
      setTabIndex(updated.length - 1);
    }
  };

  const removeShareholder = () => {
    if (values.shareholders.length > 1) {
      const updated = values.shareholders.slice(0, -1);
      setFieldValue('shareholders', updated);
      if (tabIndex >= updated.length) setTabIndex(updated.length - 1);
    }
  };

  const handleShareholderDelete = async (idx) => {
    const shareholder = values.shareholders[idx];
    if (!shareholder.id) {
      // Just remove from form state, no API call
      let updatedShareholders = values.shareholders.filter((_, i) => i !== idx);
      if (updatedShareholders.length === 0) {
        updatedShareholders = [
          {
            shareholder_first_name: '',
            middle_name: '',
            last_name: '',
            shareholder_type: '',
            pan_card_file: null,
            aadhaar_card_file: null,
            bank_statement_file: null,
            mobile_number: '',
            email: '',
            shareholding_percentage: '',
            residential_address_proof: '',
            residential_address_proof_file: null,
            residential_same_as_aadhaar_address: 'No',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pincode: ''
          }
        ];
      }
      setFieldValue('shareholders', updatedShareholders);
      if (tabIndex >= updatedShareholders.length) setTabIndex(updatedShareholders.length - 1);
      return;
    }
    // Otherwise, make API call
    let url = `/companyincorporation/shareholders/${shareholder.id}/`;
    const { res } = await Factory('delete', url);
    if (res.status_cd === 0) {
      let updatedShareholders = values.shareholders.filter((_, i) => i !== idx);
      if (updatedShareholders.length === 0) {
        updatedShareholders = [
          {
            shareholder_first_name: '',
            middle_name: '',
            last_name: '',
            shareholder_type: '',
            pan_card_file: null,
            aadhaar_card_file: null,
            bank_statement_file: null,
            mobile_number: '',
            email: '',
            shareholding_percentage: '',
            residential_address_proof: '',
            residential_address_proof_file: null,
            residential_same_as_aadhaar_address: 'No',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pincode: ''
          }
        ];
      }
      setFieldValue('shareholders', updatedShareholders);
      if (tabIndex >= updatedShareholders.length) setTabIndex(updatedShareholders.length - 1);
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res.data?.data ? JSON.stringify(res.data.data) : 'Something went wrong',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  const renderField = (field, idx, path = 'shareholders') => {
    const fieldName = `${path}[${idx}].${field.name}`;
    const value = values[path][idx]?.[field.name] || '';
    const error = getIn(touched, fieldName) && getIn(errors, fieldName);

    switch (field.type) {
      case 'text':
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              size="small"
              name={fieldName}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(error)}
              helperText={error}
            />
          </Box>
        );

      case 'autocomplete':
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              select
              size="small"
              name={fieldName}
              value={value}
              onChange={handleChange}
              onBlur={handleBlur}
              error={Boolean(error)}
              helperText={error}
            >
              {field.options.map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );

      case 'file':
        return (
          <Box>
            <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
              {field.label}
            </Typography>
            <RenderFileUpload
              fieldName={fieldName}
              file={values[path][idx]?.[field.name]}
              setFieldValue={setFieldValue}
              touched={getIn(touched, fieldName)}
              errors={error}
            />
          </Box>
        );

      case 'radio':
        return (
          <>
            <FormControl component="fieldset" error={Boolean(error)}>
              <FormLabel component="legend">{field.label}</FormLabel>
              <RadioGroup row name={fieldName} value={value} onChange={(e) => setFieldValue(fieldName, e.target.value)}>
                {field.options.map((opt) => (
                  <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
                ))}
              </RadioGroup>
              {Boolean(error) && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            {/* Show extra field if DIN is Yes */}
            {field.name === 'din' && value === 'Yes' && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="DIN Number"
                  name={`${path}[${idx}].din_number`}
                  value={values[path][idx]?.din_number || ''}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={Boolean(getIn(touched, `${path}[${idx}].din_number`) && getIn(errors, `${path}[${idx}].din_number`))}
                  helperText={getIn(touched, `${path}[${idx}].din_number`) && getIn(errors, `${path}[${idx}].din_number`)}
                />
              </Box>
            )}
          </>
        );

      default:
        return null;
    }
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center">
            <Typography>No. of Shareholders</Typography>
          
          <Button variant="outlined" size="small" sx={{ mx: 2 }} onClick={removeShareholder}>
            -
          </Button>
          <Typography>{values.shareholders.length}</Typography>
          <Button variant="outlined" size="small" sx={{ mx: 2 }} onClick={addShareholder}>
            +
          </Button>
          </Box>
          <Box display="flex" alignItems="center" gap={2}> 
          <RaiseRequest
            fields={[
              'Shareholder First Name',
              'Middle Name',
              'Last Name',
              'Shareholder Type',
              'PAN',
              'Aadhar',
              'Bank Statement',
              'Mobile',
              'Email',
              'Percentage Holding',
              'Residential Address Proof Type',
              'Residential Address Proof',
              'Residential Address',
              'Address Line 1',
              'Address Line 2',
              'City',
              'State',
              'Pincode'

            ]}
            task_id={taskIds.shareHolder?.task_id}
          />
          
        </Box>
        </Box>

      
        {/* <Box display="flex" alignItems="center" mb={2}>
          <Typography>No. of Shareholders</Typography>
          <Button variant="outlined" size="small" sx={{ mx: 2 }} onClick={removeShareholder}>
            -
          </Button>
          <Typography>{values.shareholders.length}</Typography>
          <Button variant="outlined" size="small" sx={{ mx: 2 }} onClick={addShareholder}>
            +
          </Button>
        </Box> */}



        <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} variant="scrollable" scrollButtons="auto">
          {values.shareholders.map((_, idx) => (
            <Tab key={idx} label={`Shareholder ${idx + 1}`} />
          ))}
        </Tabs>

        {values.shareholders.map((_, idx) => (
          <TabPanel key={idx} value={tabIndex} index={idx}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={700} mt={2}>
              Name Of the Shareholder
            </Typography>
            <Grid2 container spacing={2}>
              {shareholderFields.map((field) => (
                <Grid2 key={field.name} size={{ xs: 2, sm: 6, md: 4 }} sx={{mt:1}}>
                  {renderField(field, idx)}
                </Grid2>
              ))}
            </Grid2>

            <Grid2 container spacing={1} mt={2}>
              <Grid2 size={{ xs: 12 }}>
                <Typography variant="h5" fontWeight={700} mb={1}>
                  <span style={{ textDecoration: 'underline' }}>Residential Address</span>
                </Typography>
              </Grid2>

              <Grid2 size={{ xs: 12 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={values.shareholders[idx].residential_same_as_aadhaar_address === 'Yes'}
                      onChange={(e) => setFieldValue(`shareholders[${idx}].residential_same_as_aadhaar_address`, e.target.checked ? 'Yes' : 'No')}
                    />
                  }
                  label="Same as in Aadhaar"
                />
              </Grid2>

              {/* Show address fields only when NOT same as Aadhaar */}
              {values.shareholders[idx].residential_same_as_aadhaar_address === 'No' &&
                nestedAddressFields.map(({ key, label }) => {
                  const fieldName = `shareholders[${idx}].${key}`;
                  const error = getIn(touched, fieldName) && getIn(errors, fieldName);

                  return (
                    <Grid2 size={{ xs: 2, sm: 6, md: 4 }} key={key}>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={500} mb={0.5}>
                          {label}
                        </Typography>
                        <TextField
                          fullWidth
                          size="small"
                          name={fieldName}
                          value={getIn(values, fieldName) || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={Boolean(error)}
                          helperText={error}
                        />
                      </Box>
                    </Grid2>
                  );
                })}
            </Grid2>

            <Grid2 size={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={async () => {
                    // Mark all fields for this specific tab as touched
                    const currentShareholder = values.shareholders[idx];
                    const touchedFields = {};
                    
                    // Mark all fields for current shareholder as touched
                    Object.keys(currentShareholder).forEach(key => {
                      touchedFields[key] = true;
                    });
                    
                    // Mark residential address fields as touched if needed
                    if (currentShareholder.residential_same_as_aadhaar_address === 'No') {
                      ['address_line_1', 'address_line_2', 'city', 'state', 'pincode'].forEach(field => {
                        touchedFields[field] = true;
                      });
                    }
                    
                    formik.setTouched({
                      ...formik.touched,
                      shareholders: values.shareholders.map((sh, i) =>
                        i === idx ? touchedFields : formik.touched.shareholders?.[i] || {}
                      )
                    });
                    
                    // Validate only the current shareholder
                    const errors = await formik.validateForm();
                    const currentErrors = errors.shareholders?.[idx];
                    
                    if (!currentErrors || Object.keys(currentErrors).length === 0) {
                      // No validation errors, proceed with submission
                    await formik.handleSubmit();
                    } else {
                      // Show validation errors for current tab only
                      formik.setErrors({
                        shareholders: values.shareholders.map((sh, i) =>
                          i === idx ? currentErrors : {}
                        )
                      });
                    }
                  }}
                >
                  Save Shareholder {idx + 1}

                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleShareholderDelete(idx)}
                >
                  Delete Shareholder {idx + 1}
                </Button>
                
              </Box>
            </Grid2>
          </TabPanel>
        ))}
      </Card>
      <Box display="flex" justifyContent={step === 2 ? 'space-between' : 'flex-end'} mt={2}>
          {/* Left Side: Back Button */}
          {step > 0 && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setStep(step - 1)}
              startIcon={<ArrowBackIcon />}
            >
              Back
            </Button>
          )}

        {/* Right Side: GetActionButtons + Continue */}
        <Box display="flex" gap={1}>
          <GetActionButtons
            type="post"
            urlEndpoint="/companyincorporation/shareholders/"
            recId={taskIds?.shareHolder?.task_id}
            status={taskIds?.shareHolder?.status}
            data={taskIds?.shareHolder}
            service_request={service_id}
            task_id={taskIds?.shareHolder?.task_id}
            urlKey="companyincorporation"
            urlBool={true}
          />

          {step < 3 && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setStep(step + 1)}
              endIcon={<ArrowForwardIcon />}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>

    </form>
  );
};

export default StepThree;
