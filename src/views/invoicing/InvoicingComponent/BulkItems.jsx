import React, { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Divider,
  Box,
  Typography,
  TextField,
  IconButton,
  DialogActions,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction
} from '@mui/material';
import { IconX } from '@tabler/icons-react';
import { CheckCircle, Add, Remove } from '@mui/icons-material';
import CustomInput from 'utils/CustomInput';

const BulkItems = ({ bulkItemsDialogue, setBulkItemsDialogue, itemsList, bulkItemSave }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Search input handler
  const handleSearchChange = (e) => setSearchTerm(e.target.value);

  // Add or remove items from the selected list
  const handleItemToggle = (item) => {
    setSelectedItems((prevSelectedItems) => {
      const newSelectedItems = [...prevSelectedItems];
      const itemIndex = newSelectedItems.findIndex((selectedItem) => selectedItem.name === item.name);

      if (itemIndex === -1) {
        newSelectedItems.push({ ...item, quantity: 1 }); // Initialize quantity when selecting an item
      } else {
        newSelectedItems.splice(itemIndex, 1);
      }

      return newSelectedItems;
    });
  };

  // Handle item quantity changes (increment or decrement)
  const handleQuantityChange = (itemName, delta) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedItems = [...prevSelectedItems];
      const item = updatedItems.find((item) => item.name === itemName);

      if (item) {
        item.quantity = Math.max(1, item.quantity + delta); // Ensure quantity doesn't go below 1
      }

      return updatedItems;
    });
  };
  const handleQuantityInput = (index, value) => {
    const quantity = value === '' ? '' : parseInt(value, 10);
    if (!isNaN(quantity) || value === '') {
      setSelectedItems((prevSelectedItems) => {
        const updatedItems = [...prevSelectedItems];
        updatedItems[index].quantity = quantity;
        return updatedItems;
      });
    }
  };
  // Prepare item data for saving
  useEffect(() => {
    const updatedItems = selectedItems
      .map((item) => {
        const selectedItem = itemsList.find((i) => i.name === item.name);

        if (selectedItem) {
          const gstRate = selectedItem.gst_rate ? parseFloat(selectedItem.gst_rate) : 0;
          const rate = selectedItem.selling_price || 0;
          const quantity = item.quantity;
          const taxableAmount = rate * quantity;
          const amount = taxableAmount;
          const taxAmount = (amount * gstRate) / 100;
          const totalAmount = amount + taxAmount;

          return {
            item: selectedItem.name,
            quantity,
            rate,
            discount_type: '%',
            discount: 0,
            amount,
            tax: gstRate,
            taxamount: taxAmount,
            total_amount: totalAmount,
            cgst_amount: 0,
            sgst_amount: 0,
            igst_amount: 0
          };
        }

        return null;
      })
      .filter((item) => item !== null);

    setItems(updatedItems);
  }, [selectedItems, itemsList]);

  // Filter items based on search term
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    const filtered = itemsList.filter((item) => item.name.toLowerCase().includes(lowercasedSearchTerm));
    setFilteredItems(filtered);
  }, [searchTerm, itemsList]);
  // Add selected items and close dialog
  const handleAddItems = () => {
    bulkItemSave(items);
    setBulkItemsDialogue(false);
    setSelectedItems([]);
    setItems([]);
  };

  return (
    <Dialog open={bulkItemsDialogue} onClose={() => setBulkItemsDialogue(false)} maxWidth="md">
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Add Items in Bulk
          </Typography>
          <IconButton
            onClick={() => {
              setSelectedItems([]);
              setItems([]);
              setBulkItemsDialogue(false);
            }}
            color="secondary"
          >
            <IconX size={20} />
          </IconButton>
        </Box>
      </DialogTitle>
      <Divider sx={{ mb: 2 }} />

      <DialogContent sx={{ width: '1000px' }}>
        <Grid container spacing={3}>
          {/* Search and Select Items */}
          <Grid item xs={12} sm={6}>
            <TextField label="Search Items" value={searchTerm} onChange={handleSearchChange} fullWidth variant="outlined" sx={{ mb: 2 }} />
            <List
              sx={{
                maxHeight: '400px',
                overflowY: 'auto',
                border: '1px solid #ddd',
                borderRadius: '8px'
              }}
            >
              {filteredItems.map((item) => (
                <ListItem
                  key={item.name}
                  sx={{
                    backgroundColor: selectedItems.some((selected) => selected.name === item.name) ? '#e8f5e9' : 'transparent',
                    '&:hover': { backgroundColor: '#f1f1f1' }
                  }}
                >
                  <Button
                    fullWidth
                    onClick={() => handleItemToggle(item)}
                    sx={{
                      textAlign: 'left',
                      padding: '10px',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <ListItemText primary={item.name} secondary={`SKU: ${item.sku_value} | Rate: ₹${item.selling_price}`} />
                    <ListItemSecondaryAction>
                      {selectedItems.some((selected) => selected.name === item.name) && <CheckCircle sx={{ color: 'green' }} />}
                    </ListItemSecondaryAction>
                  </Button>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Display selected items with quantity control */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Selected Items: {selectedItems.length}
            </Typography>
            {selectedItems.length > 0 ? (
              selectedItems.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 1,
                    padding: '5px',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <Typography variant="body2">{item.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton onClick={() => handleQuantityChange(item.name, -1)}>
                      <Remove />
                    </IconButton>

                    <TextField
                      name={item.name}
                      value={item.quantity}
                      type="text"
                      onChange={(e) => handleQuantityInput(index, e.target.value)} // Calls handleQuantityInput
                      InputProps={{
                        inputProps: {
                          style: { textAlign: 'center' }
                        }
                      }}
                    />
                    <IconButton onClick={() => handleQuantityChange(item.name, 1)}>
                      <Add />
                    </IconButton>
                  </Box>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No items selected
              </Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleAddItems}>
          Add Items
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BulkItems;
