import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';

import PerfectScrollbar from 'react-perfect-scrollbar';


import MenuList from '../MenuList';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';
import { useNavigate,useLocation } from 'react-router';
import { useGetMenuMaster } from 'api/menu';

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const navigate = useNavigate()
  const {search,pathname} = useLocation()
  const queryParams = new URLSearchParams(search);
  const serialNumber = queryParams.get('serial_number');

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { mode } = useConfig();


  function getHomeBtn(pathname) {
    if (pathname == "/") {
      return (<></>)
    } else if (pathname == "/dash" || pathname=="/usermangement") {
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



  const drawer = useMemo(() => {
    const drawerContent = (
      <>

      </>
    );

    let drawerSX = { paddingLeft: '0px', paddingRight: '0px', marginTop: '13vh' };
    if (drawerOpen) drawerSX = { paddingLeft: '16px', paddingRight: '16px', marginTop: '10vh' };

    return (
      <>
        {downMD ? (
          <Box sx={drawerSX}>
            <MenuList />
            {drawerOpen && drawerContent}
          </Box>
        ) : (
          <PerfectScrollbar style={{ height: 'calc(100vh - 88px)', ...drawerSX }}>
            <MenuList />
            {drawerOpen && drawerContent}
          </PerfectScrollbar>
        )}
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [downMD, drawerOpen, mode]);

  if (!drawerOpen) {
    return (<Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: 130 } }} aria-label="mailbox folders"></Box>)
  }
  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
      <MiniDrawerStyled variant="permanent" open={drawerOpen}>
       
        {<div className='h-ful'>{getHomeBtn(pathname)}</div>}
         {drawer}
      </MiniDrawerStyled>
    </Box>
  );
}

export default memo(Sidebar);
