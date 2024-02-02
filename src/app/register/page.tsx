import { Metadata } from 'next'
import Register from '.'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Faça seu cadastro',
  }
}

export default function RegisterPage() {
  return <Register />
}
