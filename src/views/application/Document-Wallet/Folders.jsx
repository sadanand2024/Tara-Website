// import React, { useState, useEffect } from 'react';
// import {
//   Box,
//   Typography,
//   Grid,
//   Button,
//   TextField,
//   Divider,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Breadcrumbs
// } from '@mui/material';
// import Factory from '../../../utils/Factory';
// import { useNavigate } from 'react-router-dom';
// import FolderIcon from '@mui/icons-material/Folder';
// import FolderOffIcon from '@mui/icons-material/FolderOff';
// import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';

// const EmptyState = ({ type = 'folder', onAction }) => (
//   <Box
//     sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       py: 6,
//       minHeight: 220,
//       color: 'text.secondary',
//       border: '1px dashed #e0e0e0',
//       borderRadius: 2,
//       background: '#fafbfc'
//     }}
//   >
//     {type === 'folder' ? (
//       <FolderOffIcon sx={{ fontSize: 56, mb: 1, color: '#bdbdbd' }} />
//     ) : (
//       <InsertDriveFileOutlinedIcon sx={{ fontSize: 56, mb: 1, color: '#bdbdbd' }} />
//     )}
//     <Typography variant="h6" sx={{ mb: 1 }}>
//       {type === 'folder' ? 'No Folders Found' : 'No Files Found'}
//     </Typography>
//     <Typography variant="body2" sx={{ mb: 2 }}>
//       {type === 'folder'
//         ? 'There are no folders here yet. Create a new folder to get started!'
//         : 'There are no files in this folder yet. Upload files to see them here.'}
//     </Typography>
//     {onAction && (
//       <Button variant="contained" color="primary" onClick={onAction}>
//         {type === 'folder' ? 'Create Folder' : 'Upload File'}
//       </Button>
//     )}
//   </Box>
// );

// const Folder = () => {
//   const [folders, setFolders] = useState([]);
//   const [selectedFolder, setSelectedFolder] = useState(null);
//   const [newFolder, setNewFolder] = useState('');
//   const [isEditing, setIsEditing] = useState(false);
//   const [currentFolderId, setCurrentFolderId] = useState(null);
//   const [breadcrumbs, setBreadcrumbs] = useState([]);
//   const [currentContents, setCurrentContents] = useState({ folders: [], files: [] });

//   const navigate = useNavigate();

//   useEffect(() => {
//     // Initial fetch for root folders
//     Factory('get', '/docwallet/folders/', {}, {}).then((response) => {
//       if (response.res.status_cd === 0) {
//         setFolders(response.res.data);
//       }
//     });
//   }, []);

//   // Handler for root folder click
//   const handleRootFolderClick = (folder) => {
//     fetchFolderContents(folder.id, folder.name, true);
//   };

//   // Fetch folder contents by id
//   const fetchFolderContents = async (folderId, folderName, isRoot = false) => {
//     const url = `/docwallet/folders/${folderId}/files/`;
//     const response = await Factory('get', url, {}, {});
//     if (response.res.status_cd === 0) {
//       setCurrentContents({
//         folders: response.res.data.folders || [],
//         files: response.res.data.files || []
//       });
//       setCurrentFolderId(folderId);
//       setBreadcrumbs((prev) => (isRoot ? [{ id: folderId, name: folderName }] : [...prev, { id: folderId, name: folderName }]));
//     }
//   };

//   // Breadcrumb click handler
//   const handleBreadcrumbClick = (idx) => {
//     const crumb = breadcrumbs[idx];
//     setBreadcrumbs(breadcrumbs.slice(0, idx + 1));
//     fetchFolderContents(crumb.id, crumb.name, true);
//   };

//   const handleCreateFolder = async () => {
//     if (newFolder.trim() === '') {
//       return;
//     }

//     try {
//       const response = await Factory('post', '/docwallet/folders/', { name: newFolder }, {});
//       if (response.res.status_cd === 0) {
//         setFolders([...folders, { id: response.res.data.id, name: newFolder }]);
//         setNewFolder('');
//         setIsEditing(false);
//       } else {
//         console.error('Failed to create folder');
//       }
//     } catch (error) {
//       console.error('Error creating folder:', error);
//     }
//   };

//   const handleEditFolder = async (id) => {
//     setSelectedFolder(id);
//     setIsEditing(true);
//   };

//   const handleUpdateFolder = async () => {
//     if (newFolder.trim() === '') {
//       return;
//     }

//     try {
//       const response = await Factory('put', `/docwallet/folders/${selectedFolder}/`, { name: newFolder }, {});
//       if (response.res.status_cd === 0) {
//         setFolders(folders.map((folder) => (folder.id === selectedFolder ? { id: selectedFolder, name: newFolder } : folder)));
//         setSelectedFolder(null);
//         setIsEditing(false);
//       } else {
//         console.error('Failed to update folder');
//       }
//     } catch (error) {
//       console.error('Error updating folder:', error);
//     }
//   };

//   const handleDeleteFolder = async (id) => {
//     try {
//       const response = await Factory('delete', `/docwallet/folders/${id}/`, {}, {});
//       if (response.res.status_cd === 0) {
//         setFolders(folders.filter((folder) => folder.id !== id));
//       } else {
//         console.error('Failed to delete folder');
//       }
//     } catch (error) {
//       console.error('Error deleting folder:', error);
//     }
//   };

