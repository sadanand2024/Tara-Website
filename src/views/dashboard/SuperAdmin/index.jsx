import React from 'react';
import { Box, Grid, Paper, Typography, Stack, Chip, useTheme, Divider, Button } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceDot } from 'recharts';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const summaryCards = [
  {
    label: 'Total Purchases',
    value: '₹0',
    trend: '0%',
    trendType: 'up',
    sub: 'previous 60 Days'
  },
  {
    label: '28 Days Revenue',
    value: '₹0',
    trend: '0%',
    trendType: 'down',
    sub: 'previous 28 Days'
  },
  {
    label: 'Orders Amount',
    value: '₹0',
    trend: '0%',
    trendType: 'up',
    sub: 'Last 90 days'
  },
  {
    label: 'Total Orders',
    value: '₹0',
    trend: '0%',
    trendType: 'down',
    sub: 'last 60 days'
  }
];

const earningData = [
  { month: 'Jan', value: 6000 },
  { month: 'Feb', value: 7000 },
  { month: 'Mar', value: 6500 },
  { month: 'Apr', value: 8000 },
  { month: 'May', value: 9000 },
  { month: 'Jun', value: 5124 },
  { month: 'Jul', value: 7000 },
  { month: 'Aug', value: 8500 },
  { month: 'Sep', value: 6000 },
  { month: 'Oct', value: 7500 },
  { month: 'Nov', value: 8000 },
  { month: 'Dec', value: 9000 }
];

const kpiData = [
  { label: 'Title', value: 75, color: 'primary.main' },
  { label: 'Title', value: 57, color: 'secondary.main' }
];

const activities = [
  { text: 'Ahitsham Niaz Changed his picture', date: 'June 25, 2023 Thursday', time: '12:34 am' },
  { text: 'Ahitsham Niaz Changed his Account no.', date: 'June 25, 2023 Thursday', time: '12:34 am' },
  { text: 'Ahitsham Niaz Changed his picture', date: 'June 25, 2023 Thursday', time: '12:34 am' },
  { text: 'Ahitsham Niaz Changed his picture', date: 'June 25, 2023 Thursday', time: '12:34 am' }
];

