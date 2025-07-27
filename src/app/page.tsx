import { PaintCanvas } from '@/components/PaintCanvas'
import { ToolBar } from '@/components/Toolbar'

export default function Home() {
  return (
    <main className='w-screen h-dvh flex justify-center items-center relative'>
      <PaintCanvas />
      <ToolBar />
    </main>
  )
}
