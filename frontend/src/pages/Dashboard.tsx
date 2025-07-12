import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Button,
} from '@mui/material';
import {
  Upload as UploadIcon,
  Search as SearchIcon,
  TrendingUp as TrendingUpIcon,
  Description as DocumentIcon,
  QueryStats as QueryStatsIcon,
  AccessTime as AccessTimeIcon,
  People as PeopleIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useDocuments } from '../context/DocumentContext';
import { useAuth } from '../hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { documents, queries } = useDocuments();
  const { user } = useAuth();

  // Mock data for charts
  const activityData = [
    { name: 'Mon', documents: 4, queries: 12 },
    { name: 'Tue', documents: 3, queries: 8 },
    { name: 'Wed', documents: 7, queries: 15 },
    { name: 'Thu', documents: 5, queries: 10 },
    { name: 'Fri', documents: 8, queries: 20 },
    { name: 'Sat', documents: 2, queries: 5 },
    { name: 'Sun', documents: 1, queries: 3 },
  ];

  const documentTypes = [
    { name: 'PDF', value: 45, color: '#0ea5e9' },
    { name: 'Excel', value: 25, color: '#10b981' },
    { name: 'Word', value: 20, color: '#f59e0b' },
    { name: 'PowerPoint', value: 10, color: '#ef4444' },
  ];

  const recentDocuments = documents.slice(0, 3);
  const recentQueries = queries.slice(0, 3);

  const stats = [
    {
      title: 'Total Documents',
      value: documents.length,
      change: '+12%',
      icon: <DocumentIcon className="text-primary-600" />,
      color: 'primary',
    },
    {
      title: 'Queries This Week',
      value: queries.length,
      change: '+8%',
      icon: <QueryStatsIcon className="text-secondary-600" />,
      color: 'secondary',
    },
    {
      title: 'Processing Time',
      value: '2.3s',
      change: '-15%',
      icon: <AccessTimeIcon className="text-green-600" />,
      color: 'success',
    },
    {
      title: 'Collaborators',
      value: '12',
      change: '+3%',
      icon: <PeopleIcon className="text-orange-600" />,
      color: 'warning',
    },
  ];

  return (
    <Box className="space-y-6">
      {/* Header */}
      <Box className="flex justify-between items-center">
        <Box>
          <Typography variant="h4" className="font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Here's what's happening with your research assistant today.
          </Typography>
        </Box>
        <Box className="flex space-x-2">
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => navigate('/documents')}
            className="border-primary-300 text-primary-600 hover:bg-primary-50"
          >
            Upload Document
          </Button>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={() => navigate('/query')}
            className="bg-primary-600 hover:bg-primary-700"
          >
            Start Query
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card className="h-full">
              <CardContent className="p-6">
                <Box className="flex items-center justify-between mb-4">
                  <Box className="p-3 bg-gray-50 rounded-lg">
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.change}
                    size="small"
                    className={`${
                      stat.change.startsWith('+') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  />
                </Box>
                <Typography variant="h4" className="font-bold text-gray-900 mb-1">
                  {stat.value}
                </Typography>
                <Typography variant="body2" className="text-gray-600">
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                Activity Overview
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="documents" stroke="#0ea5e9" strokeWidth={2} />
                  <Line type="monotone" dataKey="queries" stroke="#d946ef" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent className="p-6">
              <Typography variant="h6" className="font-semibold mb-4">
                Document Types
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={documentTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {documentTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <Box className="mt-4 space-y-2">
                {documentTypes.map((type, index) => (
                  <Box key={index} className="flex items-center justify-between">
                    <Box className="flex items-center space-x-2">
                      <Box
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: type.color }}
                      />
                      <Typography variant="body2">{type.name}</Typography>
                    </Box>
                    <Typography variant="body2" className="font-semibold">
                      {type.value}%
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent className="p-6">
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold">
                  Recent Documents
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/documents')}
                  className="text-primary-600"
                >
                  View All
                </Button>
              </Box>
              <Box className="space-y-3">
                {recentDocuments.map((doc) => (
                  <Box key={doc.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <Avatar className="bg-primary-100 text-primary-600">
                      <DocumentIcon />
                    </Avatar>
                    <Box className="flex-1">
                      <Typography variant="body2" className="font-medium">
                        {doc.title}
                      </Typography>
                      <Typography variant="caption" className="text-gray-500">
                        {doc.uploadDate.toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box className="flex items-center space-x-2">
                      <Chip
                        label={doc.status}
                        size="small"
                        className={`${
                          doc.status === 'ready' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}
                      />
                      <IconButton size="small">
                        <MoreVertIcon />
                      </IconButton>
                    </Box>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent className="p-6">
              <Box className="flex items-center justify-between mb-4">
                <Typography variant="h6" className="font-semibold">
                  Recent Queries
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate('/query')}
                  className="text-primary-600"
                >
                  View All
                </Button>
              </Box>
              <Box className="space-y-3">
                {recentQueries.length > 0 ? (
                  recentQueries.map((query) => (
                    <Box key={query.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <Avatar className="bg-secondary-100 text-secondary-600">
                        <SearchIcon />
                      </Avatar>
                      <Box className="flex-1">
                        <Typography variant="body2" className="font-medium">
                          {query.text}
                        </Typography>
                        <Typography variant="caption" className="text-gray-500">
                          {query.timestamp.toLocaleDateString()}
                        </Typography>
                      </Box>
                      <Chip
                        label={query.status}
                        size="small"
                        className={`${
                          query.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}
                      />
                    </Box>
                  ))
                ) : (
                  <Box className="text-center py-8">
                    <SearchIcon className="text-gray-300 text-4xl mb-2" />
                    <Typography variant="body2" className="text-gray-500">
                      No queries yet. Start your first query!
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <Typography variant="h6" className="font-semibold mb-4">
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<UploadIcon />}
                onClick={() => navigate('/documents')}
                className="h-12"
              >
                Upload Document
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<SearchIcon />}
                onClick={() => navigate('/query')}
                className="h-12"
              >
                New Query
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<TrendingUpIcon />}
                className="h-12"
              >
                View Analytics
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<PeopleIcon />}
                className="h-12"
              >
                Invite Collaborators
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Dashboard; 