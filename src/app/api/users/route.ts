import { prisma } from '@/lib/prisma'
import { type NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const { name, username } = await request.json()

  const isUserExists = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (isUserExists) {
    return NextResponse.json(
      {
        message: 'Username already taken',
      },
      { status: 400 },
    )
  }

  const user = await prisma.user.create({
    data: {
      name,
      username,
    },
  })

  const cookie = cookies().set('@ignitecall:userId', user.id, {
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return NextResponse.json(cookie.toString(), {
    status: 201,
    headers: {
      'Set-Cookie': cookie.toString(),
    },
  })
}
