import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle';
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { getMachineData } from '../../../backservice';
import { useNavigate } from 'react-router';
import { mstatus, getMstatusBGColor } from '../../../constants';

const SpeedGauge = ({ value = 0, max = 100, size = 120 }) => {
  const theme = useTheme();
  const angle = (Math.min(value, max) / max) * 180;
  const center = size / 2;
  const radius = center - 15;

  return (
    <Box sx={{ position: 'relative', width: size, height: size / 2, overflow: 'hidden' }}>
      {/* Background Arc */}
      <svg width={size} height={size / 2} viewBox={`0 0 ${size} ${size / 2}`}>
        <path
          d={`M ${center - radius},${center} 
             A ${radius} ${radius} 0 0 1 ${center + radius},${center}`}
          fill="none"
          stroke={theme.palette.grey[300]}
          strokeWidth="12"
        />
        
        {/* Colored Arc */}
        <path
          d={`M ${center - radius},${center} 
             A ${radius} ${radius} 0 0 1 ${center + radius},${center}`}
          fill="none"
          stroke={theme.palette.primary.main}
          strokeWidth="12"
          strokeDasharray={`${(angle / 180) * Math.PI * radius} 1000`}
          strokeLinecap="round"
        />
        
        {/* Needle */}
        <line
          x1={center}
          y1={center}
          x2={center}
          y2={center - radius + 10}
          stroke={theme.palette.error.main}
          strokeWidth="2"
          transform={`rotate(${angle - 90}, ${center}, ${center})`}
          style={{ transition: 'transform 0.5s ease' }}
        />
        
        {/* Center Dot */}
        <circle cx={center} cy={center} r="3" fill={theme.palette.error.main} />
      </svg>

      {/* RPM Display */}
      <Box sx={{ 
        position: 'absolute', 
        bottom: 8, 
        left: '50%', 
        transform: 'translateX(-50%)',
        textAlign: 'center'
      }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          RPM
        </Typography>
      </Box>
    </Box>
  );
};

export default function EarningCard({ isLoading, data }) {
  const [machineData, setMachineData] = useState({});
  const navigate = useNavigate();

  const formatTimestamp = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const dataChange = (tp) => {
    if (!tp) return false;
    const date = new Date(tp);
    return (new Date() - date) < 60000;
  };

  useEffect(() => {
    if (data?.serial_number) {
      getMachineData(data.serial_number).then(setMachineData);
    }
  }, [data]);

  return (
    <MainCard
      onClick={() => navigate(`/dash?serial_number=${machineData?.serial_number}`)}
      sx={{
        bgcolor: 'background.paper',
        background: `linear-gradient(135deg, ${useTheme().palette.grey[50]} 0%, ${useTheme().palette.grey[50]} 100%)`,
        borderRadius: 2,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)'
        }
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              mb: 1
            }}>
              <Typography variant="h3">
                <span className={getMstatusBGColor(mstatus[machineData?.d?.status[0]])}>
                  {mstatus[machineData?.d?.status[0]]}
                </span>
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                bgcolor: dataChange(machineData?.ts) ? 'success.main' : 'error.main',
                borderRadius: 2,
                px: 1,
                py: 0.5,
                ml: 2
              }}>
                <CircleIcon sx={{ fontSize: '1rem', color: '#fff' }} />
                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                  {dataChange(machineData?.ts) ? 'ONLINE' : 'OFFLINE'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 ,pl:2}}>
              {data.serial_number.startsWith("PAC") ? "Cartoning Machine" : "Tube Filler"}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <SpeedGauge 
              value={90 || 0} 
              max={300}  // Set your machine's max RPM here
              size={120}
            />
          </Grid>

          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 1,
              width: '30vh',
              bgcolor: 'background.default',
              borderRadius: 1,
              ml:-2
            }}>
              <Box>
                <Typography variant="caption" color="textSecondary" sx={{p:3}}>Model</Typography>
                <Typography variant="body2">
                  {data.serial_number.startsWith("PAC") ? "PAC-300" : "MAC-300"}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="textSecondary">Serial</Typography>
                <Typography variant="body2">{data?.serial_number}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </MainCard>
  );
}

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.shape({
    serial_number: PropTypes.string,
    speed: PropTypes.number
  })
};

EarningCard.defaultProps = {
  isLoading: false,
  data: {
    serial_number: 'N/A',
    speed: 0
  }
};