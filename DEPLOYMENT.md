# Deployment Guide

Complete guide for deploying the **Landing Page Contact Form** on various platforms.

---

## 1. Vercel (Recommended) ⚡

**Setup Time:** 2 minutes  
**Difficulty:** ⭐ Easy  
**Free Tier:** Unlimited (personal projects)

### Via CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Via Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import GitHub repository
3. Configure environment variables
4. Deploy

### Environment Variables
```env
GITHUB_TOKEN=your_github_token
GITHUB_REPO_OWNER=your_username
GITHUB_REPO_NAME=your_repo
```

**Advantages:**
- Auto-deploy on every push to `main`
- Built-in CDN (99.99% uptime)
- Automatic HTTPS certificate
- Edge Functions optimization

---

## 2. Netlify 🎯

**Setup Time:** 3 minutes  
**Difficulty:** ⭐ Easy  
**Free Tier:** 100GB bandwidth/month

### Via CLI
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod
```

### Via Dashboard
1. Go to [app.netlify.com](https://app.netlify.com)
2. **New site from Git**
3. Connect GitHub repository
4. **Build command:** `npm run build`
5. **Publish directory:** `.next`
6. Add environment variables

### Custom `netlify.toml` (Optional)
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Advantages:**
- Instant rollback
- Built-in forms (alternative to GitHub Issues)
- Split testing
- Serverless functions

---

## 3. Railway 🚂

**Setup Time:** 5 minutes  
**Difficulty:** ⭐⭐ Medium  
**Free Tier:** $5 credit/month (500 hours)

### Via CLI
```bash
npm i -g @railway/cli
railway login
railway init
railway up
```

### Via Dashboard
1. Go to [railway.app](https://railway.app)
2. **New Project** → **Deploy from GitHub**
3. Select repository
4. Railway auto-detects Next.js
5. Add environment variables

### Custom Configuration
Create `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**Advantages:**
- Database integration (Postgres, MySQL, Redis)
- Private networking
- Container-based (more control)
- Usage monitoring

---

## 4. Render 🔷

**Setup Time:** 5 minutes  
**Difficulty:** ⭐⭐ Medium  
**Free Tier:** 750 hours/month (static sites unlimited)

### Via Dashboard
1. Go to [render.com](https://render.com)
2. **New** → **Static Site** (or **Web Service** for SSR)
3. Connect GitHub repository
4. **Build Command:** `npm run build`
5. **Publish Directory:** `out` (for static) or keep empty (for SSR)
6. Add environment variables

### For Static Export
Modify `next.config.js`:
```javascript
module.exports = {
  output: 'export',
  images: {
    unoptimized: true
  }
}
```

Then:
```bash
npm run build
# Generates /out folder
```

**Advantages:**
- Free SSL certificates
- Custom domains
- Background jobs
- Preview environments

---

## 5. Docker 🐳

**Setup Time:** 10 minutes  
**Difficulty:** ⭐⭐⭐ Advanced  
**Cost:** Depends on hosting provider

### Dockerfile
```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_REPO_OWNER=${GITHUB_REPO_OWNER}
      - GITHUB_REPO_NAME=${GITHUB_REPO_NAME}
    restart: unless-stopped
```

### Commands
```bash
# Build image
docker build -t gitforms .

# Run container
docker run -p 3000:3000 --env-file .env gitforms

# With docker-compose
docker-compose up -d
```

**Advantages:**
- Total portability
- Consistent environments
- Easy scaling
- Deployable anywhere (AWS, GCP, Azure, DigitalOcean)

---

## 6. AWS Amplify ☁️

**Setup Time:** 7 minutes  
**Difficulty:** ⭐⭐⭐ Advanced  
**Free Tier:** 1000 build minutes/month, 15GB storage

### Via Console
1. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
2. **New app** → **Host web app**
3. Connect GitHub repository
4. **Build settings** (auto-detected for Next.js)
5. Add environment variables
6. Deploy

### amplify.yml (Auto-generated)
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Advantages:**
- AWS infrastructure integration
- CDN via CloudFront
- Custom domain with Route 53
- Branch-based deployments

---

## 🔧 Troubleshooting

### Error: "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Error: "GITHUB_TOKEN not found"
Check that environment variables are correctly configured:
```bash
echo $GITHUB_TOKEN  # Should not be empty
```

### Build failing on deployment platform
1. Check Node.js version (18+ required)
2. Verify all environment variables are set
3. Check build logs for specific error
4. Ensure `npm run build` works locally

### Form not sending Issues
1. Verify GitHub token has `repo` scope
2. Check `GITHUB_REPO_OWNER` and `GITHUB_REPO_NAME` are correct
3. Ensure Issues are enabled in repository settings
4. Check browser console for errors

---

## 📊 Platform Comparison

| Platform | Difficulty | Free Tier | Best For |
|----------|-----------|-----------|----------|
| **Vercel** | ⭐ | Unlimited | Quick deployment, Next.js projects |
| **Netlify** | ⭐ | 100GB/month | Static sites, forms |
| **Railway** | ⭐⭐ | $5 credit | Full-stack apps with databases |
| **Render** | ⭐⭐ | 750h/month | Static + dynamic projects |
| **Docker** | ⭐⭐⭐ | - | Total control, portability |
| **AWS Amplify** | ⭐⭐⭐ | 1000 min/month | AWS ecosystem integration |

---

## 🚀 Recommended Workflow

1. **Development:** Local with `npm run dev`
2. **Staging:** Vercel preview deployments (automatic)
3. **Production:** Vercel main branch (automatic)
4. **Monitoring:** Vercel Analytics (built-in)

---

## 📚 Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Docker Best Practices for Next.js](https://nextjs.org/docs/deployment#docker-image)
- [GitHub Issues API](https://docs.github.com/en/rest/issues)

---

**Need help?** Open an issue on [GitHub](https://github.com/Luigigreco/gitforms/issues)