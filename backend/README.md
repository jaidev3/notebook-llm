# Notebook LLM Backend

FastAPI backend for the Notebook LLM document processing and querying system.

## Features

- FastAPI web framework
- Health check endpoints
- CORS middleware for frontend integration
- Environment-based configuration
- Virtual environment setup

## Prerequisites

- Python 3.8+
- pip

## Setup Instructions

### 1. Create and Activate Virtual Environment

```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
# Backend Configuration
DEBUG=True
HOST=0.0.0.0
PORT=8000

# CORS Configuration
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Database Configuration (for future use)
DATABASE_URL=postgresql://user:password@localhost/notebook_llm

# JWT Configuration (for future use)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=30

# File Upload Configuration
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=uploads
```

### 4. Run the Application

```bash
# Using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or using Python
python main.py
```

## API Endpoints

### Health Check Endpoints

- `GET /` - Root endpoint
- `GET /health` - Basic health check
- `GET /api/v1/health` - API health check with version info

### Example Health Check Response

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000000",
  "service": "notebook-llm-backend",
  "version": "1.0.0",
  "api_version": "v1"
}
```

## Development

### Project Structure

```
backend/
├── main.py              # FastAPI application
├── config.py            # Configuration settings
├── requirements.txt     # Python dependencies
├── venv/               # Virtual environment
└── README.md           # This file
```

### Adding New Dependencies

```bash
# Activate virtual environment
source venv/bin/activate

# Install new package
pip install package-name

# Update requirements.txt
pip freeze > requirements.txt
```

### Running in Development Mode

```bash
# With auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## API Documentation

Once the server is running, you can access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test API health endpoint
curl http://localhost:8000/api/v1/health
```

## Future Enhancements

- Database integration
- Authentication and authorization
- Document upload and processing
- Query processing endpoints
- File storage management
- Logging and monitoring 