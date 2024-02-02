/* eslint-disable camelcase */
import { dayjs } from '@/lib/dayjs'
import { prisma } from '@/lib/prisma'
import { type NextRequest } from 'next/server'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const username = params.username

  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get('date')
  const timeZoneOffSet = searchParams.get('timeZoneOffSet')

  if (!date || !timeZoneOffSet) {
    return Response.json(
      { message: 'Date or timezone not provided.' },
      { status: 400 },
    )
  }

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return Response.json({ message: 'User does not exists.' }, { status: 400 })
  }

  const referenceDate = dayjs(String(date))
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  const timeZoneOffSetInHours =
    typeof timeZoneOffSet === 'string'
      ? Number(timeZoneOffSet) / 60
      : Number(timeZoneOffSet[0]) / 60

  const referenceDateTimeZoneOffSetInHours =
    referenceDate.toDate().getTimezoneOffset() / 60

  if (isPastDate) {
    return Response.json({ possibleTimes: [], availableTimes: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return Response.json({ possibleTimes: [], availableTimes: [] })
  }

  const { time_start_in_minutes, time_end_in_minutes } = userAvailability

  const startHour = time_start_in_minutes / 60
  const endHour = time_end_in_minutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate
          .set('hour', startHour)
          .add(timeZoneOffSetInHours, 'hours')
          .toDate(),
        lte: referenceDate
          .set('hour', endHour)
          .add(timeZoneOffSetInHours, 'hours')
          .toDate(),
      },
    },
  })

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some(
      (blockedTime) =>
        blockedTime.date.getUTCHours() - timeZoneOffSetInHours === time,
    )

    const isTimeInPast = referenceDate
      .set('hour', time)
      .subtract(referenceDateTimeZoneOffSetInHours, 'hours')
      .isBefore(new Date())

    return !isTimeBlocked && !isTimeInPast
  })

  return Response.json({ possibleTimes, availableTimes })
}
