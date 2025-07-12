import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { Document, Query, QueryResult } from '../types';

interface DocumentState {
  documents: Document[];
  selectedDocument: Document | null;
  queries: Query[];
  selectedQuery: Query | null;
  loading: boolean;
  error: string | null;
}

interface DocumentContextType extends DocumentState {
  uploadDocument: (file: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  updateDocument: (id: string, updates: Partial<Document>) => Promise<void>;
  selectDocument: (id: string | null) => void;
  executeQuery: (query: string, documentIds: string[], filters?: any) => Promise<void>;
  selectQuery: (id: string | null) => void;
  clearError: () => void;
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

type DocumentAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_DOCUMENTS'; payload: Document[] }
  | { type: 'ADD_DOCUMENT'; payload: Document }
  | { type: 'UPDATE_DOCUMENT'; payload: { id: string; updates: Partial<Document> } }
  | { type: 'DELETE_DOCUMENT'; payload: string }
  | { type: 'SELECT_DOCUMENT'; payload: Document | null }
  | { type: 'SET_QUERIES'; payload: Query[] }
  | { type: 'ADD_QUERY'; payload: Query }
  | { type: 'UPDATE_QUERY'; payload: { id: string; updates: Partial<Query> } }
  | { type: 'SELECT_QUERY'; payload: Query | null };

const documentReducer = (state: DocumentState, action: DocumentAction): DocumentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_DOCUMENTS':
      return { ...state, documents: action.payload };
    case 'ADD_DOCUMENT':
      return { ...state, documents: [...state.documents, action.payload] };
    case 'UPDATE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.map(doc =>
          doc.id === action.payload.id ? { ...doc, ...action.payload.updates } : doc
        ),
      };
    case 'DELETE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload),
        selectedDocument: state.selectedDocument?.id === action.payload ? null : state.selectedDocument,
      };
    case 'SELECT_DOCUMENT':
      return { ...state, selectedDocument: action.payload };
    case 'SET_QUERIES':
      return { ...state, queries: action.payload };
    case 'ADD_QUERY':
      return { ...state, queries: [...state.queries, action.payload] };
    case 'UPDATE_QUERY':
      return {
        ...state,
        queries: state.queries.map(query =>
          query.id === action.payload.id ? { ...query, ...action.payload.updates } : query
        ),
      };
    case 'SELECT_QUERY':
      return { ...state, selectedQuery: action.payload };
    default:
      return state;
  }
};

const initialState: DocumentState = {
  documents: [],
  selectedDocument: null,
  queries: [],
  selectedQuery: null,
  loading: false,
  error: null,
};

