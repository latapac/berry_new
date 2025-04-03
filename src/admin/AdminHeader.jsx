import React from 'react'
import { AppBar } from '@mui/material'
function AdminHeader() {
  return (
    <div>
       <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', boxShadow: 'none' }}>
        <Toolbar>
          <Business sx={{ mr: 2, fontSize: '32px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: '0.5px', color: 'white', fontSize: '3vh' }}>
            PACMAC
          </Typography>
         
        </Toolbar>
        </AppBar>
    </div>
  )
}

export default AdminHeader
