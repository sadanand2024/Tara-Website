import React from 'react';
import PropTypes from 'prop-types';
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Stack, Typography, useTheme } from '@mui/material';
import { IconX } from '@tabler/icons-react';

const BerryDialog = ({
  open,
  handleClose,
  title,
  subheader,
  children,
  footer,
  maxWidth = 'md',
  fullWidth = true,
  scroll = 'paper',
  showClose = true
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      scroll={scroll}
      PaperProps={{
        sx: {
          borderRadius: 3,
          px: { xs: 2, md: 3 },
          py: 2
        }
      }}
    >
      {/* Header */}
      {(title || showClose) && (
        <DialogTitle
          sx={{
            pb: 1,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h4">{title}</Typography>
            {subheader && (
              <Typography variant="body2" color="text.secondary">
                {subheader}
              </Typography>
            )}
          </Stack>
          {showClose && (
            <IconButton onClick={handleClose} size="small" sx={{ ml: 2 }}>
              <IconX stroke={1.5} size="1.2rem" />
            </IconButton>
          )}
        </DialogTitle>
      )}

      {/* Content */}
      <DialogContent dividers sx={{ pt: 2 }}>
        {children}
      </DialogContent>

      {/* Footer */}
      {footer && <DialogActions sx={{ pt: 2 }}>{footer}</DialogActions>}
    </Dialog>
  );
};

BerryDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  subheader: PropTypes.string,
  children: PropTypes.node.isRequired,
  footer: PropTypes.node,
  maxWidth: PropTypes.string,
  fullWidth: PropTypes.bool,
  scroll: PropTypes.oneOf(['paper', 'body']),
  showClose: PropTypes.bool
};

export default BerryDialog;
