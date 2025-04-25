// 📁 File: AddItem.jsx

import React, { useState, useEffect } from 'react';
import { Button, Box, Grid, Typography, Stack, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Modal from 'ui-component/extended/Modal';
import Factory from 'utils/Factory';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import { CountriesList } from 'utils/CountriesList';

const unitsDropdown = [
  'Kilograms (Kgs)',
  'Grams (g)',
  'Liters (L)',
  'Milliliters (mL)',
  'Meters (m)',
  'Centimeters (cm)',
  'Millimeters (mm)',
  'Pieces (pcs)',
  'Dozens (doz)',
  'Pairs (prs)',
  'Sets (sets)',
  'Units (units)',
  'Boxes (boxes)',
  'Cartons (ctns)',
  'Barrels (bbls)',
  'Bottles (btls)',
  'Rolls (rolls)',
  'Sheets (Sheets)',
  'Cubic Meters (CBM)',
  'Square Meters (Sq.M)',
  'Square Feet (Sq.Ft)',
  'Tons (Tons)',
  'Quintal (Quintals)',
  'Hours (Hs)',
  'Days (Days)',
  'Packs (Packs)',
  'Bundles (Bundles)'
];

const taxPreferencesDropdown = ['Taxable', 'Non-Taxable', 'Out of Scope', 'Non-GST Supply'];
const gstRatesDropdown = ['0', '5', '12', '18', '28'];
const hsnCodes = ['1006', '6203', '8528', '9401', '8703'];

const AddItem = ({ type, setType, open, handleOpen, handleClose, selectedItem, businessDetailsData, get_Goods_and_Services_Data }) => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      type: 'Goods',
      name: '',
      sku_value: '',
      units: '',
      hsn_sac: '',
      gst_rate: '',
      tax_preference: '',
      selling_price: '',
      description: ''
    },
    validationSchema: Yup.object({
      type: Yup.string().required('Required'),
      name: Yup.string().required('Required'),
      units: Yup.string().required('Units is Required'),
      hsn_sac: Yup.number()
        .typeError('HSN/SAC Code must be a number')
        .required('HSN/SAC Code is Required')
        .test('valid-length', 'HSN/SAC must be 4, 6, or 8 digits', (val) => val && [4, 6, 8].includes(val.toString().length)),
      gst_rate: Yup.string().required('GST Rate is Required'),
      tax_preference: Yup.string().required('Tax Preference is Required'),
      selling_price: Yup.number().typeError('Selling Rate must be a number').required('Selling Rate is required').integer(),
      description: Yup.string().required('Description is Required')
    }),
    onSubmit: async (values) => {
      const postData = {
        ...values,
        invoicing_profile: businessDetailsData?.id,
        sku_value: Number(values.sku_value),
        gst_rate: Number(values.gst_rate),
        selling_price: Number(values.selling_price)
      };

      const url = type === 'edit' ? `/invoicing/goods-services/${selectedItem?.id}/update/` : '/invoicing/api/v1/goods-services/create/';
      const method = type === 'edit' ? 'put' : 'post';

      const { res } = await Factory(method, url, postData);

      if (res.status_cd === 0) {
        get_Goods_and_Services_Data();
        setType('');
        resetForm();
        handleClose();
        dispatch(
          openSnackbar({
            open: true,
            message: type === 'edit' ? 'Data Updated Successfully' : 'Data Added Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      } else {
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

  const { values, setValues, touched, errors, handleSubmit, setFieldValue, handleBlur, resetForm } = formik;

  useEffect(() => {
    if (type === 'edit' && selectedItem) {
      setValues({
        type: selectedItem.type || 'Goods',
        name: selectedItem.name || '',
        sku_value: selectedItem.sku_value || '',
        units: selectedItem.units || '',
        hsn_sac: selectedItem.hsn_sac || '',
        gst_rate: selectedItem.gst_rate || '',
        tax_preference: selectedItem.tax_preference || '',
        selling_price: selectedItem.selling_price || '',
        description: selectedItem.description || ''
      });
    }
  }, [type, selectedItem]);

  const fields = [
    { name: 'type', label: 'Type' },
    { name: 'name', label: 'Name' },
    { name: 'sku_value', label: 'SKU' },
    { name: 'units', label: 'Units' },
    { name: 'hsn_sac', label: 'HSN/SAC Code' },
    { name: 'gst_rate', label: 'GST Rate' },
    { name: 'tax_preference', label: 'Tax Preference' },
    { name: 'selling_price', label: 'Selling Rate' },
    { name: 'description', label: 'Description' }
  ];

  const renderOptions = values.type === 'Goods' ? unitsDropdown : ['NA'];

  return (
    <Modal
      open={open}
      handleClose={() => {
        setType('');
        resetForm();
        handleClose();
      }}
      header={{ title: type === 'edit' ? 'Update Item' : 'Add New Item' }}
      footer={
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              setType('');
              resetForm();
              handleClose();
            }}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            {type === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.name}>
              {field.name === 'type' ? (
                <FormControl fullWidth>
                  <FormLabel>{field.label}</FormLabel>
                  <RadioGroup
                    row
                    name={field.name}
                    value={values.type}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFieldValue('type', val);
                      setFieldValue('units', val === 'Service' ? 'NA' : '');
                    }}
                  >
                    <FormControlLabel value="Service" control={<Radio />} label="Service" />
                    <FormControlLabel value="Goods" control={<Radio />} label="Goods" />
                  </RadioGroup>
                </FormControl>
              ) : field.name === 'units' || field.name === 'gst_rate' || field.name === 'tax_preference' ? (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {field.label} <span style={{ color: 'red' }}>*</span>
                  </Typography>
                  <CustomAutocomplete
                    name={field.name}
                    value={values[field.name]}
                    onChange={(e, val) => setFieldValue(field.name, val)}
                    options={
                      field.name === 'gst_rate'
                        ? gstRatesDropdown
                        : field.name === 'tax_preference'
                          ? taxPreferencesDropdown
                          : renderOptions
                    }
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                  />
                </>
              ) : (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {field.label} {field.name !== 'sku_value' && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <CustomInput
                    name={field.name}
                    value={values[field.name]}
                    onChange={(e) => setFieldValue(field.name, e.target.value)}
                    onBlur={handleBlur}
                    placeholder={field.name === 'selling_price' ? '₹' : ''}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    helperText={touched[field.name] && errors[field.name]}
                  />
                </>
              )}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Modal>
  );
};

export default AddItem;
