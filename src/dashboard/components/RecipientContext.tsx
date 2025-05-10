// src/dashboard/components/RecipientContext.tsx

import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, TextField, Button,
  Grid, Divider, List, ListItem, ListItemText,
  ListItemAvatar, Avatar, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem,
  type SelectChangeEvent, Chip, Fab, Tooltip,
  Alert
} from '@mui/material';
import {
  Person as PersonIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

interface RecipientData {
  id: string;
  name: string;
  email: string;
  role?: string;
  company?: string;
  relationship?: string;
  notes?: string;
  preferredCommunication?: string;
  topics?: string[];
}

const emptyRecipient: RecipientData = {
  id: '',
  name: '',
  email: '',
  role: '',
  company: '',
  relationship: '',
  notes: '',
  preferredCommunication: 'professional',
  topics: []
};

const RecipientContext: React.FC = () => {
  const [recipients, setRecipients] = useState<RecipientData[]>([]);
  const [currentRecipient, setCurrentRecipient] = useState<RecipientData>(emptyRecipient);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newTopic, setNewTopic] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<{
    show: boolean,
    message: string,
    type: 'success' | 'error'
  }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Load recipients data from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(['recipientContext'], (result) => {
      if (result.recipientContext) {
        setRecipients(result.recipientContext);
      }
    });
  }, []);
  
  const handleDialogOpen = (isNew: boolean = false) => {
    if (isNew) {
      const newId = `recipient_${Date.now()}`;
      setCurrentRecipient({ ...emptyRecipient, id: newId });
    }
    setIsEditing(isNew);
    setDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setDialogOpen(false);
    setIsEditing(false);
  };
  
  const handleRecipientSelect = (recipient: RecipientData) => {
    setCurrentRecipient(recipient);
    handleDialogOpen();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentRecipient({
      ...currentRecipient,
      [name]: value
    });
  };
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentRecipient({
      ...currentRecipient,
      [name]: value
    });
  };
  
  const addTopic = () => {
    if (newTopic.trim() !== '') {
      const updatedTopics = [...(currentRecipient.topics || []), newTopic.trim()];
      setCurrentRecipient({
        ...currentRecipient,
        topics: updatedTopics
      });
      setNewTopic('');
    }
  };
  
  const removeTopic = (index: number) => {
    const updatedTopics = [...(currentRecipient.topics || [])];
    updatedTopics.splice(index, 1);
    setCurrentRecipient({
      ...currentRecipient,
      topics: updatedTopics
    });
  };
  
  const handleSaveRecipient = () => {
    // Validate required fields
    if (!currentRecipient.name.trim() || !currentRecipient.email.trim()) {
      setSaveStatus({
        show: true,
        message: 'Name and email are required!',
        type: 'error'
      });
      return;
    }
    
    // Update or add the recipient
    const updatedRecipients = [...recipients];
    const existingIndex = updatedRecipients.findIndex(r => r.id === currentRecipient.id);
    
    if (existingIndex >= 0) {
      updatedRecipients[existingIndex] = currentRecipient;
    } else {
      updatedRecipients.push(currentRecipient);
    }
    
    // Save to state and storage
    setRecipients(updatedRecipients);
    chrome.storage.sync.set({ recipientContext: updatedRecipients }, () => {
      setSaveStatus({
        show: true,
        message: 'Recipient saved successfully!',
        type: 'success'
      });
      
      // Hide the alert after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({ ...prev, show: false }));
      }, 3000);
      
      handleDialogClose();
    });
  };
  
  const handleDeleteRecipient = () => {
    if (window.confirm('Are you sure you want to delete this recipient?')) {
      const updatedRecipients = recipients.filter(r => r.id !== currentRecipient.id);
      
      setRecipients(updatedRecipients);
      chrome.storage.sync.set({ recipientContext: updatedRecipients }, () => {
        setSaveStatus({
          show: true,
          message: 'Recipient deleted successfully!',
          type: 'success'
        });
        
        // Hide the alert after 3 seconds
        setTimeout(() => {
          setSaveStatus(prev => ({ ...prev, show: false }));
        }, 3000);
        
        handleDialogClose();
      });
    }
  };
  
  return (
    <>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5">Recipient Context</Typography>
          <Button 
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => handleDialogOpen(true)}
          >
            Add Recipient
          </Button>
        </Box>
        
        {saveStatus.show && (
          <Alert severity={saveStatus.type} sx={{ mb: 2 }}>
            {saveStatus.message}
          </Alert>
        )}
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Store information about the people you frequently email to help generate more personalized and contextually appropriate messages.
        </Typography>
        
        {recipients.length === 0 ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 6, 
            backgroundColor: 'background.default', 
            borderRadius: 2 
          }}>
            <PersonIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No recipients added yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Add your first recipient to get started
            </Typography>
            <Button 
              variant="outlined" 
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen(true)}
            >
              Add Recipient
            </Button>
          </Box>
        ) : (
          <List sx={{ 
            backgroundColor: 'background.default', 
            borderRadius: 2,
            overflow: 'hidden'
          }}>
            {recipients.map((recipient, index) => (
              <React.Fragment key={recipient.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem 
                  button 
                  onClick={() => handleRecipientSelect(recipient)}
                  secondaryAction={
                    <IconButton edge="end" aria-label="edit" onClick={() => {
                      setCurrentRecipient(recipient);
                      setIsEditing(true);
                      handleDialogOpen();
                    }}>
                      <EditIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      {recipient.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={recipient.name} 
                    secondary={
                      <>
                        {recipient.email}
                        {recipient.role && recipient.company && (
                          <span> • {recipient.role} at {recipient.company}</span>
                        )}
                      </>
                    } 
                  />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
      
      {/* Recipient Edit Dialog */}
      <Dialog 
        open={dialogOpen} 
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing ? 'Edit Recipient' : 'Recipient Details'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                value={currentRecipient.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
                required
              />
              <TextField
                label="Email Address"
                name="email"
                type="email"
                value={currentRecipient.email}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
                required
              />
              <TextField
                label="Role/Title"
                name="role"
                value={currentRecipient.role || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />
              <TextField
                label="Company/Organization"
                name="company"
                value={currentRecipient.company || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth margin="normal" disabled={!isEditing}>
                <InputLabel id="relationship-label">Relationship</InputLabel>
                <Select
                  labelId="relationship-label"
                  name="relationship"
                  value={currentRecipient.relationship || ''}
                  onChange={handleSelectChange}
                  label="Relationship"
                >
                  <MenuItem value="">Not specified</MenuItem>
                  <MenuItem value="colleague">Colleague</MenuItem>
                  <MenuItem value="client">Client</MenuItem>
                  <MenuItem value="vendor">Vendor</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="partner">Partner</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal" disabled={!isEditing}>
                <InputLabel id="communication-label">Preferred Communication Style</InputLabel>
                <Select
                  labelId="communication-label"
                  name="preferredCommunication"
                  value={currentRecipient.preferredCommunication || 'professional'}
                  onChange={handleSelectChange}
                  label="Preferred Communication Style"
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="formal">Formal</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="direct">Direct</MenuItem>
                  <MenuItem value="detailed">Detailed</MenuItem>
                  <MenuItem value="concise">Concise</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                label="Notes"
                name="notes"
                value={currentRecipient.notes || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                disabled={!isEditing}
                placeholder="Any special notes or reminders about this recipient"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ mt: 2, mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Key Topics
              </Typography>
              
              {isEditing && (
                <Box sx={{ display: 'flex', mb: 2 }}>
                  <TextField
                    label="Add Topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                    fullWidth
                    placeholder="e.g., Project X, Quarterly Reports, etc."
                  />
                  <Button 
                    variant="contained" 
                    sx={{ ml: 2, alignSelf: 'center' }}
                    onClick={addTopic}
                    disabled={!newTopic.trim()}
                  >
                    Add
                  </Button>
                </Box>
              )}
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                {currentRecipient.topics && currentRecipient.topics.map((topic, index) => (
                  <Chip
                    key={index}
                    label={topic}
                    onDelete={isEditing ? () => removeTopic(index) : undefined}
                    color="primary"
                    variant="outlined"
                  />
                ))}
                {(!currentRecipient.topics || currentRecipient.topics.length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    No topics added yet.
                  </Typography>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              {currentRecipient.id !== emptyRecipient.id && (
                <Button 
                  startIcon={<DeleteIcon />} 
                  color="error"
                  onClick={handleDeleteRecipient}
                  sx={{ mr: 'auto' }}
                >
                  Delete
                </Button>
              )}
              <Button 
                startIcon={<CancelIcon />} 
                onClick={handleDialogClose}
              >
                Cancel
              </Button>
              <Button 
                startIcon={<SaveIcon />} 
                variant="contained"
                onClick={handleSaveRecipient}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={handleDialogClose}
              >
                Close
              </Button>
              <Button 
                startIcon={<EditIcon />} 
                variant="contained"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
      
      {/* Floating add button */}
      <Tooltip title="Add Recipient" placement="left">
        <Fab 
          color="primary" 
          sx={{ position: 'fixed', bottom: 24, right: 24 }}
          onClick={() => handleDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default RecipientContext;