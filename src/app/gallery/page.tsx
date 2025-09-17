'use client'

import { ColoredPixelatedImage } from '@@/ColoredPixelatedImage'
import { CanvasesGrid } from '@@/canvases-grid/CanvasesGrid'
import { CanvasesGridHeader } from '@@/canvases-grid/CanvasesGridHeader'
import { DMButton } from '@@/dialog-menu/DMButton'
import { DMHeader } from '@@/dialog-menu/DMHeader'
import { DMParagraph } from '@@/dialog-menu/DMParagraph'
import { GalleryCanvas } from '@@/gallery/GalleryCanvas'
import type { SavedCanvas, StorageCanvas } from '@types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCanvasesGallery } from '@/hooks/useCanvasesGallery'
import { useDefaultPrevention } from '@/hooks/useDefaultPrevention'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useSaveCanvases } from '@/hooks/useSaveCanvases'
import { useRemoteStore } from '@/store/useRemoteStore'
import { canvasParser } from '@/utils/canvasParser'
import { dataFetch } from '@/utils/dataFetch'
import { shuffleArray } from '@/utils/shuffleArray'

export default function GalleryPage() {
  const publisedCanvases = useRemoteStore(s => s.publishedCanvases)
  const setPublishedCanvases = useRemoteStore(s => s.setPublishedCanvases)
  const router = useRouter()
  const [initiallyOpenMenuId, setInitiallyOpenMenuId] = useState<string | null>(null)
  const { openMenu } = useDialogMenu()

  useDefaultPrevention()
  useSaveCanvases()

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
        const shuffled = shuffleArray(newUploadedCanvases)
        setPublishedCanvases(shuffled)
      }
    })
  }, [])

  const setSearchParamsId = (id: string) => {
    const { pathname, origin } = window.location
    const url = new URL(pathname, origin)
    url.searchParams.set('id', id)
    router.replace(url.pathname + url.search, { scroll: false })
  }

  const unsetSearchParamsId = () => {
    const { pathname } = window.location
    router.replace(pathname, { scroll: false })
  }

  useEvent('$dialog-menu-closed', () => {
    unsetSearchParamsId()
    setInitiallyOpenMenuId(null)
  })

  // Check if id from url exists in published canvases, if not, unset it
  useEffect(() => {
    if (!publisedCanvases.length) return

    const url = new URL(window.location.href)
    const idFromParams = url.searchParams.get('id')
    if (idFromParams === null) return

    if (publisedCanvases.some(c => c.id === idFromParams)) {
      setInitiallyOpenMenuId(idFromParams)
      return
    }

    unsetSearchParamsId()
    openMenu(
      <>
        <DMHeader icon='cross'>Uh oh! Painting not found</DMHeader>
        <DMParagraph className='w-120'>
          The painting you are looking for does not exist or has been removed.
        </DMParagraph>
        <DMButton className='mt-3'>Okay</DMButton>
      </>
    )
  }, [publisedCanvases])

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
              <GalleryCanvas
                {...c}
                setSearchParamsId={setSearchParamsId}
                initiallyOpenMenu={initiallyOpenMenuId === c.id}
                key={c.id}
              />
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
