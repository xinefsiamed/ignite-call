import { getServerSession } from 'next-auth'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/utils/authOptions'

const updateProfileBodySchema = z.object({
  bio: z.string(),
})

export async function PUT(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(null, { status: 401 })
  }

  const { bio } = await updateProfileBodySchema.parseAsync(await request.json())

  await prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      bio,
    },
  })

  return new NextResponse(null, { status: 204 })
}
