# Russify

Russify - our answer to Spotify
This music player created by students of `KUBGU FI42/2`

## Requirements
- **Java**: Version 17+.
- **Docker**: For starting PostgreSQL in container.
- **PostgreSQL**: Version 16+.

## Installing and start

### 1. Clone repository

```bash
git clone https://github.com/Bagdad1970/russify.git
cd Russify
```

### 2. Start database in Docker

```bash
docker-compose.yml -up -d
```

This should start PostgreSQL:
- **port**: `15532`,
- **user**: `admin`,
- **password**: `password`,
- **db_name**: `postgres`. 

## Functional
- **You can start server by using `RussifyApplication.java`**

### Server
- While App.java is running our server is available on `localhost:8080`
- You can see swagger page on url `localhost:8080/swagger-ui/index.html`