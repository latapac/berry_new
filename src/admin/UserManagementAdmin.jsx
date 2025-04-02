import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { IconPlus } from '@tabler/icons-react';
import { 
  Button, 
  List, 
  ListItemButton, 
  ListItemText, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box
} from '@mui/material';
import { Delete, LockReset } from '@mui/icons-material';
import MainCard from 'ui-component/cards/MainCard';
import { useLocation } from 'react-router';
import { getUsers, addUser, deleteUser, updateUserPass } from '../backservice';

export default function UserManagementAdmin() {
  const userData = useSelector((state) => state.authSlice?.userData || {});
  const {search} = useLocation()
  const queryParams = new URLSearchParams(search)
  const fetchedId = queryParams.get("c_id")
  let cid=fetchedId
  
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    refreshUsers();
  }, []);

  const refreshUsers = () => {
    getUsers(cid).then((data) => {
      setUsers(data);
    });
  };


  function handleModal() {
    setIsModalOpen(!isModalOpen)
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const formdata = new FormData(e.target);
    const username = formdata.get("username");
    const pass = formdata.get("password");
    const role = formdata.get("role");
    const name = formdata.get("name");

    const data = {
      createdAt: Date.now(),
      username,
      password: pass,
      company_id: cid,
      email: "xyz@gmail.com",
      status: true,
      role,
      name
    };

    addUser(data).then((data) => {
      if (data) {
        alert("User added successfully");
        setIsModalOpen(false);
        refreshUsers();
      } else {
        alert("Failed to add user");
      }
    });
  };

  const handleConfirmAction = async () => {
    if (actionType === 'delete') {
      const success = await deleteUser(selectedUser.username);
      if (success) {
        refreshUsers();
        alert('User deleted successfully');
      }
    } else if (actionType === 'password') {
      const success = await updateUserPass(selectedUser.username, newPassword);
      if (success) {
        alert('Password updated successfully');
      }
    }
    
    setSelectedUser(null);
    setActionType(null);
    setNewPassword('');
  };

  return (
    <MainCard title="User Management">
      <Button
        variant="contained"
        startIcon={<IconPlus />}
        onClick={() => setIsModalOpen(true)}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>

      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {users.map((user) => (
          <ListItemButton key={user.id} divider sx={{ py: 1 }}>
            <ListItemText
              primary={user.username}
              secondary={`Role: ${user.role}`}
              sx={{ flexGrow: 1 }}
            />
            <Box>
              <IconButton 
                onClick={() => {
                  setSelectedUser(user);
                  setActionType('password');
                }}
                color="primary"
                sx={{ mr: 1 }}
              >
                <LockReset />
              </IconButton>

              {(userData._id===user._id || user?.role?.toLowerCase()==="company admin")?(<></>):( <IconButton 
                onClick={() => {
                  setSelectedUser(user);
                  setActionType('delete');
                }}
                color="error"
              >
                <Delete />
              </IconButton>)}
             
            </Box>
          </ListItemButton>
        ))}
      </List>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className={`fixed inset-0 z-[9999]`}>
          <div className="absolute inset-0 bg-black opacity-45" onClick={() => setIsModalOpen(false)}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                <button
                  onClick={handleModal}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} method="dialog" className="p-6 space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    name='username'
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    name='name'
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    name='password'
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    name='role'
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiAjdjI0NjVlZCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwb2x5bGluZSBwb2ludHM9IjYgOSAxMiAxNSAxOCA5Ij48L3BvbHlsaW5lPjwvc3ZnPg==')] bg-no-repeat bg-[right_0.75rem_center]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Operator">Operator</option>
                    <option value="Manager">Manager</option>
                    <option value="company admin">Company Admin</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleModal}
                    className="px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              </form>
      
            </div>
          </div>
        </div>
      )}

      {/* Password Update Dialog */}
      <Dialog open={actionType === 'password'} onClose={() => setActionType(null)}>
        <DialogTitle>Update Password for {selectedUser?.username}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionType(null)}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="primary">
            Update Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={actionType === 'delete'} onClose={() => setActionType(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete user {selectedUser?.username}?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setActionType(null)}>Cancel</Button>
          <Button onClick={handleConfirmAction} color="error">
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
}