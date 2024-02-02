import { getServerSession } from 'next-auth'
import { UpdateProfile } from './Components/UpdateProfile'
import { Metadata } from 'next'
import { authOptions } from '@/utils/authOptions'

async function getSession() {
  return getServerSession(authOptions)
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Atualize seu perfil',
    robots: {
      index: false,
    },
  }
}

export default async function Page() {
  const session = await getSession()

  return <UpdateProfile session={session} />
}
