# Lead Capture System - Project Context

**For AI Assistants: This file provides complete context about this project.**

## What This Is

A **zero-cost landing page contact form** that uses GitHub Issues as a free database and sends automatic email notifications.

## Purpose

Help businesses capture leads from landing pages without paying for:
- Database services (MongoDB, PostgreSQL, etc.)
- Email notification services (SendGrid, Mailgun, etc.)
- Backend hosting for API

## Core Value Proposition

1. **€0/month** - Completely free to run
2. **5-minute setup** - Clone, configure, deploy
3. **100% customizable** - Change colors, text, language without code
4. **Email notifications** - GitHub sends emails automatically
5. **No vendor lock-in** - Your data in your GitHub repo

## Technology Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS (configurable via JSON)
- **Database**: GitHub Issues API (free)
- **Notifications**: GitHub email notifications (free)
- **Hosting**: Vercel (free tier)
- **i18n**: JSON-based translations (IT/EN, easily extensible)

## Architecture

```
User → Landing Page Form → POST /api/contact → GitHub API → Issue Created → Email Sent
                                                      ↓
                                              Free Storage
```

## File Structure

```
lead-capture-system/
├── config/                    # 📁 Configuration (NO CODE CHANGES)
│   ├── theme.json            # Colors, borders, shadows
│   └── translations.json     # All text (IT/EN)
├── src/
│   └── app/
│       ├── page.tsx          # Contact form component
│       ├── translations.ts   # Translation loader
│       ├── useLanguage.ts    # Language detection hook
│       └── api/contact/
│           └── route.ts      # API endpoint (GitHub integration)
├── .env.local                # GitHub token + repo config
└── README.md                 # User documentation
```

## Key Design Decisions

### 1. GitHub Issues as Database
**Why?** Free, unlimited, built-in email notifications, easy to query.
**Trade-off**: Not a traditional database, but perfect for contact forms.

### 2. JSON Configuration
**Why?** Users can customize without touching code.
**Files**: `config/theme.json`, `config/translations.json`

### 3. Auto Language Detection
**Why?** Better UX - users see form in their language.
**How**: `navigator.language` + fallback to `NEXT_PUBLIC_DEFAULT_LOCALE`

### 4. All Fields Required
**Why?** Ensures quality leads (user request).
**Fields**: firstName, lastName, email, company, message

## Configuration System

### Theme Configuration (`config/theme.json`)
```json
{
  "colors": {
    "primary": {
      "DEFAULT": "#2563eb",  // Button color
      "hover": "#1d4ed8",    // Button hover
      "ring": "#3b82f6"      // Input focus ring
    }
  }
}
```

### Translations (`config/translations.json`)
```json
{
  "it": {
    "title": "Contattaci",
    "fields": { "company": "Azienda" },
    "buttons": { "submit": "Invia Messaggio" }
  },
  "en": { ... }
}
```

### Environment Variables (`.env.local`)
```env
GITHUB_TOKEN=ghp_xxx              # GitHub PAT with 'repo' scope
GITHUB_REPO=username/repo-name    # Where to store contacts
NEXT_PUBLIC_DEFAULT_LOCALE=it     # Force language (optional)
```

## User Personas

1. **Freelancer/Agency**: Needs simple contact form for client sites
2. **Startup**: Wants to capture leads without SaaS costs
3. **Developer**: Looking for open-source alternative to Typeform/Tally

## Common Customizations

1. **Change colors**: Edit `config/theme.json`
2. **Change field labels**: Edit `config/translations.json`
3. **Add language**: Add key to `translations.json` + update `src/app/translations.ts`
4. **Change fields**: Modify `src/app/page.tsx` + `src/app/api/contact/route.ts`

## Monetization Opportunities

See `MONETIZATION.md` for 6 revenue models.

## Success Metrics

- Setup time: **< 5 minutes**
- Monthly cost: **€0**
- Customization: **No code required**
- Languages: **2 (IT/EN), extensible**
- Email delivery: **100% (via GitHub)**

## Future Enhancements

- [ ] Spam protection (Cloudflare Turnstile)
- [ ] Webhook integrations (Slack, Discord)
- [ ] CSV export
- [ ] Analytics dashboard
- [ ] Auto-responder emails
- [ ] File upload support
- [ ] Multi-step forms

## For AI Assistants: How to Help Users

### User wants to customize colors
→ Guide them to edit `config/theme.json`

### User wants to change text
→ Guide them to edit `config/translations.json`

### User wants to add a field
→ Requires code changes in:
1. `src/app/page.tsx` (add input)
2. `src/app/api/contact/route.ts` (add to interface + validation)
3. `config/translations.json` (add label)

### User wants to add a language
→ Add new key to `config/translations.json` + update `Locale` type

### User has issues with email notifications
→ Check:
1. GitHub token has `repo` permission
2. GitHub notification settings enabled
3. Not in spam folder

## License

MIT - Free to use commercially
