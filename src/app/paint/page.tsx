'use client'

import { Colorbar } from '@/components/Colorbar'
import { PaintCanvas } from '@/components/PaintCanvas'
import { ToolBar } from '@/components/Toolbar'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'

export default function Home() {
  useSaveCanvases()
  useBasicPrevention()

  return (
    <main className='w-screen h-dvh flex justify-center items-center relative overflow-hidden'>
      <PaintCanvas />
      <ToolBar />
      <Colorbar />
    </main>
  )
}
