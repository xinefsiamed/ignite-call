import { Metadata } from 'next'
import { ConnectCalendar } from '.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Conecte a sua agenda do google',
    robots: {
      index: false,
    },
  }
}

export default function ConnectCalendarPage() {
  return <ConnectCalendar />
}
