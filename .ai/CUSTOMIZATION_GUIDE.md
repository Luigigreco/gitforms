# Customization Guide for AI Assistants

**This guide helps AI assistants customize the project for users without code changes.**

## Quick Customization Matrix

| User Wants To... | File to Edit | Code Changes? |
|------------------|--------------|---------------|
| Change button color | `config/theme.json` | ❌ No |
| Change field labels | `config/translations.json` | ❌ No |
| Change success message | `config/translations.json` | ❌ No |
| Force a language | `.env.local` | ❌ No |
| Add a new language | `config/translations.json` + `src/app/translations.ts` | ⚠️ Minor |
| Add a new field | Multiple files | ✅ Yes |
| Change field validation | `src/app/api/contact/route.ts` | ✅ Yes |

## Color Customization

### File: `config/theme.json`

**Common requests:**

#### "Make the button green instead of blue"
```json
{
  "colors": {
    "primary": {
      "DEFAULT": "#10b981",  // Green-500
      "hover": "#059669",    // Green-600
      "ring": "#34d399"      // Green-400
    }
  }
}
```

#### "Use my brand colors"
Ask user for hex colors, then:
```json
{
  "colors": {
    "primary": {
      "DEFAULT": "{their_primary_color}",
      "hover": "{darker_shade}",
      "ring": "{lighter_shade}"
    },
    "text": {
      "primary": "{their_text_color}"
    }
  }
}
```

#### "Dark mode"
```json
{
  "colors": {
    "background": {
      "main": "#1f2937",     // Gray-800
      "page": "#111827"      // Gray-900
    },
    "text": {
      "primary": "#f9fafb",   // Gray-50
      "secondary": "#d1d5db" // Gray-300
    }
  }
}
```

## Text Customization

### File: `config/translations.json`

#### "Change 'Azienda' to 'Società'"
```json
{
  "it": {
    "fields": {
      "company": "Società"  // Changed from "Azienda"
    }
  }
}
```

#### "Change the title"
```json
{
  "it": {
    "title": "Richiedi Informazioni",  // Changed from "Contattaci"
    "subtitle": "Compila per ricevere maggiori dettagli"
  }
}
```

#### "Change button text"
```json
{
  "it": {
    "buttons": {
      "submit": "Richiedi Demo",  // Changed from "Invia Messaggio"
      "submitting": "Invio..."
    }
  }
}
```

#### "Change success message"
```json
{
  "it": {
    "messages": {
      "success": "Perfetto! Riceverai una risposta entro 24h."
    }
  }
}
```

## Language Customization

### Force a specific language

**File:** `.env.local`

```env
# Force Italian
NEXT_PUBLIC_DEFAULT_LOCALE=it

# Force English
NEXT_PUBLIC_DEFAULT_LOCALE=en

# Auto-detect (remove or comment out)
# NEXT_PUBLIC_DEFAULT_LOCALE=
```

### Add a new language (e.g., French)

**Step 1:** Add translations to `config/translations.json`
```json
{
  "it": { ... },
  "en": { ... },
  "fr": {
    "title": "Contactez-nous",
    "subtitle": "Remplissez le formulaire et nous vous recontacterons bientôt.",
    "fields": {
      "firstName": "Prénom",
      "lastName": "Nom",
      "email": "Email",
      "company": "Entreprise",
      "message": "Message"
    },
    "placeholders": {
      "firstName": "Jean",
      "lastName": "Dupont",
      "email": "jean.dupont@example.com",
      "company": "Votre entreprise",
      "message": "Comment pouvons-nous vous aider?"
    },
    "buttons": {
      "submit": "Envoyer le message",
      "submitting": "Envoi en cours..."
    },
    "messages": {
      "success": "Merci! Nous vous contacterons bientôt.",
      "error": "Erreur"
    },
    "required": "*"
  }
}
```

**Step 2:** Update `src/app/translations.ts`
```typescript
export type Locale = 'it' | 'en' | 'fr'  // Add 'fr'
```

**Step 3:** Update language detection in `src/app/useLanguage.ts`
```typescript
// Add this check:
else if (browserLang.startsWith('fr')) {
  setLocale('fr')
}
```

## Field Customization

### Make a field optional

**Scenario:** User wants "company" to be optional

