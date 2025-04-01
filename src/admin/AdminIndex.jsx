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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material';
import { Add } from '@mui/icons-material';
import { getAllCompanies } from '../backservice';
import { useNavigate } from 'react-router-dom';

const AdminIndex = () => {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [currentCompany, setCurrentCompany] = useState({
    id: null,
    company_id: '',
    name: '',
    email: '',
    
  });

  // Generate next company ID
  const generateNextCompanyId = () => {
    if (companies.length === 0) return 'Cmp-001';
    
    const ids = companies.map(company => {
      const match = company.company_id?.match(/Cmp-(\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });
    
    const maxId = Math.max(...ids);
    const nextId = maxId + 1;
    return `Cmp-${nextId.toString().padStart(3, '0')}`;
  };

  // Modal handlers
  const handleOpenModal = (company = null) => {
    if (company) {
      setCurrentCompany(company);
    } else {
      setCurrentCompany({
        id: null,
        company_id: generateNextCompanyId(),
        name: '',
        email: '',
      
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCompany(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();
    if (currentCompany.id) {
      setCompanies(companies.map(company => 
        company.id === currentCompany.id ? currentCompany : company
      ));
      showSnackbar('Company updated successfully');
    } else {
      setCompanies([...companies, {
        ...currentCompany,
        id: Date.now() // Using timestamp as temporary ID
      }]);
      showSnackbar('Company added successfully');
    }
    handleCloseModal();
  };

  // Delete handlers
  const handleDeleteClick = (company) => {
    setCompanyToDelete(company);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setCompanies(companies.filter(company => company.company_id !== companyToDelete.company_id));
    setDeleteConfirmOpen(false);
    showSnackbar('Company deleted successfully');
    setCompanyToDelete(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCompanyToDelete(null);
  };

  // Snackbar handlers
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Initial data load
  useEffect(() => {
    // This would normally come from your API
    // getAllCompanies().then((data) => {
    //   setCompanies(data.data);
    // });
    
    // For demo purposes, we'll use some mock data
    
  }, []);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white" }}>
            Company Management
          </Typography>
          <Button color="inherit" onClick={() => {}}>
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
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.company_id}>
                  <TableCell>{company.company_id}</TableCell>
                  <TableCell>{company.name}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        size="small"
                        onClick={() => navigate("/adminMachine")}
                      >
                        View Machines
                      </Button>
                      <Button 
                        variant="contained" 
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(company)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </TableCell>
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
            {!currentCompany.id && (
              <TextField
                fullWidth
                margin="normal"
                label="Company ID"
                name="company_id"
                value={currentCompany.company_id}
                InputProps={{ readOnly: true }}
              />
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Company Name"
              name="name"
              value={currentCompany.name}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCancelDelete}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {companyToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminIndex;