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
  useTheme,
  styled
} from '@mui/material';
import { Add, Business, ExitToApp } from '@mui/icons-material';
import { addCompany, getAllCompanies, toggleStatus } from '../backservice';
import { useNavigate } from 'react-router';

// Styled components for corporate look
const CorporatePaper = styled(Paper)(({ theme }) => ({
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  overflow: 'hidden'
}));

const CorporateTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.grey[50],
  '& th': {
    fontWeight: 600,
    color: theme.palette.grey[700]
  }
}));

const ActionButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 500,
  borderRadius: '6px',
  padding: '6px 12px',
  fontSize: '0.875rem'
}));

const AdminIndex = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [companyToDeactivate, setCompanyToDeactivate] = useState({});
  const [companyToDelete, setCompanyToDelete] = useState({});
  const [currentCompany, setCurrentCompany] = useState({
    id: null,
    company_id: '',
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // Handle logout (to be implemented)
  const handleLogout = () => {
    // Implement logout functionality
  };

  const handleOpenModal = (company = null) => {
    if (company) {
      setCurrentCompany(company);
    } else {
      setCurrentCompany({
        name: '',
        email: '',
        phone: '',
        address: ''
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSubmitCompany = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target)
    const name = formdata.get("name")
    const address = formdata.get("address")
    const unit = formdata.get("unit")
    addCompany({name,address,unit}).then((result) => {
      if (result) {
        alert("company added!")
        getAllCompanies().then((data) => {
          setCompanies(data.data);
        });
      } else {
        alert("company add failed!")
      }
    })
    handleCloseModal();
  };


  const handleCompanyStatus = (company) => {
      setCompanyToDeactivate(company);
      setStatusModal(true);
  };
  const handleDeleteCompany = (company) => {
    setCompanyToDelete(company);
    setDeleteModal(true);
  };


  const toggleCompanyStatus = (companyId) => {
   toggleStatus(companyId).then((data)=>{
    console.log(data);
    
    if (data) {
      alert("Company Status Changed !!")
      getAllCompanies().then((data) => {
        setCompanies(data.data);
      });
    }else{
      alert("Failed to load")
    }
   })
  };

  // Fetch companies on initial load
  useEffect(() => {
    getAllCompanies().then((data) => {
      setCompanies(data.data);
    });
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: theme.palette.grey[50]
    }}>
      <AppBar position="static" sx={{ background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', boxShadow: 'none' }}>
        <Toolbar>
          <Business sx={{ mr: 2, fontSize: '32px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: '0.5px', color: 'white', fontSize: '3vh' }}>
            PACMAC
          </Typography>
         
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 4, maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: theme.palette.grey[800], letterSpacing: '-0.5px' }}>
            Companies
          </Typography>
          <ActionButton variant="contained" color="primary" startIcon={<Add />} onClick={() => handleOpenModal()} sx={{ background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)' }}>
            New Company
          </ActionButton>
        </Box>

        <CorporatePaper>
          <TableContainer>
            <Table>
              <CorporateTableHead>
                <TableRow>
                  <TableCell>SR NO.</TableCell>
                  <TableCell>Company Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Unit</TableCell>
                  <TableCell sx={{ width: '180px' }}>Actions</TableCell>
                </TableRow>
              </CorporateTableHead>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow key={company.company_id}  className={company.status?"opacity-100":"opacity-70"} hover>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>{index + 1}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{company.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{company.address}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={500}>{company.unit}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <ActionButton variant="outlined" color="primary" size="small" onClick={() => navigate("/adminMachine?c_id=" + company.company_id)}>
                          View Machines
                        </ActionButton>
                        <ActionButton variant="outlined" color={!company.status ? 'success' : 'error'} size="small" onClick={() => handleCompanyStatus(company)}>
                          {company.status ? 'DEACTIVATE COMPANY' : 'ACTIVATE COMPANY'}
                        </ActionButton>
                        <ActionButton variant="outlined" color="secondary" size="small" onClick={() => navigate("/userManagementAdmin?c_id=" + company.company_id)}>
                          User Management
                        </ActionButton>
                        <ActionButton variant="outlined" color="secondary" size="small" onClick={() => handleDeleteCompany(company)}>
                          Delete Company
                        </ActionButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CorporatePaper>
      </Box>

      {/* Add/Edit Company Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: '12px', border: `1px solid ${theme.palette.divider}`
        }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            {currentCompany.id ? 'Edit Corporate Entity' : 'Register New Entity'}
            <Box sx={{ width: '40px', height: '4px', background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', mt: 1 }} />
          </Typography>
          <form onSubmit={handleSubmitCompany}>
            <TextField fullWidth margin="normal" label="Company Name" name="name" required sx={{ mb: 2 }} />
            <TextField fullWidth margin="normal" label="Address" name="address" required sx={{ mb: 2 }} />
            <TextField fullWidth margin="normal" label="Unit" name="unit" required sx={{ mb: 2 }} />
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <ActionButton onClick={handleCloseModal} sx={{ border: `1px solid ${theme.palette.divider}`, color: theme.palette.text.primary }}>
                Cancel
              </ActionButton>
              <ActionButton type="submit" variant="contained" color="primary" sx={{ background: 'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)' }}>
                {currentCompany.id ? 'Update' : 'Register'} Entity
              </ActionButton>
            </Box>
          </form>
        </Box>
      </Modal>

      {/* Deactivation Confirmation Dialog */}
      <Dialog open={statusModal} onClose={() => setStatusModal(false)} PaperProps={{ sx: { borderRadius: '12px', padding: '16px', minWidth: '500px' } }}>
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Deactivate Company?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to {companyToDeactivate.status?"deactivate":"activate"} <strong>{companyToDeactivate?.name}</strong>.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <ActionButton onClick={() => setStatusModal(false)}>Cancel</ActionButton>
          <ActionButton
            onClick={() => {
  
              toggleCompanyStatus(companyToDeactivate.company_id);
              setStatusModal(false);
            }}
            variant="contained"
            color={companyToDeactivate.status?"error":"success"}
            sx={{ background: companyToDeactivate.status?theme.palette.error.main:theme.palette.success.main }}
          >
            {companyToDeactivate.status?"Confirm Deactivation":"Confirm Activate"}
          </ActionButton>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */} 
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} PaperProps={{ sx: { borderRadius: '12px', padding: '16px', minWidth: '500px' } }}>
        <DialogTitle sx={{ fontWeight: 600, pb: 1 }}>Delete Company?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You are about to Delete <strong>{companyToDelete?.name}</strong><br />
            <strong>Please enter Company Name to confirm deletion.</strong><br /><br />
            <input  className='border-2 rounded-md border-gray-700 w-[30vw]'></input>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <ActionButton onClick={() => setDeleteModal(false)}>Cancel</ActionButton>
          <ActionButton
            onClick={() => {
              setDeleteModal(false);
              alert(`Company ${companyToDelete?.name} deleted  !!`);
            }}
            variant="contained"
            color="danger"
          >
            Delete
          </ActionButton>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default AdminIndex;
