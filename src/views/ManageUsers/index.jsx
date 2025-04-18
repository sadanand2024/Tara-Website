import React from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import InputAdornment from '@mui/material/InputAdornment';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

// project imports
import UserList from './UserList';
import AddUser from './AddUser';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';

// assets
import { IconSearch } from '@tabler/icons-react';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import AddIcon from '@mui/icons-material/Add';

// ==============================|| USER LIST STYLE 1 ||============================== //

export default function ListStylePage1() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleAddDialogOpen = () => {
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
  };

  return (
    <MainCard
      title={
        <Grid container spacing={gridSpacing} sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Grid>
            <Typography variant="h3">List</Typography>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDialogOpen}
                size='small'
              >
                Add User
              </Button>
              <OutlinedInput
                id="input-search-list-style1"
                placeholder="Search"
                startAdornment={
                  <InputAdornment position="start">
                    <IconSearch stroke={1.5} size="16px" />
                  </InputAdornment>
                }
                size="small"
              />
            </Stack>
          </Grid>
        </Grid>
      }
      content={false}
    >
      <UserList />
      <Grid sx={{ p: 3 }} size={12}>
        <Grid container spacing={gridSpacing} sx={{ justifyContent: 'space-between' }}>
          <Grid>
            <Pagination count={10} color="primary" />
          </Grid>
          <Grid>
            <Button size="large" sx={{ color: 'grey.900' }} color="secondary" endIcon={<ExpandMoreRoundedIcon />} onClick={handleClick}>
              10 Rows
            </Button>
            {anchorEl && (
              <Menu
                id="menu-user-list-style1"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
                variant="selectedMenu"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
              >
                <MenuItem onClick={handleClose}> 10 Rows</MenuItem>
                <MenuItem onClick={handleClose}> 20 Rows</MenuItem>
                <MenuItem onClick={handleClose}> 30 Rows </MenuItem>
              </Menu>
            )}
          </Grid>
        </Grid>
      </Grid>
      <AddUser open={openAddDialog} onClose={handleAddDialogClose} />
    </MainCard>
  );
}
