import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  IconButton,
  Chip,
  Avatar,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Breadcrumbs,
  Link,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Edit as EditIcon,
  Fullscreen as FullscreenIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Navigation as NavigationIcon,
  TableChart as TableIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  Description as DocumentIcon,
  TrendingUp as TrendingUpIcon,
  Bookmark as BookmarkIcon,
  Comment as CommentIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useDocuments } from '../context/DocumentContext';
import type { Document, ImageContent, TableContent, CodeBlockContent } from '../types';

const DocumentViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { documents, selectedDocument, selectDocument } = useDocuments();
  const [tabValue, setTabValue] = useState(0);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageContent | null>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (id) {
      selectDocument(id);
    }
  }, [id, selectDocument]);

  const doc = selectedDocument || documents.find(d => d.id === id);

  if (!doc) {
    return (
      <Box className="text-center py-12">
        <DocumentIcon className="text-gray-300 text-6xl mb-4" />
        <Typography variant="h6" className="text-gray-500 mb-2">
          Document not found
        </Typography>
        <Button variant="contained" onClick={() => navigate('/documents')}>
          Back to Documents
        </Button>
      </Box>
    );
  }

  const handleImageClick = (image: ImageContent) => {
    setSelectedImage(image);
    setImageDialogOpen(true);
  };

  const renderContent = () => (
    <Box className="prose max-w-none">
      {doc.content.sections.map((section) => (
        <Box key={section.id} className="mb-8">
          <Typography variant={`h${Math.min(section.level + 2, 6)}` as any} className="mb-4">
            {section.title}
          </Typography>
          <Typography variant="body1" className="mb-4 whitespace-pre-wrap">
            {section.content}
          </Typography>
          {section.subsections.map((subsection) => (
            <Box key={subsection.id} className="ml-4 mb-4">
              <Typography variant={`h${Math.min(subsection.level + 2, 6)}` as any} className="mb-2">
                {subsection.title}
              </Typography>
              <Typography variant="body1" className="whitespace-pre-wrap">
                {subsection.content}
              </Typography>
            </Box>
          ))}
        </Box>
      ))}
    </Box>
  );

  const renderImages = () => (
    <Grid container spacing={3}>
      {doc.content.images.map((image) => (
        <Grid item xs={12} sm={6} md={4} key={image.id}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <Box className="mb-3">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-48 object-cover rounded-lg"
                  onClick={() => handleImageClick(image)}
                />
              </Box>
              <Typography variant="body2" className="font-medium mb-2">
                {image.caption || image.alt}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                Page {image.position.page}
              </Typography>
              {image.analysis && (
                <Typography variant="body2" className="mt-2 text-gray-600">
                  {image.analysis}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTables = () => (
    <Box className="space-y-6">
      {doc.content.tables.map((table) => (
        <Card key={table.id}>
          <CardContent className="p-4">
            <Box className="flex items-center justify-between mb-4">
              <Typography variant="h6" className="font-semibold">
                {table.caption || `Table ${table.id}`}
              </Typography>
              <Typography variant="caption" className="text-gray-500">
                Page {table.position.page}
              </Typography>
            </Box>
            <TableContainer component={Paper} className="mb-4">
              <Table>
                <TableHead>
                  <TableRow>
                    {table.headers.map((header, index) => (
                      <TableCell key={index} className="font-semibold">
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {table.rows.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {table.analysis && (
              <Box className="bg-gray-50 p-3 rounded-lg">
                <Typography variant="body2" className="text-gray-700">
                  <strong>Analysis:</strong> {table.analysis}
                </Typography>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderCodeBlocks = () => (
    <Box className="space-y-4">
      {doc.content.codeBlocks.map((codeBlock) => (
        <Card key={codeBlock.id}>
          <CardContent className="p-4">
            <Box className="flex items-center justify-between mb-4">
              <Box className="flex items-center space-x-2">
                <Chip label={codeBlock.language} size="small" className="bg-primary-100 text-primary-800" />
                <Typography variant="caption" className="text-gray-500">
                  Page {codeBlock.position.page}
                </Typography>
              </Box>
              <Button size="small" startIcon={<DownloadIcon />}>
                Copy
              </Button>
            </Box>
            <SyntaxHighlighter
              language={codeBlock.language}
              style={tomorrow}
              showLineNumbers={codeBlock.line_numbers}
              className="rounded-lg"
            >
              {codeBlock.code}
            </SyntaxHighlighter>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderCharts = () => (
    <Grid container spacing={3}>
      {doc.content.charts.map((chart) => (
        <Grid item xs={12} md={6} key={chart.id}>
          <Card>
            <CardContent className="p-4">
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold">
                  {chart.title || `Chart ${chart.id}`}
                </Typography>
                <Typography variant="caption" className="text-gray-500">
                  Page {chart.position.page}
                </Typography>
              </Box>
              <Box className="h-64 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUpIcon className="text-gray-400 text-4xl" />
                <Typography variant="body2" className="text-gray-500 ml-2">
                  Chart visualization would be rendered here
                </Typography>
              </Box>
              {chart.analysis && (
                <Box className="bg-gray-50 p-3 rounded-lg">
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Analysis:</strong> {chart.analysis}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderMetadata = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-4">
            <Typography variant="h6" className="font-semibold mb-4">
              Document Information
            </Typography>
            <Box className="space-y-3">
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Title:</Typography>
                <Typography variant="body2" className="font-medium">{doc.title}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">File Type:</Typography>
                <Typography variant="body2" className="font-medium">{doc.fileType}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Size:</Typography>
                <Typography variant="body2" className="font-medium">
                  {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Upload Date:</Typography>
                <Typography variant="body2" className="font-medium">
                  {doc.uploadDate.toLocaleDateString()}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Status:</Typography>
                <Chip
                  label={doc.status}
                  size="small"
                  className={`${
                    doc.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                  }`}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card>
          <CardContent className="p-4">
            <Typography variant="h6" className="font-semibold mb-4">
              Content Statistics
            </Typography>
            <Box className="space-y-3">
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Pages:</Typography>
                <Typography variant="body2" className="font-medium">
                  {doc.metadata.pageCount || 'N/A'}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Words:</Typography>
                <Typography variant="body2" className="font-medium">
                  {doc.metadata.wordCount?.toLocaleString() || 'N/A'}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Images:</Typography>
                <Typography variant="body2" className="font-medium">
                  {doc.content.images.length}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Tables:</Typography>
                <Typography variant="body2" className="font-medium">
                  {doc.content.tables.length}
                </Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2" className="text-gray-600">Code Blocks:</Typography>
                <Typography variant="body2" className="font-medium">
                  {doc.content.codeBlocks.length}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12}>
        <Card>
          <CardContent className="p-4">
            <Typography variant="h6" className="font-semibold mb-4">
              Tags
            </Typography>
            <Box className="flex flex-wrap gap-2">
              {doc.tags.map((tag, index) => (
                <Chip key={index} label={tag} variant="outlined" />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex items-center justify-between">
        <Box className="flex items-center space-x-4">
          <IconButton onClick={() => navigate('/documents')}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Breadcrumbs>
              <Link color="inherit" href="/documents">
                Documents
              </Link>
              <Typography color="text.primary">{doc.title}</Typography>
            </Breadcrumbs>
            <Typography variant="h4" className="font-bold text-gray-900 mt-2">
              {doc.title}
            </Typography>
          </Box>
        </Box>
        
        <Box className="flex items-center space-x-2">
          <Button startIcon={<DownloadIcon />} variant="outlined">
            Download
          </Button>
          <Button startIcon={<ShareIcon />} variant="outlined">
            Share
          </Button>
          <Button startIcon={<EditIcon />} variant="outlined">
            Edit
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} className="px-4">
          <Tab 
            label={
              <Box className="flex items-center space-x-2">
                <DocumentIcon />
                <span>Content</span>
              </Box>
            } 
          />
          <Tab 
            label={
              <Box className="flex items-center space-x-2">
                <ImageIcon />
                <span>Images</span>
                <Badge badgeContent={doc.content.images.length} color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box className="flex items-center space-x-2">
                <TableIcon />
                <span>Tables</span>
                <Badge badgeContent={doc.content.tables.length} color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box className="flex items-center space-x-2">
                <CodeIcon />
                <span>Code</span>
                <Badge badgeContent={doc.content.codeBlocks.length} color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box className="flex items-center space-x-2">
                <TrendingUpIcon />
                <span>Charts</span>
                <Badge badgeContent={doc.content.charts.length} color="primary" />
              </Box>
            } 
          />
          <Tab 
            label={
              <Box className="flex items-center space-x-2">
                <NavigationIcon />
                <span>Metadata</span>
              </Box>
            } 
          />
        </Tabs>
      </Card>

      {/* Content */}
      <Box>
        {tabValue === 0 && renderContent()}
        {tabValue === 1 && renderImages()}
        {tabValue === 2 && renderTables()}
        {tabValue === 3 && renderCodeBlocks()}
        {tabValue === 4 && renderCharts()}
        {tabValue === 5 && renderMetadata()}
      </Box>

      {/* Image Dialog */}
      <Dialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box className="flex items-center justify-between">
            <Typography variant="h6">
              {selectedImage?.caption || selectedImage?.alt}
            </Typography>
            <IconButton onClick={() => setImageDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedImage && (
            <Box className="text-center">
              <img
                src={selectedImage.url}
                alt={selectedImage.alt}
                className="max-w-full max-h-96 object-contain"
                style={{ transform: `scale(${zoom})` }}
              />
              <Box className="mt-4 space-x-2">
                <IconButton onClick={() => setZoom(zoom * 0.8)}>
                  <ZoomOutIcon />
                </IconButton>
                <IconButton onClick={() => setZoom(zoom * 1.2)}>
                  <ZoomInIcon />
                </IconButton>
                <IconButton onClick={() => setZoom(1)}>
                  <FullscreenIcon />
                </IconButton>
              </Box>
              {selectedImage.analysis && (
                <Box className="mt-4 p-3 bg-gray-50 rounded-lg text-left">
                  <Typography variant="body2" className="text-gray-700">
                    <strong>Analysis:</strong> {selectedImage.analysis}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DocumentViewer; 