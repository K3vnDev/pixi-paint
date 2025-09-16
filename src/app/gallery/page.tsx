'use client'

import { CanvasesGrid } from '@@/canvases-grid/CanvasesGrid'
import { GalleryCanvas } from '@@/gallery/GalleryCanvas'
import type { SavedCanvas, StorageCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ColoredPixelatedImage } from '@/components/ColoredPixelatedImage'
import { CanvasesGridHeader } from '@/components/canvases-grid/CanvasesGridHeader'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useEvent } from '@/hooks/useEvent'
import { useRemoteStore } from '@/store/useRemoteStore'
import { canvasParser } from '@/utils/canvasParser'
import { dataFetch } from '@/utils/dataFetch'

export default function GalleryPage() {
  const publisedCanvases = useRemoteStore(s => s.publishedCanvases)
  const setPublishedCanvases = useRemoteStore(s => s.setPublishedCanvases)
  useDefaultPrevention()
  const router = useRouter()

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

  const setSearchParamsId = (id: string) => {
    const { pathname, origin } = window.location
    const url = new URL(pathname, origin)
    url.searchParams.set('id', id)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  // Unset search params id
  useEvent('$dialog-menu-closed', () => {
    const { pathname } = window.location
    router.replace(pathname, { scroll: false })
  })

  return (
    <main
      className={`
        mt-[calc(var(--navbar-height)+3rem)] w-screen flex flex-col 
        gap-8 justify-center items-center relative
      `}
    >
      {canvasesGallery.length ? (
        <>
          <CanvasesGridHeader className='h-16' />
          <CanvasesGrid className='2xl:grid-cols-5'>
            {canvasesGallery.map(c => (
              <GalleryCanvas key={c.id} {...{ setSearchParamsId, ...c }} />
            ))}
          </CanvasesGrid>
        </>
      ) : (
        <ColoredPixelatedImage
          icon='loading'
          className='size-16 animate-step-spin fixed top-1/2 -translate-y-1/2'
        />
      )}
    </main>
  )
}
