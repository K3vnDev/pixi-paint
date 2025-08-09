'use client'

import { CreationsCanvas } from '@/components/CreationsCanvas'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'

export default function Home() {
  useBasicPrevention()
  const { savedCanvases, draft, hydrated } = useSaveCanvases()
  const { canvasesGallery } = useCanvasesGallery({
    canvases: [draft, ...savedCanvases],
    loaded: hydrated
  })

  return (
    <main className='mt-48 w-screen flex flex-col gap-8 justify-center items-center relative'>
      <header
        className={`
          fixed w-full left-0 top-[var(--navbar-height)] backdrop-blur-md h-20 z-40
          bg-gradient-to-b from-25% from-theme-50 to-theme-50/60
        `}
      >
        {/*HEADER ITEMS HERE*/}
      </header>
      <ul className='grid [grid-template-columns:repeat(auto-fit,250px)] w-full gap-5 px-20 place-content-center pb-20'>
        {hydrated && canvasesGallery.map(c => <CreationsCanvas key={c.id} {...c} />)}
      </ul>
    </main>
  )
}
