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
import RaiseRequest from '../../RaiseRequest';
import { useFormik, getIn } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useSearchParams } from 'react-router-dom';
import GetActionButtons from '../../FormHelpers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';


const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={2}>{children}</Box>}
    </div>
  );
};

const StepTwo = ({ step, setStep }) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const dispatch = useDispatch();
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [directors, setDirectors] = useState([]);
 

  const [taskIds, setTaskIds] = useState({
      director: null,
    });
  
    const fetchTaskId = async () => {
        const url = `/companyincorporation/service-request-section-data?service_request_id=${service_id}&section=Directors`;
        const { res } = await Factory('get', url);
       if (res.status_cd === 0 && res.data?.task_data) {
         const taskData = res.data.task_data;
         setTaskIds({ director: taskData['Directors'] || {} });
       }
      };
    
      useEffect(() => {
        if (service_id) {
          fetchTaskId();
        }
      }, [service_id]);


  const directorFields = [
    { label: 'Director First Name', name: 'director_first_name', type: 'text' },
    { label: 'Middle Name', name: 'middle_name', type: 'text' },
    { label: 'Last Name', name: 'last_name', type: 'text' },
    {
      label: 'Category of Directorship in the Company',
      name: 'category_of_directorship',
      type: 'autocomplete',
      options: ['Executive Director',
              'Non-Executive Director',
              'Independent Director',
              'Nominee Director',
              'Managing Director',
              'Whole Time Director',
              'Alternate Director',
              'Additional Director',
              'Small Shareholder Director',
              'Chairman And Managing Director',
              'Professional Director',
              'Government Nominee Director',
              'Foreign National Director',
              'Resident Director',
              'Non-Resident Director',
              'Woman Director',
              'Other'
              ]
    },
    { label: 'PAN', name: 'pan_card_file', type: 'file' },
    { label: 'Aadhar', name: 'aadhaar_card_file', type: 'file' },
    { label: 'Passport Size Photo', name: 'passport_photo_file', type: 'file' },
    { label: 'Mobile', name: 'mobile_number', type: 'text' },
    { label: 'Email', name: 'email', type: 'text' },
    { label: 'Occupation', name: 'occupation', type: 'text' },
    { label: 'Area of Occupation', name: 'area_of_occupation', type: 'text' },
    { label: 'Educational Qualification', name: 'qualification', type: 'autocomplete', 
      options: ['Below SSC',
      'SSC/Matriculation',
      'HSC/Intermediate/12th passed',
      'Graduate',
      'Post Graduate',
      'Doctorate',
      'Professional Degree',
      'Other'] },
      { label: 'Father First Name', name: 'father_first_name', type: 'text' },
    { label: 'Middle Name', name: 'father_middle_name', type: 'text' },
    { label: 'Last Name', name: 'father_last_name', type: 'text' },
    { label: 'Gender', name: 'gender', type: 'autocomplete', options: ['Male', 'Female', 'Other'] },
    { label: 'Nationality', name: 'nationality', type: 'autocomplete', options: ['Indian', 'Foreign National'] },
   
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
    { label: 'Residential Address Proof', name: 'residential_address_proof_file', type: 'file' },
    { label: 'Form DIR 2', name: 'form_dir2', type: 'file' },
    { label: 'Specimen Signature Of the Director', name: 'specimen_signature_of_director', type: 'file' },
    { label: 'Authorised Signatory Name of Director', name: 'authorised_signatory_name', type: 'text' },
    { label: 'DSC: Apply?', name: 'dsc', type: 'radio', options: ['Yes', 'No'] },
    { label: 'DIN', name: 'din_number', type: 'radio', options: ['Yes', 'No'] },
    {
      type: 'shareholding',
      label: 'Is this Director, also a Shareholder?',
      name: 'is_this_director_also_shareholder',
      options: [
        { value: 'Yes', label: 'Yes' },
        { value: 'No', label: 'No' }
      ]
    }
  ];

  const nestedAddressFields = [
    { key: 'address_line_1', label: 'Address Line 1' },
    { key: 'address_line_2', label: 'Address Line 2' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'pincode', label: 'Pincode' }
  ];

  const nestedDirectorFields = [
    { label: 'Company Name', name: 'company_name', type: 'text' },
    { label: 'CIN', name: 'cin', type: 'text' },
    { label: 'Type of Company', name: 'type_of_company', type: 'text' },
    { label: 'Position Held', name: 'position_held', type: 'text' }
  ];

  const formik = useFormik({
    initialValues: {
      directors: [
        {
          director_first_name: '',
          middle_name: '',
          last_name: '',
          category_of_directorship: '',
          pan_card_file: null,
          aadhaar_card_file: null,
          passport_photo_file: null,
          mobile_number: '',
          email: '',
          occupation: '',
          area_of_occupation: '',
          qualification: '',
          gender: '',
          nationality: '',
          father_first_name: '',
          father_middle_name: '',
          father_last_name: '',
          residential_address_proof: '',
          residential_address_proof_file: null,
          form_dir2: null,
          specimen_signature_of_director: null,
          authorised_signatory_name: '',
          dsc: false,
          din_number: false,
          is_this_director_also_shareholder: false,
          residential_same_as_aadhaar_address: false,
          details_of_existing_directorships: false,
          existing_directorships_details: [
            {
              company_name: '',
              cin: '',
              type_of_company: '',
              position_held: ''
            }
          ]
        }
      ]
    },
    validationSchema: Yup.object({
      directors: Yup.array().of(
        Yup.object({
          director_first_name: Yup.string().required('Director First Name is required'),
          last_name: Yup.string().required('Last Name is required'),
          category_of_directorship: Yup.string().required('Category Directorship is required'),
          pan_card_file: Yup.mixed().required('PAN is required'),
          aadhaar_card_file: Yup.mixed().required('Aadhaar is required'),
          passport_photo_file: Yup.mixed().required('Passport Photo is required'),
          mobile_number: Yup.string()
            .required('Mobile Number is required')
            .matches(/^[0-9]{10}$/, 'Mobile Number must be exactly 10 digits'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          occupation: Yup.string().required('Occupation is required'),
          area_of_occupation: Yup.string().required('Area of Occupation is required'),
          qualification: Yup.string().required('Educational Qualification is required'),
          gender: Yup.string().required('Gender is required'),
          nationality: Yup.string().required('Nationality is required'),
          father_first_name: Yup.string().required('Father First name is required'),
          father_last_name: Yup.string().required('Father Last name is required'),
          residential_address_proof: Yup.string().required('Residential Address Proof Type is required'),
          residential_address_proof_file: Yup.string().required('Resedential Address Proof is required'),
          form_dir2: Yup.string().required('Form Dir 2 is required'),
          specimen_signature_of_director: Yup.string().required('Specimen Signature od Director is required'),
          authorised_signatory_name: Yup.string().required('Authorised Signatory is required'),
          dsc: Yup.bool().oneOf([true, false], 'DSC is required').required('DSC is required'),
          din_number: Yup.bool().oneOf([true, false], 'DIN is required').required('DIN is required'),
          din_number_value: Yup.string().when('din_number', {
            is: true,
            then: (schema) => schema
              .required('DIN Number is required')
              .matches(/^[0-9]{8}$/, 'DIN Number must be exactly 8 digits'),
            otherwise: (schema) => schema.notRequired(),
          }),
          is_this_director_also_shareholder: Yup.bool().oneOf([true, false], 'Share Holder is required').required('Share Holder is required'),
          residential_same_as_aadhaar_address: Yup.bool().oneOf([true, false]).required('Residential Address Same as Aadhaar is required'),
          address_line_1: Yup.string().when('residential_same_as_aadhaar_address', {
            is: false,
            then: (schema) => schema.required('Address Line 1 is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          address_line_2: Yup.string().when('residential_same_as_aadhaar_address', {
            is: false,
            then: (schema) => schema.required('Address Line 2 is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          city: Yup.string().when('residential_same_as_aadhaar_address', {
            is: false,
            then: (schema) => schema.required('City is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          state: Yup.string().when('residential_same_as_aadhaar_address', {
            is: false,
            then: (schema) => schema.required('State is required'),
            otherwise: (schema) => schema.notRequired()
          }),
          pincode: Yup.string().when('residential_same_as_aadhaar_address', {
            is: false,
            then: (schema) => schema
              .required('Pincode is required')
              .matches(/^[0-9]{6}$/, 'Pincode must be exactly 6 digits'),
            otherwise: (schema) => schema.notRequired()
          }),
          details_of_existing_directorships: Yup.bool().oneOf([true, false]).required('Required'),
          existing_directorships_details: Yup.array().of(
            Yup.object({
              company_name: Yup.string().test('required-when-has-existing', 'Company Name is required', function (value) {
                const parentDirector = this.options.from[1]?.value;
                if (parentDirector?.details_of_existing_directorships === true) {
                  return !!value;
                }
                return true;
              }),
              cin: Yup.string().test('required-when-has-existing', 'CIN is required', function (value) {
                const parentDirector = this.options.from[1]?.value;
                if (parentDirector?.details_of_existing_directorships === true) {
                  return !!value;
                }
                return true;
              })
              .matches(/^[LU][0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/, 'CIN must be in format U12345MH2024PTC123456'),
              type_of_company: Yup.string().test('required-when-has-existing', 'Company Type is required', function (value) {
                const parentDirector = this.options.from[1]?.value;
                if (parentDirector?.details_of_existing_directorships === true) {
                  return !!value;
                }
                return true;
              }),
              position_held: Yup.string().test('required-when-has-existing', 'Position Held is required', function (value) {
                const parentDirector = this.options.from[1]?.value;
                if (parentDirector?.details_of_existing_directorships === true) {
                  return !!value;
                }
                return true;
              })
            })
          ),
          no_of_shares: Yup.string().when('is_this_director_also_shareholder', {
            is: true,
            then: (schema) => schema
              .required('No. of Shares is required')
              .matches(/^[0-9]+$/, 'No. of Shares must be a number'),
            otherwise: (schema) => schema.notRequired(),
          }),
          shareholding_percentage: Yup.string().when('is_this_director_also_shareholder', {
            is: true,
            then: (schema) => schema
              .required('Percentage of Holding is required')
              .matches(/^[0-9]+$/, 'Percentage of Holding must be a number'),
            otherwise: (schema) => schema.notRequired(),
          }),
          paid_up_capital: Yup.string().when('is_this_director_also_shareholder', {
            is: true,
            then: (schema) => schema
              .required('Paid Up Capital is required')
              .matches(/^[0-9]+$/, 'Paid Up Capital must be a number'),
            otherwise: (schema) => schema.notRequired(),
          }),
        })
      )
    }),
   
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      setLoading(true);
     
      try {
        const director = values.directors[tabIndex];
        const formData = new FormData();
        
        formData.append('service_request', service_id);
        formData.append('service_task', taskIds?.director?.task_id );
        formData.append('status', 'in progress');
        

        // Send residential address as empty object if 'Yes', otherwise send address fields
        formData.append(
          'residential_address',
          director.residential_same_as_aadhaar_address === true
            ? JSON.stringify({})
            : JSON.stringify({
                address_line_1: director.address_line_1 || '',
                address_line_2: director.address_line_2 || '',
                city: director.city || '',
                state: director.state || '',
                pincode: director.pincode || ''
              })
        );

        // Send existing_directorships_details as empty array if 'No', otherwise send the details
        formData.append(
          'existing_directorships_details',
          director.details_of_existing_directorships === true
            ? JSON.stringify(director.existing_directorships_details)
            : JSON.stringify([])
        );
        

        // Always append boolean fields, even if false
        ['dsc', 'din_number', 'is_this_director_also_shareholder', 'details_of_existing_directorships', 'residential_same_as_aadhaar_address'].forEach((key) => {
          if (key in director) {
            formData.append(key, director[key]);
          }
        });

        Object.entries(director).forEach(([key, value]) => {
          if ([
            'address_line_1',
            'address_line_2',
            'city',
            'state',
            'pincode',
            'residential_address',
            'existing_directorships_details',
          ].includes(key)) {
            // Already sent above
            return;
          }
          if (key.endsWith('_file') || key === 'form_dir2' || key === 'specimen_signature_of_director') {
            if (value instanceof File) {
              formData.append(key, value);
            }
          } else if (
            ['no_of_shares', 'shareholding_percentage', 'paid_up_capital'].includes(key) &&
            director.is_this_director_also_shareholder === false
          ) {
            formData.append(key, '');
          } else if (typeof value === 'string' || typeof value === 'number') {
            formData.append(key, value);
          } else if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else if (value && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          }
        });

        const url = director.id 
          ? `/companyincorporation/directors/${director.id}/`
          : '/companyincorporation/directors/';

        const { res } = await Factory(director.id ? 'put' : 'post', url, formData);
        
        if (res.status_cd === 0) {
          dispatch(openSnackbar({
            open: true,
            message: director.id ? 'Director updated successfully!' : 'Director saved successfully!',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          }));
          await fetchDirectors(); // This will update the form with the latest data
          // if (director.id) {
          //   try {
          //     const formData = new FormData();
          //     formData.append('service_request', service_id);
          //     formData.append('service_task', taskIds?.director?.task_id);
          //     formData.append('status', 'in progress');
          //     await Factory('post', '/companyincorporation/directors/', formData);
          //     console.log('Status submitted successfully.');
          //   } catch (err) {
          //     console.error('Status API error:', err);
          //   }
          // }
          fetchTaskId();
        } else {
          throw new Error(res.data?.message || 'Failed to save director');
        }
      } catch (error) {
        dispatch(openSnackbar({
          open: true,
          message: error.message || 'Failed to save director',
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


  const fetchDirectors = async () => {
    setLoading(true);
    try {
      const url = `/companyincorporation/directors/by-request/?service_request_id=${service_id}`;
      const { res } = await Factory('get', url);

      if (res.status_cd === 0) {
        if (res.data && res.data.directors && Array.isArray(res.data.directors) && res.data.directors.length > 0) {
          const transformedData = res.data.directors.map(director => ({
            id: director.id,
            director_first_name: director.director_first_name || '',
            middle_name: director.middle_name || '',
            last_name: director.last_name || '',
            category_of_directorship: director.category_of_directorship || '',
            pan_card_file: director.pan_card_file || null,
            aadhaar_card_file: director.aadhaar_card_file || null,
            passport_photo_file: director.passport_photo_file || null,
            mobile_number: director.mobile_number || '',
            email: director.email || '',
            occupation: director.occupation || '',
            area_of_occupation: director.area_of_occupation || '',
            qualification: director.qualification || '',
            gender: director.gender || '',
            nationality: director.nationality || '',
            father_first_name: director.father_first_name || '',
            father_middle_name: director.father_middle_name || '',
            father_last_name: director.father_last_name || '',
            residential_address_proof: director.residential_address_proof || '',
            residential_address_proof_file: director.residential_address_proof_file || null,
            form_dir2: director.form_dir2 || null,
            specimen_signature_of_director: director.specimen_signature_of_director || null,
            authorised_signatory_name: director.authorised_signatory_name || '',
            dsc: director.dsc === true ? true : false,
            din_number: director.din_number === true ? true : false,
            din_number_value: director.din_number_value || '',
            is_this_director_also_shareholder: director.is_this_director_also_shareholder === true ? true : false,
            residential_same_as_aadhaar_address: director.residential_same_as_aadhaar_address === true ? true : false,
            details_of_existing_directorships: director.details_of_existing_directorships === true ? true : false,
            existing_directorships_details: director.existing_directorships_details?.map(detail => ({
              id: detail.id,
              company_name: detail.company_name || '',
              cin: detail.cin || '',
              type_of_company: detail.type_of_company || '',
              position_held: detail.position_held || ''
            })) || [
              {
                company_name: '',
                cin: '',
                type_of_company: '',
                position_held: ''
              }
            ],
            no_of_shares: director.no_of_shares || '',
            shareholding_percentage: director.shareholding_percentage || '',
            paid_up_capital: director.paid_up_capital || '',
            address_line_1: director.residential_address?.address_line_1 || '',
            address_line_2: director.residential_address?.address_line_2 || '',
            city: director.residential_address?.city || '',
            state: director.residential_address?.state || '',
            pincode: director.residential_address?.pincode || '',
            task_id: taskIds?.director?.task_id || director.task_id || '',
          }));

          formik.setFieldValue('directors', transformedData);
          setDirectors(transformedData);
        } 
        else {
          const emptyDirector = {
            director_first_name: '',
            middle_name: '',
            last_name: '',
            category_of_directorship: '',
            pan_card_file: null,
            aadhaar_card_file: null,
            passport_photo_file: null,
            mobile_number: '',
            email: '',
            occupation: '',
            area_of_occupation: '',
            qualification: '',
            gender: '',
            nationality: '',
            father_first_name: '',
            father_middle_name: '',
            father_last_name: '',
            residential_address_proof: '',
            residential_address_proof_file: null,
            form_dir2: null,
            specimen_signature_of_director: null,
            authorised_signatory_name: '',
            dsc: false,
            din_number: false,
            is_this_director_also_shareholder: false,
            residential_same_as_aadhaar_address: false,
            details_of_existing_directorships: false,
            existing_directorships_details: [
              {
                company_name: '',
                cin: '',
                type_of_company: '',
                position_held: ''
              }
            ],
            no_of_shares: '',
            shareholding_percentage: '',
            paid_up_capital: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pincode: '',
            task_id: taskIds?.director?.task_id || '',
          };
          formik.setFieldValue('directors', [emptyDirector]);
          setDirectors([emptyDirector]);
        }
      // } else {
      //   dispatch(openSnackbar({
      //     open: true,
      //     // message: res.data?.message || 'Failed to fetch directors',
      //     variant: 'alert',
      //     alert: { color: 'error' },
      //     close: false
      //   }));
      }
    } catch (error) {
      dispatch(openSnackbar({
        open: true,
        message: error.message || 'Failed to fetch directors',
        variant: 'alert',
        alert: { color: 'error' },
        close: false
      }));
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (service_id) {
      fetchDirectors();
    }
  }, [service_id]);

  const addDirector = () => {
    if (values.directors.length < 20) {
      const updated = [
        ...values.directors,
        {
          director_first_name: '',
          middle_name: '',
          last_name: '',
          category_of_directorship: '',
          pan_card_file: null,
          aadhaar_card_file: null,
          passport_photo_file: null,
          mobile_number: '',
          email: '',
          occupation: '',
          area_of_occupation: '',
          qualification: '',
          gender: '',
          nationality: '',
          father_first_name: '',
          father_middle_name: '',
          father_last_name: '',
          residential_address_proof: '',
          residential_address_proof_file: '',
          form_dir2: null,
          specimen_signature_of_director: null,
          authorised_signatory_name: '',
          dsc: false,
          din_number: false,
          is_this_director_also_shareholder: false,
          residential_same_as_aadhaar_address: false,
          details_of_existing_directorships: false,
          existing_directorships_details: [
            {
              company_name: '',
              cin: '',
              type_of_company: '',
              position_held: ''
            }
          ]
        }
      ];
      setFieldValue('directors', updated);
      setTabIndex(updated.length - 1);
    }
  };

  const removeDirector = () => {
    if (values.directors.length > 1) {
      const updated = values.directors.slice(0, -1);
      setFieldValue('directors', updated);
      if (tabIndex >= updated.length) setTabIndex(updated.length - 1);
    }
  };
 

  const renderField = (field, idx, path = 'directors', parentIdx = null) => {
    let value, error, fieldName;
    if (path.startsWith('directors[') && path.includes('].existing_directorships_details')) {
      // Nested: directors[parentIdx].existing_directorships_details[idx]
      fieldName = `directors[${parentIdx}].existing_directorships_details[${idx}].${field.name}`;
      value = values.directors[parentIdx]?.existing_directorships_details?.[idx]?.[field.name] || '';
      error = getIn(touched, fieldName) && getIn(errors, fieldName);
    } else {
      // Top-level: directors[idx]
      fieldName = `${path}[${idx}].${field.name}`;
      value = values[path][idx]?.[field.name] || '';
      error = getIn(touched, fieldName) && getIn(errors, fieldName);
    }

    switch (field.type) {
      case 'text':
        // Custom input restrictions for specific fields
        let inputProps = {};
        if (field.name === 'mobile_number') inputProps = { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 10 };
        if (field.name === 'din_number') inputProps = { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 8 };
        if (field.name === 'din_number_value') inputProps = { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 8 };
        if (field.name === 'no_of_shares') inputProps = { inputMode: 'numeric', pattern: '[0-9]*' };
        if (field.name === 'paid_up_capital') inputProps = { inputMode: 'numeric', pattern: '[0-9]*' };
        if (field.name === 'shareholding_percentage') inputProps = { inputMode: 'decimal', pattern: '^[0-9]*\.?[0-9]*$' };
        if (field.name === 'pincode') inputProps = { inputMode: 'numeric', pattern: '[0-9]*', maxLength: 6 };
        if (field.name === 'cin') inputProps = { pattern: '[LUlu][0-9]{5}[A-Za-z]{2}[0-9]{4}[A-Za-z]{3}[0-9]{6}', maxLength: 21, style: { textTransform: 'uppercase' } };
        return (
          <Box>
            <Typography variant="subtitle1" mb={0.5}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              size="small"
              name={fieldName}
              value={value}
              onChange={e => {
                if (field.name === 'no_of_shares' || field.name === 'paid_up_capital') {
                  const newValue = e.target.value.replace(/[^0-9]/g, '');
                  setFieldValue(fieldName, newValue);
                } else if (field.name === 'shareholding_percentage') {
                  let newValue = e.target.value.replace(/[^0-9.]/g, '');
                  // Only allow one dot
                  const parts = newValue.split('.');
                  if (parts.length > 2) {
                    newValue = parts[0] + '.' + parts.slice(1).join('');
                  }
                  setFieldValue(fieldName, newValue);
                } else if (field.name === 'din_number') {
                  const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                  setFieldValue(fieldName, newValue);
                } else if (field.name === 'din_number_value') {
                  const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                  setFieldValue(fieldName, newValue);
                } else {
                  handleDirectorFieldChange(e, idx, field);
                }
              }}
              onBlur={handleBlur}
              error={Boolean(error)}
              helperText={error || ''}
              sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
              inputProps={inputProps}
            />
          </Box>
        );

      case 'autocomplete':
        return (
          <Box>
            <Typography variant="subtitle1" mb={0.5}>
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
              helperText={error || ''}
              sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
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
          if (field.name === 'form_dir2') {
            return (
              <Box>
                <Typography variant="subtitle1" mb={0.5}>
                  {field.label}
                </Typography>
                <Box display="flex" alignItems="center" gap={1} width={400}>
                  <Box  width={225}>
                  <RenderFileUpload
                    fieldName={fieldName}
                    file={value}
                    setFieldValue={setFieldValue}
                    touched={touched[path]?.[idx]?.[field.name]}
                    errors={error}
                    accept="*/*"
                     sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    color: 'grey.600'
                  }
                }}
                  />
                  </Box>
                  <Button
                    variant="outlined"
                    size="small"
      
                    sx={{ height: 31, width: 135 }}
                    href="/templates/DIR2-draft-format.docx"
                    download
                  >
                    Download Template
                  </Button>
                </Box>
              </Box>
            );
          }
          return (
            <Box>
              <Typography variant="subtitle1" mb={0.5}>
                {field.label}
              </Typography>
              <RenderFileUpload
                fieldName={fieldName}
                file={value}
                setFieldValue={setFieldValue}
                touched={touched[path]?.[idx]?.[field.name]}
                errors={error}
                accept="*/*"
                 sx={{
                  width: '100%',
                  '& .MuiInputBase-input': {
                    color: 'grey.600'
                  }
                }}
              />
            </Box>
          );
      // ... existing code ...
      // case 'file':
        if (field.name === 'form_dir2') {
          return (
            <Box>
              <Typography variant="subtitle1" mb={0.5}>
                {field.label}
              </Typography>
              <Box display="flex" alignItems="center" gap={1} width={400}>
                {/* Upload Button and View Button (if file uploaded) */}
                <Box display="flex" alignItems="center" gap={1}>
                  <Box height={34} width={180}>
                    <RenderFileUpload
                      fieldName={fieldName}
                      file={value}
                      setFieldValue={setFieldValue}
                      touched={touched[path]?.[idx]?.[field.name]}
                      errors={error}
                      accept="*/*"
                      sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                    />
                  </Box>
                  {/* If file is uploaded, show View button */}
                  {value && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ height: 34 }}
                      onClick={() => {
                        // If value is a File, create a URL, otherwise use value as URL
                        const url = value instanceof File ? URL.createObjectURL(value) : value;
                        window.open(url, '_blank');
                      }}
                    >
                      View1
                    </Button>
                  )}
                </Box>
                {/* Download Template Button */}
                <Button
                  variant="outlined"
                  size="small"
                  sx={{ height: 34, width: 180, minWidth: 120 }}
                  href="/templates/DIR2-draft-format.docx"
                  download
                >
                  Download Template
                </Button>
              </Box>
            </Box>
          );
        }
        return (
          <Box>
            <Typography variant="subtitle1" mb={0.5}>
              {field.label}
            </Typography>
            <RenderFileUpload
              fieldName={fieldName}
              file={value}
              setFieldValue={setFieldValue}
              touched={touched[path]?.[idx]?.[field.name]}
              errors={error}
              accept="*/*"
              sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
            />
          </Box>
        );
// ... existing code ...

      case 'shareholding':
        const shareRadioPath = `${path}[${idx}].${field.name}`;
        const sharePrefixPath = `${path}[${idx}]`;

        return (
          <Box key={field.name}>
            <FormControl component="fieldset">
              <FormLabel><Typography variant="subtitle1">{field.label}</Typography></FormLabel>
              <RadioGroup
                row
                name={shareRadioPath}
                value={values[path][idx]?.is_this_director_also_shareholder === true ? 'true' : 'false'}
                onChange={e => setFieldValue(shareRadioPath, e.target.value === 'true')}
              >
                <FormControlLabel value="true" control={<Radio />} label="Yes" />
                <FormControlLabel value="false" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>

            {values[path][idx]?.is_this_director_also_shareholder === true && (
              <Grid2 container spacing={13} mt={1} >
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ width: 150 }}>
                    <Typography variant="subtitle1" mb={1} >
                      No. of Shares
                    </Typography>
                    <TextField
                      size="small"
                      name={`${sharePrefixPath}.no_of_shares`}
                      value={values[path][idx]?.no_of_shares || ''}
                      onChange={e => {
                        const newValue = e.target.value.replace(/[^0-9]/g, '');
                        setFieldValue(`${sharePrefixPath}.no_of_shares`, newValue);
                      }}
                      onBlur={handleBlur}
                      error={Boolean(touched[path]?.[idx]?.no_of_shares && errors[path]?.[idx]?.no_of_shares)}
                      helperText={touched[path]?.[idx]?.no_of_shares && errors[path]?.[idx]?.no_of_shares}
                      // sx={{ width: 320, '& .MuiInputBase-input': { color: 'grey.600' } }}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box  sx={{ width: 150 }}>
                    <Typography variant="subtitle1" mb={1} >
                      Percentage of Holding
                    </Typography>
                    <TextField
                      size="small"
                      name={`${sharePrefixPath}.shareholding_percentage`}
                      value={values[path][idx]?.shareholding_percentage || ''}
                      onChange={e => {
                        let newValue = e.target.value.replace(/[^0-9.]/g, '');
                        // Only allow one dot
                        const parts = newValue.split('.');
                        if (parts.length > 2) {
                          newValue = parts[0] + '.' + parts.slice(1).join('');
                        }
                        setFieldValue(`${sharePrefixPath}.shareholding_percentage`, newValue);
                      }}
                      onBlur={handleBlur}
                      error={Boolean(touched[path]?.[idx]?.shareholding_percentage && errors[path]?.[idx]?.shareholding_percentage)}
                      helperText={touched[path]?.[idx]?.shareholding_percentage && errors[path]?.[idx]?.shareholding_percentage}
                      // sx={{ width: 320, '& .MuiInputBase-input': { color: 'grey.600' } }}
                      inputProps={{ inputMode: 'decimal', pattern: '^[0-9]*\.?[0-9]*$' }}
                    />
                  </Box>
                </Grid2>
                <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                  <Box sx={{ width: 150}}>
                    <Typography variant="subtitle1" mb={1} >
                      Paid Up Capital
                    </Typography>
                    <TextField
                      size="small"
                      name={`${sharePrefixPath}.paid_up_capital`}
                      value={values[path][idx]?.paid_up_capital || ''}
                      onChange={e => {
                        const newValue = e.target.value.replace(/[^0-9]/g, '');
                        setFieldValue(`${sharePrefixPath}.paid_up_capital`, newValue);
                      }}
                      onBlur={handleBlur}
                      error={Boolean(touched[path]?.[idx]?.paid_up_capital && errors[path]?.[idx]?.paid_up_capital)}
                      helperText={touched[path]?.[idx]?.paid_up_capital && errors[path]?.[idx]?.paid_up_capital}
                      // sx={{ width: 320, '& .MuiInputBase-input': { color: 'grey.600' } }}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    />
                  </Box>
                </Grid2>
              </Grid2>
            )}
          </Box>
        );

      case 'radio':
        return (
          <>
            <FormControl component="fieldset" error={Boolean(error)}>
              <FormLabel><Typography variant="subtitle1">{field.label}</Typography></FormLabel>
              <RadioGroup
                row
                name={fieldName}
                value={['dsc', 'din_number'].includes(field.name) ? (value === true ? 'true' : 'false') : value}
                onChange={['dsc', 'din_number'].includes(field.name)
                  ? (e) => setFieldValue(fieldName, e.target.value === 'true')
                  : handleChange}
              >
                {field.options.map((opt) => (
                  <FormControlLabel
                    key={opt}
                    value={['dsc', 'din_number'].includes(field.name) ? (opt === 'Yes' ? 'true' : 'false') : opt}
                    control={<Radio />}
                    label={opt}
                  />
                ))}
              </RadioGroup>
              {Boolean(error) && <FormHelperText>{error}</FormHelperText>}
            </FormControl>

            {/* Show extra field if DIN is Yes */}
            {field.name === 'din_number' && value === true && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  size="small"
                  label="DIN Number"
                  name={`${path}[${idx}].din_number_value`}
                  value={values[path][idx]?.din_number_value || ''}
                  onChange={e => {
                    const newValue = e.target.value.replace(/[^0-9]/g, '').slice(0, 8);
                    setFieldValue(`${path}[${idx}].din_number_value`, newValue);
                  }}
                  onBlur={handleBlur}
                  error={Boolean(touched[path]?.[idx]?.din_number_value && errors[path]?.[idx]?.din_number_value)}
                  helperText={touched[path]?.[idx]?.din_number_value && errors[path]?.[idx]?.din_number_value}
                  sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*', maxLength: 8 }}
                />
              </Box>
            )}
          </>
        );

      default:
        return null;
    }
  };

  const handleDirectorDelete = async (idx) => {
    const director = values.directors[idx];
    if (!director.id) {
      // Just remove from form state, no API call
      let updatedDirectors = values.directors.filter((_, i) => i !== idx);
      if (updatedDirectors.length === 0) {
        updatedDirectors = [
          {
            director_first_name: '',
            middle_name: '',
            last_name: '',
            category_of_directorship: '',
            pan_card_file: null,
            aadhaar_card_file: null,
            passport_photo_file: null,
            mobile_number: '',
            email: '',
            occupation: '',
            area_of_occupation: '',
            qualification: '',
            gender: '',
            nationality: '',
            father_first_name: '',
            father_middle_name: '',
            father_last_name: '',
            residential_address_proof: '',
            residential_address_proof_file: null,
            form_dir2: null,
            specimen_signature_of_director: null,
            authorised_signatory_name: '',
            dsc: false,
            din_number: false,
            is_this_director_also_shareholder: false,
            residential_same_as_aadhaar_address: false,
            // has_existing_directorships: 'No',
            details_of_existing_directorships: false,
            existing_directorships_details: [
              {
                company_name: '',
                cin: '',
                type_of_company: '',
                position_held: ''
              }
            ],
            no_of_shares: '',
            shareholding_percentage: '',
            paid_up_capital: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pincode: ''
          }
        ];
      }
      setFieldValue('directors', updatedDirectors);
      if (tabIndex >= updatedDirectors.length) setTabIndex(updatedDirectors.length - 1);
      return;
    }
    // Otherwise, make API call
    let url = `/companyincorporation/directors/${director.id}/`;
    const { res } = await Factory('delete', url);
    if (res.status_cd === 0) {
      let updatedDirectors = values.directors.filter((_, i) => i !== idx);
      if (updatedDirectors.length === 0) {
        updatedDirectors = [
          {
            director_first_name: '',
            middle_name: '',
            last_name: '',
            category_of_directorship: '',
            pan_card_file: null,
            aadhaar_card_file: null,
            passport_photo_file: null,
            mobile_number: '',
            email: '',
            occupation: '',
            area_of_occupation: '',
            qualification: '',
            gender: '',
            nationality: '',
            father_first_name: '',
            father_middle_name: '',
            father_last_name: '',
            residential_address_proof: '',
            residential_address_proof_file: null,
            form_dir2: null,
            specimen_signature_of_director: null,
            authorised_signatory_name: '',
            dsc: false,
            din_number: false,
            is_this_director_also_shareholder: false,
            residential_same_as_aadhaar_address: false,
            details_of_existing_directorships: false,
            existing_directorships_details: [
              {
                company_name: '',
                cin: '',
                type_of_company: '',
                position_held: ''
              }
            ],
            no_of_shares: '',
            shareholding_percentage: '',
            paid_up_capital: '',
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pincode: ''
          }
        ];
      }
      setFieldValue('directors', updatedDirectors);
      if (tabIndex >= updatedDirectors.length) setTabIndex(updatedDirectors.length - 1);
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

  const { values, errors, touched, handleChange, handleBlur, setFieldValue, resetForm } = formik;

  // --- Input restrictions for numeric fields and CIN ---
  const handleDirectorFieldChange = (e, idx, field) => {
    const { name, value } = e.target;
    let newValue = value;
    if (field.name === 'mobile_number') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 10);
    } else if (field.name === 'din_number') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    } else if (field.name === 'din_number_value') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 8);
    } else if ([
      'no_of_shares',
      'shareholding_percentage',
      'paid_up_capital'
    ].includes(field.name)) {
      newValue = value.replace(/[^0-9]/g, '');
    } else if (field.name === 'pincode') {
      newValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    } else if (field.name === 'cin') {
      newValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    }
    setFieldValue(name, newValue);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card sx={{ p: 3, mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          {/* Left side: Add No. of Directors */}
          <Box display="flex" alignItems="center">
            <Typography variant='subtitle1'>Add No. of Directors</Typography>
            <Button variant="outlined" size="small" sx={{ mx: 2, height: 36 }} onClick={removeDirector}>
              -
            </Button>
            <Typography>{values.directors.length}</Typography>
            <Button variant="outlined" size="small" sx={{ mx: 2, height: 36 }} onClick={addDirector}>
              +
            </Button>
          </Box>
          {/* Right side: Raise Request and Workflow Actions */}
          <Box display="flex" alignItems="center" gap={2}>
            <RaiseRequest
              fields={[
                'Director First Name',
                'Middle Name',
                'Last Name',
                'Category of Directorship',
                'PAN Card File',
                'Aadhaar Card File',
                'Passport Photo File',
                'Mobile Number',
                'Email',
                'Occupation',
                'Area of Occupation',
                'Qualification',
                'Gender',
                'Nationality',
                "Father's First Name",
                "Father's Middle Name",
                "Father's Last Name",
                'Residential Address Proof',
                'Residential Address Proof File',
                'Form DIR-2',
                'Specimen Signature of Director',
                'Authorised Signatory Name',
                'DSC',
                'DIN Number',
                'Is This Director Also Shareholder',
                'Residential Same As Aadhaar Address',
                'Details of Existing Directorships',
                'Existing Directorship - Company Name',
                'Existing Directorship - CIN',
                'Existing Directorship - Type of Company',
                'Existing Directorship - Position Held'
              ]}
              task_id={taskIds?.director?.task_id}
            />
            
          </Box>
        </Box>

        <Tabs value={tabIndex} onChange={(e, newVal) => setTabIndex(newVal)} variant="scrollable" scrollButtons="auto">
          {values.directors.filter(Boolean).map((_, idx) => (
            <Tab key={idx} label={`Directors ${idx + 1}`} />
          ))}
        </Tabs>

        {values.directors.filter(Boolean).map((_, idx) => (
          <TabPanel key={idx} value={tabIndex} index={idx}>
            {/* <Typography variant="subtitle1"mt={2}>
              Name Of the Director
            </Typography> */}
            <Grid2 container spacing={2}  >
              {directorFields.map((field) => (
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
                      checked={values.directors[idx].residential_same_as_aadhaar_address === true}
                      onChange={(e) => setFieldValue(`directors[${idx}].residential_same_as_aadhaar_address`, e.target.checked ? true : false)}
                    />
                  }
                  label="Same as in Aadhaar"
                />
              </Grid2>
              {/* Show address fields only when NOT same as Aadhaar */}
              {values.directors[idx].residential_same_as_aadhaar_address === false &&
                nestedAddressFields.map(({ key, label }) => {
                  const fieldName = `directors[${idx}].${key}`;
                  const error = getIn(touched, fieldName) && getIn(errors, fieldName);

                  return (
                    <Grid2 size={{ xs: 2, sm: 6, md: 4 }} key={key}>
                      <Box>
                        <Typography variant="subtitle1" mb={0.5}>
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
                          helperText={error || ''}
                          sx={{ width: '100%', '& .MuiInputBase-input': { color: 'grey.600' } }}
                        />
                      </Box>
                    </Grid2>
                  );
                })}
            </Grid2>

            <Box mt={4} mb={4}>
              <FormControl component="fieldset">
                <FormLabel>
                  <Typography variant="subtitle1">Details of Existing Directors</Typography>
                </FormLabel>
                <RadioGroup
                  row
                  name="details_of_existing_directorships"
                  value={values.directors[idx].details_of_existing_directorships === true ? 'true' : 'false'}
                  onChange={(e) => {
                    const val = e.target.value === 'true';
                    setFieldValue(`directors[${idx}].details_of_existing_directorships`, val);
                    if (val === false) {
                      setFieldValue(`directors[${idx}].existing_directorships_details`, [
                        {
                          company_name: '',
                          cin: '',
                          type_of_company: '',
                          position_held: ''
                        }
                      ]);
                    }
                  }}
                >
                  <FormControlLabel value="true" control={<Radio />} label="Yes" />
                  <FormControlLabel value="false" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>

              {values.directors[idx].details_of_existing_directorships === true && (
                <Box mt={2}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant='subtitle1'>No. of Directories</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mx: 2 }}
                      onClick={() => {
                        if (values.directors[idx].existing_directorships_details.length > 1) {
                          setFieldValue(`directors[${idx}].existing_directorships_details`, values.directors[idx].existing_directorships_details.slice(0, -1));
                        }
                      }}
                    >
                      -
                    </Button>
                    <Typography>{values.directors[idx].existing_directorships_details.length}</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ mx: 2 }}
                      onClick={() => {
                        const updated = [
                          ...values.directors[idx].existing_directorships_details,
                          {
                            company_name: '',
                            cin: '',
                            type_of_company: '',
                            position_held: ''
                          }
                        ];
                        setFieldValue(`directors[${idx}].existing_directorships_details`, updated);
                      }}
                    >
                      +
                    </Button>
                  </Box>

                  {Array.isArray(values.directors[idx].existing_directorships_details) &&
                    values.directors[idx].existing_directorships_details.map((_, edIdx) => (
                      <Card key={edIdx} sx={{ mb: 2, p: 2 }}>
                        <Typography fontWeight={600} mb={1}>
                          Director {edIdx + 1}
                        </Typography>
                        <Grid2 container spacing={1} alignItems="flex-end">
                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Box>{renderField(nestedDirectorFields[0], edIdx, `directors[${idx}].existing_directorships_details`, idx)}</Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Box>{renderField(nestedDirectorFields[1], edIdx, `directors[${idx}].existing_directorships_details`, idx)}</Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Box>{renderField(nestedDirectorFields[2], edIdx, `directors[${idx}].existing_directorships_details`, idx)}</Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 6, md: 2 }}>
                            <Box>{renderField(nestedDirectorFields[3], edIdx, `directors[${idx}].existing_directorships_details`, idx)}</Box>
                          </Grid2>
                          <Grid2 size={{ xs: 12, sm: 12, md: 2 }} display="flex" alignItems="center" justifyContent="flex-end" gap={1}>
                            <Button
                              variant="contained"
                              size="small"
                              sx={{ marginBottom: '0px' }}
                              onClick={async () => {
                                const allErrors = await formik.validateForm();
                                const entryErrors =
                                  allErrors.directors &&
                                  allErrors.directors[idx] &&
                                  allErrors.directors[idx].existing_directorships_details &&
                                  allErrors.directors[idx].existing_directorships_details[edIdx];
                                if (!entryErrors || Object.keys(entryErrors).length === 0) {
                                  dispatch(
                                    openSnackbar({
                                      open: true,
                                      message: `Director ${edIdx + 1} saved successfully!`,
                                      variant: 'alert',
                                      alert: { color: 'success' }
                                    })
                                  );
                                } else {
                                  formik.setTouched({
                                    ...formik.touched,
                                    directors: values.directors.map((dir, i) =>
                                      i === idx
                                        ? {
                                            ...formik.touched.directors?.[i],
                                            existing_directorships_details: dir.existing_directorships_details.map((ed, j) =>
                                              j === edIdx
                                                ? Object.fromEntries(Object.keys(ed).map((k) => [k, true]))
                                                : formik.touched.directors?.[i]?.existing_directorships_details?.[j] ||
                                                  Object.fromEntries(Object.keys(ed).map((k) => [k, false]))
                                            )
                                          }
                                        : formik.touched.directors?.[i] || {}
                                    )
                                  });
                                }
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              sx={{ marginBottom: '0px' }}
                              onClick={() => {
                                const updated = values.directors[idx].existing_directorships_details.filter((_, i) => i !== edIdx);
                                setFieldValue(`directors[${idx}].existing_directorships_details`, updated);
                              }}
                            >
                              Delete
                            </Button>
                          </Grid2>
                        </Grid2>
                      </Card>
                    ))}
                </Box>
              )}
            </Box>

            <Grid2>
              <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                <Button
                  variant="contained"
                  // sx={{ height: 36 }}
                  onClick={async () => {
                    const allErrors = await formik.validateForm();
                    const entryErrors = allErrors.directors && allErrors.directors[idx];
                    if (!entryErrors || Object.keys(entryErrors).length === 0) {
                      formik.handleSubmit();
                    } else {
                      formik.setTouched({
                        ...formik.touched,
                        directors: values.directors.map((dir, i) =>
                          i === idx
                            ? {
                                ...Object.fromEntries(Object.keys(dir).map((k) => [k, true])),
                                ...(dir.residential_same_as_aadhaar_address === false
                                  ? {
                                      address_line_1: true,
                                      address_line_2: true,
                                      city: true,
                                      state: true,
                                      pincode: true
                                    }
                                  : {})
                              }
                            : formik.touched.directors?.[i] || Object.fromEntries(Object.keys(dir).map((k) => [k, false]))
                        )
                      });
                    }
                  }}
                >
                   Save Director {idx + 1}
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  // sx={{ height: 36 }}
                  onClick={() => handleDirectorDelete(idx)}
                >
                  Delete Director {idx + 1}
                </Button>
              </Box>
            </Grid2>
            
          </TabPanel>
        ))}
        
      </Card>
        <Box display="flex" justifyContent="space-between" gap={1}mt={2}>
      {/* Left side: Back button */}
      {step > 0 && (
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setStep((prev) => prev - 1)}
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
      )}

      {/* Right side: GetActionButtons + Continue button */}
      <Box display="flex" gap={1}>
        <GetActionButtons
          type="post"
          urlEndpoint="/companyincorporation/directors/"
          recId={taskIds?.director?.data?.id}
          status={taskIds?.director?.data?.status}
          data={taskIds?.director?.data}
          service_request={service_id}
          task_id={taskIds?.director?.task_id}
          urlKey="companyincorporation"
          urlBool={true}
        />

        {step < 2 && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setStep((prev) => prev + 1)}
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

export default StepTwo;
