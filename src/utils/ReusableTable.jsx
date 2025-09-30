import PropTypes from 'prop-types';
import * as React from 'react';
import { useState } from 'react';

// material-ui
import {
  Checkbox,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableSortLabel,
  TableRow,
  Toolbar,
  Tooltip,
  Typography,
  TextField,
  Stack,
  Box,
  InputAdornment,
  Button,
  useMediaQuery,
  useTheme,
  Pagination,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { MoreVert, Add, Delete as DeleteIcon } from '@mui/icons-material';
import { IconSearch } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { CSVExport } from 'utils/TableExports';

// ==============================|| TABLE - HEADER ||============================== //

function ReusableTableHead({ onSelectAllClick, numSelected, rowCount, headCells, showCheckbox = true }) {
  return (
    <TableHead sx={{ backgroundColor: 'grey.100' }}>
      <TableRow>
        {showCheckbox && (
          <TableCell padding="checkbox" sx={{ pl: 3, backgroundColor: 'grey.100' }}>
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all items'
              }}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding="normal"
            sx={{ backgroundColor: 'grey.100', fontWeight: 600 }}
          >
            <Typography variant="h5">{headCell.label}</Typography>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

// ==============================|| TABLE - TOOLBAR ||============================== //

function ReusableTableToolbar({
  numSelected,
  onAdd,
  onDelete,
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Search...',
  addButtonText = 'Add Item',
  title,
  showSearch = true,
  showAddButton = true,
  showDeleteButton = true,
  customActions
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Toolbar
      sx={{
        p: isMobile ? 1 : 0,
        pl: 1,
        pr: 1,
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 2 : 0,
        alignItems: isMobile ? 'stretch' : 'center',
        ...(numSelected > 0 && {
          color: (theme) => theme.palette.secondary.main
        })
      }}
    >
      {/* Selection indicator */}
      {numSelected > 0 && (
        <Typography color="inherit" variant="subtitle1" sx={{ mb: isMobile ? 1 : 0 }}>
          {numSelected} selected
        </Typography>
      )}

      {/* Search and Add Button Container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 2 : 0,
          width: '100%'
        }}
      >
        {/* Search Field */}
        {showSearch && (
          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              justifyContent: isMobile ? 'stretch' : 'center'
            }}
          >
            <TextField
              size="small"
              placeholder={isSmallMobile ? 'Search...' : searchPlaceholder}
              value={searchValue}
              onChange={onSearchChange}
              sx={{
                width: isMobile ? '100%' : 400,
                maxWidth: isMobile ? 'none' : 400
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconSearch size={20} color="#6b7280" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  backgroundColor: '#f9fafb',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e5e7eb'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#d1d5db'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#3b82f6'
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Custom Actions */}
        {customActions && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>{customActions}</Box>}

        {/* Add Button */}
        {showAddButton && onAdd && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onAdd}
            sx={{
              minWidth: isMobile ? '100%' : 'auto',
              whiteSpace: 'nowrap'
            }}
          >
            {isSmallMobile ? 'Add' : addButtonText}
          </Button>
        )}
      </Box>

      {/* Delete Button */}
      {numSelected > 0 && showDeleteButton && onDelete && (
        <Tooltip title="Delete">
          <IconButton size="large" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

// ==============================|| REUSABLE TABLE COMPONENT ||============================== //

const ReusableTable = ({
  // Data props
  data = [], // Array of objects to display in the table (each object must have unique 'id' field)
  headCells = [], // Column configuration array with {id, numeric, label} structure

  // Table configuration
  title = 'Data Table', // Title displayed at the top of the table
  showCheckbox = true, // Show/hide selection checkboxes (equivalent to DataGrid's rowSelection)
  showSearch = true, // Show/hide the search field
  showAddButton = true, // Show/hide the "Add" button in toolbar
  showDeleteButton = true, // Show/hide the "Delete" button when rows are selected
  showPagination = true, // Show/hide pagination controls
  showExport = true, // Show/hide CSV export button

  // Styling
  tableHeight = 500, // Fixed height of the table in pixels (creates scrollable area)
  dense = false, // Use dense table layout (smaller row height)

  // Search functionality
  searchPlaceholder = 'Search...', // Placeholder text for search field
  searchValue = '', // Controlled search value (for external state management)
  onSearchChange = () => {}, // Callback when search value changes

  // Action handlers
  onAdd = null, // Callback when "Add" button is clicked
  onDelete = null, // Callback when "Delete" button is clicked (receives selected row IDs)
  onRowClick = null, // Callback when a row is clicked (overrides default row selection)
  onMenuClick = null, // Callback for menu actions (deprecated, use renderActions instead)
  customActions = null, // Custom action buttons to display in toolbar

  // Export functionality
  exportFilename = 'data.csv', // Filename for CSV export
  exportHeaders = [], // Column headers for CSV export

  // Pagination settings
  rowsPerPageOptions = [5, 10, 25], // Available rows per page options
  defaultRowsPerPage = 5, // Default number of rows per page

  // Custom render functions
  renderCell = null, // Custom cell renderer function (field, row) => JSX
  renderActions = null, // Custom actions renderer function (row) => JSX

  // Additional props (passed to MainCard)
  ...props
}) => {
  const [selected, setSelected] = React.useState([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(defaultRowsPerPage);
  const [selectedValue, setSelectedValue] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelectedId = data.map((n) => n.id);
      setSelected(newSelectedId);
      setSelectedValue(data);
    } else {
      setSelected([]);
      setSelectedValue([]);
    }
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    const selectedRowData = data.filter((row) => newSelected.includes(row.id));
    setSelectedValue(selectedRowData);
    setSelected(newSelected);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchValue) return data;
    return data.filter((row) => Object.values(row).some((value) => String(value).toLowerCase().includes(searchValue.toLowerCase())));
  }, [data, searchValue]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  return (
    <MainCard
      content={false}
      title={title}
      secondary={
        showExport && (
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <CSVExport data={selectedValue.length > 0 ? selectedValue : filteredData} filename={exportFilename} header={exportHeaders} />
            <SecondaryAction link="https://next.material-ui.com/components/tables/" />
          </Stack>
        )
      }
      {...props}
    >
      <ReusableTableToolbar
        numSelected={selected.length}
        onAdd={onAdd}
        onDelete={onDelete}
        searchValue={searchValue}
        onSearchChange={onSearchChange}
        searchPlaceholder={searchPlaceholder}
        addButtonText={`Add ${title}`}
        showSearch={showSearch}
        showAddButton={showAddButton}
        showDeleteButton={showDeleteButton}
        customActions={customActions}
      />

      {/* table */}
      <TableContainer sx={{ maxHeight: tableHeight, overflow: 'auto' }}>
        <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={dense ? 'small' : 'medium'} stickyHeader>
          <ReusableTableHead
            numSelected={selected.length}
            onSelectAllClick={handleSelectAllClick}
            rowCount={filteredData.length}
            headCells={headCells}
            showCheckbox={showCheckbox}
          />
          <TableBody>
            {filteredData.slice(startIndex, endIndex).map((row, index) => {
              if (typeof row === 'number') return null;
              const isItemSelected = isSelected(row.id);
              const labelId = `table-checkbox-${index}`;

              return (
                <TableRow
                  hover
                  onClick={(event) => {
                    // Don't trigger row click if clicking on checkbox or actions
                    if (event.target.type === 'checkbox' || event.target.closest('button')) {
                      return;
                    }
                    if (onRowClick) {
                      onRowClick(event, row);
                    } else {
                      handleClick(event, row.id);
                    }
                  }}
                  role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {showCheckbox && (
                    <TableCell sx={{ pl: 3 }} padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        onChange={(event) => {
                          event.stopPropagation();
                          handleClick(event, row.id);
                        }}
                        inputProps={{
                          'aria-labelledby': labelId
                        }}
                      />
                    </TableCell>
                  )}

                  {headCells.map((headCell) => (
                    <TableCell key={headCell.id} align={headCell.numeric ? 'right' : 'left'}>
                      {headCell.id === 'actions' && renderActions
                        ? renderActions(row)
                        : renderCell
                          ? renderCell(headCell.id, row)
                          : row[headCell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* table pagination */}
      {showPagination && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          {/* Pagination component */}
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
            color="primary"
            // showFirstButton
            // showLastButton
          />
        </Box>
      )}
    </MainCard>
  );
};

// PropTypes
ReusableTableHead.propTypes = {
  onSelectAllClick: PropTypes.func,
  numSelected: PropTypes.number,
  rowCount: PropTypes.number,
  headCells: PropTypes.array,
  showCheckbox: PropTypes.bool
};

ReusableTableToolbar.propTypes = {
  numSelected: PropTypes.number,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  searchPlaceholder: PropTypes.string,
  addButtonText: PropTypes.string,
  title: PropTypes.string,
  showSearch: PropTypes.bool,
  showAddButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  customActions: PropTypes.node
};

ReusableTable.propTypes = {
  data: PropTypes.array,
  headCells: PropTypes.array,
  title: PropTypes.string,
  showCheckbox: PropTypes.bool,
  showSearch: PropTypes.bool,
  showAddButton: PropTypes.bool,
  showDeleteButton: PropTypes.bool,
  showPagination: PropTypes.bool,
  showExport: PropTypes.bool,
  tableHeight: PropTypes.number,
  dense: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onRowClick: PropTypes.func,
  onMenuClick: PropTypes.func,
  customActions: PropTypes.node,
  exportFilename: PropTypes.string,
  exportHeaders: PropTypes.array,
  rowsPerPageOptions: PropTypes.array,
  defaultRowsPerPage: PropTypes.number,
  renderCell: PropTypes.func,
  renderActions: PropTypes.func
};

export default ReusableTable;
