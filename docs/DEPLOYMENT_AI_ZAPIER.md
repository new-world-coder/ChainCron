# ChainCron AI-Zapier Deployment Guide

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository with the code
- Environment variables configured

### Steps

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Environment Variables**
   Set these in Vercel dashboard:
   ```
   NODE_ENV=production
   NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
   OPENAI_API_KEY=your-openai-api-key
   FLOW_NETWORK=testnet
   DATABASE_URL=your-database-url
   REDIS_URL=your-redis-url
   ```

3. **Custom Domain (Optional)**
   - Add custom domain in Vercel dashboard
   - Update `NEXT_PUBLIC_BASE_URL` to match your domain

### Docker Deployment

1. **Build Image**
   ```bash
   docker build -f Dockerfile.ai-zapier -t chaincron-ai-zapier .
   ```

2. **Run Container**
   ```bash
   docker run -d \
     --name chaincron-ai-zapier \
     -p 3000:3000 \
     -e NODE_ENV=production \
     -e OPENAI_API_KEY=your-key \
     chaincron-ai-zapier
   ```

3. **Docker Compose**
   ```bash
   # Production deployment
   docker-compose -f docker-compose.ai-zapier.yml up -d
   
   # Development
   docker-compose -f docker-compose.dev.yml up -d
   ```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `NEXT_PUBLIC_BASE_URL`: Public URL of your app
- `OPENAI_API_KEY`: OpenAI API key for AI features
- `FLOW_NETWORK`: Flow network (testnet/mainnet)
- `DATABASE_URL`: Database connection string
- `REDIS_URL`: Redis connection string

### API Endpoints
- `GET /api/health`: Health check
- `POST /api/workflows`: Create workflow from AI prompt
- `GET /api/workflows`: Get workflow templates
- `POST /api/workflows/execute`: Execute workflow
- `GET /api/workflows/execute`: Get execution status
- `POST /api/workflows/share`: Share workflow
- `GET /api/workflows/share`: Get shared workflow

## 📊 Monitoring

### Health Checks
- Application: `GET /api/health`
- Docker: Built-in health check
- Vercel: Automatic monitoring

### Logs
```bash
# Docker logs
docker logs chaincron-ai-zapier

# Docker Compose logs
docker-compose -f docker-compose.ai-zapier.yml logs -f
```

## 🧪 Testing

### Local Development
```bash
# Quick setup
./setup-dev.sh

# Manual setup
npm install
npm run dev
```

### Production Testing
```bash
# Test Docker build
docker build -f Dockerfile.ai-zapier -t test-build .

# Test Docker Compose
docker-compose -f docker-compose.ai-zapier.yml up --build
```

## 🔒 Security

### Environment Security
- Never commit API keys to repository
- Use Vercel environment variables
- Rotate keys regularly

### Docker Security
- Use non-root user in container
- Keep base images updated
- Scan images for vulnerabilities

## 📈 Performance

### Optimization
- Next.js automatic optimizations
- Docker multi-stage builds
- Redis caching
- CDN via Vercel

### Scaling
- Vercel automatic scaling
- Docker horizontal scaling
- Database connection pooling

## 🐛 Troubleshooting

### Common Issues
1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check environment variables

2. **Runtime Errors**
   - Check logs for specific errors
   - Verify API keys are correct
   - Check network connectivity

3. **Performance Issues**
   - Monitor resource usage
   - Check database connections
   - Optimize queries

### Support
- Check application logs
- Monitor health endpoints
- Review error tracking
