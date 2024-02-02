/* eslint-disable camelcase */
import { dayjs } from '@/lib/dayjs'
import { getGoogleOAuthToken } from '@/lib/google'
import { prisma } from '@/lib/prisma'
import { google } from 'googleapis'
import { type NextRequest } from 'next/server'
import { z } from 'zod'

export async function POST(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const username = params.username

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return Response.json({ message: 'User does not exists.' }, { status: 400 })
  }

  const createSchedulingBody = z.object({
    name: z.string(),
    email: z.string().email(),
    observations: z.string().nullable(),
    date: z.string().datetime(),
  })

  const { name, email, date, observations } = createSchedulingBody.parse(
    await request.json(),
  )

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return Response.json({ message: 'Date is in the past' }, { status: 400 })
  }

  const conflictingScheduling = await prisma.scheduling.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return Response.json(
      { message: 'There is another scheduling at same time' },
      { status: 400 },
    )
  }

  const scheduling = await prisma.scheduling.create({
    data: {
      name,
      email,
      date: schedulingDate.toDate(),
      user_id: user.id,
    },
  })

  const calendar = google.calendar({
    version: 'v3',
    auth: await getGoogleOAuthToken(user.id),
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [{ email, displayName: name }],
      conferenceData: {
        createRequest: {
          requestId: scheduling.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return Response.json(null, { status: 201 })
}
