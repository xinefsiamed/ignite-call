/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { prisma } from '@/lib/prisma'
import { SchedulePage } from './Components/SchedulePage'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const revalidate = 60 * 60 * 24 // 1 day

export async function generateMetadata({
  params: { username },
}: {
  params: { username: string }
}): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  return {
    title: `Agendar com ${user?.name}`,
    robots: {
      index: false,
    },
  }
}

export default async function Schedule({
  params: { username },
}: {
  params: { username: string }
}) {
  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) {
    return notFound()
  }

  return (
    <SchedulePage
      username={username}
      description={user.bio!}
      image={user.image!}
    />
  )
}
