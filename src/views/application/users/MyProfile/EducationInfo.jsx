import {
  Autocomplete,
  Box,
  Button,
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
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import MainCard from 'ui-component/cards/MainCard';
import RenderFileUpload from 'ui-component/extended/RenderFileUpload';
import Factory from 'utils/Factory';
import * as Yup from 'yup';

const rowSchema = Yup.object({
  qualification: Yup.string().required('Qualification is required'),
  year_of_passing: Yup.string().required('Year of Passing is required'),

upload_certificate: Yup.mixed().nullable() // optional to allow saving without file
});

const StepTwo = ({ step, setStep }) => {
  const user = useSelector((state) => state.accountReducer.user);

  const [isLoading, setIsLoading] = useState(true);
  const [employeeId, setEmployeeId] = useState(null);

  const [saveIndex, setSaveIndex] = useState(null);
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      education: [
        {
          id: undefined,
          qualification: '',
          year_of_passing: '',
          upload_certificate: null
        }
      ]
    },
    validationSchema: Yup.object({
      // Keep overall validation lenient; per-row Save will validate clicked row
      education: Yup.array().of(
        Yup.object({
          qualification: Yup.string().nullable(),
          year_of_passing: Yup.string().nullable(),
          upload_certificate: Yup.mixed().nullable()
        })
      )
    }),

    onSubmit: async () => {
      // Unused now; we validate and save per-row in saveRow()
    }

  });

  const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

  const getEducationInfo = async () => {
    const url = `/payroll/employee-profile/`;

    try {
      const { res } = await Factory('get', url);

      if (res?.status_cd === 0) {
        if (typeof res?.data?.id !== 'undefined' && res.data.id !== null) {
          setEmployeeId(res.data.id);
        }
        if (res?.data?.education_details?.length > 0) {
          const data = res.data.education_details;

          const formatted = data.map((item) => ({
            id: item?.id,
            qualification: item?.qualification || '',
            year_of_passing: item?.year_of_passing?.toString() || '',
            upload_certificate: item?.upload_certificate || null
          }));

          formik.setFieldValue('education', formatted);
        }
      }
    } catch (error) {
      console.error('Error fetching education info:', error);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to fetch education info',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    getEducationInfo();
  }, []);

  const addPromoter = () => {
    setFieldValue('education', [
      ...values.education,
      { id: undefined, qualification: '', year_of_passing: '',upload_certificate: null }
    ]);
  };

  const removePromoter = () => {
    if (values.education.length > 1) {
      setFieldValue('education', values.education.slice(0, -1));
    }
  };

  const handleIndividualDelete = async (index) => {
    const item = values.education[index];
    if (!item) return;
    try {
      if (item.id) {
        const url = `/payroll/employee-education/${item.id}/`;
        const { res } = await Factory('delete', url);
        if (res?.status_cd === 0) {
          dispatch(
            openSnackbar({
              open: true,
              message: 'Education deleted successfully',
              variant: 'alert',
              alert: { color: 'success' },
              close: false
            })
          );
          await getEducationInfo();
          return;
        } else {
          console.error('Education delete failed', res);
          dispatch(
            openSnackbar({
              open: true,
              message: 'Failed to delete education',
              variant: 'alert',
              alert: { color: 'error' },
              close: false
            })
          );
        }
      }
    } catch (e) {
      console.error('Education delete error', e);
      dispatch(
        openSnackbar({
          open: true,
          message: 'Failed to delete education',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
    // Fallback: remove locally if no id or delete failed
    const updated = [...values.education];
    updated.splice(index, 1);
    setFieldValue('education', updated);
  };

  const saveRow = async (idx) => {
    const item = values.education[idx];
    if (!item) return;
    try {
      // Validate only this row
      await rowSchema.validate(item, { abortEarly: false });

      const hasId = !!item.id;
      const url = hasId ? `/payroll/employee-education/${item.id}/` : `/payroll/employee-education/`;

      const formData = new FormData();
      if (!hasId && employeeId) {
        formData.append('employee', String(employeeId));
      }
      formData.append('qualification', item.qualification || '');
      formData.append('year_of_passing', item.year_of_passing || '');
      if (item.upload_certificate && typeof item.upload_certificate !== 'string') {
        formData.append('upload_certificate', item.upload_certificate);
      }

      const { res } = await Factory(hasId ? 'put' : 'post', url, formData);
      if (res?.status_cd === 0) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Education saved successfully',
            variant: 'alert',
            alert: { color: 'success' },
            close: false
          })
        );
        await getEducationInfo();
      } else {
        console.error('Education save failed', res);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to save education',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    } catch (e) {
      if (e?.inner?.length) {
        // Map per-field errors to Formik touched/errors for this row
        e.inner.forEach((err) => {
          const path = `education[${idx}].${err.path}`;
          formik.setFieldError(path, err.message);
          formik.setFieldTouched(path, true, false);
        });
      } else {
        console.error('Education save error', e);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Failed to save education',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
      }
    }
  };

  const getLabelWithAsterisk = (label, isRequired = true) => (
    <span>
      {label}
      {isRequired && <span style={{ color: 'red' }}> *</span>}
    </span>
  );

  return (
    <MainCard>

      <form onSubmit={(e) => e.preventDefault()}>

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
                      label={getLabelWithAsterisk("Upload Certificate", false)}
                      fieldName={`education[${idx}].upload_certificate`}
                      file={promoter.upload_certificate}
                      setFieldValue={setFieldValue}
                      touched={touched.education?.[idx]?.upload_certificate}
                      errors={errors.education?.[idx]?.upload_certificate}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => saveRow(idx)}
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
