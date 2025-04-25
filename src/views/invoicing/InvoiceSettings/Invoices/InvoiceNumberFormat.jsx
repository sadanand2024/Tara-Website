import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, Button, Box, Typography, Grid2 } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import CustomInput from 'utils/CustomInput';
import Factory from 'utils/Factory';
// import { useSnackbar } from '@/components/CustomSnackbar';
// import { useRouter } from 'next/navigation';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InvoiceNumberFormat = ({ businessDetailsData, handleBack }) => {
  // const { showSnackbar } = useSnackbar();
  // const router = useRouter();

  const [postType, setPostType] = useState('post');
  const [selectedRecord, setSelectedRecord] = useState(null);

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
      startingNumber: Yup.number().typeError('Starting Number must be a number').required('Starting Number is required'),
      prefix: Yup.string().required('Prefix is required'),
      suffix: Yup.string().required('Suffix is required')
    }),

    onSubmit: async (values) => {
      const url = postType === 'post' ? '/invoicing/invoice-formats/' : `/invoicing/invoice-formats/${selectedRecord.id}/`;

      const postData = {
        invoicing_profile: businessDetailsData.id,
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
          // showSnackbar('Data Updated Successfully', 'success');
          // router.push('/invoicing');
        } else {
          // showSnackbar(JSON.stringify(res.data.error), 'error');
        }
      } catch (error) {
        // showSnackbar('Error while updating data', 'error');
      }
    }
  });

  useEffect(() => {
    if (businessDetailsData?.invoice_format) {
      setSelectedRecord(businessDetailsData);
      formik.setValues({
        gstin: '',
        startingNumber: businessDetailsData.invoice_format.startingNumber || '',
        prefix: businessDetailsData.invoice_format.prefix || '',
        suffix: businessDetailsData.invoice_format.suffix || '',
        format_version: Number(businessDetailsData.invoice_format.format_version) || ''
      });
    }
  }, [businessDetailsData]);
  return (
    <Box>
      <Grid2 container spacing={2}>
        <Grid2 size={{ sx: 12, sm: 6 }}>
          <Typography sx={{ mb: 1 }}>
            <span style={{ color: 'red' }}>*</span> Select GSTIN Number:
          </Typography>
          <CustomAutocomplete
            value={formik.values.gstin}
            onChange={(e, newValue) => {
              formik.setFieldValue('gstin', newValue);
              const selected = businessDetailsData.invoice_format.find((item) => item.gstin === newValue);
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
                // formik.resetForm();
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
            options={businessDetailsData?.gst_details.length > 0 ? businessDetailsData?.gst_details?.map((item) => item.gstin) : ['NA']}
            error={formik.touched.gstin && Boolean(formik.errors.gstin)}
            helperText={formik.touched.gstin && formik.errors.gstin}
          />
        </Grid2>

        {['startingNumber', 'prefix', 'suffix'].map((field) => (
          <Grid2 size={{ sx: 12, sm: 6 }} key={field}>
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
          </Grid2>
        ))}
      </Grid2>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            // router.back();
          }}
        >
          Back to Dashboard
        </Button>

        <Box>
          <Button variant="contained" onClick={handleBack} sx={{ mr: 2 }}>
            Back
          </Button>
          <Button onClick={formik.handleSubmit} color="primary" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvoiceNumberFormat;
