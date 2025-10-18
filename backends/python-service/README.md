# Python FastAPI Backend Service

Backend service built with FastAPI for rapid development and data analytics.

## Features
- Fast API framework with async support
- WebSocket support
- Redis integration
- JWT validation with Supabase
- Type hints with Pydantic
- Perfect for data analytics and ML integration

## Prerequisites
- Python 3.11+
- Redis
- PostgreSQL (via Supabase)

## Installation

```bash
cd backends/python-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Configuration

Create `.env` file:
```env
PORT=8082
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
LOG_LEVEL=INFO
```

## Running

```bash
# Development with auto-reload
uvicorn app.main:app --reload --port 8082

# Production
uvicorn app.main:app --host 0.0.0.0 --port 8082 --workers 4
```

## API Endpoints

### Leaderboard
- `GET /api/v1/leaderboard/{competition_id}` - Get current rankings
- `WS /ws/leaderboard/{competition_id}` - Real-time updates

### Fitness Tracking
- `POST /api/v1/fitness/sync` - Sync fitness data
- `GET /api/v1/fitness/stats/{user_id}` - Get user statistics
- `GET /api/v1/fitness/analytics/{competition_id}` - Advanced analytics

### Prize Distribution
- `POST /api/v1/prizes/calculate/{competition_id}` - Calculate winners
- `POST /api/v1/prizes/distribute/{competition_id}` - Distribute prizes

### Health
- `GET /health` - Health check
- `GET /metrics` - Prometheus metrics

## Project Structure

```
app/
  __init__.py
  main.py              # Entry point
  config.py            # Configuration
  models/
    __init__.py
    types.py           # Pydantic models
  routers/
    __init__.py
    leaderboard.py     # Leaderboard routes
    fitness.py         # Fitness routes
    websocket.py       # WebSocket routes
  services/
    __init__.py
    leaderboard.py     # Business logic
    fitness.py
    cache.py           # Redis operations
  middleware/
    __init__.py
    auth.py            # JWT validation
  utils/
    __init__.py
    logger.py          # Logging
```

## Testing

```bash
# Install dev dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# With coverage
pytest --cov=app
```

## Features

### Data Analytics
Python excels at data analytics. Add features like:
- Competition insights
- User performance trends
- Predictive modeling for prize distribution
- Anomaly detection in fitness data

### Machine Learning
Integrate ML models for:
- Fraud detection
- Performance prediction
- Personalized recommendations
