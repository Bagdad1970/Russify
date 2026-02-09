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
git clone https://github.com/Bagdad1970/MusicPlayer.git
cd MusicPlayer
```

### 2. Start database in Docker

```bash
docker-compose.yml -up
```

This should start PostgreSQL on port 15532 with user `admin`, password `password` and db_name `postgres`. 

## Functional
Now u can only start migrations by using `App.java`