# Landing Page Contact Form

**Form di contatto gratuito per la tua landing page** con email automatiche.

Ogni volta che qualcuno compila il form, ricevi un'email di notifica. Zero costi mensili, nessun database esterno da gestire.

## Caratteristiche

- ✅ Form semplice e pulito
- ✅ Email automatiche quando ricevi un contatto
- ✅ **Completamente configurabile** (colori, testi, lingua)
- ✅ Multilingua (IT/EN) con auto-rilevamento
- ✅ Next.js 13+ con App Router
- ✅ TypeScript per sicurezza
- ✅ Tailwind CSS per lo stile
- ✅ Completamente gratuito

## Come Funziona

```
Utente compila form → Dati salvati → Email automatica inviata
```

I dati vengono salvati usando GitHub come storage gratuito (funziona come un database semplice). Quando arriva un nuovo contatto, GitHub manda automaticamente un'email.

## Setup Rapido

### 1. Clona il repository

```bash
git clone https://github.com/omega-suite-finance/lead-capture-system.git
cd lead-capture-system
```

### 2. Installa dipendenze

```bash
npm install
```

### 3. Configura GitHub Token

Per salvare i contatti hai bisogno di un GitHub token (è gratuito):

1. Vai su https://github.com/settings/tokens
2. Clicca "Generate new token (classic)"
3. Nome: `Landing Page Contact Form`
4. Seleziona: **`repo`**
5. Genera e copia il token

### 4. Configura le variabili d'ambiente

```bash
cp .env.example .env.local
```

Modifica `.env.local`:

```env
GITHUB_TOKEN=ghp_il_tuo_token_qui
GITHUB_REPO=tuo-username/lead-capture-system

# Opzionale: forza una lingua specifica
# NEXT_PUBLIC_DEFAULT_LOCALE=it
```

### 5. Avvia il server

```bash
npm run dev
```

Apri http://localhost:3000 per vedere il form.

## 🎨 Personalizzazione (ZERO Codice!)

### Cambiare i Colori

Modifica `config/theme.json`:

```json
{
  "colors": {
    "primary": {
      "DEFAULT": "#2563eb",   // Colore principale bottone
      "hover": "#1d4ed8",     // Colore hover bottone
      "ring": "#3b82f6"       // Colore focus input
    }
  }
}
```

**Esempi:**
- **Verde:** `"DEFAULT": "#10b981"`, `"hover": "#059669"`
- **Viola:** `"DEFAULT": "#8b5cf6"`, `"hover": "#7c3aed"`
- **Rosso:** `"DEFAULT": "#ef4444"`, `"hover": "#dc2626"`

### Cambiare i Testi dei Campi

Modifica `config/fields.json`:

```json
{
  "it": {
    "firstName": "Nome",
    "lastName": "Cognome",
    "email": "Email",
    "company": "Società",     // Cambia "Azienda" in "Società"
    "message": "Il tuo messaggio"
  }
}
```

### Cambiare la Lingua

Il form rileva automaticamente la lingua del browser (IT/EN).

Per forzare una lingua, aggiungi in `.env.local`:

```env
NEXT_PUBLIC_DEFAULT_LOCALE=it   # Forza italiano
# oppure
NEXT_PUBLIC_DEFAULT_LOCALE=en   # Forza inglese
```

## Campi del Form

- **Nome** (obbligatorio)
- **Cognome** (obbligatorio)  
- **Email** (obbligatorio)
- **Azienda** (obbligatorio)
- **Messaggio** (obbligatorio)

## Test con curl

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Mario",
    "lastName": "Rossi",
    "email": "mario@example.com",
    "company": "ACME Corp",
    "message": "Vorrei maggiori informazioni"
  }'
```

Risposta attesa:

```json
{
  "success": true,
  "message": "Grazie! Ti contatteremo a breve."
}
```

## Notifiche Email

GitHub manda automaticamente email quando ricevi un nuovo contatto. Per riceverle:

1. Vai su https://github.com/settings/notifications
2. Abilita "Email" nelle notifiche
3. Fatto! Riceverai un'email per ogni contatto

Ogni email contiene:
- Nome e cognome
- Email del contatto
- Azienda
- Messaggio completo
- Data e ora

## Deploy in Produzione

### Vercel (consigliato)

1. Push del codice su GitHub (già fatto ✓)
2. Importa il repo su [Vercel](https://vercel.com)
3. Aggiungi le variabili d'ambiente:
   - `GITHUB_TOKEN`
   - `GITHUB_REPO`
   - `NEXT_PUBLIC_DEFAULT_LOCALE` (opzionale)
4. Deploy automatico!

## Analisi Costi

| Servizio | Costo |
|----------|-------|
| GitHub (storage) | **€0** |
| Email automatiche | **€0** |
| Vercel hosting | **€0** (piano hobby) |
| **Totale** | **€0/mese** |

## File di Configurazione

| File | Scopo |
|------|-------|
| `config/theme.json` | Colori, bordi, ombre |
| `config/fields.json` | Etichette campi form |
| `.env.local` | Token GitHub, lingua default |

**Modifica questi file senza toccare il codice!**

## Sicurezza

- ✅ Token GitHub mai committato (protetto da `.gitignore`)
- ✅ Validazione email lato server
- ✅ Validazione campi obbligatori
- ✅ Gestione errori completa
- ✅ HTTPS in produzione (con Vercel)

## Troubleshooting

### "Errore di configurazione"

- Verifica che `.env.local` esista
- Controlla che `GITHUB_TOKEN` sia corretto
- Verifica che `GITHUB_REPO` sia nel formato `username/repo`

### "Email non valida"

L'utente deve inserire un'email nel formato corretto (`nome@dominio.com`)

### Non ricevo email

1. Controlla le impostazioni notifiche GitHub
2. Controlla la cartella spam
3. Verifica che il token abbia il permesso `repo`

### Il form non funziona

1. Apri la console del browser (F12)
2. Controlla errori nella Network tab
3. Verifica che il server sia avviato (`npm run dev`)

## Dove Vengono Salvati i Dati?

I contatti vengono salvati nel repository GitHub (tab "Issues"). Ogni contatto è un nuovo "issue" con:

- Titolo: Nome completo e azienda
- Contenuto: Tutti i dati del contatto
- Label: "contatto" per trovarlo facilmente

Puoi vedere tutti i contatti su: `https://github.com/tuo-username/lead-capture-system/issues`

## Licenza

MIT

## Repository

https://github.com/omega-suite-finance/lead-capture-system
