# System Architecture

## High-Level Flow

```
┌─────────────┐
│   Browser   │
│  (User)     │
└──────┬──────┘
       │ 1. Fill form
       ▼
┌─────────────────────┐
│  Next.js Frontend   │
│  (page.tsx)         │
│  - Auto-detect lang │
│  - Validate inputs  │
│  - Show loading     │
└──────┬──────────────┘
       │ 2. POST /api/contact
       ▼
┌─────────────────────┐
│  API Route          │
│  (route.ts)         │
│  - Validate data    │
│  - Check email      │
│  - Read GitHub env  │
└──────┬──────────────┘
       │ 3. Create Issue
       ▼
┌─────────────────────┐
│  GitHub API         │
│  POST /issues       │
│  - Store data       │
│  - Trigger email    │
└──────┬──────────────┘
       │ 4. Email notification
       ▼
┌─────────────────────┐
│  User's Email       │
│  (Automatic)        │
└─────────────────────┘
```

## Component Breakdown

### Frontend (`src/app/page.tsx`)

**Responsibilities:**
- Render contact form
- Detect browser language
- Client-side validation (HTML5)
- Loading states
- Success/error messages
- Form reset after success

**State Management:**
```typescript
const [loading, setLoading] = useState(false)  // Submit in progress
const [success, setSuccess] = useState(false)  // Form submitted
const [error, setError] = useState<string | null>(null)  // Error message
```

**Dependencies:**
- `useLanguage()` hook for translations
- Tailwind classes from `config/theme.json`

### Language Detection (`src/app/useLanguage.ts`)

**Logic:**
1. Check `NEXT_PUBLIC_DEFAULT_LOCALE` env var (manual override)
2. If not set, check `navigator.language`
3. Map browser lang to supported locale (it/en)
4. Default to 'en' for unsupported languages

**Example:**
```
navigator.language = 'it-IT' → locale = 'it'
navigator.language = 'en-US' → locale = 'en'
navigator.language = 'fr-FR' → locale = 'en' (default)
```

### Translations (`src/app/translations.ts`)

**Purpose:** Load text from JSON and provide type-safe access

**Type Safety:**
```typescript
export type Locale = 'it' | 'en'
type Translations = typeof translationsData
```

This ensures:
- Only valid locales can be used
- All translation keys exist
- Autocomplete in IDE

### API Endpoint (`src/app/api/contact/route.ts`)

**Validation Steps:**
1. Check all required fields present
2. Validate email format with regex
3. Check GitHub config exists
4. Verify repo format (owner/repo)

**GitHub Integration:**
```typescript
POST https://api.github.com/repos/{owner}/{repo}/issues
Headers:
  - Authorization: Bearer {GITHUB_TOKEN}
  - Accept: application/vnd.github+json
Body:
  - title: "📧 {name} - {company}"
  - body: Markdown table with all data
  - labels: ["contatto"]
```

**Response:**
```json
// Success
{ "success": true, "message": "Grazie! Ti contatteremo a breve." }

// Error
{ "error": "Email non valida" }
```

## Configuration System

### Theme System

**File:** `config/theme.json` → **Loaded by:** `tailwind.config.js`

**Flow:**
```
config/theme.json → tailwind.config.js → CSS classes → page.tsx
```

**Example:**
```json
// theme.json
{ "colors": { "primary": { "DEFAULT": "#2563eb" } } }

// Generates Tailwind class:
.bg-primary { background-color: #2563eb; }

// Used in component:
<button className="bg-primary hover:bg-primary-hover">
```

### Translation System

**File:** `config/translations.json` → **Loaded by:** `src/app/translations.ts`

**Flow:**
```
config/translations.json → translations.ts → useLanguage() → page.tsx
```

**Example:**
```json
// translations.json
{ "it": { "title": "Contattaci" } }

// Component:
const { t } = useLanguage()
<h1>{t.title}</h1>  // "Contattaci"
```

## Data Flow

### Form Submission Flow

```typescript
1. User clicks "Invia Messaggio"
   ↓
2. handleSubmit(e)
   - e.preventDefault()
   - setLoading(true)
   ↓
3. Collect FormData
   - firstName, lastName, email, company, message
   ↓
4. POST /api/contact
   - Headers: Content-Type: application/json
   - Body: JSON.stringify(data)
   ↓
5. API validates
   - Required fields?
   - Email format?
   - GitHub config?
   ↓
6. Create GitHub Issue
   - POST to GitHub API
   - Store contact data
   ↓
7. Response
   Success: { success: true, message: "..." }
   Error: { error: "..." }
   ↓
8. Update UI
   - setSuccess(true) OR setError(message)
   - setLoading(false)
   - Reset form if success
```

## Security Considerations

### Environment Variables

- `GITHUB_TOKEN`: **Never** exposed to client
- Only used in API route (server-side)
- Required permission: `repo` scope only

### Client-Side Validation

- HTML5 `required` attributes
- Type validation (`type="email"`)
- Prevents empty submissions

### Server-Side Validation

- All fields checked again on server
- Email regex validation
- Protection against malformed requests

### Rate Limiting

- None currently (relies on Vercel/GitHub limits)
- Future: Add rate limiting middleware

## Error Handling

### Client Errors (400)
- Missing required fields
- Invalid email format

### Server Errors (500)
- Missing GitHub config
- GitHub API failure
- Network errors

### Error Display
```tsx
{error && (
  <div className="bg-error-bg border-error-border">
    <p className="text-error-text">✗ Errore: {error}</p>
  </div>
)}
```

## Performance Optimizations

### Client-Side
- Form validation before API call (instant feedback)
- Loading states (no double submissions)
- Form reset after success (ready for next lead)

### Server-Side
- Single GitHub API call per submission
- No database queries
- Minimal processing

### Bundle Size
- Next.js App Router (automatic code splitting)
- Tailwind CSS (purged unused styles)
- Minimal dependencies

## Deployment Architecture

### Recommended: Vercel

```
GitHub Repo → Vercel
  ↓           ↓
  Auto Deploy ← Push to main
  ↓
  Environment Variables:
  - GITHUB_TOKEN
  - GITHUB_REPO
  - NEXT_PUBLIC_DEFAULT_LOCALE
```

### Alternative: Self-hosted

```bash
npm run build
npm start
# Requires Node.js server
# Set environment variables
```

## Scaling Considerations

### Current Limits
- GitHub API: 5,000 requests/hour (authenticated)
- GitHub Issues: Unlimited
- Vercel Free: 100GB bandwidth/month

### If scaling needed:
1. Add Redis cache for rate limiting
2. Queue system for bulk submissions
3. Webhook instead of polling
4. Dedicated database (still free: Supabase/PlanetScale)

## Extension Points

### Easy to Add
- New language (add to `translations.json`)
- New color scheme (edit `theme.json`)
- Custom success message

### Moderate Complexity
- New form field (update form + API + translations)
- Spam protection (add Cloudflare Turnstile)
- Webhook integration (add to API route)

### Advanced
- Multi-step form
- File uploads
- Admin dashboard
- Analytics
