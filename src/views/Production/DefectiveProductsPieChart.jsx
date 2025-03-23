import React from 'react';
import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

const DefectiveProductsPieChart = ({ isLoading, data }) => {
  const chartData = {
    labels: ['Defective', 'Non-Defective'],
    datasets: [
      {
        label: 'Defective Products',
        data: [13 || 0, 77|| 0],
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

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
        text: 'Defective Products',
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
        width: '80%',
        height: '48vh',
        marginLeft: '35vh',
        marginTop: '20vh',
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {isLoading ? (
          <>
            <Skeleton variant="text" width="80%" height={48} />
            <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
          </>
        ) : (
          <>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#333',
                mb: 3,
                textAlign: 'center',
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              Defective Products
            </Typography>
            <Box sx={{ height: '200px', position: 'relative' }}>
              <Pie data={chartData} options={chartOptions} />
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DefectiveProductsPieChart;