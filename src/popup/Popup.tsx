import React, { useEffect, useState } from 'react';
// import './Popup.css';
import { Box, Button, Typography, Paper, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

const Popup: React.FC = () => {
  const [version, setVersion] = useState<string>('');
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false);
  
  useEffect(() => {
    // Get the current version from the manifest
    const manifestData = chrome.runtime.getManifest();
    setVersion(manifestData.version);
    
    // Check if there's an update available
    chrome.storage.local.get(['updateAvailable', 'newVersion'], (result) => {
      if (result.updateAvailable) {
        setUpdateAvailable(true);
      }
    });
  }, []);
  
  const openDashboard = () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL('/src/dashboard/index.html')
    });
  };
  
  const updateExtension = () => {
    chrome.runtime.reload();
  };
  
  return (
    <Paper elevation={0} className="popup-container">
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Email Assistant
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Your agentic email companion
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<DashboardIcon />}
          onClick={openDashboard}
          sx={{ mb: 2 }}
        >
          Open Dashboard
        </Button>
        
        {updateAvailable && (
          <Button 
            variant="outlined" 
            color="secondary" 
            fullWidth
            onClick={updateExtension}
            sx={{ mb: 2 }}
          >
            Update Available!
          </Button>
        )}
        
        <Typography variant="caption" color="text.secondary">
          Version: {version}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Popup;