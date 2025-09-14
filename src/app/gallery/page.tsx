'use client'

import type { SavedCanvas, StorageCanvas } from '@types'
import { useEffect } from 'react'
import { CanvasesGrid } from '@/components/canvases-grid/CanvasesGrid'
import { GalleryCanvas } from '@/components/gallery/GalleryCanvas'
import { useBasicPrevention } from '@/hooks/useBasicPrevention'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { canvasParser } from '@/utils/canvasParser'
import { dataFetch } from '@/utils/dataFetch'

export default function GalleryPage() {
  const publisedCanvases = useCanvasesStore(s => s.publishedCanvases)
  const setPublishedCanvases = useCanvasesStore(s => s.setPublishedCanvases)
  useBasicPrevention()

  const { canvasesGallery } = useCanvasesGallery({
    stateCanvases: publisedCanvases,
    loaded: !!publisedCanvases.length
  })

  useEffect(() => {
    if (publisedCanvases.length) return

    dataFetch<StorageCanvas[]>({
      url: '/api/paintings',
      onSuccess: canvases => {
        const newUploadedCanvases: SavedCanvas[] = []

        for (const { id, bg, pixels } of canvases) {
          const parsedPixels = canvasParser.fromStorage({ id, bg, pixels })?.pixels
          if (!parsedPixels) continue

          newUploadedCanvases.push({ id, pixels: parsedPixels })
        }
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
