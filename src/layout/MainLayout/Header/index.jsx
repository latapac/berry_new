// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import {  useNavigate } from 'react-router';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header({show}) {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate()

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;
  if (!show) {
    
    return (
      <>
        {/* logo & toggler button */}
        <Box sx={{ width: downMD ? 'auto' : 228, display: 'flex' }}>
  
          <Avatar
            variant="rounded"
            sx={{
              ...theme.typography.commonAvatar,
              ...theme.typography.mediumAvatar,
              overflow: 'hidden',
              transition: 'all .2s ease-in-out',
              bgcolor: 'secondary.light',
              color: 'secondary.dark',
              '&:hover': {
                bgcolor: 'secondary.dark',
                color: 'secondary.light'
              }
            }}
            onClick={() => handlerDrawerOpen(!drawerOpen)}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="20px" />
          </Avatar>
  
        </Box>
  
        <Box sx={{ flexGrow: 1 }} />
  
        <NotificationSection />
  
        <ProfileSection />
      </>
    );
  }else{
    return <><button onClick={()=>{navigate("/AdminIndex")}}>back to admin</button></>
  }

 
}
