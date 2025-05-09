import React, { useState, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FolderIcon from '@mui/icons-material/Folder';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import Grid from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import AddIcon from '@mui/icons-material/Add';
import Stack from '@mui/material/Stack';
import Dialog from '@mui/material/Dialog';
import InputBase from '@mui/material/InputBase';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
// Sample data arrays
const folders = [
  { name: 'Permanent Working Papers', date: false },
  { name: 'Current Working Papers', date: false },
  { name: 'Miscellaneous Documents', date: false }
];

const recentFiles = [
  { name: 'Krishna Sai kannekanti.pdf', date: '2021-20-21', type: 'pdf' },
  { name: 'Mockups', date: '2021-20-21', type: 'folder' },
  { name: 'Employee Plan', date: '2021-20-21', type: 'csv' },
  { name: '3f7e22c2-b74d-4a9e-8102-4c303fa32b34', date: '2021-20-21', type: 'csv' },
  { name: 'Mockups', date: '2021-20-21', type: 'folder' },
  { name: 'Krishna Sai kannekanti.pdf', date: '2021-20-21', type: 'pdf' },
  { name: 'Profile', date: '2021-20-21', type: 'doc' }
];

const allFiles = [
  { name: 'Milestone', size: '32 KB', type: 'folder', lastEdit: 'March 1, 2022 By, Nazar Becks' },
  { name: 'Public Documents', size: '24 MB', type: 'folder', lastEdit: 'March 1, 2022 By, Alex Hal' },
  { name: 'Architectures for Projects', size: '50 MB', type: 'doc', lastEdit: 'March 1, 2022 By, John DC' },
  { name: 'Timelines', size: '15 KB', type: 'pdf', lastEdit: 'March 1, 2022 By, King Kong' },
  { name: 'Project Videos', size: '24 MB', type: 'folder', lastEdit: 'March 1, 2022 By, Sarah Williams' },
  { name: 'Floor Plan Details', size: '50 MB', type: 'csv', lastEdit: 'March 1, 2022 By, Rajan Mani Poudel' }
];

const getFileIcon = (type) => {
  switch (type) {
    case 'pdf':
      return <PictureAsPdfIcon fontSize="large" sx={{ color: '#e53935' }} />;
    case 'doc':
      return <DescriptionIcon fontSize="large" sx={{ color: '#1976d2' }} />;
    case 'csv':
      return <TableChartIcon fontSize="large" sx={{ color: '#388e3c' }} />;
    case 'folder':
      return <FolderIcon fontSize="large" sx={{ color: '#fbc02d' }} />;
    default:
      return <InsertDriveFileIcon fontSize="large" sx={{ color: '#757575' }} />;
  }
};

const TooltipMUI = ({ name, children }) => {
  return (
    <Tooltip
      title={name}
      placement="bottom"
      slotProps={{
        tooltip: {
          sx: {
            backgroundColor: 'rgba(1, 1, 1, 0.6)',
            fontSize: '0.8rem',
            padding: '6px 10px'
          }
        }
      }}
    >
      {children}
    </Tooltip>
  );
};

const MUIGrid = ({ children, name }) => {
  return (
    <Grid
      key={name}
      item
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      onClick={() => {
        console.log(name);
      }}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)'
        }
      }}
    >
      {children}
    </Grid>
  );
};

