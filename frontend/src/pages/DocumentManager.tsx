import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  GridView as GridViewIcon,
  ViewList as ListViewIcon,
  FilterList as FilterIcon,
  Description as DocumentIcon,
  Image as ImageIcon,
  TableChart as TableIcon,
  Code as CodeIcon,
  PictureAsPdf as PdfIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useDocuments } from '../context/DocumentContext';
import { useNavigate } from 'react-router-dom';
import type { Document } from '../types';

const DocumentManager: React.FC = () => {
  const { documents, uploadDocument, deleteDocument, selectDocument, loading } = useDocuments();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      await uploadDocument(file);
    }
    setUploadDialogOpen(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'text/plain': ['.txt'],
      'text/html': ['.html'],
      'text/csv': ['.csv'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.bmp'],
    },
  });

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, doc: Document) => {
    setAnchorEl(event.currentTarget);
    setSelectedDoc(doc);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedDoc(null);
  };

  const handleDelete = async () => {
    if (selectedDoc) {
      await deleteDocument(selectedDoc.id);
      setDeleteDialogOpen(false);
      handleMenuClose();
    }
  };

  const handleView = (doc: Document) => {
    selectDocument(doc.id);
    navigate(`/documents/${doc.id}`);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.fileType.includes(filterType);
    return matchesSearch && matchesType;
  });

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('pdf')) return <PdfIcon className="text-red-500" />;
    if (fileType.includes('image')) return <ImageIcon className="text-blue-500" />;
    if (fileType.includes('spreadsheet') || fileType.includes('excel')) return <TableIcon className="text-green-500" />;
    if (fileType.includes('word')) return <DocumentIcon className="text-blue-600" />;
    if (fileType.includes('powerpoint')) return <FileIcon className="text-orange-500" />;
    return <FileIcon className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderGridView = () => (
    <Grid container spacing={3}>
      {filteredDocuments.map((doc) => (
        <Grid item xs={12} sm={6} md={4} key={doc.id}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <Box className="flex items-center justify-between mb-3">
                <Avatar className="bg-primary-50">
                  {getFileIcon(doc.fileType)}
                </Avatar>
                <Box className="flex items-center space-x-1">
                  <Chip
                    label={doc.status}
                    size="small"
                    className={`${
                      doc.status === 'ready' ? 'bg-green-100 text-green-800' : 
                      doc.status === 'processing' ? 'bg-orange-100 text-orange-800' : 
                      'bg-red-100 text-red-800'
                    }`}
                  />
                  <IconButton size="small" onClick={(e) => handleMenuClick(e, doc)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </Box>
              
              <Typography variant="h6" className="font-semibold mb-2 line-clamp-2">
                {doc.title}
              </Typography>
              
              <Typography variant="body2" className="text-gray-600 mb-2">
                {doc.filename}
              </Typography>
              
              <Box className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>{doc.uploadDate.toLocaleDateString()}</span>
              </Box>

              <Box className="flex flex-wrap gap-1 mb-3">
                {doc.tags.slice(0, 3).map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
                {doc.tags.length > 3 && (
                  <Chip label={`+${doc.tags.length - 3}`} size="small" variant="outlined" />
                )}
              </Box>

              {doc.status === 'processing' && (
                <LinearProgress className="mb-2" />
              )}
            </CardContent>
            
            <CardActions className="px-4 pb-4">
              <Button
                size="small"
                startIcon={<VisibilityIcon />}
                onClick={() => handleView(doc)}
                disabled={doc.status !== 'ready'}
              >
                View
              </Button>
              <Button
                size="small"
                startIcon={<ShareIcon />}
                disabled={doc.status !== 'ready'}
              >
                Share
              </Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Document</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Size</TableCell>
            <TableCell>Upload Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredDocuments.map((doc) => (
            <TableRow key={doc.id} hover>
              <TableCell>
                <Box className="flex items-center space-x-3">
                  <Avatar className="bg-primary-50">
                    {getFileIcon(doc.fileType)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="font-medium">
                      {doc.title}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      {doc.filename}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Chip label={doc.fileType} size="small" variant="outlined" />
              </TableCell>
              <TableCell>{formatFileSize(doc.fileSize)}</TableCell>
              <TableCell>{doc.uploadDate.toLocaleDateString()}</TableCell>
              <TableCell>
                <Chip
                  label={doc.status}
                  size="small"
                  className={`${
                    doc.status === 'ready' ? 'bg-green-100 text-green-800' : 
                    doc.status === 'processing' ? 'bg-orange-100 text-orange-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                />
              </TableCell>
              <TableCell>
                <IconButton size="small" onClick={() => handleView(doc)}>
                  <VisibilityIcon />
                </IconButton>
                <IconButton size="small" onClick={(e) => handleMenuClick(e, doc)}>
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            Document Manager
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Upload, organize, and manage your documents
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
          className="bg-primary-600 hover:bg-primary-700"
        >
          Upload Document
        </Button>
      </Box>

      {/* Filters and Search */}
      <Box className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Box className="flex items-center space-x-4">
          <TextField
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            className="w-64"
          />
          
          <FormControl className="w-32">
            <InputLabel>Type</InputLabel>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              label="Type"
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
              <MenuItem value="word">Word</MenuItem>
              <MenuItem value="excel">Excel</MenuItem>
              <MenuItem value="image">Image</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        <Box className="flex items-center space-x-2">
          <IconButton
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : ''}
          >
            <GridViewIcon />
          </IconButton>
          <IconButton
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-primary-50 text-primary-600' : ''}
          >
            <ListViewIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Documents Grid/List */}
      {filteredDocuments.length === 0 ? (
        <Box className="text-center py-12">
          <DocumentIcon className="text-gray-300 text-6xl mb-4" />
          <Typography variant="h6" className="text-gray-500 mb-2">
            No documents found
          </Typography>
          <Typography variant="body2" className="text-gray-400 mb-4">
            Upload your first document to get started
          </Typography>
          <Button
            variant="contained"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Document
          </Button>
        </Box>
      ) : (
        viewMode === 'grid' ? renderGridView() : renderListView()
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Upload Documents</DialogTitle>
        <DialogContent>
          <Box
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            <UploadIcon className="text-gray-400 text-6xl mb-4" />
            <Typography variant="h6" className="mb-2">
              {isDragActive ? 'Drop the files here' : 'Drag & drop files here, or click to select'}
            </Typography>
            <Typography variant="body2" className="text-gray-500">
              Supports PDF, Word, Excel, PowerPoint, images, and more
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedDoc && handleView(selectedDoc)}>
          <VisibilityIcon className="mr-2" />
          View
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <EditIcon className="mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ShareIcon className="mr-2" />
          Share
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <DownloadIcon className="mr-2" />
          Download
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)} className="text-red-600">
          <DeleteIcon className="mr-2" />
          Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Document</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedDoc?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DocumentManager; 