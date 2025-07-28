import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, Grid2, Chip, Stack, Divider } from '@mui/material';
import { useSelector } from 'store';
import { IconCalendar, IconFlag, IconHome, IconStar } from '@tabler/icons-react';

const HolidayCalendar = () => {
  const user = useSelector((state) => state.accountReducer.user);
  const [selectedYear] = useState(2025);

  // Safety check - if user is not an employee, show a message
  if (!user?.employee) {
    return (
      <Card sx={{ p: 2 }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1">This portal is only accessible to employees.</Typography>
      </Card>
    );
  }

  // Holiday data for 2025
  const holidayData = {
    January: [
      { date: '01', name: 'New Year', type: 'general' },
      { date: '15', name: 'Makara Sankranthi', type: 'restricted' }
    ],
    February: [
      // No holidays
    ],
    March: [
      { date: '04', name: 'Maha Shivaratri', type: 'restricted' },
      { date: '21', name: 'Holi', type: 'general' }
    ],
    April: [{ date: '19', name: 'Good Friday', type: 'general' }],
    May: [{ date: '01', name: 'May Day', type: 'general' }],
    June: [
      // No holidays
    ],
    July: [{ date: '26', name: 'Independence Day', type: 'general' }],
    August: [
      { date: '15', name: 'Independence Day', type: 'general' },
      { date: '30', name: 'Raksha Bandhan', type: 'restricted' }
    ],
    September: [{ date: '07', name: 'Ganesh Chaturthi', type: 'restricted' }],
    October: [
      { date: '02', name: 'Gandhi Jayanti', type: 'general' },
      { date: '23', name: 'Diwali', type: 'general' }
    ],
    November: [{ date: '14', name: "Children's Day", type: 'restricted' }],
    December: [{ date: '25', name: 'Christmas', type: 'general' }]
  };

  const getHolidayColor = (type) => {
    switch (type) {
      case 'general':
        return '#d32f2f';
      case 'restricted':
        return '#ed6c02';
      default:
        return '#666';
    }
  };

  const getHolidayIcon = (type) => {
    switch (type) {
      case 'general':
        return IconHome;
      case 'restricted':
        return IconFlag;
      default:
        return IconCalendar;
    }
  };

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const getTotalHolidays = () => {
    return Object.values(holidayData).flat().length;
  };

  const getGeneralHolidays = () => {
    return Object.values(holidayData)
      .flat()
      .filter((holiday) => holiday.type === 'general').length;
  };

  const getRestrictedHolidays = () => {
    return Object.values(holidayData)
      .flat()
      .filter((holiday) => holiday.type === 'restricted').length;
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          Holiday Calendar
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {selectedYear} - Complete list of company holidays
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid2 container spacing={3} sx={{ mb: 4 }}>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'primary.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconCalendar size={32} style={{ color: '#1976d2', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                {getTotalHolidays()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Holidays
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'error.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconHome size={32} style={{ color: '#d32f2f', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                {getGeneralHolidays()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                General Holidays
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'warning.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconFlag size={32} style={{ color: '#ed6c02', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                {getRestrictedHolidays()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Restricted Holidays
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ bgcolor: 'success.50' }}>
            <CardContent sx={{ textAlign: 'center' }}>
              <IconStar size={32} style={{ color: '#2e7d32', marginBottom: 8 }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                {selectedYear}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Year
              </Typography>
            </CardContent>
          </Card>
        </Grid2>
      </Grid2>

      {/* Holiday Grid */}
      <Card>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Monthly Holiday Overview
          </Typography>
          <Grid2 container spacing={2}>
            {months.map((month) => {
              const holidays = holidayData[month];
              const IconComponent = IconCalendar;

              return (
                <Grid2 key={month} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Card
                    sx={{
                      height: '100%',
                      border: '1px solid',
                      borderColor: 'divider',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      {/* Month Header */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <IconComponent size={20} style={{ marginRight: 8, color: '#666' }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {month}
                        </Typography>
                      </Box>

                      <Divider sx={{ mb: 2 }} />

                      {/* Holidays List */}
                      {holidays.length === 0 ? (
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                          No holidays
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {holidays.map((holiday, index) => {
                            const HolidayIcon = getHolidayIcon(holiday.type);
                            const color = getHolidayColor(holiday.type);

                            return (
                              <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <HolidayIcon size={14} style={{ color: color, marginRight: 6 }} />
                                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {holiday.date}:
                                  </Typography>
                                  <Typography variant="body2" sx={{ ml: 0.5 }}>
                                    {holiday.name}
                                  </Typography>
                                </Box>
                                <Chip
                                  label={holiday.type === 'general' ? 'General' : 'Restricted'}
                                  size="small"
                                  sx={{
                                    bgcolor: `${color}20`,
                                    color: color,
                                    fontWeight: 600,
                                    fontSize: '0.7rem'
                                  }}
                                />
                              </Box>
                            );
                          })}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>
                </Grid2>
              );
            })}
          </Grid2>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Holiday Types
          </Typography>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#d32f2f',
                    mr: 1
                  }}
                />
                <Typography variant="body2">General Holiday</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                  {getGeneralHolidays()}
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    bgcolor: '#ed6c02',
                    mr: 1
                  }}
                />
                <Typography variant="body2">Restricted Holiday</Typography>
                <Typography variant="body2" sx={{ ml: 'auto', fontWeight: 600 }}>
                  {getRestrictedHolidays()}
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  );
};

export default HolidayCalendar;
