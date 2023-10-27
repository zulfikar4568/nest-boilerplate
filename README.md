## Boilerplate of Nest Framework
### Architecture
- This is used Domain Driven Design
- Local Jwt Authentication (Passport JS)
- Authentication can be via cookie or headers
- Simple Role Based Enumeration
- Custom (Decorators, Exceptions, Guards, Middlewares, Responses, Filters, Interceptors)
- Authentication using HTTP Only, Secure, Same site
- OpenAPI using swagger
- Health Check
- Git Hooks (Husky) configured check commit formar, linter & formatter
- Redis cached
  
### Observability
- Trace is send to Grafana Tempo
- Metrics is send to Prometheus
- Log is send to Grafana Loki
- Monitoring Dashboard used Grafana

### Storage
- Used PostgreSQL
- ORM Prisma
- Redis

## Running dependencies using docker-compose
```bash
docker-compose up -d --build
```

## Database Migration
```bash
yarn && yarn db:migrate
yarn prisma:sync
yarn db:seed
```

## Running the app for development
```bash
yarn dev
# or
yarn watch
```

## Running the app for production
```bash
yarn build && yarn start:prod
```

## Test API
```bash
http://localhost:<your env port>/openapi
```