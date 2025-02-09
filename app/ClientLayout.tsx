'use client';

import { NotesProvider } from './context/NotesContext'

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotesProvider>
      {children}
    </NotesProvider>
  )
} 