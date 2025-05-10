import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Paper, TextField, Button,
  Grid, Divider, Chip, Alert
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';

interface UserContextData {
  name: string;
  email: string;
  role: string;
  company: string;
  background: string;
  communicationStyle: string;
  commonSignatures: string[];
  tonePreference: string;
}

const defaultUserContext: UserContextData = {
  name: '',
  email: '',
  role: '',
  company: '',
  background: '',
  communicationStyle: '',
  commonSignatures: [],
  tonePreference: 'professional'
};

const UserContext: React.FC = () => {
  const [userData, setUserData] = useState<UserContextData>(defaultUserContext);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [newSignature, setNewSignature] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<{
    show: boolean,
    message: string,
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Load user context data from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(['userContext'], (result) => {
      if (result.userContext) {
        setUserData(result.userContext);
        setIsEditing(false);
      }
    });
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    chrome.storage.sync.set({ userContext: userData }, () => {
      setIsEditing(false);
      setSaveStatus({
        show: true,
        message: 'Your context has been saved!',
        type: 'success'
      });
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, show: false }));
      }, 3000);
    });
  };
  
  const addSignature = () => {
    if (newSignature.trim() !== '') {
      setUserData({
        ...userData,
        commonSignatures: [...userData.commonSignatures, newSignature.trim()]
      });
      setNewSignature('');
    }
  };
  
  const removeSignature = (index: number) => {
    const updatedSignatures = [...userData.commonSignatures];
    updatedSignatures.splice(index, 1);
    setUserData({
      ...userData,
      commonSignatures: updatedSignatures
    });
  };
  
  return (
    <Paper sx={{ p: 3, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Your Context</Typography>
        <Button 
          startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
          variant={isEditing ? "contained" : "outlined"}
          onClick={isEditing ? handleSave : () => setIsEditing(true)}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
      </Box>
      
      {saveStatus.show && (
        <Alert severity={saveStatus.type} sx={{ mb: 2 }}>
          {saveStatus.message}
        </Alert>
      )}
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Your Name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Email Address"
            name="email"
            type="email"
            value={userData.email}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Role/Title"
            name="role"
            value={userData.role}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
          <TextField
            label="Company/Organization"
            name="company"
            value={userData.company}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Professional Background"
            name="background"
            value={userData.background}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            disabled={!isEditing}
            placeholder="Brief description of your professional background, expertise, and responsibilities"
          />
          <TextField
            label="Communication Style"
            name="communicationStyle"
            value={userData.communicationStyle}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
            placeholder="Direct, collaborative, detailed, concise, etc."
          />
          <TextField
            label="Preferred Tone"
            name="tonePreference"
            value={userData.tonePreference}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={!isEditing}
            placeholder="Professional, friendly, formal, casual, etc."
          />
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="h6" sx={{ mb: 2 }}>Common Sign-offs</Typography>
          
          {isEditing && (
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                label="Add a signature"
                value={newSignature}
                onChange={(e) => setNewSignature(e.target.value)}
                fullWidth
                margin="normal"
                placeholder="Best regards, [Your Name]"
              />
              <Button 
                variant="contained" 
                sx={{ ml: 2, alignSelf: 'center' }}
                onClick={addSignature}
              >
                Add
              </Button>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {userData.commonSignatures.map((sig, index) => (
              <Chip
                key={index}
                label={sig}
                onDelete={isEditing ? () => removeSignature(index) : undefined}
                color="primary"
                variant="outlined"
              />
            ))}
            {userData.commonSignatures.length === 0 && (
              <Typography variant="body2" color="text.secondary">
                No common sign-offs added yet.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default UserContext;