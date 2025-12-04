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

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    echo "📦 Please install Docker Compose first"
    exit 1
fi

echo "✅ Docker and Docker Compose found"

# Stop existing containers if running
echo "🛑 Stopping existing containers..."
docker compose down 2>/dev/null || true

# Build and start containers
echo "🔨 Building Docker image..."
docker compose build --no-cache

echo "🚀 Starting containers..."
docker compose up -d

# Wait for health check
echo "⏳ Waiting for application to start..."
sleep 5

# Check if container is running
if docker compose ps | grep -q "Up"; then
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Container status:"
    docker compose ps
    echo ""
    echo "📝 View logs with: docker compose logs -f"
    echo "🌐 Application should be available at: http://localhost:18473"
    echo "💚 Health check: http://localhost:18473/health"
else
    echo "❌ Deployment failed! Check logs:"
    docker compose logs
    exit 1
fi

