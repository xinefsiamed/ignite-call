import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import StitchesRegistry from './Components/StyleSheet'
import { NextAuthProvider } from './Components/NextAuthProvider'
import { QueryClientProvider } from './Components/QueryClientProvider'

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
})

export const metadata: Metadata = {
  title: {
    default: 'Descomplique a sua agenda | Ignite Call',
    template: '%s | Ignite Call',
  },
  description:
    'Conecte seu calendário e permita que as pessoas marquem agendamentos no seu tempo livre.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ignite Call',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <StitchesRegistry>
          <QueryClientProvider>
            <NextAuthProvider>{children}</NextAuthProvider>
          </QueryClientProvider>
        </StitchesRegistry>
      </body>
    </html>
  )
}
