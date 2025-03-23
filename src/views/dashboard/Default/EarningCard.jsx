import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { getMachineData } from '../../../backservice';
import { useNavigate } from 'react-router';
import { mstatus, getMstatusBGColor } from '../../../constants';

export default function EarningCard({ isLoading, data }) {
  const [machineData, setMachineData] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();

  function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }

  const getOfflineDuration = (timestamp) => {
    if (!timestamp) return 'N/A';
    const lastOnline = new Date(timestamp);
    const currentTime = new Date();
    const diffMs = currentTime - lastOnline;
    
    const minutes = Math.floor(diffMs / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  const dataChange = (tp) => {
    if (!tp) return false;
    const date = new Date(tp);
    const currentTime = new Date();
    return (currentTime - date) <= 60000;
  };

  useEffect(() => {
    if (data?.serial_number) {
      getMachineData(data.serial_number).then(setMachineData);
    }
  }, [data]);

  const isOnline = dataChange(machineData?.ts);
  const machineType = data?.serial_number?.startsWith("PAC") ? "Cartoning" : "Tube Filling";
  const modelType = data?.serial_number?.startsWith("PAC") ? "PAC300" : "MAC300";
  const lineNumber = data?.line_number || machineData?.line_number || 'N/A';
  // Assuming speed is available in machineData, adjust as needed
  const currentSpeed = machineData?.speed || 0; // Replace with actual speed field
  const maxSpeed = 300; // Adjust this based on your machine's max speed

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          onClick={() => navigate("/dash?serial_number=" + machineData?.serial_number)}
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.light',
            background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
            color: '#000',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
            },
            p: 0,
            width: { xs: '100%', sm: 256, md: 288 },
            maxWidth: { xs: '100%', sm: 288 },
            minWidth: { xs: 224, sm: 256 }
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: theme.palette.grey[200],
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              p: 1,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                color: theme.palette.grey[800]
              }}
            >
              Line: {lineNumber}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: '0.75rem', sm: '0.8rem' },
                fontWeight: 600,
                color: theme.palette.grey[800]
              }}
            >
              SL: {data?.serial_number || 'N/A'}
            </Typography>
          </Box>

          {/* Main Content */}
          <Box sx={{ p: { xs: 1.5, sm: 2 }, display: 'flex' }}>
            {/* Left Section */}
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '0.85rem', sm: '1rem' },
                  fontWeight: 600,
                  mb: 0.25,
                  color: theme.palette.grey[800]
                }}
              >
                <span className={getMstatusBGColor(mstatus[machineData?.d?.status[0]])}>
                  {mstatus[machineData?.d?.status[0]] || 'Unknown'}
                </span>
              </Typography>

              <Typography
                sx={{
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  fontWeight: 500,
                  mb: 0.25
                }}
              >
                {machineType}
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                <Typography
                  sx={{
                    fontSize: { xs: '0.75rem', sm: '0.8rem' },
                    color: theme.palette.grey[600]
                  }}
                >
                  Model: {modelType}
                </Typography>
              </Box>

              {/* <Typography
                sx={{
                  fontSize: '0.7rem',
                  color: theme.palette.grey[500],
                  mt: 0.25,
                  display: { xs: 'none', sm: 'block' }
                }}
              >
                Last: {machineData?.ts ? formatTimestamp(machineData.ts) : 'N/A'}
              </Typography> */}
            </Box>

            {/* Right Section - Speedometer */}
            <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                <svg width="80" height="80" viewBox="0 0 100 100">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={theme.palette.grey[300]}
                    strokeWidth="10"
                  />
                  {/* Speed indicator */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isOnline ? theme.palette.success.main : theme.palette.error.main}
                    strokeWidth="10"
                    strokeDasharray={`${(currentSpeed / maxSpeed) * 283} 283`}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                    fontWeight: 600,
                    color: theme.palette.grey[800]
                  }}
                >
                  {currentSpeed}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Status Bar */}
          <Box
            sx={{
              bgcolor: isOnline ? 'success.main' : 'error.main',
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              p: 0.75,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#fff', 
                fontWeight: 600,
                fontSize: { xs: '0.65rem', sm: '0.7rem' }
              }}
            >
              {isOnline ? 'Online' : 'Offline'}
            </Typography>
            {!isOnline && (
              <Typography
                variant="caption"
                sx={{
                  color: '#fff',
                  fontSize: { xs: '0.6rem', sm: '0.65rem' }
                }}
              >
                {getOfflineDuration(machineData?.ts)}
              </Typography>
            )}
          </Box>
        </MainCard>
      )}
    </>
  );
}

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.shape({
    serial_number: PropTypes.string,
    line_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })
};

EarningCard.defaultProps = {
  isLoading: false,
  data: { serial_number: 'N/A' }
};