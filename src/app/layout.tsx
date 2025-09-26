import { CustomCursor } from '@@/CustomCursor'
import { ContextMenu } from '@@/context-menu/ContextMenu'
import { Navbar } from '@@/navbar/Navbar'
import { Tooltip } from '@@/Tooltip'
import { DialogMenu } from '@dialog-menu/DialogMenu'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import Head from 'next/head'
import { ICON_NAMES } from '@/consts'
import { getIconPath } from '@/utils/getIconPath'

import './globals.css'
import './animations.css'

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

const toPreloadImages = [...ICON_NAMES.map(getIconPath), '/imgs/save.png']

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <Head>
        {toPreloadImages.map(src => (
          <link key={src} rel='preload' as='image' href={src} />
        ))}
      </Head>
      <body
        className={`
          ${geistSans.variable} ${geistMono.variable} antialiased
					bg-theme-bg overflow-x-hidden
				`}
      >
        <Navbar />
        {children}

        <CustomCursor />
        <ContextMenu />
        <Tooltip />
        <DialogMenu />
      </body>
    </html>
  )
}
