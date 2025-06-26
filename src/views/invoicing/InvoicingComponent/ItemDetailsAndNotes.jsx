// File: ItemDetailsAndNotes.jsx (Updated with compact UI inside Card)

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TextField,
  ListItemButton,
  ListItemIcon,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  InputLabel,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  Inventory2,
  Add as AddIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Note as NoteIcon,
  LocalShipping as ShippingIcon,
  Discount as DiscountIcon,
  Calculate as CalculateIcon
} from '@mui/icons-material';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';
import AddItem from '../InvoiceSettings/Goods&Services/AddItem';

const ItemDetailsAndNotes = ({
  formik,
  itemsList,
  handleItemChange,
  handleQuantityChange,
  handleRateChange,
  handleDiscountTypeChange,
  handleDiscountChange,
  handleDeleteItem,
  handleAddItemRow,
  handleNoteChange,
  openBulkItemsModal,
  handleShippingAmountChange,
  handleApplyTaxChange,
  handleGSTRateChange,
  gstRates,
  totalDiscount,
  businessDetailsData,
  get_Goods_and_Services_Data
}) => {
  const [openAddItem, setOpenAddItem] = useState(false);
  const [type, setType] = useState('');
  const theme = useTheme();

  const handleOpenAddItem = () => {
    setOpenAddItem(true);
  };

  const handleCloseAddItem = () => {
    setOpenAddItem(false);
    setType('');
  };

  // Prevent Enter key from submitting the form in item input fields
  const handleItemInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 2,
          p: 1.5,
          backgroundColor: alpha(theme.palette.primary.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Inventory2 sx={{ color: theme.palette.primary.main, fontSize: 24 }} />
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: theme.palette.primary.main
          }}
        >
          Item Details & Notes
        </Typography>
      </Box>

      {/* Items Table Section */}
      <Paper
        elevation={2}
        sx={{
          mb: 2,
          borderRadius: 2,
          overflow: 'hidden',
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          '& .MuiTableContainer-root': {
            borderRadius: 0
          },
          '& .MuiTableCell-root': {
            color: 'text.primary',
            borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          },
          '& .MuiTableHead-root .MuiTableCell-root': {
            py: 1.5,
            backgroundColor: 'primary.main',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem'
          },
          '& .MuiTableBody-root .MuiTableRow-root:hover': {
            backgroundColor: alpha(theme.palette.primary.main, 0.02)
          }
        }}
      >
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Item</TableCell>
                <TableCell>Note</TableCell>
                <TableCell align="center">Quantity</TableCell>
                <TableCell align="center">Rate</TableCell>
                <TableCell align="center">Discount Type</TableCell>
                <TableCell align="center">Discount</TableCell>
                <TableCell align="right">Amount</TableCell>
                <TableCell align="center">Tax %</TableCell>
                <TableCell align="right">Tax Amount</TableCell>
                <TableCell align="right">Total Amount</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formik.values.item_details.map((item, index) => (
                <TableRow key={index} sx={{ '&:last-child td': { border: 0 } }}>
                  <TableCell>
                    <CustomAutocomplete
                      size="small"
                      options={itemsList.map((item) => item.name)}
                      value={item.item || ''}
                      onChange={(e, val) => {
                        // Prevent setting the value if "Add New Item" is clicked
                        if (val === null) return;
                        handleItemChange(index, val);
                      }}
                      onKeyDown={handleItemInputKeyDown}
                      renderInput={(params) => <TextField {...params} sx={{ minWidth: 200, maxWidth: 200 }} />}
                      renderOption={(props, option) => (
                        <li {...props} key={option}>
                          {option}
                        </li>
                      )}
                      noOptionsText={
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                            No Results found
                          </Typography>
                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            sx={{
                              bgcolor: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.dark'
                              }
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenAddItem();
                            }}
                            startIcon={<IconPlus size={18} />}
                          >
                            Add New Item
                          </Button>
                        </Box>
                      }
                      ListboxProps={{
                        style: { maxHeight: 250 },
                        component: React.forwardRef(function CustomListboxComponent(props, ref) {
                          const { children, ...rest } = props;
                          return (
                            <ul ref={ref} {...rest}>
                              {children}
                              {children && children.length > 0 && (
                                <li style={{ padding: '8px 16px' }}>
                                  <Button
                                    variant="contained"
                                    fullWidth
                                    size="small"
                                    sx={{
                                      bgcolor: 'primary.main',
                                      '&:hover': {
                                        bgcolor: 'primary.dark'
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenAddItem();
                                    }}
                                    startIcon={<IconPlus size={18} />}
                                  >
                                    Add New Item
                                  </Button>
                                </li>
                              )}
                            </ul>
                          );
                        })
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <CustomInput
                      value={item.note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      sx={{ minWidth: 100, maxWidth: 100 }}
                      onKeyDown={handleItemInputKeyDown}
                      multiline={true}
                      minRows={1}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <CustomInput
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(index, e.target.value)}
                      sx={{ minWidth: 80, maxWidth: 80 }}
                      onKeyDown={handleItemInputKeyDown}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <CustomInput
                      value={item.rate}
                      onChange={(e) => handleRateChange(index, e.target.value)}
                      sx={{ minWidth: 120, maxWidth: 120 }}
                      onKeyDown={handleItemInputKeyDown}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <CustomAutocomplete
                      options={['%', '₹']}
                      value={item.discount_type || ''}
                      onChange={(e, val) => handleDiscountTypeChange(index, val)}
                      onKeyDown={handleItemInputKeyDown}
                      renderInput={(params) => <TextField {...params} sx={{ minWidth: 80, maxWidth: 80 }} />}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <CustomInput
                      value={item.discount}
                      onChange={(e) => handleDiscountChange(index, e.target.value)}
                      sx={{ minWidth: 80, maxWidth: 80 }}
                      onKeyDown={handleItemInputKeyDown}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹{item.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {/* <Chip label={`${item.tax}%`} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.75rem' }} /> */}
                    {`${item.tax}%`}
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ₹{item.taxamount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                      ₹{item.total_amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Delete Item">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteItem(index)}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1)
                          }
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Action Buttons */}
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          gap: 2,
          justifyContent: 'flex-start',
          flexWrap: 'wrap'
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddItemRow}
          sx={{
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark
            },
            borderRadius: 2,
            px: 3
          }}
        >
          Add New Row
        </Button>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={openBulkItemsModal}
          sx={{
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
            '&:hover': {
              borderColor: theme.palette.secondary.dark,
              bgcolor: alpha(theme.palette.secondary.main, 0.1)
            },
            borderRadius: 2,
            px: 3
          }}
        >
          Add Items in Bulk
        </Button>
      </Box>

      <AddItem
        businessDetailsData={businessDetailsData}
        open={openAddItem}
        handleOpen={handleOpenAddItem}
        handleClose={handleCloseAddItem}
        get_Goods_and_Services_Data={get_Goods_and_Services_Data}
        type={type}
        setType={setType}
        from={'itemDetails'}
      />

      {/* Notes and Totals Section */}
      <Card
        sx={{
          mt: 4,
          borderRadius: 3,
          boxShadow: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
            {/* Left: Notes and Terms */}
            <Box sx={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <NoteIcon sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Customer Notes
                  </Typography>
                </Box>
                <CustomInput
                  multiline
                  minRows={3}
                  maxRows={5}
                  name="notes"
                  value={formik.values.notes}
                  onChange={(e) => formik.setFieldValue('notes', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <ReceiptIcon sx={{ color: theme.palette.secondary.main, fontSize: 20 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Terms & Conditions
                  </Typography>
                </Box>
                <CustomInput
                  multiline
                  minRows={3}
                  maxRows={5}
                  name="terms_and_conditions"
                  value={formik.values.terms_and_conditions}
                  onChange={(e) => formik.setFieldValue('terms_and_conditions', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2
                    }
                  }}
                />
              </Box>
            </Box>

            {/* Right: Totals */}
            <Box
              sx={{
                flex: 1,
                minWidth: '300px',
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
                backgroundColor: alpha(theme.palette.background.default, 0.5),
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.divider, 0.1)}`
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <CalculateIcon sx={{ color: theme.palette.success.main, fontSize: 20 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Invoice Summary
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Sub Total:
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  ₹{formik.values.subtotal_amount.toFixed(2)}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  p: 1.5,
                  borderRadius: 2,
                  border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShippingIcon sx={{ color: theme.palette.info.main, fontSize: 18 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Shipping Charges:
                  </Typography>
                </Box>
                <CustomInput
                  name="shipping_amount"
                  value={formik.values.shipping_amount}
                  onChange={handleShippingAmountChange}
                  sx={{
                    maxWidth: 120,
                    bgcolor: 'white',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1
                    }
                  }}
                />
              </Box>

              {/* Discount Total Row */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DiscountIcon sx={{ color: theme.palette.warning.main, fontSize: 18 }} />
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    Discount Total:
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.warning.main }}>
                  ₹{typeof totalDiscount === 'number' ? totalDiscount.toFixed(2) : '0.00'}
                </Typography>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formik.values.applied_tax}
                    onChange={handleApplyTaxChange}
                    sx={{
                      '&.Mui-checked': {
                        color: theme.palette.success.main
                      }
                    }}
                  />
                }
                label="Apply Tax on Shipping"
              />

              {formik.values.applied_tax && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <InputLabel sx={{ fontSize: '0.875rem' }}>GST Rate</InputLabel>
                    <Select value={formik.values.selected_gst_rate} onChange={handleGSTRateChange} sx={{ minWidth: 100 }} size="small">
                      {gstRates.map((rate) => (
                        <MenuItem key={rate} value={rate}>
                          {rate}%
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                    Shipping (With Tax): ₹{formik.values.shipping_amount_with_tax.toFixed(2)}
                  </Typography>
                </>
              )}

              {formik.values.total_cgst_amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">CGST:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{formik.values.total_cgst_amount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              {formik.values.total_sgst_amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">SGST:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{formik.values.total_sgst_amount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              {formik.values.total_igst_amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">IGST:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{formik.values.total_igst_amount.toFixed(2)}
                  </Typography>
                </Box>
              )}
              {formik.values.applied_tax && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Tax on Shipping:</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    ₹{formik.values.shipping_tax.toFixed(2)}
                  </Typography>
                </Box>
              )}

              <Divider sx={{ my: 2 }} />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  p: 2,
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: 2,
                  border: `2px solid ${alpha(theme.palette.success.main, 0.2)}`
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  Total Amount:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                  ₹{formik.values.total_amount.toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ItemDetailsAndNotes;
