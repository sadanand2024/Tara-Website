import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box, useTheme } from '@mui/material';
import { BiErrorCircle } from 'react-icons/bi';

export default function DraftingActionCell({ row, onEdit, onDownload, onDelete, status, deleteDialogData }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleDeleteConfirm = () => {
    onDelete && onDelete(row);
    setOpenDeleteDialog(false);
    handleMenuClose();
  };

  return (
    <>
      <IconButton color="primary" onClick={handleMenuOpen} size="small">
        <EditIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { minWidth: 160 } }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            onEdit && onEdit(row);
          }}
        >
          <ListItemIcon>
            <EditIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        {status === 'Completed' && (
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDownload && onDownload(row);
            }}
          >
            <ListItemIcon>
              <DownloadIcon fontSize="small" color="success" />
            </ListItemIcon>
            <ListItemText>Download</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setOpenDeleteDialog(true);
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: theme.palette.error.main }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">{deleteDialogData?.title || 'Delete file'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} alignItems="center">
            <Box sx={{ height: 100 }}>
              <BiErrorCircle size={80} color={theme.palette.error.main} />
            </Box>
            <Typography variant="h5" align="center">
              {deleteDialogData?.heading || 'Are you sure you want to delete this file?'}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ px: 2 }}>
              {deleteDialogData?.description || 'This action will permanently remove this file from the list.'}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={() => setOpenDeleteDialog(false)}>
            Cancel
          </Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

DraftingActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  onEdit: PropTypes.func,
  onDownload: PropTypes.func,
  onDelete: PropTypes.func,
  status: PropTypes.string,
  deleteDialogData: PropTypes.shape({
    title: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string
  })
}; 