// Mock data for demonstration
const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Machine Learning Research Paper',
    filename: 'ml-research-2024.pdf',
    fileType: 'pdf',
    fileSize: 2500000,
    uploadDate: new Date('2024-01-15'),
    lastModified: new Date('2024-01-15'),
    status: 'ready',
    tags: ['machine-learning', 'research', 'ai'],
    collaborators: ['user1', 'user2'],
    metadata: {
      pageCount: 25,
      wordCount: 8500,
      imageCount: 12,
      tableCount: 5,
      author: 'Dr. Smith',
      keywords: ['neural networks', 'deep learning', 'computer vision'],
    },
    content: {
      text: 'This paper presents a comprehensive study of neural networks...',
      images: [
        {
          id: 'img1',
          url: '/api/images/img1.jpg',
          alt: 'Neural network architecture',
          caption: 'Figure 1: Proposed neural network architecture',
          position: { page: 3, x: 100, y: 200 },
          analysis: 'This diagram shows a convolutional neural network with multiple layers...',
        },
      ],
      tables: [
        {
          id: 'table1',
          headers: ['Model', 'Accuracy', 'Training Time'],
          rows: [
            ['ResNet-50', '94.2%', '2.5 hours'],
            ['VGG-16', '91.8%', '3.2 hours'],
          ],
          caption: 'Table 1: Model performance comparison',
          position: { page: 8, x: 50, y: 300 },
        },
      ],
      charts: [],
      codeBlocks: [],
      sections: [
        {
          id: 'section1',
          title: 'Introduction',
          level: 1,
          content: 'Machine learning has revolutionized...',
          startPage: 1,
          endPage: 2,
          subsections: [],
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Financial Analysis Report',
    filename: 'q4-financial-report.xlsx',
    fileType: 'excel',
    fileSize: 850000,
    uploadDate: new Date('2024-01-20'),
    lastModified: new Date('2024-01-22'),
    status: 'ready',
    tags: ['finance', 'quarterly', 'analysis'],
    collaborators: ['user3'],
    metadata: {
      wordCount: 3200,
      tableCount: 15,
      author: 'Finance Team',
    },
    content: {
      text: 'Q4 financial performance analysis...',
      images: [],
      tables: [
        {
          id: 'table2',
          headers: ['Quarter', 'Revenue', 'Profit', 'Growth'],
          rows: [
            ['Q1', '$2.5M', '$400K', '15%'],
            ['Q2', '$2.8M', '$450K', '18%'],
            ['Q3', '$3.1M', '$520K', '22%'],
            ['Q4', '$3.4M', '$580K', '25%'],
          ],
          caption: 'Quarterly financial performance',
          position: { page: 1, x: 0, y: 0 },
        },
      ],
      charts: [
        {
          id: 'chart1',
          type: 'line',
          title: 'Revenue Growth Trend',
          data: { quarters: ['Q1', 'Q2', 'Q3', 'Q4'], revenue: [2.5, 2.8, 3.1, 3.4] },
          position: { page: 1, x: 0, y: 200 },
        },
      ],
      codeBlocks: [],
      sections: [],
    },
  },
];

export const DocumentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, {
    ...initialState,
    documents: mockDocuments,
  });

  const uploadDocument = async (file: File): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate file upload and processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newDocument: Document = {
        id: Date.now().toString(),
        title: file.name.split('.')[0],
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadDate: new Date(),
        lastModified: new Date(),
        status: 'processing',
        tags: [],
        collaborators: [],
        metadata: {},
        content: {
          text: '',
          images: [],
          tables: [],
          charts: [],
          codeBlocks: [],
          sections: [],
        },
      };

      dispatch({ type: 'ADD_DOCUMENT', payload: newDocument });

      // Simulate processing completion
      setTimeout(() => {
        dispatch({
          type: 'UPDATE_DOCUMENT',
          payload: {
            id: newDocument.id,
            updates: { status: 'ready' },
          },
        });
      }, 3000);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to upload document' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const deleteDocument = async (id: string): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'DELETE_DOCUMENT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete document' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updateDocument = async (id: string, updates: Partial<Document>): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      dispatch({ type: 'UPDATE_DOCUMENT', payload: { id, updates } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update document' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectDocument = (id: string | null): void => {
    const document = id ? state.documents.find(doc => doc.id === id) || null : null;
    dispatch({ type: 'SELECT_DOCUMENT', payload: document });
  };

  const executeQuery = async (queryText: string, documentIds: string[], filters?: any): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // Simulate query execution
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newQuery: Query = {
        id: Date.now().toString(),
        text: queryText,
        timestamp: new Date(),
        userId: 'current-user',
        documents: documentIds,
        type: 'text',
        filters: filters || {},
        results: [
          {
            id: 'result1',
            documentId: documentIds[0] || '1',
            relevanceScore: 0.95,
            content: 'This section discusses the key findings of the research...',
            context: 'From the Introduction section of the document',
            position: { page: 1, section: 'Introduction' },
            type: 'text',
            metadata: {},
          },
        ],
        status: 'completed',
      };

      dispatch({ type: 'ADD_QUERY', payload: newQuery });
      dispatch({ type: 'SELECT_QUERY', payload: newQuery });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to execute query' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const selectQuery = (id: string | null): void => {
    const query = id ? state.queries.find(q => q.id === id) || null : null;
    dispatch({ type: 'SELECT_QUERY', payload: query });
  };

  const clearError = (): void => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value: DocumentContextType = {
    ...state,
    uploadDocument,
    deleteDocument,
    updateDocument,
    selectDocument,
    executeQuery,
    selectQuery,
    clearError,
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

export const useDocuments = (): DocumentContextType => {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error('useDocuments must be used within a DocumentProvider');
  }
  return context;
}; 