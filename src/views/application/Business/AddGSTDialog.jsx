import React, { useState, useEffect } from 'react';
import { Button, Typography, Grid2, Box, FormControlLabel, Switch, RadioGroup, Radio, TextField, Autocomplete, Stack } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import Modal from 'ui-component/extended/Modal';

import { INDIAN_STATES } from 'utils/constants';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

const validationSchema = Yup.object().shape({
  gstin: Yup.string()
    .required('GST Number is required')
    .matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST Number format'),
  legal_name: Yup.string().required('Legal Name is required'),
  trade_name: Yup.string().required('Trade Name is required'),
  gst_username: Yup.string().required('Username in GST is required'),
  gst_password: Yup.string().required('Password is required'),
  address: Yup.string().required('Address is required'),
  state: Yup.string().required('State is required'),
  pincode: Yup.string()
    .required('Pincode is required')
    .matches(/^[1-9][0-9]{5}$/, 'Invalid pincode format'),
  branch_name: Yup.string(),
  authorized_signatory_pan: Yup.string().matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format'),
  is_composition_scheme: Yup.boolean().required('Composition Scheme is required'),
  composition_scheme_percent: Yup.string().when('is_composition_scheme', {
    is: (val) => val === true,
    then: () => Yup.string().required('Composition Scheme Percentage is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  is_export_sez: Yup.boolean().required('Export/SEZ is required'),
  lut_reg_no: Yup.string().when('is_export_sez', {
    is: true,
    then: (schema) =>
      schema
        .required('LUT Reg. No is required')
        .matches(/^LUT\d+$/, 'Must start with "LUT" followed by digits only')
        .max(18, 'LUT Reg. No cannot exceed 18 characters'),
    otherwise: (schema) => schema.notRequired()
  }),
  dob: Yup.string().when('is_export_sez', {
    is: (val) => val === true,
    then: () => Yup.string().required('Date of registration is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  financial_year: Yup.string().when('is_export_sez', {
    is: (val) => val === true,
    then: () => Yup.string().required('Financial Year is required'),
    otherwise: () => Yup.string().notRequired()
  }),
  lut_letter: Yup.string().when('is_export_sez', {
    is: (val) => val === true,
    then: () => Yup.string().required('LUT Letter is required'),
    otherwise: () => Yup.string().notRequired()
  })
});

const originalOptions = [
  '1% [Traders & Manufacturers GST Rate: 1% (0.5% CGST + 0.5% SGST)]',
  '2% [Restaurants (Not Serving Alcohol) GST Rate: 5% (2.5% CGST + 2.5% SGST)]',
  '3% [Service Providers (Including Mixed Supply of Goods + Services) GST Rate: 6% (3% CGST + 3% SGST)]'
];

const compositionPercOptions = originalOptions.map(
  (str) => str.replace(/%(\[)/, '  %      $1') // Adds two spaces after the first %
);

const getFinancialYearOptions = () => {
  const options = [];
  const startYear = 2018;
  const now = new Date();
  let fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
  for (let y = startYear; y <= fyStart; y++) {
    options.push(`${y}-${y + 1}`);
  }
  return options;
};

const financialYearOptions = getFinancialYearOptions();
const fields = [
  {
    name: 'gstin',
    label: 'GST Number',
    type: 'text'
  },
  {
    name: 'legal_name',
    label: 'Legal Name',
    type: 'text'
  },
  {
    name: 'trade_name',
    label: 'Trade Name',
    type: 'text'
  },
  {
    name: 'branch_name',
    label: 'Branch/Vertical',
    type: 'text'
  },
  {
    name: 'state',
    label: 'State',
    type: 'select',
    options: INDIAN_STATES
  },
  {
    name: 'address',
    label: 'Address',
    type: 'text'
  },
  {
    name: 'pincode',
    label: 'Pincode',
    type: 'text'
  },
  {
    name: 'authorized_signatory_pan',
    label: 'Authorized Signatory PAN',
    type: 'text'
  },
  {
    name: 'gst_username',
    label: 'Username in GST',
    type: 'text'
  },
  {
    name: 'gst_password',
    label: 'Password in GST',
    type: 'text'
  },
  {
    name: 'gst_document',
    label: 'GST Document',
    type: 'file'
  }
];
const fields_lut = [
  {
    name: 'lut_reg_no',
    label: 'LUT Reg. No (ex: LUT123456789012345)',
    type: 'text'
  },
  {
    name: 'dob',
    label: 'Date of registration',
    type: 'date'
  },
  {
    name: 'financial_year',
    label: 'Financial Year',
    type: 'select',
    options: financialYearOptions
  },
  {
    name: 'lut_letter',
    label: 'LUT Letter',
    type: 'file'
  }
];
const AddGSTDialog = ({ open, selectedGST, handleClose, fetchGSTList }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.accountReducer.user);

  const renderFields = (fields) => {
    return fields.map((field) => (
      <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={field.name}>
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          {field.label}
        </Typography>
        {field.type === 'text' ? (
          <TextField
            fullWidth
            size="small"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e) => {
              const { value } = e.target;
              if (field.name === 'authorized_signatory_pan') {
                const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
                if (value.length > 10) return;
                setFieldValue(field.name, value.toUpperCase());
              } else if (field.name === 'pincode') {
                const numericValue = value.replace(/[^0-9]/g, '');
                if (numericValue.length <= 6) {
                  setFieldValue(field.name, numericValue);
                }
              } else if (field.name === 'gstin') {
                if (value.length > 15) return;
                setFieldValue(field.name, value.toUpperCase());
              } else {
                setFieldValue(field.name, e.target.value);
              }
            }}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            InputLabelProps={{ shrink: true }}
          />
        ) : field.type === 'file' ? (
          <RenderFileUpload
            label={field.label}
            fieldName={field.name}
            file={values[field.name]}
            setFieldValue={setFieldValue}
            touched={touched[field.name]}
            errors={errors[field.name]}
          />
        ) : field.type === 'select' ? (
          <Autocomplete
            fullWidth
            size="small"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e, value) => setFieldValue(field.name, value)}
            options={field.options}
            renderInput={(params) => (
              <TextField
                {...params}
                error={touched[field.name] && Boolean(errors[field.name])}
                helperText={touched[field.name] && errors[field.name]}
              />
            )}
          />
        ) : field.type === 'date' ? (
          <TextField
            fullWidth
            size="small"
            id={field.name}
            name={field.name}
            value={values[field.name] || ''}
            onChange={(e) => setFieldValue(field.name, e.target.value)}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            type="date"
            InputLabelProps={{ shrink: true }}
          />
        ) : null}
      </Grid2>
    ));
  };
  const formik = useFormik({
    initialValues: {
      gstin: '',
      legal_name: '',
      trade_name: '',
      branch_name: '',
      gst_username: '',
      gst_password: '',
      authorized_signatory_pan: '',
      gst_document: null,
      address: '',
      state: '',
      pincode: '',
      is_composition_scheme: false,
      composition_scheme_percent: '',
      is_export_sez: false,
      lut_reg_no: '',
      dob: '',
      financial_year: '',
      lut_letter: null
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      const formData = new FormData();
      //   Object.keys(values).forEach((key) => {
      //     if (key === 'gst_document' && values[key] instanceof File) {
      //       formData.append(key, values[key]);
      //     } else {
      //       formData.append(key, values[key]);
      //     }
      //   });
      formData.append('gstin', values.gstin);
      formData.append('legal_name', values.legal_name);
      formData.append('trade_name', values.trade_name);
      formData.append('branch_name', values.branch_name);
      formData.append('gst_username', values.gst_username);
      formData.append('gst_password', values.gst_password);
      formData.append('authorized_signatory_pan', values.authorized_signatory_pan);
      formData.append('address', values.address);
      formData.append('state', values.state);
      formData.append('pincode', values.pincode);
      formData.append('is_composition_scheme', values.is_composition_scheme);
      formData.append('composition_scheme_percent', values.composition_scheme_percent);
      formData.append('is_export_sez', values.is_export_sez);
      formData.append('lut_reg_no', values.lut_reg_no);
      formData.append('dob', values.dob ? values.dob : '');
      formData.append('financial_year', values.financial_year);
      if (values.lut_letter && typeof values.lut_letter !== 'string') {
        formData.append('lut_letter', values.lut_letter);
      }
      if (values.gst_document && typeof values.gst_document !== 'string') {
        formData.append('gst_document', values.gst_document);
      }
      formData.append('business', user.active_context.business_id);
      let url = '/user_management/gst-details/';
      let type = 'post';
      if (selectedGST) {
        url = `/user_management/gst-details/${selectedGST.id}/`;
        type = 'put';
      }
      const { res } = await Factory(type, url, formData, {}, true);
      if (res.status_cd === 0) {
        await fetchGSTList();
        handleClose();
        dispatch(
          openSnackbar({
            open: true,
            message: selectedGST !== null ? 'GST details updated successfully' : 'GST details added successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: JSON.stringify(res.data.data) || 'Failed to save GST details',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
      setIsLoading(false);
    }
  });
  const { values, setValues, touched, errors, handleSubmit, setFieldValue, handleBlur, resetForm } = formik;
  useEffect(() => {
    if (selectedGST) {
      setValues(selectedGST);
    }
  }, [selectedGST]);
  console.log(errors);
  return (
    <Modal
      open={open}
      title={selectedGST !== null ? 'Edit GST Details' : 'Add GST Details'}
      handleClose={() => {
        resetForm();
        handleClose();
      }}
      showClose={false}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        {/* GST Details Group */}
        <Box mb={2}>
          <Grid2 container spacing={2}>
            {renderFields(fields)}
          </Grid2>
        </Box>

        {/* Schemes & Exports Group */}
        <Box mb={2}>
          {/* <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
          Schemes & Exports
        </Typography> */}
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.is_composition_scheme === true}
                    onChange={(e) => {
                      if (e.target.checked === false) {
                        setFieldValue('composition_scheme_percent', '');
                      }
                      setFieldValue('is_composition_scheme', e.target.checked ? true : false);
                    }}
                    name="is_composition_scheme"
                  />
                }
                label="Are you Reg. under Composition Scheme?"
                labelPlacement="start" // This puts the label on the left, switch on the right
                sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
              />
            </Grid2>

            <Grid2 size={{ xs: 12 }}>
              {values.is_composition_scheme === true && (
                <Grid2 size={{ xs: 12 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Composition Scheme %
                  </Typography>
                  <RadioGroup
                    row
                    name="composition_scheme_percent"
                    value={values.composition_scheme_percent}
                    onChange={(e) => {
                      setFieldValue('composition_scheme_percent', e.target.value);
                    }}
                  >
                    {compositionPercOptions.map((perc) => (
                      <FormControlLabel key={perc} value={perc} control={<Radio size="small" />} label={perc} />
                    ))}
                  </RadioGroup>
                </Grid2>
              )}
            </Grid2>
            <Grid2 size={{ xs: 12 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={values.is_export_sez === true}
                    onChange={(e) => {
                      if (e.target.checked === false) {
                        setFieldValue('lut_reg_no', '');
                        setFieldValue('dob', '');
                        setFieldValue('financial_year', '');
                      }
                      setFieldValue('is_export_sez', e.target.checked ? true : false);
                    }}
                    name="is_export_sez"
                  />
                }
                label="Is your business involved in export/supply to sez/deemed exports?"
                labelPlacement="start" // This puts the label on the left, switch on the right
                sx={{ width: '100%', justifyContent: 'space-between', m: 0 }}
              />
            </Grid2>
          </Grid2>
        </Box>

        {/* LUT Details Group */}
        {values.is_export_sez === true && (
          <Box mb={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom color="text.primary">
              LUT Details
            </Typography>

            <Grid2 container spacing={2}>
              {renderFields(fields_lut)}
            </Grid2>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddGSTDialog;
