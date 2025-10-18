# Rust Backend Service

High-performance backend service built with Rust for maximum performance and safety.

## Features
- Async runtime with Tokio
- WebSocket support via Axum
- Redis integration
- JWT validation with Supabase
- Zero-cost abstractions
- Memory safety guarantees

## Prerequisites
- Rust 1.70+ (with Cargo)
- Redis
- PostgreSQL (via Supabase)

## Installation

```bash
cd backends/rust-service
cargo build
```

## Configuration

Create `.env` file:
```env
PORT=8081
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
RUST_LOG=info
```

## Running

```bash
# Development
cargo run

# Production build
cargo build --release
./target/release/rust-service
```

## API Endpoints

### Leaderboard
- `GET /api/v1/leaderboard/:competition_id` - Get current rankings
- `WS /ws/leaderboard/:competition_id` - Real-time updates

### Fitness Tracking
- `POST /api/v1/fitness/sync` - Sync fitness data
- `GET /api/v1/fitness/stats/:user_id` - Get user statistics

### Prize Distribution
- `POST /api/v1/prizes/calculate/:competition_id` - Calculate winners
- `POST /api/v1/prizes/distribute/:competition_id` - Distribute prizes

### Health
- `GET /health` - Health check

## Project Structure

```
src/
  main.rs              # Entry point
  config.rs            # Configuration
  models/
    mod.rs
    types.rs           # Data structures
  handlers/
    mod.rs
    leaderboard.rs     # Leaderboard handlers
    fitness.rs         # Fitness handlers
    websocket.rs       # WebSocket handlers
  services/
    mod.rs
    leaderboard.rs     # Business logic
    fitness.rs
    cache.rs           # Redis operations
  middleware/
    mod.rs
    auth.rs            # JWT validation
  utils/
    mod.rs
    logger.rs          # Logging
```

## WebSocket Protocol

Same as Go service - see main architecture doc.

## Testing

```bash
# Unit tests
cargo test

# With output
cargo test -- --nocapture

# Benchmarks
cargo bench
```

## Performance

Rust provides:
- Zero-cost abstractions
- Move semantics (no garbage collection)
- Fearless concurrency
- Memory safety without GC overhead

Expected performance: 100k+ requests/second on modern hardware.
