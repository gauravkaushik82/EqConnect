import { google } from 'googleapis'

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
)

export interface GoogleTokens {
  access_token: string
  refresh_token?: string
  expiry_date?: number
}

export async function createCalendarEvent(
  tokens: GoogleTokens,
  eventData: {
    title: string
    description?: string
    startTime: Date
    endTime: Date
    meetLink?: boolean
  }
) {
  oauth2Client.setCredentials(tokens)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const eventResource: any = {
    summary: eventData.title,
    description: eventData.description || '',
    start: { dateTime: eventData.startTime.toISOString() },
    end: { dateTime: eventData.endTime.toISOString() },
  }

  if (eventData.meetLink) {
    eventResource.conferenceData = {
      createRequest: { requestId: crypto.randomUUID() },
    }
  }

  // Use any casts to satisfy googleapis typings in this environment
  const response: any = await (calendar.events as any).insert({
    calendarId: 'primary',
    resource: eventResource,
    conferenceDataVersion: eventData.meetLink ? 1 : 0,
  } as any)

  return (response as any).data
}

export async function getCalendarEvents(
  tokens: GoogleTokens,
  timeMin: Date = new Date()
) {
  oauth2Client.setCredentials(tokens)
  const calendar = google.calendar({ version: 'v3', auth: oauth2Client })

  const response: any = await (calendar.events as any).list({
    calendarId: 'primary',
    timeMin: timeMin.toISOString(),
    maxResults: 10,
    singleEvents: true,
    orderBy: 'startTime',
  } as any)

  return (response as any).data.items || []
}
