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
import { useDispatch } from 'react-redux';
import { adminLogout } from '../store/authslice';
import { addMachine, deleteMachine, getMachines } from '../backservice';

const AdminMachine = () => {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch()
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
    dispatch(adminLogout())
    navigate("/dash")
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
    const formdata = new FormData(e.target)
    const serial_number = formdata.get("serialnumber")
    const model = formdata.get("modelNumber")
    const lineNo = formdata.get("lineNumber")

    const data = {
      company_id:companyId
      , serial_number, model, lineNo
    }

    addMachine(data).then((data)=>{
      if (data) {
        alert("machine added")
        getMachines(companyId).then((data) => {
          if (typeof data == "object") {
            setMachines(data)
          }
        })
      }else{
        alert("machine add failed!")
      }
    })
    
   
    handleCloseModal();
  };

  const handleDeleteMachine = (id) => {
    let res = window.confirm("do you wanna delete machine?")
    if (res) {
      deleteMachine(id).then((res)=>{
        if (res) {
          alert("deleted")
          getMachines(companyId).then((data) => {
            setMachines(data)
          })
        }else{
          alert("deletion failed!")
        }
      })
    }else{

    }
  };

  useEffect(() => {
    getMachines(companyId).then((data) => {
      setMachines(data)
    })
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f5f7fa' }}>

      <Box sx={{ p: 4, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ color: '#1e3a8a', fontWeight: 600 }}>
            Machines
          </Typography>
          <Button
            variant="contained"
            sx={{ background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)' }}
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Machine
          </Button>
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ backgroundColor: '#f1f5f9' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Equipment Serial</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Model Specification</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Production Line</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1e3a8a' }}>Management</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {machines.map((machine) => (
                <TableRow key={machine._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell sx={{ fontWeight: 500 }}>{machine.serial_number}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{machine.model?.toUpperCase()}</TableCell>
                  <TableCell sx={{ color: '#64748b' }}>{machine.lineNo}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenModal(machine)}
                        sx={{
                          textTransform: 'none',
                          borderColor: '#1e3a8a',
                          color: '#1e3a8a',
                          '&:hover': { borderColor: '#172554' },
                          borderRadius: '6px'
                        }}
                      >
                        Edit Line No.
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleDeleteMachine(machine.serial_number)}
                        sx={{
                          textTransform: 'none',
                          borderColor: '#dc2626',
                          color: '#dc2626',
                          '&:hover': { borderColor: '#991b1b' },
                          borderRadius: '6px'
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate("/dash?serial_number=" + machine.serial_number)}
                        sx={{
                        
                          textTransform: 'none',
                          borderRadius: '6px'
                        }}
                      >
                        View Dashboard
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Line Number*/}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          p: 4,
          borderRadius: '12px',
          border: '1px solid #e2e8f0'
        }}>
          <Typography variant="h6" gutterBottom sx={{ color: '#1e3a8a', fontWeight: 600, mb: 3 }}>
            Enter Line Number: 
          </Typography>
          <form onSubmit={handleSubmitMachine}>
           
            <TextField
              fullWidth
              margin="normal"
              label="Line Number : "
              name="lineNumber"
              required
              sx={{ mb: 3 }}
              size="small"
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                onClick={handleCloseModal}
                sx={{
                  color: '#64748b',
                  textTransform: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px'
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained"
                sx={{
                  backgroundColor: '#1e3a8a',
                  '&:hover': { backgroundColor: '#172554' },
                  textTransform: 'none',
                  borderRadius: '6px',
                  padding: '6px 16px'
                }}
              >
                Confirm
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminMachine;