import { getServerSession } from 'next-auth'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/utils/authOptions'

const timeIntervalsBodySchema = z.object({
  intervals: z.array(
    z.object({
      weekDay: z.number(),
      startTimeInMinutes: z.number(),
      endTimeInMinutes: z.number(),
    }),
  ),
})

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(null, { status: 401 })
  }

  const { intervals } = await timeIntervalsBodySchema.parseAsync(
    await request.json(),
  )

  const intervalsData = intervals.map((interval) => {
    return {
      user_id: session.user.id,
      week_day: interval.weekDay,
      time_start_in_minutes: interval.startTimeInMinutes,
      time_end_in_minutes: interval.endTimeInMinutes,
    }
  })

  await prisma.userTimeInterval.createMany({
    data: intervalsData,
  })

  return new NextResponse(null, { status: 201 })
}
