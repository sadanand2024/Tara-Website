import React, { useEffect, useState } from 'react';
import { Box, Typography, TextField, Grid2, Autocomplete, IconButton, InputAdornment, Button } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
const typeOfBusinessOptions = [
  'Proprietorship',
  'Partnership',
  'Pvt Ltd',
  'Public Ltd',
  'OPC',
  'HUF',
  'Trust',
  'Society',
  'Section 8',
  'Co-operative',
  'Joint Venture',
  'Branch Office',
  'Liaison Office',
  'Foreign Company'
];
const categoryOfEstablishmentOptions = ['Trust', 'Society', 'Section 8', 'Co-operative', 'Joint Venture', 'Branch Office'];
const natureOfBusinessOptions = ['Manufacturing', 'Service'];

const BusinessIdentityStructureSection = () => {
  const dispatch = useDispatch();
  const [businessIdentityposttype, setBusinessIdentityposttype] = useState('post');
  const [panFile, setPanFile] = useState(null);
  const formik = useFormik({
    initialValues: {
      classificationOfEstablishment: '',
      categoryOfEstablishment: '',
      legalNameOfBusiness: '',
      natureOfBusiness: '',
      panOfBusiness: '',
      dateOfCommencement: ''
    },
    validationSchema: Yup.object({
      classificationOfEstablishment: Yup.string().required('Classification of Establishment is required'),
      categoryOfEstablishment: Yup.string().required('Category of Establishment is required'),
      legalNameOfBusiness: Yup.string().required('Legal Name of Business is required'),
      natureOfBusiness: Yup.string().required('Nature of Business is required')
    }),
    onSubmit: async (values) => {
      const url =
        businessIdentityposttype === 'put' ? `/labourlicense/business-identity/${values.id}/` : `/labourlicense/business-identity/`;

      const formData = new FormData();
      formData.append('service_request', 24);
      formData.append('service_task', 6);
      formData.append('date_of_commencement', values.dateOfCommencement);
      formData.append('nature_of_business', values.natureOfBusiness);
      formData.append('legal_name_of_business', values.legalNameOfBusiness);
      formData.append('category_of_establishment', values.categoryOfEstablishment);
      formData.append('classification_of_establishment', values.classificationOfEstablishment);
      formData.append('status', 'in progress');

      // ✅ Append the actual file, not just a string
      if (panFile) {
        formData.append('business_pan', panFile); // key must match backend expectations
      }

      const { res } = await Factory(businessIdentityposttype, url, formData);

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
            message: businessIdentityposttype === 'put' ? 'Data Updated Successfully' : 'Data Saved Successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
      }
    }
  });
  const { values, setValues, handleChange, errors, touched, handleSubmit, handleBlur, resetForm, setFieldValue } = formik;
  const getBusinessIdentity = async () => {
    const url = `/labourlicense/business-identity/by-request-or-task?service_request_id=24`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      // Map API response to form fields
      const responseData = {
        // Business Identity & Structure
        classificationOfEstablishment: res.data.classification_of_establishment || '',
        categoryOfEstablishment: res.data.category_of_establishment || '',
        legalNameOfBusiness: res.data.legal_name_of_business || '',
        typeOfBusiness: res.data.type_of_business || '',
        natureOfBusiness: res.data.nature_of_business || '',
        panOfBusiness: res.data.business_pan || '',
        dateOfCommencement: res.data.date_of_commencement || '',
        id: res.data.id || ''
      };
      setValues(responseData);
      setBusinessIdentityposttype('put');
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
      setBusinessIdentityposttype('post');
    }
  };
  useEffect(() => {
    getBusinessIdentity();
  }, []);

  const handlePanDownload = () => {
    if (values.panOfBusiness) {
      window.open(values.panOfBusiness, '_blank');
    }
  };

  const handlePanDelete = async () => {
    // Add your delete API call here
    setFieldValue('panOfBusiness', '');
    setPanFile(null);
  };

  const handlePanUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPanFile(file);
      // Add your upload API call here
      // After successful upload, update the panOfBusiness value with the returned URL
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        <span style={{ textDecoration: 'underline' }}>Business Identity & Structure</span>
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Classification of Establishment
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={typeOfBusinessOptions}
              value={values.classificationOfEstablishment}
              onChange={(e, value) => setFieldValue('classificationOfEstablishment', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="classificationOfEstablishment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.classificationOfEstablishment && Boolean(errors.classificationOfEstablishment)}
                  helperText={touched.classificationOfEstablishment && errors.classificationOfEstablishment}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Category of Establishment
            </Typography>
            <Autocomplete
              fullWidth
              size="small"
              options={categoryOfEstablishmentOptions}
              value={values.categoryOfEstablishment}
              onChange={(e, value) => setFieldValue('categoryOfEstablishment', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="categoryOfEstablishment"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.categoryOfEstablishment && Boolean(errors.categoryOfEstablishment)}
                  helperText={touched.categoryOfEstablishment && errors.categoryOfEstablishment}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Legal Name of Business
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="legalNameOfBusiness"
              value={values.legalNameOfBusiness}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.legalNameOfBusiness && Boolean(errors.legalNameOfBusiness)}
              helperText={touched.legalNameOfBusiness && errors.legalNameOfBusiness}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Nature of Business
            </Typography>
            <Autocomplete
              size="small"
              fullWidth
              options={natureOfBusinessOptions}
              value={values.natureOfBusiness}
              onChange={(e, value) => setFieldValue('natureOfBusiness', value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={touched.natureOfBusiness && Boolean(errors.natureOfBusiness)}
                  helperText={touched.natureOfBusiness && errors.natureOfBusiness}
                />
              )}
            />
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <input type="file" id="panOfBusiness" accept=".pdf,.jpg,.jpeg,.png" onChange={handlePanUpload} style={{ display: 'none' }} />
              <label htmlFor="panOfBusiness">
                <Button variant="outlined" component="span" startIcon={<UploadFileIcon />} size="small">
                  Upload PAN
                </Button>
              </label>
              {values.panOfBusiness && (
                <>
                  <Typography variant="body2" sx={{ flex: 1 }}>
                    {values.panOfBusiness.split('/').pop()}
                  </Typography>
                  <IconButton onClick={handlePanDownload} size="small">
                    <DownloadIcon />
                  </IconButton>
                  <IconButton onClick={handlePanDelete} size="small">
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </Box>
          </Grid2>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              Date of Commencement
            </Typography>
            <TextField
              fullWidth
              size="small"
              name="dateOfCommencement"
              type="date"
              value={values.dateOfCommencement}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.dateOfCommencement && Boolean(errors.dateOfCommencement)}
              helperText={touched.dateOfCommencement && errors.dateOfCommencement}
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>
        </Grid2>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="contained" color="primary" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default BusinessIdentityStructureSection;
