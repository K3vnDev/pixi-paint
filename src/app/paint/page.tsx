'use client'

import { Colorbar } from '@@/Colorbar/Colorbar'
import { PaintCanvas } from '@@/PaintCanvas'
import { ToolBar } from '@@/Toolbar/Toolbar'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useBodyClassName } from '@/hooks/useBodyClassName'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useScroll } from '@/hooks/useScroll'

export default function Home() {
  useScroll({ resetOnLoad: true })
  useBodyClassName('overflow-hidden')
  useSaveCanvases()
  useBasicPrevention()

  return (
    <main
      className={`
        w-screen h-[calc(100dvh-var(--navbar-height))] mt-[var(--navbar-height)]
        flex justify-center items-center relative
      `}
    >
      <PaintCanvas />
      <ToolBar />
      <Colorbar />
    </main>
  )
}
