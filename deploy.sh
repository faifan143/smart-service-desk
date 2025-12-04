#!/bin/bash

# Smart Service Desk Backend - Quick Deploy Script
# Usage: ./deploy.sh

set -e

echo "🚀 Starting deployment..."

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create a .env file based on .env.example"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    echo "📦 Please install Docker first: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed (try both new and old syntax)
if command -v docker compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
else
    echo "❌ Error: Docker Compose is not installed!"
    echo "📦 Please install Docker Compose first"
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
$DOCKER_COMPOSE_CMD down 2>/dev/null || true

# Build and start containers
echo "🔨 Building Docker image..."
# Try with --no-cache, fallback without if it fails
$DOCKER_COMPOSE_CMD build --no-cache 2>/dev/null || $DOCKER_COMPOSE_CMD build

echo "🚀 Starting containers..."
$DOCKER_COMPOSE_CMD up -d

# Wait for health check
echo "⏳ Waiting for application to start..."
sleep 5

# Check if container is running
if $DOCKER_COMPOSE_CMD ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container status:"
    $DOCKER_COMPOSE_CMD ps
    echo ""
    echo "📝 View logs with: $DOCKER_COMPOSE_CMD logs -f"
    echo "🌐 Application should be available at: http://localhost:18473"
    echo "💚 Health check: http://localhost:18473/health"
else
    echo "❌ Deployment failed! Check logs:"
    $DOCKER_COMPOSE_CMD logs
    exit 1
fi

