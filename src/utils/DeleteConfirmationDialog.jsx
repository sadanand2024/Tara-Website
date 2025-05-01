import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useTheme } from '@mui/material/styles';
const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Delete Confirmation',
  message = 'Are you sure you want to delete this item?',
  itemName = ''
}) => {
  const theme = useTheme();
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          p: 1
        }
      }}
    >
      {/* <DialogTitle sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div" sx={{ color: 'error.main', display: 'flex', alignItems: 'center', gap: 1 }}>
          <WarningAmberIcon /> {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500]
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle> */}
      <DialogContent sx={{ p: 0, m: 0 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pt: 2
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              backgroundColor: '#ff686861',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <WarningAmberIcon sx={{ fontSize: 30, color: 'error.main' }} />
          </Box>
          <Typography variant="h2" sx={{ my: 2 }}>
            Delete Confirmation
          </Typography>
          <Typography variant="body1" sx={{ mb: 1, textAlign: 'center' }}>
            {message}
          </Typography>
          {itemName && (
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: 'error.main',
                textAlign: 'center',
                backgroundColor: 'error.lighter',
                px: 2,
                py: 1,
                borderRadius: 1
              }}
            >
              {itemName}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 1, pb: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Button onClick={onClose} variant="outlined" size="medium" sx={{ width: '100%', mr: 2 }}>
          No, Keep it
        </Button>
        <Button onClick={onConfirm} sx={{ width: '100%', ml: 2 }} variant="contained" color="error" size="medium">
          Yes, Delete it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;
