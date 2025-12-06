'use client'

import { useState, FormEvent } from 'react'
import { useLanguage } from './useLanguage'

export default function Home() {
  const { t } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      company: formData.get('company') as string,
      message: formData.get('message') as string,
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit form')
      }

      setSuccess(true)
      e.currentTarget.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8 bg-background-page">
      <div className="max-w-md w-full bg-background-main rounded-card shadow-card p-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          {t.title}
        </h1>
        <p className="text-text-secondary mb-6">
          {t.subtitle}
        </p>

        {success && (
          <div className="mb-6 p-4 bg-success-bg border border-success-border rounded-input">
            <p className="text-success-text font-medium">
              ✓ {t.messages.success}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-error-bg border border-error-border rounded-input">
            <p className="text-error-text font-medium">
              ✗ {t.messages.error}: {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text-label mb-1">
                {t.firstName} {t.required}
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                placeholder={t.placeholders.firstName}
                className="w-full px-4 py-2 border border-border rounded-input focus:ring-2 focus:ring-primary-ring focus:border-transparent text-text-primary"
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text-label mb-1">
                {t.lastName} {t.required}
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                placeholder={t.placeholders.lastName}
                className="w-full px-4 py-2 border border-border rounded-input focus:ring-2 focus:ring-primary-ring focus:border-transparent text-text-primary"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-label mb-1">
              {t.email} {t.required}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder={t.placeholders.email}
              className="w-full px-4 py-2 border border-border rounded-input focus:ring-2 focus:ring-primary-ring focus:border-transparent text-text-primary"
            />
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-label mb-1">
              {t.company} {t.required}
            </label>
            <input
              type="text"
              id="company"
              name="company"
              required
              placeholder={t.placeholders.company}
              className="w-full px-4 py-2 border border-border rounded-input focus:ring-2 focus:ring-primary-ring focus:border-transparent text-text-primary"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-text-label mb-1">
              {t.message} {t.required}
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              placeholder={t.placeholders.message}
              className="w-full px-4 py-2 border border-border rounded-input focus:ring-2 focus:ring-primary-ring focus:border-transparent text-text-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 px-6 rounded-button font-medium hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? t.submitting : t.submit}
          </button>
        </form>
      </div>
    </main>
  )
}
