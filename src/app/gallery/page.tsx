'use client'

import { CanvasesGrid } from '@@/canvases-grid/CanvasesGrid'
import { GalleryCanvas } from '@@/gallery/GalleryCanvas'
import type { SavedCanvas, StorageCanvas } from '@types'
import { useEffect } from 'react'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useRemoteStore } from '@/store/useRemoteStore'
import { canvasParser } from '@/utils/canvasParser'
import { dataFetch } from '@/utils/dataFetch'

export default function GalleryPage() {
  const publisedCanvases = useRemoteStore(s => s.publishedCanvases)
  const setPublishedCanvases = useRemoteStore(s => s.setPublishedCanvases)
  useDefaultPrevention()

  const { canvasesGallery } = useCanvasesGallery({
    stateCanvases: publisedCanvases,
    loaded: !!publisedCanvases.length
  })

  useEffect(() => {
    if (publisedCanvases.length) return

    dataFetch<StorageCanvas[]>({
      url: '/api/paintings',
      onSuccess: canvases => {
        const newUploadedCanvases: SavedCanvas[] = canvasParser.batch.fromStorage(canvases)
        setPublishedCanvases(newUploadedCanvases)
      }
    })
  }, [])

  return (
    <main
      className={`
        mt-[calc(var(--navbar-height)+3rem)] w-screen flex flex-col 
        gap-8 justify-center items-center relative
      `}
    >
      <CanvasesGrid>
        {canvasesGallery.map(c => (
          <GalleryCanvas key={c.id} {...c} />
        ))}
      </CanvasesGrid>
    </main>
  )
}