const DocumentWallet = () => {
  const [newFolderPopup, setNewFolderPopup] = useState(false);
  const fileInputRef = useRef(null);
  const [startYear, setStartYear] = useState('');
  const [financialYear, setFinancialYear] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setStartYear(value);
  };
  const handleKeyDown = (e) => {
    console.log(e);
  };
  const getFormattedValue = () => {
    if (startYear.length === 0) return '';
    if (startYear.length < 4) return startYear;
    const suffix = (parseInt(startYear.slice(2), 10) + 1).toString().padStart(2, '0');
    return `${startYear}-${suffix}`;
  };
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 2,
        p: { xs: 1, sm: 2, md: 3 },

        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        width: '100%'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 3,
          gap: 2
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={600} sx={{ m: 0, fontSize: { xs: 18, sm: 22 } }}>
            Document Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Home / Document Library
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <TextField size="small" placeholder="Search..." sx={{ minWidth: { xs: 120, sm: 180 }, flex: 1 }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleUploadClick} color="primary">
            Upload File
          </Button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple />
          <Button
            startIcon={<AddIcon />}
            variant="outlined"
            color="primary"
            onClick={() => {
              setNewFolderPopup(true);
            }}
          >
            New Folder
          </Button>
        </Box>
      </Box>
      {/* Recently Accessed */}
      <Box sx={{ mb: 4 }}>
        <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
          Recently Accessed
        </Typography>
        <Grid container spacing={2}>
          {recentFiles.map((file, idx) => (
            <MUIGrid name={file.name}>
              <Stack
                direction="row"
                className="recent-item"
                sx={{
                  border: '1px solid #ededed',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderRadius: 1.5,
                  p: 2,
                  pr: 2,
                  gap: 1.5,
                  alignItems: 'center',
                  minWidth: 0,
                  width: '100%'
                }}
              >
                {getFileIcon(file.type)}
                <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
                  <TooltipMUI name={file.name}>
                    <Typography
                      fontWeight={500}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        maxWidth: '100%',
                        fontSize: { xs: 13, sm: 15 }
                      }}
                    >
                      {file.name}
                    </Typography>
                  </TooltipMUI>
                  <Typography variant="caption" color="text.secondary">
                    Date: {file.date}
                  </Typography>
                </Box>
              </Stack>
            </MUIGrid>
          ))}
        </Grid>
      </Box>
      {/* Folders */}
      <Box sx={{ mb: 4 }}>
        <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
          Folders
        </Typography>
        <Grid container spacing={2}>
          {folders.map((folder, idx) => (
            <MUIGrid name={folder.name}>
              <Box
                className="folder-item"
                sx={{
                  border: '1px solid #ededed',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  borderRadius: 1.5,
                  p: 2,
                  minWidth: 0,
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5
                }}
              >
                <FolderIcon fontSize="large" sx={{ color: '#fbc02d', flexShrink: 0 }} />
                <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
                  <TooltipMUI name={folder.name}>
                    <Typography
                      fontWeight={500}
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        width: '100%',
                        maxWidth: '100%',
                        fontSize: { xs: 13, sm: 15 }
                      }}
                    >
                      {folder.name}
                    </Typography>
                  </TooltipMUI>
                  <Typography variant="caption" color="text.secondary">
                    {folder.date ? `Date: ${folder.date}` : ''}
                  </Typography>
                </Box>
              </Box>
            </MUIGrid>
          ))}
        </Grid>
      </Box>
      <Divider sx={{ my: 2 }} />
      {/* All Files Table */}
      <Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            mb: 1,
            gap: 1
          }}
        >
          <Typography fontWeight={500}>All Files</Typography>
          <Select size="small" defaultValue="Sort By" sx={{ minWidth: 120 }}>
            <MenuItem value="Sort By">Sort By</MenuItem>
            <MenuItem value="Name">Name</MenuItem>
            <MenuItem value="Date">Date</MenuItem>
            <MenuItem value="Type">Type</MenuItem>
          </Select>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
          <Table size="small">
            <TableHead sx={{ background: '#f5f5f5' }}>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Last Edit</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allFiles.map((file, idx) => (
                <TableRow key={file.name + idx}>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
                    {getFileIcon(file.type)}
                    <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
                      <TooltipMUI name={file.name}>
                        <Typography
                          fontWeight={500}
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            width: '100%',
                            maxWidth: '100%',
                            fontSize: { xs: 13, sm: 15 }
                          }}
                        >
                          {file.name}
                        </Typography>
                      </TooltipMUI>
                    </Box>
                  </TableCell>
                  <TableCell>{file.size}</TableCell>
                  <TableCell>{file.type.charAt(0).toUpperCase() + file.type.slice(1)}</TableCell>
                  <TableCell>{file.lastEdit}</TableCell>
                  <TableCell>
                    <Typography sx={{ cursor: 'pointer' }}>⋮</Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={newFolderPopup} onClose={() => setNewFolderPopup(false)}>
        <DialogContent>
          <Box>
            <Typography variant="h6" mb={0.5} textAlign="left" color="text.primary">
              Folder Name
            </Typography>

            <InputBase
              fullWidth
              value={getFormattedValue()}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              inputProps={{
                inputMode: 'numeric',
                maxLength: 4
              }}
              sx={{
                fontSize: '1rem',
                padding: '8px 12px',
                borderBottom: '1px solid rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                letterSpacing: '0.1em'
              }}
            />

            <Typography variant="caption" sx={{ mt: 0.5, color: 'text.secondary' }}>
              Enter starting year only (e.g. 2023 → 2023-24)
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderPopup(false)}>Cancel</Button>
          <Button onClick={() => setNewFolderPopup(false)}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentWallet;
