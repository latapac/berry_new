import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Skeleton, 
  Box, 
  Grid 
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

export default function Production() {
  const [isLoading, setLoading] = useState(true);
  const [machineData, setMachineData] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Actual Production',
        data: [],
        backgroundColor: 'rgba(75, 192, 10,0.75)',
        borderColor: 'rgba(75, 192, 10,3 )',
        borderWidth: 3,
      },
      {
        label: 'Target Production',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 3,
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
    });
  }, [serialNumber]);

  // Simulate live data updates every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (machineData) {
        setChartData((prevData) => ({
          labels: [...prevData.labels, new Date().toLocaleTimeString()],
          datasets: [
            {
              ...prevData.datasets[0],
              data: [machineData?.d?.Total_Production[0]],
            },
            {
              ...prevData.datasets[1],
              data: [67], // Target Production
            },
          ],
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [machineData]);

  // Chart configuration
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

  // Pie chart data and options
  const pieChartData = {
    labels: ['Good Production', 'Rejected Production'],
    datasets: [
      {
        data: [machineData?.d?.Good_Count[0] || 0, machineData?.d?.Reject_Counters[0] || 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
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
          color: '#333',
        },
      },
      tooltip: {
        bodyFont: {
          size: 12,
          family: "'Roboto', sans-serif",
        },
      },
    },
  };

  return (
    <Grid container spacing={gridSpacing}>
      {/* Top Row: Production Metrics */}
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', color: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Total Production</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {isLoading ? <Skeleton width="60%" /> : machineData?.d?.Total_Production[0]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #96e6a1 0%, #d4fc79 100%)', color: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Good Production</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {isLoading ? <Skeleton width="60%" /> : machineData?.d?.Good_Count[0]}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)' }}>
              <CardContent sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: '#fff' }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Rejected Production</Typography>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
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
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              height: '100%',
              minHeight: '400px'
            }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Production Details</Typography>
                <Box sx={{ height: 'calc(100% - 40px)', position: 'relative' }}>
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
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
              height: '100%',
              minHeight: '400px'
            }}>
              <CardContent sx={{ p: 3, height: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Good vs Bad Production</Typography>
                <Box sx={{ height: 'calc(100% - 40px)', position: 'relative' }}>
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