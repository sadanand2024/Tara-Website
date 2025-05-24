import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid2,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Stack,
  Tooltip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as Yup from 'yup';
const PromoterSignatorySection = ({}) => {
  const formik = useFormik({
    initialValues: {
      promoters: [
        {
          name: '',
          aadhaarFile: null,
          panFile: null,
          photoFile: null,
          address: '',
          email: '',
          mobile: '',
          sameAsAadhaar: true
        }
      ]
    },
    validationSchema: Yup.object({
      promoters: Yup.array().of(
        Yup.object({
          name: Yup.string().required('Name is required'),
          aadhaarFile: Yup.mixed().required('Aadhaar file is required'),
          panFile: Yup.mixed().required('PAN file is required'),
          photoFile: Yup.mixed().required('Photo file is required'),
          address: Yup.string().required('Address is required'),
          email: Yup.string().email('Invalid email').required('Email is required'),
          mobile: Yup.string().required('Mobile is required'),
          sameAsAadhaar: Yup.boolean().required('Same as Aadhaar is required')
        })
      )
    })
  });

  return (
    <Box mt={4}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        <span style={{ textDecoration: 'underline' }}>Promoter / Signatory Details</span>
      </Typography>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography>No. of Promoters/Directors/Managing Partners</Typography>
        <Button
          size="small"
          variant="outlined"
          sx={{ minWidth: 32, ml: 2, px: 0 }}
          onClick={() => {
            if (formik.values.promoters.length > 1) {
              formik.setFieldValue('promoters', formik.values.promoters.slice(0, -1));
            }
          }}
        >
          -
        </Button>
        <Typography mx={2}>{formik.values.promoters.length}</Typography>
        <Button
          size="small"
          variant="outlined"
          sx={{ minWidth: 32, px: 0 }}
          onClick={() => {
            if (formik.values.promoters.length < 10) {
              formik.setFieldValue('promoters', [
                ...formik.values.promoters,
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
              ]);
            }
          }}
        >
          +
        </Button>
      </Box>
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Name</TableCell>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Aadhaar</TableCell>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>PAN</TableCell>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Photo</TableCell>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Mobile</TableCell>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Email</TableCell>
              <TableCell sx={{ color: 'white !important', textAlign: 'center', p: 1.5 }}>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formik.values.promoters.map((promoter, idx) => (
              <TableRow key={idx}>
                <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    name={`promoters[${idx}].name`}
                    value={promoter.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.promoters?.[idx]?.name && Boolean(formik.errors.promoters?.[idx]?.name)}
                    helperText={
                      formik.touched.promoters?.[idx]?.name && formik.errors.promoters?.[idx]?.name
                        ? formik.errors.promoters[idx].name
                        : '\u00A0'
                    }
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Aadhaar Upload"
                    name={`promoters[${idx}].aadhaarFile`}
                    value={promoter.aadhaarFile ? promoter.aadhaarFile.name : ''}
                    placeholder="Upload Aadhaar"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById(`aadhaarFileInput${idx}`).click()}
                    error={formik.touched.promoters?.[idx]?.aadhaarFile && Boolean(formik.errors.promoters?.[idx]?.aadhaarFile)}
                    helperText={
                      formik.touched.promoters?.[idx]?.aadhaarFile && formik.errors.promoters?.[idx]?.aadhaarFile
                        ? formik.errors.promoters[idx].aadhaarFile
                        : '\u00A0'
                    }
                  />
                  <input
                    id={`aadhaarFileInput${idx}`}
                    type="file"
                    hidden
                    name={`promoters[${idx}].aadhaarFile`}
                    onChange={(e) => formik.setFieldValue(`promoters[${idx}].aadhaarFile`, e.currentTarget.files[0])}
                    onBlur={formik.handleBlur}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="PAN Upload"
                    name={`promoters[${idx}].panFile`}
                    value={promoter.panFile ? promoter.panFile.name : ''}
                    placeholder="Upload PAN"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById(`panFileInput${idx}`).click()}
                    error={formik.touched.promoters?.[idx]?.panFile && Boolean(formik.errors.promoters?.[idx]?.panFile)}
                    helperText={
                      formik.touched.promoters?.[idx]?.panFile && formik.errors.promoters?.[idx]?.panFile
                        ? formik.errors.promoters[idx].panFile
                        : '\u00A0'
                    }
                  />
                  <input
                    id={`panFileInput${idx}`}
                    type="file"
                    hidden
                    name={`promoters[${idx}].panFile`}
                    onChange={(e) => formik.setFieldValue(`promoters[${idx}].panFile`, e.currentTarget.files[0])}
                    onBlur={formik.handleBlur}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Photo Upload"
                    name={`promoters[${idx}].photoFile`}
                    value={promoter.photoFile ? promoter.photoFile.name : ''}
                    placeholder="Upload Photo"
                    InputProps={{ readOnly: true }}
                    onClick={() => document.getElementById(`photoFileInput${idx}`).click()}
                    error={formik.touched.promoters?.[idx]?.photoFile && Boolean(formik.errors.promoters?.[idx]?.photoFile)}
                    helperText={
                      formik.touched.promoters?.[idx]?.photoFile && formik.errors.promoters?.[idx]?.photoFile
                        ? formik.errors.promoters[idx].photoFile
                        : '\u00A0'
                    }
                  />
                  <input
                    id={`photoFileInput${idx}`}
                    type="file"
                    hidden
                    name={`promoters[${idx}].photoFile`}
                    onChange={(e) => formik.setFieldValue(`promoters[${idx}].photoFile`, e.currentTarget.files[0])}
                    onBlur={formik.handleBlur}
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Mobile"
                    name={`promoters[${idx}].mobile`}
                    value={promoter.mobile}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.promoters?.[idx]?.mobile && Boolean(formik.errors.promoters?.[idx]?.mobile)}
                    helperText={
                      formik.touched.promoters?.[idx]?.mobile && formik.errors.promoters?.[idx]?.mobile
                        ? formik.errors.promoters[idx].mobile
                        : '\u00A0'
                    }
                  />
                </TableCell>
                <TableCell sx={{ textAlign: 'center', p: 0.5, pt: 2 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Email"
                    name={`promoters[${idx}].email`}
                    value={promoter.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.promoters?.[idx]?.email && Boolean(formik.errors.promoters?.[idx]?.email)}
                    helperText={
                      formik.touched.promoters?.[idx]?.email && formik.errors.promoters?.[idx]?.email
                        ? formik.errors.promoters[idx].email
                        : '\u00A0'
                    }
                  />
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: 'center',
                    p: 0.5,
                    pt: 2,
                    pr: 2,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    border: 'none'
                  }}
                >
                  <Stack direction="row" alignItems="flex-start" justifyContent="center">
                    <Tooltip title="Same as per Aadhaar" arrow>
                      <Checkbox
                        sx={{ p: 0, m: 0, pt: 1 }}
                        checked={promoter.sameAsAadhaar}
                        onChange={(e) => formik.setFieldValue(`promoters[${idx}].sameAsAadhaar`, e.target.checked)}
                        name={`promoters[${idx}].sameAsAadhaar`}
                      />
                    </Tooltip>
                    {promoter.sameAsAadhaar && (
                      <Typography variant="body2" mr={1}>
                        Same as per aadhaar
                      </Typography>
                    )}
                    {!promoter.sameAsAadhaar && (
                      <TextField
                        fullWidth
                        size="small"
                        name={`promoters[${idx}].address`}
                        placeholder="Enter Residential Address"
                        value={promoter.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.promoters?.[idx]?.address && Boolean(formik.errors.promoters?.[idx]?.address)}
                        helperText={
                          formik.touched.promoters?.[idx]?.address && formik.errors.promoters?.[idx]?.address
                            ? formik.errors.promoters[idx].address
                            : '\u00A0'
                        }
                        sx={{ ml: 1 }}
                      />
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default PromoterSignatorySection;
