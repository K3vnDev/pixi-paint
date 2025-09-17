'use client'

import { CanvasesGrid } from '@@/canvases-grid/CanvasesGrid'
import { CreationsCanvas } from '@@/my-creations/CreationsCanvas'
import { CreationsHeader } from '@@/my-creations/CreationsHeader'
import { useMemo } from 'react'
import { CreationsContext } from '@/context/CreationsContext'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useCanvasesSelection } from '@/hooks/useCanvasesSelection'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useResetScroll } from '@/hooks/useResetScroll'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useUserPublishedIds } from '@/hooks/useUserPublishedIds'

export default function MyCreationsPage() {
  const { savedCanvases, draft, hydrated } = useSaveCanvases()
  const stateCanvases = useMemo(() => [draft, ...savedCanvases], [draft, savedCanvases])
  const { canvasesGallery } = useCanvasesGallery({ stateCanvases, loaded: hydrated })
  const canvasesSelection = useCanvasesSelection()

  useUserPublishedIds(true)
  useDefaultPrevention()
  useResetScroll()

  return (
    <CreationsContext.Provider value={canvasesSelection}>
      <main
        className={`
          mt-[calc(var(--navbar-height)+6rem)] w-screen flex flex-col gap-8
          justify-center items-center relative
        `}
      >
        <CreationsHeader />

        <CanvasesGrid>
          {hydrated && canvasesGallery.map(c => <CreationsCanvas key={c.id} {...c} />)}
        </CanvasesGrid>
      </main>
    </CreationsContext.Provider>
  )
}
