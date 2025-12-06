import { useState, useEffect } from 'react'
import { type Locale, getTranslations } from './translations'

export function useLanguage() {
  const [locale, setLocale] = useState<Locale>('en')

  useEffect(() => {
    // 1. Check for manually configured default locale
    const configuredLocale = process.env.NEXT_PUBLIC_DEFAULT_LOCALE as Locale
    if (configuredLocale && (configuredLocale === 'it' || configuredLocale === 'en')) {
      setLocale(configuredLocale)
      return
    }

    // 2. Auto-detect browser language
    const browserLang = navigator.language.toLowerCase()
    
    // Check if browser language starts with 'it' (it, it-IT, it-CH, etc.)
    if (browserLang.startsWith('it')) {
      setLocale('it')
    } 
    // Check if browser language starts with 'en' (en, en-US, en-GB, etc.)
    else if (browserLang.startsWith('en')) {
      setLocale('en')
    }
    // Default to English for all other languages
    else {
      setLocale('en')
    }
  }, [])

  const t = getTranslations(locale)

  return { locale, t }
}
