import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid2,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Autocomplete } from '@mui/material';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';

const BusinessPremisesSection = ({ initialValues }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      hasAdditionalPlace: initialValues?.hasAdditionalPlace || 'no',
      additionalWorkplace: initialValues?.additionalWorkplace || '',
      additionalAddressLine1: initialValues?.additionalAddressLine1 || '',
      additionalAddressLine2: initialValues?.additionalAddressLine2 || '',
      additionalCity: initialValues?.additionalCity || '',
      additionalDistrict: initialValues?.additionalDistrict || '',
      additionalState: initialValues?.additionalState || '',
      additionalPincode: initialValues?.additionalPincode || '',
      additionalNatureOfPossession: initialValues?.additionalNatureOfPossession || '',
      additionalAddressProof: initialValues?.additionalAddressProof || null,
      additionalRentalAgreement: initialValues?.additionalRentalAgreement || null,
      additionalBankStatement: initialValues?.additionalBankStatement || null,
      additionalNameBoardPhoto: initialValues?.additionalNameBoardPhoto || null
    },
    validationSchema: Yup.object({
      hasAdditionalPlace: Yup.string().required('Additional place of business is required'),
      additionalWorkplace: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional workplace is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalAddressLine1: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional address line 1 is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalAddressLine2: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional address line 2 is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalCity: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional city is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalDistrict: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional district is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalState: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional state is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalPincode: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional pincode is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalNatureOfPossession: Yup.string().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional nature of possession is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalAddressProof: Yup.mixed().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional address proof is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalRentalAgreement: Yup.mixed().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional rental agreement is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalBankStatement: Yup.mixed().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional bank statement is required'),
        otherwise: (schema) => schema.notRequired()
      }),
      additionalNameBoardPhoto: Yup.mixed().when('hasAdditionalPlace', {
        is: 'yes',
        then: (schema) => schema.required('Additional name board photo is required'),
        otherwise: (schema) => schema.notRequired()
      })
    }),
    onSubmit: async (values) => {
      // Handle form submission
      console.log(values);
    }
  });

  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;

  const handleFileChange = (fieldName, event) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue(fieldName, file);
    }
  };

  return (
    <Box mt={4}>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} sm={6} md={5}>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography>Additional place of business?</Typography>
            <FormGroup row>
              <FormControlLabel
                label="Yes"
                control={
                  <Radio checked={values.hasAdditionalPlace === 'yes'} onChange={() => setFieldValue('hasAdditionalPlace', 'yes')} />
                }
              />
              <FormControlLabel
                label="No"
                control={<Radio checked={values.hasAdditionalPlace === 'no'} onChange={() => setFieldValue('hasAdditionalPlace', 'no')} />}
              />
            </FormGroup>
          </Box>
        </Grid2>
        <Grid2 xs={12} sm={6} md={6}>
          {values.hasAdditionalPlace === 'yes' && (
            <Autocomplete
              size="small"
              fullWidth
              options={['Office', 'Godown', 'Warehouse']}
              value={values.additionalWorkplace || ''}
              onChange={(e, value) => setFieldValue('additionalWorkplace', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Workplace"
                  size="small"
                  error={touched.additionalWorkplace && Boolean(errors.additionalWorkplace)}
                  helperText={touched.additionalWorkplace && errors.additionalWorkplace}
                />
              )}
              sx={{ minWidth: 180, ml: 2 }}
            />
          )}
        </Grid2>
      </Grid2>

      {values.hasAdditionalPlace === 'yes' && (
        <Grid2 container spacing={2} alignItems="center" mt={2}>
          <Grid2 xs={12}>
            <Typography variant="subtitle1" fontWeight={700} mb={0}>
              <span style={{ textDecoration: 'underline' }}>Additional Place of Business</span>
            </Typography>
          </Grid2>
          <Grid2 xs={12}>
            <Typography variant="subtitle1" color="text.secondary" fontWeight={700}>
              Principal place of business
            </Typography>
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Address Line 1"
              name="additionalAddressLine1"
              value={values.additionalAddressLine1 || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.additionalAddressLine1 && Boolean(errors.additionalAddressLine1)}
              helperText={touched.additionalAddressLine1 && errors.additionalAddressLine1}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Address Line 2"
              name="additionalAddressLine2"
              value={values.additionalAddressLine2 || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.additionalAddressLine2 && Boolean(errors.additionalAddressLine2)}
              helperText={touched.additionalAddressLine2 && errors.additionalAddressLine2}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="City"
              name="additionalCity"
              value={values.additionalCity || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.additionalCity && Boolean(errors.additionalCity)}
              helperText={touched.additionalCity && errors.additionalCity}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="District"
              name="additionalDistrict"
              value={values.additionalDistrict || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.additionalDistrict && Boolean(errors.additionalDistrict)}
              helperText={touched.additionalDistrict && errors.additionalDistrict}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="State"
              name="additionalState"
              value={values.additionalState || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.additionalState && Boolean(errors.additionalState)}
              helperText={touched.additionalState && errors.additionalState}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Pincode"
              name="additionalPincode"
              value={values.additionalPincode || ''}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.additionalPincode && Boolean(errors.additionalPincode)}
              helperText={touched.additionalPincode && errors.additionalPincode}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={3}>
            <Autocomplete
              size="small"
              fullWidth
              options={['Self-owned', 'Leased', 'Rented']}
              value={values.additionalNatureOfPossession || ''}
              onChange={(e, value) => setFieldValue('additionalNatureOfPossession', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nature of possession"
                  size="small"
                  error={touched.additionalNatureOfPossession && Boolean(errors.additionalNatureOfPossession)}
                  helperText={touched.additionalNatureOfPossession && errors.additionalNatureOfPossession}
                />
              )}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Address proof"
              name="additionalAddressProof"
              value={values.additionalAddressProof ? values.additionalAddressProof.name : ''}
              placeholder="Upload Address Proof"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('additionalAddressProofInput').click()}
              error={touched.additionalAddressProof && Boolean(errors.additionalAddressProof)}
              helperText={touched.additionalAddressProof && errors.additionalAddressProof}
            />
            <input
              id="additionalAddressProofInput"
              type="file"
              hidden
              name="additionalAddressProof"
              onChange={(e) => handleFileChange('additionalAddressProof', e)}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Rental Agreement/NOC"
              name="additionalRentalAgreement"
              value={values.additionalRentalAgreement ? values.additionalRentalAgreement.name : ''}
              placeholder="Upload Rental Agreement/NOC"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('additionalRentalAgreementInput').click()}
              error={touched.additionalRentalAgreement && Boolean(errors.additionalRentalAgreement)}
              helperText={touched.additionalRentalAgreement && errors.additionalRentalAgreement}
            />
            <input
              id="additionalRentalAgreementInput"
              type="file"
              hidden
              name="additionalRentalAgreement"
              onChange={(e) => handleFileChange('additionalRentalAgreement', e)}
            />
          </Grid2>
          <Grid2 xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              size="small"
              label="Bank Statement/Cancelled Cheque"
              name="additionalBankStatement"
              value={values.additionalBankStatement ? values.additionalBankStatement.name : ''}
              placeholder="Upload Bank Statement/Cancelled Cheque"
              InputProps={{ readOnly: true }}
              onClick={() => document.getElementById('additionalBankStatementInput').click()}
              error={touched.additionalBankStatement && Boolean(errors.additionalBankStatement)}
              helperText={touched.additionalBankStatement && errors.additionalBankStatement}
            />
            <input
              id="additionalBankStatementInput"
              type="file"
              hidden
              name="additionalBankStatement"
              onChange={(e) => handleFileChange('additionalBankStatement', e)}
            />
          </Grid2>
        </Grid2>
      )}
    </Box>
  );
};

export default BusinessPremisesSection;
