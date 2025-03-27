import React, { useState } from 'react';
import { List, ListItemButton, ListItemText, ListItemIcon, Collapse, Typography } from '@mui/material';
import { IconUsers, IconChevronDown, IconChevronUp, IconPlus } from '@tabler/icons-react';

const UserManagementPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userListOpen, setUserListOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    password: '',
    role: 'Admin',
  });

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add the new user to the users list (you can replace this with an API call)
    const newUser = { ...formData, id: users.length + 1 }; // Assuming ID is auto-generated
    setUsers([...users, newUser]);

    // Close the modal and reset the form
    setFormData({ username: '', name: '', password: '', role: 'Admin' });
    handleModal();
  };

  return (
    <div>
      {/* User List */}
      <List disablePadding>
        <ListItemButton onClick={() => setUserListOpen(!userListOpen)} sx={{ px: 2, py: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 36 }}>
            <IconUsers stroke={1.5} size="20px" />
          </ListItemIcon>
          <ListItemText
            primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>User Management</Typography>}
          />
          {userListOpen ? <IconChevronUp size="20px" /> : <IconChevronDown size="20px" />}
        </ListItemButton>

        <Collapse in={userListOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 4 }}>
            {users.map((user) => (
              <ListItemButton key={user.id} sx={{ borderRadius: '8px', px: 2, py: 1 }}>
                <ListItemText
                  primary={user.username}
                  secondary={user.role}
                  primaryTypographyProps={{ variant: 'body2' }}
                  secondaryTypographyProps={{ variant: 'caption' }}
                />
              </ListItemButton>
            ))}
            <ListItemButton onClick={handleModal} sx={{ borderRadius: '8px', px: 2, py: 1.5 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <IconPlus stroke={1.5} size="20px" />
              </ListItemIcon>
              <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Add User</Typography>} />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999]">
          <div className="absolute inset-0 bg-black opacity-45" onClick={handleModal}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
                <button onClick={handleModal} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                  {/* Close Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    name='username'
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    name='name'
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    name='password'
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <select
                    name='role'
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-[url('data:image/svg+xml;base64,...')] bg-no-repeat bg-[right_0.75rem_center]"
                  >
                    <option value="Admin">Admin</option>
                    <option value="Operator">Operator</option>
                    <option value="Manager">Manager</option>
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
    </div>
  );
};

export default UserManagementPage;
