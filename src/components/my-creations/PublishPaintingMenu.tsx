import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import type { SavedCanvas } from '@/types'
import { dataFetch } from '@/utils/dataFetch'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMParagraphsZone } from '../dialog-menu/DMParagraphsZone'
import { DMZone } from '../dialog-menu/DMZone'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'

interface Props {
  canvasId: string
  canvasRef: React.RefObject<HTMLLIElement | null>
  dataUrl: string
}

export const PublishPaintingMenu = ({ canvasRef, canvasId, dataUrl }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  useEvent('$context-menu-closed', () => setIsLoading(false))

  const userPublishedCanvasesIds = useRemoteStore(s => s.userPublishedCanvasesIds)
  const setUserPublishedCanvasesIds = useRemoteStore(s => s.setUserPublishedCanvasesIds)

  const publishedCanvases = useRemoteStore(s => s.publishedCanvases)
  const setPublishedCanvases = useRemoteStore(s => s.setPublishedCanvases)

  const { throwConfetti } = useConfetti({
    ref: canvasRef,
    options: { startVelocity: 30, particleCount: 30 },
    position: { fromTop: 1 }
  })

  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const { closeMenu, openMenu } = useDialogMenu()

  const publishPainting = () => {
    setIsLoading(true)

    const { pixels } = savedCanvases.find(c => c.id === canvasId) as SavedCanvas
    if (!pixels) return closeMenu()

    dataFetch<string>({
      url: '/api/paintings',
      method: 'POST',
      json: pixels,
      onSuccess: publishedId => {
        throwConfetti()
        closeMenu()

        // Add local id to userPublishedCanvasesIds
        if (userPublishedCanvasesIds) {
          setUserPublishedCanvasesIds(p => {
            p?.add(canvasId)
            return new Set(p)
          })
        }

        // Add published canvas to publishedCanvases
        if (publishedCanvases.length) {
          const publishedCanvas: SavedCanvas = { id: publishedId, pixels }
          setPublishedCanvases([publishedCanvas, ...publishedCanvases])
        }
      },
      onError: () => {
        openMenu(
          <>
            <DMHeader icon='cross'>Oops! we had an error...</DMHeader>
            <DMParagraphsZone className='w-xl'>
              <DMParagraph>
                Something unexpected happened from our side when trying to publish your canvas.
              </DMParagraph>
              <DMParagraph remark>We encourage you to wait a few minutes and try again.</DMParagraph>
            </DMParagraphsZone>
            <DMButton className='mt-3.5'>Sure, whatever...</DMButton>
          </>
        )
      }
    })
  }

  return (
    <>
      <DMHeader icon='publish'>Publish your painting?</DMHeader>
      <DMZone className='pt-2 pb-0 gap-8'>
        <DMZone className='w-96 flex-col gap-3'>
          <DMParagraph className='w-full'>Upload your painting to the gallery for others to see!</DMParagraph>
          <DMParagraph className='w-full font-semibold italic text-xl'>
            Be warned: You won't be able to delete the published version ever again.
          </DMParagraph>
        </DMZone>
        <DMCanvasImage dataUrl={dataUrl} />
      </DMZone>
      <DMZoneButtons>
        <DMButton empty icon='heart' isLoading={isLoading} onClick={publishPainting} preventAutoClose>
          Yes, yes!
        </DMButton>
        <DMButton icon='cross' disabled={isLoading}>
          Nah, I changed my mind
        </DMButton>
      </DMZoneButtons>
    </>
  )
}
