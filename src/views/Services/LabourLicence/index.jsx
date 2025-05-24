import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid2,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Autocomplete,
  Card,
  Radio,
  FormGroup,
  Stack,
  IconButton
} from '@mui/material';
import IconSave from '@mui/icons-material/Save';
import IconArrowForward from '@mui/icons-material/ArrowForward';
import IconDownload from '@mui/icons-material/Download';
import IconDelete from '@mui/icons-material/Delete';
import IconUpload from '@mui/icons-material/Upload';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import Factory from 'utils/Factory';
import StepOne from './components/StepOne';
const steps = [
  { label: 'Applicant & Business Details', width: 200 },
  { label: 'Documents & Declaration', width: 200 },
  { label: 'Review, Filing & Certificate', width: 220 }
];

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
const natureOfBusinessOptions = [
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'service', label: 'Service' }
];

const businessIdentitySchema = Yup.object().shape({
  classificationOfEstablishment: Yup.string().required('Classification of Establishment is required'),
  categoryOfEstablishment: Yup.string().required('Category of Establishment is required'),
  legalNameOfBusiness: Yup.string().required('Legal Name of Business is required'),
  natureOfBusiness: Yup.string().required('Nature of Business is required'),
  panOfBusiness: Yup.mixed().required('PAN of Business is required'),
  dateOfCommencement: Yup.date().required('Date of Commencement is required')
});

