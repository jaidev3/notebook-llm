import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Box,
  Divider,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Description as DocumentIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../context/DocumentContext';

const drawerWidth = 280;

const Layout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user, logout } = useAuth();
  const { documents, queries } = useDocuments();
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Documents', icon: <DocumentIcon />, path: '/documents' },
    { text: 'Query', icon: <SearchIcon />, path: '/query' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
  ];

  const drawer = (
    <Box className="h-full bg-white">
      <Box className="p-4">
        <Typography variant="h6" className="font-bold text-primary-600 mb-4">
          NotebookLLM
        </Typography>
        <Box className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-3 mb-4">
          <Typography variant="body2" className="text-gray-600 mb-1">
            Documents
          </Typography>
          <Typography variant="h4" className="font-bold text-primary-600">
            {documents.length}
          </Typography>
        </Box>
        <Box className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-lg p-3">
          <Typography variant="body2" className="text-gray-600 mb-1">
            Queries
          </Typography>
          <Typography variant="h4" className="font-bold text-secondary-600">
            {queries.length}
          </Typography>
        </Box>
      </Box>
      
      <Divider />
      
      <List className="flex-1 px-2">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="mb-1">
            <ListItemButton
              onClick={() => navigate(item.path)}
              className={`rounded-lg transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600'
                  : 'hover:bg-gray-50'
              }`}
            >
              <ListItemIcon className={location.pathname === item.path ? 'text-primary-600' : ''}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      
      <Divider />
      
      <Box className="p-4">
        <Typography variant="caption" className="text-gray-500 mb-2 block">
          Recent Activity
        </Typography>
        <Box className="space-y-2">
          <Box className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Box className="w-2 h-2 bg-green-500 rounded-full"></Box>
            <Typography variant="body2" className="text-sm">
              Processing document...
            </Typography>
          </Box>
          <Box className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <Box className="w-2 h-2 bg-blue-500 rounded-full"></Box>
            <Typography variant="body2" className="text-sm">
              Query completed
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box className="flex h-screen bg-gray-50">
      {/* App Bar */}
      <AppBar
        position="fixed"
        className="bg-white shadow-sm border-b"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="justify-between">
          <Box className="flex items-center">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
              className="text-gray-600"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" className="text-gray-800">
              {menuItems.find(item => item.path === location.pathname)?.text || 'NotebookLLM'}
            </Typography>
          </Box>
          
          <Box className="flex items-center space-x-2">
            <Tooltip title="Notifications">
              <IconButton className="text-gray-600">
                <Badge badgeContent={3} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Profile">
              <IconButton onClick={handleMenuOpen} className="p-1">
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-8 h-8"
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
            </Tooltip>
            
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
        className="bg-gray-50 min-h-screen"
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout; 