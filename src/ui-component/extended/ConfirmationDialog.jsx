import PropTypes from 'prop-types';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
 
// ==============================|| CONFIRMATION DIALOG ||============================== //
 
const ConfirmationDialog = ({
    open,
    onClose,
    onConfirm,
    title,
    message,
    description,
    confirmText = 'OK',
    cancelText = 'Cancel',
    icon: Icon = CheckCircleOutlineIcon,
    color = 'primary'
}) => (
    <Dialog
        open={open}
        onClose={() => onClose(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{ '& .MuiDialog-paper': { p: 1, borderRadius: '12px', minWidth: 380, maxWidth: 420,minHeight: 280,maxHeight: 350 } }}
    >
        <DialogTitle id="alert-dialog-title" sx={{ p: 2, pb: 0 }}>
            <Typography variant="h3" fontWeight={600}>
                {title}
            </Typography>
        </DialogTitle>
 
        <DialogContent  dividers sx={{ textAlign: 'center', p: 3, pt: 2,mt:2,mb:2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3,mt:3 }}>
                <Icon sx={{ color: `${color}.main`, fontSize: 52 }} />
            </Box>
            <Typography variant="body1" fontWeight={500} sx={{ mb: 1 }}>
                {message}
            </Typography>
            {description && (
                <Typography variant="body2" color="text.secondary">
                    {description}
                </Typography>
            )}
        </DialogContent>
 
        <DialogActions sx={{ p: 2, pt: 0, justifyContent: 'flex-end', gap: 1 }}>
            <Button
                variant="outlined"
                onClick={() => onClose(false)}
                sx={{
                    color: 'text.primary',
                    borderColor: 'grey.300',
                    '&:hover': {
                        borderColor: 'grey.400',
                        backgroundColor: 'grey.50'
                    }
                }}
            >
                {cancelText}
            </Button>
            <Button
                variant="contained"
                onClick={onConfirm}
                sx={{
                    backgroundColor: `${color}.main`,
                    color: '#fff',
                    '&:hover': {
                        backgroundColor: `${color}.dark`
                    }
                }}
                autoFocus
            >
                {confirmText}
            </Button>
        </DialogActions>
    </Dialog>
);
 
ConfirmationDialog.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onConfirm: PropTypes.func,
    title: PropTypes.string,
    message: PropTypes.string,
    description: PropTypes.string,
    confirmText: PropTypes.string,
    cancelText: PropTypes.string,
    icon: PropTypes.elementType,
    color: PropTypes.oneOf(['primary', 'secondary', 'error', 'warning', 'info', 'success'])
};
 
export default ConfirmationDialog;
 