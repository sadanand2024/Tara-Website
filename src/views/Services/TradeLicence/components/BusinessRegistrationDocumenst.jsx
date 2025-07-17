import { Box, Button, Card, Grid2, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { openSnackbar } from 'store/slices/snackbar';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import CircularProgressComponent from 'utils/CircularProgressComponent';
import Factory from 'utils/Factory';
import * as Yup from 'yup';
import GetActionButtons from '../../FormHelpers';
import RaiseRequest from '../../RaiseRequest';


const BusinessRegistrationDocumenst = ({ taskId }) => {
  const [searchParams] = useSearchParams();
  const service_id = searchParams.get('service_id');
 const [isLoading, setIsLoading] = useState(false);
  
  const [businessDocument, setbusinessDocument] = useState({
    task_id: null
  });
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      id: '',
      incorporation_certificate: null,
      photo_of_premises: null,
      property_tax_receipt: null,
      rental_agreement: null
    },
    validationSchema: Yup.object({
      incorporation_certificate: Yup.mixed().required('Incorporation certificate is required'),
      photo_of_premises: Yup.mixed().required('Photo of premises is required'),
      property_tax_receipt: Yup.mixed().required('Property tax receipt is required'),
      rental_agreement: Yup.mixed().required('Rental agreement is required')
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      let url = values.id ? `/tradelicense/business-documents/${values.id}/` : `/tradelicense/business-documents/`;
      const formData = new FormData();
      formData.append('service_request', service_id);
      formData.append('service_task', taskId);
      if (values.incorporation_certificate && typeof values.incorporation_certificate !== 'string') {
        formData.append('incorporation_certificate', values.incorporation_certificate);
      }
      if (values.photo_of_premises && typeof values.photo_of_premises !== 'string') {
        formData.append('photo_of_premises', values.photo_of_premises);
      }
      if (values.property_tax_receipt && typeof values.property_tax_receipt !== 'string') {
        formData.append('property_tax_receipt', values.property_tax_receipt);
      }
      if (values.rental_agreement && typeof values.rental_agreement !== 'string') {
        formData.append('rental_agreement', values.rental_agreement);
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
      setIsLoading(false);
    }
  });

  const getRegistrationDocuments = async () => {
       setIsLoading(true);
    const url = `/tradelicense/business-documents/by-request-or-task?service_request_id=${service_id}`;
    const { res } = await Factory('get', url);
    if (res.status_cd === 0) {
      setValues({
        id: res.data.id || '',
        incorporation_certificate: res.data.incorporation_certificate || null,
        photo_of_premises: res.data.photo_of_premises || null,
        property_tax_receipt: res.data.property_tax_receipt || null,
        rental_agreement: res.data.rental_agreement || null
      });
      
      setbusinessDocument(res.data);
     
    }
    setIsLoading(false);
    
   
  };
  

  useEffect(() => {
    getRegistrationDocuments();
    // eslint-disable-next-line
  }, []);
   if (isLoading) {
        // console.log('Loading promoter data...', isLoading);
        return <CircularProgressComponent isLoading={isLoading} displayContent={'Loading promoter Data'} />;
      }
      const getLabelWithAsterisk = (label, isRequired = true) => (
  <span>
    {label}
    {isRequired && <span style={{ color: 'red' }}> *</span>}
  </span>
);

  const { values, setValues, setFieldValue, handleChange, errors, touched, handleSubmit, handleBlur } = formik;
  return (
    <Card sx={{ p: 3, mt: 4 }}>
      <Box>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <Box mb={3} mt={4}>
            <Grid2 container alignItems="center" justifyContent="space-between" mb={2}>
              <Grid2>
                <Typography variant="h4" fontWeight={700}>
                  <span style={{ textDecoration: 'underline' }}>Business Registration Documents</span>
                </Typography>
              </Grid2>
              <Grid2 sx={{ flexGrow: 1, ml: 95 }}>
                <Box display="flex" justifyContent="flex-end" gap={1}>
                  <RaiseRequest
                    fields={['Incorporation certificate', 'Photo of premises', 'Property tax receipt', 'Rental agreement']}
                    task_id={taskId}
                  />
                </Box>
              </Grid2>
            </Grid2>
            <Grid2 container spacing={3} alignItems="center">
              {/* 1. Incorporation certificate */}
              <Grid2 size={{ sm: 6, md: 6 }}>
                {/* <Typography variant="subtitle1">Incorporation certificate</Typography> */}
                <Typography variant="subtitle1">
                  {getLabelWithAsterisk('Incorporation certificate')}
              </Typography>
              </Grid2>
              <Grid2 size={{ sm: 6, md: 3 }} sx={{ ml: 15 }}>
                <RenderFileUpload
                  label="Incorporation certificate"
                  fieldName="incorporation_certificate"
                  file={values.incorporation_certificate}
                  setFieldValue={setFieldValue}
                  touched={touched.incorporation_certificate}
                  errors={errors.incorporation_certificate}
                />
              </Grid2>
              {/* 2. Photo of premises */}
              <Grid2 size={{ sm: 6, md: 6 }}>
               <Typography variant="subtitle1">
  {getLabelWithAsterisk('Incorporation certificate')}
</Typography> 

              </Grid2>
              <Grid2 size={{ sm: 6, md: 3 }} sx={{ ml: 15 }}>
                <RenderFileUpload
                  label="Photo of premises"
                  fieldName="photo_of_premises"
                  file={values.photo_of_premises}
                  setFieldValue={setFieldValue}
                  touched={touched.photo_of_premises}
                  errors={errors.photo_of_premises}
                />
              </Grid2>
              {/* 3. Property tax receipt */}
              <Grid2 size={{ sm: 6, md: 6 }}>
                {/* <Typography variant="subtitle1">Property tax receipt</Typography> */}
                <Typography variant="subtitle1">
                   {getLabelWithAsterisk('Property tax receipt')}
                  </Typography>
              </Grid2>
              <Grid2 size={{ sm: 6, md: 3 }} sx={{ ml: 15 }}>
                <RenderFileUpload
                  label="Property tax receipt"
                  fieldName="property_tax_receipt"
                  file={values.property_tax_receipt}
                  setFieldValue={setFieldValue}
                  touched={touched.property_tax_receipt}
                  errors={errors.property_tax_receipt}
                />
              </Grid2>
              {/* 4. Rental agreement */}
              <Grid2 size={{ sm: 6, md: 6 }}>
                {/* <Typography variant="subtitle1">Rental agreement</Typography> */}
                <Typography variant="subtitle1">
                {getLabelWithAsterisk('Rental agreement')}
               </Typography>
              </Grid2>
              <Grid2 size={{ sm: 6, md: 3 }} sx={{ ml: 15 }}>
                <RenderFileUpload
                  label="Rental agreement"
                  fieldName="rental_agreement"
                  file={values.rental_agreement}
                  setFieldValue={setFieldValue}
                  touched={touched.rental_agreement}
                  errors={errors.rental_agreement}
                />
              </Grid2>
            </Grid2>
          </Box>
          <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
            <Button size="medium" variant="contained" color="primary" type="submit">
              Save
            </Button>

            <GetActionButtons
              type="put"
              urlEndpoint="business-documents"
              recId={businessDocument.id}
              status={businessDocument.status}
              data={businessDocument}
              service_request={service_id}
              task_id={taskId}
              urlKey="tradelicense"
              urlBool={true}
            />
          </Box>
        </form>
      </Box>
    </Card>
  );
};

export default BusinessRegistrationDocumenst;
