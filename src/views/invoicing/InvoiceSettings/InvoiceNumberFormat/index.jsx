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
  Stack
} from '@mui/material';
import Factory from 'utils/Factory';

import { useDispatch } from 'react-redux';
import { openSnackbar } from 'store/slices/snackbar';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const InvoiceNumberFormat = ({ businessDetails, handleBack, handleNext }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedRecord, setSelectedRecord] = useState({
    id: null,
    format_version: null,
    gstin: null
  });
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
      // navigate('/app/invoice');
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

    if (businessDetails?.invoice_format?.length > 0) {
      const formats = businessDetails.invoice_format;
      if (formats.find((f) => f.is_common_format === 'no')) {
        setFormatOptions((prev) => ({
          ...prev,
          sameFormatForAllGST: false,
          separateFormatForEachGST: true
        }));
        // setSelectedRecord({
        //   id: formats[0].id,
        //   format_version: formats[0].format_version,
        //   gstin: formats[0].gstin
        // });
        // setSelectedGSTIN(formats[0].gstin);
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
        // setSelectedRecord(format);
        setSelectedGSTIN(format.gstin);
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
        <>
          <Typography variant="h5">GSTIN-wise Formats</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GSTIN</TableCell>
                {/* <TableCell>Format Preview</TableCell> */}
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {businessDetails.gst_details.map((gst) => (
                <TableRow key={gst.gstin}>
                  <TableCell>{gst.gstin}</TableCell>
                  {/* <TableCell>
                    {[
                      gst.prefix,
                      gst.include_branch_code && 'BR',
                      gst.include_financial_year && '2025-26',
                      gst.include_series_code && 'SC',
                      gst.include_running_number && String(gst.running_number_start).padStart(4, '0')
                    ]
                      .filter(Boolean)
                      .join('-')}
                  </TableCell> */}
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        handleEdit(gst.gstin);
                      }}
                    >
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

          <Typography variant="h5">Component Details</Typography>

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

          <Typography variant="h5">Preview</Typography>
          <Grid2 container spacing={2} my={2}>
            <Grid2 size={{ xs: 6 }}>
              <TextField size="small" fullWidth value={generatePreview()} disabled sx={{ backgroundColor: 'white' }} />
            </Grid2>
          </Grid2>

          <Divider sx={{ my: 2 }} />
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
        </>
      )}

      <Divider sx={{ my: 2 }} />
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
        </Stack>
      </Box>
    </Box>
  );
};

export default InvoiceNumberFormat;