**File 1:** `src/app/page.tsx`
```tsx
// Remove 'required' attribute
<input
  type="text"
  name="company"
  // required  ← Remove this
/>

// Update label
<label>
  {t.fields.company}  // Remove {t.required}
</label>
```

**File 2:** `src/app/api/contact/route.ts`
```typescript
// Update interface
interface ContactFormData {
  company?: string  // Add '?' to make optional
}

// Update validation
if (!body.firstName || !body.lastName || !body.email || !body.message) {
  // Removed body.company from check
}

// Handle optional in Issue body
**Azienda:** ${body.company || 'Non fornita'}
```

### Add a new field (e.g., "Phone")

**File 1:** `config/translations.json`
```json
{
  "it": {
    "fields": {
      "phone": "Telefono"
    },
    "placeholders": {
      "phone": "+39 123 456 7890"
    }
  }
}
```

**File 2:** `src/app/page.tsx`
```tsx
// Add after email field
<div>
  <label htmlFor="phone">
    {t.fields.phone} {t.required}
  </label>
  <input
    type="tel"
    id="phone"
    name="phone"
    required
    placeholder={t.placeholders.phone}
    className="w-full px-4 py-2 border border-border rounded-input..."
  />
</div>

// Add to form data
const data = {
  // ... other fields
  phone: formData.get('phone') as string,
}
```

**File 3:** `src/app/api/contact/route.ts`
```typescript
// Update interface
interface ContactFormData {
  // ... other fields
  phone: string
}

// Update validation
if (!body.phone) {
  // Add to required check
}

// Add to Issue body
**Telefono:** ${body.phone}
```

## Style Customization

### Change border radius

**File:** `config/theme.json`
```json
{
  "borderRadius": {
    "card": "1rem",     // Rounded (default: 0.5rem)
    "input": "0.25rem", // Less rounded
    "button": "2rem"    // Very rounded (pill)
  }
}
```

### Change shadows

```json
{
  "shadows": {
    "card": "0 25px 50px -12px rgb(0 0 0 / 0.25)"  // Stronger shadow
  }
}
```

### Remove shadows

```json
{
  "shadows": {
    "card": "none"
  }
}
```

## Common Customization Patterns

### Corporate/Professional Style
```json
// theme.json
{
  "colors": {
    "primary": { "DEFAULT": "#1e3a8a" },  // Navy blue
    "background": { "main": "#ffffff" },
    "text": { "primary": "#1f2937" }
  },
  "borderRadius": {
    "card": "0.25rem",  // Sharp corners
    "button": "0.25rem"
  }
}

// translations.json
{
  "it": {
    "title": "Richiedi Consulenza",
    "buttons": { "submit": "Invia Richiesta" }
  }
}
```

### Startup/Modern Style
```json
// theme.json
{
  "colors": {
    "primary": { "DEFAULT": "#8b5cf6" },  // Purple
    "background": { "page": "#fafafa" }
  },
  "borderRadius": {
    "card": "1rem",  // Rounded
    "button": "2rem"  // Pill
  },
  "shadows": {
    "card": "0 20px 25px -5px rgb(0 0 0 / 0.1)"
  }
}
```

### E-commerce/Sales Style
```json
// theme.json
{
  "colors": {
    "primary": { "DEFAULT": "#dc2626" },  // Red (urgency)
    "success": {
      "bg": "#fef3c7",
      "text": "#92400e"
    }
  }
}

// translations.json
{
  "it": {
    "title": "Offerta Esclusiva",
    "subtitle": "Richiedi il tuo sconto personalizzato",
    "buttons": { "submit": "Ottieni Sconto" }
  }
}
```

## Testing Customizations

After making changes:

```bash
# 1. Rebuild Tailwind (if changed theme.json)
npm run dev

# 2. Clear browser cache
# Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

# 3. Test form submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","company":"ACME","message":"Test"}'
```

## Troubleshooting Customizations

### Colors not changing
- Restart dev server: `npm run dev`
- Clear browser cache
- Check JSON syntax (no trailing commas)

### Translations not showing
- Check JSON syntax
- Verify locale code matches (it/en)
- Check browser console for errors

### New field not working
- Ensure added to all 3 files (translations, form, API)
- Check TypeScript interface matches
- Verify validation logic updated
