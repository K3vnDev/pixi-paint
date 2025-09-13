'use client'

import type { GalleryCanvas, StorageCanvas } from '@types'
import { useEffect, useState } from 'react'
import { CanvasImage } from '@/components/CanvasImage'
import { CanvasesGrid } from '@/components/canvases-grid/CanvasesGrid'
import { canvasParser } from '@/utils/canvasParser'
import { dataFetch } from '@/utils/dataFetch'
import { getPixelsDataUrl } from '@/utils/getPixelsDataUrl'

export default function GalleryPage() {
  const [uplodadedCanvases, setUploadedCanvases] = useState<GalleryCanvas[]>()

  useEffect(() => {
    dataFetch<StorageCanvas[]>({
      url: '/api',
      onSuccess: canvases => {
        const newUploadedCanvases: GalleryCanvas[] = []

        for (const { id, bg, pixels } of canvases) {
          const parsedPixels = canvasParser.fromStorage({ id, bg, pixels })?.pixels
          if (!parsedPixels) continue

          const dataUrl = getPixelsDataUrl(parsedPixels)
          newUploadedCanvases.push({ id, dataUrl, isVisible: true })
        }
        setUploadedCanvases(newUploadedCanvases)
      }
    })
  }, [])

  return (
    <main className='mt-[calc(var(--navbar-height)+3rem)] w-screen flex flex-col gap-8 justify-center items-center relative'>
      <CanvasesGrid>
        {uplodadedCanvases?.map(({ id, dataUrl }) => (
          <li key={id} className='relative w-full aspect-square transition-all'>
            <CanvasImage className='size-full' dataUrl={dataUrl} />
          </li>
        ))}
      </CanvasesGrid>
    </main>
  )
}
