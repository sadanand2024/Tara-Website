import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  Divider,
  Grid2,
  Stack,
  Link,
  TableContainer,
  Card,
  Pagination
} from '@mui/material';
import Factory from 'utils/Factory';
import UploadIcon from '@mui/icons-material/Upload';
import FileUploadBox from 'ui-component/extended/FileUploadBox';
import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const InvoiceNumberFormatComponent = ({ businessDetails, handleBack, handleNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [authorizedSignature, setAuthorizedSignature] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Add null check before accessing businessDetails.invoice_format
  const paginatedData = businessDetails?.invoice_format
    ? businessDetails.invoice_format.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)
    : [];

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const [selectedRecord, setSelectedRecord] = useState({
    id: null,
    format_version: null,
    gstin: null
  });
  const [selectedGSTIN, setSelectedGSTIN] = useState(null);
  const [postType, setPostType] = useState('');
  const [size, setSize] = useState(0);
  const [formatOptions, setFormatOptions] = useState({
    sameFormatForAllGST: true,
    usePrefix: false,
    useBranchCode: false,
    useFY: true,
    useSeriesCode: false,
    useRunningNumber: true,
    separateFormatForEachGST: false
  });

  const [configOptions, setConfigOptions] = useState({
    resetEveryFY: true,
    separateSequencePerBranch: false,
    separateSequencePerGSTIN: false
  });

  const [formValues, setFormValues] = useState({
    prefix: '',
    startingNumber: '1'
  });

  const handleChange =
    (field, isConfig = false) =>
    (event) => {
      const { checked } = event.target;

      if (isConfig) {
        setConfigOptions((prev) => ({ ...prev, [field]: checked }));
      } else {
        if (field === 'sameFormatForAllGST' && checked) {
          setFormatOptions((prev) => ({
            ...prev,
            sameFormatForAllGST: true,
            separateFormatForEachGST: false
          }));
          setFormValues({
            prefix: '',
            startingNumber: '1'
          });
          setSelectedGSTIN(null); // 🧼 clear selected GSTIN
        } else if (field === 'separateFormatForEachGST' && checked) {
          setFormatOptions((prev) => ({
            ...prev,
            sameFormatForAllGST: false,
            separateFormatForEachGST: true
          }));
          setFormValues({
            prefix: '',
            startingNumber: '1'
          });
        } else {
          setFormatOptions((prev) => ({ ...prev, [field]: checked }));
          // Clear prefix value when prefix checkbox is unchecked
          if (field === 'usePrefix' && !checked) {
            setFormValues((prev) => ({ ...prev, prefix: '' }));
          }
          if (field === 'useRunningNumber' && !checked) {
            setFormValues((prev) => ({ ...prev, startingNumber: '1' }));
          }
        }
      }
    };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const generatePreview = () => {
    const parts = [];
    if (formatOptions.usePrefix && formValues.prefix) parts.push(formValues.prefix);
    // if (formatOptions.useBranchCode) parts.push('HYD'); // Simulated branch code
    if (formatOptions.useFY) parts.push('2025-26'); // Simulated FY from invoice date
    // if (formatOptions.useSeriesCode) parts.push('A'); // Placeholder
    if (formatOptions.useRunningNumber && formValues.startingNumber) parts.push(formValues.startingNumber.padStart(4, '0'));

    return parts.join('-');
  };
  const handleEdit = (gstin) => {
    setSelectedGSTIN(gstin);

    const formatToEdit = businessDetails?.invoice_format?.find((f) => f.gstin === gstin);
    if (formatToEdit) {
      setFormatOptions((prev) => ({
        ...prev,
        sameFormatForAllGST: false,
        separateFormatForEachGST: true,
        usePrefix: !!formatToEdit.prefix,
        useBranchCode: formatToEdit.include_branch_code,
        useFY: formatToEdit.include_financial_year,
        useSeriesCode: formatToEdit.include_series_code,
        useRunningNumber: formatToEdit.include_running_number
      }));

      setConfigOptions({
        resetEveryFY: formatToEdit.reset_every_fy,
        separateSequencePerBranch: formatToEdit.maintain_sequence_per_branch,
        separateSequencePerGSTIN: formatToEdit.maintain_sequence_per_gstin
      });

      setFormValues({
        prefix: formatToEdit.prefix || '',
        startingNumber: String(formatToEdit.running_number_start || '1')
      });
      setPostType('put');
      setSelectedRecord({
        id: formatToEdit.id,
        format_version: formatToEdit.format_version,
        gstin: formatToEdit.gstin
      });
    } else {
      setFormatOptions((prev) => ({
        ...prev,
        sameFormatForAllGST: false,
        separateFormatForEachGST: true,
        usePrefix: false,
        useBranchCode: false,
        useFY: true,
        useSeriesCode: false,
        useRunningNumber: true
      }));

      setConfigOptions({
        resetEveryFY: false,
        separateSequencePerBranch: false,
        separateSequencePerGSTIN: false
      });
      setFormValues({
        prefix: '',
        startingNumber: '1'
      });
      setPostType('post');
      setSelectedRecord({
        id: null,
        format_version: null,
        gstin: null
      });
    }
  };

  const handleSave = async () => {
    const postData = {
      invoicing_profile: businessDetails.invoicing_profile_id,
      gstin: selectedGSTIN || 'NA', // Use selected GSTIN or 'NA' for common
      prefix: formValues.prefix,
      include_branch_code: formatOptions.useBranchCode,
      include_financial_year: formatOptions.useFY,
      include_series_code: formatOptions.useSeriesCode,
      include_running_number: formatOptions.useRunningNumber,
      series_code: '',
      running_number_start: Number(formValues.startingNumber),
      reset_every_fy: configOptions.resetEveryFY,
      maintain_sequence_per_branch: configOptions.separateSequencePerBranch,
      maintain_sequence_per_gstin: configOptions.separateSequencePerGSTIN
    };
    postData.format_version = postType === 'put' ? Number(selectedRecord.format_version || 1) + 1 : 1;

    if (formatOptions.sameFormatForAllGST === true) {
      postData.is_common_format = 'yes';
    } else {
      postData.is_common_format = 'no';
    }

    if (postType === 'put') {
      if (selectedRecord.id === null) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Please select a GSTIN ',
            variant: 'alert',
            alert: { color: 'error' },
            close: false
          })
        );
        return;
      }
    }
    const url = postType === 'post' ? `/invoicing/invoice-formats/` : `/invoicing/invoice-formats/${selectedRecord.id}/`;

    const { res } = await Factory(postType, url, postData);

    if (res.status_cd === 0) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Invoice format saved successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
      navigate('/app/invoice');
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res.message || 'Failed to save invoice format',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  useEffect(() => {
    if (!businessDetails) return;

    if (!businessDetails?.invoice_format || businessDetails.invoice_format.length === 0) {
      setPostType('post');
    } else {
      setPostType('put');
    }
    // Set initial signature preview if available
    if (businessDetails.signature) {
      setSignaturePreview(businessDetails.signature);
      setAuthorizedSignature(null); // No local file selected yet
    }
    if (businessDetails?.invoice_format?.length > 0) {
      const formats = businessDetails.invoice_format;
      if (formats.find((f) => f.is_common_format === 'no')) {
        setFormatOptions((prev) => ({
          ...prev,
          sameFormatForAllGST: false,
          separateFormatForEachGST: true
        }));
      } else {
        // Only one format = treat as common format
        const format = formats[0];

        setFormatOptions((prev) => ({
          ...prev,
          sameFormatForAllGST: true,
          separateFormatForEachGST: false,
          usePrefix: !!format.prefix,
          useBranchCode: format.include_branch_code,
          useFY: format.include_financial_year,
          useSeriesCode: format.include_series_code,
          useRunningNumber: format.include_running_number
        }));

        setConfigOptions({
          resetEveryFY: format.reset_every_fy,
          separateSequencePerBranch: format.maintain_sequence_per_branch,
          separateSequencePerGSTIN: format.maintain_sequence_per_gstin
        });

        setFormValues({
          prefix: format.prefix || '',
          startingNumber: String(format.running_number_start || '1')
        });
        setSelectedGSTIN(format.gstin);
        setSelectedRecord(format);
      }
    }
  }, [businessDetails]);

  const handleSignatureUpload = async (files) => {
    const file = files[0];
    if (!file) return;

    if (file.size > 10 * 1024) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'File size exceeds 10 KB limit.',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
      return;
    }

    // Prepare form data for API
    const formData = new FormData();
    formData.append('signature', file);

    // Make API call
    const url = `/invoicing/invoicing-profiles/${businessDetails.invoicing_profile_id}/update/`;
    const { res } = await Factory('put', url, formData);

    if (res.status_cd === 0) {
      setAuthorizedSignature(file);
      if (file.type.startsWith('image/')) {
        setSignaturePreview(URL.createObjectURL(file));
      } else if (file.type === 'application/pdf') {
        setSignaturePreview(null);
      }
      dispatch(
        openSnackbar({
          open: true,
          message: 'Authorized signature updated successfully',
          variant: 'alert',
          alert: { color: 'success' },
          close: false
        })
      );
    } else {
      dispatch(
        openSnackbar({
          open: true,
          message: res.message || 'Failed to update authorized signature',
          variant: 'alert',
          alert: { color: 'error' },
          close: false
        })
      );
    }
  };

  if (!businessDetails) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Invoice Number Format Configuration
      </Typography>

      <FormControlLabel
        control={
          <Checkbox
            checked={formatOptions.sameFormatForAllGST}
            onChange={handleChange('sameFormatForAllGST')}
            disabled={
              formatOptions.separateFormatForEachGST || Boolean(businessDetails.invoice_format.find((f) => f.is_common_format === 'yes'))
            }
          />
        }
        label="Follow same format across all GST numbers"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={formatOptions.separateFormatForEachGST}
            onChange={handleChange('separateFormatForEachGST')}
            disabled={formatOptions.sameFormatForAllGST || Boolean(businessDetails.invoice_format.find((f) => f.is_common_format === 'no'))}
          />
        }
        label="Create Seperate format for each GST number"
      />

      {formatOptions.separateFormatForEachGST && (
        <Box sx={{ maxWidth: '1000px' }}>
          <Typography variant="h5" sx={{ my: 2 }}>
            GSTIN-wise Formats
          </Typography>
          <Card
            elevation={2}
            sx={{
              mb: 2,
              '& .MuiTableContainer-root': {
                borderRadius: 0
              },
              '& .MuiTableCell-root': {
                color: 'text.primary'
              },
              '& .MuiTableHead-root .MuiTableCell-root': {
                py: 1,
                backgroundColor: 'primary.main',
                color: '#fff'
              }
            }}
          >
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">S.No</TableCell>
                    <TableCell align="center">GSTIN</TableCell>
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((gst, index) => (
                    <TableRow key={gst.gstin}>
                      <TableCell align="center"> {rowsPerPage * (currentPage - 1) + index + 1}</TableCell>
                      <TableCell align="center">{gst.gstin}</TableCell>

                      <TableCell align="center">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => {
                            handleEdit(gst.gstin);
                          }}
                        >
                          View/Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
          <Stack direction="row" justifyContent="center" sx={{ py: 2 }}>
            <Pagination
              count={Math.ceil((businessDetails?.invoice_format?.length || 0) / rowsPerPage)}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </Stack>
        </Box>
      )}
      {(formatOptions.sameFormatForAllGST || selectedGSTIN) && (
        <>
          <Typography variant="h5" sx={{ my: 2 }}>
            {formatOptions.sameFormatForAllGST
              ? 'Invoice Format Components (Common for all GSTs)'
              : `Editing Format for GSTIN: ${selectedGSTIN}`}
          </Typography>

          <Box>
            <FormControlLabel
              control={<Checkbox checked={formatOptions.usePrefix} onChange={handleChange('usePrefix')} />}
              label="Prefix"
            />
            <FormControlLabel
              control={<Checkbox checked={formatOptions.useBranchCode} onChange={handleChange('useBranchCode')} />}
              label="Branch Code"
            />
            <FormControlLabel
              control={<Checkbox checked={formatOptions.useFY} onChange={handleChange('useFY')} />}
              label="Financial Year"
            />
            <FormControlLabel
              control={<Checkbox checked={formatOptions.useRunningNumber} onChange={handleChange('useRunningNumber')} />}
              label="Running Number"
            />
          </Box>

          <Box sx={{ my: 4 }}>
            <Typography variant="h5">Component Details</Typography>
            <Grid2 container spacing={2} my={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <label style={{ fontSize: '15px' }}>Prefix</label>
                <TextField
                  name="prefix"
                  size="small"
                  fullWidth
                  value={formValues.prefix}
                  onChange={handleInputChange}
                  disabled={!formatOptions.usePrefix}
                  sx={{ mt: 1 }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <label style={{ fontSize: '15px' }}>Running Number starts from</label>
                <TextField
                  size="small"
                  name="startingNumber"
                  type="number"
                  fullWidth
                  value={formValues.startingNumber}
                  onChange={handleInputChange}
                  disabled={!formatOptions.useRunningNumber}
                  sx={{ mt: 1 }}
                />
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <label style={{ fontSize: '15px' }}>
                  Preview <span style={{ color: 'text.textSecondary' }}> Ex : (INV-BR-2024-25-A-0001) </span>
                </label>

                <TextField size="small" fullWidth value={generatePreview()} disabled sx={{ backgroundColor: 'white', mt: 1 }} />
              </Grid2>
            </Grid2>
          </Box>

          <Box sx={{ my: 4 }}>
            <Typography variant="h5">Configurations</Typography>

            <FormControlLabel
              control={<Checkbox checked={configOptions.resetEveryFY} onChange={handleChange('resetEveryFY', true)} />}
              label="Reset every financial year"
            />
            <FormControlLabel
              control={
                <Checkbox checked={configOptions.separateSequencePerBranch} onChange={handleChange('separateSequencePerBranch', true)} />
              }
              label="Maintain separate sequence per branch"
            />
            <FormControlLabel
              control={
                <Checkbox checked={configOptions.separateSequencePerGSTIN} onChange={handleChange('separateSequencePerGSTIN', true)} />
              }
              label="Maintain separate sequence per GSTIN"
            />
          </Box>
        </>
      )}

      <Typography variant="h5">Authorized Signature</Typography>
      <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
        <FileUploadBox onFiles={handleSignatureUpload} accept="image/*,application/pdf" size="10 KB" />
        {signaturePreview &&
          (typeof signaturePreview === 'string' ? (
            <img
              style={{ width: '100px', height: '100px', borderRadius: '5%', objectFit: 'cover', border: '1px solid #ccc' }}
              src={signaturePreview}
              alt="Authorized Signature"
            />
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', height: 100 }}>
              <Typography variant="body2">{authorizedSignature?.name}</Typography>
            </Box>
          ))}
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => {
            navigate('/app/invoice');
          }}
        >
          Back to Dashboard
        </Button>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default InvoiceNumberFormatComponent;
