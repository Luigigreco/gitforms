export type Locale = 'it' | 'en'

export const translations = {
  it: {
    title: 'Contattaci',
    subtitle: 'Compila il form e ti ricontatteremo a breve.',
    firstName: 'Nome',
    lastName: 'Cognome',
    email: 'Email',
    company: 'Azienda',
    message: 'Messaggio',
    required: '*',
    submit: 'Invia Messaggio',
    submitting: 'Invio in corso...',
    placeholders: {
      firstName: 'Mario',
      lastName: 'Rossi',
      email: 'mario.rossi@example.com',
      company: 'La tua azienda',
      message: 'Come possiamo aiutarti?',
    },
    messages: {
      success: 'Grazie! Ti contatteremo a breve.',
      error: 'Errore',
    },
  },
  en: {
    title: 'Contact Us',
    subtitle: 'Fill out the form and we\'ll get back to you soon.',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    company: 'Company',
    message: 'Message',
    required: '*',
    submit: 'Send Message',
    submitting: 'Sending...',
    placeholders: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      company: 'Your company',
      message: 'How can we help you?',
    },
    messages: {
      success: 'Thank you! We\'ll contact you soon.',
      error: 'Error',
    },
  },
} as const

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en
}
