#!/bin/bash

# ChainCron Docker Management Script

case "$1" in
    "start")
        echo "🚀 Starting ChainCron Docker container..."
        docker run -d -p 3001:3000 --name chaincron-dev chaincron:dev
        echo "✅ ChainCron is running at http://localhost:3001"
        ;;
    "stop")
        echo "🛑 Stopping ChainCron Docker container..."
        docker stop chaincron-dev
        docker rm chaincron-dev
        echo "✅ ChainCron stopped"
        ;;
    "restart")
        echo "🔄 Restarting ChainCron Docker container..."
        docker stop chaincron-dev 2>/dev/null || true
        docker rm chaincron-dev 2>/dev/null || true
        docker run -d -p 3001:3000 --name chaincron-dev chaincron:dev
        echo "✅ ChainCron restarted at http://localhost:3001"
        ;;
    "build")
        echo "🔨 Building ChainCron Docker image..."
        docker build -f Dockerfile.dev -t chaincron:dev .
        echo "✅ Docker image built successfully"
        ;;
    "logs")
        echo "📋 ChainCron container logs:"
        docker logs chaincron-dev
        ;;
    "status")
        echo "📊 ChainCron container status:"
        docker ps | grep chaincron-dev || echo "❌ Container not running"
        ;;
    *)
        echo "ChainCron Docker Management Script"
        echo ""
        echo "Usage: $0 {start|stop|restart|build|logs|status}"
        echo ""
        echo "Commands:"
        echo "  start   - Start the ChainCron container"
        echo "  stop    - Stop and remove the ChainCron container"
        echo "  restart - Restart the ChainCron container"
        echo "  build   - Build the Docker image"
        echo "  logs    - Show container logs"
        echo "  status  - Show container status"
        echo ""
        echo "Access ChainCron at: http://localhost:3001"
        ;;
esac
