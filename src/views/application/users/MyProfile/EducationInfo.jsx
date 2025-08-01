import React, { useEffect, useState } from 'react';
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSelector } from 'react-redux';
import MainCard from 'ui-component/cards/MainCard';
import Factory from 'utils/Factory';

const StepTwo = ({ step, setStep }) => {
  // const user = useSelector((state) => state.accountReducer.user);
  // const employeeEducation = user?.employee?.education_details?.[0] || {};
  const user = useSelector((state) => state.accountReducer.user);
    const profileId = user?.employee?.education_details?.id;
  
    const [AddressInfo, setAddressInfo] = useState({});
    const [isLoading, setIsLoading] = useState(true);
  

  const [saveIndex, setSaveIndex] = useState(null);

  const formik = useFormik({
    initialValues: {
      education: [
        {
          qualification: '',
          year_of_passing: '',
          certificate: null
        }
      ]
    },
    validationSchema: Yup.object({
      education: Yup.array().of(
        Yup.object({
          qualification: Yup.string().required('Qualification is required'),
          year_of_passing: Yup.string().required('Year of Passing is required'),
          certificate: Yup.mixed().required('Certificate is required')
        })
      )
    }),
    onSubmit: () => {}
  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

const getEducationInfo = async () => {
  const url = `/payroll/employee-profile/`;

  try {
    const { res } = await Factory('get', url);
    if (res?.status_cd === 0 && res?.data?.education_details?.length > 0) {
      const data = res.data.education_details;

      const formatted = data.map((item) => ({
        qualification: item?.qualification || '',
        year_of_passing: item?.year_of_passing?.toString() || '',
        certificate: item?.upload_certificate || null
      }));

      formik.setFieldValue('education', formatted);
    }
  } catch (error) {
    console.error('Error fetching education info:', error);
  }
};
useEffect(() => {
  getEducationInfo();
}, []);

  const addPromoter = () => {
    setFieldValue('education', [
      ...values.education,
      { qualification: '', year_of_passing: '', certificate: null }
    ]);
  };

  const removePromoter = () => {
    if (values.education.length > 1) {
      setFieldValue('education', values.education.slice(0, -1));
    }
  };

  const handleIndividualDelete = (index) => {
    const updated = [...values.education];
    updated.splice(index, 1);
    setFieldValue('education', updated);
  };

  const getLabelWithAsterisk = (label, isRequired = true) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </span>
  );

  return (

       <MainCard> 
            <form onSubmit={formik.handleSubmit}>
       

        <Box display="flex" alignItems="center" mb={2}>
          <Typography>No. of Entries</Typography>
          <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={removePromoter}>
            -
          </Button>
          <Typography variant="h5" mx={2}>{values.education.length}</Typography>
          <Button variant="outlined" size="small" onClick={addPromoter}>
            +
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                {['Qualification/Degree', 'Year Of Passing', 'Upload Certificate', 'Action'].map((head) => (
                  <TableCell
                    key={head}
                    sx={{
                      color: '#fff !important',
                      textAlign: 'center',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {values.education.map((promoter, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <Autocomplete
                   sx={{width:'100%',mt:1}}
                      size="small"
                      options={['12th', 'B.Tech', 'M.Tech', 'MBA', 'Other']}
                      value={promoter.qualification || ''}
                      onChange={(e, value) => setFieldValue(`education[${idx}].qualification`, value)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={getLabelWithAsterisk('Qualification')}
                          name={`education[${idx}].qualification`}
                          onBlur={handleBlur}
                          error={touched.education?.[idx]?.qualification && Boolean(errors.education?.[idx]?.qualification)}
                          helperText={touched.education?.[idx]?.qualification && errors.education?.[idx]?.qualification}
                        />
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      
                      sx={{width:'100%',mt:1}}
                      size="small"
                      label={getLabelWithAsterisk("Year Of Passing")}
                      name={`education[${idx}].year_of_passing`}
                      value={promoter.year_of_passing}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={touched.education?.[idx]?.year_of_passing && Boolean(errors.education?.[idx]?.year_of_passing)}
                      helperText={touched.education?.[idx]?.year_of_passing && errors.education?.[idx]?.year_of_passing}
                    />
                  </TableCell>

                  <TableCell>
                    <RenderFileUpload
                      label={getLabelWithAsterisk("Upload Certificate")}
                      fieldName={`education[${idx}].certificate`}
                      file={promoter.certificate}
                      setFieldValue={setFieldValue}
                      touched={touched.education?.[idx]?.certificate}
                      errors={errors.education?.[idx]?.certificate}
                    />
                  </TableCell>

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
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleIndividualDelete(idx)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
         </form>
       </MainCard>

    
   
  );
};

export default StepTwo;
