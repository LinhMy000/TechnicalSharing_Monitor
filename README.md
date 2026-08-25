# Running TechnicalSharing_Monitor project in Local with containers using Podman

This guide explains how to run the services locally using Podman and access the Swagger UI.

## Project Structure

The project consists of 2 Java services:
1. **common-service** - Runs on port 8081 (host) → 8080 (container)
2. **demo-service** - Runs on port 8080 (host) → 8080 (container), depends on common-service

## Step 1: Using podman compose

You can use podman compose similarly to docker compose:

```bash
podman compose up -d
podman compose down

podman compose up -d --build
podman compose up -d --build demo-service
```


## Step 2: Accessing the Services

### Swagger UI
The demo-service has Swagger UI: `http://localhost:8080/swagger-ui.html`

### API Endpoints (demo-service)
Once running, you can test these endpoints:
- `GET http://localhost:8080/api1` - Calls common-service OK endpoint
- `GET http://localhost:8080/api2` - Calls common-service error endpoint
- `GET http://localhost:8080/api3` - Calls common-service random endpoint


## Run local without containers
You can also run the services locally without containers. Make sure you have Java and Node installed.

### Frontend
```bash
node ui/server.js
```
```bash
cd ui
node server.js
```

### Backend
```bash
cd common-service
gradlew bootRun
```
