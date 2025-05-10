// src/dashboard/components/Settings.tsx

import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button,
  Grid, Divider, Switch, FormControlLabel,
  Select, MenuItem, InputLabel, FormControl,
  Alert, Card, CardContent, CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { SelectChangeEvent } from '@mui/material';
interface SettingsData {
  apiKey: string;
  apiProvider: string;
  model: string;
  maxTokens: number;
  temperature: number;
  autoGenerate: boolean;
  privacyMode: boolean;
  storeDrafts: boolean;
}

const defaultSettings: SettingsData = {
  apiKey: '',
  apiProvider: 'openai',
  model: 'gpt-4',
  maxTokens: 2000,
  temperature: 0.7,
  autoGenerate: false,
  privacyMode: true,
  storeDrafts: false
};

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<{
    show: boolean,
    message: string,
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  const [isKeyValid, setIsKeyValid] = useState<boolean | null>(null);
  const [isTestingKey, setIsTestingKey] = useState<boolean>(false);
  
  // Load settings data from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(['settings'], (result) => {
      if (result.settings) {
        setSettings(result.settings);
      }
    });
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | number | boolean = value;
    
    // Parse numerical values
    if (name === 'maxTokens' || name === 'temperature') {
      parsedValue = name === 'temperature' ? parseFloat(value) : parseInt(value, 10);
    }
    
    setSettings({
      ...settings,
      [name]: parsedValue
    });
    
    // Reset API key validation status when key changes
    if (name === 'apiKey' || name === 'apiProvider') {
      setIsKeyValid(null);
    }
  };
  
const handleSelectChange = (event: SelectChangeEvent) => {
  setSettings(prev => ({
    ...prev,
    [event.target.name]: event.target.value
  }));
};
  

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setSettings({
      ...settings,
      [name]: checked
    });
  };
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Validate API key if provided
    if (settings.apiKey && isKeyValid === null) {
      testApiKey().then((isValid) => {
        if (isValid) {
          saveSettings();
        } else {
          setIsSaving(false);
          setSaveStatus({
            show: true,
            message: 'Invalid API key. Please check and try again.',
            type: 'error'
          });
        }
      });
    } else {
      saveSettings();
    }
  };
  
  const saveSettings = () => {
    chrome.storage.sync.set({ settings }, () => {
      setIsSaving(false);
      setSaveStatus({
        show: true,
        message: 'Settings saved successfully!',
        type: 'success'
      });
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, show: false }));
      }, 3000);
    });
  };
  
  const testApiKey = async (): Promise<boolean> => {
    setIsTestingKey(true);
    
    // Simulate API key validation
    // In a real implementation, you would make an API call to validate the key
    return new Promise(resolve => {
      setTimeout(() => {
        const isValid = settings.apiKey.length > 10; // Simple validation for demo purposes
        setIsKeyValid(isValid);
        setIsTestingKey(false);
        resolve(isValid);
      }, 1500);
    });
  };
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Settings</Typography>
        <Button 
          startIcon={isSaving ? <CircularProgress size={20} /> : <SaveIcon />}
          variant="contained"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </Box>
      
      {saveStatus.show && (
        <Alert severity={saveStatus.type} sx={{ mb: 2 }}>
          {saveStatus.message}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* API Settings Section */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            AI Provider Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="api-provider-label">API Provider</InputLabel>
                <Select
                  labelId="api-provider-label"
                  name="apiProvider"
                  value={settings.apiProvider}
                  onChange={handleSelectChange}
                  label="API Provider"
                >
                  <MenuItem value="openai">OpenAI</MenuItem>
                  <MenuItem value="anthropic">Anthropic (Claude)</MenuItem>
                  <MenuItem value="google">Google (Gemini)</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal">
                <InputLabel id="model-label">Model</InputLabel>
                <Select
                  labelId="model-label"
                  name="model"
                  value={settings.model}
                  onChange={handleSelectChange}
                  label="Model"
                >
                  {settings.apiProvider === 'openai' && (
                    <>
                      <MenuItem value="gpt-4">GPT-4</MenuItem>
                      <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                      <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                    </>
                  )}
                  {settings.apiProvider === 'anthropic' && (
                    <>
                      <MenuItem value="claude-3-opus">Claude 3 Opus</MenuItem>
                      <MenuItem value="claude-3-sonnet">Claude 3 Sonnet</MenuItem>
                      <MenuItem value="claude-3-haiku">Claude 3 Haiku</MenuItem>
                    </>
                  )}
                  {settings.apiProvider === 'google' && (
                    <>
                      <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
                      <MenuItem value="gemini-ultra">Gemini Ultra</MenuItem>
                    </>
                  )}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="API Key"
                name="apiKey"
                type="password"
                value={settings.apiKey}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                required
                error={isKeyValid === false}
                helperText={isKeyValid === false ? "Invalid API key" : "Your API key will be stored locally and never shared"}
                InputProps={{
                  endAdornment: isTestingKey ? (
                    <CircularProgress size={20} />
                  ) : isKeyValid !== null ? (
                    <Box sx={{ 
                      width: 20, 
                      height: 20, 
                      borderRadius: '50%', 
                      bgcolor: isKeyValid ? 'success.main' : 'error.main' 
                    }} />
                  ) : null
                }}
              />
              
              <Box sx={{ display: 'flex', mt: 2 }}>
                <Button 
                  variant="outlined" 
                  onClick={testApiKey}
                  disabled={!settings.apiKey || isTestingKey}
                  sx={{ mr: 2 }}
                >
                  {isTestingKey ? 'Testing...' : 'Test API Key'}
                </Button>
                
                <Button 
                  variant="text" 
                  href={settings.apiProvider === 'openai' 
                    ? 'https://platform.openai.com/account/api-keys'
                    : settings.apiProvider === 'anthropic'
                    ? 'https://console.anthropic.com/account/keys'
                    : 'https://ai.google.dev/'
                  }
                  target="_blank"
                >
                  Get API Key
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        
        {/* Generation Settings Section */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Generation Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Maximum Tokens"
                name="maxTokens"
                type="number"
                value={settings.maxTokens}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 100, max: 4000 }}
                helperText="Maximum length of generated emails (higher = longer emails)"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                label="Temperature"
                name="temperature"
                type="number"
                value={settings.temperature}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                inputProps={{ min: 0, max: 1, step: 0.1 }}
                helperText="Controls creativity (higher = more creative, lower = more deterministic)"
              />
            </Grid>
          </Grid>
        </Grid>
        
        {/* Behavior Settings Section */}
        <Grid item xs={12} sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Behavior Settings
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoGenerate}
                        onChange={handleSwitchChange}
                        name="autoGenerate"
                      />
                    }
                    label="Auto-generate suggestions"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Automatically suggest email content when a recipient is detected
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacyMode}
                        onChange={handleSwitchChange}
                        name="privacyMode"
                      />
                    }
                    label="Privacy Mode"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Process all data locally when possible and minimize data sent to API
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Card variant="outlined">
                <CardContent>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.storeDrafts}
                        onChange={handleSwitchChange}
                        name="storeDrafts"
                      />
                    }
                    label="Store Generated Drafts"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Save generated emails to improve future suggestions
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Settings;