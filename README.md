# GitForms

**Zero-cost contact forms for your landing page** - powered by GitHub Issues.

Every time someone submits your contact form, you receive an automatic email notification. No monthly fees, no external database.

> **GitForms** = Free alternative to Typeform, Tally, and FormSpree

## Features

- ✅ **100% Configurable without code** (JSON files)
- ✅ Automatic email notifications for every submission
- ✅ Multilingual (IT/EN) with auto browser language detection — **fully implemented**
- ✅ Customizable styling (colors, borders, shadows)
- ✅ Customizable text (labels, messages, buttons)
- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ Tailwind CSS
- ✅ **Deploy anywhere** (Vercel, Netlify, Railway, Docker, AWS...)
- ✅ Completely free
- ✅ **Rate limiting** — max 3 submissions/min per IP (HTTP 429 + Retry-After)
- ✅ **Spam protection** — honeypot field + server-side spam scoring
- ✅ **Input sanitization** — strips markdown/HTML injection before GitHub API
- ✅ **Config-driven architecture** — add fields in `fields.json`, no code changes needed
- ✅ **react-hook-form + Zod validation** — same schema on frontend and backend
- ✅ **AI lead classification** — optional Claude Haiku integration (intent + urgency labels)
- ✅ **Test suite** — Vitest coverage for rate limit, sanitize, and API route

## How It Works

```
User fills form → Data saved to GitHub Issue → Email notification sent
```

## Quick Setup

```bash
# 1. Clone
git clone https://github.com/Luigigreco/gitforms.git
cd gitforms

# 2. Install
npm install

# 3. Configure
cp .env.example .env.local
# Edit .env.local with your GITHUB_TOKEN and GITHUB_REPO

# 4. Start
npm run dev
```

Open http://localhost:3000

## 🎨 Customization (ZERO Code!)

### 1. Change All Colors

**File:** `config/theme.json`

```json
{
  "colors": {
    "primary": {
      "DEFAULT": "#10b981",  // Green instead of blue
      "hover": "#059669",
      "ring": "#34d399"
    }
  }
}
```

**Popular colors:**
- Purple: `#8b5cf6`, `#7c3aed`, `#a78bfa`
- Orange: `#f97316`, `#ea580c`, `#fb923c`
- Pink: `#ec4899`, `#db2777`, `#f472b6`

### 2. Change All Text

**File:** `config/translations.json`

```json
{
  "it": {
    "title": "Richiedi Informazioni",  // Change "Contattaci"
    "fields": {
      "company": "Società"  // Change "Azienda" to "Società"
    },
    "buttons": {
      "submit": "Richiedi Contatto"  // Change button
    }
  }
}
```

### 3. Change Default Language

**File:** `.env.local`

```env
NEXT_PUBLIC_DEFAULT_LOCALE=it   # Force Italian
# or
NEXT_PUBLIC_DEFAULT_LOCALE=en   # Force English
# or remove for auto-detection
```

### 4. Add New Language (e.g., French)

**File:** `config/translations.json`

```json
{
  "it": { ... },
  "en": { ... },
  "fr": {
    "title": "Contactez-nous",
    "subtitle": "Remplissez le formulaire...",
    "fields": {
      "firstName": "Prénom",
      "lastName": "Nom",
      "email": "Email",
      "company": "Entreprise",
      "message": "Message"
    }
  }
}
```

Then update `src/app/translations.ts`:

```typescript
export type Locale = 'it' | 'en' | 'fr'
```

## 📁 Configuration Files

| File | What You Configure |
|------|-------------------|
| **`config/theme.json`** | Colors, borders, shadows, styling |
| **`config/translations.json`** | ALL text (title, fields, messages, buttons) |
| **`.env.local`** | GitHub token, repo, default language |

**Edit only these 3 files = complete customization!**

## Form Fields

Defined in `config/fields.json` — add or remove fields without touching code:

| Field | Type | Required |
|-------|------|----------|
| First Name | text | ✅ |
| Last Name | text | ✅ |
| Email | email | ✅ |
| Company | text | ❌ optional |
| Message | textarea | ✅ |

To add a new field, add an entry to `config/fields.json` → it appears automatically in the form.

## Security

| Feature | Implementation |
|---------|---------------|
| **Rate limiting** | 3 req/60s per IP — `src/lib/rateLimit.ts` |
| **Honeypot** | Hidden field catches bots silently |
| **Sanitization** | Strips markdown/HTML injection — `src/lib/sanitize.ts` |
| **Spam scoring** | Heuristic 0–100 score — `src/lib/spamScore.ts` |
| **AI classification** | Claude Haiku labels intent/urgency (optional) |

## Optional: AI Lead Classification

Set `ANTHROPIC_API_KEY` in `.env.local` to enable automatic GitHub Issue labels:
- `sales`, `support`, `partnership` — based on message intent
- `urgent` — based on urgency detection

Degrades gracefully if the key is absent. Cost: fractions of a cent per submission.

## Testing

```bash
npm test
```

Covers: rate limiter, sanitization, API route (valid/invalid/honeypot/rate-limit).

## Test

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mario",
    "lastName": "Rossi",
    "email": "mario@example.com",
    "company": "ACME",
    "message": "Ciao"
  }'
```

## ☁️ Launch in the cloud

Launch GitForms on Diploi in a few clicks:

[![launch with diploi button](https://diploi.com/launch-big.svg)](https://diploi.com/launch/Luigigreco/gitforms)

Once the project has been created, configure the deployment:

1. Open the deployment in Diploi.
2. Go to **Options > Next.js > Environment**.
3. Add the required environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (optional, `it` or `en`)
4. Save your changes and redeploy if needed.

After the deployment finishes, use the preview URL on the Diploi deployment page to test the live form.

For more information, visit [Diploi](https://diploi.com/)


## 🚀 Deploy Options

### 1. Vercel (Recommended) ⚡

**Easiest for Next.js** - 2 clicks, zero configuration.

```bash
# Install Vercel CLI (optional)
npm i -g vercel

