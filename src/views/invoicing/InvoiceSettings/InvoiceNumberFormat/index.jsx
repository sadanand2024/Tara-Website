import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, Typography, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router';
import Factory from 'utils/Factory';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';

const InvoiceNumberFormat = ({ businessDetails, handleBack }) => {
  const [postType, setPostType] = useState('post');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      gstin: '',
      startingNumber: '',
      prefix: '',
      suffix: '',
      format_version: ''
    },
    validationSchema: Yup.object({
      gstin: Yup.string().required('GSTIN is required'),
      startingNumber: Yup.number().typeError('Must be a number').required('Starting Number is required'),
      prefix: Yup.string().required('Prefix is required'),
      suffix: Yup.string().required('Suffix is required')
    }),
    onSubmit: async (values) => {
      const url = postType === 'post' ? '/invoicing/invoice-formats/' : `/invoicing/invoice-formats/${selectedRecord.id}/`;

      const postData = {
        invoicing_profile: businessDetails.id,
        gstin: values.gstin,
        invoice_format: {
          startingNumber: values.startingNumber,
          prefix: values.prefix,
          suffix: values.suffix,
          format_version: postType === 'put' ? Number(selectedRecord.invoice_format.format_version) + 1 : 1
        }
      };

      try {
        const { res } = await Factory(postType, url, postData);
        if (res.status_cd === 0) {
          // Handle success UI or routing if needed
        } else {
          // Handle error response
        }
      } catch (error) {
        // Handle exception
      }
    }
  });

  useEffect(() => {
    if (businessDetails?.invoice_format) {
      setSelectedRecord(businessDetails);
      formik.setValues({
        gstin: '',
        startingNumber: businessDetails.invoice_format.startingNumber || '',
        prefix: businessDetails.invoice_format.prefix || '',
        suffix: businessDetails.invoice_format.suffix || '',
        format_version: businessDetails.invoice_format.format_version || ''
      });
    }
  }, [businessDetails]);

  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography sx={{ mb: 1 }}>
            <span style={{ color: 'red' }}>*</span> Select GSTIN Number:
          </Typography>
          <CustomAutocomplete
            value={formik.values.gstin}
            onChange={(e, newValue) => {
              formik.setFieldValue('gstin', newValue);
              const selected = businessDetails.invoice_format.find((item) => item.gstin === newValue);
              if (selected) {
                formik.setValues({
                  gstin: newValue,
                  startingNumber: selected.invoice_format.startingNumber,
                  prefix: selected.invoice_format.prefix,
                  suffix: selected.invoice_format.suffix,
                  format_version: selected.invoice_format.format_version
                });
                setSelectedRecord(selected);
                setPostType('put');
              } else {
                formik.setValues((prev) => ({
                  ...prev,
                  gstin: newValue,
                  startingNumber: '',
                  prefix: '',
                  suffix: '',
                  format_version: ''
                }));
                setPostType('post');
              }
            }}
            options={businessDetails?.gst_details?.length > 0 ? businessDetails.gst_details.map((item) => item.gstin) : ['NA']}
            error={formik.touched.gstin && Boolean(formik.errors.gstin)}
            helperText={formik.touched.gstin && formik.errors.gstin}
          />
        </Grid>

        {['startingNumber', 'prefix', 'suffix'].map((field) => (
          <Grid item xs={12} sm={6} key={field}>
            <Typography sx={{ mb: 1 }}>
              <span style={{ color: 'red' }}>*</span> {field.replace(/([A-Z])/g, ' $1').trim()}:
            </Typography>
            <CustomInput
              name={field}
              value={formik.values[field]}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched[field] && Boolean(formik.errors[field])}
              helperText={formik.touched[field] && formik.errors[field]}
            />
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            navigate('/app/invoice');
          }}
        >
          Back To Dashboard
        </Button>
        <Button variant="contained" onClick={formik.handleSubmit}>
          Save
        </Button>
      </Stack>
    </Box>
  );
};

export default InvoiceNumberFormat;
