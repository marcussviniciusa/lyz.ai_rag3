import React, { useState } from 'react';
import { Outlet, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer,
  IconButton, 
  List, 
  ListItem, 
  ListItemButton,
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

// Material UI Icons
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import BusinessIcon from '@mui/icons-material/Business';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// Drawer width
const drawerWidth = 260;

/**
 * Layout principal da aplicau00e7u00e3o com barra lateral de navegau00e7u00e3o 
 * e barra superior com menu de usuu00e1rio
 */
const Layout = () => {
  const theme = useTheme();
  const location = useLocation();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorElUser, setAnchorElUser] = useState(null);

  // Toggle drawer em dispositivos mu00f3veis
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Abrir menu do usuu00e1rio
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  // Fechar menu do usuu00e1rio
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // Realizar logout
  const handleLogout = () => {
    handleCloseUserMenu();
    logout();
  };

  // Verificar se u00e9 superadmin
  const isSuperAdmin = user?.role === 'superadmin';

  // Itens de menu para usuu00e1rios regulares
  const userMenuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Meus Planos', icon: <DocumentScannerIcon />, path: '/plans' },
    { text: 'Novo Plano', icon: <AddCircleOutlineIcon />, path: '/plans/new' },
  ];

  // Itens de menu adicionais para superadmin
  const adminMenuItems = [
    { text: 'Empresas', icon: <BusinessIcon />, path: '/companies' },
    { text: 'Usuu00e1rios', icon: <SupervisedUserCircleIcon />, path: '/users' },
    { text: 'Configurau00e7u00f5es', icon: <SettingsIcon />, path: '/settings' },
  ];

  // Conteúdo da barra lateral
  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        py: 2,
      }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700, 
            color: 'primary.main',
            letterSpacing: '1px',
          }}
        >
          Lyz
        </Typography>
      </Toolbar>
      
      <Divider />
      
      <List sx={{ flex: 1, px: 2, py: 1 }}>
        {userMenuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                onClick={() => isMobile && handleDrawerToggle()}
                sx={{
                  borderRadius: 2,
                  backgroundColor: isActive ? 'primary.light' : 'transparent',
                  color: isActive ? 'primary.dark' : 'text.primary',
                  '&:hover': {
                    backgroundColor: isActive ? 'primary.light' : 'action.hover',
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isActive ? 'primary.dark' : 'text.secondary',
                    minWidth: 40
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronRightIcon fontSize="small" />
                  </motion.div>
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      {isSuperAdmin && (
        <>
          <Divider sx={{ mx: 2 }} />
          
          <List sx={{ px: 2, py: 1 }}>
            <ListItem sx={{ pb: 1 }}>
              <Typography variant="overline" color="text.secondary" fontWeight="500">
                Administrau00e7u00e3o
              </Typography>
            </ListItem>
            
            {adminMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              
              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    component={RouterLink}
                    to={item.path}
                    onClick={() => isMobile && handleDrawerToggle()}
                    sx={{
                      borderRadius: 2,
                      backgroundColor: isActive ? 'primary.light' : 'transparent',
                      color: isActive ? 'primary.dark' : 'text.primary',
                      '&:hover': {
                        backgroundColor: isActive ? 'primary.light' : 'action.hover',
                      }
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive ? 'primary.dark' : 'text.secondary',
                        minWidth: 40
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                    {isActive && <ChevronRightIcon fontSize="small" />}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* App Bar */}
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ flexGrow: 1 }} />
          
          {/* Menu de usuário */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Tooltip title="Configurau00e7u00f5es de conta">
                <IconButton onClick={handleOpenUserMenu}>
                  <Avatar 
                    alt={user?.name} 
                    src="/static/images/avatar/1.jpg"
                    sx={{ 
                      bgcolor: 'primary.main',
                      width: 40,
                      height: 40
                    }}
                  >
                    {user?.name?.charAt(0) || 'U'}
                  </Avatar>
                </IconButton>
              </Tooltip>
            </motion.div>
            
            <Box sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
              <Typography variant="subtitle1" fontWeight="500">
                {user?.name || 'Usuu00e1rio'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {isSuperAdmin ? 'Administrador' : 'Usuu00e1rio'}
              </Typography>
            </Box>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              sx={{ mt: 1.5 }}
              PaperProps={{
                sx: { 
                  borderRadius: 2,
                  boxShadow: theme.shadows[4],
                  minWidth: 180
                }
              }}
            >
              <MenuItem component={RouterLink} to="/profile" onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Meu Perfil</ListItemText>
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sair</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Barra lateral para dispositivos móveis */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Barra lateral permanente para desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
              background: '#FFFFFF'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      
      {/* Container principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          backgroundImage: 'radial-gradient(circle at 90% 90%, rgba(216, 180, 254, 0.1) 0%, rgba(129, 140, 248, 0.1) 100%)',
        }}
      >
        <Toolbar /> {/* Espaçador para compensar o AppBar */}
        
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            style={{ height: '100%' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default Layout;
