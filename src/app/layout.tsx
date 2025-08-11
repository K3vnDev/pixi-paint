import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ContextMenu } from '@/components/ContextMenu/ContextMenu'
import { CustomCursor } from '@/components/CustomCursor'
import { Navbar } from '@/components/Navbar'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'Pixi Paint',
  description: 'A cool 16x pixel art paint tool.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
					bg-theme-50 overflow-x-hidden
				`}
      >
        <Navbar />
        {children}

        <CustomCursor />
        <ContextMenu />
      </body>
    </html>
  )
}
