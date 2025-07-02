import React, { forwardRef } from 'react';

// material-ui
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Box, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

// project imports
import { ThemeMode } from 'config';
import useConfig from 'hooks/useConfig';

/**
 * Modern, reusable card component with consistent styling
 *
 * @example
 * // Basic usage
 * <MainCard title="Card Title">
 *   <Typography>Card content goes here</Typography>
 * </MainCard>
 *
 * @example
 * // With icon and action
 * <MainCard
 *   title="Business Information"
 *   icon={<BusinessIcon color="primary" />}
 *   action={<Button>Action</Button>}
 * >
 *   Content here
 * </MainCard>
 *
 * @example
 * // Custom styling
 * <MainCard
 *   title="Custom Card"
 *   headerBackground="success.50"
 *   borderColor="success.main"
 *   contentPadding={3}
 * >
 *   Content here
 * </MainCard>
 */
const MainCard = forwardRef(function MainCard(
  {
    // Card props
    elevation = 0,
    border = true,
    borderColor = 'grey.400',
    borderRadius = 3,

    // Header props
    title,
    subtitle,
    icon,
    action,
    headerBackground = 'primary.50',
    headerBorderColor = 'grey.400',
    headerPadding = 2,

    // Content props
    children,
    content = true,
    contentClass = '',
    contentSX = {},
    contentPadding = 2,

    // Styling props
    sx = {},
    headerSX = {},

    // Legacy props for backward compatibility
    darkTitle,
    secondary,
    shadow,
    boxShadow,
    ...others
  },
  ref
) {
  const { mode } = useConfig();
  const theme = useTheme();

  // Backward compatibility - map old props to new ones
  const finalAction = secondary || action;
  const finalIcon = icon;

  return (
    <Card
      ref={ref}
      elevation={elevation}
      {...others}
      sx={{
        // border: border ? '1px solid' : 'none',
        borderColor: borderColor,
        borderRadius: borderRadius,
        ...sx
      }}
    >
      {/* Card Header */}
      {title && (
        <CardHeader
          avatar={finalIcon}
          title={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* {finalIcon && typeof finalIcon === 'object' && finalIcon} */}
              <Typography variant={darkTitle ? 'h3' : 'h5'} fontWeight={600} color="text.primary">
                {title}
              </Typography>
            </Box>
          }
          subheader={
            subtitle && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {subtitle}
              </Typography>
            )
          }
          action={finalAction}
          sx={{
            backgroundColor: headerBackground,
            // borderBottom: '1px solid',
            borderColor: headerBorderColor,
            padding: headerPadding,
            '& .MuiCardHeader-action': {
              mr: 0
            },
            ...headerSX
          }}
        />
      )}

      {/* Card Content */}
      {content && (
        <CardContent
          sx={{
            padding: contentPadding,
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
