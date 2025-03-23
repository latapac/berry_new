import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircleIcon from '@mui/icons-material/Circle'; // Status indicator

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SkeletonEarningCard from 'ui-component/cards/Skeleton/EarningCard';
import { getMachineData } from '../../../backservice';
import { useNavigate } from 'react-router';
import { mstatus , getMstatusBGColor} from '../../../constants';


export default function EarningCard({ isLoading, data }) {
  
  const [machineData,setMachineData] = useState({})

  const navigate = useNavigate()

  function formatTimestamp(isoString) {
    const date = new Date(isoString);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    return ` ${year}/${month + 1}/${day} ${hours}:${minutes}:${seconds}`;
  }

  const dataChange = (tp) => {

    if (tp === undefined) {
      return false;
    }
    const date = new Date(tp);
    const currentTime = new Date();
    const differenceInMilliseconds = currentTime - date;
    const isChanged = differenceInMilliseconds > 60000;

   return !isChanged
  };

  useEffect(()=>{
    if (data) {
      getMachineData(data.serial_number).then((data)=>{
        setMachineData(data)
      })
    }
  })
  
  const theme = useTheme();
  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
        onClick={()=>{navigate("/dash?serial_number="+machineData?.serial_number)}}
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.light ',
            background: `linear-gradient(135deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[50]  } 100%)`, // Gradient background
            color: '#000',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: 2, // Rounded corners
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)', // Subtle shadow
            transition: 'transform 0.3s ease, box-shadow 0.3s ease', // Smooth transitions
            '&:hover': {
              transform: 'translateY(-4px)', // Slight lift on hover
              boxShadow: '0 6px 25px rgba(0, 0, 0, 0.15)' // Enhanced shadow on hover
            }
          }}
        >
          <Box sx={{ p: 2.6 }}> {/* Increased padding for better spacing */}
            <Grid container direction="column">
              {/* Header Section */}
              <Grid>
                <Grid 
                  container 
                  sx={{ 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mb: 1 // Margin bottom for spacing
                  }}
                >
                  <Grid>
                  <Typography variant="h3"  gutterBottom>
                   <span className={getMstatusBGColor(mstatus[machineData?.d?.status[0]])}>{mstatus[machineData?.d?.status[0]]}</span>
                  </Typography> 
                  </Grid>
                  <Grid>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {/* Enhanced Status Indicator */}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          bgcolor:dataChange(formatTimestamp(machineData?.ts)) ? 'success.main' : 'error.main',
                          borderRadius: 2,
                          px: 1,
                          py: 0.5,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
                        }}
                      >
                        <CircleIcon sx={{ fontSize: '1rem', color:'#fff' }} />
                        <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                          {dataChange(formatTimestamp(machineData?.ts))? 'Online' : 'Offline'}
                        </Typography>
                      </Box>
                    
                    </Box>
                  
                  </Grid>
                </Grid>
              </Grid>
              {/* Machine Information Section */}
              <Grid container direction="column">
                <Typography 
                  sx={{ 
                    fontSize: '1.25rem', // Larger text
                    fontWeight: 600, 
                    mb: 1,
                    letterSpacing: 0.5 // Better readability
                  }}
                >
                  {data.serial_number.startsWith("PAC")?"Cartoning":"Tube Filling"}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 400, 
                    mb: 0.75,
                    opacity: 0.9 // Slightly faded for hierarchy
                  }}
                >
                  Model: {data.serial_number.startsWith("PAC")?"PAC300":"MAC300"}
                </Typography>
                <Typography 
                  sx={{ 
                    fontSize: '1rem', 
                    fontWeight: 400, 
                    mb: 0.75,
                    opacity: 0.9
                  }}
                >
                  Serial No: {data?.serial_number || 'N/A'}
                </Typography>
              
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

// Prop type definitions
EarningCard.propTypes = {
  isLoading: PropTypes.bool,
  data: PropTypes.shape({
    machineName: PropTypes.string,
    model: PropTypes.string,
    serialNumber: PropTypes.string,
    isOnline: PropTypes.bool
  })
};

// Default props for safety
EarningCard.defaultProps = {
  isLoading: false,
  data: {
    machineName: 'N/A',
    model: 'N/A',
    serialNumber: 'N/A',
    isOnline: false
  }
};