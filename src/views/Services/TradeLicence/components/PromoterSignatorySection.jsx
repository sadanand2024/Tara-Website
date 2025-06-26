import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Stack,
  Tooltip,
  TextField,
  Card,
  Grid2
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import { useSearchParams } from 'react-router-dom';
import RaiseRequest from '../../RaiseRequest';
import GetActionButtons from '../../FormHelpers';

import RenderFileUpload from 'ui-component/extended/RenderFileUpload';

const PromoterSignatorySection = ({ taskId }) => {
   const [searchParams] = useSearchParams();
      const service_id = searchParams.get('service_id');
      const [promoterTaskId, setPromoterTaskId] = useState({
          id: null,
          task_id: null
        }); 
  const dispatch = useDispatch();
  const [saveIndex, setSaveIndex] = useState(null); // <-- index of promoter to save

  const getSignatoryDetails = async () => {
    const url = `/tradelicense/signatory-details/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);

    
      const signatoryinfo = res?.data?.signatory_info ?? res?.signatory_info ?? [];
      if (res.status_cd === 0 && Array.isArray(signatoryinfo)) {


    // if (res.status_cd === 0) {

      const promoters =
        signatoryinfo.map((item) => ({
          name: item.name || '',
          aadhar_image: item.aadhar_image || null,
          pan_image: item.pan_image || null,
          passport_photo: item.passport_photo || null,
          address: item.address || '',
          email: item.email || '',
          mobile_number: item.mobile_number || '',
          residential_address: item.residential_address === 'yes',
          id: item.id || ''
        })) || [];

      if (promoters.length) {
        formik.setFieldValue('promoters', promoters);
      }
       
         setPromoterTaskId(res.data);
    }

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
    }
  };

  const formik = useFormik({
    initialValues: {
      promoters: [
        {
          name: '',
          aadhar_image: null,
          pan_image: null,
          passport_photo: null,
          address: '',
          email: '',
          mobile_number: '',
          residential_address: true
        }
      ]
    },
    validationSchema: Yup.object({
      promoters: Yup.array().of(
        Yup.object({
          name: Yup.string().required('Name is required'),
          aadhar_image: Yup.mixed().required('Aadhaar file is required'),
          pan_image: Yup.mixed().required('PAN file is required'),
          passport_photo: Yup.mixed().required('Photo file is required'),
          // address: Yup.string().required('Address is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          mobile_number: Yup.string()
                  .required('Mobile Number is required')
                  .matches(/^[0-9]+$/, 'Mobile Number must be a number')
                  .min(10, 'Mobile Number must be at least 10 digits')
                  .max(10, 'Mobile Number must not exceed 10 digits'),  
          residential_address: Yup.boolean()
        })
      )
    }),
    onSubmit: async (values) => {
      if (saveIndex === null) return; // No promoter to save

      const promoter = values.promoters[saveIndex];

      try {
        let formData = new FormData();
        formData.append('service_request', service_id);
        formData.append('service_task', taskId);
        formData.append('name', promoter.name);
        if (promoter.aadhar_image && typeof promoter.aadhar_image !== 'string') {
          formData.append('aadhar_image', promoter.aadhar_image);
        }
        if (promoter.pan_image && typeof promoter.pan_image !== 'string') {
          formData.append('pan_image', promoter.pan_image);
        }
        if (promoter.passport_photo && typeof promoter.passport_photo !== 'string') {
          formData.append('passport_photo', promoter.passport_photo);
        }

        formData.append('email', promoter.email);
        formData.append('mobile_number', promoter.mobile_number);
        formData.append('address', promoter.address);
        formData.append('residential_address', promoter.residential_address ? 'yes' : 'no');
        formData.append('status', 'in progress');

        let url = promoter.id ? `/tradelicense/signatory-details/${promoter.id}/` : `/tradelicense/signatory-details/`;

        const { res } = await Factory(promoter.id ? 'put' : 'post', url, formData);

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
              message: promoter.id ? 'Data Updated Successfully' : 'Data Saved Successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
           try {
                  const reviewFormData = new FormData();
                  reviewFormData.append('service_request', service_id);
                  reviewFormData.append('service_task', taskId);
                  reviewFormData.append('status', 'in progress');
          
                  await Factory('post', '/tradelicense/signatory-details/', reviewFormData);
                  // console.log('Review status submitted successfully.');
                } catch (err) {
                  // console.error('Review status API error:', err);
                }
          getSignatoryDetails();
        }
      } catch (error) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'An error occurred while saving data.',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }

      setSaveIndex(null); // Reset after save
    }
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;
  const addPromoter = () => {
    if (values.promoters.length < 10) {
      setFieldValue('promoters', [
        ...values.promoters,
        {
          name: '',
          aadhar_image: null,
          pan_image: null,
          passport_photo: null,
          address: '',
          email: '',
          mobile_number: '',
          residential_address: true
        }
      ]);
    }
  };

  const removePromoter = () => {
    if (values.promoters.length > 1) {
      setFieldValue('promoters', values.promoters.slice(0, -1));
    }
  };

  const handleIndividualDelete = async (index) => {
    const promoter = formik.values.promoters[index];
    if (!promoter.id) {
      // Just remove from form state, no API call
      const updatedPromoters = [...formik.values.promoters];
      updatedPromoters.splice(index, 1);
      formik.setFieldValue('promoters', updatedPromoters);
      return;
    }
    // Otherwise, make API call
    let url = `/tradelicense/signatory-details/${promoter.id}/`;
    const { res } = await Factory('delete', url);
    if (res.status_cd === 0) {
      const updatedPromoters = [...formik.values.promoters];
      updatedPromoters.splice(index, 1);
      formik.setFieldValue('promoters', updatedPromoters);
    }
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
    }
  };

  useEffect(() => {
    getSignatoryDetails();
  }, []);
  return (
    <form onSubmit={formik.handleSubmit}>
      <Card sx={{ p: 3, mt: 4 }}>
        <Grid2> 
        <Typography variant="h5" fontWeight={700} mb={2}>
          <u>Promoter / Signatory Details</u>
        </Typography>
        </Grid2>
         <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
                  <Box display="flex" justifyContent="flex-end" gap={1}>
                    <RaiseRequest
                      fields={[
                        'Full Name',
                        'Aadhaar Card',
                        'PAN Card',
                        'Photograph',
                        'Residential Address',
                        'Email ID',
                        'Mobile Number',
                        'Gender',
                        'Designation',
                        'Is Residential Address Same as Aadhaar Address'
                      ]}
                      task_id={taskId}
                    />
                  </Box>
                </Grid2>

        <Box display="flex" alignItems="center" mb={2}>
          <Typography>No. of Promoters/Directors/Managing Partners</Typography>
          <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={removePromoter}>
            -
          </Button>
          <Typography variant="h5" mx={2}>
            {values.promoters.length}
          </Typography>
          <Button variant="outlined" size="small" onClick={addPromoter}>
            +
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {['Name', 'Aadhaar', 'PAN', 'Photo', 'Mobile', 'Email', 'Address', 'Same As Aadhaar', 'Action'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: '#fff !important',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                      '& .MuiTableCell-root': {
                        color: '#fff'
                      }
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {values.promoters.map((promoter, idx) => (
                <TableRow key={idx}>
                  {/* Name */}
                  <TableCell>
                    <TextField
                      fullWidth
                      sx={{
                        minWidth: 200,
                        maxWidth: 200
                      }}
                      size="small"
                      label="Name"
                      name={`promoters[${idx}].name`}
                      value={promoter.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.name && Boolean(errors.promoters?.[idx]?.name)}
                      helperText={touched.promoters?.[idx]?.name && errors.promoters?.[idx]?.name}
                    />
                  </TableCell>

                  {/* Aadhaar Upload */}
                  <TableCell>
                    <RenderFileUpload
                      label="Aadhaar"
                      fieldName={`promoters[${idx}].aadhar_image`}
                      file={promoter.aadhar_image}
                      setFieldValue={setFieldValue}
                      touched={touched.promoters?.[idx]?.aadhar_image}
                      errors={errors.promoters?.[idx]?.aadhar_image}
                    />
                  </TableCell>

                  {/* PAN Upload */}
                  <TableCell>
                    <RenderFileUpload
                      label="PAN"
                      fieldName={`promoters[${idx}].pan_image`}
                      file={promoter.pan_image}
                      setFieldValue={setFieldValue}
                      touched={touched.promoters?.[idx]?.pan_image}
                      errors={errors.promoters?.[idx]?.pan_image}
                    />
                  </TableCell>

                  {/* Photo Upload */}
                  <TableCell>
                    <RenderFileUpload
                      label="Photo"
                      fieldName={`promoters[${idx}].passport_photo`}
                      file={promoter.passport_photo}
                      setFieldValue={setFieldValue}
                      touched={touched.promoters?.[idx]?.passport_photo}
                      errors={errors.promoters?.[idx]?.passport_photo}
                    />
                  </TableCell>

                  {/* Mobile */}
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      label="Mobile"
                      sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      name={`promoters[${idx}].mobile_number`}
                      value={promoter.mobile_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.mobile_number && Boolean(errors.promoters?.[idx]?.mobile_number)}
                      helperText={touched.promoters?.[idx]?.mobile_number && errors.promoters?.[idx]?.mobile_number}
                    />
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      label="Email"
                      sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      name={`promoters[${idx}].email`}
                      value={promoter.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.email && Boolean(errors.promoters?.[idx]?.email)}
                      helperText={touched.promoters?.[idx]?.email && errors.promoters?.[idx]?.email}
                    />
                  </TableCell>

                  {/* Address */}
                  <TableCell>
                    {promoter.residential_address ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Address as per Aadhaar
                      </Typography>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        label="Address"
                        name={`promoters[${idx}].address`}
                        value={promoter.address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.promoters?.[idx]?.address && Boolean(errors.promoters?.[idx]?.address)}
                        helperText={touched.promoters?.[idx]?.address && errors.promoters?.[idx]?.address}
                      />
                    )}
                  </TableCell>

                  {/* Checkbox */}
                  <TableCell align="center">
                    <Tooltip title="Same as per Aadhaar">
                      <Checkbox
                        checked={promoter.residential_address}
                        onChange={(e) => {
                          setFieldValue(`promoters[${idx}].residential_address`, e.target.checked);
                          if (e.target.checked) {
                            setFieldValue(`promoters[${idx}].address`, ''); // Clear address field if checkbox checked
                          }
                        }}
                      />
                    </Tooltip>
                  </TableCell>

                  {/* Action Buttons */}
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSaveIndex(idx);
                          formik.handleSubmit();
                        }}
                      >
                        Save
                      </Button>

                      <Button variant="outlined" size="small" color="error" onClick={() => handleIndividualDelete(idx)}>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2 size={{ xs: 12 }}>
          
                <Stack direction="row" spacing={1} justifyContent="flex-end" mt={3}> 
                  <GetActionButtons
                    type="post"
                    urlEndpoint="/tradelicense/signatory-details/"
                    recId={promoterTaskId.id}
                    status={promoterTaskId.status}
                    data={promoterTaskId}
                    service_request={service_id}
                    task_id={taskId}
                    urlKey="tradelicense"
                    urlBool={true}
                  />
                  </Stack>
                </Grid2>
      </Card>
    </form>
  );
};

export default PromoterSignatorySection;
