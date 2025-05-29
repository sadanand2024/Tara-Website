import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

// material-ui
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';

// assets
import ArrowRightAltRoundedIcon from '@mui/icons-material/ArrowRightAltRounded';

export default function BillCard({ icon, title, secondary, link, color, bg, onClick, index }) {
  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        borderLeft: '10px solid',
        borderColor:
          index === 0
            ? 'orange.dark'
            : index === 1
              ? 'warning.dark'
              : index === 2
                ? 'success.dark'
                : index === 3
                  ? 'success.dark'
                  : 'orange.dark',
        bgcolor: bg,
        borderRadius: 2,
        boxShadow: 0,
        transition: 'box-shadow 0.3s, transform 0.3s',
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': {
          boxShadow: 6,
          transform: onClick ? 'translateY(-6px) scale(1.03)' : undefined
        },
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <CardContent>
        <Grid container spacing={0} justifyContent="center" alignItems="center">
          {icon && (
            <Grid size={12} sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, color: color }}>{icon}</span>
            </Grid>
          )}
          <Grid size={12}>
            <Typography variant="h4" sx={{ color: 'grey.800', textAlign: 'center', mb: 1 }}>
              {title}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography variant="h2" sx={{ fontWeight: 500, mb: 1.5, color: 'grey.800', textAlign: 'center' }}>
              {secondary}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

BillCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.any,
  secondary: PropTypes.any,
  link: PropTypes.string,
  color: PropTypes.any,
  bg: PropTypes.string,
  onClick: PropTypes.func
};
