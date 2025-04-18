import React from 'react';

// material-ui
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { ImagePath, getImageUrl } from 'utils/getImageUrl';

// assets
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChatBubbleTwoToneIcon from '@mui/icons-material/ChatBubbleTwoTone';
import BlockTwoToneIcon from '@mui/icons-material/BlockTwoTone';

// ==============================|| USER LIST 1 ||============================== //

export default function UserList() {
  const [data, setData] = React.useState([]);
  const usersS1 = [
    {
      id: '01',
      avatar: 'avatar-1.png',
      name: 'Curtis',
      verify: 1,
      email: 'wiegand@hotmail.com',
      location: 'Saucerize',
      friends: 834,
      followers: 3645,
      status: 'Active'
    },
    {
      id: '02',
      avatar: 'avatar-2.png',
      name: 'Xavier',
      verify: 1,
      email: 'tyrell86@company.com',
      location: 'South Bradfordstad',
      friends: 634,
      followers: 2345,
      status: 'Pending'
    },
    {
      id: '03',
      avatar: 'avatar-3.png',
      name: 'Lola',
      verify: 1,
      email: 'aufderhar56@yahoo.com',
      location: 'North Tannermouth',
      friends: 164,
      followers: 9345,
      status: 'Rejected'
    },
    {
      id: '04',
      avatar: 'avatar-4.png',
      name: 'Milton',
      verify: 1,
      email: 'dikinson49@hotmail.com',
      location: 'North Anika',
      friends: 684,
      followers: 3654,
      status: 'Pending'
    },
    {
      id: '05',
      avatar: 'avatar-5.png',
      name: 'Lysanne',
      verify: 0,
      email: 'zack.turner49@company.com',
      location: 'Betteland',
      friends: 842,
      followers: 5863,
      status: 'Active'
    },
    {
      id: '06',
      avatar: 'avatar-6.png',
      name: 'Bonita',
      verify: 1,
      email: 'keebler57@company.com',
      location: 'Alexburgh',
      friends: 543,
      followers: 8965,
      status: 'Rejected'
    },
    {
      id: '07',
      avatar: 'avatar-7.png',
      name: 'Retta',
      verify: 1,
      email: 'mathew92@yahoo.com',
      location: 'East Bryceland',
      friends: 871,
      followers: 9321,
      status: 'Active'
    },
    {
      id: '08',
      avatar: 'avatar-8.png',
      name: 'Zoie',
      verify: 1,
      email: 'hulda1@hotmail.com',
      location: 'Beattytown',
      friends: 354,
      followers: 1686,
      status: 'Pending'
    },
    {
      id: '09',
      avatar: 'avatar-9.png',
      name: 'Easton',
      verify: 1,
      email: 'hilpert66@hotmail.com',
      location: 'North Pedromouth',
      friends: 546,
      followers: 9562,
      status: 'Active'
    },
    {
      id: '10',
      avatar: 'avatar-10.png',
      name: 'Brianne',
      verify: 1,
      email: 'noe45@hotmail.com',
      location: 'New Alexanderborough',
      friends: 1482,
      followers: 10865,
      status: 'Active'
    }
  ];

  React.useEffect(() => {
    setData(usersS1);
  }, [usersS1]);

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ pl: 3 }}>#</TableCell>
            <TableCell>User Profile</TableCell>
            <TableCell>Country</TableCell>
            <TableCell>Friends</TableCell>
            <TableCell>Followers</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center" sx={{ pr: 3 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data &&
            data.map((row, index) => (
              <TableRow hover key={index}>
                <TableCell sx={{ pl: 3 }}>{row.id}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar alt="User 1" src={getImageUrl(`${row.avatar}`, ImagePath.USERS)} />
                    <Stack>
                      <Stack direction="row" spacing={0.25} sx={{ alignItems: 'center' }}>
                        <Typography variant="subtitle1">{row.name}</Typography>
                        {row.status === 'Active' && <CheckCircleIcon sx={{ color: 'success.dark', width: 14, height: 14 }} />}
                      </Stack>

                      <Typography variant="subtitle2" noWrap>
                        {row.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>{row.location}</TableCell>
                <TableCell>{row.friends}</TableCell>
                <TableCell>{row.followers}</TableCell>
                <TableCell>
                  {row.status === 'Active' && <Chip label="Active" size="small" color="success" />}
                  {row.status === 'Rejected' && <Chip label="Rejected" size="small" color="error" />}
                  {row.status === 'Pending' && <Chip label="Pending" size="small" color="warning" />}
                </TableCell>
                <TableCell align="center" sx={{ pr: 3 }}>
                  <Stack direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Tooltip placement="top" title="Message">
                      <IconButton color="primary" aria-label="delete" size="large">
                        <ChatBubbleTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip placement="top" title="Block">
                      <IconButton
                        color="primary"
                        sx={{
                          color: 'orange.dark',
                          borderColor: 'orange.main',
                          '&:hover ': { bgcolor: 'orange.light' }
                        }}
                        size="large"
                      >
                        <BlockTwoToneIcon sx={{ fontSize: '1.1rem' }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
