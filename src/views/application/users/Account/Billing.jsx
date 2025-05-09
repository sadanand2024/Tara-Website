import React from 'react';

// material-ui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid2';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

// project imports
import { gridSpacing } from 'store/constant';

// select options
const cities = [
  {
    value: '1',
    label: 'Los Angeles'
  },
  {
    value: '2',
    label: 'Chicago'
  },
  {
    value: '3',
    label: 'Phoenix'
  },
  {
    value: '4',
    label: 'San Antonio'
  }
];

const countries = [
  {
    value: '1',
    label: 'India'
  },
  {
    value: '2',
    label: 'France'
  },
  {
    value: '3',
    label: 'USA'
  },
  {
    value: '4',
    label: 'UAE'
  }
];

// ==============================|| PROFILE 2 - BILLING ||============================== //

export default function Billing() {
  const [city, setCity] = React.useState('1');
  const handleChangeCity = (event) => {
    setCity(event.target.value);
  };

  const [Country, setCountry] = React.useState('1');
  const handleSelectChange1 = (event) => {
    setCountry(event.target.value);
  };

  const [state1, setState1] = React.useState({
    checkedA: true
  });
  const handleChangeState1 = (event) => {
    setState1({ ...state1, [event.target.name]: event.target.checked });
  };
  return (
    <Grid container spacing={gridSpacing}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Block No#" defaultValue="16657" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Apartment Name" defaultValue=" Dardan Ranch" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Street Line 1" defaultValue="Nathaniel Ports" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField fullWidth label="Street Line 2" defaultValue="nr. Oran Walks" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField fullWidth label="Postcode" defaultValue="395005" />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField id="standard-select-category" select label="Select City" value={city} fullWidth onChange={handleChangeCity}>
          {cities.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <TextField id="standard-select-country" select label="Select Country" value={Country} fullWidth onChange={handleSelectChange1}>
          {countries.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={12}>
        <FormControlLabel
          control={<Checkbox checked={state1.checkedA} onChange={handleChangeState1} name="checkedA" color="primary" />}
          label="Same as billing address"
        />
      </Grid>
    </Grid>
  );
}
