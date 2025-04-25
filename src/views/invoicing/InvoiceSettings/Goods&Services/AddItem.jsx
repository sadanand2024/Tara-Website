import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Button from '@mui/material/Button';
import Grid2 from '@mui/material/Grid2';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography, Stack } from '@mui/material';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import { IconX } from '@tabler/icons-react';
import IconButton from '@mui/material/IconButton';
import Factory from 'utils/Factory';
// import { useSnackbar } from '@/components/CustomSnackbar';
import Modal from 'ui-component/extended/Modal';
// import { ModalSize } from '@/enum';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
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
let taxPreferencesDropdown = ['Taxable', 'Non-Taxable', 'Out of Scope', 'Non-GST Supply'];
const gstRatesDropdown = ['0', '5', '12', '18', '28'];
const hsnCodes = [
  '1006', // Rice (other than basmati)
  '6203', // Men's or boys' trousers, bib and brace overalls, etc. (cotton)
  '8528', // LCD/LED Televisions
  '9401', // Chairs and other seating furniture (wooden)
  '8703' // Motor cars and other motor vehicles designed for the transport of persons (with engine capacity <= 1500 cc)
];

const AddItem = ({ type, setType, open, handleOpen, handleClose, selectedItem, businessDetailsData, get_Goods_and_Services_Data }) => {
  const dispatch = useDispatch();

  const [addItemData] = useState([
    { name: 'type', label: 'Type' },
    { name: 'name', label: 'Name' },
    { name: 'sku_value', label: 'SKU' },
    { name: 'units', label: 'Units' },
    { name: 'hsn_sac', label: 'HSN/SAC Code' },
    { name: 'gst_rate', label: 'GST Rate' },
    { name: 'tax_preference', label: 'Tax Preference' },
    { name: 'selling_price', label: 'Selling Rate' },
    { name: 'description', label: 'Description' }
  ]);
  // const { showSnackbar } = useSnackbar();

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
      // sku_value: Yup.number()
      //   .typeError('SKU Value must be an integer')
      //   .required('SKU Value is required')
      //   .integer('SKU Value must be an integer'),
      units: Yup.string().required('Units is Required'),
      hsn_sac: Yup.number()
        .typeError('HSN/SAC Code must be a number')
        .required('HSN/SAC Code is Required')
        .test('valid-length', 'HSN/SAC must be 4, 6, or 8 digits', (value) => value && [4, 6, 8].includes(value.toString().length)),

      gst_rate: Yup.string().required('GST Rate is Required'),
      tax_preference: Yup.string().required(' Tax Preference is Required'),
      selling_price: Yup.number()
        .typeError('Selling Rate must be an integer')
        .required('Selling Rate is required')
        .integer('Selling Rate must be an integer'),
      description: Yup.string().required('Description is Required')
    }),
    onSubmit: async (values) => {
      const postData = { ...values };
      postData.invoicing_profile = businessDetailsData.id;
      postData.sku_value = Number(postData.sku_value);
      postData.gst_rate = Number(postData.gst_rate);
      postData.selling_price = Number(postData.selling_price);
      let post_url = '/invoicing/api/v1/goods-services/create/';
      const put_url = `/invoicing/goods-services/${selectedItem?.id}/update/`;

      let url = type === 'edit' ? put_url : post_url;
      let method = type === 'edit' ? 'put' : 'post';

      const { res, error } = await Factory(method, url, postData);

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
        console.log(res);
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
      setValues((prevValues) => ({
        ...prevValues, // Retain other values in the form
        type: selectedItem.type || prevValues.type,
        name: selectedItem.name || '',
        sku_value: selectedItem.sku_value || '',
        units: selectedItem.units || '',
        hsn_sac: selectedItem.hsn_sac || '',
        gst_rate: selectedItem.gst_rate || '',
        tax_preference: selectedItem.tax_preference || '',
        selling_price: selectedItem.selling_price || '',
        description: selectedItem.description || ''
      }));
    }
  }, [type, selectedItem]);

  const renderOptions = values.type === 'Goods' ? unitsDropdown : ['NA'];

  return (
    <Modal
      open={open}
      // maxWidth={ModalSize.MD}
      header={{ title: type === 'edit' ? 'Update Item' : ' Add New Item', subheader: '' }}
      footer={
        <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
          <Button
            onClick={() => {
              setType('');
              resetForm();
              handleClose();
            }}
            variant="outlined"
            color="error"
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} type="submit" variant="contained" color="primary">
            {type === 'edit' ? 'Update' : 'Save'}
          </Button>
        </Stack>
      }
    >
      <Box component="form" onSubmit={handleSubmit} sx={{ padding: 2 }}>
        <Grid2 container spacing={2}>
          {addItemData.map((item) => (
            <Grid2 size={{ xs: 12, sm: 6 }} key={item.name}>
              {item.name === 'type' ? (
                <FormControl fullWidth>
                  <FormLabel>{item.label}</FormLabel>
                  <RadioGroup
                    name={item.name}
                    value={values.type}
                    onChange={(e) => {
                      setFieldValue('type', e.target.value);
                      if (e.target.value === 'Service') {
                        setFieldValue('units', 'NA');
                      }
                      if (e.target.value === 'Goods') {
                        setFieldValue('units', '');
                      }
                    }}
                    row
                  >
                    <FormControlLabel value="Service" control={<Radio />} label="Service" />
                    <FormControlLabel value="Goods" control={<Radio />} label="Goods" />
                  </RadioGroup>
                </FormControl>
              ) : item.name === 'units' || item.name === 'gst_rate' || item.name === 'tax_preference' ? (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label} {<span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <CustomAutocomplete
                    value={values[item.name]}
                    onChange={(_, newValue) => {
                      setFieldValue(item.name, newValue);
                    }}
                    options={
                      item.name === 'gst_rate'
                        ? gstRatesDropdown
                        : item.name === 'tax_preference'
                          ? taxPreferencesDropdown
                          : item.name === 'hsn_sac'
                            ? hsnCodes
                            : renderOptions
                    }
                    getOptionLabel={(option) => option} // Use option directly if it's a string
                    error={touched[item.name] && Boolean(errors[item.name])}
                    helperText={touched[item.name] && errors[item.name]}
                    name={item.name}
                  />
                </>
              ) : (
                <>
                  <Typography sx={{ mb: 1 }}>
                    {item.label} {item.name !== 'sku_value' && <span style={{ color: 'red' }}>*</span>}
                  </Typography>
                  <CustomInput
                    name={item.name}
                    placeholder={item.name === 'selling_price' ? '₹' : ''}
                    value={values[item.name]}
                    onChange={(e) => setFieldValue(item.name, e.target.value)}
                    onBlur={handleBlur}
                    error={touched[item.name] && Boolean(errors[item.name])}
                    helperText={touched[item.name] && errors[item.name]}
                  />
                </>
              )}
            </Grid2>
          ))}
        </Grid2>
      </Box>
    </Modal>
  );
};

export default AddItem;
