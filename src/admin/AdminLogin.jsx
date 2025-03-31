import React from 'react'
import { 
    Box, 
    Typography, 
    Button, 
    Paper, 
    TextField,
  } from '@mui/material';

function AdminLogin() {
    return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <Paper sx={{ p: 4, width: 400 }}>
            <Typography variant="h4" gutterBottom align="center">
              Admin Login
            </Typography>
            <form >
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                variant="outlined"
                required
              />
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                type="password"
                variant="outlined"
                required
              />
              <Button
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3 }}
              >
                Login
              </Button>
            </form>
          </Paper>
        </Box>
      );
}

export default AdminLogin
