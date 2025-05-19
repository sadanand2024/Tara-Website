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
  Grid2
} from '@mui/material';
import Factory from 'utils/Factory';

import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
const InvoiceNumberFormat = ({ businessDetails, handleBack }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedGSTIN, setSelectedGSTIN] = useState(null);
  const [postType, setPostType] = useState('');

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

  const gstins = [
    { gstin: '37ABCDE1234F1Z5', format: 'INV-HYD-25-26-0001' },
    { gstin: '29ABCDE1234F1Z6', format: 'INV-BNG-25-26-0001' }
  ];
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
          setSelectedGSTIN(null); // 🧼 clear selected GSTIN
        } else if (field === 'separateFormatForEachGST' && checked) {
          setFormatOptions((prev) => ({
            ...prev,
            sameFormatForAllGST: false,
            separateFormatForEachGST: true
          }));
        } else {
          setFormatOptions((prev) => ({ ...prev, [field]: checked }));
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
    if (formatOptions.useFY) parts.push('25-26'); // Simulated FY from invoice date
    // if (formatOptions.useSeriesCode) parts.push('A'); // Placeholder
    if (formatOptions.useRunningNumber && formValues.startingNumber) parts.push(formValues.startingNumber.padStart(4, '0'));

    return parts.join('-');
  };
  const handleEdit = (gstin) => {
    setSelectedGSTIN(gstin);

    const formatToEdit = businessDetails.invoice_format.find((f) => f.gstin === gstin);

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
      running_number_start: formValues.startingNumber,
      reset_every_fy: configOptions.resetEveryFY,
      maintain_sequence_per_branch: configOptions.separateSequencePerBranch,
      maintain_sequence_per_gstin: configOptions.separateSequencePerGSTIN
    };

    if (formatOptions.sameFormatForAllGST) {
      postData.is_common_format = true;
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
    if (businessDetails.invoice_format.length === 0) {
      setPostType('post');
    } else {
      setPostType('put');
    }

    if (businessDetails?.invoice_format?.length) {
      const formats = businessDetails.invoice_format;

      if (formats.length > 1) {
        // More than one format = separate formats per GST
        setFormatOptions((prev) => ({
          ...prev,
          sameFormatForAllGST: false,
          separateFormatForEachGST: true
        }));
        setSelectedRecord(formats[0]);

        // Optionally store or set these formats for editing
        // setGSTINFormats(formats); (only if needed)
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
        setSelectedRecord(format);
      }
    }
  }, [businessDetails]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Invoice Number Format Configuration
      </Typography>

      <FormControlLabel
        control={<Checkbox checked={formatOptions.sameFormatForAllGST} onChange={handleChange('sameFormatForAllGST')} />}
        label="Follow same format across all GST numbers"
      />
      <FormControlLabel
        control={<Checkbox checked={formatOptions.separateFormatForEachGST} onChange={handleChange('separateFormatForEachGST')} />}
        label="Create Seperate format for each GST number"
      />

      <Divider sx={{ my: 2 }} />
      {(formatOptions.sameFormatForAllGST || selectedGSTIN) && (
        <>
          <Typography variant="h5">
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

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Component Details</Typography>

          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 6 }}>
              <label style={{ fontSize: '15px' }}>Prefix</label>
              <TextField
                name="prefix"
                size="small"
                fullWidth
                value={formValues.prefix}
                onChange={handleInputChange}
                disabled={!formatOptions.usePrefix}
              />
            </Grid2>
          </Grid2>
          <Grid2 size={{ xs: 6 }}>
            <label style={{ fontSize: '15px' }}>Running Number starts from</label>
            <TextField
              size="small"
              name="startingNumber"
              type="number"
              fullWidth
              value={formValues.startingNumber}
              onChange={handleInputChange}
              disabled={!formatOptions.useRunningNumber}
            />
          </Grid2>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Preview</Typography>
          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 6 }}>
              <TextField size="small" fullWidth value={generatePreview()} disabled sx={{ backgroundColor: 'white' }} />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">Configurations</Typography>

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
        </>
      )}
      {formatOptions.separateFormatForEachGST && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6">GSTIN-wise Formats</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GSTIN</TableCell>
                <TableCell>Format Preview</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businessDetails.invoice_format
                .filter((f) => f.gstin !== 'NA')
                .map((format, index) => (
                  <TableRow key={index}>
                    <TableCell>{format.gstin}</TableCell>
                    <TableCell>
                      {[
                        format.prefix,
                        format.include_branch_code && 'BR',
                        format.include_financial_year && 'FY',
                        format.include_series_code && 'SC',
                        format.include_running_number && String(format.running_number_start).padStart(4, '0')
                      ]
                        .filter(Boolean)
                        .join('-')}
                    </TableCell>
                    <TableCell>
                      <Button variant="outlined" size="small" onClick={() => handleEdit(format.gstin)}>
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </>
      )}

      <Divider sx={{ my: 2 }} />
      <Button onClick={handleSave} variant="contained" color="primary" sx={{ float: 'right' }}>
        Save
      </Button>
    </Box>
  );
};

export default InvoiceNumberFormat;
