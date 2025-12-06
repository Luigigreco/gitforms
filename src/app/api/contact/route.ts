import { NextRequest, NextResponse } from 'next/server'

interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Get GitHub credentials from environment variables
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN
    const GITHUB_REPO = process.env.GITHUB_REPO

    if (!GITHUB_TOKEN || !GITHUB_REPO) {
      console.error('Missing GitHub configuration')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Parse repo (format: owner/repo-name)
    const [owner, repo] = GITHUB_REPO.split('/')
    if (!owner || !repo) {
      console.error('Invalid GITHUB_REPO format. Expected: owner/repo-name')
      return NextResponse.json(
        { error: 'Server configuration error. Please contact the administrator.' },
        { status: 500 }
      )
    }

    // Extract lead metadata
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const referer = request.headers.get('referer') || 'Direct'
    const timestamp = new Date()
    const dateStr = timestamp.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
    const timeStr = timestamp.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })

    // Determine lead source
    let leadSource = 'Landing Page - Direct'
    if (referer && referer !== 'Direct') {
      const refUrl = new URL(referer)
      leadSource = `Landing Page - Referrer: ${refUrl.hostname}`
    }

    // Create Issue title (CRM-style)
    const companyInfo = body.company ? ` | ${body.company}` : ''
    const issueTitle = `💼 New Lead: ${body.name}${companyInfo}`

    // Create Issue body (CRM-oriented format)
    const issueBody = `## 📊 Lead Information

| Field | Value |
|-------|-------|
| **Full Name** | ${body.name} |
| **Email** | [\`${body.email}\`](mailto:${body.email}) |
| **Company** | ${body.company || '_Not provided_'} |
| **Lead Source** | ${leadSource} |
| **Captured Date** | ${dateStr} |
| **Captured Time** | ${timeStr} |
| **Lead Score** | 🔵 To be qualified |

## 💬 Lead Message

> ${body.message.split('\n').join('\n> ')}

## 🎯 Next Actions

- [ ] Initial contact within 24h
- [ ] Qualify lead (budget, timeline, decision maker)
- [ ] Schedule discovery call
- [ ] Send proposal/pricing

## 📝 Internal Notes

_Add your notes here as you progress through the sales pipeline..._

## 🔍 Technical Details

<details>
<summary>Click to expand</summary>

- **User Agent**: ${userAgent}
- **Referrer**: ${referer}
- **Timestamp (ISO)**: ${timestamp.toISOString()}

</details>

---

*🤖 Automatically captured by Lead Capture System*
`

    // Create GitHub Issue via GitHub API
    // Labels represent lead pipeline states
    const githubResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/issues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          title: issueTitle,
          body: issueBody,
          labels: ['new-lead', 'uncontacted', 'landing-page'],
        }),
      }
    )

    if (!githubResponse.ok) {
      const errorData = await githubResponse.json()
      console.error('GitHub API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to save lead. Please try again later.' },
        { status: 500 }
      )
    }

    const issueData = await githubResponse.json()

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! Your information has been received. We\'ll contact you within 24 hours.',
        leadId: issueData.number,
        leadUrl: issueData.html_url,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error processing lead capture:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
