'use client'

import { Colorbar } from '@/components/Colorbar'
import { PaintCanvas } from '@/components/PaintCanvas'
import { ToolBar } from '@/components/Toolbar'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'

export default function Home() {
  useBasicPrevention()

  return (
    <main className='w-screen h-dvh flex justify-center items-center relative'>
      <PaintCanvas />
      <ToolBar />
      <Colorbar />
    </main>
  )
}
