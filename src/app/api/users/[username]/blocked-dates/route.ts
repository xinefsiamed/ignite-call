/* eslint-disable camelcase */
import { prisma } from '@/lib/prisma'
import { type NextRequest } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } },
) {
  const username = params.username

  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get('year')
  const month = searchParams.get('month')

  if (!year || !month) {
    return Response.json(
      { message: 'Year or month not specified.' },
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

  const availableWeeksDay = await prisma.userTimeInterval.findMany({
    select: {
      week_day: true,
    },
    where: {
      user_id: user.id,
    },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter((weekDay) => {
    return !availableWeeksDay.some(
      (availableWeekDay) => availableWeekDay.week_day === weekDay,
    )
  })

  const blockedDatesRaw: Array<{ date: number }> = await prisma.$queryRaw`
  SELECT 
    EXTRACT(DAY FROM S.date) as date,
    COUNT(S.date) AS amount,
    ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60) as size
  FROM
    schedulings S
  LEFT JOIN
    user_time_intervals UTI
    ON
      UTI.week_day = DATE_PART('isodow',S.date)
  WHERE
    S.user_id = ${user.id}
  AND
    TO_CHAR(S.date, 'YYYY-MM') = ${`${year}-${month}`}

  GROUP BY EXTRACT(DAY FROM S.date),
  ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)

  HAVING COUNT(S.date) >= ((UTI.time_end_in_minutes - UTI.time_start_in_minutes) / 60)
  `
  const blockedDates = blockedDatesRaw.map((item) => Number(item.date))

  return Response.json({ blockedWeekDays, blockedDates })
}
