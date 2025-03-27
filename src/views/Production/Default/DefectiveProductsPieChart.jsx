// import React from 'react';
// import { Card, CardContent, Typography, Skeleton, Box } from '@mui/material';
// import { Pie } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// // Register ChartJS components
// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend
// );

// const DefectiveProductsPieChart = ({ isLoading, data }) => {
//   const chartData = {
//     labels: ['Good Production', 'Rejected Production'],
//     datasets: [
//       {
//         data: [data?.Good_Count[0] || 0, data?.Reject_Counters[0] || 0],
//         backgroundColor: [
//           'rgba(75, 192, 192, 0.6)',  // Green for good production
//           'rgba(255, 99, 132, 0.6)',   // Red for rejected
//         ],
//         borderColor: [
//           'rgba(75, 192, 192, 1)',
//           'rgba(255, 99, 132, 1)',
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const chartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: 'top',
//         labels: {
//           font: {
//             size: 12,
//             family: "'Roboto', sans-serif",
//             weight: '500',
//           },
//           color: '#333',
//         },
//       },
//       tooltip: {
//         bodyFont: {
//           size: 12,
//           family: "'Roboto', sans-serif",
//         },
//       },
//     },
//   };

//   return (
//     <Card
//       sx={{
//         borderRadius: '12px',
//         boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//         transition: 'all 0.3s ease-in-out',
//         '&:hover': {
//           boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
//         },
//         background: 'linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)',
//         width: '72%',
//         height: { xs: '300px', sm: '350px', md: '400px' },
//         maxWidth: '600px',
//         mx: 'auto',
//         mt: { xs: 2, md: 14.5 },
//       }}
//     >
//       <CardContent sx={{ 
//         p: { xs: 2, sm: 3 },
//         height: 'flex',
//         display: 'flex',
//         flexDirection: 'column',
//       }}>
//         {isLoading ? (
//           <>
//             <Skeleton variant="text" width="72%" height={40} />
//             <Skeleton variant="rectangular" sx={{ flexGrow: 2, mt: 2 }} />
//           </>
//         ) : (
//           <>
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: 600,
//                 color: '#333',
//                 mb: 2,
//                 textAlign: 'center',
//                 fontFamily: "'Roboto', sans-serif",
//                 fontSize: { xs: '1rem', sm: '1.25rem' },
//               }}
//             >
//               Good vs Bad Production
//             </Typography>
//             <Box sx={{ 
//               flexGrow: 1,
//               minHeight: '200px',
//               position: 'relative',
//               width: '100%'
//             }}>
//               <Pie 
//                 data={chartData} 
//                 options={chartOptions}
//                 style={{ width: '100%', height: '100%' }}
//               />
//             </Box>
//           </>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default DefectiveProductsPieChart;