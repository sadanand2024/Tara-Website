import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import ReusableTable from 'utils/ReusableTable';
import AddCandidateDialog from './AddCandidateDialog';

// Define the table columns
const headCells = [
  {
    id: 'name',
    numeric: false,
    label: 'Name'
  },
  {
    id: 'emailId',
    numeric: false,
    label: 'Email ID'
  },
  {
    id: 'personalEmail',
    numeric: false,
    label: 'Personal Email'
  },
  {
    id: 'department',
    numeric: false,
    label: 'Department'
  },
  {
    id: 'panCard',
    numeric: false,
    label: 'PAN Card'
  },
  {
    id: 'aadharCard',
    numeric: false,
    label: 'Aadhar Card'
  },
  {
    id: 'actions',
    numeric: false,
    label: 'Actions'
  }
];

// Sample data
const initialData = [
  {
    id: 1,
    name: 'Kumar',
    emailId: 'kumar@company.com',
    personalEmail: 'kumar.personal@gmail.com',
    department: 'Finance',
    panCard: 'ABCDE1234F',
    aadharCard: '1234-5678-9012'
  },
  {
    id: 2,
    name: 'Priya',
    emailId: 'priya@company.com',
    personalEmail: 'priya.personal@gmail.com',
    department: 'HR',
    panCard: 'FGHIJ5678K',
    aadharCard: '2345-6789-0123'
  },
  {
    id: 3,
    name: 'Rajesh',
    emailId: 'rajesh@company.com',
    personalEmail: 'rajesh.personal@gmail.com',
    department: 'IT',
    panCard: 'KLMNO9012P',
    aadharCard: '3456-7890-1234'
  },
  {
    id: 4,
    name: 'Sneha',
    emailId: 'sneha@company.com',
    personalEmail: 'sneha.personal@gmail.com',
    department: 'Marketing',
    panCard: 'PQRST3456U',
    aadharCard: '4567-8901-2345'
  },
  {
    id: 4,
    name: 'Sneha',
    emailId: 'sneha@company.com',
    personalEmail: 'sneha.personal@gmail.com',
    department: 'Marketing',
    panCard: 'PQRST3456U',
    aadharCard: '4567-8901-2345'
  }
];

const Onboarding = () => {
  const [candidates, setCandidates] = useState(initialData);
  const [searchValue, setSearchValue] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleAddCandidate = () => {
    setOpenDialog(true);
  };

  const handleSaveCandidate = (newCandidate) => {
    const newId = Math.max(...candidates.map((c) => c.id)) + 1;
    const candidateWithId = { ...newCandidate, id: newId };
    setCandidates([...candidates, candidateWithId]);
    setOpenDialog(false);
  };

  const handleDeleteSelected = () => {
    // Handle delete logic here
    console.log('Delete selected candidates');
  };

  const handleRowClick = (event, row) => {
    console.log('Row clicked:', row);
  };

  const renderActions = (row) => (
    <IconButton
      size="small"
      onClick={(event) => {
        event.stopPropagation();
        console.log('Menu clicked for:', row);
      }}
    >
      <MoreVert />
    </IconButton>
  );

  return (
    <>
      <ReusableTable
        // Data props
        data={candidates} // Array of candidate objects with unique 'id' field
        headCells={headCells} // Column configuration for the table
        // Table configuration
        title="Onboarding" // Title displayed at the top
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
        searchPlaceholder="Search candidates..." // Search field placeholder
        searchValue={searchValue} // Controlled search value
        onSearchChange={(e) => setSearchValue(e.target.value)} // Search change handler
        // Action handlers
        onAdd={handleAddCandidate} // Add button click handler
        onDelete={handleDeleteSelected} // Delete selected rows handler
        onRowClick={handleRowClick} // Row click handler (overrides default selection)
        renderActions={renderActions} // Custom actions for each row (MoreVert menu)
        // Export
        exportFilename="onboarding.csv" // CSV export filename
        exportHeaders={[
          // CSV column headers
          { label: 'Name', key: 'name' },
          { label: 'Email ID', key: 'emailId' },
          { label: 'Personal Email', key: 'personalEmail' },
          { label: 'Department', key: 'department' },
          { label: 'PAN Card', key: 'panCard' },
          { label: 'Aadhar Card', key: 'aadharCard' }
        ]}
        // Pagination settings
        rowsPerPageOptions={[5, 10, 25]} // Available rows per page options
        defaultRowsPerPage={2} // Default rows per page

        // Note: DataGrid props like disableColumnMenu, disableColumnFilter, etc.
        // are not applicable to ReusableTable as it uses Material-UI Table, not DataGrid
        // Column sorting is always enabled, column filtering is handled via search
      />

      <AddCandidateDialog openDialog={openDialog} handleCloseDialog={() => setOpenDialog(false)} handleSave={handleSaveCandidate} />
    </>
  );
};

export default Onboarding;
