#!/bin/bash

# ChainCron AI-Zapier Development Setup Script
# This script sets up the development environment for ChainCron AI-Zapier features

set -e

echo "🚀 Setting up ChainCron AI-Zapier Development Environment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p data logs ssl

# Create environment file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local file..."
    cat > .env.local << EOF
# ChainCron AI-Zapier Environment Variables
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# OpenAI API Key (optional for development)
OPENAI_API_KEY=mock-key-for-dev

# Flow Network Configuration
FLOW_NETWORK=testnet
FLOW_ACCESS_NODE_URL=http://localhost:3569

# Database Configuration
DATABASE_URL=sqlite://./data/chaincron-dev.db

# Redis Configuration
REDIS_URL=redis://localhost:6379

# API Keys (add your real keys here)
# OPENAI_API_KEY=your-openai-api-key
# FLOW_PRIVATE_KEY=your-flow-private-key
EOF
    echo "✅ Created .env.local file with default values"
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building the application..."
npm run build

# Start development environment
echo "🐳 Starting development environment..."
docker-compose -f docker-compose.dev.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
echo "🔍 Checking service status..."
if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "✅ ChainCron AI-Zapier is running at http://localhost:3000"
else
    echo "⚠️  ChainCron AI-Zapier might still be starting up..."
fi

if redis-cli -h localhost -p 6379 ping > /dev/null 2>&1; then
    echo "✅ Redis is running on port 6379"
else
    echo "⚠️  Redis might still be starting up..."
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📋 Available commands:"
echo "  • View logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "  • Stop services: docker-compose -f docker-compose.dev.yml down"
echo "  • Restart services: docker-compose -f docker-compose.dev.yml restart"
echo "  • Run tests: npm test"
echo ""
echo "🌐 Access the application:"
echo "  • Main app: http://localhost:3000"
echo "  • AI-Zapier: http://localhost:3000/ai-zapier"
echo "  • API docs: http://localhost:3000/api"
echo ""
echo "🔧 Development tips:"
echo "  • The app will hot-reload when you make changes"
echo "  • Check logs for any errors: docker-compose -f docker-compose.dev.yml logs chaincron-dev"
echo "  • To add testnet support: docker-compose -f docker-compose.dev.yml --profile testnet up -d"
echo ""
