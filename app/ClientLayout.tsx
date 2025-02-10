'use client';

import { NotesProvider } from './context/NotesContext'
import { ThemeProvider } from './context/ThemeContext'

export function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider>
      <NotesProvider>
        {children}
      </NotesProvider>
    </ThemeProvider>
  )
} 