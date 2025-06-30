import React, { forwardRef } from 'react';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

// constant
const headerStyle = {
  '& .MuiCardHeader-action': { mr: 0 }
};

const MainCard = forwardRef(function MainCard(
  {
    border = false,
    boxShadow,
    children,
    content = true,
    contentClass = '',
    contentSX = {},
    headerSX = {},
    darkTitle,
    secondary,
    shadow,
    sx = {},
    title,
    icon,
    ...others
  },
  ref
) {
  const { mode } = useConfig();
  const defaultShadow = mode === ThemeMode.DARK ? '0 2px 14px 0 rgb(33 150 243 / 10%)' : '0 2px 14px 0 rgb(32 40 45 / 8%)';
  const theme = useTheme();
  return (
    <Card
      ref={ref}
      {...others}
      sx={{
        border: border ? '1px solid' : 'none',
        borderColor: 'divider',
        ':hover': {
          boxShadow: boxShadow ? shadow || defaultShadow : 'inherit'
        },
        ...sx
      }}
    >
      {/* card header and action */}
      {!darkTitle && title && (
        <CardHeader
          // sx={{
          //   ...headerStyle,
          //   ...headerSX,
          //   m: 2,
          //   backgroundColor: alpha(theme.palette.primary.main, 0.05),
          //   borderRadius: 2,
          //   border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          // }}
          // avatar={icon}
          title={title}
          action={secondary}
          sx={{
            padding: 2
          }}
        />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={{ ...headerStyle, ...headerSX }}
          avatar={icon}
          title={<Typography variant="h3">{title}</Typography>}
          action={secondary}
        />
      )}

      {/* content & header divider */}
      {/* {title && <Divider />} */}

      {/* card content */}
      {content && (
        <CardContent
          sx={{
            padding: '8px 16px 16px 16px',
            ...contentSX
          }}
          className={contentClass}
        >
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
});

export default MainCard;
