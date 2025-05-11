// src/dashboard/Dashboard.tsx

import React, { useState } from 'react';
import {
  Box,
  Container,
  Tabs,
  Tab,
  Typography,
  Paper,
  CssBaseline,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
  Mail as MailIcon,
  GitHub as GitHubIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';

// Import components
import UserContext from './components/UserContext';
import RecipientContext from './components/RecipientContext';
import Settings from './components/Settings';
import Templates from './components/Templates';

// Create theme
const getTheme = (mode: 'light' | 'dark') => createTheme({
  palette: {
    mode,
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#8430ce',
    },
    background: {
      default: mode === 'light' ? '#f5f5f5' : '#121212',
      paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
    h4: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: mode === 'light' 
            ? '0 2px 10px rgba(0, 0, 0, 0.05)' 
            : '0 2px 10px rgba(0, 0, 0, 0.2)',
        },
      },
    },
  },
});

// Dashboard Component
const Dashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [version, setVersion] = useState<string>('0.1.0');
  
  // Set up theme
  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);
  
  // Get extension version from manifest
  React.useEffect(() => {
    try {
      const manifestData = chrome.runtime.getManifest();
      setVersion(manifestData.version);
    } catch (error) {
      console.error('Failed to get manifest data:', error);
    }
  }, []);
  
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };
  
  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const navigateToTab = (index: number) => {
    setCurrentTab(index);
    setDrawerOpen(false);
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {/* App Bar */}
        <AppBar position="static" color="primary" elevation={0}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Email Assistant Dashboard
            </Typography>
            <IconButton color="inherit" onClick={toggleTheme}>
              {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button 
              color="inherit" 
              startIcon={<GitHubIcon />}
              href="https://github.com/yourusername/email-assistant"
              target="_blank"
              sx={{ ml: 1 }}
            >
              GitHub
            </Button>
          </Toolbar>
        </AppBar>
        
        {/* Main Content */}
        <Box sx={{ 
          display: 'flex', 
          flex: 1,
          backgroundColor: theme.palette.background.default 
        }}>
          {/* Side Navigation (visible on larger screens) */}
          <Box
            component="nav"
            sx={{
              width: { sm: 240 },
              flexShrink: { sm: 0 },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Paper 
              sx={{ 
                height: '100%', 
                borderRadius: 0,
                boxShadow: 'none',
                borderRight: `1px solid ${theme.palette.divider}`
              }}
            >
              <List sx={{ p: 2 }}>
                <ListItem 
                  button 
                  selected={currentTab === 0} 
                  onClick={() => navigateToTab(0)}
                  sx={{ borderRadius: '8px', mb: 1 }}
                >
                  <ListItemIcon>
                    <PersonIcon color={currentTab === 0 ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Your Context" />
                </ListItem>
                
                <ListItem 
                  button 
                  selected={currentTab === 1} 
                  onClick={() => navigateToTab(1)}
                  sx={{ borderRadius: '8px', mb: 1 }}
                >
                  <ListItemIcon>
                    <PeopleIcon color={currentTab === 1 ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Recipients" />
                </ListItem>
                
                <ListItem 
                  button 
                  selected={currentTab === 2} 
                  onClick={() => navigateToTab(2)}
                  sx={{ borderRadius: '8px', mb: 1 }}
                >
                  <ListItemIcon>
                    <MailIcon color={currentTab === 2 ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Templates" />
                </ListItem>
                
                <Divider sx={{ my: 2 }} />
                
                <ListItem 
                  button 
                  selected={currentTab === 3} 
                  onClick={() => navigateToTab(3)}
                  sx={{ borderRadius: '8px' }}
                >
                  <ListItemIcon>
                    <SettingsIcon color={currentTab === 3 ? 'primary' : 'inherit'} />
                  </ListItemIcon>
                  <ListItemText primary="Settings" />
                </ListItem>
              </List>
              
              <Box sx={{ p: 2, mt: 'auto' }}>
                <Typography variant="body2" color="text.secondary">
                  Version: {version}
                </Typography>
              </Box>
            </Paper>
          </Box>
          
          {/* Mobile Drawer (for smaller screens) */}
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawer}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240 
              },
            }}
          >
            <List sx={{ p: 2 }}>
              <ListItem 
                button 
                selected={currentTab === 0} 
                onClick={() => navigateToTab(0)}
              >
                <ListItemIcon>
                  <PersonIcon color={currentTab === 0 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Your Context" />
              </ListItem>
              
              <ListItem 
                button 
                selected={currentTab === 1} 
                onClick={() => navigateToTab(1)}
              >
                <ListItemIcon>
                  <PeopleIcon color={currentTab === 1 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Recipients" />
              </ListItem>
              
              <ListItem 
                button 
                selected={currentTab === 2} 
                onClick={() => navigateToTab(2)}
              >
                <ListItemIcon>
                  <MailIcon color={currentTab === 2 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Templates" />
              </ListItem>
              
              <Divider sx={{ my: 2 }} />
              
              <ListItem 
                button 
                selected={currentTab === 3} 
                onClick={() => navigateToTab(3)}
              >
                <ListItemIcon>
                  <SettingsIcon color={currentTab === 3 ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </ListItem>
            </List>
            
            <Box sx={{ p: 2, mt: 'auto' }}>
              <Typography variant="body2" color="text.secondary">
                Version: {version}
              </Typography>
            </Box>
          </Drawer>
          
          {/* Main Content Container */}
          <Container 
            maxWidth="lg" 
            sx={{ 
              py: 4,
              px: { xs: 2, md: 4 },
              flex: 1,
              overflow: 'auto'
            }}
          >
            {/* Mobile Tabs (for smaller screens) */}
            <Box sx={{ display: { xs: 'block', sm: 'none' }, mb: 3 }}>
              <Tabs
                value={currentTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="dashboard navigation tabs"
              >
                <Tab label="Your Context" icon={<PersonIcon />} iconPosition="start" />
                <Tab label="Recipients" icon={<PeopleIcon />} iconPosition="start" />
                <Tab label="Templates" icon={<MailIcon />} iconPosition="start" />
                <Tab label="Settings" icon={<SettingsIcon />} iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Tab Content */}
            <Box role="tabpanel" hidden={currentTab !== 0}>
              {currentTab === 0 && <UserContext />}
            </Box>
            
            <Box role="tabpanel" hidden={currentTab !== 1}>
              {currentTab === 1 && <RecipientContext />}
            </Box>
            
            <Box role="tabpanel" hidden={currentTab !== 2}>
              {currentTab === 2 && <Templates />}
            </Box>
            
            <Box role="tabpanel" hidden={currentTab !== 3}>
              {currentTab === 3 && <Settings />}
            </Box>
          </Container>
        </Box>
        
        {/* Footer */}
        <Box 
          component="footer" 
          sx={{ 
            py: 2,
            px: 3,
            mt: 'auto',
            backgroundColor: theme.palette.background.paper,
            borderTop: `1px solid ${theme.palette.divider}`
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            Email Assistant © {new Date().getFullYear()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;