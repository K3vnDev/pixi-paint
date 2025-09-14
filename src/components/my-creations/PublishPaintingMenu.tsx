import { useState } from 'react'
import { useDialogMenu } from '@/hooks/useDialogMenu'
import { useEvent } from '@/hooks/useEvent'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import type { SavedCanvas } from '@/types'
import { dataFetch } from '@/utils/dataFetch'
import { DMButton } from '../dialog-menu/DMButton'
import { DMCanvasImage } from '../dialog-menu/DMCanvasImage'
import { DMHeader } from '../dialog-menu/DMHeader'
import { DMParagraph } from '../dialog-menu/DMParagraph'
import { DMZone } from '../dialog-menu/DMZone'
import { DMZoneButtons } from '../dialog-menu/DMZoneButtons'

interface Props {
  canvasId: string
  dataUrl: string
}

export const PublishPaintingMenu = ({ canvasId, dataUrl }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  useEvent('$context-menu-closed', () => setIsLoading(false))
  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const { closeMenu } = useDialogMenu()

  const publishPainting = () => {
    setIsLoading(true)

    const { pixels } = savedCanvases.find(c => c.id === canvasId) as SavedCanvas
    if (!pixels) return closeMenu()

    dataFetch({
      url: '/api/paintings',
      method: 'POST',
      json: pixels,
      onSuccess: () => {
        // TODO: Throw confetti and show golden border
        closeMenu()
      },
      onError: m => {
        console.log('Error :(', m)
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