# Deploy
vercel
```

**Or via Dashboard:**
1. Push to GitHub
2. Import on [vercel.com](https://vercel.com/new)
3. Add environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (optional)
4. Auto deploy!

**Free Tier:** Unlimited for personal projects

---

### 2. Netlify

**Great Vercel alternative** - 2 clicks, great free tier.

1. Push to GitHub
2. Import on [netlify.com](https://app.netlify.com/start)
3. Build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
4. Environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (optional)
5. Deploy!

**Free Tier:** 100GB bandwidth/month

---

### 3. Railway

**Fast deploy with included databases** - 3 clicks, good free tier.

1. Push to GitHub
2. Go to [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Add environment variables (Dashboard → Variables)
5. Railway auto-detects Next.js and deploys

**Free Tier:** $5 credit/month (~500h runtime)

---

### 4. Render.com

**Alternative with free tier** - Auto-sleep after inactivity.

1. Push to GitHub
2. New Web Service on [render.com](https://render.com)
3. Connect repository
4. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`

**Free Tier:** Unlimited (with auto-sleep)

---

### 5. Docker / Self-Hosted 🐳

**Full control** - Deploy on any VPS/cloud.

```bash
# Build
docker build -t gitforms .

# Run
docker run -p 3000:3000 \
  -e GITHUB_TOKEN=your_token \
  -e GITHUB_REPO=your_repo \
  gitforms
```

**With Docker Compose:**

```yaml
# docker-compose.yml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_REPO=${GITHUB_REPO}
      - NEXT_PUBLIC_DEFAULT_LOCALE=it
    restart: unless-stopped
```

```bash
docker-compose up -d
```

**Cost:** VPS from €5/month (DigitalOcean, Hetzner, Linode)

---

### 6. AWS Amplify

**Enterprise deployment** - Auto-scaling, global CDN.

1. Push to GitHub
2. AWS Console → Amplify → New App
3. Connect repository
4. Build settings (auto-detected):
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm install
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
5. Environment variables:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`

**Free Tier:** 1000 build minutes/month, 15GB storage

---

## 💰 Costs

| Platform | Free Tier | Paid Cost |
|----------|-----------|-----------|
| **GitHub** (storage) | ✅ Unlimited | €0 |
| **GitHub** (email) | ✅ Unlimited | €0 |
| **Vercel** | ✅ Unlimited (personal) | €20/month (team) |
| **Netlify** | ✅ 100GB bandwidth | €19/month (pro) |
| **Railway** | ✅ $5 credit/month | $5/month per $5 usage |
| **Render.com** | ✅ With auto-sleep | $7/month (always on) |
| **Docker VPS** | ❌ | €5-20/month |
| **AWS Amplify** | ✅ 1000 build min | Pay-as-you-go |

**Recommendation:** Vercel or Netlify for guaranteed €0/month.

---

## 📦 Deployment Comparison

| Feature | Vercel | Netlify | Railway | Render | Docker |
|---------|--------|---------|---------|--------|--------|
| **Setup Time** | 2 min | 2 min | 3 min | 5 min | 10 min |
| **Free Tier** | ✅ Best | ✅ Good | ✅ Limited | ✅ Auto-sleep | ❌ |
| **Auto Deploy** | ✅ | ✅ | ✅ | ✅ | ❌ Manual |
| **Custom Domain** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **SSL/HTTPS** | ✅ Auto | ✅ Auto | ✅ Auto | ✅ Auto | ⚙️ Manual |
| **Logs** | ✅ | ✅ | ✅ | ✅ | ⚙️ Manual |
| **Scaling** | ✅ Auto | ✅ Auto | ✅ Auto | ⚙️ Manual | ⚙️ Manual |

---

## Customization Examples

### B2B Corporate Landing Page
```json
// config/translations.json
{
  "it": {
    "title": "Richiedi una Demo",
    "subtitle": "Compila il form per una demo personalizzata",
    "buttons": { "submit": "Richiedi Demo" }
  }
}

// config/theme.json
{ "colors": { "primary": { "DEFAULT": "#1e3a8a" } } }  // Corporate blue
```

### E-commerce Landing Page
```json
// config/translations.json
{
  "it": {
    "title": "Hai Domande?",
    "fields": { "company": "Settore" },
    "buttons": { "submit": "Invia Richiesta" }
  }
}

// config/theme.json
{ "colors": { "primary": { "DEFAULT": "#dc2626" } } }  // Sales red
```

## Documentation

- **Deployment Guide:** See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed platform guides
- **Testing Guide:** See [TESTING.md](TESTING.md) for API testing
- **Monetization Ideas:** See [MONETIZATION.md](MONETIZATION.md) for revenue strategies
- **SEO Setup:** See [SETUP_DISCOVERABILITY.md](SETUP_DISCOVERABILITY.md) for marketing

## License

CC-BY-NC-SA-4.0 (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International)

This work is licensed under a Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.

**Key Terms:**
- ✅ **Attribution** - Credit must be given to Luigi Greco
- ❌ **NonCommercial** - No commercial use without permission
- ✅ **ShareAlike** - Derivatives must use the same license

See [LICENSE](LICENSE) file for full legal text.

## Repository

https://github.com/Luigigreco/gitforms

---

**Made with ❤️ by Luigi Greco** | [Star us on GitHub](https://github.com/Luigigreco/gitforms) ⭐
