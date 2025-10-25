# 🚀 ChainCron Docker Deployment Guide

## 📋 Prerequisites

1. **Docker Hub Account**
   - Sign up at https://hub.docker.com
   - Note your Docker Hub username

2. **Vercel Account**
   - Sign up at https://vercel.com
   - Install Vercel CLI: `npm i -g vercel`

## 🔧 Step-by-Step Deployment

### Step 1: Login to Docker Hub
```bash
docker login
# Enter your Docker Hub username and password
```

### Step 2: Set Your Docker Hub Username
```bash
export DOCKER_USERNAME="your-dockerhub-username"
# Replace "your-dockerhub-username" with your actual Docker Hub username
```

### Step 3: Build and Push Docker Image
```bash
# Option A: Use the automated script
./deploy-docker.sh

# Option B: Manual commands
docker build -f Dockerfile.prod -t $DOCKER_USERNAME/chaincron:latest .
docker push $DOCKER_USERNAME/chaincron:latest
```

### Step 4: Deploy to Vercel

#### Option A: Vercel Dashboard (Recommended)
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Choose "Deploy from Docker Hub"
4. Enter your Docker image: `your-dockerhub-username/chaincron:latest`
5. Configure environment variables if needed
6. Click "Deploy"

#### Option B: Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy using Docker image
vercel --prod --docker-image=$DOCKER_USERNAME/chaincron:latest
```

## 🐳 Docker Images Available

- **Development**: `chaincron:dev` (for local testing)
- **Production**: `your-username/chaincron:latest` (for Vercel deployment)

## 🔍 Verification

After deployment, verify your app is working:
1. Check Vercel dashboard for deployment status
2. Visit your Vercel URL
3. Test all pages:
   - `/` - Homepage
   - `/marketplace` - Workflow marketplace
   - `/multi-chain` - Multi-chain workflows
   - `/compose` - Workflow composer
   - `/nft-market` - NFT marketplace

## 🛠️ Management Commands

```bash
# Local Docker management
./docker-manage.sh start    # Start local container
./docker-manage.sh stop     # Stop local container
./docker-manage.sh logs     # View container logs

# Docker Hub management
docker images               # List local images
docker push $DOCKER_USERNAME/chaincron:latest  # Push to Docker Hub
docker pull $DOCKER_USERNAME/chaincron:latest  # Pull from Docker Hub
```

## 📊 Deployment Status

- ✅ **Local Development**: http://localhost:3000
- ✅ **Docker Local**: http://localhost:3001
- 🚀 **Vercel Production**: https://your-app.vercel.app

## 🎯 Features Deployed

All 29 prompts implemented and ready for production:
- ✅ Core Platform (Prompts 1-25)
- ✅ Multi-Chain Support (Prompt 26)
- ✅ Workflow Composability (Prompt 27)
- ✅ Social Features (Prompt 28)
- ✅ NFT Marketplace (Prompt 29)

## 🔧 Troubleshooting

### Common Issues:
1. **Docker login failed**: Make sure you're logged into Docker Hub
2. **Build failed**: Check Docker daemon is running
3. **Vercel deployment failed**: Verify Docker image exists in Docker Hub
4. **App not loading**: Check Vercel logs for errors

### Support:
- Docker Hub: https://hub.docker.com/support
- Vercel Docs: https://vercel.com/docs
- ChainCron GitHub: https://github.com/new-world-coder/ChainCron