'use client'

import { CreationsCanvas } from '@@/my-creations/CreationsCanvas'
import { CreationsHeader } from '@@/my-creations/CreationsHeader'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useScroll } from '@/hooks/useScroll'

export default function Home() {
  const { savedCanvases, draft, hydrated } = useSaveCanvases()
  const { canvasesGallery } = useCanvasesGallery({
    canvases: [draft, ...savedCanvases],
    loaded: hydrated
  })

  useBasicPrevention()
  useScroll()

  return (
    <main className='mt-48 w-screen flex flex-col gap-8 justify-center items-center relative'>
      <CreationsHeader />
      <ul className='grid [grid-template-columns:repeat(auto-fit,250px)] w-full gap-5 px-20 place-content-center pt-4 pb-20'>
        {hydrated && canvasesGallery.map(c => <CreationsCanvas key={c.id} {...c} />)}
      </ul>
    </main>
  )
}