//   const handleFolderClick = (id) => {
//     navigate(`/docwallet/folders/${id}`);
//   };

//   // Dummy upload handler for empty state
//   const handleUploadClick = () => {
//     // Implement your upload logic or open upload dialog
//     alert('Upload File Clicked');
//   };

//   return (
//     <Box sx={{ background: '#fff', borderRadius: 2, p: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
//       <Typography variant="h5" fontWeight={600} sx={{ mb: 3 }}>
//         Document Wallet
//       </Typography>
//       <Divider sx={{ mb: 3 }} />
//       <Box sx={{ mb: 3 }}>
//         <TextField
//           label="New Folder"
//           value={newFolder}
//           onChange={(e) => setNewFolder(e.target.value)}
//           fullWidth
//           autoFocus
//           onBlur={() => setIsEditing(false)}
//         />
//         <Button variant="contained" color="primary" onClick={handleCreateFolder}>
//           {isEditing ? 'Update' : 'Create'}
//         </Button>
//       </Box>
//       <Divider sx={{ mb: 3 }} />
//       {currentFolderId === null ? (
//         folders.length === 0 ? (
//           <EmptyState type="folder" onAction={() => setIsEditing(true)} />
//         ) : (
//           <Grid container spacing={2}>
//             {folders.map((folder) => (
//               <Grid item xs={12} sm={6} md={4} key={folder.id}>
//                 <Box
//                   sx={{
//                     border: '1px solid #ededed',
//                     boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                     borderRadius: 1.5,
//                     p: 2,
//                     minWidth: 0,
//                     width: '100%',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: 1.5,
//                     cursor: 'pointer',
//                     transition: 'transform 0.2s ease-in-out',
//                     '&:hover': {
//                       transform: 'translateY(-2px)'
//                     }
//                   }}
//                   onClick={() => handleRootFolderClick(folder)}
//                 >
//                   <FolderIcon fontSize="large" sx={{ color: '#fbc02d', flexShrink: 0 }} />
//                   <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
//                     <Typography fontWeight={500} sx={{ mb: 0.5 }}>
//                       {folder.name}
//                     </Typography>
//                     <Typography variant="caption" color="text.secondary">
//                       {folder.description}
//                     </Typography>
//                   </Box>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         )
//       ) : (
//         <>
//           <Box sx={{ mb: 2 }}>
//             <Breadcrumbs aria-label="breadcrumb">
//               {breadcrumbs.map((crumb, idx) => (
//                 <Typography
//                   key={crumb.id}
//                   variant="body2"
//                   color={idx === breadcrumbs.length - 1 ? 'text.primary' : 'inherit'}
//                   onClick={() => idx !== breadcrumbs.length - 1 && handleBreadcrumbClick(idx)}
//                   sx={{ cursor: idx === breadcrumbs.length - 1 ? 'default' : 'pointer' }}
//                 >
//                   {crumb.name}
//                 </Typography>
//               ))}
//             </Breadcrumbs>
//           </Box>
//           {currentContents.folders.length === 0 ? (
//             <EmptyState type="folder" onAction={() => setIsEditing(true)} />
//           ) : (
//             <Grid container spacing={2}>
//               {currentContents.folders.map((folder) => (
//                 <Grid item xs={12} sm={6} md={4} key={folder.id}>
//                   <Box
//                     sx={{
//                       border: '1px solid #ededed',
//                       boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
//                       borderRadius: 1.5,
//                       p: 2,
//                       minWidth: 0,
//                       width: '100%',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: 1.5,
//                       cursor: 'pointer',
//                       transition: 'transform 0.2s ease-in-out',
//                       '&:hover': {
//                         transform: 'translateY(-2px)'
//                       }
//                     }}
//                     onClick={() => fetchFolderContents(folder.id, folder.name)}
//                   >
//                     <FolderIcon fontSize="large" sx={{ color: '#fbc02d', flexShrink: 0 }} />
//                     <Box sx={{ width: 0, flex: 1, minWidth: 0 }}>
//                       <Typography fontWeight={500} sx={{ mb: 0.5 }}>
//                         {folder.name}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         {folder.description}
//                       </Typography>
//                     </Box>
//                   </Box>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//           {/* Files Table */}
//           <Box sx={{ mt: 3 }}>
//             <TableContainer component={Paper} sx={{ borderRadius: 1.5 }}>
//               <Table size="small">
//                 <TableHead sx={{ background: '#f5f5f5' }}>
//                   <TableRow>
//                     <TableCell>Name</TableCell>
//                     <TableCell>Size</TableCell>
//                     <TableCell>Type</TableCell>
//                     <TableCell>Last Edit</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {currentContents.files.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={4}>
//                         <EmptyState type="file" onAction={handleUploadClick} />
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     currentContents.files.map((file, idx) => (
//                       <TableRow key={file.name + idx}>
//                         <TableCell>{file.name}</TableCell>
//                         <TableCell>{file.size}</TableCell>
//                         <TableCell>{file.type}</TableCell>
//                         <TableCell>{file.lastEdit}</TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Box>
//         </>
//       )}
//     </Box>
//   );
// };

// export default Folder;
