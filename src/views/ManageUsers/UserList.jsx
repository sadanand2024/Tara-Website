import React, { useEffect } from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import Factory from 'utils/Factory';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditTwoToneIcon from '@mui/icons-material/EditTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'store';

// ==============================|| USER LIST ||============================== //

const getInitials = (firstName, lastName, email) => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  return email ? email[0].toUpperCase() : 'U';
};

const getFullName = (firstName, lastName, email) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  return email.split('@')[0];
};

export default function UserList() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const user = useSelector((state) => state).accountReducer.user;

  useEffect(() => {
    const context_id = user.active_context.id;
    const getUsers = async () => {
      try {
        setLoading(true);
        const response = await Factory('get', '/user_management/context/users?context_id=' + context_id, {}, {});
        if (response.res.status_cd === 0) {
          setData(response.res.data.users);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, [user]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!data.length) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: 400,
          flexDirection: 'column',
          gap: 2
        }}
      >
        <PersonIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
        <Typography variant="h6" color="text.secondary">
          No users found
        </Typography>
      </Box>
    );
  }

  // Get current page data
  const currentPageData = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>ID</TableCell>
              <TableCell>User Profile</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Mobile</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center" sx={{ pr: 3 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentPageData.map((user) => (
              <TableRow hover key={user.user_id}>
                <TableCell sx={{ pl: 3 }}>{user.user_id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar 
                      color="primary"
                      sx={{ 
                        width: 40, 
                        height: 40,
                        bgcolor: (theme) => theme.palette.primary.light,
                        color: (theme) => theme.palette.primary.dark
                      }}
                    >
                      {getInitials(user.first_name, user.last_name, user.email)}
                    </Avatar>
                    <Stack>
                      <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
                        <Typography variant="subtitle1">{getFullName(user.first_name, user.last_name, user.email)}</Typography>
                        {user.status === 'active' && <CheckCircleIcon sx={{ color: 'success.dark', width: 14, height: 14 }} />}
                      </Stack>
                      <Typography variant="subtitle2" noWrap>
                        {user.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  {user.roles && user.roles.length > 0 && (
                    <Chip 
                      label={user.roles[0].role_name} 
                      size="small" 
                      color={user.roles[0].role_type === 'owner' ? 'primary' : 'secondary'}
                    />
                  )}
                </TableCell>
                <TableCell>{user.mobile_number || '-'}</TableCell>
                <TableCell>
                  {user.status === 'active' && <Chip label="Active" size="small" color="success" />}
                  {user.status !== 'active' && <Chip label="Inactive" size="small" color="error" />}
                </TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Tooltip placement="top" title="Edit User">
                      <IconButton 
                        color="primary" 
                        aria-label="edit user" 
                        size="large"
                        sx={{
                          color: 'primary.main',
                          '&:hover': {
                            bgcolor: 'primary.lighter'
                          }
                        }}
                      >
                        <EditTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="top" title={user.status === 'active' ? 'Mark as Inactive' : 'Mark as Active'}>
                      <IconButton
                        color="primary"
                        sx={{
                          color: user.status === 'active' ? 'error.light' : 'success.dark',
                          borderColor: user.status === 'active' ? 'error.main' : 'success.main',
                          '&:hover ': { bgcolor: user.status === 'active' ? 'error.lighter' : 'success.lighter' }
                        }}
                        size="large"
                      >
                        <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={data.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
        sx={{
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          '& .MuiTablePagination-select': {
            paddingY: 1
          }
        }}
      />
    </Box>
  );
}
