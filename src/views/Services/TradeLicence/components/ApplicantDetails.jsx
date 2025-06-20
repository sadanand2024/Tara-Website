import React, { useEffect,useState} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Typography, TextField, Grid2, Button, FormControlLabel, Checkbox, Card, Stack } from '@mui/material';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useSearchParams } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import  Box  from '@mui/material/Box';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';
const DESIGNATION_CHOICES = [
  { value: 'partner', label: 'Partner' },
  { value: 'director', label: 'Director' },
  { value: 'owner', label: 'Owner' },
  { value: 'other', label: 'Other' },
];

const fields = [
  {
    label: 'Name',
    name: 'name',
    type: 'text'
  },
  {
    label: 'Designation',
    name: 'designation',
    type: 'autocomplete',
    options: DESIGNATION_CHOICES
  },
  {
    label: 'Mobile Number',
    name: 'mobile_number',
    type: 'text'
  },
  {
    label: 'Email',
    name: 'email',
    type: 'text'
  },
  {
    label: 'Aadhaar Image',
    name: 'aadhaar_image',
    type: 'file'
  },
  {
    label: 'PAN Image',
    name: 'pan_image',
    type: 'file'
  },
  {
    label: 'Photo',
    name: 'passport_photo',
    type: 'file'
  }
];