const SuperAdminDashboard = () => {
  const theme = useTheme();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {/* Summary Cards */}
      <Grid container spacing={3} mb={2}>
        {summaryCards.map((item, idx) => (
          <Grid item xs={12} sm={6} md={3} key={item.label}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px) scale(1.03)',
                  boxShadow: '0 6px 24px 0 rgba(25, 118, 210, 0.10)'
                }
              }}
            >
              <Typography variant="subtitle2" color="text.secondary" fontWeight={600} sx={{ mb: 0.5, fontSize: 15 }}>
                {item.label}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                <Typography variant="h3" fontWeight={800} color={theme.palette.primary.main} sx={{ fontSize: 32 }}>
                  {item.value}
                </Typography>
                {item.trend && (
                  <Chip
                    size="small"
                    label={item.trend}
                    icon={item.trendType === 'up' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                    sx={{
                      bgcolor: item.trendType === 'up' ? theme.palette.success.lighter : theme.palette.error.lighter,
                      color: item.trendType === 'up' ? theme.palette.success.main : theme.palette.error.main,
                      fontWeight: 700,
                      fontSize: 14
                    }}
                  />
                )}
              </Stack>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 13 }}>
                {item.sub}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left: Chart and KPIs */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: '#fff',
              mb: 3,
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h2" fontWeight={700} color={theme.palette.primary.main}>
                Earning Revenue
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  fontWeight: 700,
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.light,
                  fontSize: 15
                }}
              >
                Weekly
              </Button>
            </Stack>
            <Divider sx={{ mb: 2 }} />
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={earningData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.palette.primary.main} stopOpacity={0.6} />
                    <stop offset="95%" stopColor={theme.palette.primary.light} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 14, fontWeight: 600, fill: theme.palette.text.secondary }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `$${v / 1000}k`}
                  tick={{ fontSize: 14, fontWeight: 600, fill: theme.palette.text.secondary }}
                />
                <Tooltip formatter={(v) => `$${v.toLocaleString()}`} contentStyle={{ fontSize: 15, fontWeight: 700 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={theme.palette.primary.main}
                  fill="url(#colorPrimary)"
                  strokeWidth={4}
                  dot={{ r: 6, fill: theme.palette.primary.main }}
                  activeDot={{ r: 10 }}
                />
                {/* Highlighted value for June */}
                <ReferenceDot
                  x="Jun"
                  y={5124}
                  r={22}
                  fill={theme.palette.primary.main}
                  stroke="#fff"
                  strokeWidth={2}
                  isFront
                  label={{ value: '$5,124', position: 'top', fill: theme.palette.primary.main, fontWeight: 900, fontSize: 18, dy: -12 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
          {/* KPI Circles */}
          <Grid container spacing={3}>
            {kpiData.map((kpi, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    textAlign: 'center',
                    bgcolor: '#fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: 180
                  }}
                >
                  <ResponsiveContainer width={90} height={90}>
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'value', value: kpi.value },
                          { name: 'rest', value: 100 - kpi.value }
                        ]}
                        innerRadius={32}
                        outerRadius={44}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                      >
                        <Cell key="value" fill={theme.palette[kpi.color.split('.')[0]][kpi.color.split('.')[1]]} />
                        <Cell key="rest" fill={theme.palette.grey[200]} />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    color={theme.palette[kpi.color.split('.')[0]][kpi.color.split('.')[1]]}
                    sx={{ mt: 1, fontSize: 28 }}
                  >
                    {kpi.value}%
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 700, fontSize: 16 }}>
                    {kpi.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 13 }}>
                    lorem ipsum lorem ipsum kasin ipsum lorem ipsum
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {/* Right: Calendar and Activities */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            <Paper
              elevation={0}
              sx={{
                p: 0,
                m: 0,
                borderRadius: 3,
                minHeight: 340,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}
            >
              <Box sx={{ width: '100%', height: 340, display: 'flex', justifyContent: 'center', alignItems: 'center', p: 0 }}>
                <DateCalendar
                  defaultValue={dayjs()}
                  views={['day']}
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: '#fff',
                    borderRadius: 3,
                    boxShadow: 'none',
                    border: 'none',
                    p: 0,
                    m: 0,
                    minWidth: 0,
                    maxWidth: 'none',
                    '& .MuiPickersCalendarHeader-root': {
                      bgcolor: theme.palette.primary.main,
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      color: '#fff',
                      minHeight: 48,
                      mb: 0,
                      px: 2,
                      py: 1,
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: 18,
                        letterSpacing: 0.5
                      },
                      '& .MuiPickersArrowSwitcher-root button': {
                        color: '#fff'
                      }
                    },
                    '& .MuiPickersSlideTransition-root': {
                      minHeight: 220
                    },
                    '& .MuiPickersDay-root': {
                      color: theme.palette.text.primary,
                      fontWeight: 500,
                      fontSize: 16,
                      borderRadius: 2,
                      transition: 'none',
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: theme.palette.action.hover
                      }
                    },
                    '& .Mui-selected': {
                      bgcolor: theme.palette.primary.main + ' !important',
                      color: '#fff !important',
                      fontWeight: 700
                    },
                    '& .MuiPickersDay-today': {
                      border: 'none',
                      color: theme.palette.primary.main,
                      fontWeight: 700,
                      bgcolor: 'transparent'
                    },
                    '& .MuiPickersCalendarHeader-labelContainer': {
                      justifyContent: 'center'
                    },
                    '& .MuiPickersDay-root.Mui-disabled': {
                      color: theme.palette.grey[300]
                    },
                    '& .MuiDayCalendar-weekDayLabel': {
                      color: theme.palette.text.primary,
                      fontWeight: 700,
                      fontSize: 15
                    }
                  }}
                />
              </Box>
            </Paper>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                bgcolor: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                minHeight: 220
              }}
            >
              <Typography variant="h6" fontWeight={800} mb={1.5} color={theme.palette.primary.main} sx={{ fontSize: 20 }}>
                Activities
              </Typography>
              <Divider sx={{ mb: 1.5 }} />
              <Stack spacing={2}>
                {activities.map((act, idx) => (
                  <Box key={idx} sx={{ mb: 0.5 }}>
                    <Typography variant="body1" fontWeight={700} sx={{ fontSize: 15 }}>
                      {act.text}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 13 }}>
                      {act.date}, {act.time}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default SuperAdminDashboard;
