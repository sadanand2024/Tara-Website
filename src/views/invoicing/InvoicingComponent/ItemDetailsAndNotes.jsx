// File: ItemDetailsAndNotes.jsx (Updated with compact UI inside Card)

import React from 'react';
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
  Divider
} from '@mui/material';
import { IconPlus, IconTrash } from '@tabler/icons-react';
import CustomInput from 'utils/CustomInput';
import CustomAutocomplete from 'utils/CustomAutocomplete';

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
  openBulkItemsModal,
  handleShippingAmountChange,
  handleApplyTaxChange,
  handleGSTRateChange,
  gstRates
}) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Item Details
      </Typography>

      <TableContainer
        component={Paper}
        sx={{
          width: '100%',
          borderRadius: 2,
          boxShadow: 1,
          overflowX: 'auto'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.100' }}>
              <TableCell>Item</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Discount type</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Tax %</TableCell>
              <TableCell>Tax Amount</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {formik.values.item_details.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <CustomAutocomplete
                    size="small"
                    options={itemsList.map((item) => item.name)}
                    value={item.item || ''}
                    onChange={(e, val) => handleItemChange(index, val)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </TableCell>

                <TableCell>
                  <CustomInput value={item.quantity} onChange={(e) => handleQuantityChange(index, e.target.value)} />
                </TableCell>

                <TableCell>
                  <CustomInput value={item.rate} onChange={(e) => handleRateChange(index, e.target.value)} />
                </TableCell>

                <TableCell>
                  <CustomAutocomplete
                    options={['%', '₹']}
                    value={item.discount_type || ''}
                    onChange={(e, val) => handleDiscountTypeChange(index, val)}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </TableCell>

                <TableCell>
                  <CustomInput value={item.discount} onChange={(e) => handleDiscountChange(index, e.target.value)} />
                </TableCell>

                <TableCell>{item.amount.toFixed(2)}</TableCell>
                <TableCell>{item.tax}</TableCell>
                <TableCell>{item.taxamount.toFixed(2)}</TableCell>
                <TableCell>{item.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <ListItemButton sx={{ color: '#d32f2f' }} onClick={() => handleDeleteItem(index)}>
                    <ListItemIcon>
                      <IconTrash size={16} style={{ color: '#d32f2f' }} />
                    </ListItemIcon>
                  </ListItemButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" startIcon={<IconPlus />} onClick={handleAddItemRow}>
          Add New Row
        </Button>
        <Button variant="contained" startIcon={<IconPlus />} onClick={openBulkItemsModal}>
          Add Items in Bulk
        </Button>
      </Box>

      <Card sx={{ mt: 4, borderRadius: 2, boxShadow: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 4, flexWrap: 'wrap' }}>
            {/* Left: Notes and Terms */}
            <Box sx={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography gutterBottom>Customer Notes</Typography>
                <CustomInput
                  multiline
                  minRows={3}
                  maxRows={5}
                  name="notes"
                  value={formik.values.notes}
                  onChange={(e) => formik.setFieldValue('notes', e.target.value)}
                />
              </Box>

              <Box>
                <Typography gutterBottom>Terms & Conditions</Typography>
                <CustomInput
                  multiline
                  minRows={3}
                  maxRows={5}
                  name="terms_and_conditions"
                  value={formik.values.terms_and_conditions}
                  onChange={(e) => formik.setFieldValue('terms_and_conditions', e.target.value)}
                />
              </Box>
            </Box>

            {/* Right: Totals */}
            <Box sx={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Sub Total:</Typography>
                <Typography variant="body1">{formik.values.subtotal_amount.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1" sx={{ minWidth: 110 }}>
                  Shipping Charges:
                </Typography>
                <CustomInput
                  name="shipping_amount"
                  value={formik.values.shipping_amount}
                  onChange={handleShippingAmountChange}
                  sx={{ maxWidth: 100 }}
                />
              </Box>

              <FormControlLabel
                control={<Checkbox checked={formik.values.applied_tax} onChange={handleApplyTaxChange} />}
                label="Apply Tax on Shipping"
              />

              {formik.values.applied_tax && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <InputLabel>GST Rate</InputLabel>
                    <Select value={formik.values.selected_gst_rate} onChange={handleGSTRateChange} sx={{ minWidth: 100 }}>
                      {gstRates.map((rate) => (
                        <MenuItem key={rate} value={rate}>
                          {rate}%
                        </MenuItem>
                      ))}
                    </Select>
                  </Box>
                  <Typography variant="body2">Shipping (With Tax): {formik.values.shipping_amount_with_tax.toFixed(2)}</Typography>
                </>
              )}

              {formik.values.total_cgst_amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>CGST:</Typography>
                  <Typography>{formik.values.total_cgst_amount.toFixed(2)}</Typography>
                </Box>
              )}
              {formik.values.total_sgst_amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>SGST:</Typography>
                  <Typography>{formik.values.total_sgst_amount.toFixed(2)}</Typography>
                </Box>
              )}
              {formik.values.total_igst_amount > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>IGST:</Typography>
                  <Typography>{formik.values.total_igst_amount.toFixed(2)}</Typography>
                </Box>
              )}
              {formik.values.applied_tax && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tax on Shipping:</Typography>
                  <Typography>{formik.values.shipping_tax.toFixed(2)}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Total:
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {formik.values.total_amount.toFixed(2)}
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
