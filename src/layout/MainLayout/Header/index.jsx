// material-ui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ProfileSection from './ProfileSection';
import NotificationSection from './NotificationSection';
import { useLocation, useNavigate } from 'react-router';

import { handlerDrawerOpen, useGetMenuMaster } from 'api/menu';

import { IconMenu2 } from '@tabler/icons-react';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

export default function Header() {
  const theme = useTheme();
  const downMD = useMediaQuery(theme.breakpoints.down('md'));
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const queryParams = new URLSearchParams(search);
  const serialNumber = queryParams.get('serial_number');

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  function getHomeBtn(pathname) {
    if (pathname == "/") {
      return (<></>)
    } else if (pathname == "/dash") {
      return (<div className='p-2 
    rounded-xl 
    bg-blue-800 
    text-slate-50 
    cursor-pointer 
    hover:bg-blue-700 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:ring-offset-2 
    transition-colors 
    duration-300 
    text-sm
    font-semibold' onClick={() => { navigate("/") }}>
        back to home
      </div>)
    } else {
      return (<div className='p-2 
    rounded-xl 
    bg-blue-800 
    text-slate-50 
    cursor-pointer 
    hover:bg-blue-700 
    focus:outline-none 
    focus:ring-2 
    focus:ring-blue-500 
    focus:ring-offset-2 
    transition-colors 
    duration-300 
    text-sm
    font-semibold' onClick={() => { navigate("/dash?serial_number=" + serialNumber) }}>
        back to dashboard
      </div>)
    }
  }

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

      {getHomeBtn(pathname)}
      <Box sx={{ flexGrow: 1 }} />

      <NotificationSection />

      <ProfileSection />
    </>
  );
}
