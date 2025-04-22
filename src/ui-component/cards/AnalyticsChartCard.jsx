import PropTypes from 'prop-types';
import React, { useState } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third party
import Chart from 'react-apexcharts';

// project imports
import MainCard from './MainCard';

// assets
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export default function AnalyticsChartCard({ title, chartData, dropData, listData }) {
  const [anchorEl, setAnchorEl] = useState(null);

  let dropHtml;
  if (dropData) {
    const handleClick = (event) => {
      setAnchorEl(event?.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    dropHtml = (
      <>
        <Button variant="text" disableElevation size="small" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          {dropData.title}
        </Button>
        <Menu
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right'
          }}
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {dropData?.options.map((option, index) => (
            <MenuItem key={index} onClick={handleClose}>
              {option.label}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  let listItem;
  if (listData) {
    listItem = listData.map((item, index) => (
      <Grid key={index} size={{ sm: 12 }}>
        <Box sx={{ color: item.color }}>
          <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
            <Grid>{item.icon}</Grid>
            <Grid>
              <Typography variant="subtitle1">{item.value}%</Typography>
            </Grid>
            <Grid>
              {item.state === 1 && <ArrowUpwardIcon fontSize="inherit" color="inherit" sx={{ mt: 0.5 }} />}
              {item.state === 0 && <ArrowDownwardIcon fontSize="inherit" color="inherit" sx={{ mt: 0.5 }} />}
            </Grid>
            <Grid>
              <Typography variant="subtitle1" color="inherit">
                {item.percentage}%
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    ));
  }

  return (
    <MainCard>
      <Grid container sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {title && (
          <Grid>
            <Typography variant="subtitle1">{title}</Typography>
          </Grid>
        )}
        <Grid>{dropHtml}</Grid>
      </Grid>
      <Grid container spacing={0.75} sx={{ justifyContent: 'center', alignItems: 'center' }}>
        <Grid size={{ xs: 12, sm: 6 }}>{listItem}</Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Chart {...chartData} />
        </Grid>
      </Grid>
    </MainCard>
  );
}

AnalyticsChartCard.propTypes = { title: PropTypes.any, chartData: PropTypes.any, dropData: PropTypes.any, listData: PropTypes.any };
