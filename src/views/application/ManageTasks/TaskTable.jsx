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
import FlagIcon from '@mui/icons-material/Flag';
import Tooltip from '@mui/material/Tooltip';
import Select from '@mui/material/Select';

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

  const handlePriorityChange = (id) => (event) => {
    const newPriority = event.target.value;
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, priority: newPriority } : r)));
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ p: 1.5 }}>Request ID</TableCell>
              <TableCell sx={{ p: 1.5 }}>Client</TableCell>
              <TableCell sx={{ p: 1.5 }}>Created On</TableCell>
              <TableCell sx={{ p: 1.5 }}>Assignee</TableCell>
              <TableCell sx={{ p: 1.5 }}>Reviewer</TableCell>
              <TableCell sx={{ p: 1.5 }}>Status</TableCell>
              <TableCell sx={{ p: 1.5 }}>Priority</TableCell>
              <TableCell sx={{ p: 1.5 }}>Progress</TableCell>
              {user.active_context.is_platform_context && (
                <>
                  <TableCell sx={{ p: 1.5 }}>Due Date</TableCell>
                  <TableCell sx={{ p: 1.5 }}>Aging</TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRequests.map((row, idx) => {
              // Priority color logic
              let priorityColor = 'info.main';
              let priorityText = row.priority || '';
              if (priorityText.toLowerCase() === 'critical') priorityColor = 'error.dark';
              else if (priorityText.toLowerCase() === 'high') priorityColor = 'warning.dark';
              else if (priorityText.toLowerCase() === 'medium') priorityColor = 'success.dark';
              else if (priorityText.toLowerCase() === 'low') priorityColor = 'primary.dark';

              // Status color logic
              let statusBg = '#FFF9E5',
                statusColor = '#B08800',
                statusLabel = row.status;
              if (/declined/i.test(statusLabel)) {
                statusBg = '#FFE5E5';
                statusColor = '#D32F2F';
              } else if (/completed/i.test(statusLabel)) {
                statusBg = '#E5F9ED';
                statusColor = '#388E3C';
              } else if (/processed/i.test(statusLabel)) {
                statusBg = '#FFF9E5';
                statusColor = '#B08800';
              }

              // Progress color logic
              let progressColor = 'grey.300';
              if (row.completion_percentage === 100) progressColor = 'success.dark';
              else if (row.completion_percentage >= 75) progressColor = 'primary.main';
              else if (row.completion_percentage >= 50) progressColor = 'secondary.main';
              else if (row.completion_percentage >= 25) progressColor = 'warning.main';
              else if (row.completion_percentage === 0) progressColor = 'grey.300';

              // Due date formatting
              const dueDate = row.due_date ? new Date(row.due_date) : null;
              const dueDateStr = dueDate ? dueDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }) : '-';

              // Aging calculation
              const createdAt = new Date(row.created_at);
              const agingDays = dueDate ? Math.max(0, Math.round((dueDate - createdAt) / (1000 * 60 * 60 * 24))) : '-';

              return (
                <TableRow hover key={row.id}>
                  <TableCell sx={{ p: 1.5 }}>{row.id || '-'}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>{row?.user?.full_name || '-'}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    {createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                  </TableCell>
                  <TableCell sx={{ p: 1.5 }}>{row.assignee?.full_name || '-'}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>{row.reviewer?.full_name || '-'}</TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    <Box
                      sx={{
                        display: 'inline-block',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        background: statusBg,
                        color: statusColor,
                        fontWeight: 500,
                        fontSize: 14,
                        minWidth: 90,
                        textAlign: 'center'
                      }}
                    >
                      {capitalizeFirstLetter(statusLabel)}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FlagIcon sx={{ color: priorityColor, fontSize: 18, mr: 0.5 }} />
                      <Select
                        value={priorityText}
                        onChange={handlePriorityChange(row.id)}
                        disabled={!user.active_context.is_platform_context}
                        size="small"
                        variant="standard"
                        sx={{
                          minWidth: 80,
                          fontWeight: 500,
                          color: priorityColor,
                          background: 'transparent',
                          '.MuiSelect-icon': { color: priorityColor }
                        }}
                        disableUnderline
                      >
                        <MenuItem value="critical">{capitalizeFirstLetter('critical')}</MenuItem>
                        <MenuItem value="high">{capitalizeFirstLetter('high')}</MenuItem>
                        <MenuItem value="medium">{capitalizeFirstLetter('medium')}</MenuItem>
                        <MenuItem value="low">{capitalizeFirstLetter('low')}</MenuItem>
                      </Select>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ p: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title={`${row.completion_percentage}%`} arrow>
                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                          {row.completion_percentage === 0 ? (
                            <CircularProgress
                              variant="determinate"
                              value={100}
                              sx={{
                                color: progressColor,
                                zIndex: 1,
                                backgroundColor: 'transparent',
                                borderRadius: '50%'
                              }}
                            />
                          ) : (
                            <CircularProgress
                              variant="determinate"
                              value={row.completion_percentage}
                              sx={{
                                color: progressColor,
                                zIndex: 1,
                                backgroundColor: 'transparent',
                                borderRadius: '50%'
                              }}
                            />
                          )}
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Typography
                              variant="caption"
                              component="div"
                              sx={{ color: 'text.secondary' }}
                            >{`${row.completion_percentage}%`}</Typography>
                          </Box>
                        </Box>
                      </Tooltip>
                    </Box>
                  </TableCell>
                  {user.active_context.is_platform_context && (
                    <>
                      <TableCell sx={{ p: 1.5 }}>{dueDateStr}</TableCell>
                      <TableCell sx={{ p: 1.5 }}>{agingDays !== '-' ? `${agingDays} Days` : '-'}</TableCell>
                    </>
                  )}
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
