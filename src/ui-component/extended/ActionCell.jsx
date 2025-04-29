// 📁 File: ActionCell.jsx
'use client';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  IconButton,
  Popper,
  ClickAwayListener,
  Fade,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
  Box,
  useTheme
} from '@mui/material';

// React Icons (lightweight + consistent)
import { RiDownload2Line, RiEditLine, RiMoneyDollarCircleLine, RiDeleteBin6Line, RiCheckboxCircleLine } from 'react-icons/ri';
import { MdPayment } from 'react-icons/md';
import { BiErrorCircle } from 'react-icons/bi';

export default function ActionCell({
  row,
  onEdit,
  onDelete,
  onDownload,
  onRecordPayment,
  onPaymentHistory,
  onApprove,
  onWriteOff,
  fromComponent,
  deleteDialogData
}) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const isOpen = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleDeleteConfirm = () => {
    onDelete(row);
    setOpenDeleteDialog(false);
    handleCloseMenu();
  };
  return (
    <>
      {/* Trigger Button */}
      <IconButton color="secondary" size="small" onClick={handleClick} sx={{ border: '1px solid', borderColor: 'divider' }}>
        <RiEditLine size={18} />
      </IconButton>

      {/* Popper Action Menu */}
      <Popper open={isOpen} anchorEl={anchorEl} placement="top-end" transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} in={isOpen}>
            <Box
              sx={{
                minWidth: 180,
                bgcolor: theme.palette.background.paper,
                borderRadius: 2,
                boxShadow: theme.customShadows.tooltip,
                zIndex: 9999
              }}
            >
              <ClickAwayListener onClickAway={handleCloseMenu}>
                <List dense disablePadding>
                  {onDownload && (
                    <ListItemButton
                      onClick={() => {
                        onDownload();
                        handleCloseMenu();
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.info.main }}>
                        <RiDownload2Line size={16} />
                      </ListItemIcon>
                      <ListItemText primary="View" />
                    </ListItemButton>
                  )}

                  {onEdit && (
                    <ListItemButton
                      onClick={() => {
                        onEdit();
                        handleCloseMenu();
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.primary.main }}>
                        <RiEditLine size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Edit" />
                    </ListItemButton>
                  )}

                  {fromComponent === 'invoice' &&
                    ['Approved', 'Invoice Sent'].includes(row?.invoice_status) &&
                    row?.balance_due !== 0 &&
                    onRecordPayment && (
                      <ListItemButton
                        onClick={() => {
                          onRecordPayment();
                          handleCloseMenu();
                        }}
                      >
                        <ListItemIcon sx={{ color: theme.palette.success.main }}>
                          <RiMoneyDollarCircleLine size={16} />
                        </ListItemIcon>
                        <ListItemText primary="Record Payment" />
                      </ListItemButton>
                    )}

                  {fromComponent === 'invoice' && onPaymentHistory && (
                    <ListItemButton
                      onClick={() => {
                        onPaymentHistory();
                        handleCloseMenu();
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.warning.main }}>
                        <MdPayment size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Payment History" />
                    </ListItemButton>
                  )}

                  {fromComponent === 'invoice' && onApprove && (
                    <ListItemButton
                      onClick={() => {
                        onApprove();
                        handleCloseMenu();
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.success.dark }}>
                        <RiCheckboxCircleLine size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Approve" />
                    </ListItemButton>
                  )}

                  {(row?.invoice_status === 'Approved' || row?.invoice_status === 'Invoice Sent') && onWriteOff && (
                    <ListItemButton
                      onClick={() => {
                        onWriteOff();
                        handleCloseMenu();
                      }}
                    >
                      <ListItemIcon sx={{ color: theme.palette.text.primary }}>
                        <RiCheckboxCircleLine size={16} />
                      </ListItemIcon>
                      <ListItemText primary="Write Off" />
                    </ListItemButton>
                  )}

                  <ListItemButton
                    onClick={() => {
                      setOpenDeleteDialog(true);
                      handleCloseMenu();
                    }}
                  >
                    <ListItemIcon sx={{ color: theme.palette.error.main }}>
                      <RiDeleteBin6Line size={16} />
                    </ListItemIcon>
                    <ListItemText primary="Delete" sx={{ color: theme.palette.error.main }} />
                  </ListItemButton>
                </List>
              </ClickAwayListener>
            </Box>
          </Fade>
        )}
      </Popper>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="xs" aria-labelledby="delete-dialog-title">
        <DialogTitle id="delete-dialog-title">{deleteDialogData?.title || 'Delete Record'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} alignItems="center">
            <Box sx={{ height: 100 }}>
              <BiErrorCircle size={80} color={theme.palette.error.main} />
            </Box>
            <Typography variant="h5" align="center">
              {deleteDialogData?.heading || 'Are you sure you want to delete this?'}
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ px: 2 }}>
              {deleteDialogData?.description || 'This action cannot be undone.'}
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

ActionCell.propTypes = {
  row: PropTypes.object.isRequired,
  fromComponent: PropTypes.string,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDownload: PropTypes.func,
  onRecordPayment: PropTypes.func,
  onPaymentHistory: PropTypes.func,
  onWriteOff: PropTypes.func,
  onApprove: PropTypes.func,
  deleteDialogData: PropTypes.shape({
    title: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string
  })
};
