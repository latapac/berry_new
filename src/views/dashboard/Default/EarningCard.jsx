import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { getMachineData } from '../../../backservice';
import { useNavigate } from 'react-router';
import { mstatus, getMstatusBGColor } from '../../../constants';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import ErrorIcon from '@mui/icons-material/Error';

// Utility functions remain unchanged
const formatSerialNumber = (serialNumber) => {
  if (!serialNumber || typeof serialNumber !== 'string') return 'N/A';
  const prefixMatch = serialNumber.match(/^[A-Za-z]+/);
  const prefix = prefixMatch ? prefixMatch[0] : '';
  if (!prefix) return serialNumber;
  const numericPart = serialNumber.slice(prefix.length);
  if (numericPart.length < 8) return serialNumber;
  const yearPart = numericPart.slice(0, 4);
  const numberPart = numericPart.slice(4, 8);
  const formattedYear = `${yearPart.slice(0, 2)}-${yearPart.slice(2)}`;
  return `${prefix}/${formattedYear}/${numberPart}`;
};

const getStatusIcon = (status) => {
  switch (status) {
    case 'Execute':
      return <PlayArrowIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'Idle':
      return <PauseIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'Aborted':
      return <StopIcon sx={{ fontSize: '1rem', mr: 0.5, verticalAlign: 'middle' }} />;
    case 'Offline':
    case 'Unknown':
    default:
      return <ErrorIcon sx={{ fontSize: "1rem", mr: 0.5, verticalAlign: 'middle' }} />;
  }
};

export default function EarningCard({ isLoading, data }) {
  const [machineData, setMachineData] = useState({});
  const navigate = useNavigate();
  const theme = useTheme();

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
    if (!data?.serial_number) return;
    const fetchData = async () => {
      const newData = await getMachineData(data.serial_number);
      setMachineData(newData);
      
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [data?.serial_number]);
  

  const isOnline = dataChange(machineData?.ts);
  const modelType = data?.model.toUpperCase()
  const lineNumber =  data?.lineNo || 'N/A';
  const currentSpeed = Number(machineData?.d?.current_speed[0]) || 0;
  const maxSpeed = 300;
  const oee = !isNaN(Number(machineData?.d?.current_OEE[0]).toFixed(2))?Number(machineData?.d?.current_OEE[0]).toFixed(2):0
  const formattedSerialNumber = formatSerialNumber(data?.serial_number);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const speedProgress = (currentSpeed / maxSpeed) * circumference;
  const oeeProgress = (oee / 100) * circumference;
  const statusText = !isOnline ? 'Offline' : (mstatus[machineData?.d?.status[0]] || 'Unknown');

  

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
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)',
            },
            p: 0,
            width: { xs: '100%', sm: 'clamp(256px, 30vw, 288px)' }, // Fluid width with clamp
            maxWidth: '100%',
            minWidth: { xs: 'min(224px, 90vw)', sm: 256 },
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.grey[200],
              borderTopLeftRadius: 2,
              borderTopRightRadius: 2,
              p: { xs: 0.5, sm: 0.75 }, // Scaled padding
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: 'clamp(0.65rem, 2vw, 0.75rem)', sm: '0.8rem' },
                fontWeight: 600,
                color: theme.palette.grey[800],
                whiteSpace: 'nowrap',
              }}
            >
              {modelType}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                fontSize: { xs: 'clamp(0.65rem, 2vw, 0.75rem)', sm: '0.8rem' },
                fontWeight: 600,
                color: theme.palette.grey[800],
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                maxWidth: { xs: '50%', sm: '60%' },
              }}
            >
              {formattedSerialNumber}
            </Typography>
          </Box>

          <Box sx={{ p: { xs: 1, sm: 1.5 }, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: { xs: 0.25, sm: 0.5 } }}>
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1rem', sm: '1.2rem' },
                  fontWeight: 800,
                  color: theme.palette.grey[900],
                  backgroundColor: theme.palette.grey[300],
                  px: { xs: 0.75, sm: 1 },
                  borderRadius: 1,
                }}
              >
                L: {lineNumber}
              </Typography>

              {/* Speed and OEE */}
              <Box sx={{ display: 'flex', gap: { xs: 0.25, sm: 0.5 }, alignItems: 'center' }}>
                {/* Speed Gauge */}
                <Box sx={{ display: 'flex', gap: { xs: 0.25, sm: 0.5 }, alignItems: 'center' }}>
                  {/* Speed Gauge */}
                  <Box sx={{ position: 'relative', width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke={theme.palette.grey[300]}
                        strokeWidth="3"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="#26A69A"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${speedProgress} ${circumference}`}
                        transform="rotate(-90 50 50)"
                      />
                      {/* Centered number/text */}
                      <text
                        x="50"
                        y="50"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={theme.palette.text.primary}
                        style={{
                          fontSize: '24px', // Adjust size as needed
                          fontWeight: 'bold',
                        }}
                      >
                        {currentSpeed} 
                      </text>
                    </svg>
                    <Typography
                      sx={{
                        fontSize: { xs: '0.6rem', sm: '0.75rem' },
                        color: theme.palette.grey[600],
                        mt: { xs: 0.25, sm: 0.5 },
                      }}
                    >
                      Speed
                    </Typography>
                  </Box>
                </Box>

                {/* OEE Gauge */}
                <Box sx={{ position: 'relative', width: { xs: 60, sm: 80 }, height: { xs: 60, sm: 80 }, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke={theme.palette.grey[300]}
                      strokeWidth="3"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="#AB47BC"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${oeeProgress} ${circumference}`}
                      transform="rotate(-90 50 50)"
                    />
                    {/* Add this text element for the centered number */}
                    <text
                      x="50"
                      y="50"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill={theme.palette.text.primary}
                      style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                      }}
                    >
                      {oee}%
                    </text>
                  </svg>
                  <Typography
                    sx={{
                      fontSize: { xs: '0.6rem', sm: '0.75rem' },
                      color: theme.palette.grey[600],
                      mt: { xs: 0.25, sm: 0.5 },
                    }}
                  >
                    OEE
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Status */}
            <Box
              sx={{
                p: { xs: 0.25, sm: 0.5 },
                pt: 0,
                pb: 0,
                mb: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '0.8rem', sm: '1rem' },
                  fontWeight: 600,
                  color: theme.palette.grey[800],
                  display: 'flex',
                  alignItems: 'center',
                  mb: 0,
                }}
              >
                {getStatusIcon(statusText)}
                <span className={getMstatusBGColor(statusText)}>
                  {statusText}
                </span>
              </Typography>
            </Box>
          </Box>

          {/* Thin Status Line at Bottom */}
          <Box
            sx={{
              bgcolor: isOnline ? theme.palette.success.main : theme.palette.error.main,
              height: { xs: '16px', sm: '20px' }, // Scaled height
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: 'clamp(0.6rem, 1.5vw, 0.7rem)', sm: '0.75rem' },
                color: theme.palette.grey[100],
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                fontWeight: 400,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isOnline ? 'Online' : `Offline ${getOfflineDuration(machineData?.ts)}`}
            </Typography>
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
    line_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

