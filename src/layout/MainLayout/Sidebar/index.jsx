import { memo, useMemo } from 'react';

import useMediaQuery from '@mui/material/useMediaQuery';

import Box from '@mui/material/Box';

import PerfectScrollbar from 'react-perfect-scrollbar';


import MenuList from '../MenuList';
import MiniDrawerStyled from './MiniDrawerStyled';

import useConfig from 'hooks/useConfig';
import { drawerWidth } from 'store/constant';

import {useGetMenuMaster } from 'api/menu';

function Sidebar() {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster.isDashboardDrawerOpened;

  const { mode } = useConfig();

  

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

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: { xs: 'auto', md: drawerWidth } }} aria-label="mailbox folders">
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          {drawerOpen?drawer:""}
        </MiniDrawerStyled>
    </Box>
  );
}

export default memo(Sidebar);
