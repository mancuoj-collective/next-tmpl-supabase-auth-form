import type { Metadata } from 'next'
import { ThemeProvider } from 'next-themes'
import { DM_Sans, IBM_Plex_Mono, Lora } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'

const fontSans = DM_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const fontMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

const fontSerif = Lora({
  variable: '--font-serif',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Next',
  description: 'Next.js template lite version',
  icons: {
    icon: '/next.svg',
    shortcut: '/next.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          fontSans.variable,
          fontMono.variable,
          fontSerif.variable,
          'font-serif antialiased',
        )}
      >
        <ThemeProvider attribute="class" storageKey="next-tmpl-theme" disableTransitionOnChange>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}
