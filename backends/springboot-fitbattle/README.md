# Spring Boot FitBattle Backend

Java Spring Boot MVC implementation of the FitBattle API.

## Run locally

```bash
cp .env.example .env
mvn spring-boot:run
```

## Test

```bash
mvn test
mvn package
```

## Docker

```bash
docker build -t springboot-fitbattle .
docker run --env-file .env -p 8084:8084 springboot-fitbattle
```

## API

- `GET /health`
- `GET /api/v1/health`
- `GET /api/v1/user/stats`
- `POST /api/v1/health/steps`
- `GET /api/v1/competitions`
- `GET /api/v1/competitions/{id}/leaderboard`
- `GET /api/v1/leaderboard/global`
- `GET /api/v1/notifications`

Auth uses `Authorization: Bearer <supabase-jwt>`.
