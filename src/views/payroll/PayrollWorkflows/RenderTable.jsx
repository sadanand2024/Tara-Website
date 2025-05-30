import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Stack,
  Pagination,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import DeleteDialog from '../../../ui-component/extended/DeleteDialog'; // adjust path accordingly
import { IconButton, Tooltip } from '@mui/material'; // Add these if not already

import ActionCell from '../../../ui-component/extended/ActionCell';
import EmptyDataPlaceholder from 'ui-component/extended/EmptyDataPlaceholder';
import { Edit, Delete } from '@mui/icons-material';
const RenderTable = ({
  headerData,
  tableData = [],
  loading = false,
  body_keys,
  handleEdit,
  handleDelete,
  openDialog,
  handleCloseDialog,
  from
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payrollId, setPayrollId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenDeleteDialog = (row) => {
    setSelectedRow(row);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    handleDelete(selectedRow);
    setOpenDeleteDialog(false);
  };

  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) setPayrollId(id);
  }, [searchParams]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const safeTableData = Array.isArray(tableData) ? tableData : [];
  const paginatedData = safeTableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <Stack spacing={3}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 1 }}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.100' }}>
                {headerData.map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                    {header}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headerData.length + 1} sx={{ height: 300 }}>
                    <EmptyDataPlaceholder title="No Data Found" subtitle="Start by adding a new record." />
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {body_keys.map((key, cellIndex) => (
                      <TableCell key={cellIndex}>{row[key]}</TableCell>
                    ))}
                    <TableCell>
                      {from === 'Salary Revisions' ? (
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => navigate(`/payrollsetup/add-employee?employee_id=${row.id}&payrollid=${payrollId}&tabValue=1`)}
                        >
                          Edit Pay Structure
                        </Button>
                      ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <IconButton color="primary" onClick={() => handleEdit(row)}>
                            <Edit />
                          </IconButton>
                          {from !== 'Tds' ? (
                            <IconButton color="error" onClick={() => handleOpenDeleteDialog(row)}>
                              <Delete />
                            </IconButton>
                          ) : null}
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <DeleteDialog
            open={openDeleteDialog}
            onClose={() => setOpenDeleteDialog(false)}
            onConfirm={handleConfirmDelete}
            dialogData={{
              title: 'Delete Record',
              heading: 'Are you sure?',
              description: 'This action will permanently delete the record.'
            }}
          />
        </TableContainer>
      )}

      {safeTableData.length > rowsPerPage && (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 2 }}>
          <Pagination
            count={Math.ceil(safeTableData.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
          />
        </Stack>
      )}
    </Stack>
  );
};

RenderTable.propTypes = {
  headerData: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.array,
  loading: PropTypes.bool,
  body_keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  openDialog: PropTypes.bool,
  handleCloseDialog: PropTypes.func,
  from: PropTypes.string
};

export default RenderTable;
