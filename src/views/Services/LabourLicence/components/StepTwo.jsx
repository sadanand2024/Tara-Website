import React, { useEffect } from 'react';
import { Box, Typography, Button, Grid2 } from '@mui/material';
import IconSave from '@mui/icons-material/Save';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
const StepTwo = () => {
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      id: '',
      certificate_of_incorporation: null,
      authorization_letter: null,
      local_language_name_board_photo_business: null,
      memorandum_of_articles: null
    },
    validationSchema: Yup.object({
      certificate_of_incorporation: Yup.mixed().required('Incorporation certificate is required'),
      authorization_letter: Yup.mixed().required('Authorisation letter is required'),
      local_language_name_board_photo_business: Yup.mixed().required('Name board photo is required'),
      memorandum_of_articles: Yup.mixed().required('MOA is required')
    }),
    onSubmit: async (values) => {
      console.log(values);
      let url = values.id ? `/labourlicense/registration-documents/${values.id}/` : `/labourlicense/registration-documents/`;
      const formData = new FormData();
      formData.append('service_request', 24);
      formData.append('service_task', 9);

      if (values.certificate_of_incorporation && typeof values.certificate_of_incorporation !== 'string') {
        formData.append('certificate_of_incorporation', values.certificate_of_incorporation);
      }
      if (values.authorization_letter && typeof values.authorization_letter !== 'string') {
        formData.append('authorization_letter', values.authorization_letter);
      }
      if (values.local_language_name_board_photo_business && typeof values.local_language_name_board_photo_business !== 'string') {
        formData.append('local_language_name_board_photo_business', values.local_language_name_board_photo_business);
      }
      if (values.memorandum_of_articles && typeof values.memorandum_of_articles !== 'string') {
        formData.append('memorandum_of_articles', values.memorandum_of_articles);
      }
      formData.append('status', 'in progress');
      const { res } = await Factory(values.id ? 'put' : 'post', url, formData);
      if (res.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: values.id ? 'Documents updated successfully' : 'Documents saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        getRegistrationDocuments();
      } else {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Documents not saved',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  });
  const getRegistrationDocuments = async () => {
    const url = `/labourlicense/registration-documents/by-request-or-task?service_request_id=24`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      formik.setValues(res.data);
    }
  };
  useEffect(() => {
    getRegistrationDocuments();
  }, []);
  return (
    <form autoComplete="off">
      {/* Task 2: Business Registration Documents */}
      <Box mb={3}>
        <Typography variant="h4" mb={1}>
          Business Registration Documents
        </Typography>
        <Grid2 container spacing={2} alignItems="center">
          {/* 1. Incorporation certificate / Partnership deed */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>Incorporation certificate / Partnership deed</Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <RenderFileUpload
              label="Incorporation certificate / Partnership deed"
              fieldName="certificate_of_incorporation"
              file={formik.values.certificate_of_incorporation}
              setFieldValue={formik.setFieldValue}
              touched={formik.touched.certificate_of_incorporation}
              errors={formik.errors.certificate_of_incorporation}
            />
          </Grid2>
          {/* 2. Letter of Authorisation / Board resolution */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>Letter of Authorisation / Board resolution</Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <RenderFileUpload
              label="Letter of Authorisation / Board resolution"
              fieldName="authorization_letter"
              file={formik.values.authorization_letter}
              setFieldValue={formik.setFieldValue}
              touched={formik.touched.authorization_letter}
              errors={formik.errors.authorization_letter}
            />
          </Grid2>
          {/* 3. Local language name board photo of business */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>Local language name board photo of business</Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <RenderFileUpload
              label="Local language name board photo of business"
              fieldName="local_language_name_board_photo_business"
              file={formik.values.local_language_name_board_photo_business}
              setFieldValue={formik.setFieldValue}
              touched={formik.touched.local_language_name_board_photo_business}
              errors={formik.errors.local_language_name_board_photo_business}
            />
          </Grid2>
          {/* 4. Memorandum of Articles (MOA) */}
          <Grid2 size={{ sm: 6, md: 6 }}>
            <Typography>
              Memorandum of Articles (MOA) <span style={{ fontSize: 12, color: '#888' }}>(in case of companies)</span>
            </Typography>
          </Grid2>
          <Grid2 size={{ sm: 6, md: 6 }}>
            <RenderFileUpload
              label="Memorandum of Articles (MOA)"
              fieldName="memorandum_of_articles"
              file={formik.values.memorandum_of_articles}
              setFieldValue={formik.setFieldValue}
              touched={formik.touched.memorandum_of_articles}
              errors={formik.errors.memorandum_of_articles}
            />
          </Grid2>
        </Grid2>
      </Box>
      <Box display="flex" justifyContent="flex-end" mt={4}>
        <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={formik.handleSubmit}>
          Save & Continue
        </Button>
      </Box>
    </form>
  );
};

export default StepTwo;
