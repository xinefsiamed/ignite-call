import { Metadata } from 'next'
import { TimeIntervals } from '.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Selecione a sua disponibilidade',
    robots: {
      index: false,
    },
  }
}

export default function TimeIntervalsPage() {
  return <TimeIntervals />
}
