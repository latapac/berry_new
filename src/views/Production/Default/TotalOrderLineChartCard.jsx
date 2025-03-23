import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Skeleton, Box, Grid } from '@mui/material';
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

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const TotalOrderBarChartCard = ({ isLoading, data }) => {
  const [chartData, setChartData] = useState({
    labels: [], // X-axis labels (e.g., timestamps)
    datasets: [
      {
        label: 'Actual Production',
        data: [], // Y-axis data for Actual Production
        backgroundColor: 'rgba(75, 192, 10,0.75)',
        borderColor: 'rgba(75, 192, 10,3 )',
        borderWidth: 1,
      },
      {
        label: 'Target Production',
        data: [], // Y-axis data for Target Production
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  });

  const [pieData, setPieData] = useState({
    labels: ['Good Production', 'Rejected Production'],
    datasets: [
      {
        data: [700, 130], // Example data for pie chart
        backgroundColor: ['rgba(75, 192, 10, 0.75)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(75, 192, 10, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  });

  // Simulate live data updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (data) {
        setChartData((prevData) => ({
          labels: [...prevData.labels, new Date().toLocaleTimeString()],
          datasets: [
            {
              ...prevData.datasets[0],
              data: [...prevData.datasets[0].data, 700], // Actual Production
            },
            {
              ...prevData.datasets[1],
              data: [...prevData.datasets[1].data, 130], // Target Production
            },
          ],
        }));

        setPieData((prevData) => ({
          ...prevData,
          datasets: [
            {
              ...prevData.datasets[0],
              data: [770, 130], // Update pie chart data
            },
          ],
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  // Chart configuration
  const chartOptions = {
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
          color: '#333',
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
        color: '#333',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          family: "'Roboto', sans-serif",
        },
        bodyFont: {
          size: 12,
          family: "'Roboto', sans-serif",
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#666',
          font: {
            size: 12,
            family: "'Roboto', sans-serif",
          },
          beginAtZero: true,
        },
      },
    },
  };

  const pieOptions = {
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
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Production Distribution',
        font: {
          size: 18,
          weight: 'bold',
          family: "'Roboto', sans-serif",
        },
        color: '#333',
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
  };

  return (
    <Card
      sx={{
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)',
        },
        background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
        width: '77.5vw', // Adjusted to take more width
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width="80%" height={40} />
            <Skeleton variant="rectangular" height={300} sx={{ mt: 2 }} />
          </>
        ) : (
          <>
            {/* Top Row: Production Metrics */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Production
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    990
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)',
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Good Production
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    900
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: '#fff',
                    textAlign: 'center',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Rejected Production
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    90
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Bottom Row: Charts */}
            <Grid container spacing={3}>
              {/* Bar Chart */}
              <Grid item xs={8}>
                <Box sx={{ height: '400px', position: 'relative' }}>
                  <Bar options={chartOptions} data={chartData} />
                </Box>
              </Grid>
              {/* Pie Chart */}
              
            </Grid>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TotalOrderBarChartCard;