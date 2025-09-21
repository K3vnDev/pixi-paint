'use client'

import { Colorbar } from '@@/colorbar/Colorbar'
import { PaintCanvas } from '@@/PaintCanvas'
import { ToolBar } from '@@/toolbar/Toolbar'
import { useBodyClassName } from '@/hooks/useBodyClassName'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useResetScroll } from '@/hooks/useResetScroll'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'

export default function PaintPage() {
  useDefaultPrevention()
  useResetScroll()
  useBodyClassName('overflow-hidden')

  useSaveCanvases()

  return (
    <main
      className={`
        relative w-screen h-[calc(100dvh-var(--navbar-height))] mt-[var(--navbar-height)]
        flex justify-center items-center
      `}
    >
      <PaintCanvas />
      <ToolBar />
      <Colorbar />
    </main>
  )
}
