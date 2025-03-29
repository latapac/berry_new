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
import { getUsers, logoutService , addUser} from '../../../../backservice';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';
import { useDispatch, useSelector } from 'react-redux';
import User1 from 'assets/images/users/blue.webp';
import {  IconLogout, IconSettings, IconUsers  } from '@tabler/icons-react';
import { logout } from '../../../../store/authslice';
import { useNavigate } from 'react-router';

export default function ProfileSection() {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const [notification, setNotification] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModelOpen, setIsModalOpen] = useState(false)

  const userData = useSelector((state) => state.authSlice?.userData || {});
  const userName = userData?.username || 'User';
  const userDesignation = userData?.designation || userData?.role || 'Staff';
  const [userListOpen, setUserListOpen] = useState(false);
  const [users, setUsers] = useState([]);

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
      createdAt: Date.now(),
      username,
      password: pass,
      company_id: userData?.c_id,
      email: "xyz@gmail.com",
      status: true,
      role,
      name
    }

    addUser(data).then((data) => {
      if (data) {
        alert("user added succesfully")
        handleModal()
        getUsers(userData?.c_id).then((data) => {
          setUsers(data)
        })
      } else {
        alert("user add failed")
      }
    })


  }

  function handleModal() {
    setOpen(false);
    setIsModalOpen(!isModelOpen)
  }

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  useEffect(() => {
    // Fetch users from your API here
    getUsers(userData?.c_id).then((data) => {
      setUsers(data)
    })

  }, []);

  return (
    <>
    

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

                      {userData?.role.toLowerCase() == "admin" ? (<List disablePadding>
                        {/* User Management Dropdown */}
                        <ListItemButton
                          onClick={() =>{
                            setOpen(false)
                            navigate("/usermangement")}}
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
                                UserPage
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </List>) : (<></>)}

                      {/* Logout Option */}
                      <List disablePadding>
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