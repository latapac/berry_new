import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import MainCard from 'ui-component/cards/MainCard';
import SkeletonTotalOrderCard from 'ui-component/cards/Skeleton/EarningCard';

// assets

export default function TotalOrderLineChartCard({ isLoading ,Count , name}) {

  
  const theme = useTheme();

  const [timeValue, setTimeValue] = React.useState(false);
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          content={false}
          sx={{
            bgcolor: 'primary.dark',
            color: '#fff',
            overflow: 'hidden',
            position: 'relative',
            '&>div': {
              position: 'relative',
              zIndex: 5
            },
           
          }}
        >
          <Box sx={{ pb: 5.7 }}>
            <Grid container direction="column">
              <Grid>
                <Grid container sx={{ justifyContent: 'space-between' }}>
                  <Grid>
                   
                  </Grid>
                 
                </Grid>
              </Grid>
              <Grid sx={{ display: 'flex',justifyContent: 'center',alignItems: 'center',mt: '2rem'}}>
                <Grid container sx={{ alignItems: 'center'}}>
                  <Grid size={6}>
                    <Grid container sx={{ alignItems: 'center'}}>
                      <Grid sx={{}}>
                        {timeValue ? (
                          <Typography sx={{ fontSize: '1rem', fontWeight: 500, width: '60vh', marginLeft: '18vh' }}>{Count}</Typography>
                        ) : (
                          <Typography sx={{ fontSize: '2.125rem', fontWeight: 500, width: '60vh', marginLeft: '18vh'}}>{Count}</Typography>
                        )}
                      </Grid>
                      
                      <Grid size={12}>
                        <Typography
                          sx={{
                            fontSize: '1rem',
                            fontWeight: 500,
                            color: 'primary.200',
                            marginLeft: '6vh'
                          }}
                        >
                        {name}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>

                </Grid>
              </Grid>
            </Grid>
          </Box>
        </MainCard>
      )}
    </>
  );
}

TotalOrderLineChartCard.propTypes = { isLoading: PropTypes.bool };
