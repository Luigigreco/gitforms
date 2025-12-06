# Deployment Guide

Guida completa al deployment del **Landing Page Contact Form** su diverse piattaforme.

## Indice

1. [Vercel (Recommended)](#1-vercel-recommended-)
2. [Netlify](#2-netlify)
3. [Railway](#3-railway)
4. [Render.com](#4-rendercom)
5. [Docker / Self-Hosted](#5-docker--self-hosted-)
6. [AWS Amplify](#6-aws-amplify)
7. [Troubleshooting](#troubleshooting)

---

## 1. Vercel (Recommended) ⚡

**Setup Time:** 2 minuti  
**Difficoltà:** ⭐ Facile  
**Free Tier:** Illimitato (progetti personali)

### Metodo A: CLI (Veloce)

```bash
# 1. Installa Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel

# 4. Aggiungi environment variables
vercel env add GITHUB_TOKEN
vercel env add GITHUB_REPO

# 5. Redeploy con le variabili
vercel --prod
```

### Metodo B: Dashboard (Punto e clicca)

1. Vai su [vercel.com/new](https://vercel.com/new)
2. Click **"Import Git Repository"**
3. Autorizza GitHub e seleziona il repository
4. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
5. **Environment Variables:** Click "Add"
   - `GITHUB_TOKEN` → il tuo token
   - `GITHUB_REPO` → `owner/repo-name`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` → `it` o `en` (opzionale)
6. Click **Deploy**

### Auto-Deploy

Ogni push su `main` → Deploy automatico ✅

### Custom Domain

1. Dashboard → Settings → Domains
2. Aggiungi il tuo dominio
3. Configura DNS (Vercel fornisce istruzioni)

---

## 2. Netlify

**Setup Time:** 3 minuti  
**Difficoltà:** ⭐ Facile  
**Free Tier:** 100GB bandwidth/mese

### Deployment

1. Vai su [app.netlify.com/start](https://app.netlify.com/start)
2. Click **"Import from Git"**
3. Autorizza GitHub e seleziona repository
4. **Build Settings:**
   - Base directory: *lascia vuoto*
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Environment Variables:** Click "Show advanced"
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (opzionale)
6. Click **Deploy site**

### Post-Deploy Configuration

Netlify richiede configurazione aggiuntiva per Next.js:

1. Installa il plugin Next.js Runtime:
   ```bash
   npm install --save @netlify/plugin-nextjs
   ```

2. Crea `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. Commit e push → redeploy automatico

---

## 3. Railway

**Setup Time:** 3 minuti  
**Difficoltà:** ⭐⭐ Medio  
**Free Tier:** $5 credit/mese (~500h)

### Deployment

1. Vai su [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Autorizza GitHub e seleziona repository
5. Railway **auto-rileva** Next.js e configura:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
6. Click **"Deploy"**

### Environment Variables

1. Dashboard → Variables tab
2. Aggiungi:
   ```
   GITHUB_TOKEN=ghp_xxxx...
   GITHUB_REPO=owner/repo-name
   NEXT_PUBLIC_DEFAULT_LOCALE=it
   ```
3. Click **"Redeploy"**

### Custom Domain

1. Settings → Domains
2. Aggiungi custom domain
3. Configura CNAME nel tuo DNS provider

---

## 4. Render.com

**Setup Time:** 5 minuti  
**Difficoltà:** ⭐⭐ Medio  
**Free Tier:** Illimitato (con auto-sleep dopo 15min inattività)

### Deployment

1. Vai su [render.com](https://render.com)
2. Click **"New +"** → **"Web Service"**
3. Connect repository
4. **Configure:**
   - Name: `lead-capture-system`
   - Environment: **Node**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: **Free**
5. **Environment Variables:**
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (opzionale)
   - `NODE_ENV` = `production`
6. Click **"Create Web Service"**

### ⚠️ Limitazioni Free Tier

- **Auto-sleep:** Il servizio entra in sleep dopo 15 minuti di inattività
- **Cold start:** Primo accesso dopo sleep = 30-60 secondi
- **Soluzione:** Upgrade a piano Starter ($7/mese) per rimuovere sleep

---

## 5. Docker / Self-Hosted 🐳

**Setup Time:** 10-15 minuti  
**Difficoltà:** ⭐⭐⭐ Avanzato  
**Costo:** VPS €5-20/mese

### Prerequisiti

- Docker installato sul server
- Accesso SSH al server
- Dominio configurato (opzionale)

### Metodo A: Docker Run

```bash
# 1. Clone repository sul server
git clone https://github.com/omega-suite-finance/lead-capture-system.git
cd lead-capture-system

# 2. Build image
docker build -t lead-capture-system .

# 3. Run container
docker run -d \
  --name lead-capture \
  -p 3000:3000 \
  -e GITHUB_TOKEN=ghp_xxxx \
  -e GITHUB_REPO=owner/repo-name \
  -e NEXT_PUBLIC_DEFAULT_LOCALE=it \
  --restart unless-stopped \
  lead-capture-system

# 4. Verifica
docker logs lead-capture
```

### Metodo B: Docker Compose (Recommended)

```bash
# 1. Clone repository
git clone https://github.com/omega-suite-finance/lead-capture-system.git
cd lead-capture-system

# 2. Crea .env file
cat > .env << EOF
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
GITHUB_REPO=owner/repo-name
NEXT_PUBLIC_DEFAULT_LOCALE=it
EOF

# 3. Start services
docker-compose up -d

# 4. Verifica
docker-compose logs -f
```

### NGINX Reverse Proxy (Produzione)

```nginx
# /etc/nginx/sites-available/lead-capture

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Abilita sito
sudo ln -s /etc/nginx/sites-available/lead-capture /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL con Let's Encrypt
sudo certbot --nginx -d your-domain.com
```

### Auto-Updates con Watchtower

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    # ... configurazione esistente ...

  watchtower:
    image: containrrr/watchtower
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600  # Check updates ogni ora
```

---

## 6. AWS Amplify

**Setup Time:** 10 minuti  
**Difficoltà:** ⭐⭐⭐ Avanzato  
**Free Tier:** 1000 build minuti/mese

### Deployment

1. AWS Console → **AWS Amplify**
2. Click **"New app"** → **"Host web app"**
3. Select **GitHub** e autorizza
4. Seleziona repository e branch (`main`)
5. **Build settings** (auto-detected):
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
6. **Environment Variables:**
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE`
   - `_LIVE_UPDATES` = `[{"pkg":"next","type":"npm","version":"latest"}]`
7. Click **"Save and deploy"**

### Custom Domain

1. Domain Management → Add domain
2. Segui wizard AWS per configurare DNS

---

## Troubleshooting

### Build Errors

**Error:** `Module not found: Can't resolve 'config/theme.json'`

**Fix:**
```bash
# Verifica che config/ sia nel repository
ls -la config/
git add config/
git commit -m "fix: add config files"
git push
```

---

### Environment Variables Non Caricate

**Sintomo:** Form non funziona, errori 500

**Fix:**
1. Verifica variabili nella dashboard della piattaforma
2. Variabili `NEXT_PUBLIC_*` richiedono **rebuild completo**
3. Redeploy dopo ogni modifica a variabili `NEXT_PUBLIC_*`

---

### Docker: Container Non Parte

**Sintomo:** `docker ps` non mostra container

**Debug:**
```bash
# Controlla logs
docker logs lead-capture

# Controlla se porta 3000 è occupata
lsof -i :3000

# Rebuild forzato
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

---

### CORS Errors

**Sintomo:** Form funziona in local ma non in produzione

**Fix:** Verifica che `GITHUB_REPO` sia corretto e che il token abbia i permessi giusti:
```bash
# Test token
curl -H "Authorization: token ghp_xxxx" \
  https://api.github.com/user
```

---

## Comparison Matrix

| Piattaforma | Setup | Free Tier | Auto-Deploy | SSL | Logs | Best For |
|-------------|-------|-----------|-------------|-----|------|----------|
| **Vercel** | ⚡ 2min | ✅ Unlimited | ✅ | ✅ | ✅ | **Prototipo veloce** |
| **Netlify** | ⚡ 3min | ✅ 100GB | ✅ | ✅ | ✅ | Alternative a Vercel |
| **Railway** | ⭐ 3min | ⚠️ $5 credit | ✅ | ✅ | ✅ | Startup con database |
| **Render** | ⭐ 5min | ⚠️ Auto-sleep | ✅ | ✅ | ✅ | Side projects |
| **Docker** | ⭐⭐⭐ 10min | ❌ VPS €5 | ❌ | ⚙️ Manual | ⚙️ | **Full control** |
| **AWS** | ⭐⭐⭐ 10min | ✅ 1000min | ✅ | ✅ | ✅ | **Enterprise** |

---

## Recommended Workflows

### Freelancer / Side Project
**→ Vercel Free Tier**
- Zero costi
- Setup 2 minuti
- Auto-deploy
- Custom domain incluso

### Agenzia / Cliente
**→ Vercel Pro ($20/mese)**
- Team collaboration
- Preview deployments
- Password protection
- Analytics

### Startup con Database
**→ Railway**
- App + Postgres + Redis
- Single dashboard
- Auto-scaling

### Enterprise
**→ AWS Amplify**
- Compliance (GDPR, SOC2)
- Global CDN
- Advanced monitoring
- SLA garantiti

### Self-Hosted / On-Premise
**→ Docker + VPS**
- Full control
- Custom infrastructure
- Air-gapped environments

---

## Next Steps

Dopo il deploy:

1. ✅ Testa il form con curl (vedi TESTING.md)
2. ✅ Configura custom domain
3. ✅ Setup monitoring (Sentry, LogRocket)
4. ✅ Abilita analytics (Plausible, Umami)
5. ✅ Backup repository settings

---

**Hai problemi?** Apri un issue su [GitHub](https://github.com/omega-suite-finance/lead-capture-system/issues)
