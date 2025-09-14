'use client'

import { PaintCanvas } from '@@/PaintCanvas'
import { Colorbar } from '@/components/colorbar/Colorbar'
import { ToolBar } from '@/components/toolbar/Toolbar'
import { useBodyClassName } from '@/hooks/useBodyClassName'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useResetScroll } from '@/hooks/useResetScroll'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'

export default function PaintPage() {
  useBodyClassName('overflow-hidden')
  useDefaultPrevention()
  useResetScroll()

  useSaveCanvases()

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
