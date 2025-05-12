import React, { useState, useRef, useEffect } from 'react';
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
import Factory from '../../../utils/Factory';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { current } from '@reduxjs/toolkit';
import FolderOffIcon from '@mui/icons-material/FolderOff';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import { useSnackbar } from 'notistack';
import { useSelector } from 'react-redux';
import CircularProgress from '@mui/material/CircularProgress';

const folders = {
  PermanentWorkingPapers: 'Permanent Working Papers',
  CurrentWorkPapers: 'Current Working Papers',
  OtherDocuments: 'Other Documents'
};

const recentFiles = [
  { name: 'Krishna Sai kannekanti.pdf', date: '2021-20-21' },
  { name: 'Mockups.csv', date: '2021-20-21' },
  { name: 'Employee Plan.docx', date: '2021-20-21' },
  { name: '3f7e22c2-b74d-4a9e-8102-4c303fa32b34.csv', date: '2021-20-21' },
  { name: 'Mockups.pdf', date: '2021-20-21' },
  { name: 'Krishna Sai kannekanti.pdf', date: '2021-20-21' },
  { name: 'Profile.docx', date: '2021-20-21' }
];

const allFiles = [
  { name: 'Milestone', size: '32 KB', type: 'folder', lastEdit: 'March 1, 2022 By, Nazar Becks' },
  { name: 'Public Documents', size: '24 MB', type: 'folder', lastEdit: 'March 1, 2022 By, Alex Hal' },
  { name: 'Architectures for Projects', size: '50 MB', type: 'doc', lastEdit: 'March 1, 2022 By, John DC' },
  { name: 'Timelines', size: '15 KB', type: 'pdf', lastEdit: 'March 1, 2022 By, King Kong' },
  { name: 'Project Videos', size: '24 MB', type: 'folder', lastEdit: 'March 1, 2022 By, Sarah Williams' },
  { name: 'Floor Plan Details', size: '50 MB', type: 'csv', lastEdit: 'March 1, 2022 By, Rajan Mani Poudel' }
];

const getFileType = (file) => {
  if (typeof file.type === 'string' && file.type.length > 0) return file.type;
  if (file.name && typeof file.name === 'string') {
    const ext = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'csv'].includes(ext)) return ext;
    if (['xlsx', 'xls'].includes(ext)) return 'csv';
    if (['docx'].includes(ext)) return 'doc';
    if (ext && ext.length < 8) return ext; // fallback for short extensions
  }
  return '';
};

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

const MUIGrid = ({ children, name, details, detailskey, idx }) => {
  return (
    <Grid
      key={idx}
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
      onClick={() => {
        if (detailskey === 'folder') {
          //OPEN Files and Folders in the folder
          console.log(details.id);
        } else {
          console.log('files');
        }
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

const EmptyState = ({ type = 'folder', onAction }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      minHeight: 220,
      color: 'text.secondary',
      border: '1px dashed #e0e0e0',
      borderRadius: 2,
      background: '#fafbfc'
    }}
  >
    {type === 'folder' ? (
      <FolderOffIcon sx={{ fontSize: 56, mb: 1, color: '#bdbdbd' }} />
    ) : (
      <InsertDriveFileOutlinedIcon sx={{ fontSize: 56, mb: 1, color: '#bdbdbd' }} />
    )}
    <Typography variant="h6" sx={{ mb: 1 }}>
      {type === 'folder' ? 'No Folders Found' : 'No Files Found'}
    </Typography>
    <Typography variant="body2" sx={{ mb: 2 }}>
      {type === 'folder'
        ? 'There are no folders here yet. Create a new folder to get started!'
        : 'There are no files in this folder yet. Upload files to see them here.'}
    </Typography>
    {onAction && (
      <Button variant="contained" color="primary" onClick={onAction}>
        {type === 'folder' ? 'Create Folder' : 'Upload File'}
      </Button>
    )}
  </Box>
);

const DocumentWallet = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const { enqueueSnackbar } = useSnackbar();
  const [walletId, setWalletId] = useState(null);
  const [newFolderPopup, setNewFolderPopup] = useState(false);
  const fileInputRef = useRef(null);
  const [startYear, setStartYear] = useState('');
  const [financialYear, setFinancialYear] = useState('');
  const [initialFolders, setInitialFolders] = useState([]);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [isRootFolder, setIsRootFolder] = useState(true);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [currentContents, setCurrentContents] = useState({ folders: [], files: [], subFolders: [] });
  const [folderName, setFolderName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInitialFolders = async () => {
    setLoading(true);
    try {
      const response = await Factory('get', `/docwallet/wallet-info?context_id=${user.active_context.id}`, {}, {});
      if (response.res.status_cd === 0) {
        if (response.res.data.length > 0) {
          setInitialFolders(response.res.data);
          setWalletId(response.res.data[0].wallet);
        } else {
          setInitialFolders([]);
          setWalletId(null);
        }
      } else {
      }
    } catch (error) {
      console.log('Error loading folders.', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    getInitialFolders();
  }, []);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setFolderName(value);
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

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    if (files.length > 0) {
      uploadFiles(files);
    }
  };

  const uploadFiles = async (filesToUpload = selectedFiles) => {
    if (!filesToUpload.length) return;
    setLoading(true);
    let formData = new FormData();
    filesToUpload.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('wallet', walletId);
    formData.append('folder', currentFolderId);
    try {
      const response = await Factory('post', `/docwallet/documents/`, formData, {});
      if (response.res.status_cd === 0) {
        enqueueSnackbar('Files uploaded successfully.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        setSelectedFiles([]);
        fileInputRef.current.value = '';
        // Optionally refresh folder contents
        if (currentFolderId) fetchFolderContents(currentFolderId, breadcrumbs[breadcrumbs.length - 1]?.name, true);
      } else {
        enqueueSnackbar('Failed to upload files.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    } catch (error) {
      enqueueSnackbar('Error uploading files.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
    setLoading(false);
  };

  // Handler for root folder click
  const handleRootFolderClick = (folder) => {
    fetchFolderContents(folder.id, folder.name, true);
  };

  // Fetch folder contents by id
  const fetchFolderContents = async (folderId, folderName, isRoot = false, customBreadcrumbs = null) => {
    setLoading(true);
    try {
      const url = `/docwallet/folders/${folderId}/files/`;
      const response = await Factory('get', url, {}, {});
      if (response.res.status_cd === 0) {
        setCurrentContents({
          folders: response.res.data.folder || [],
          files: response.res.data.documents || [],
          subFolders: response.res.data.subfolders || []
        });
        setCurrentFolderId(folderId);
        if (customBreadcrumbs) {
          setBreadcrumbs(customBreadcrumbs);
        } else {
          setBreadcrumbs((prev) => (isRoot ? [{ id: folderId, name: folderName }] : [...prev, { id: folderId, name: folderName }]));
        }
      } else {
        console.log('Failed to load folder contents.', response);
      }
    } catch (error) {
      console.log('Error loading folder contents.', error);
    }
    setLoading(false);
  };

  // Breadcrumb click handler
  const handleBreadcrumbClick = (idx) => {
    const crumb = breadcrumbs[idx];
    const newTrail = breadcrumbs.slice(0, idx + 1);
    setBreadcrumbs(newTrail);
    fetchFolderContents(crumb.id, crumb.name, false, newTrail);
  };

  const createFolder = async () => {
    setLoading(true);
    let __create_folder_data = {
      name: folderName,
      wallet: walletId,
      parent: currentFolderId
    };
    try {
      const response = await Factory('post', '/docwallet/folders/', __create_folder_data, {});
      if (response.res.status_cd === 0) {
        console.log(response.res);
        let folderContents = currentContents;
        setCurrentContents({ ...folderContents, subFolders: [...folderContents.subFolders, response.res] });
        enqueueSnackbar('Folder created successfully.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
        setNewFolderPopup(false);
      } else {
        enqueueSnackbar('Failed to create folder.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    } catch (error) {
      enqueueSnackbar('Error creating folder.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
    setLoading(false);
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
          {/* Breadcrumb Data */}
          <Breadcrumbs>
            <Typography
              key="root"
              variant="body2"
              color={currentFolderId === null ? 'text.primary' : 'inherit'}
              onClick={() => {
                if (currentFolderId !== null) {
                  setCurrentFolderId(null);
                  setBreadcrumbs([]);
                  getInitialFolders();
                }
              }}
              sx={{ cursor: currentFolderId === null ? 'default' : 'pointer' }}
            >
              Home
            </Typography>
            {breadcrumbs.map((crumb, idx) => (
              <Typography
                key={crumb.id}
                variant="body2"
                color={idx === breadcrumbs.length - 1 && currentFolderId !== null ? 'text.primary' : 'inherit'}
                onClick={() => handleBreadcrumbClick(idx)}
                sx={{ cursor: idx === breadcrumbs.length - 1 && currentFolderId !== null ? 'default' : 'pointer' }}
              >
                {crumb.name}
              </Typography>
            ))}
          </Breadcrumbs>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', sm: 'auto' } }}>
          <TextField size="small" placeholder="Search..." sx={{ minWidth: { xs: 120, sm: 180 }, flex: 1 }} />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleUploadClick} color="primary">
            Upload File
          </Button>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileInputChange} />
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
      {/* Folders */}
      {currentFolderId === null ? (
        <Box sx={{ mb: 4 }}>
          <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
            Folders
          </Typography>
          {initialFolders.length === 0 ? (
            <EmptyState type="folder" onAction={() => setNewFolderPopup(true)} />
          ) : (
            <Grid container spacing={2}>
              {initialFolders.map((folder, idx) => (
                <Grid
                  key={folder.id}
                  size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
                  onClick={() => handleRootFolderClick(folder)}
                  sx={{
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
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
                      <Tooltip title={folder.name} placement="bottom">
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
                          {folders[folder.name] || folder.name}
                        </Typography>
                      </Tooltip>
                      <Typography variant="caption" color="text.secondary">
                        {''}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
              Folders
            </Typography>
            {currentContents.subFolders.length === 0 ? (
              <EmptyState type="folder" onAction={() => setNewFolderPopup(true)} />
            ) : (
              <Grid container spacing={2}>
                {currentContents.subFolders.map((folder, idx) => (
                  <Grid
                    key={folder.id}
                    size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}
                    onClick={() => fetchFolderContents(folder.id, folder.name)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
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
                        <Tooltip title={folder.name} placement="bottom">
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
                        </Tooltip>
                        <Typography variant="caption" color="text.secondary">
                          {''}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
          <Box>
            {currentContents.files.length === 0 ? (
              <EmptyState type="file" onAction={handleUploadClick} />
            ) : (
              <>
                <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
                  Files
                </Typography>
                <Grid container spacing={2}>
                  {currentContents.files.map((file, idx) => (
                    <MUIGrid name={file.name} details={file.date} detailskey={'file'} key={idx} idx={idx}>
                      <Stack
                        direction="row"
                        className="file-item"
                        sx={{
                          border: '1px solid #ededed',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          borderRadius: 1.5,
                          p: 2,
                          gap: 1.5,
                          alignItems: 'center',
                          minWidth: 0,
                          width: '100%'
                        }}
                      >
                        {getFileIcon(getFileType(file))}
                        <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
                          <Tooltip title={file.name} placement="bottom">
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
                          </Tooltip>
                          <Typography variant="caption" color="text.secondary">
                            Uploaded :
                            {new Date(file.uploaded_at).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </Typography>
                        </Box>
                      </Stack>
                    </MUIGrid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        </>
      )}
      <Divider sx={{ my: 2 }} />
      {/* Recently Accessed */}
      <Box sx={{ mb: 4 }}>
        <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
          Recently Accessed
        </Typography>
        <Grid container spacing={2}>
          {recentFiles.map((file, idx) => (
            <MUIGrid name={file.name} details={file.date} detailskey={'file'} key={idx} idx={idx}>
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
                {getFileIcon(getFileType(file))}
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
          <Typography fontWeight={500}>All Folders & Files</Typography>
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
                    {getFileIcon(getFileType(file))}
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
                  <TableCell>
                    {(() => {
                      const type = getFileType(file);
                      return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';
                    })()}
                  </TableCell>
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
            <Typography variant="h4" mb={0.5} textAlign="left" color="text.primary">
              Folder Name
            </Typography>
            {currentFolderId === 'CurrentWorkPapers' ? (
              <>
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

                <Typography variant="caption" fullWidth sx={{ mt: 0.5, color: 'text.secondary', width: '500px' }}>
                  Enter starting year only (e.g. 2023 → 2023-24)
                </Typography>
              </>
            ) : (
              <TextField fullWidth onChange={(e) => setFolderName(e.target.value)} value={folderName} placeholder="Enter Folder Name" />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewFolderPopup(false)}>Cancel</Button>
          <Button onClick={createFolder}>Create</Button>
        </DialogActions>
      </Dialog>
      {loading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            bgcolor: 'rgba(255,255,255,0.5)',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <CircularProgress size={60} thickness={5} />
        </Box>
      )}
    </Box>
  );
};

export default DocumentWallet;
