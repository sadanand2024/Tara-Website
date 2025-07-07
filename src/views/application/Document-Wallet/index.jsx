import React, { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FolderIcon from '@mui/icons-material/Folder';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import TableChartIcon from '@mui/icons-material/TableChart';
import Grid from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';
import Divider from '@mui/material/Divider';
import SearchIcon from '@mui/icons-material/Search';
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
import HomeIcon from '@mui/icons-material/Home';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ImageIcon from '@mui/icons-material/Image';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import CodeIcon from '@mui/icons-material/Code';
import JavascriptIcon from '@mui/icons-material/Javascript';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconFileTypeJs, IconJson, IconCode, IconBrandJavascript } from '@tabler/icons-react';
import SearchUI from './searchUI';

const folders = {
  PermanentWorkingPapers: 'Permanent Working Papers',
  CurrentWorkingPapers: 'Current Working Papers',
  OtherDocuments: 'Other Documents'
};

const getFileType = (file) => {
  if (typeof file.type === 'string' && file.type.length > 0) return file.type;
  if (file.name && typeof file.name === 'string') {
    const ext = file.name.split('.').pop().toLowerCase();
    if (['pdf', 'doc', 'csv'].includes(ext)) return ext;
    if (['xlsx', 'xls'].includes(ext)) return 'csv';
    if (['js'].includes(ext)) return 'js';
    if (['json'].includes(ext)) return 'json';
    if (['txt'].includes(ext)) return 'txt';
    if (['docx'].includes(ext)) return 'doc';
    if (['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'ico', 'webp'].includes(ext)) return 'image';
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
    case 'js':
      return <IconBrandJavascript fontSize="large" width="2.5rem" height="2.5rem" color="#ef6a37" />;
    case 'json':
      return <IconCode fontSize="large" width="2.5rem" height="2.5rem" color="#638ed4" />;
    case 'txt':
      return <DescriptionIcon fontSize="large" sx={{ color: '#1976d2' }} />;
    case 'folder':
      return <FolderIcon fontSize="large" sx={{ color: '#fbc02d' }} />;
    case 'image':
      return <ImageIcon fontSize="large" sx={{ color: 'primary.main' }} />;
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

const MUIGrid = ({ children, name, details, detailskey, idx, viewFile }) => {
  return (
    <Grid
      key={idx}
      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.6 }}
      onClick={() => {
        viewFile(details);
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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentFiles, setRecentFiles] = useState([]);
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [menuTarget, setMenuTarget] = useState(null);
  const [actions, setActions] = useState({
    data: null,
    edit: false,
    delete: false
  });
  const [folderName, setFolderName] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const resetActions = () => {
    setStartYear('');
    setFolderName('');
    setActions({ data: null, edit: false, delete: false });
    setNewFolderPopup(false);
  };

  useEffect(() => {
    if (actions.data) {
      setFolderName(actions.data.name);
    }
  }, [actions.data]);

  const createInitialFolders = async () => {
    setLoading(true);
    try {
      const response = await Factory(
        'post',
        `/docwallet/context-docs`,
        {
          context: user.active_context.id
        },
        {}
      );
      if (response.res.status_cd === 0) {
        window.location.reload();
      }
    } catch (error) {
      console.log('Error loading folders.', error);
    }
    setLoading(false);
  };

  const getInitialFolders = async () => {
    setLoading(true);
    try {
      const response = await Factory('get', `/docwallet/wallet-info?context_id=${user.active_context.id}`, {}, {});
      if (response.res.status === 404) {
        createInitialFolders();
      }
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

  const getRecentFiles = async () => {
    setLoading(true);
    const response = await Factory('get', `/docwallet/list_last_10_uploaded_files?context_id=${user.active_context.id}`, {}, {});
    if (response.res.status_cd === 0) {
      setRecentFiles(response.res.data);
    } else {
      setRecentFiles([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user.active_context) {
      setCurrentFolderId(null);
      setBreadcrumbs([]);
      fetchFolderContents(null, null, true);
    }
    getInitialFolders();
    getRecentFiles();
  }, [user.active_context]);

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
        if (currentFolderId) fetchFolderContents(currentFolderId, breadcrumbs[breadcrumbs.length - 1]?.name, false, null, false);
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
  const fetchFolderContents = async (folderId, folderName, isRoot = false, customBreadcrumbs = null, refresh = true) => {
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
        if (refresh) {
          if (customBreadcrumbs) {
            setBreadcrumbs(customBreadcrumbs);
          } else {
            setBreadcrumbs((prev) =>
              isRoot ? [{ id: folderId, name: folders[folderName] || folderName }] : [...prev, { id: folderId, name: folderName }]
            );
          }
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
      let apiType = actions.edit ? 'put' : 'post';
      let url = actions.edit ? `/docwallet/folders/${actions.data.id}/` : `/docwallet/folders/`;

      const response = await Factory(apiType, url, __create_folder_data, {});
      if (response.res.status_cd === 0) {
        let folderContents = currentContents;
        if (actions.edit) {
          folderContents.subFolders = folderContents.subFolders.map((folder) =>
            folder.id === response.res.data.id ? response.res.data : folder
          );
        } else {
          setCurrentContents({ ...folderContents, subFolders: [...folderContents.subFolders, response.res] });
        }
        enqueueSnackbar(`Folder ${actions.edit ? 'updated' : 'created'} successfully.`, {
          variant: 'success',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
        setNewFolderPopup(false);
      } else {
        enqueueSnackbar('Failed to create folder.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    } catch (error) {
      enqueueSnackbar('Error creating folder.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
    resetActions();
    setLoading(false);
  };

  const viewFile = async (fileDetails) => {
    setPreviewLoading(true);
    const response = await Factory('get', `/docwallet/generate_presigned_url?url=${fileDetails.file}`, {}, {});
    if (response.res.status_cd === 0) {
      let url = response.res.data.url;
      const type = getFileType(fileDetails);
      if (type === 'pdf') {
        url += '#view=FitH';
        setPreviewUrl(url);
        setPreviewOpen(true);
      } else if (type === 'csv' || type === 'xlsx' || type === 'xls' || type === 'docx') {
        // Download and close preview
        window.open(url, '_blank');
        setPreviewOpen(false);
        setPreviewUrl('');
        setPreviewLoading(false);
        enqueueSnackbar('This file type cannot be previewed. Downloading...', {
          variant: 'info',
          anchorOrigin: { vertical: 'top', horizontal: 'right' }
        });
      } else {
        setPreviewUrl(url);
        setPreviewOpen(true);
      }
    } else {
      enqueueSnackbar('Error generating presigned url.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      setPreviewLoading(false);
    }
  };

  const handleStartYearChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (value.length === 4) {
      let folderName = value + '-' + ((parseInt(value.slice(2)) + 1) % 100);
      setFolderName(folderName);
    }
    setStartYear(value);
  };

  const getEndYearShort = () => {
    if (startYear.length === 4) return ((parseInt(startYear.slice(2)) + 1) % 100).toString().padStart(2, '0');
    return '';
  };

  const handleMenuOpen = (event, target) => {
    event.preventDefault();
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setMenuTarget(target);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuTarget(null);
  };

  const handleDeleteClick = () => {
    handleMenuClose();
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    if (actions.data) {
      if (actions.data.file) {
        const response = await Factory('delete', `/docwallet/remove_file/${actions.data.id}/`, {}, {});
        if (response.res.status_cd === 0) {
          setCurrentContents({ ...currentContents, files: currentContents.files.filter((file) => file.id !== actions.data.id) });
          getRecentFiles();
        }
      } else {
        const response = await Factory('delete', `/docwallet/delete_folder/${actions.data.id}/`, {}, {});
        if (response.res.status_cd === 0) {
          setCurrentContents({
            ...currentContents,
            subFolders: currentContents.subFolders.filter((folder) => folder.id !== actions.data.id)
          });
          getRecentFiles();
        }
      }
    }
    setDeleteLoading(false);
    setConfirmDeleteOpen(false);
  };

  const fileNameChange = async (target) => {
    setLoading(true);
    let formData = new FormData();
    formData.append('name', folderName + '.' + actions.fileType);
    try {
      const response = await Factory('patch', `/docwallet/documents/${target.id}/`, formData, {});
      if (response.res.status_cd === 0) {
        if (currentFolderId) fetchFolderContents(currentFolderId, breadcrumbs[breadcrumbs.length - 1]?.name, false, null, false);
        getRecentFiles();
        handleSearch(searchQuery);
        enqueueSnackbar('File name changed successfully.', { variant: 'success', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      } else {
        enqueueSnackbar('Failed to upload files.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
      }
    } catch (error) {
      enqueueSnackbar('Error uploading files.', { variant: 'error', anchorOrigin: { vertical: 'top', horizontal: 'right' } });
    }
    resetActions();
    setLoading(false);
  };

  const nameChange = (target) => {
    if (target.file) {
      let fileName = target?.name;
      const fileType = fileName.split('.').pop();
      fileName = fileName.replace(`.${fileType}`, '');
      setFolderName(fileName);
      setActions({ data: target, edit: true, delete: false, fileType: fileType });
      setNewFolderPopup(true);
      handleMenuClose();
    } else {
      setActions({ data: target, edit: true, delete: false });
      setFolderName(target?.name);
      setNewFolderPopup(true);
      handleMenuClose();
    }
  };

  const handleSearch = async (val) => {
    setSearchQuery(val);
    if (val.length >= 2) {
      const res = await Factory('get', `/docwallet/files/search-autocomplete/?q=${val}`, {});
      if (res.res.status_cd === 0) {
        setSearchResults(res.res.data.results);
      }
    }
  };

  return (
    <Box
      sx={{
        background: '#fff',
        borderRadius: 2,
        p: { xs: 1, sm: 2, md: 3 },

        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        width: '100%',
        minHeight: '80vh'
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
          <Typography variant="h5" fontWeight={600} sx={{ m: 0, mb: 0.5, fontSize: { xs: 18, sm: 22 } }}>
            Document Library
          </Typography>
          {/* Breadcrumb Data */}
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
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
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              background: '#f7f8fa',
              borderRadius: 2,
              px: 1.5,
              py: 0.5,
              border: '1px solid #e3e3e3'
            }}
          >
            <InputBase
              label="Search"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              size="small"
            />
            <IconButton size="small" sx={{ color: '#888', fontSize: '20px', p: 0 }}>
              <SearchIcon sx={{ fontSize: '20px', p: 0 }} />
            </IconButton>
          </Box>
          {currentFolderId !== null && (
            <>
              <Button variant="contained" startIcon={<AddIcon />} onClick={handleUploadClick} color="primary" size="small">
                Upload File
              </Button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={handleFileInputChange} />
              <Button
                size="small"
                startIcon={<AddIcon />}
                variant="outlined"
                color="primary"
                onClick={() => {
                  setNewFolderPopup(true);
                }}
              >
                New Folder
              </Button>
            </>
          )}
        </Box>
      </Box>
      {searchQuery && searchQuery?.length >= 2 ? (
        <SearchUI
          files={searchResults}
          MUIGrid={MUIGrid}
          handleMenuOpen={handleMenuOpen}
          setActions={setActions}
          viewFile={viewFile}
          getFileIcon={getFileIcon}
          getFileType={getFileType}
        />
      ) : (
        <>
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
                      size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.6 }}
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
                          <TooltipMUI name={folders[folder.name]} placement="bottom">
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
                          </TooltipMUI>
                          <Typography variant="caption" color="text.secondary"></Typography>
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
                        size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2.6 }}
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
                          {(() => {
                            const isCWP = breadcrumbs[breadcrumbs.length - 2]?.name === 'Current Working Papers';
                            if (!isCWP || (isCWP && idx > 2)) {
                              return (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    setActions({
                                      data: folder,
                                      edit: true,
                                      delete: false
                                    });
                                    handleMenuOpen(e, folder);
                                  }}
                                  sx={{ ml: 1 }}
                                >
                                  <MoreVertIcon />
                                </IconButton>
                              );
                            }
                            return null;
                          })()}
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
                        <MUIGrid name={file.name} details={file} detailskey={'file'} key={idx} idx={idx} viewFile={viewFile}>
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
                                {new Date(file.uploaded_at).toLocaleDateString('en-US', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </Typography>
                            </Box>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                setActions({ data: file, edit: true, delete: false });
                                handleMenuOpen(e, file);
                              }}
                              sx={{ ml: 1 }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>
                        </MUIGrid>
                      ))}
                    </Grid>
                  </>
                )}
              </Box>
            </>
          )}
        </>
      )}
      <Divider sx={{ my: 2 }} />
      {/* Recently Accessed */}
      <Box sx={{ mb: 4 }}>
        <Typography fontWeight={500} sx={{ mb: 1, fontSize: { xs: 15, sm: 17 } }}>
          Recently Accessed Files
        </Typography>
        <Grid container spacing={2}>
          {recentFiles.map((file, idx) => (
            <MUIGrid name={file.name} details={file} detailskey={'file'} key={idx} idx={idx} viewFile={viewFile}>
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
                    Uploaded:{' '}
                    {new Date(file.uploaded_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    setActions({ data: file, edit: true, delete: false });
                    handleMenuOpen(e, file);
                  }}
                  sx={{ ml: 1 }}
                >
                  <MoreVertIcon />
                </IconButton>
              </Stack>
            </MUIGrid>
          ))}
        </Grid>
      </Box>

      <Dialog
        open={newFolderPopup}
        onClose={() => {
          resetActions();
        }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h3" mb={0.5} textAlign="left" sx={{ fontWeight: 400 }}>
            {actions.edit ? 'Rename' : 'New Folder'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Box>
            {breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1].name === 'Current Working Papers' ? (
              <Box sx={{ width: 'fit-content' }}>
                <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                  <TextField
                    variant="standard"
                    value={startYear}
                    onChange={handleStartYearChange}
                    placeholder="YYYY"
                    inputProps={{ inputMode: 'numeric', maxLength: 4 }}
                    sx={{
                      width: 80,
                      '& input': {
                        textAlign: 'center',
                        fontSize: '1.3rem',
                        fontFamily: 'monospace',
                        letterSpacing: '0.4rem'
                      },
                      '& .MuiInputBase-root': { p: 0, m: 0 }
                    }}
                  />
                  <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                    –
                  </Typography>
                  <TextField
                    variant="standard"
                    value={getEndYearShort()}
                    placeholder="YY"
                    InputProps={{ readOnly: true }}
                    sx={{
                      width: 40,
                      '& input': {
                        textAlign: 'center',
                        fontSize: '1.3rem',
                        fontFamily: 'monospace',
                        color: 'text.secondary',
                        letterSpacing: '0.3rem'
                      },
                      '& .MuiInputBase-root': { p: 0, m: 0 }
                    }}
                  />
                </Stack>

                {startYear.length === 4 && (
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    Financial Year: {startYear}-{getEndYearShort()}
                  </Typography>
                )}
              </Box>
            ) : (
              <TextField
                fullWidth
                onChange={(e) => setFolderName(e.target.value)}
                value={folderName}
                focused
                placeholder="Enter Folder Name"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              resetActions();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (actions.fileType) {
                fileNameChange(actions.data);
              } else {
                createFolder();
              }
            }}
          >
            {actions.edit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={previewOpen}
        onClose={() => {
          setPreviewOpen(false);
          setPreviewUrl('');
          setPreviewLoading(false);
        }}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent sx={{ p: 0, height: '100vh', bgcolor: '#222', overflow: 'hidden', position: 'relative' }}>
          {previewUrl && (
            <iframe
              src={previewUrl}
              title="File Preview"
              width="100%"
              height="100%"
              style={{
                border: 0,
                background: '#fff',
                display: 'block',
                maxWidth: '100vw',
                minWidth: 0,
                minHeight: 0,
                overflow: 'hidden'
              }}
              onLoad={() => setPreviewLoading(false)}
            />
          )}
          {previewLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(255,255,255,0.5)',
                zIndex: 2
              }}
            >
              <CircularProgress size={48} thickness={5} />
            </Box>
          )}
        </DialogContent>
      </Dialog>
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={(e) => e.stopPropagation()}
        PaperProps={{ sx: { minWidth: 180, borderRadius: 1.5 } }}
      >
        <MenuItem
          sx={{ minWidth: 180 }}
          onClick={() => {
            nameChange(menuTarget);
          }}
        >
          <EditIcon color="primary" sx={{ mr: 1 }} /> Rename
        </MenuItem>
        <Divider />
        <MenuItem sx={{ minWidth: 180 }} onClick={handleDeleteClick}>
          <DeleteIcon color="error" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      <Dialog open={confirmDeleteOpen} onClose={handleConfirmDeleteClose}>
        <DialogContent>
          <Typography variant="h2" mb={3} textAlign="left" sx={{ fontWeight: 400 }}>
            Delete Forever?
          </Typography>
          <Typography>"{actions?.data?.name}" will be deleted permanently. This can't be undone.</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3 }}>
          <Button onClick={handleConfirmDeleteClose} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" disabled={deleteLoading} variant="contained">
            {deleteLoading ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
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
