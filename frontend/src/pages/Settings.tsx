import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  RadioGroup,
  Radio,
  FormLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Palette as PaletteIcon,
  Language as LanguageIcon,
  Storage as StorageIcon,
  CloudSync as CloudSyncIcon,
  Api as ApiIcon,
  Webhook as WebhookIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useDocuments } from '../context/DocumentContext';

const Settings: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { documents } = useDocuments();
  const [tabValue, setTabValue] = useState(0);
  const [editingProfile, setEditingProfile] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [integrationDialogOpen, setIntegrationDialogOpen] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    notifications: true,
    autoSave: true,
    defaultView: 'grid',
    resultsPerPage: 10,
    aiModel: 'gpt-4',
    embeddingModel: 'text-embedding-ada-002',
  });

  const [integrations, setIntegrations] = useState([
    { id: 'slack', name: 'Slack', type: 'webhook', enabled: false, status: 'inactive' },
    { id: 'teams', name: 'Microsoft Teams', type: 'webhook', enabled: true, status: 'active' },
    { id: 'zapier', name: 'Zapier', type: 'api', enabled: false, status: 'inactive' },
    { id: 'webhook', name: 'Custom Webhook', type: 'webhook', enabled: false, status: 'inactive' },
  ]);

  const handleProfileSave = async () => {
    try {
      await updateProfile(profileData);
      setEditingProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handlePreferenceChange = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleIntegrationToggle = (integrationId: string) => {
    setIntegrations(prev => 
      prev.map(integration => 
        integration.id === integrationId 
          ? { ...integration, enabled: !integration.enabled }
          : integration
      )
    );
  };

  const renderProfileTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Profile Information
            </Typography>
            
            <Box className="flex items-center space-x-4 mb-6">
              <Avatar
                src={profileData.avatar}
                alt={profileData.name}
                className="w-20 h-20"
              >
                {profileData.name.charAt(0)}
              </Avatar>
              <Box>
                <Button variant="outlined" startIcon={<UploadIcon />} size="small">
                  Change Photo
                </Button>
                <Typography variant="caption" className="block mt-1 text-gray-500">
                  JPG, PNG or GIF (max 2MB)
                </Typography>
              </Box>
            </Box>

            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Full Name"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                disabled={!editingProfile}
              />
              
              <TextField
                fullWidth
                label="Email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                disabled={!editingProfile}
              />
              
              <Box className="flex space-x-2">
                {editingProfile ? (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<SaveIcon />}
                      onClick={handleProfileSave}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setEditingProfile(false)}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => setEditingProfile(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Account Statistics
            </Typography>
            
            <Box className="space-y-4">
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">
                  Total Documents
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {documents.length}
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">
                  Storage Used
                </Typography>
                <Typography variant="body2" className="font-medium">
                  {(documents.reduce((acc, doc) => acc + doc.fileSize, 0) / 1024 / 1024).toFixed(1)} MB
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">
                  Member Since
                </Typography>
                <Typography variant="body2" className="font-medium">
                  January 2024
                </Typography>
              </Box>
              
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">
                  Plan
                </Typography>
                <Chip label="Pro" size="small" className="bg-primary-100 text-primary-800" />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderPreferencesTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Appearance
            </Typography>
            
            <Box className="space-y-4">
              <FormControl fullWidth>
                <InputLabel>Theme</InputLabel>
                <Select
                  value={preferences.theme}
                  onChange={(e) => handlePreferenceChange('theme', e.target.value)}
                  label="Theme"
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                  <MenuItem value="auto">Auto</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Language</InputLabel>
                <Select
                  value={preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  label="Language"
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Default View</InputLabel>
                <Select
                  value={preferences.defaultView}
                  onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
                  label="Default View"
                >
                  <MenuItem value="grid">Grid</MenuItem>
                  <MenuItem value="list">List</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Behavior
            </Typography>
            
            <Box className="space-y-4">
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.notifications}
                    onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                  />
                }
                label="Enable Notifications"
              />
              
              <FormControlLabel
                control={
                  <Switch
                    checked={preferences.autoSave}
                    onChange={(e) => handlePreferenceChange('autoSave', e.target.checked)}
                  />
                }
                label="Auto Save"
              />
              
              <Box>
                <Typography variant="body2" className="mb-2">
                  Results per Page
                </Typography>
                <Slider
                  value={preferences.resultsPerPage}
                  onChange={(e, value) => handlePreferenceChange('resultsPerPage', value)}
                  min={5}
                  max={50}
                  step={5}
                  valueLabelDisplay="auto"
                  marks
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              AI Models
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>AI Model</InputLabel>
                  <Select
                    value={preferences.aiModel}
                    onChange={(e) => handlePreferenceChange('aiModel', e.target.value)}
                    label="AI Model"
                  >
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                    <MenuItem value="claude-3">Claude 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Embedding Model</InputLabel>
                  <Select
                    value={preferences.embeddingModel}
                    onChange={(e) => handlePreferenceChange('embeddingModel', e.target.value)}
                    label="Embedding Model"
                  >
                    <MenuItem value="text-embedding-ada-002">Ada-002</MenuItem>
                    <MenuItem value="text-embedding-3-small">Embedding-3-Small</MenuItem>
                    <MenuItem value="text-embedding-3-large">Embedding-3-Large</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderIntegrationsTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card>
          <CardContent className="p-6">
            <Box className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                Integrations
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setIntegrationDialogOpen(true)}
              >
                Add Integration
              </Button>
            </Box>
            
            <List>
              {integrations.map((integration) => (
                <ListItem key={integration.id} className="border-b last:border-b-0">
                  <ListItemIcon>
                    {integration.type === 'webhook' ? <WebhookIcon /> : <ApiIcon />}
                  </ListItemIcon>
                  <ListItemText
                    primary={integration.name}
                    secondary={
                      <Box className="flex items-center space-x-2">
                        <Chip
                          label={integration.status}
                          size="small"
                          className={`${
                            integration.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        />
                        <Typography variant="caption" className="text-gray-500">
                          {integration.type}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Switch
                      checked={integration.enabled}
                      onChange={() => handleIntegrationToggle(integration.id)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              API Configuration
            </Typography>
            
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="API Key"
                type={showApiKey ? 'text' : 'password'}
                value="sk-...abc123"
                InputProps={{
                  endAdornment: (
                    <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                      {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  ),
                }}
                disabled
              />
              
              <TextField
                fullWidth
                label="Webhook URL"
                value="https://api.example.com/webhook"
                disabled
              />
              
              <Box className="flex space-x-2">
                <Button variant="outlined" startIcon={<EditIcon />}>
                  Edit
                </Button>
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Download Config
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderSecurityTab = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Password & Security
            </Typography>
            
            <Box className="space-y-4">
              <TextField
                fullWidth
                label="Current Password"
                type="password"
              />
              
              <TextField
                fullWidth
                label="New Password"
                type="password"
              />
              
              <TextField
                fullWidth
                label="Confirm New Password"
                type="password"
              />
              
              <Button variant="contained" fullWidth>
                Change Password
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Two-Factor Authentication
            </Typography>
            
            <Box className="space-y-4">
              <Alert severity="info">
                Two-factor authentication is not enabled for your account.
              </Alert>
              
              <Button variant="outlined" fullWidth>
                Enable 2FA
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent className="p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Data & Privacy
            </Typography>
            
            <Box className="space-y-4">
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Allow usage analytics"
              />
              
              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable crash reporting"
              />
              
              <FormControlLabel
                control={<Switch />}
                label="Share data for AI improvement"
              />
              
              <Divider className="my-4" />
              
              <Box className="flex space-x-2">
                <Button variant="outlined" startIcon={<DownloadIcon />}>
                  Export Data
                </Button>
                <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                  Delete Account
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box className="space-y-6">
      <Typography variant="h4" className="font-bold text-gray-900">
        Settings
      </Typography>
      
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} className="px-4">
          <Tab label="Profile" />
          <Tab label="Preferences" />
          <Tab label="Integrations" />
          <Tab label="Security" />
        </Tabs>
      </Card>
      
      <Box>
        {tabValue === 0 && renderProfileTab()}
        {tabValue === 1 && renderPreferencesTab()}
        {tabValue === 2 && renderIntegrationsTab()}
        {tabValue === 3 && renderSecurityTab()}
      </Box>
      
      {/* Integration Dialog */}
      <Dialog open={integrationDialogOpen} onClose={() => setIntegrationDialogOpen(false)}>
        <DialogTitle>Add Integration</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 pt-2">
            <FormControl fullWidth>
              <InputLabel>Integration Type</InputLabel>
              <Select
                value={selectedIntegration || ''}
                onChange={(e) => setSelectedIntegration(e.target.value)}
                label="Integration Type"
              >
                <MenuItem value="webhook">Webhook</MenuItem>
                <MenuItem value="api">API</MenuItem>
                <MenuItem value="export">Export</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              label="Name"
              placeholder="Enter integration name"
            />
            
            <TextField
              fullWidth
              label="URL"
              placeholder="Enter webhook URL or API endpoint"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIntegrationDialogOpen(false)}>Cancel</Button>
          <Button variant="contained">Add Integration</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Settings; 