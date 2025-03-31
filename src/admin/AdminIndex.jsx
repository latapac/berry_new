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
import {  Add } from '@mui/icons-material';
import { getAllCompanies } from '../backservice';
import { useNavigate } from 'react-router';

const AdminIndex = () => {

  const navigate = useNavigate()

  const [companies, setCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentCompany, setCurrentCompany] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  

  const handleLogout = () => {
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  // Company handlers
  const handleOpenModal = (company = null) => {
    setCurrentCompany(company || {
      id: null,
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompany(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();
    if (currentCompany.id) {
      // Update existing company
      setCompanies(companies.map(company => 
        company.id === currentCompany.id ? currentCompany : company
      ));
    } else {
      // Add new company
      setCompanies([...companies, {
        ...currentCompany,
        id: Math.max(...companies.map(c => c.id), 0) + 1
      }]);
    }
    handleCloseModal();
  };

  const handleDeleteCompany = (id) => {
    setCompanies(companies.filter(company => company.id !== id));
  };

  useEffect(()=>{
    getAllCompanies().then((data)=>{
      setCompanies(data.data)
    })
  },[])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1,color:"white" }}>
            Company Management
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Companies</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => handleOpenModal()}
          >
            Add Company
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company ID</TableCell>
                <TableCell>Company Name</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.company_id}>
                  <TableCell>{company.company_id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell><button onClick={()=>{navigate("/adminMachine")}}>VIEW MACHINES</button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Add/Edit Company Modal */}
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
            {currentCompany.id ? 'Edit Company' : 'Add New Company'}
          </Typography>
          <form onSubmit={handleSubmitCompany}>
            <TextField
              fullWidth
              margin="normal"
              label="Company Name"
              name="name"
              value={currentCompany.name}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              name="email"
              type="email"
              value={currentCompany.email}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Phone"
              name="phone"
              value={currentCompany.phone}
              onChange={handleInputChange}
              required
            />
            <TextField
              fullWidth
              margin="normal"
              label="Address"
              name="address"
              value={currentCompany.address}
              onChange={handleInputChange}
              required
            />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {currentCompany.id ? 'Update' : 'Add'} Company
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminIndex;
