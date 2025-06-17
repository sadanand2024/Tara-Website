import {
    Autocomplete,
    Box,
    Button,
    Card,
    Checkbox,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import * as Yup from 'yup';


const StepTwo = () => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
  const dispatch = useDispatch();
  const [saveIndex, setSaveIndex] = useState(null);
    const [promoterTaskId, setPromoterTaskId] = useState( {
      id: null,
    task_id: null }); // <-- index of promoter to save

  const getSignatoryDetails = async () => {
    const url = `/gst/service-request-section-data?service_request_id=${service_id}&section=director_promoter_details`;
    const { res } = await Factory('get', url);
    const data = res?.data?.task_data["Promoter Signatory Details"]?.data;
    if (res?.data?.task_data && data !== null) {
      const infoList = data?.info_list ?? res?.info_list ?? [];
      // console.log('Promoter Signatory Details:', infoList);

      if (res.status_cd === 0 && Array.isArray(infoList)) {
        const promoters =
          infoList.map((item) => ({
            name: item.name || '',
            aadhaar: item.aadhaar || null,
            pan: item.pan || null,
            photo: item.photo || null,
            residential_address: item.residential_address || '',
            email: item.email || '',
            mobile: item.mobile || '',
            gender: item.gender || '',
            designation: item.designation || '',
            residential_same_as_aadhaar_address: item.residential_same_as_aadhaar_address === 'Yes',
            id: item.id || '',
            task_id: res.data?.task_data["Promoter Signatory Details"]?.task_id || null,
          })) || [];

        if (promoters.length) {
          formik.setFieldValue('promoters', promoters);
        }
        setPromoterTaskId({
          task_id: res.data?.task_data["Promoter Signatory Details"]?.task_id || null,
        });
      }
    } else {
      setPromoterTaskId({
        task_id: res?.data?.task_data["Promoter Signatory Details"]?.task_id || null,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      promoters: [
        {
          name: '',
          aadhaar: null,
          pan: null,
          photo: null,
          residential_address: '',
          email: '',
          mobile: '',
          gender: '',
          designation: '',
          residential_same_as_aadhaar_address: 'true'
        }
      ]
    },
    validationSchema: Yup.object({
      promoters: Yup.array().of(
        Yup.object({
          name: Yup.string().required('Name is required'),
          aadhaar: Yup.mixed().required('Aadhaar file is required'),
          pan: Yup.mixed().required('PAN file is required'),
          photo: Yup.mixed().required('Photo file is required'),
          // residential_address: Yup.string().required('residential_address is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          mobile: Yup.string().required('Mobile is required'),
          gender: Yup.string().required('gender is required'),
          designation: Yup.string().required('designation is required'),
          residential_same_as_aadhaar_address: Yup.boolean('')
        })
      )
    }),
    onSubmit: async (values) => {
      const task_id = promoterTaskId.task_id;
      console.log('Task ID:', task_id);
      if (saveIndex === null) return; // No promoter to save

      const promoter = values.promoters[saveIndex];

      try {
        let formData = new FormData();
        formData.append('service_request', service_id);
        formData.append('service_task', task_id);
        formData.append('name', promoter.name);
        if (promoter.aadhaar && typeof promoter.aadhaar !== 'string') {
          formData.append('aadhaar', promoter.aadhaar);
        }
        if (promoter.pan && typeof promoter.pan !== 'string') {
          formData.append('pan', promoter.pan);
        }
        if (promoter.photo && typeof promoter.photo !== 'string') {
          formData.append('photo', promoter.photo);
        }
        formData.append('email', promoter.email);
        formData.append('mobile', promoter.mobile);
        formData.append('residential_address', promoter.residential_address);
        formData.append('gender', promoter.gender);
        formData.append('designation', promoter.designation);
        formData.append('residential_same_as_aadhaar_address', promoter.residential_same_as_aadhaar_address ? 'Yes' : 'No');
        formData.append('status', 'in progress');
        // formData.append('id', promoter.id || ''); // Include ID if it exists
        // let url = `/gst/promoter-signatory-details/`;

        // const { res } = await Factory( 'post', url, formData);
         let url = promoter.id ? `/gst/promoter-signatory-details/${promoter.id}/update/` : `/gst/promoter-signatory-details/`;
        
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
          aadhaar: null,
          pan: null,
          photo: null,
          residential_address: '',
          email: '',
          mobile: '',
          gender: '',
          designation: '',
          residential_same_as_aadhaar_address: true
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
    let url = `/gst/promoter-signatory-info/${promoter.id}/delete/`;
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
        <Typography variant="h5" fontWeight={700} mb={2}>
          <u>Promoter / Signatory Details</u>
        </Typography>

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
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {[
                  'Name',
                  'Mobile',
                  'Email',
                  'PAN',
                  'Aadhaar',
                  'Photo',
                  'Gender',
                  'Designation',
                  'Residential Address',
                  ' Same As Aadhaar',
                  'Action'
                ].map((head) => (
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
                      size="small"
                      sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      label="Name"
                      name={`promoters[${idx}].name`}
                      value={promoter.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.name && Boolean(errors.promoters?.[idx]?.name)}
                      helperText={touched.promoters?.[idx]?.name && errors.promoters?.[idx]?.name}
                    />
                  </TableCell>
                  {/* Mobile */}
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      label="Mobile"
                      name={`promoters[${idx}].mobile`}
                      value={promoter.mobile}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.mobile && Boolean(errors.promoters?.[idx]?.mobile)}
                      helperText={touched.promoters?.[idx]?.mobile && errors.promoters?.[idx]?.mobile}
                    />
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                      sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      label="Email"
                      name={`promoters[${idx}].email`}
                      value={promoter.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.email && Boolean(errors.promoters?.[idx]?.email)}
                      helperText={touched.promoters?.[idx]?.email && errors.promoters?.[idx]?.email}
                    />
                  </TableCell>
                  {/* PAN Upload */}
                  <TableCell>
                    <RenderFileUpload
                      label="PAN"
                      fieldName={`promoters[${idx}].pan`}
                      file={promoter.pan}
                      setFieldValue={setFieldValue}
                      touched={touched.promoters?.[idx]?.pan}
                      errors={errors.promoters?.[idx]?.pan}
                    />
                  </TableCell>

                  {/* Aadhaar Upload */}
                  <TableCell>
                    <RenderFileUpload
                      label="Aadhaar"
                      fieldName={`promoters[${idx}].aadhaar`}
                      file={promoter.aadhaar}
                      setFieldValue={setFieldValue}
                      touched={touched.promoters?.[idx]?.aadhaar}
                      errors={errors.promoters?.[idx]?.aadhaar}
                    />
                  </TableCell>

                  {/* Photo Upload */}
                  <TableCell>
                    <RenderFileUpload
                      label="Photo"
                      fieldName={`promoters[${idx}].photo`}
                      file={promoter.photo}
                      setFieldValue={setFieldValue}
                      touched={touched.promoters?.[idx]?.photo}
                      errors={errors.promoters?.[idx]?.photo}
                    />
                  </TableCell>

                  {/* Mobile */}

                  {/* Gender */}
                  <TableCell>
                    <Autocomplete
                      fullWidth
                      size="small"
                       sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      options={['male', 'female']}
                      value={promoter.gender || ''}
                      onChange={(e, value) => setFieldValue(`promoters[${idx}].gender`, value)}
                      onBlur={handleBlur}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Gender"
                          name={`promoters[${idx}].gender`}
                          error={touched.promoters?.[idx]?.gender && Boolean(errors.promoters?.[idx]?.gender)}
                          helperText={touched.promoters?.[idx]?.gender && errors.promoters?.[idx]?.gender}
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      fullWidth
                      size="small"
                       sx={{
                        minWidth: 150,
                        maxWidth: 150
                      }}
                      label="Designation"
                      name={`promoters[${idx}].designation`}
                      value={promoter.designation || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.promoters?.[idx]?.designation && Boolean(errors.promoters?.[idx]?.designation)}
                      helperText={touched.promoters?.[idx]?.designation && errors.promoters?.[idx]?.designation}
                    />
                  </TableCell>

                  {/* Residential Address */}
                  <TableCell>
                    {promoter.residential_same_as_aadhaar_address ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        Address as per Aadhaar
                      </Typography>
                    ) : (
                      <TextField
                        fullWidth
                        size="small"
                        label="Residential Address"
                        name={`promoters[${idx}].residential_address`}
                        value={promoter.residential_address}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.promoters?.[idx]?.residential_address && Boolean(errors.promoters?.[idx]?.residential_address)}
                        helperText={touched.promoters?.[idx]?.residential_address && errors.promoters?.[idx]?.residential_address}
                      />
                    )}
                  </TableCell>

                  {/* Checkbox: Same as Aadhaar */}
                  <TableCell align="center">
                    <Tooltip title="Same as per Aadhaar">
                      <Checkbox
                        checked={promoter.residential_same_as_aadhaar_address === true || promoter.residential_same_as_aadhaar_address === 'true'}

                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFieldValue(`promoters[${idx}].residential_same_as_aadhaar_address`, checked);
                          if (checked) {
                            setFieldValue(`promoters[${idx}].residential_address`, '');
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
      </Card>
    </form>
  );
};

export default StepTwo;
