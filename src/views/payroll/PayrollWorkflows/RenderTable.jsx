import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Stack, Pagination, Button } from '@mui/material';
import ActionCell from '../../../ui-component/extended/ActionCell';
import { useNavigate } from 'react-router';
import { useSearchParams } from 'react-router';

export default function RenderTable({
  headerData,
  tableData = [], // Default to empty array
  loading = false,
  body_keys,
  handleEdit,
  handleDelete,
  openDialog,
  handleCloseDialog,
  from
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  console.log(from);
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };
  const [payrollid, setPayrollId] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  useEffect(() => {
    const id = searchParams.get('payrollid');
    if (id) {
      setPayrollId(id);
    }
  }, [searchParams]);
  const safeTableData = Array.isArray(tableData) ? tableData : [];
  const paginatedData = safeTableData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <Stack spacing={3}>
      {loading ? (
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ height: 400 }}>
          <h1>Loading</h1>
        </Stack>
      ) : (
        <TableContainer component={Paper}>
          <Table size="large">
            <TableHead>
              <TableRow>
                {headerData.map((item, index) => (
                  <TableCell key={index} sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>
                    {item}
                  </TableCell>
                ))}
                <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headerData.length + 1} sx={{ height: 300 }}>
                    No data
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, index) => (
                  <TableRow key={index}>
                    {body_keys.map((key, idx) => (
                      <TableCell key={idx}>{item[key]}</TableCell>
                    ))}
                    <TableCell>
                      {from === 'Salary Revisions' ? (
                        <Button
                          onClick={() => {
                            navigate(`/payrollsetup/add-employee?employee_id=${item.id}&payrollid=${payrollid}&tabValue=1`);
                          }}
                        >
                          Edit pay Structure
                        </Button>
                      ) : (
                        <ActionCell
                          row={item}
                          onEdit={() => handleEdit(item)}
                          onDelete={() => handleDelete(item)}
                          open={openDialog}
                          onClose={handleCloseDialog}
                          deleteDialogData={{
                            title: 'Delete Record',
                            heading: 'Are you sure you want to delete this Record?',
                            description: `This action will remove ${item.dept_name || 'this item'} from the list.`,
                            successMessage: 'Record has been deleted.'
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {safeTableData.length > 0 && (
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', px: { xs: 0.5, sm: 2.5 }, py: 1.5 }}>
          <Pagination count={Math.ceil(safeTableData.length / rowsPerPage)} page={currentPage} onChange={handlePageChange} />
        </Stack>
      )}
    </Stack>
  );
}

// PropTypes for type checking
RenderTable.propTypes = {
  headerData: PropTypes.arrayOf(PropTypes.string).isRequired,
  tableData: PropTypes.array, // Enforce array type
  loading: PropTypes.bool,
  body_keys: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  openDialog: PropTypes.bool,
  handleCloseDialog: PropTypes.func
};
