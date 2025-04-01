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
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router';
import { getMachines } from '../backservice';

const AdminMachine = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const companyId = queryParams.get('c_id');
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
    getMachines(companyId).then((data) => {
      setMachines(data)
    })
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
                <TableCell>Machine Serial</TableCell>
                <TableCell>Model Number</TableCell>
                <TableCell>Line Number</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.map((machine) => (
                <TableRow key={machine._id}>
                  <TableCell>{machine.serial_number}</TableCell>
                  <TableCell>{machine.model?.toUpperCase()}</TableCell>
                  <TableCell>{machine.lineNo}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleOpenModal(machine)}
                      sx={{ mr: 2 }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteMachine(machine.id)}
                      sx={{ mr: 2 }}
                    >
                      Delete
                    </Button>
                    <Button
                      variant="contained"
                      color="warning"
                      size="small"
                      onClick={() => navigate("/dash?serial_number=" + machine.serial_number)}
                    >
                      View Dashboard
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