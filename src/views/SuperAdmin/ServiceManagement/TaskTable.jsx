import React, { useEffect } from 'react';

// material-ui
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { gridSpacing } from 'store/constant';
import Factory from 'utils/Factory';
import { useSelector } from 'store';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';

// ==============================|| MANAGE USERS ||============================== //

const TaskTable = ({ searchQuery, setUsers, assigned, setSearchQuery }) => {
  // All hooks at the top
  const { enqueueSnackbar } = useSnackbar();
  const user = useSelector((state) => state).accountReducer.user;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [openAddDialog, setOpenAddDialog] = React.useState(false);
  const [totalUsers, setTotalUsers] = React.useState(0);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [requests, setRequests] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [userOptions, setUserOptions] = React.useState([]);
  const [assignedUsers, setAssignedUsers] = React.useState({});

  const getData = async () => {
    try {
      setLoading(true);
      const response = await Factory('get', `/servicetasks/`, {}, {});
      if (response.res.status_cd === 0) {
        setRequests(response.res.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const filteredRequests = React.useMemo(() => {
    if (!searchQuery) return requests;
    return requests.filter(
      (request) =>
        request.service_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.source?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [requests, searchQuery]);

  const paginatedRequests = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return requests.slice(start, end);
  }, [requests, page, rowsPerPage]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (value) => {
    setRowsPerPage(value);
    setPage(1);
    handleClose();
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleARChange = (row, user, type) => {
    let __requests = [...requests];
    let idx = __requests.findIndex((r) => r.id === row.id);
    __requests[idx][type] = user.user_id;
    setRequests(__requests);
  };

  const assignService = async (rowData) => {
    const assigned = assignedUsers[rowData.id] || {};
    const assigneeId = assigned.assignee !== undefined ? assigned.assignee : rowData.assignee;
    const reviewerId = assigned.reviewer !== undefined ? assigned.reviewer : rowData.reviewer;
    const res = await Factory(
      'put',
      `/user_management/service-request/${rowData.id}/assignment/`,
      {
        assignee_id: assigneeId,
        reviewer_id: reviewerId
      },
      {}
    );
    if (res.res.status_cd === 0) {
      enqueueSnackbar('Service assigned successfully', { variant: 'success' });
      getData();
    } else {
      enqueueSnackbar('Error assigning service', { variant: 'error' });
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ pl: 3 }}>Request ID</TableCell>
              <TableCell sx={{ p: 1.5 }}>Services</TableCell>
              <TableCell sx={{ p: 1.5 }}>Category</TableCell>
              <TableCell sx={{ p: 1.5 }}>Client</TableCell>
              <TableCell sx={{ p: 1.5 }}>Created On</TableCell>
              <TableCell sx={{ p: 1.5 }}>Completion</TableCell>
              <TableCell sx={{ p: 1.5 }}>Assignee</TableCell>
              <TableCell sx={{ p: 1.5 }}>Reviewer</TableCell>
              {!assigned && <TableCell sx={{ p: 1.5 }}>Action</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequests.map((row, idx) => {
              return (
                <TableRow hover key={row.id}>
                  <TableCell sx={{ pl: 3 }}>{row.id}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>{row.service_name}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>{row.category}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>{row.client.full_name || 'Unnamed '}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    {new Date(row.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                        <CircularProgress
                          variant="determinate"
                          value={row.completion_percentage}
                          size={28}
                          thickness={5}
                          sx={{
                            color:
                              row.completion_percentage === 100
                                ? 'success.main'
                                : row.completion_percentage >= 75
                                  ? 'primary.main'
                                  : row.completion_percentage >= 50
                                    ? 'secondary.main'
                                    : 'grey.300'
                          }}
                        />
                        <Box
                          sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%'
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 500 }}>{row.completion_percentage}%</span>
                        </Box>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    <Typography>{row.assignee.full_name}</Typography>
                  </TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    <Typography>{row.reviewer.full_name}</Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Grid sx={{ p: 1.5 }} size={12}>
        <Grid container spacing={gridSpacing} sx={{ justifyContent: 'space-between' }}>
          <Grid>
            <Pagination
              count={Math.ceil(filteredRequests.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              shape="rounded"
            />
          </Grid>
          <Grid>
            <Button size="large" sx={{ color: 'grey.900' }} color="secondary" endIcon={<ExpandMoreRoundedIcon />} onClick={handleClick}>
              {rowsPerPage} Rows
            </Button>
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
              <MenuItem onClick={() => handleChangeRowsPerPage(10)}>10 Rows</MenuItem>
              <MenuItem onClick={() => handleChangeRowsPerPage(20)}>20 Rows</MenuItem>
              <MenuItem onClick={() => handleChangeRowsPerPage(30)}>30 Rows</MenuItem>
            </Menu>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default TaskTable;
