// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark';
  language: string;
  notifications: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Document Types
export interface Document {
  id: string;
  title: string;
  filename: string;
  fileType: string;
  fileSize: number;
  uploadDate: Date;
  lastModified: Date;
  status: 'processing' | 'ready' | 'error';
  metadata: DocumentMetadata;
  content: DocumentContent;
  tags: string[];
  collaborators: string[];
}

export interface DocumentMetadata {
  pageCount?: number;
  wordCount?: number;
  imageCount?: number;
  tableCount?: number;
  codeBlockCount?: number;
  language?: string;
  author?: string;
  createdAt?: Date;
  subject?: string;
  keywords?: string[];
}

export interface DocumentContent {
  text: string;
  images: ImageContent[];
  tables: TableContent[];
  charts: ChartContent[];
  codeBlocks: CodeBlockContent[];
  sections: DocumentSection[];
}

export interface ImageContent {
  id: string;
  url: string;
  alt: string;
  caption?: string;
  position: { page: number; x: number; y: number };
  analysis?: string;
}

export interface TableContent {
  id: string;
  headers: string[];
  rows: string[][];
  caption?: string;
  position: { page: number; x: number; y: number };
  analysis?: string;
}

export interface ChartContent {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'other';
  data: Record<string, unknown>;
  title?: string;
  position: { page: number; x: number; y: number };
  analysis?: string;
}

export interface CodeBlockContent {
  id: string;
  language: string;
  code: string;
  line_numbers?: boolean;
  position: { page: number; x: number; y: number };
}

export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  content: string;
  startPage: number;
  endPage: number;
  subsections: DocumentSection[];
}

// Query and Search Types
export interface Query {
  id: string;
  text: string;
  timestamp: Date;
  userId: string;
  documents: string[];
  type: 'text' | 'multimodal' | 'code' | 'data';
  filters: QueryFilters;
  results: QueryResult[];
  status: 'pending' | 'processing' | 'completed' | 'error';
}

export interface QueryFilters {
  dateRange?: { start: Date; end: Date };
  documentTypes?: string[];
  tags?: string[];
  authors?: string[];
  sections?: string[];
}

export interface QueryResult {
  id: string;
  documentId: string;
  relevanceScore: number;
  content: string;
  context: string;
  position: ResultPosition;
  type: 'text' | 'image' | 'table' | 'chart' | 'code';
  metadata: Record<string, unknown>;
}

export interface ResultPosition {
  page: number;
  section?: string;
  paragraph?: number;
  coordinates?: { x: number; y: number; width: number; height: number };
}

// Export and Integration Types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html' | 'markdown' | 'json';
  includeImages: boolean;
  includeTables: boolean;
  includeMetadata: boolean;
  sections?: string[];
}

export interface Integration {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'export';
  config: Record<string, unknown>;
  enabled: boolean;
}

// Chat and Collaboration Types
export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'query' | 'result' | 'system';
  documentId?: string;
  queryId?: string;
}

export interface Collaboration {
  id: string;
  documentId: string;
  participants: User[];
  chatMessages: ChatMessage[];
  activeUsers: string[];
  permissions: { [userId: string]: 'read' | 'write' | 'admin' };
}

// UI State Types
export interface UIState {
  sidebarOpen: boolean;
  activeView: 'dashboard' | 'documents' | 'query' | 'settings';
  selectedDocument: string | null;
  selectedQuery: string | null;
  loading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
} 