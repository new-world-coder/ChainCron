#!/bin/bash

# ChainCron Docker Deployment Script for Vercel
# This script builds and publishes the Docker image to Docker Hub

set -e

# Configuration
IMAGE_NAME="chaincron"
DOCKER_USERNAME="${DOCKER_USERNAME:-your-dockerhub-username}"
VERSION="${VERSION:-latest}"
FULL_IMAGE_NAME="${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}"

echo "🚀 ChainCron Docker Deployment Script"
echo "=================================="
echo "Image: ${FULL_IMAGE_NAME}"
echo ""

# Check if user is logged into Docker Hub
if ! docker info | grep -q "Username:"; then
    echo "❌ You need to log into Docker Hub first!"
    echo ""
    echo "Please run: docker login"
    echo "Then enter your Docker Hub username and password"
    echo ""
    exit 1
fi

echo "✅ Docker Hub authentication verified"
echo ""

# Build production image
echo "🔨 Building production Docker image..."
docker build -f Dockerfile.prod -t ${FULL_IMAGE_NAME} .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
else
    echo "❌ Docker build failed"
    exit 1
fi

echo ""

# Push to Docker Hub
echo "📤 Pushing image to Docker Hub..."
docker push ${FULL_IMAGE_NAME}

if [ $? -eq 0 ]; then
    echo "✅ Image pushed successfully to Docker Hub"
else
    echo "❌ Failed to push image to Docker Hub"
    exit 1
fi

echo ""
echo "🎉 Deployment Complete!"
echo "======================"
echo ""
echo "Your Docker image is now available at:"
echo "  https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}"
echo ""
echo "To deploy to Vercel:"
echo "1. Go to https://vercel.com/dashboard"
echo "2. Create a new project"
echo "3. Choose 'Deploy from Docker Hub'"
echo "4. Use image: ${FULL_IMAGE_NAME}"
echo ""
echo "Or use Vercel CLI:"
echo "  vercel --prod --docker-image=${FULL_IMAGE_NAME}"
echo ""
echo "Image details:"
echo "  Repository: ${DOCKER_USERNAME}/${IMAGE_NAME}"
echo "  Tag: ${VERSION}"
echo "  Size: $(docker images ${FULL_IMAGE_NAME} --format 'table {{.Size}}' | tail -1)"
echo ""
