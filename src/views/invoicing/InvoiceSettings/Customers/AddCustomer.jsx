import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Button,
  Grid2,
  Stack,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton
} from '@mui/material';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import Modal from 'ui-component/extended/Modal';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import Factory from 'utils/Factory';
import { indian_States_And_UTs } from 'utils/indian_States_And_UT';
import { CountriesList } from 'utils/CountriesList';
import { businessTypesArray } from 'utils/businessTypesArray';
import { entity_choices } from 'utils/Entity-types';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const gstTypes = [
  'Registered Business - Regular',
  'Registered Business - Composition',
  'Unregistered Business',
  'Consumer',
  'Overseas',
  'Special Economic Zones',
  'Deemed Export',
  'Tax Deductor',
  'SEZ Developer'
];

const AddCustomer = ({ type, setType, open, handleClose, selectedCustomer, businessDetailsData, getCustomersData }) => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: '',
      pan_number: '',
      entity_type: '',
      gst_registered: false,
      gst_type: '',
      gstin: 'NA',
      address_line1: '',
      address_line2: '',
      country: 'India',
      state: '',
      postal_code: '',
      email: '',
      mobile_number: '',
      opening_balance: 0,
      has_multiple_branches: false,
      branches: []
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Customer Name is required'),
      pan_number: Yup.string()
        .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format')
        .required('PAN is required'),
      entity_type: Yup.string().required('Entity Type is required'),

      gst_type: Yup.string().when('gst_registered', {
        is: true,
        then: () => Yup.string().required('GST Type is required'),
        otherwise: () => Yup.string().oneOf(['NA'], 'GST Type must be "NA" when GST Registered is "No"')
      }),
      gstin: Yup.string().when('gst_registered', {
        is: true,
        then: () =>
          Yup.string()
            .matches(/^[0-9A-Z]{15}$/, 'Invalid GSTIN, Format must be: 22AAAAA0000A1Z5')
            .required('GSTIN is required'),
        otherwise: () => Yup.string().oneOf(['NA'], 'GSTIN must be "NA" when GST Registered is "No"')
      }),
      gst_registered: Yup.boolean().required('GST Registered is required'),
      address_line1: Yup.string().required('Address Line 1 is required'),
      address_line2: Yup.string().required('Address Line 2 is required'),
      country: Yup.string().required('Country is required'),
      state: Yup.string().required('State is required'),
      postal_code: Yup.number().typeError('Pincode must be a number').required('Pincode is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      mobile_number: Yup.string().required('Mobile number is required'),
      opening_balance: Yup.number().typeError('Opening Balance must be a number').required('Opening Balance is required'),
      has_multiple_branches: Yup.boolean().required('Please select if you have multiple branches'),
      branches: Yup.array().when('has_multiple_branches', {
        is: true,
        then: () =>
          Yup.array()
            .min(1, 'At least one branch is required')
            .of(
              Yup.object().shape({
                branch_name: Yup.string().required('Branch Name is required'),
                gstin: Yup.string()
                  .matches(/^[0-9A-Z]{15}$/, 'Invalid GSTIN, Format must be: 22AAAAA0000A1Z5')
                  .required('GSTIN is required'),
                gst_type: Yup.string().required('GST Type is required'),
                address_line1: Yup.string().required('Address Line 1 is required'),
                address_line2: Yup.string().optional(),
                postal_code: Yup.string().required('Pincode is required'),
                state: Yup.string().required('State is required'),
                country: Yup.string().required('Country is required')
              })
            ),
        otherwise: () => Yup.array().of(Yup.object().shape({}))
      })
    }),
    onSubmit: async (values) => {
      if (!businessDetailsData?.id && !businessDetailsData?.invoicing_profile_id) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Business profile not found. Please complete business profile first.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }

      const postData = {
        ...values,
        invoicing_profile: businessDetailsData.invoicing_profile_id || businessDetailsData.id
      };
      const url = type === 'edit' ? `/invoicing/customer_profiles/update/${selectedCustomer?.id}/` : '/invoicing/customer_profiles/create/';
      const method = type === 'edit' ? 'put' : 'post';
      postData.opening_balance = Number(postData.opening_balance);
      const { res } = await Factory(method, url, postData);

      if (res.status_cd === 0) {
        getCustomersData(businessDetailsData.invoicing_profile_id || businessDetailsData.id);
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

  const { values, setValues, errors, touched, handleSubmit, handleBlur, setFieldValue, resetForm } = formik;

  useEffect(() => {
    if (type === 'edit' && selectedCustomer) {
      setValues({
        name: selectedCustomer.name || '',
        pan_number: selectedCustomer.pan_number || '',
        gstin: selectedCustomer.gstin || '',
        gst_type: selectedCustomer.gst_type || '',
        address_line1: selectedCustomer.address_line1 || '',
        address_line2: selectedCustomer.address_line2 || '',
        country: selectedCustomer.country || 'India',
        state: selectedCustomer.state || '',
        postal_code: selectedCustomer.postal_code || '',
        entity_type: selectedCustomer.entity_type || '',
        gst_registered: selectedCustomer.gst_registered || false,
        email: selectedCustomer.email || '',
        mobile_number: selectedCustomer.mobile_number || '',
        opening_balance: selectedCustomer.opening_balance || 0,
        branches: selectedCustomer.branches || [],
        has_multiple_branches: selectedCustomer.has_multiple_branches || false
      });
    }
  }, [type, selectedCustomer]);
  const addBranch = () => {
    const newBranch = {
      branch_name: '',
      gstin: '',
      gst_type: '',
      address_line1: '',
      address_line2: '',
      country: 'India',
      state: '',
      postal_code: ''
    };
    setFieldValue('branches', [...values.branches, newBranch]);
  };

  const removeBranch = (index) => {
    const newBranches = values.branches.filter((_, i) => i !== index);
    setFieldValue('branches', newBranches);
  };

  const renderBranchFields = (branch, index) => (
    <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        {/* <Typography variant="h6">Branch {index + 1}</Typography> */}
        <IconButton onClick={() => removeBranch(index)} color="error">
          <DeleteIcon />
        </IconButton>
      </Stack>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Branch Name/Vertical</Typography>
          <CustomInput
            name={`branches.${index}.branch_name`}
            value={branch.branch_name}
            onChange={(e) => setFieldValue(`branches.${index}.branch_name`, e.target.value)}
            error={touched.branches?.[index]?.branch_name && Boolean(errors.branches?.[index]?.branch_name)}
            helperText={touched.branches?.[index]?.branch_name && errors.branches?.[index]?.branch_name}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>GSTIN</Typography>
          <CustomInput
            name={`branches.${index}.gstin`}
            value={branch.gstin}
            onChange={(e) => setFieldValue(`branches.${index}.gstin`, e.target.value.toUpperCase())}
            error={touched.branches?.[index]?.gstin && Boolean(errors.branches?.[index]?.gstin)}
            helperText={touched.branches?.[index]?.gstin && errors.branches?.[index]?.gstin}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>GST Type</Typography>
          <CustomAutocomplete
            name={`branches.${index}.gst_type`}
            value={branch.gst_type}
            onChange={(e, val) => setFieldValue(`branches.${index}.gst_type`, val)}
            options={gstTypes}
            error={touched.branches?.[index]?.gst_type && Boolean(errors.branches?.[index]?.gst_type)}
            helperText={touched.branches?.[index]?.gst_type && errors.branches?.[index]?.gst_type}
          />
        </Grid2>

        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Address Line 1</Typography>
          <CustomInput
            name={`branches.${index}.address_line1`}
            value={branch.address_line1}
            onChange={(e) => setFieldValue(`branches.${index}.address_line1`, e.target.value)}
            error={touched.branches?.[index]?.address_line1 && Boolean(errors.branches?.[index]?.address_line1)}
            helperText={touched.branches?.[index]?.address_line1 && errors.branches?.[index]?.address_line1}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Address Line 2</Typography>
          <CustomInput
            name={`branches.${index}.address_line2`}
            value={branch.address_line2}
            onChange={(e) => setFieldValue(`branches.${index}.address_line2`, e.target.value)}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Country</Typography>
          <CustomAutocomplete
            name={`branches.${index}.country`}
            value={branch.country}
            onChange={(e, val) => setFieldValue(`branches.${index}.country`, val)}
            options={CountriesList}
            error={touched.branches?.[index]?.country && Boolean(errors.branches?.[index]?.country)}
            helperText={touched.branches?.[index]?.country && errors.branches?.[index]?.country}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>State</Typography>
          <CustomAutocomplete
            name={`branches.${index}.state`}
            value={branch.state}
            onChange={(e, val) => setFieldValue(`branches.${index}.state`, val)}
            options={indian_States_And_UTs}
            error={touched.branches?.[index]?.state && Boolean(errors.branches?.[index]?.state)}
            helperText={touched.branches?.[index]?.state && errors.branches?.[index]?.state}
          />
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
          <Typography sx={{ mb: 1 }}>Pincode</Typography>
          <CustomInput
            name={`branches.${index}.postal_code`}
            value={branch.postal_code}
            onChange={(e) => setFieldValue(`branches.${index}.postal_code`, e.target.value)}
            error={touched.branches?.[index]?.postal_code && Boolean(errors.branches?.[index]?.postal_code)}
            helperText={touched.branches?.[index]?.postal_code && errors.branches?.[index]?.postal_code}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
  return (
    <Modal
      maxWidth="md"
      open={open}
      showClose={true}
      handleClose={() => {
        if (typeof setType === 'function') {
          setType('');
        }
        resetForm();
        if (typeof handleClose === 'function') {
          handleClose();
        }
      }}
      title={type === 'edit' ? 'Update Customer' : 'Add New Customer'}
      footer={
        <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ width: '100%' }}>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              if (typeof setType === 'function') {
                setType('');
              }
              resetForm();
              if (typeof handleClose === 'function') {
                handleClose();
              }
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
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Customer Name</Typography>
            <CustomInput
              name="name"
              value={values.name}
              onChange={(e) => setFieldValue('name', e.target.value)}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>PAN</Typography>
            <CustomInput
              name="pan_number"
              value={values.pan_number.toUpperCase()}
              onChange={(e) => {
                const value = e.target.value.toUpperCase();
                if (value.length <= 10) {
                  setFieldValue('pan_number', value);
                }
              }}
              error={touched.pan_number && Boolean(errors.pan_number)}
              helperText={touched.pan_number && errors.pan_number}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Entity Type</Typography>
            <CustomAutocomplete
              name="entity_type"
              value={values.entity_type}
              onChange={(e, val) => setFieldValue('entity_type', val)}
              options={
                values.pan_number && values.pan_number.length >= 4
                  ? businessTypesArray[values.pan_number[3]] || entity_choices
                  : entity_choices
              }
              error={touched.entity_type && Boolean(errors.entity_type)}
              helperText={touched.entity_type && errors.entity_type}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <FormLabel>GST Registered</FormLabel>
              <RadioGroup
                row
                name="gst_registered"
                value={values.gst_registered}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue('gst_registered', value);
                  if (value === false) {
                    setFieldValue('gstin', 'NA');
                    setFieldValue('gst_type', '');
                    formik.setFieldTouched('gstin', false);
                    formik.setFieldError('gstin', '');
                  } else {
                    setFieldValue('gstin', '');
                  }
                }}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>GST Type</Typography>
            <CustomAutocomplete
              name="gst_type"
              value={values.gst_type}
              onChange={(e, val) => setFieldValue('gst_type', val)}
              options={gstTypes}
              error={touched.gst_type && Boolean(errors.gst_type)}
              helperText={touched.gst_type && errors.gst_type}
              disabled={values.gst_registered === false}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>GSTIN</Typography>
            <CustomInput
              name="gstin"
              value={values.gstin}
              onChange={(e) => setFieldValue('gstin', e.target.value)}
              error={touched.gstin && Boolean(errors.gstin)}
              helperText={touched.gstin && errors.gstin}
              disabled={values.gst_registered === false}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Address Line 1</Typography>
            <CustomInput
              name="address_line1"
              value={values.address_line1}
              onChange={(e) => setFieldValue('address_line1', e.target.value)}
              error={touched.address_line1 && Boolean(errors.address_line1)}
              helperText={touched.address_line1 && errors.address_line1}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Address Line 2</Typography>
            <CustomInput
              name="address_line2"
              value={values.address_line2}
              onChange={(e) => setFieldValue('address_line2', e.target.value)}
              error={touched.address_line2 && Boolean(errors.address_line2)}
              helperText={touched.address_line2 && errors.address_line2}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Country</Typography>
            <CustomAutocomplete
              name="country"
              value={values.country}
              onChange={(e, val) => setFieldValue('country', val)}
              options={CountriesList}
              error={touched.country && Boolean(errors.country)}
              helperText={touched.country && errors.country}
              disabled
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>State</Typography>
            <CustomAutocomplete
              name="state"
              value={values.state}
              onChange={(e, val) => setFieldValue('state', val)}
              options={indian_States_And_UTs}
              error={touched.state && Boolean(errors.state)}
              helperText={touched.state && errors.state}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Pincode</Typography>
            <CustomInput
              name="postal_code"
              value={values.postal_code}
              onChange={(e) => setFieldValue('postal_code', e.target.value)}
              error={touched.postal_code && Boolean(errors.postal_code)}
              helperText={touched.postal_code && errors.postal_code}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Email </Typography>
            <CustomInput
              name="email"
              value={values.email}
              onChange={(e) => setFieldValue('email', e.target.value)}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Mobile</Typography>
            <CustomInput
              name="mobile_number"
              value={values.mobile_number}
              onChange={(e) => setFieldValue('mobile_number', e.target.value)}
              error={touched.mobile_number && Boolean(errors.mobile_number)}
              helperText={touched.mobile_number && errors.mobile_number}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <Typography sx={{ mb: 1 }}>Opening Balance</Typography>
            <CustomInput
              name="opening_balance"
              value={values.opening_balance}
              onChange={(e) => setFieldValue('opening_balance', e.target.value)}
              error={touched.opening_balance && Boolean(errors.opening_balance)}
              helperText={touched.opening_balance && errors.opening_balance}
              placeholder="₹"
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
            <FormControl fullWidth>
              <FormLabel>Do You have Multiple branches?</FormLabel>
              <RadioGroup
                row
                name="has_multiple_branches"
                value={values.has_multiple_branches}
                onChange={(e) => {
                  const value = e.target.value === 'true' ? true : false;
                  setFieldValue('has_multiple_branches', value);
                  if (!value) {
                    setFieldValue('branches', []);
                  } else {
                    setFieldValue('branches', [
                      {
                        branch_name: '',
                        gstin: '',
                        gst_type: '',
                        address_line1: '',
                        address_line2: '',
                        country: 'India',
                        state: '',
                        postal_code: ''
                      }
                    ]);
                  }
                }}
              >
                <FormControlLabel value={true} control={<Radio />} label="Yes" />
                <FormControlLabel value={false} control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid2>
        </Grid2>

        {values.has_multiple_branches === true && (
          <Box sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mb: 2 }}>
              {/* <Typography variant="h5">Branches</Typography> */}
              <Button
                startIcon={<AddIcon />}
                variant="contained"
                size="small"
                onClick={addBranch}
                disabled={values.has_multiple_branches === false && values.branches.length > 0}
              >
                Add Branch
              </Button>
            </Stack>
            {values.branches.map((branch, index) => renderBranchFields(branch, index))}
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default AddCustomer;
