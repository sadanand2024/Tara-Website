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
  CircularProgress,
  Grid2,
  Typography
} from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { rowsPerPage } from 'ui-component/extended/RowsPerPage';
import DeleteDialog from '../../../ui-component/extended/DeleteDialog'; // adjust path accordingly
import { IconButton, Tooltip } from '@mui/material'; // Add these if not already
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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
  from,
  handleBack,
  handleNext
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [payrollId, setPayrollId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [month, setMonth] = useState(null);
  const [financial_year, setFinancialYear] = useState(null);
  const [lock_payroll, setLockPayroll] = useState(false);
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
    const month = searchParams.get('month');
    const financial_year = searchParams.get('financial_year');
    const lock_payroll = searchParams.get('lock_payroll');
    if (id) setPayrollId(id);
    if (month) setMonth(month);
    if (financial_year) setFinancialYear(financial_year);
    if (lock_payroll === 'true') setLockPayroll(true);
  }, [searchParams]);

  const handlePageChange = (_, value) => {
    setCurrentPage(value);
  };
  const safeTableData = Array.isArray(tableData) ? tableData : [];
  const paginatedData = safeTableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  return (
    <Stack>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 0 }}>
          <Table size="small">
            <TableHead
              sx={{
                backgroundColor: 'primary.main',
                '& .MuiTableCell-root': {
                  color: '#ffffff !important'
                }
              }}
            >
              <TableRow>
                {headerData.map((header, index) => (
                  <TableCell key={index} sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', py: 1.5 }}>
                    {header}
                  </TableCell>
                ))}
                <TableCell align="center" sx={{ fontWeight: 'bold', whiteSpace: 'nowrap', py: 1.5 }}>
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
                    <TableCell align="center">
                      {from === 'Salary Revisions' ? (
                        <Tooltip title={lock_payroll ? 'Cannot edit - Payroll is locked' : 'Edit record'}>
                          <span>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                if (row.employee_id !== '' && row.employee_id !== null) {
                                  navigate(
                                    `/app/payroll/settings/add-employee?employee_id=${row.employee_id}&payrollid=${payrollId}&from=${'Salary Revisions'}&tabValue=${Number(1)}&month=${month}&financial_year=${financial_year}`
                                  );
                                }
                              }}
                              disabled={lock_payroll}
                            >
                              Edit Pay Structure
                            </Button>
                          </span>
                        </Tooltip>
                      ) : (
                        <Box display="flex" justifyContent="center" alignItems="center" gap={1}>
                          <Tooltip title={lock_payroll ? 'Cannot edit - Payroll is locked' : 'Edit record'}>
                            <span>
                              <IconButton size="small" color="primary" onClick={() => handleEdit(row)} disabled={lock_payroll}>
                                <Edit />
                              </IconButton>
                            </span>
                          </Tooltip>
                          {from !== 'Tds' && from !== 'Adhoc Bonus & Incentives' ? (
                            <Tooltip title={lock_payroll ? 'Cannot delete - Payroll is locked' : 'Delete record'}>
                              <span>
                                <IconButton size="small" color="error" onClick={() => handleOpenDeleteDialog(row)} disabled={lock_payroll}>
                                  <Delete />
                                </IconButton>
                              </span>
                            </Tooltip>
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

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2, px: 2 }}>
        {from !== 'New Joiners' ? (
          <Button startIcon={<ArrowBackIcon />} variant="outlined" color="primary" onClick={() => handleBack()}>
            Back
          </Button>
        ) : (
          <Typography></Typography>
        )}
        {safeTableData.length > 0 && (
          <Pagination
            count={Math.ceil(safeTableData.length / rowsPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            color="primary"
          />
        )}
        <Box>
          {from === 'Tds' ? (
            <Button
              variant="contained"
              color="primary"
              onClick={() =>
                navigate(`/app/payroll/employee-dashboard?payrollid=${payrollId}&month=${month}&financial_year=${financial_year}`)
              }
            >
              Proceed to Monthly Payroll Dashboard
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={() => handleNext()}>
              Next
            </Button>
          )}
        </Box>
      </Stack>
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
