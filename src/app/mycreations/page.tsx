'use client'

import { CreationsCanvas } from '@@/my-creations/CreationsCanvas'
import { CreationsHeader } from '@@/my-creations/CreationsHeader'
import { CreationsContext } from '@/context/CreationsContext'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useCanvasesSelection } from '@/hooks/useCanvasesSelection'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useScroll } from '@/hooks/useScroll'

export default function Home() {
  const { savedCanvases, draft, hydrated } = useSaveCanvases()
  const { canvasesGallery } = useCanvasesGallery({
    canvases: [draft, ...savedCanvases],
    loaded: hydrated
  })
  const canvasesSelection = useCanvasesSelection()

  useBasicPrevention()
  useScroll()

  return (
    <CreationsContext.Provider value={canvasesSelection}>
      <main className='mt-48 w-screen flex flex-col gap-8 justify-center items-center relative'>
        <CreationsHeader />
        <ul
          className={`
            grid 2xl:grid-cols-6 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 w-full gap-5 
            px-[var(--galery-pad-x)] place-content-center pt-4 pb-20
          `}
        >
          {hydrated && canvasesGallery.map(c => <CreationsCanvas key={c.id} {...c} />)}
        </ul>
      </main>
    </CreationsContext.Provider>
  )
}
