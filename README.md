## Boilerplate of Nest Framework
### Architecture
- This is used Domain Driven Design
- Local Jwt Authentication (Passport JS)
- Simple Role Based Enumeration
- Custom (Decorators, Exceptions, Guards, Middlewares, Responses, Filters, Interceptors)
- Authentication using HTTP Only, Secure, Same site
- OpenAPI using swagger
- Health Check
- Git Hooks (Husky) configured check commit formar, linter & formatter
  
### Observability
- Trace is send to Grafana Tempo
- Metrics is send to Prometheus
- Log is send to Grafana Loki
- Monitoring Dashboard used Grafana

### Storage
- Used PostgreSQL
- ORM Prisma

## Running Database using docker
```bash
docker run --rm --name db-test -e POSTGRES_PASSWORD=test -e POSTGRES_USER=test -d -p 5432:5432 postgres
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