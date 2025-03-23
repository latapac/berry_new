import { useState } from 'react';

import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Grid from '@mui/material/Grid2';
import Tooltip from '@mui/material/Tooltip';

// third party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import FontFamily from './FontFamily';
import BorderRadius from './BorderRadius';

export default function Customization() {

  // drawer on/off
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      {/* toggle button */}
      <Tooltip title="Live Customize">
       
      </Tooltip>
      <Drawer anchor="right" onClose={handleToggle} open={open} PaperProps={{ sx: { width: 280 } }}>
        <PerfectScrollbar>
          <Grid container spacing={2}>
            <Grid size={12}>
              {/* font family */}
              <FontFamily />
              <Divider />
            </Grid>
            <Grid size={12}>
              {/* border radius */}
              <BorderRadius />
              <Divider />
            </Grid>
          </Grid>
        </PerfectScrollbar>
      </Drawer>
    </>
  );
}