function BusinessIdentityStructureSection({
  values,
  errors,
  touched,
  handleChange,
  setFieldValue,
  handleBlur,
  setErrors,
  getBusinessIdentity,
  businessIdentityposttype
}) {
  const dispatch = useDispatch();
  const handleSaveBusinessIdentity = async (service_task_id, posttype) => {
    console.log(values);
    const url = posttype === 'put' ? `/labourlicense/business-identity/${values.id}/` : `/labourlicense/business-identity/`;

    const formData = new FormData();

    // Append all form values to the FormData object
    formData.append('service_request', 24);
    formData.append('service_task', service_task_id);
    formData.append('business_pan', values.panOfBusiness);
    formData.append('date_of_commencement', values.dateOfCommencement);
    formData.append('nature_of_business', values.natureOfBusiness);
    formData.append('legal_name_of_business', values.legalNameOfBusiness);
    formData.append('category_of_establishment', values.categoryOfEstablishment);
    formData.append('classification_of_establishment', values.classificationOfEstablishment);
    formData.append('status', 'in progress');

    const { res } = await Factory(posttype, url, formData);
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
          message: 'Data Saved Successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      handleNext();
    }
  };
  const handleFieldChange = (field, value) => {
    setFieldValue(field, value);
    // Validate the field immediately after change
    businessIdentitySchema
      .validateAt(field, { [field]: value })
      .then(() => {
        // Clear error for this field if validation passes
        if (errors[field]) {
          setErrors({ ...errors, [field]: undefined });
        }
      })
      .catch((err) => {
        // Set error for this field if validation fails
        setErrors({ ...errors, [field]: err.message });
      });
  };

  const handleDeletePan = () => {
    setFieldValue('panOfBusiness', null);
  };

  const handleDownloadPan = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} mb={2}>
        <span style={{ textDecoration: 'underline' }}>Business identity & structure</span>
      </Typography>
      <Grid2 container spacing={2} alignItems="center">
        {/* 1. Classification of Establishment */}
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Typography fontWeight={500}>Classification of Establishment</Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Autocomplete
            size="small"
            fullWidth
            options={typeOfBusinessOptions}
            value={values.classificationOfEstablishment || ''}
            onChange={(e, value) => handleFieldChange('classificationOfEstablishment', value)}
            onBlur={() => handleBlur({ target: { name: 'classificationOfEstablishment' } })}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                size="small"
                error={touched.classificationOfEstablishment && Boolean(errors.classificationOfEstablishment)}
                helperText={touched.classificationOfEstablishment && errors.classificationOfEstablishment}
              />
            )}
          />
        </Grid2>
        {/* 2. Category of Establishment */}
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Typography fontWeight={500}>Category of Establishment</Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Autocomplete
            size="small"
            fullWidth
            options={['Shop', 'Commercial Establishment']}
            value={values.categoryOfEstablishment || ''}
            onChange={(e, value) => handleFieldChange('categoryOfEstablishment', value)}
            onBlur={() => handleBlur({ target: { name: 'categoryOfEstablishment' } })}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                size="small"
                error={touched.categoryOfEstablishment && Boolean(errors.categoryOfEstablishment)}
                helperText={touched.categoryOfEstablishment && errors.categoryOfEstablishment}
              />
            )}
          />
        </Grid2>
        {/* 3. Legal Name of Business */}
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Typography fontWeight={500}>Legal Name of Business</Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label=""
            name="legalNameOfBusiness"
            value={values.legalNameOfBusiness || ''}
            onChange={(e) => handleFieldChange('legalNameOfBusiness', e.target.value)}
            onBlur={handleBlur}
            error={touched.legalNameOfBusiness && Boolean(errors.legalNameOfBusiness)}
            helperText={touched.legalNameOfBusiness && errors.legalNameOfBusiness}
          />
        </Grid2>
        {/* 4. Nature of Business */}
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Typography fontWeight={500}>Nature of Business</Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Autocomplete
            size="small"
            fullWidth
            options={['Manufacturing', 'Service', 'Trading']}
            value={values.natureOfBusiness || ''}
            onChange={(e, value) => handleFieldChange('natureOfBusiness', value)}
            onBlur={() => handleBlur({ target: { name: 'natureOfBusiness' } })}
            renderInput={(params) => (
              <TextField
                {...params}
                label=""
                size="small"
                error={touched.natureOfBusiness && Boolean(errors.natureOfBusiness)}
                helperText={touched.natureOfBusiness && errors.natureOfBusiness}
              />
            )}
          />
        </Grid2>
        {/* 5. PAN of Business (Upload) */}
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Typography fontWeight={500}>PAN of Business</Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {typeof values.panOfBusiness === 'string' && values.panOfBusiness.startsWith('http') ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                <Button
                  variant="text"
                  color="primary"
                  startIcon={<IconDownload />}
                  onClick={() => handleDownloadPan(values.panOfBusiness)}
                  sx={{ textTransform: 'none', minWidth: 0, p: 0 }}
                >
                  {values.panOfBusiness.split('/').pop()}
                </Button>

                <IconButton size="small" onClick={handleDeletePan} sx={{ pr: 10 }}>
                  <IconDelete fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <>
                <input
                  type="file"
                  id="panOfBusinessInput"
                  onChange={(e) => {
                    const file = e.currentTarget.files[0];
                    handleFieldChange('panOfBusiness', file);
                    handleBlur({ target: { name: 'panOfBusiness' } });
                  }}
                  style={{ display: 'none' }}
                />
                <Button variant="outlined" component="label" htmlFor="panOfBusinessInput" startIcon={<IconUpload />} sx={{ flex: 1 }}>
                  {values.panOfBusiness ? values.panOfBusiness.name : 'Upload PAN'}
                </Button>
                {values.panOfBusiness && (
                  <IconButton size="small" onClick={handleDeletePan} sx={{ p: 0.5 }}>
                    <IconDelete fontSize="small" />
                  </IconButton>
                )}
              </>
            )}
          </Box>

          {touched.panOfBusiness && errors.panOfBusiness && (
            <Typography color="error" variant="caption" sx={{ mt: 0.5, display: 'block' }}>
              {errors.panOfBusiness}
            </Typography>
          )}
        </Grid2>

        {/* 6. Date of Commencement of Business */}
        <Grid2 size={{ sm: 6, md: 3 }}>
          <Typography fontWeight={500}>Date of Commencement of Business</Typography>
        </Grid2>
        <Grid2 size={{ sm: 6, md: 3 }}>
          <TextField
            fullWidth
            size="small"
            label=""
            name="dateOfCommencement"
            type="date"
            value={values.dateOfCommencement || ''}
            onChange={(e) => handleFieldChange('dateOfCommencement', e.target.value)}
            onBlur={handleBlur}
            InputLabelProps={{ shrink: true }}
            error={touched.dateOfCommencement && Boolean(errors.dateOfCommencement)}
            helperText={touched.dateOfCommencement && errors.dateOfCommencement}
          />
        </Grid2>
      </Grid2>
      <Stack direction="row" justifyContent="flex-end" spacing={2} mt={4}>
        <Button
          variant="contained"
          onClick={() => {
            // Mark all fields as touched
            Object.keys(values).forEach((key) => {
              handleBlur({ target: { name: key } });
            });
            handleSaveBusinessIdentity(6, businessIdentityposttype);
          }}
        >
          Save
        </Button>
      </Stack>
    </Box>
  );
}

