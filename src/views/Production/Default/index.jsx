import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Skeleton, 
  Box, 
  Grid,
  useTheme
} from '@mui/material';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { getMachineData } from "../../../backservice";
import { gridSpacing } from 'store/constant';
import { useLocation } from 'react-router';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Production() {
  const theme = useTheme();
  const [isLoading, setLoading] = useState(true);
  const [machineData, setMachineData] = useState({});
  const [chartData, setChartData] = useState({
    labels: ['Production'],
    datasets: [
      {
        label: 'Actual Production',
        data: [0], // Default value, will be updated
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.dark,
        borderWidth: 2,
        borderRadius: 4,
      },
      {
        label: 'Target Production',
        data: [67], // Static target value
        backgroundColor: theme.palette.secondary.main,
        borderColor: theme.palette.secondary.dark,
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  });
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const serialNumber = queryParams.get('serial_number');

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    getMachineData(serialNumber).then((data) => {
      setMachineData(data);
      // Set the chart data with actual production
      setChartData({
        labels: ['Production'],
        datasets: [
          {
            label: 'Actual Production',
            data: [data?.d?.Total_Production[0] || 0], // Set actual production data
            backgroundColor: theme.palette.primary.main,
            borderColor: theme.palette.primary.dark,
            borderWidth: 2,
            borderRadius: 4,
          },
          {
            label: 'Target Production',
            data: [67], // Static target production value
            backgroundColor: theme.palette.secondary.main,
            borderColor: theme.palette.secondary.dark,
            borderWidth: 2,
            borderRadius: 4,
          },
        ],
      });
    });
  }, [serialNumber]);

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            family: "'Roboto', sans-serif",
            weight: '500',
          },
          color: theme.palette.text.primary,
        },
      },
      title: {
        display: true,
        text: 'Production Details',
        font: {
          size: 18,
          weight: 'bold',
          family: "'Roboto', sans-serif",
        },
        color: theme.palette.text.primary,
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: theme.palette.background.paper,
        titleFont: {
          size: 14,
          family: "'Roboto', sans-serif",
          weight: 'bold',
          color: theme.palette.text.primary
        },
        bodyFont: {
          size: 12,
          family: "'Roboto', sans-serif",
          color: theme.palette.text.secondary
        },
        cornerRadius: 4,
        displayColors: true,
        borderColor: theme.palette.divider,
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          beginAtZero: true,
        },
      },
    },
  };

  const pieChartData = {
    labels: ['Good Production', 'Rejected Production'],
    datasets: [
      {
        data: [machineData?.d?.Good_Count[0] || 0, machineData?.d?.Reject_Counters[0] || 0],
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.error.main,
        ],
        borderColor: [
          theme.palette.success.dark,
          theme.palette.error.dark,
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
            weight: '500',
          },
          color: theme.palette.text.primary,
        },
      },
      tooltip: {
        backgroundColor: theme.palette.background.paper,
        bodyFont: {
          size: 12,
          family: "'Roboto', sans-serif",
          color: theme.palette.text.secondary
        },
        titleFont: {
          size: 14,
          family: "'Roboto', sans-serif",
          weight: 'bold',
          color: theme.palette.text.primary
        },
      },
    },
  };

  return (
    <Grid container spacing={gridSpacing} sx={{ p: 3 }}>
      {/* Top Row: Production Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              borderRadius: '8px', 
              boxShadow: theme.shadows[3],
              borderLeft: `4px solid ${theme.palette.primary.main}` 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.secondary,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box component="span" sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.primary.main
                  }}/>
                  Total Production
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}>
                  {isLoading ? <Skeleton width="60%" /> : machineData?.d?.Total_Production[0]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              borderRadius: '8px', 
              boxShadow: theme.shadows[3],
              borderLeft: `4px solid ${theme.palette.success.main}` 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.secondary,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box component="span" sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.success.main
                  }}/>
                  Good Production
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}>
                  {isLoading ? <Skeleton width="60%" /> : machineData?.d?.Good_Count[0]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              borderRadius: '8px', 
              boxShadow: theme.shadows[3],
              borderLeft: `4px solid ${theme.palette.error.main}` 
            }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="subtitle1" sx={{ 
                  fontWeight: 600, 
                  color: theme.palette.text.secondary,
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box component="span" sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: theme.palette.error.main
                  }}/>
                  Rejected Production
                </Typography>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700,
                  color: theme.palette.text.primary
                }}>
                  {isLoading ? <Skeleton width="60%" /> : machineData?.d?.Reject_Counters[0]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>

      {/* Bottom Row: Charts */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          {/* Bar Chart */}
          <Grid item xs={12} md={8}>
            <Card sx={{ 
              borderRadius: '8px', 
              boxShadow: theme.shadows[3],
              height: '100%',
              minHeight: '400px'
            }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box component="span" sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '4px',
                    bgcolor: theme.palette.primary.main
                  }}/>
                  Production Trend
                </Typography>
                <Box sx={{ 
                  height: 'calc(100% - 40px)', 
                  position: 'relative',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  p: 1,
                  backgroundColor: theme.palette.background.paper
                }}>
                  {isLoading ? (
                    <Skeleton variant="rectangular" height="100%" />
                  ) : (
                    <Bar options={barChartOptions} data={chartData} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Pie Chart */}
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              borderRadius: '8px', 
              boxShadow: theme.shadows[3],
              height: '100%',
              minHeight: '400px'
            }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600, 
                  mb: 2,
                  color: theme.palette.text.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Box component="span" sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '4px',
                    bgcolor: theme.palette.success.main
                  }}/>
                  Quality Distribution
                </Typography>
                <Box sx={{ 
                  height: 'calc(100% - 40px)', 
                  position: 'relative',
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: '4px',
                  p: 1,
                  backgroundColor: theme.palette.background.default
                }}>
                  {isLoading ? (
                    <Skeleton variant="rectangular" height="100%" />
                  ) : (
                    <Pie data={pieChartData} options={pieChartOptions} />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
