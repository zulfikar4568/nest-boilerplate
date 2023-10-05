```bash
docker run --name db-test -e POSTGRES_PASSWORD=test -e POSTGRES_USER=test -d -p 5432:5432 postgres
```