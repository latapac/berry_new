import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Modal,
  AppBar,
  Toolbar,
  IconButton
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { getAllCompanies } from '../backservice';
import { useNavigate } from 'react-router';

const AdminMachine = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentMachine, setCurrentMachine] = useState({
    id: null,
    machineId: '',
    machineNumber: '',
    modelNumber: '',
    lineNumber: ''
  });

  const handleLogout = () => {
    // Implement logout logic
  };

  // Machine handlers
  const handleOpenModal = (machine = null) => {
    setCurrentMachine(machine || {
      id: null,
      machineId: '',
      machineNumber: '',
      modelNumber: '',
      lineNumber: ''
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentMachine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitMachine = (e) => {
    e.preventDefault();
    if (currentMachine.id) {
      // Update existing machine
      setMachines(machines.map(machine => 
        machine.id === currentMachine.id ? currentMachine : machine
      ));
    } else {
      // Add new machine
      setMachines([...machines, {
        ...currentMachine,
        id: Math.max(...machines.map(m => m.id), 0) + 1
      }]);
    }
    handleCloseModal();
  };

  const handleDeleteMachine = (id) => {
    setMachines(machines.filter(machine => machine.id !== id));
  };

  useEffect(() => {
    // Fetch machines data - replace with your actual API call
    // For now, using mock data
    setMachines([
      { id: 1, machineId: 'CO-001', machineNumber: 'PAC240025', modelNumber: 'MAC300', lineNumber: 'Line-1' },
      { id: 2, machineId: 'CO-002', machineNumber: 'PAC240026', modelNumber: 'MAC301', lineNumber: 'Line-2' }
    ]);
    
    // If you have an API endpoint for machines:
    // getAllMachines().then((data) => {
    //   setMachines(data.data);
    // });
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white" }}>
            Machine Management
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Machines</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Machine
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Machine ID</TableCell>
                <TableCell>Machine Number</TableCell>
                <TableCell>Model Number</TableCell>
                <TableCell>Line Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>{machine.machineId}</TableCell>
                  <TableCell>{machine.machineNumber}</TableCell>
                  <TableCell>{machine.modelNumber}</TableCell>
                  <TableCell>{machine.lineNumber}</TableCell>
                  <TableCell>
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal(machine)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="contained" 
                      color="error"
                      size="small"
                      onClick={() => handleDeleteMachine(machine.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Machine Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}>
          <Typography variant="h6" gutterBottom>
            {currentMachine.id ? 'Edit Machine' : 'Add New Machine'}
          </Typography>
          <form onSubmit={handleSubmitMachine}>
            <TextField
              fullWidth
              margin="normal"
              label="Machine ID"
              name="machineId"
              value={currentMachine.machineId}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Machine Number"
              name="machineNumber"
              value={currentMachine.machineNumber}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Model Number"
              name="modelNumber"
              value={currentMachine.modelNumber}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Line Number"
              name="lineNumber"
              value={currentMachine.lineNumber}
              onChange={handleInputChange}
              required
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {currentMachine.id ? 'Update' : 'Add'} Machine
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminMachine;