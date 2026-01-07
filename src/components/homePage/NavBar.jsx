


import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';

import AppBar from '@mui/material/AppBar';        
import Toolbar from '@mui/material/Toolbar';      
import IconButton from '@mui/material/IconButton'; 
import Stack from '@mui/material/Stack';          
import Avatar from '@mui/material/Avatar';        
import Drawer from '@mui/material/Drawer';        
import List from '@mui/material/List';            
import ListItem from '@mui/material/ListItem';    
import ListItemIcon from '@mui/material/ListItemIcon'; 
import ListItemText from '@mui/material/ListItemText'; 
import Divider from '@mui/material/Divider';      


import SportsIcon from '@mui/icons-material/Sports'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import LoginIcon from '@mui/icons-material/Login'
import HomeIcon from '@mui/icons-material/Home'
import EventIcon from '@mui/icons-material/Event'
import TableChartIcon from '@mui/icons-material/TableChart'
import GroupsIcon from '@mui/icons-material/Groups'
import BarChartIcon from '@mui/icons-material/BarChart'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import CloseIcon from '@mui/icons-material/Close'

import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth } from '../../config/firebaseConfig'
import { onAuthStateChanged, signOut } from 'firebase/auth'

// Navigation items configuration
const navItems = [
  { id: 1, label: 'Home', path: '/', icon: <HomeIcon /> },
  { id: 2, label: 'Fixtures', path: '/DFA/Fixtures', icon: <EventIcon /> },
  { id: 3, label: 'Tables', path: '/DFA/Table', icon: <TableChartIcon /> },
  { id: 4, label: 'Clubs', path: '/DFA/Teams', icon: <GroupsIcon /> },
  { id: 5, label: 'Stats', path: '/DFA/Stats', icon: <BarChartIcon /> },
  { 
    id: 6, 
    label: 'Predict', 
    path: '/PredictionGame', 
    external: false,
    icon: <SportsIcon />
  },
  { 
    id: 7, 
    label: 'Admin', 
    path: '/Admin/Matches', 
    external: true,
    icon: <SportsIcon />
  },
]

const NavBar = () => {
  const location = useLocation()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [userSignedIn, setUserSignedIn] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Handle drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return
    }
    setDrawerOpen(open)
  }

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isScrolledDown = prevScrollPos < currentScrollPos

      setVisible(!isScrolledDown || currentScrollPos < 10)
      setPrevScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [prevScrollPos])

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUserSignedIn(!!user)
      if (user) {
        setUserProfile({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
        // Check if user is admin - force refresh to get latest claims
        try {
          const idTokenResult = await user.getIdTokenResult(true)
          console.log('[NavBar] ID Token Claims:', idTokenResult.claims)
          setIsAdmin(idTokenResult.claims.admin === true)
        } catch (error) {
          console.error('Error checking admin status:', error)
          setIsAdmin(false)
        }
      } else {
        setUserProfile(null)
        setIsAdmin(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth)
      setDrawerOpen(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check if link is active
  const isActiveLink = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  // Drawer content
  const drawerContent = () => (
    <Box
      sx={{ 
        width: 280,
        backgroundColor: '#222629',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      {/* Drawer header */}
      <Box
        sx={{
          p: 3,
          backgroundColor: 'rgba(255, 107, 0, 0.1)',
          borderBottom: '1px solid #FF6B00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 40, height: 40, mr: 2 }}>
            <img 
              src="https://res.cloudinary.com/djrkottjd/image/upload/v1711418501/Dominica_national_football_team_600e878744.png" 
              alt="Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </Box>
          <Typography
            sx={{
              color: '#FFD700',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}
          >
            DOMINICA FOOTBALL
          </Typography>
        </Box>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: '#FFD700' }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation items */}
      <List sx={{ flexGrow: 1, p: 0 }}>
        {navItems.map((item) => {
          // Skip Admin link if user is not admin
          if (item.label === 'Admin' && !isAdmin) {
            return null
          }

          if (item.external) {
            return (
              <ListItem
                key={item.id}
                component="a"
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: 'white',
                  py: 2,
                  px: 3,
                  borderLeft: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 107, 0, 0.1)'
                  }
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.label}
                  sx={{ '& .MuiListItemText-primary': { fontWeight: 400 } }}
                />
              </ListItem>
            )
          }

          return (
            <ListItem
              key={item.id}
              component={Link}
              to={item.path}
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: isActiveLink(item.path) ? '#FFD700' : 'white',
                backgroundColor: isActiveLink(item.path) ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                borderLeft: isActiveLink(item.path) ? '3px solid #FF6B00' : 'none',
                py: 2,
                px: 3,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 0, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ 
                color: isActiveLink(item.path) ? '#FFD700' : 'white',
                minWidth: 40 
              }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                sx={{ 
                  '& .MuiListItemText-primary': { 
                    fontWeight: isActiveLink(item.path) ? 600 : 400 
                  } 
                }}
              />
            </ListItem>
          )
        })}
      </List>

      {/* Auth section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        {userSignedIn ? (
          <>
            <ListItem
              component={Link}
              to="/Profile"
              onClick={() => setDrawerOpen(false)}
              sx={{
                color: '#FFD700',
                py: 1.5,
                px: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 0, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#FFD700', minWidth: 40 }}>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="PROFILE" />
            </ListItem>
            <ListItem
              onClick={() => {
                handleLogout()
                setDrawerOpen(false)
              }}
              sx={{
                color: '#FF6B6B',
                py: 1.5,
                px: 2,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 0, 0.1)'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#FF6B6B', minWidth: 40 }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="LOGOUT" />
            </ListItem>
          </>
        ) : (
          <ListItem
            component={Link}
            to="/Login"
            onClick={() => setDrawerOpen(false)}
            sx={{
              color: '#FFD700',
              py: 1.5,
              px: 2,
              borderRadius: 1,
              '&:hover': {
                backgroundColor: 'rgba(255, 107, 0, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ color: '#FFD700', minWidth: 40 }}>
              <LoginIcon />
            </ListItemIcon>
            <ListItemText primary="LOGIN" />
          </ListItem>
        )}
      </Box>
    </Box>
  )

  return (
    <Box>
      <AppBar 
        elevation={4} 
        sx={{
          backgroundColor: 'rgba(34, 38, 41, 0.95)',
          backdropFilter: 'blur(10px)',
          position: 'fixed',
          top: 0,
          width: '100%',
          display: visible ? 'block' : 'none',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
          transform: visible ? 'translateY(0)' : 'translateY(-100%)',
          borderBottom: '2px solid',
          borderImage: 'linear-gradient(90deg, #FFD700 0%, #FF6B00 50%, #FFD700 100%) 1',
          zIndex: 1200
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            disableGutters
            sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              py: 1
            }}
          >
            {/* Logo */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)'
                }
              }}
            >
              <Box sx={{ width: 50, height: 50, mr: 1 }}>
                <img 
                  src="https://res.cloudinary.com/djrkottjd/image/upload/v1711418501/Dominica_national_football_team_600e878744.png" 
                  alt="Dominica Football League Logo"
                  style={{ 
                    width: '100%', 
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: { xs: 'none', md: 'block' }
                }}
              >
                DOMINICA FOOTBALL ASSOCIATION
              </Typography>
            </Box>

            {/* Desktop Navigation */}
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center'
              }}
            >
              {navItems.map((item) => {
                // Skip Admin link if user is not admin
                if (item.label === 'Admin' && !isAdmin) {
                  return null
                }

                if (item.external) {
                  return (
                    <Button
                      key={item.id}
                      component="a"
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      startIcon={item.icon}
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '20px',
                        px: 2,
                        py: 1,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 107, 0, 0.1)',
                          color: '#FFD700',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      {item.label}
                    </Button>
                  )
                }

                return (
                  <Button
                    key={item.id}
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      color: isActiveLink(item.path) ? '#FFD700' : 'white',
                      fontWeight: 600,
                      borderRadius: '20px',
                      px: 2,
                      py: 1,
                      backgroundColor: isActiveLink(item.path) ? 'rgba(255, 107, 0, 0.15)' : 'transparent',
                      border: isActiveLink(item.path) ? '1px solid #FF6B00' : '1px solid transparent',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 0, 0.1)',
                        color: '#FFD700',
                        border: '1px solid #FF6B00',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                )
              })}
            </Stack>

            {/* User/Auth Section */}
            <Stack direction="row" spacing={1} alignItems="center">
              {userSignedIn ? (
                <>
                  <IconButton
                    component={Link}
                    to="/Profile"
                    sx={{
                      color: '#FFD700',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)'
                      }
                    }}
                  >
                    {userProfile?.photoURL ? (
                      <Avatar
                        src={userProfile.photoURL}
                        alt={userProfile.displayName || 'User'}
                        sx={{ 
                          width: 40, 
                          height: 40,
                          border: '2px solid #FF6B00'
                        }}
                      />
                    ) : (
                      <AccountCircleIcon sx={{ fontSize: 32 }} />
                    )}
                  </IconButton>
                </>
              ) : (
                <Button
                  component={Link}
                  to="/Login"
                  variant="outlined"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: '#FFD700',
                    borderColor: '#FFD700',
                    borderRadius: '20px',
                    px: 3,
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.1)',
                      borderColor: '#FFED4E',
                      color: '#FFED4E',
                      transform: 'translateY(-2px)'
                    },
                    display: { xs: 'none', sm: 'flex' }
                  }}
                >
                  LOGIN
                </Button>
              )}

              {/* Mobile Menu Button */}
              <IconButton
                onClick={toggleDrawer(true)}
                sx={{
                  color: '#86C232',
                  display: { md: 'none' },
                  '&:hover': {
                    backgroundColor: 'rgba(134, 194, 50, 0.1)'
                  }
                }}
              >
                <MenuIcon fontSize="medium" />
              </IconButton>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer for mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            backgroundColor: 'transparent',
            border: 'none',
            boxShadow: 'none'
          }
        }}
        ModalProps={{
          BackdropProps: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }
          }
        }}
      >
        {drawerContent()}
      </Drawer>

      {/* Spacer for fixed AppBar */}
      <Box sx={{ height: { xs: 70, md: 80 } }} />
    </Box>
  )
}

export default NavBar