const LabourLicenceRegistration = () => {
  const [step, setStep] = React.useState(0);
  // Step 3: Review, Filing & Certificate state
  const [reviewStatus, setReviewStatus] = React.useState('in_progress');
  const [reviewComment, setReviewComment] = React.useState('');
  const [filingStatus, setFilingStatus] = React.useState('in_progress');
  const [certificateUploaded, setCertificateUploaded] = React.useState(false);
  const [verticalStep, setVerticalStep] = React.useState(0);
  // Declaration checkbox
  const [declared, setDeclared] = React.useState(false);
  // Additional place of business
  const [hasAdditionalPlace, setHasAdditionalPlace] = React.useState(false);
  const [businessIdentityposttype, setBusinessIdentityposttype] = useState('');

  // Stepper navigation
  const activeStep = step;
  const handleStepClick = (targetStep) => {
    if (targetStep <= step + 1) setStep(targetStep);
  };
  // Vertical stepper logic
  const reviewDone = reviewStatus === 'done';
  const reviewRequisition = reviewStatus === 'requisition';
  const filingDone = filingStatus === 'done';
  const handleProceedToFile = () => {
    setFilingStatus('in_progress');
    setVerticalStep(1);
  };
  const handleUploadCertificate = () => {
    setCertificateUploaded(true);
    setVerticalStep(2);
  };

  // Formik for the entire first step
  const formik = useFormik({
    initialValues: {
      // Business Identity & Structure
      classificationOfEstablishment: '',
      categoryOfEstablishment: '',
      legalNameOfBusiness: '',
      natureOfBusiness: '',
      panOfBusiness: null,
      dateOfCommencement: '',

      // Additional fields for other sections
      typeOfBusiness: '',
      legalName: '',
      panFile: null,
      mobile: '',
      email: '',
      businessName: '',
      legalUse: '',
      pan: '',
      numEmployees: '',
      flat: '',
      premise: '',
      road: '',
      village: '',
      city: '',
      district: '',
      state: '',
      pin: '',
      tradeDesc: '',
      tradeType: '',
      tradeZone: '',
      tradeSubType: '',
      bestCity: '',
      applicantName: '',
      designation: '',
      aadhaarFile: null,
      applicantPANFile: null,
      photoFile: null,
      applicantMobile: '',
      applicantEmail: '',
      sameAsAadhaar: true,
      applicantAddress: '',
      promoters: [
        {
          name: '',
          aadhaarFile: null,
          panFile: null,
          photoFile: null,
          mobile: '',
          email: '',
          sameAsAadhaar: true,
          address: ''
        }
      ],
      businessPremises: [
        {
          addressLine1: '',
          addressLine2: '',
          city: '',
          district: '',
          state: '',
          pincode: '',
          natureOfPossession: '',
          rentAgreement: null,
          electricityBill: null,
          propertyTax: null,
          nameBoardPhoto: null
        }
      ]
    },
    validationSchema: businessIdentitySchema,
    onSubmit: (values) => {
      setStep(1);
    }
  });
  const getBusinessIdentity = async () => {
    const url = `/labourlicense/business-identity/by-request-or-task?service_request_id=24`;
    const { res } = await Factory('get', url);
    console.log(res);
    if (res.status_cd === 0) {
      // Map API response to form fields
      const responseData = {
        // Business Identity & Structure
        classificationOfEstablishment: res.data.classification_of_establishment || '',
        categoryOfEstablishment: res.data.category_of_establishment || '',
        legalNameOfBusiness: res.data.legal_name_of_business || '',
        natureOfBusiness: res.data.nature_of_business || '',
        panOfBusiness: res.data.business_pan || '',

        dateOfCommencement: res.data.date_of_commencement || '',

        // Keep other fields with their initial values
        typeOfBusiness: '',
        legalName: '',
        panFile: null,
        mobile: '',
        email: '',
        businessName: '',
        legalUse: '',
        pan: '',
        numEmployees: '',
        flat: '',
        premise: '',
        road: '',
        village: '',
        city: '',
        district: '',
        state: '',
        pin: '',
        tradeDesc: '',
        tradeType: '',
        tradeZone: '',
        tradeSubType: '',
        bestCity: '',
        applicantName: '',
        designation: '',
        aadhaarFile: null,
        applicantPANFile: null,
        photoFile: null,
        applicantMobile: '',
        applicantEmail: '',
        sameAsAadhaar: true,
        applicantAddress: '',
        promoters: [
          {
            name: '',
            aadhaarFile: null,
            panFile: null,
            photoFile: null,
            mobile: '',
            email: '',
            sameAsAadhaar: true,
            address: ''
          }
        ],
        businessPremises: res.data.businessPremises || [
          {
            addressLine1: '',
            addressLine2: '',
            city: '',
            district: '',
            state: '',
            pincode: '',
            natureOfPossession: '',
            rentAgreement: null,
            electricityBill: null,
            propertyTax: null,
            nameBoardPhoto: null
          }
        ]
      };
      formik.setValues(responseData);
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
  return (
    <Card sx={{ minHeight: '100vh', p: { xs: 1, md: 4 } }}>
      <Typography variant="h3" mb={1}>
        Labour Licence Registration
      </Typography>
      <Typography variant="caption" color="text.secondary">
        Register your business for a Labour Licence as required by your local municipal authority.
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Paper elevation={0} sx={{ bgcolor: '#eef2f6', p: { xs: 2, sm: 4 }, borderRadius: 3, minHeight: 700 }}>
          {/* Stepper */}
          <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', mb: 4 }}>
            {steps.map((stepObj, idx) => (
              <React.Fragment key={stepObj.label}>
                <Box
                  sx={{
                    width: stepObj.width,
                    px: 1,
                    py: 1.2,
                    bgcolor: idx === activeStep ? 'primary.main' : '#fff',
                    color: idx === activeStep ? '#fff' : 'text.secondary',
                    border: idx === activeStep ? 'none' : '1.5px solid #697586',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 14,
                    textAlign: 'center',
                    transition: 'all 0.2s',
                    display: 'inline-block',
                    lineHeight: 1.5,
                    cursor: 'pointer'
                  }}
                  onClick={() => handleStepClick(idx)}
                >
                  {stepObj.label}
                </Box>
                {idx < steps.length - 1 && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      bgcolor: '#e0e3e8',
                      minWidth: 24
                    }}
                  />
                )}
              </React.Fragment>
            ))}
          </Box>

          {/* Step 1: Applicant & Business Details */}
          {step === 0 && (
            <StepOne
              values={formik.values}
              errors={formik.errors}
              touched={formik.touched}
              handleChange={formik.handleChange}
              setFieldValue={formik.setFieldValue}
              handleBlur={formik.handleBlur}
              setErrors={formik.setErrors}
              getBusinessIdentity={getBusinessIdentity}
              businessIdentityposttype={businessIdentityposttype}
            />
          )}

          {/* Step 2: Documents & Declaration */}
          {step === 1 && (
            <form autoComplete="off">
              {/* Task 2: Business Registration Documents */}
              <Box mb={3}>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  Business Registration Documents
                </Typography>
                <Grid2 container spacing={2} alignItems="center">
                  {/* 1. Incorporation certificate / Partnership deed */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>Incorporation certificate / Partnership deed</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="incorporationCertificate"
                      value={formik.values.incorporationCertificate ? formik.values.incorporationCertificate.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('incorporationCertificateInput').click()}
                    />
                    <input
                      id="incorporationCertificateInput"
                      type="file"
                      hidden
                      name="incorporationCertificate"
                      onChange={(e) => formik.setFieldValue('incorporationCertificate', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* 2. Letter of Authorisation / Board resolution */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>Letter of Authorisation / Board resolution</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="authorisationLetter"
                      value={formik.values.authorisationLetter ? formik.values.authorisationLetter.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('authorisationLetterInput').click()}
                    />
                    <input
                      id="authorisationLetterInput"
                      type="file"
                      hidden
                      name="authorisationLetter"
                      onChange={(e) => formik.setFieldValue('authorisationLetter', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* 3. Local language name board photo of business */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>Local language name board photo of business</Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="nameBoardPhoto"
                      value={formik.values.nameBoardPhoto ? formik.values.nameBoardPhoto.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('nameBoardPhotoInput').click()}
                    />
                    <input
                      id="nameBoardPhotoInput"
                      type="file"
                      hidden
                      name="nameBoardPhoto"
                      onChange={(e) => formik.setFieldValue('nameBoardPhoto', e.currentTarget.files[0])}
                    />
                  </Grid2>
                  {/* 4. Memorandum of Articles (MOA) */}
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <Typography>
                      Memorandum of Articles (MOA) <span style={{ fontSize: 12, color: '#888' }}>(in case of companies)</span>
                    </Typography>
                  </Grid2>
                  <Grid2 size={{ sm: 6, md: 6 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label=""
                      name="moa"
                      value={formik.values.moa ? formik.values.moa.name : ''}
                      placeholder="Upload"
                      InputProps={{ readOnly: true }}
                      onClick={() => document.getElementById('moaInput').click()}
                    />
                    <input
                      id="moaInput"
                      type="file"
                      hidden
                      name="moa"
                      onChange={(e) => formik.setFieldValue('moa', e.currentTarget.files[0])}
                    />
                  </Grid2>
                </Grid2>
              </Box>
              <Box display="flex" justifyContent="flex-end" mt={4}>
                <Button size="medium" variant="contained" startIcon={<IconSave />} color="primary" onClick={() => setStep(2)}>
                  Save & Continue
                </Button>
              </Box>
            </form>
          )}

          {/* Step 3: Review, Filing & Certificate */}
          {step === 2 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 10 }}>
              <form autoComplete="off">
                <Typography variant="h4" mb={3}>
                  Review, Filing & Certificate
                </Typography>
                <Stepper orientation="vertical" activeStep={verticalStep} sx={{ background: 'transparent' }}>
                  {/* Step 1: Review */}
                  <Step>
                    <StepLabel>Review</StepLabel>
                    <StepContent>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Review"
                        name="reviewStatus"
                        value={formik.values.reviewStatus || ''}
                        onChange={formik.handleChange}
                        sx={{ mr: 2, mb: 2 }}
                      >
                        <MenuItem value="in_progress">In progress</MenuItem>
                        <MenuItem value="re_submission">Re-submission</MenuItem>
                        <MenuItem value="done">Done</MenuItem>
                      </TextField>
                      <Button variant="contained" size="small" color="primary" onClick={() => setVerticalStep(1)} sx={{ mt: 1 }}>
                        Next
                      </Button>
                    </StepContent>
                  </Step>
                  {/* Step 2: Filing */}
                  <Step>
                    <StepLabel>Filing</StepLabel>
                    <StepContent>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Filing"
                        name="filingStatus"
                        value={formik.values.filingStatus || ''}
                        onChange={formik.handleChange}
                        sx={{ mr: 2, mb: 2 }}
                      >
                        <MenuItem value="in_progress">In progress</MenuItem>
                        <MenuItem value="resubmission">Resubmission</MenuItem>
                        <MenuItem value="filed">Filed</MenuItem>
                      </TextField>
                      <Button variant="contained" size="small" color="primary" onClick={() => setVerticalStep(2)} sx={{ mt: 1 }}>
                        Next
                      </Button>
                    </StepContent>
                  </Step>
                  {/* Step 3: Approval */}
                  <Step>
                    <StepLabel>Approval</StepLabel>
                    <StepContent>
                      <TextField
                        select
                        fullWidth
                        size="small"
                        label="Approval"
                        name="approvalStatus"
                        value={formik.values.approvalStatus || ''}
                        onChange={formik.handleChange}
                        sx={{ mr: 2, mb: 2 }}
                      >
                        <MenuItem value="pending">Pending</MenuItem>
                        <MenuItem value="resubmission">Resubmission</MenuItem>
                        <MenuItem value="reject">Reject</MenuItem>
                        <MenuItem value="approval">Approval</MenuItem>
                      </TextField>
                      <Button variant="contained" size="small" color="primary" onClick={() => setVerticalStep(3)} sx={{ mt: 1 }}>
                        Next
                      </Button>
                    </StepContent>
                  </Step>
                  {/* Step 4: Certificate */}
                  <Step>
                    <StepLabel>Certificate</StepLabel>
                    <StepContent>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        disabled={formik.values.approvalStatus !== 'approval'}
                        sx={{ mt: 2, mb: 2 }}
                      >
                        Download
                      </Button>
                    </StepContent>
                  </Step>
                </Stepper>
              </form>
            </Box>
          )}
        </Paper>
      </Box>
    </Card>
  );
};

export default LabourLicenceRegistration;