const ApplicantDetails = ({applicantTaskId}) => {

  const [searchParams] = useSearchParams();
    const service_id = searchParams.get('service_id');
    const [applicantInfo, setapplicantInfo] = useState({
        task_id: null
      });
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      designation: '',
      mobile_number: '',
      email: '',
      aadhaar_image: '',
      pan_image: '',
      passport_photo: '',
      address: '',
      residential_address: 'no',
      id: '',
      status: '',
      service_type: '',
      service_request: '',
      assignee: '',
      reviewer: '',
      service_task: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      designation: Yup.string().required('Designation is required'),
      mobile_number: Yup.string()
        .required('Mobile Number is required')
        .matches(/^[0-9]+$/, 'Mobile Number must be a number')
        .min(10, 'Mobile Number must be at least 10 digits')
        .max(10, 'Mobile Number must not exceed 10 digits'),  
      email: Yup.string().email('Invalid email format').required('Email is required'),
      aadhaar_image: Yup.mixed().required('Aadhaar Image is required'),

      pan_image: Yup.mixed().required('PAN Image is required'),
      passport_photo: Yup.mixed().required('Passport Photo is required'), 
      address: Yup.string()
    .when('residential_address', {
      is: 'no',
      then: (schema) => schema.required('Address is required when residential is not same'),
      otherwise: (schema) => schema.notRequired(),
    }),
      residential_address: Yup.string().oneOf(['yes', 'no'], 'Residential address must be either yes or no')
      
    }),
    onSubmit: async (values) => {
      let formData = new FormData();
    
      formData.append('service_request',service_id);
      formData.append('service_task',applicantTaskId);
      formData.append('name', values.name);
      formData.append('designation', values.designation);
      formData.append('mobile_number', values.mobile_number);
      formData.append('email', values.email);
      formData.append('status', 'in progress');
      if (values.aadhaar_image && typeof values.aadhaar_image !== 'string') {
        formData.append('aadhaar_image', values.aadhaar_image);
      }
      if (values.pan_image && typeof values.pan_image !== 'string') {
        formData.append('pan_image', values.pan_image);
      }
      if (values.passport_photo && typeof values.passport_photo !== 'string') {
        formData.append('passport_photo', values.passport_photo);
      }
      formData.append('address', values.address);
      formData.append('residential_address', values.residential_address);

      let url = values.id ? `/tradelicense/applicant-details/${values.id}/` : `/tradelicense/applicant-details/`;

      const { res } = await Factory(values.id ? 'put' : 'post', url, formData);
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
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: values.id ? 'Data updated successfully' : 'Data saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getApplicantDetails();
      }
    }
  });
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <TextField
            fullWidth
            size="small"
            name={field.name}
            type={field.name === 'mobile_number' ? 'number' : 'text'}
            value={values[field.name]}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
          />
        );
        case 'autocomplete':
  return (
    <Autocomplete
      fullWidth
      size="small"
      options={field.options}
      value={field.options.find(option => option.value === values[field.name]) || null}
      onChange={(e, value) => setFieldValue(field.name, value ? value.value : '')}
      renderInput={(params) => (
        <TextField
          {...params}
          name={field.name}
          onChange={handleChange}
          error={touched[field.name] && Boolean(errors[field.name])}
          helperText={touched[field.name] && errors[field.name]}
        />
      )}
    />
  );

              
      case 'file':
        return (
          <RenderFileUpload
            label={field.label}
            fieldName={field.name}
            file={values[field.name]}
            setFieldValue={setFieldValue}
            touched={touched[field.name]}
            errors={errors[field.name]}
          />
        );
    }
  };
  const handleCheckboxChange = (event) => {
    console.log(event.target.checked)
    setFieldValue('residential_address', event.target.checked ? 'yes' : 'no');
    if (event.target.checked) {
      setFieldValue('address', '');
    }
  };
  const getApplicantDetails = async () => {
    let url = `/tradelicense/applicant-details/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 1) {
      dispatch(
        openSnackbar({
          open: true,
          message: JSON.stringify(res.data.data) || 'Something went wrong'
        })
      );
    } else {
      setValues({
        ...res.data,
        aadhaar_image: res.data.aadhaar_image ? res.data.aadhaar_image : '',
        pan_image: res.data.pan_image ? res.data.pan_image : '',
        passport_photo: res.data.passport_photo ? res.data.passport_photo : ''
      });
      setapplicantInfo(res.data);
    }
  };
  useEffect(() => {
    getApplicantDetails();
  }, []);
  const { values, handleChange, handleBlur, setFieldValue, touched, errors, handleSubmit, setValues } = formik;
  return (
    <Card sx={{ p: 3, mt: 3 }}>
        <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
      <Grid2>
        <Typography variant="h4" fontWeight={700}>
          <span style={{ textDecoration: 'underline' }}>Applicant Details</span>
        </Typography>
      </Grid2>
      <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
        <Box display="flex" justifyContent="flex-end" gap={1}>
          
           <RaiseRequest
             fields={[
               'name',
              'designation',
              'mobile_number',
            'email',
              'aadhaar_image',
             'pan_image',
              'passport_photo',
              'address',
                'residential_address'
             
             ]}
            
             task_id={applicantTaskId}
           />
         </Box>
       </Grid2>
     </Grid2>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          {fields.map((field) => (
            <Grid2 key={field.name} size={{ xs: 12, sm: 6, md: 4 }}>
              <Typography color="text.secondary" fontWeight={500} mb={1}>
                {field.label}
              </Typography>
              {renderField(field)}
            </Grid2>
          ))}
        </Grid2>
        <Grid2 container spacing={2} mt={4}>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography variant="h5" fontWeight={700} mb={1}>
              <span style={{ textDecoration: 'underline' }}>Residential Address</span>
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={values.residential_address === 'yes'} onChange={handleCheckboxChange} />}
              label="Same as in Aadhaar"
            />
            {values.residential_address === 'no' && (
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
              />
            )}
          </Grid2>
        </Grid2>
        <Stack direction="row" spacing={2} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
          <GetActionButtons
                                        type="put"
                                        urlEndpoint="applicant-details"
                                        recId={applicantInfo.id}
                                        status={applicantInfo.status}
                                        data={applicantInfo}
                                        service_request={service_id}
                                        task_id={applicantTaskId}
                                        urlKey="tradelicense"
                                        urlBool={true}
                                      />
        </Stack>
      </form>
    </Card>
  );
};

export default ApplicantDetails;
