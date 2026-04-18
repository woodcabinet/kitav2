import { format } from 'date-fns'

/**
 * Generate an .ics calendar file and trigger download
 */
export function downloadICS({ title, description, location, start, end }) {
  const fmt = (d) => format(new Date(d), "yyyyMMdd'T'HHmmss")
  const now = fmt(new Date())
  const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}@kitakakis.sg`

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Kitakakis//SG//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART:${fmt(start)}`,
    end ? `DTEND:${fmt(end)}` : '',
    `SUMMARY:${escapeICS(title)}`,
    description ? `DESCRIPTION:${escapeICS(description)}` : '',
    location ? `LOCATION:${escapeICS(location)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Generate a Google Calendar URL
 */
export function googleCalendarURL({ title, description, location, start, end }) {
  const fmt = (d) => format(new Date(d), "yyyyMMdd'T'HHmmss")
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${end ? fmt(end) : fmt(start)}`,
    details: description || '',
    location: location || '',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function escapeICS(str) {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}
