import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import Factory from 'utils/Factory';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Chip
} from '@mui/material';

const SubTasks = ({ searchQuery, assigned }) => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [subTasks, setSubTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubTasks = async () => {
      try {
        const response = await Factory('get', '/servicetasks/subtasks-list/', {
          search: searchQuery,
          assigned: assigned
        });
        if (response.res.status_cd === 0) {
          setSubTasks(response.res.data);
        } else {
          enqueueSnackbar(response.res.message, { variant: 'error' });
        }
      } catch (error) {
        console.error('Error fetching sub tasks:', error);
        enqueueSnackbar('Failed to fetch sub tasks', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchSubTasks();
  }, [searchQuery, assigned]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
        <CircularProgress />
      </Box>
    );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Created At</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {subTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.description}</TableCell>
              <TableCell>
                {new Date(task.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </TableCell>
              <TableCell>
                <Chip
                  label={task.status}
                  color={
                    task.status === 'completed'
                      ? 'success'
                      : task.status === 'in progress'
                      ? 'info'
                      : task.status === 'pending'
                      ? 'warning'
                      : task.status === 'rejected'
                      ? 'error'
                      : 'default'
                  }
                  size="small"
                  variant="filled"
                  sx={{ textTransform: 'capitalize', fontWeight: 500 }}
                />
              </TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/servicetasks/subtasks/${task.id}`)}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SubTasks;
