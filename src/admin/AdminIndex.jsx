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
  styled,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Add, 
  Visibility, 
  PowerSettingsNew, 
  People, 
  Delete,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { addCompany, deleteCompany, getAllCompanies, toggleStatus } from '../backservice';
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
  const [companyNameDelete,setCompanyNameDelete] = useState("")
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

  function deleteCompanyHandle(id) {
    setDeleteModal(false)
    deleteCompany(id).then((res)=>{
      if (res) {
        alert("company deleted")
        getAllCompanies().then((data) => {
          setCompanies(data.data);
        });
      }else{
        alert("failed")
      }
    })
  }

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
  <Table sx={{ 
    '& .MuiTableCell-root': {
      padding: '8px 4px', // Reduced padding
      borderBottom: 'none' // Optional: remove border if desired
    }
  }}>
    <CorporateTableHead>
      <TableRow sx={{ display: 'flex', width: '100%' }}>
        <TableCell sx={{ width: '80px', textAlign: 'center' }}>SR NO.</TableCell>
        <TableCell sx={{ flex: 2, minWidth: '200px' }}>Company Name</TableCell>
        <TableCell sx={{ flex: 3, minWidth: '300px' }}>Address</TableCell>
        <TableCell sx={{ flex: 1, minWidth: '100px' }}>Unit</TableCell>
        <TableCell sx={{ width: '180px', textAlign: 'center' }}>Actions</TableCell>
      </TableRow>
    </CorporateTableHead>
    <TableBody>
      {companies.map((company, index) => (
        <TableRow 
          key={company.company_id}  
          className={`${company.status?"opacity-100":"opacity-70"}`} 
          sx={{
            display: "flex",
            width: "100%",
            alignItems: 'center' // This ensures vertical alignment
          }}
          hover
        >
          <TableCell sx={{ width: '80px', textAlign: 'center' }}>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {index + 1}
            </Typography>
          </TableCell>
          <TableCell sx={{ flex: 2, minWidth: '200px' }}>
            <Typography fontWeight={500} noWrap>
              {company.name}
            </Typography>
          </TableCell>
          <TableCell sx={{ flex: 3, minWidth: '300px' }}>
            <Typography fontWeight={500} noWrap>
              {company.address}
            </Typography>
          </TableCell>
          <TableCell sx={{ flex: 1, minWidth: '100px' }}>
            <Typography fontWeight={500}>
              {company.unit}
            </Typography>
          </TableCell>
          <TableCell sx={{ width: '180px' }}>
            <Box sx={{ 
              display: 'flex', 
              gap: 1,
              justifyContent: 'center'
            }}>
              <Tooltip title="View Machines">
                <IconButton 
                  size="small"
                  color="primary" 
                  onClick={() => navigate("/adminMachine?c_id=" + company.company_id)}
                  sx={{ '&:hover': { backgroundColor: theme.palette.primary.light } }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={company.status ? 'Deactivate Company' : 'Activate Company'}>
                <IconButton 
                  size="small"
                  color={company.status ? 'error' : 'success'} 
                  onClick={() => handleCompanyStatus(company)}
                  sx={{ '&:hover': { 
                    backgroundColor: company.status ? theme.palette.error.light : theme.palette.success.light 
                  }}}
                >
                  {company.status ? <PowerSettingsNew fontSize="small" /> : <CheckCircle fontSize="small" />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="User Management">
                <IconButton 
                  size="small"
                  color="secondary" 
                  onClick={() => navigate("/userManagementAdmin?c_id=" + company.company_id)}
                  sx={{ '&:hover': { backgroundColor: theme.palette.secondary.light } }}
                >
                  <People fontSize="small" />
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Delete Company">
                <IconButton 
                  size="small"
                  color="inherit" 
                  onClick={() => handleDeleteCompany(company)}
                  sx={{ '&:hover': { backgroundColor: theme.palette.grey[300] } }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
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
            <input value={companyNameDelete} onChange={(e)=>setCompanyNameDelete(e.target.value)} className='border-2 rounded-md border-gray-700 w-[30vw]'></input>
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <ActionButton onClick={() => setDeleteModal(false)}>Cancel</ActionButton>
          <ActionButton
            onClick={()=>deleteCompanyHandle(companyToDelete.company_id)}
            variant="contained"
            color="danger"
            disabled={companyToDelete.name!==companyNameDelete}
          >
            Delete
          </ActionButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminIndex;