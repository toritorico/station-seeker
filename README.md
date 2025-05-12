# Train Station Search Application

A Vue.js application for searching train stations, featuring a touchscreen-style interface optimized for kiosk use.

## Features

- Real-time station search with intelligent filtering
- Touchscreen keyboard interface
- Visual highlighting of valid next characters
- Recent searches history
- Responsive design for different screen sizes
- Error handling and cacheing protecting from unreliable connection

## Technologies Used

- Vue 3 with Composition API
- TypeScript for type safety
- Vite for fast development
- Trie data structure for efficient station filtering

## Running with Docker

This application is containerized with Docker for easy setup and deployment.

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/) (optional but recommended)

### Environment Configuration (Required)

Before running the application, you must set up environment variables:

1. Copy the example environment file to create your own:

```bash
cp .env.example .env
```

2. Edit the `.env` file to configure your environment variables:
   - `VITE_API_URL`: URL to fetch station data from

The environment variables are required for both local development and Docker deployment.

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository
2. Navigate to the project directory
3. Run the application:

```bash
docker-compose up -d
```

4. Access the application at http://localhost
5. To stop the application:

```bash
docker-compose down
```

### Option 2: Using Docker directly

1. Build the Docker image:

```bash
docker build -t station-search .
```

2. Run the container:

```bash
docker run -d -p 80:80 --name station-search-app station-search
```

3. Access the application at http://localhost
4. To stop the container:

```bash
docker stop station-search-app
docker rm station-search-app
```

## Development Setup

If you prefer to run the application without Docker for development:

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```
