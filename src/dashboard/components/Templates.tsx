// src/dashboard/components/Templates.tsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
  Chip,
  Fab,
  Tooltip,
  Alert,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  FileCopy as FileCopyIcon,
} from "@mui/icons-material";

interface TemplateData {
  id: string;
  name: string;
  description: string;
  category: string;
  content: string;
  tags: string[];
}

const emptyTemplate: TemplateData = {
  id: "",
  name: "",
  description: "",
  category: "general",
  content: "",
  tags: [],
};

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [currentTemplate, setCurrentTemplate] =
    useState<TemplateData>(emptyTemplate);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [newTag, setNewTag] = useState<string>("");
  const [saveStatus, setSaveStatus] = useState<{
    show: boolean;
    message: string;
    type: "success" | "error";
  }>({
    show: false,
    message: "",
    type: "success",
  });

  // Load templates from Chrome storage
  useEffect(() => {
    chrome.storage.sync.get(["templates"], (result) => {
      if (result.templates) {
        setTemplates(result.templates);
      } else {
        // Initialize with sample templates if none exist
        const sampleTemplates = generateSampleTemplates();
        setTemplates(sampleTemplates);
        chrome.storage.sync.set({ templates: sampleTemplates });
      }
    });
  }, []);

  const generateSampleTemplates = (): TemplateData[] => {
    return [
      {
        id: "template_1",
        name: "Professional Introduction",
        description: "A formal introduction email for new business contacts",
        category: "introduction",
        content:
          "Dear {{recipient.name}},\n\nI hope this email finds you well. My name is {{user.name}} and I am the {{user.role}} at {{user.company}}.\n\nI am reaching out because {{reason}}.\n\nI would appreciate the opportunity to {{request}}.\n\nThank you for your time and consideration.\n\nBest regards,\n{{user.name}}\n{{user.role}} | {{user.company}}",
        tags: ["introduction", "formal", "business"],
      },
      {
        id: "template_2",
        name: "Meeting Follow-up",
        description: "Thank you email after a business meeting",
        category: "followup",
        content:
          "Hi {{recipient.name}},\n\nThank you for taking the time to meet with me today to discuss {{topic}}.\n\nI found our conversation about {{highlight}} particularly insightful, at hesitate to reach out if you have any questions in the meantime.\n\nBest regards,\n{{user.name}}",
        tags: ["follow-up", "meeting", "thank you"],
      },
    ];
  };

  const handleDialogOpen = (isNew: boolean = false) => {
    if (isNew) {
      const newId = `template_${Date.now()}`;
      setCurrentTemplate({ ...emptyTemplate, id: newId });
    }
    setIsEditing(isNew);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setIsEditing(false);
  };

  const handleTemplateSelect = (template: TemplateData) => {
    setCurrentTemplate(template);
    handleDialogOpen();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentTemplate({
      ...currentTemplate,
      [name]: value,
    });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentTemplate({
      ...currentTemplate,
      [name]: value,
    });
  };

  const addTag = () => {
    if (newTag.trim() !== "") {
      const updatedTags = [...(currentTemplate.tags || []), newTag.trim()];
      setCurrentTemplate({
        ...currentTemplate,
        tags: updatedTags,
      });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    const updatedTags = [...(currentTemplate.tags || [])];
    updatedTags.splice(index, 1);
    setCurrentTemplate({
      ...currentTemplate,
      tags: updatedTags,
    });
  };

  const handleSaveTemplate = () => {
    // Validate required fields
    if (!currentTemplate.name.trim() || !currentTemplate.content.trim()) {
      setSaveStatus({
        show: true,
        message: "Name and content are required!",
        type: "error",
      });
      return;
    }

    // Update or add the template
    const updatedTemplates = [...templates];
    const existingIndex = updatedTemplates.findIndex(
      (t) => t.id === currentTemplate.id
    );

    if (existingIndex >= 0) {
      updatedTemplates[existingIndex] = currentTemplate;
    } else {
      updatedTemplates.push(currentTemplate);
    }

    // Save to state and storage
    setTemplates(updatedTemplates);
    chrome.storage.sync.set({ templates: updatedTemplates }, () => {
      setSaveStatus({
        show: true,
        message: "Template saved successfully!",
        type: "success",
      });

      // Hide the alert after 3 seconds
      setTimeout(() => {
        setSaveStatus((prev) => ({ ...prev, show: false }));
      }, 3000);

      handleDialogClose();
    });
  };

  const handleDeleteTemplate = () => {
    if (window.confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter(
        (t) => t.id !== currentTemplate.id
      );

      setTemplates(updatedTemplates);
      chrome.storage.sync.set({ templates: updatedTemplates }, () => {
        setSaveStatus({
          show: true,
          message: "Template deleted successfully!",
          type: "success",
        });

        // Hide the alert after 3 seconds
        setTimeout(() => {
          setSaveStatus((prev) => ({ ...prev, show: false }));
        }, 3000);

        handleDialogClose();
      });
    }
  };

  const handleDuplicateTemplate = (template: TemplateData) => {
    const newId = `template_${Date.now()}`;
    const duplicatedTemplate: TemplateData = {
      ...template,
      id: newId,
      name: `${template.name} (Copy)`,
    };

    setCurrentTemplate(duplicatedTemplate);
    setIsEditing(true);
    setDialogOpen(true);
  };

  // Group templates by category
  const groupedTemplates = templates.reduce(
    (groups: Record<string, TemplateData[]>, template) => {
      const category = template.category || "general";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(template);
      return groups;
    },
    {}
  );

  return (
    <>
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h5">Email Templates</Typography>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => handleDialogOpen(true)}
          >
            Create Template
          </Button>
        </Box>

        {saveStatus.show && (
          <Alert severity={saveStatus.type} sx={{ mb: 2 }}>
            {saveStatus.message}
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {`Create reusable templates for common email scenarios. Use variables like {user.name} or {recipient.role} that will be automatically filled in.`}
        </Typography>

        {templates.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              backgroundColor: "background.default",
              borderRadius: 2,
            }}
          >
            <DescriptionIcon
              sx={{ fontSize: 60, color: "text.disabled", mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary">
              No templates yet
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Create your first template to get started
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleDialogOpen(true)}
            >
              Create Template
            </Button>
          </Box>
        ) : (
          <Box>
            {Object.entries(groupedTemplates).map(
              ([category, categoryTemplates]) => (
                <Box key={category} sx={{ mb: 4 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      mb: 2,
                      textTransform: "capitalize",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {category}
                    <Chip
                      label={categoryTemplates.length}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </Typography>

                  <Grid container spacing={2}>
                    {categoryTemplates.map((template) => (
                      <Grid item xs={12} sm={6} md={4} key={template.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="h6" noWrap>
                              {template.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{ mb: 2 }}
                              noWrap
                            >
                              {template.description || "No description"}
                            </Typography>

                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 0.5,
                                mb: 2,
                              }}
                            >
                              {template.tags.map((tag, index) => (
                                <Chip key={index} label={tag} size="small" />
                              ))}
                            </Box>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                            >
                              {template.content.substring(0, 60)}...
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <Button
                              size="small"
                              onClick={() => handleTemplateSelect(template)}
                            >
                              View
                            </Button>
                            <Button
                              size="small"
                              startIcon={<EditIcon />}
                              onClick={() => {
                                setCurrentTemplate(template);
                                setIsEditing(true);
                                handleDialogOpen();
                              }}
                            >
                              Edit
                            </Button>
                            <IconButton
                              size="small"
                              onClick={() => handleDuplicateTemplate(template)}
                              sx={{ ml: "auto" }}
                            >
                              <FileCopyIcon fontSize="small" />
                            </IconButton>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )
            )}
          </Box>
        )}
      </Paper>

      {/* Template Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isEditing
            ? currentTemplate.id === emptyTemplate.id
              ? "Create Template"
              : "Edit Template"
            : "Template Details"}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Template Name"
                name="name"
                value={currentTemplate.name}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
                required
              />

              <TextField
                label="Description"
                name="description"
                value={currentTemplate.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                disabled={!isEditing}
              />

              <FormControl fullWidth margin="normal" disabled={!isEditing}>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  name="category"
                  value={currentTemplate.category}
                  onChange={handleSelectChange}
                  label="Category"
                >
                  <MenuItem value="general">General</MenuItem>
                  <MenuItem value="introduction">Introduction</MenuItem>
                  <MenuItem value="followup">Follow-up</MenuItem>
                  <MenuItem value="request">Request</MenuItem>
                  <MenuItem value="thankyou">Thank You</MenuItem>
                  <MenuItem value="apology">Apology</MenuItem>
                  <MenuItem value="invitation">Invitation</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              {isEditing && (
                <Box sx={{ display: "flex", mb: 2 }}>
                  <TextField
                    label="Add Tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    fullWidth
                    margin="normal"
                    placeholder="e.g., formal, business, etc."
                  />
                  <Button
                    variant="contained"
                    sx={{ ml: 2, alignSelf: "center" }}
                    onClick={addTag}
                    disabled={!newTag.trim()}
                  >
                    Add
                  </Button>
                </Box>
              )}

              <Typography variant="subtitle2" gutterBottom>
                Tags
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {currentTemplate.tags &&
                  currentTemplate.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      onDelete={isEditing ? () => removeTag(index) : undefined}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                {(!currentTemplate.tags ||
                  currentTemplate.tags.length === 0) && (
                  <Typography variant="body2" color="text.secondary">
                    No tags added yet.
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" gutterBottom>
                Available Variables
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                <Chip label="{{user.name}}" size="small" variant="outlined" />
                <Chip label="{{user.role}}" size="small" variant="outlined" />
                <Chip
                  label="{{user.company}}"
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label="{{recipient.name}}"
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label="{{recipient.role}}"
                  size="small"
                  variant="outlined"
                />
                <Chip
                  label="{{recipient.company}}"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Template Content
              </Typography>
              <TextField
                name="content"
                value={currentTemplate.content}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={10}
                disabled={!isEditing}
                placeholder="Write your template content here. Use variables like {{user.name}} or {{recipient.company}} that will be replaced with actual values."
                sx={{ fontFamily: "monospace" }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          {isEditing ? (
            <>
              {currentTemplate.id !== emptyTemplate.id && (
                <Button
                  startIcon={<DeleteIcon />}
                  color="error"
                  onClick={handleDeleteTemplate}
                  sx={{ mr: "auto" }}
                >
                  Delete
                </Button>
              )}
              <Button startIcon={<CancelIcon />} onClick={handleDialogClose}>
                Cancel
              </Button>
              <Button
                startIcon={<SaveIcon />}
                variant="contained"
                onClick={handleSaveTemplate}
              >
                Save
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleDialogClose}>Close</Button>
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
      <Tooltip title="Create Template" placement="left">
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: 24, right: 24 }}
          onClick={() => handleDialogOpen(true)}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

export default Templates;
