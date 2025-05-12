// 📁 File: DeleteDialog.jsx

import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, Typography, Box, useTheme } from '@mui/material';
import { BiErrorCircle } from 'react-icons/bi';

export default function DeleteDialog({ open, onClose, onConfirm, dialogData }) {
  const theme = useTheme();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" aria-labelledby="delete-dialog-title">
      <DialogTitle id="delete-dialog-title">{dialogData?.title || 'Delete Record'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5} alignItems="center">
          <Box sx={{ height: 100 }}>
            <BiErrorCircle size={80} color={theme.palette.error.main} />
          </Box>
          <Typography variant="h5" align="center">
            {dialogData?.heading || 'Are you sure you want to delete this?'}
          </Typography>
          <Typography variant="body1" align="center" color="text.secondary" sx={{ px: 2 }}>
            {dialogData?.description || 'This action cannot be undone.'}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button variant="outlined" color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  dialogData: PropTypes.shape({
    title: PropTypes.string,
    heading: PropTypes.string,
    description: PropTypes.string
  })
};
