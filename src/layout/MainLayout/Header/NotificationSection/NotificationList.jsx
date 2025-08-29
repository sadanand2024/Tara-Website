import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// project imports
import { ThemeMode } from 'config';

// assets
import User1 from 'assets/images/users/user-round.svg';

function ListItemWrapper({ children }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2,
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.900' : alpha(theme.palette.grey[200], 0.3)
        }
      }}
    >
      {children}
    </Box>
  );
}

// ==============================|| NOTIFICATION LIST ITEM ||============================== //

export default function NotificationList({ items = [], onItemRead }) {
  const theme = useTheme();
  const [expandedId, setExpandedId] = React.useState(null);
  const toggleExpanded = (id) => setExpandedId((p) => (p === id ? null : id));

  return (
    <List sx={{ width: { xs: 300, md: 330 }, maxWidth: 520, py: 0 }}>
      {items.length === 0 && (
        <ListItemWrapper>
          <Typography variant="caption" sx={{ px: 2 }}>
            No notifications
          </Typography>
        </ListItemWrapper>
      )}
      {items.map((it) => {
        const avatarSrc = it.avatar || User1;
        // ✅ Prefer backend's display string if available
        // const displayTime = it.created_at?.display || it.display || '';
        const displayTime =
          it.created_at?.display ||
          (it.created_at?.date || it.created_at?.time ? [it.created_at?.date, it.created_at?.time].filter(Boolean).join(' ') : '') ||
          it.display ||
          '';
        const unread = it.unread !== false;
        const id = it.notification_id || it.id;
        const isExpanded = expandedId === id;

        const markRead = () => {
          if (unread && typeof onItemRead === 'function' && it.notification_id) {
            onItemRead(it.notification_id);
          }
        };
        return (
          <ListItemWrapper
            key={id}
            onClick={() => {
              toggleExpanded(id);
              markRead();
            }}
          >
            <ListItem alignItems="flex-start" disablePadding>
              <ListItemAvatar>
                <Avatar alt={it.title || 'Notification'} src={avatarSrc} sx={{mt:2}} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Stack spacing={0.25}>
                     {/* {displayTime && (
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 1 }}>
                        {displayTime}
                      </Typography>
                    )}
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        pr: 1,
                        flex: 1,
                        minWidth: 0,
                        cursor: 'pointer',
                        whiteSpace: isExpanded ? 'normal' : 'nowrap',
                        overflow: isExpanded ? 'visible' : 'hidden',
                        textOverflow: isExpanded ? 'unset' : 'ellipsis'
                      }}
                      onClick={() => {
                        toggleExpanded(id);
                        markRead();
                      }}
                    >
                      {it.title}
                    </Typography>
                    {unread && <Box sx={{ width: 8, height: 8, bgcolor: 'secondary.main', borderRadius: '50%' }} />}
                   
                  </Stack> */}
                    {displayTime && (
        <Typography
          variant="caption"
          color="text.secondary"
          // sx={{ flexShrink: 0, ml: 1, whiteSpace: 'nowrap' }}
           sx={{ ml: 'auto', pl: 1, flexShrink: 0, whiteSpace: 'nowrap', textAlign: 'right' }}
        >
          {displayTime}
        </Typography>
      )}
                   <Box sx={{ display: 'flex', alignItems: 'center', minWidth: 0, flex: 1 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            pr: 1,
            minWidth: 0,
            cursor: 'pointer',
            whiteSpace: isExpanded ? 'normal' : 'nowrap',
            overflow: isExpanded ? 'visible' : 'hidden',
            textOverflow: isExpanded ? 'unset' : 'ellipsis'
          }}
          onClick={() => { toggleExpanded(id); markRead(); }}
        >
          {it.title}
        </Typography>
        {unread && (
          <Box sx={{ ml: 1, width: 8, height: 8, bgcolor: 'secondary.main', borderRadius: '50%', flexShrink: 0 }} />
        )}
      </Box>

      {/* Right: time */}
    
    </Stack>
                }
                secondary={
                  <Stack spacing={1} sx={{ pr: 1 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={
                        isExpanded
                          ? { whiteSpace: 'normal', wordBreak: 'break-word', overflow: 'visible', textOverflow: 'unset' }
                          : { display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
                      }
                      onClick={() => {
                        toggleExpanded(id);
                        markRead();
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {it.message}
                    </Typography>
                    {/* {unread && (
                      <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%' }} />
                    )} */}
                  </Stack>
                }
              />
            </ListItem>
          </ListItemWrapper>
        );
      })}
    </List>
  );
}

ListItemWrapper.propTypes = { children: PropTypes.node };
NotificationList.propTypes = { items: PropTypes.array };
