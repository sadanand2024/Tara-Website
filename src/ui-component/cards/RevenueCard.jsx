import PropTypes from 'prop-types';
// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

export default function RevenueCard({ primary, secondary, content, iconPrimary, color }) {
  const IconPrimary = iconPrimary;
  const primaryIcon = iconPrimary ? <IconPrimary fontSize="large" /> : null;

  return (
    <Card sx={{ bgcolor: color, position: 'relative', color: 'common.white' }}>
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            position: 'absolute',
            right: 13,
            top: { xs: 22, md: 14 },
            '&> svg': { width: { xs: 80, md: 100 }, height: { xs: 80, md: 100 }, opacity: '0.5', color: 'common.white' }
          }}
        >
          {primaryIcon}
        </Typography>
        <Grid container spacing={1}>
          <Grid size={12}>
            <Typography variant="h5" color="inherit">
              {primary}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="h3" color="inherit">
              {secondary}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="subtitle2" color="inherit">
              {content}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

RevenueCard.propTypes = {
  primary: PropTypes.any,
  secondary: PropTypes.any,
  content: PropTypes.any,
  iconPrimary: PropTypes.any,
  color: PropTypes.any
};
