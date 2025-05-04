'use client';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import BookIcon from '@mui/icons-material/Book';
import DescriptionIcon from '@mui/icons-material/Description';
import FolderIcon from '@mui/icons-material/Folder';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { Box, Paper, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { IconCircleCheck } from '@tabler/icons-react';
import React from 'react';

const iconMap = [
  { icon: <FolderIcon />, color: '#5e35b1' },
  { icon: <AccountBalanceIcon />, color:'rgb(234, 235, 239)' },
  { icon: <ReceiptLongIcon />, color: '#039be5' },
  { icon: <DescriptionIcon />, color: '#00897b' },
  { icon: <BookIcon />, color: '#6d4c41' },
  { icon: <PeopleAltIcon />, color: '#3949ab' }
];

const DocumentsRequired = ({ documents }) => {
  const theme = useTheme();
  return (
   
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: { xs: 'unset', sm: '80vh' } }}>
        <Paper
          elevation={2}
          sx={{
            borderRadius: 4,
            px: { xs: 1, sm: 4, md: 6 },
            py: { xs: 2, sm: 4, md: 5 },
            minWidth: { xs: '95vw', sm: 350, md: 500 },
            maxWidth: 600,
            width: '100%',
            boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)'
          }}
        >
          <Typography
            variant="h1"
            fontWeight={1500}
            color="#23395d"
            align="center"
            mb={2}
            sx={{ fontSize: { xs: '1.1rem', sm: '1.25rem' } }}
          >
            Documents Required
          </Typography>
          <Stack spacing={1.5}>
            {documents.map((doc, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f5f7fa',
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                  boxShadow: 'none'
                }}
              >
                <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                  <IconCircleCheck size={30} color={theme.palette.primary.main} />
                </Box>
                <Box
                  sx={{
                    color: iconMap[idx % iconMap.length].color,
                    mr: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: { xs: 22, sm: 28 }
                  }}
                >
                  {iconMap[idx % iconMap.length].icon}
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  color="#23395d"
                  sx={{
                    fontSize: { xs: '0.98rem', sm: '1.05rem' },
                    wordBreak: 'break-word'
                  }}
                >
                  {doc}
                </Typography>
              </Box>
            ))}
          </Stack>
        </Paper>
      </Stack>
    
  );
};

export default DocumentsRequired;