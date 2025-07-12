import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Grid,
  Avatar,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  FormControlLabel,
  Slider,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  Send as SendIcon,
  Mic as MicIcon,
  Image as ImageIcon,
  AttachFile as AttachFileIcon,
  FilterList as FilterIcon,
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  ExpandMore as ExpandMoreIcon,
  QueryStats as QueryStatsIcon,
  AutoAwesome as AutoAwesomeIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Code as CodeIcon,
  TableChart as TableIcon,
  Description as DocumentIcon,
} from '@mui/icons-material';
import { useDocuments } from '../context/DocumentContext';
import { useNavigate } from 'react-router-dom';
import type { Query, QueryResult, Document } from '../types';

const QueryInterface: React.FC = () => {
  const { documents, executeQuery, queries, selectedQuery, selectQuery, loading } = useDocuments();
  const navigate = useNavigate();
  const [queryText, setQueryText] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [queryType, setQueryType] = useState<'text' | 'multimodal' | 'code' | 'data'>('text');
  const [filters, setFilters] = useState({
    dateRange: { enabled: false, start: '', end: '' },
    documentTypes: [] as string[],
    tags: [] as string[],
    relevanceThreshold: 0.5,
    maxResults: 10,
  });
  const [showFilters, setShowFilters] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const queryInputRef = useRef<HTMLTextAreaElement>(null);

  const handleQuerySubmit = async () => {
    if (!queryText.trim()) return;
    
    const documentsToQuery = selectedDocuments.length > 0 ? selectedDocuments : documents.map(d => d.id);
    await executeQuery(queryText, documentsToQuery, filters);
    setQueryText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleQuerySubmit();
    }
  };

  const handleDocumentSelect = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const getQueryTypeIcon = (type: string) => {
    switch (type) {
      case 'multimodal': return <ImageIcon />;
      case 'code': return <CodeIcon />;
      case 'data': return <TableIcon />;
      default: return <SearchIcon />;
    }
  };

  const getResultTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return <ImageIcon className="text-blue-500" />;
      case 'table': return <TableIcon className="text-green-500" />;
      case 'code': return <CodeIcon className="text-purple-500" />;
      case 'chart': return <TrendingUpIcon className="text-orange-500" />;
      default: return <DocumentIcon className="text-gray-500" />;
    }
  };

  const renderQueryHistory = () => (
    <Box className="space-y-3">
      {queries.map((query) => (
        <Card key={query.id} className={`cursor-pointer transition-all ${
          selectedQuery?.id === query.id ? 'ring-2 ring-primary-500' : ''
        }`}>
          <CardContent className="p-4" onClick={() => selectQuery(query.id)}>
            <Box className="flex items-center justify-between mb-2">
              <Box className="flex items-center space-x-2">
                <Avatar className="bg-secondary-50 text-secondary-600 w-8 h-8">
                  {getQueryTypeIcon(query.type)}
                </Avatar>
                <Chip
                  label={query.status}
                  size="small"
                  className={`${
                    query.status === 'completed' ? 'bg-green-100 text-green-800' : 
                    query.status === 'processing' ? 'bg-orange-100 text-orange-800' : 
                    'bg-red-100 text-red-800'
                  }`}
                />
              </Box>
              <Typography variant="caption" className="text-gray-500">
                {query.timestamp.toLocaleString()}
              </Typography>
            </Box>
            <Typography variant="body2" className="font-medium mb-2">
              {query.text}
            </Typography>
            <Box className="flex items-center justify-between">
              <Typography variant="caption" className="text-gray-500">
                {query.results.length} results • {query.documents.length} documents
              </Typography>
              <Box className="flex items-center space-x-1">
                <IconButton size="small">
                  <StarBorderIcon />
                </IconButton>
                <IconButton size="small">
                  <ShareIcon />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  const renderQueryResults = () => {
    if (!selectedQuery) return null;

    return (
      <Box className="space-y-4">
        <Box className="flex items-center justify-between">
          <Typography variant="h6" className="font-semibold">
            Query Results ({selectedQuery.results.length})
          </Typography>
          <Box className="flex items-center space-x-2">
            <Button startIcon={<DownloadIcon />} size="small">
              Export
            </Button>
            <Button startIcon={<ShareIcon />} size="small">
              Share
            </Button>
          </Box>
        </Box>

        {selectedQuery.results.map((result) => (
          <Card key={result.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <Box className="flex items-start justify-between mb-3">
                <Box className="flex items-center space-x-3">
                  <Avatar className="bg-primary-50">
                    {getResultTypeIcon(result.type)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" className="font-medium">
                      {documents.find(d => d.id === result.documentId)?.title}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Page {result.position.page} • {result.position.section}
                    </Typography>
                  </Box>
                </Box>
                <Box className="flex items-center space-x-2">
                  <Chip
                    label={`${(result.relevanceScore * 100).toFixed(1)}%`}
                    size="small"
                    className="bg-primary-100 text-primary-800"
                  />
                  <IconButton size="small" onClick={() => navigate(`/documents/${result.documentId}`)}>
                    <VisibilityIcon />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" className="mb-2">
                {result.content}
              </Typography>

              <Typography variant="caption" className="text-gray-500 bg-gray-50 p-2 rounded">
                Context: {result.context}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  };

  return (
    <Box className="h-full">
      <Grid container spacing={3} className="h-full">
        {/* Left Panel - Query Input and Filters */}
        <Grid item xs={12} md={4}>
          <Box className="space-y-4">
            {/* Header */}
            <Box>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                Query Interface
              </Typography>
              <Typography variant="body1" className="text-gray-600">
                Search across your documents with advanced AI
              </Typography>
            </Box>

            {/* Query Input */}
            <Card>
              <CardContent className="p-4">
                <Box className="flex items-center space-x-2 mb-4">
                  <Tabs value={queryType} onChange={(e, v) => setQueryType(v)} variant="fullWidth">
                    <Tab label="Text" value="text" />
                    <Tab label="Multimodal" value="multimodal" />
                    <Tab label="Code" value="code" />
                    <Tab label="Data" value="data" />
                  </Tabs>
                </Box>

                <TextField
                  ref={queryInputRef}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Ask anything about your documents..."
                  value={queryText}
                  onChange={(e) => setQueryText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="mb-4"
                />

                <Box className="flex items-center justify-between">
                  <Box className="flex items-center space-x-2">
                    <IconButton size="small">
                      <MicIcon />
                    </IconButton>
                    <IconButton size="small">
                      <ImageIcon />
                    </IconButton>
                    <IconButton size="small">
                      <AttachFileIcon />
                    </IconButton>
                  </Box>
                  <Button
                    variant="contained"
                    startIcon={<SendIcon />}
                    onClick={handleQuerySubmit}
                    disabled={!queryText.trim() || loading}
                    className="bg-primary-600 hover:bg-primary-700"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </Button>
                </Box>

                {loading && <LinearProgress className="mt-2" />}
              </CardContent>
            </Card>

            {/* Document Selection */}
            <Card>
              <CardContent className="p-4">
                <Box className="flex items-center justify-between mb-3">
                  <Typography variant="h6" className="font-semibold">
                    Select Documents
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => setSelectedDocuments([])}
                    disabled={selectedDocuments.length === 0}
                  >
                    Clear All
                  </Button>
                </Box>

                <Box className="max-h-64 overflow-y-auto space-y-2">
                  {documents.map((doc) => (
                    <Box
                      key={doc.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedDocuments.includes(doc.id) 
                          ? 'bg-primary-50 border-primary-200' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      onClick={() => handleDocumentSelect(doc.id)}
                    >
                      <Box className="flex items-center space-x-2">
                        <Typography variant="body2" className="font-medium">
                          {doc.title}
                        </Typography>
                        <Chip
                          label={doc.status}
                          size="small"
                          className={`${
                            doc.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}
                        />
                      </Box>
                    </Box>
                  ))}
                </Box>

                <Typography variant="caption" className="text-gray-500 mt-2 block">
                  {selectedDocuments.length > 0 
                    ? `${selectedDocuments.length} document(s) selected` 
                    : 'All documents will be searched'}
                </Typography>
              </CardContent>
            </Card>

            {/* Advanced Filters */}
            <Accordion expanded={showFilters} onChange={(e, expanded) => setShowFilters(expanded)}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Advanced Filters</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="space-y-4">
                  <Box>
                    <Typography variant="body2" className="mb-2">
                      Relevance Threshold
                    </Typography>
                    <Slider
                      value={filters.relevanceThreshold}
                      onChange={(e, value) => setFilters({...filters, relevanceThreshold: value as number})}
                      min={0}
                      max={1}
                      step={0.1}
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) => `${(value * 100).toFixed(0)}%`}
                    />
                  </Box>

                  <Box>
                    <Typography variant="body2" className="mb-2">
                      Max Results
                    </Typography>
                    <Slider
                      value={filters.maxResults}
                      onChange={(e, value) => setFilters({...filters, maxResults: value as number})}
                      min={5}
                      max={50}
                      step={5}
                      valueLabelDisplay="auto"
                    />
                  </Box>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={filters.dateRange.enabled}
                        onChange={(e) => setFilters({
                          ...filters,
                          dateRange: { ...filters.dateRange, enabled: e.target.checked }
                        })}
                      />
                    }
                    label="Date Range Filter"
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Grid>

        {/* Right Panel - Results and History */}
        <Grid item xs={12} md={8}>
          <Box className="h-full">
            <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} className="mb-4">
              <Tab 
                label={
                  <Box className="flex items-center space-x-2">
                    <QueryStatsIcon />
                    <span>Results</span>
                    {selectedQuery && (
                      <Badge badgeContent={selectedQuery.results.length} color="primary" />
                    )}
                  </Box>
                } 
                value={0} 
              />
              <Tab 
                label={
                  <Box className="flex items-center space-x-2">
                    <HistoryIcon />
                    <span>History</span>
                    <Badge badgeContent={queries.length} color="secondary" />
                  </Box>
                } 
                value={1} 
              />
            </Tabs>

            <Box className="h-full overflow-y-auto">
              {tabValue === 0 && (
                <Box>
                  {selectedQuery ? (
                    renderQueryResults()
                  ) : (
                    <Box className="text-center py-12">
                      <AutoAwesomeIcon className="text-gray-300 text-6xl mb-4" />
                      <Typography variant="h6" className="text-gray-500 mb-2">
                        No query selected
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        Enter a query to start searching your documents
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}

              {tabValue === 1 && (
                <Box>
                  {queries.length > 0 ? (
                    renderQueryHistory()
                  ) : (
                    <Box className="text-center py-12">
                      <HistoryIcon className="text-gray-300 text-6xl mb-4" />
                      <Typography variant="h6" className="text-gray-500 mb-2">
                        No query history
                      </Typography>
                      <Typography variant="body2" className="text-gray-400">
                        Your previous queries will appear here
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QueryInterface; 