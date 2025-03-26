import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Switch,
  Typography,
  Box
} from '@mui/material';
import addUser, { logoutService } from '../../../../backservice';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'react-redux';
import User1 from 'assets/images/users/blue.webp';
import { IconPlus, IconLogout, IconSettings } from '@tabler/icons-react';
import { logout } from '../../../../store/authslice';
import { useNavigate } from 'react-router';

export default function ProfileSection() {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const [notification, setNotification] = useState(false);
  const [selectedIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModelOpen, setIsModalOpen] = useState(false)

  // Get user data from Redux store - updated to handle potential undefined states
  const userData = useSelector((state) => state.authSlice?.userData || {});
  const userName = userData?.username || 'User';
  const userDesignation = userData?.designation || userData?.role || 'Staff';

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  function handleLogout() {
    logoutService();
    dispatch(logout());
    navigate("/pages/login");
  }


  function handleSubmit(e) {
    e.preventDefault()
    const formdata = new FormData(e.target)
    const username = formdata.get("username")
    const pass = formdata.get("password")
    const role = formdata.get("role")
    const name = formdata.get("name")
    if (!username || !pass || !role) {
      alert("add all field")
      return
    }

      const data = { 
        createdAt:Date.now(),
        username,
        password:pass,
        company_id: userData?.c_id,
        email:"xyz@gmail.com",
        status: true,
        role: "dev",
        name
      }

      addUser(data).then((data)=>{
        if (data) {
          alert("user added succesfully")
          handleModal()
        }else{
          alert("user add failed")
        }
      })
    
    
  }

  function handleModal() {
    setIsModalOpen(!isModelOpen)
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      {isModelOpen && (

        <dialog
          open
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-30 ml-[50vw] mt-12"
        >
          <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
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

            {/* Form */}
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
                </select>
              </div>

              {/* Footer with Submit Button */}
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
        </dialog>
      )}

      <Chip
        sx={{
          ml: 2,
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.05)'
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={User1}
            alt="user-profile"
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: theme.palette.primary.main
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" color={theme.palette.primary.main} />}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
        sx={{
          zIndex: theme.zIndex.modal + 1
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper elevation={8}>
                {open && (
                  <MainCard
                    border={false}
                    elevation={16}
                    content={false}
                    boxShadow
                    shadow={theme.shadows[16]}
                    sx={{
                      minWidth: '300px',
                      maxWidth: '350px',
                      background: theme.palette.background.paper,
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: `${borderRadius}px`,
                      overflow: 'hidden'
                    }}
                  >
                    {/* User Profile Header */}
                    <Box sx={{
                      p: 2,
                      pb: 1.5,
                      background: theme.palette.primary.light,
                      color: theme.palette.primary.contrastText
                    }}>
                      <Stack spacing={0.5}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar
                            src={User1}
                            alt={userName}
                            sx={{
                              width: 48,
                              height: 48,
                              border: `2px solid ${theme.palette.background.paper}`
                            }}
                          />
                          <Stack>
                            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                              {userName}
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                              {userDesignation}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Stack>
                    </Box>

                    <Divider />

                    {/* Profile Menu Content */}
                    <Box
                      sx={{
                        p: 2,
                        py: 1,
                        height: '100%',
                        maxHeight: 'calc(100vh - 250px)',
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: 5,
                          background: 'transparent'
                        },
                        '&::-webkit-scrollbar-thumb': {
                          background: theme.palette.divider,
                          borderRadius: 3
                        }
                      }}
                    >
                      {/* Notification Settings */}
                      <Card
                        sx={{
                          bgcolor: 'background.default',
                          my: 1.5,
                          boxShadow: 'none',
                          border: `1px solid ${theme.palette.divider}`
                        }}
                      >
                        <CardContent sx={{ py: 1.5 }}>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item>
                              <Typography variant="subtitle1">Notifications</Typography>
                              <Typography variant="body2" color="textSecondary">
                                Manage your alerts
                              </Typography>
                            </Grid>
                            <Grid item>
                              <Switch
                                checked={notification}
                                onChange={(e) => setNotification(e.target.checked)}
                                color="primary"
                                size="medium"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      <Divider sx={{ my: 1 }} />

                      {/* Logout Option */}
                      <List disablePadding>
                        <ListItemButton
                          onClick={handleModal}
                          sx={{
                            borderRadius: `${borderRadius}px`,
                            px: 2,
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: theme.palette.error.light,
                              '& .MuiListItemIcon-root': {
                                color: theme.palette.error.main
                              }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <IconPlus stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Add User
                              </Typography>
                            }
                          />
                        </ListItemButton>
                        <ListItemButton
                          onClick={handleLogout}
                          sx={{
                            borderRadius: `${borderRadius}px`,
                            px: 2,
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: theme.palette.error.light,
                              '& .MuiListItemIcon-root': {
                                color: theme.palette.error.main
                              }
                            }
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <IconLogout stroke={1.5} size="20px" />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                                Logout
                              </Typography>
                            }
                          />
                        </ListItemButton>

                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}