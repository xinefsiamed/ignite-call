'use client'
import { ReactNode } from 'react'
import { queryClient } from '@/lib/react-query'
import { QueryClientProvider as QueryProvider } from '@tanstack/react-query'

interface QueryClientProviderProps {
  children: ReactNode
}

export function QueryClientProvider({ children }: QueryClientProviderProps) {
  return <QueryProvider client={queryClient}>{children}</QueryProvider>
}
