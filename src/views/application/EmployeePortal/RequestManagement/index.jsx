import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  IconButton
} from '@mui/material';
import ReusableTable from 'utils/ReusableTable';
import { MoreVert } from '@mui/icons-material';
import RaiseRequestDialog from './RaiseRequestDialog';
const RequestManagement = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [raiseRequestDialogOpen, setRaiseRequestDialogOpen] = useState(false);
  const headCells = [
    { id: 'request_id', label: 'Request ID' },
    { id: 'request_type', label: 'Request Type' },
    { id: 'request_date', label: 'Request Date' },
    { id: 'status', label: 'Status' },
    { id: 'action', label: 'Action' }
  ];
  const data = [
    { id: 1, request_id: '123456', request_type: 'Leave', request_date: '2021-01-01', status: 'Pending' },
    { id: 2, request_id: '123457', request_type: 'Leave', request_date: '2021-01-02', status: 'Pending' },
    { id: 3, request_id: '123458', request_type: 'Leave', request_date: '2021-01-03', status: 'Pending' }
  ];

  const handleAddCandidate = () => {
    console.log('Add Candidate');
    setRaiseRequestDialogOpen(true);
  };

  const handleDeleteSelected = () => {
    console.log('Delete Selected');
  };

  const handleRowClick = (row) => {
    console.log('Row Clicked', row);
  };

  const renderActions = (row) => {
    return (
      <IconButton onClick={() => handleRowClick(row)}>
        <MoreVert />
      </IconButton>
    );
  };

  const getLeaveRequests = async () => {
    setLoading(true);
  };

  useEffect(() => {
    // getLeaveRequests();
  }, []);

  return (
    <Box sx={{ m: 1 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, color: '#0A1F44', mb: 2 }}>
        Request Management
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="My Requests" />
          <Tab label="Team Requests" />
        </Tabs>
      </Box>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          border: `1.5px solid #E5EAF2`,
          boxShadow: '0 2px 8px 0 rgba(24, 39, 75, 0.05)',
          minHeight: 300,
          overflow: 'hidden'
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
            <CircularProgress />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              Loading requests...
            </Typography>
          </Box>
        ) : (
          <>
            {activeTab === 0 ? (
              <ReusableTable
                // Data props
                data={data} // Array of candidate objects with unique 'id' field
                headCells={headCells} // Column configuration for the table
                // Table configuration
                title="" // Title displayed at the top
                showCheckbox={true} // Show selection checkboxes (equivalent to DataGrid's rowSelection)
                showSearch={true} // Show search field
                showAddButton={true} // Show "Add Candidate" button
                showDeleteButton={true} // Show delete button when rows are selected
                showPagination={true} // Show pagination controls
                showExport={true} // Show CSV export button
                disableColumnFilter={true} // Disable search/filtering functionality (equivalent to DataGrid's disableColumnFilter)
                // Styling
                tableHeight={500} // Fixed height with scroll (equivalent to DataGrid's autoHeight)
                dense={true} // Normal row height (set to true for compact view)
                // Search functionality
                searchPlaceholder="Search requests..." // Search field placeholder
                searchValue={searchValue} // Controlled search value
                onSearchChange={(e) => setSearchValue(e.target.value)} // Search change handler
                // Action handlers
                onAdd={handleAddCandidate} // Add button click handler
                onDelete={handleDeleteSelected} // Delete selected rows handler
                onRowClick={handleRowClick} // Row click handler (overrides default selection)
                renderActions={renderActions} // Custom actions for each row (MoreVert menu)
                // Export
                exportFilename="request-management.csv" // CSV export filename
                exportHeaders={[
                  // CSV column headers
                  { label: 'Request ID', key: 'request_id' },
                  { label: 'Request Type', key: 'request_type' },
                  { label: 'Request Date', key: 'request_date' },
                  { label: 'Status', key: 'status' },
                  { label: 'Action', key: 'action' }
                ]}
                // Pagination settings
                rowsPerPageOptions={[5, 10, 25]} // Available rows per page options
                defaultRowsPerPage={2} // Default rows per page

                // Note: DataGrid props like disableColumnMenu, disableColumnFilter, etc.
                // are not applicable to ReusableTable as it uses Material-UI Table, not DataGrid
                // Column sorting is always enabled, column filtering is handled via search
              />
            ) : (
              <ReusableTable
                data={data} // Array of candidate objects with unique 'id' field
                headCells={headCells} // Column configuration for the table
                // Table configuration
                title="" // Title displayed at the top
                showCheckbox={true} // Show selection checkboxes (equivalent to DataGrid's rowSelection)
                showSearch={true} // Show search field
                showAddButton={true} // Show "Add Candidate" button
                showDeleteButton={true} // Show delete button when rows are selected
                showPagination={true} // Show pagination controls
                showExport={true} // Show CSV export button
                disableColumnFilter={true} // Disable search/filtering functionality (equivalent to DataGrid's disableColumnFilter)
                // Styling
                tableHeight={500} // Fixed height with scroll (equivalent to DataGrid's autoHeight)
                dense={true} // Normal row height (set to true for compact view)
                // Search functionality
                searchPlaceholder="Search requests..." // Search field placeholder
                searchValue={searchValue} // Controlled search value
                onSearchChange={(e) => setSearchValue(e.target.value)} // Search change handler
                // Action handlers
                onAdd={handleAddCandidate} // Add button click handler
                onDelete={handleDeleteSelected} // Delete selected rows handler
                onRowClick={handleRowClick} // Row click handler (overrides default selection)
                renderActions={renderActions} // Custom actions for each row (MoreVert menu)
                // Export
                exportFilename="request-management.csv" // CSV export filename
                exportHeaders={[
                  // CSV column headers
                  { label: 'Request ID', key: 'request_id' },
                  { label: 'Request Type', key: 'request_type' },
                  { label: 'Request Date', key: 'request_date' },
                  { label: 'Status', key: 'status' },
                  { label: 'Action', key: 'action' }
                ]}
                // Pagination settings
                rowsPerPageOptions={[5, 10, 25]} // Available rows per page options
                defaultRowsPerPage={2} // Default rows per page
              />
            )}
            <RaiseRequestDialog open={raiseRequestDialogOpen} onClose={() => setRaiseRequestDialogOpen(false)} />
          </>
        )}
      </Paper>
    </Box>
  );
};

export default RequestManagement;
