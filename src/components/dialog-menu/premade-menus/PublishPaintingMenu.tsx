import { useState } from 'react'
import { useConfetti } from '@/hooks/useConfetti'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import type { SavedCanvas } from '@/types'
import { dataFetch } from '@/utils/dataFetch'
import { DMButton } from '../DMButton'
import { DMHeader } from '../DMHeader'
import { DMParagraph } from '../DMParagraph'
import { DMParagraphsNCanvasImage } from '../DMParagraphsNCanvasImage'
import { DMParagraphsZone } from '../DMParagraphsZone'
import { DMZoneButtons } from '../DMZoneButtons'

interface Props {
  canvasId: string
  canvasRef: React.RefObject<HTMLLIElement | null>
  dataUrl: string
}

export const PublishPaintingMenu = ({ canvasRef, canvasId, dataUrl }: Props) => {
  const [isLoading, setIsLoading] = useState(false)

  const userPublishedCanvasesIds = useRemoteStore(s => s.userPublishedIds)
  const setUserPublishedCanvasesIds = useRemoteStore(s => s.setUserPublishedIds)

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
          setUserPublishedCanvasesIds(p => p?.add(canvasId))
        }

        // Add published canvas to publishedCanvases
        if (publishedCanvases.length) {
          const publishedCanvas: SavedCanvas = { id: publishedId, pixels }
          setPublishedCanvases([publishedCanvas, ...publishedCanvases])
        }
      },
      onError: (_, code) => {
        const isConflictError = code === 409

        if (isConflictError) {
          setUserPublishedCanvasesIds(ids => ids?.add(canvasId))
        }

        const { header, button, paragraphs } = isConflictError
          ? {
              header: 'Sorry, but your canvas...',
              paragraphs: [
                "It's nothing personal, but a very similar painting has already been published.",
                "Published paintings must be unique, so we can't accept yours right now... unless you tweak it a bit."
              ],
              button: 'Okay, I guess...'
            }
          : {
              header: 'Oops! Something went wrong...',
              paragraphs: [
                'Something unexpected happened on our side while trying to publish your canvas.',
                'Please wait a few minutes and try again.'
              ],
              button: 'Sure, whatever...'
            }

        openMenu(
          <>
            <DMHeader icon='warning'>{header}</DMHeader>
            <DMParagraphsZone className='w-xl'>
              <DMParagraph>{paragraphs[0]}</DMParagraph>
              <DMParagraph remark>{paragraphs[1]}</DMParagraph>
            </DMParagraphsZone>
            <DMZoneButtons>
              <DMButton>{button}</DMButton>
            </DMZoneButtons>
          </>
        )
      }
    })
  }

  return (
    <>
      <DMHeader icon='publish'>Publish your painting?</DMHeader>
      <DMParagraphsNCanvasImage dataUrl={dataUrl}>
        <DMParagraph className='w-full'>Upload your painting to the gallery for others to see!</DMParagraph>
        <DMParagraph className='w-full font-semibold italic text-xl'>
          Be warned: You won't be able to delete the published version ever again.
        </DMParagraph>
      </DMParagraphsNCanvasImage>

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
