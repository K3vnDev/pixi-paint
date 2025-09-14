import { DMButton } from '@dialog-menu/DMButton'
import { DMHeader } from '@dialog-menu/DMHeader'
import { DMParagraph } from '@dialog-menu/DMParagraph'
import { DMZoneButtons } from '@dialog-menu/DMZoneButtons'
import { useCanvasesStore } from '@/store/useCanvasesStore'

interface Props {
  canvasesIds: string[]
  onDelete?: () => void
}

export const DeletePaintingsMenu = ({ canvasesIds, onDelete }: Props) => {
  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)

  const handleClick = () => {
    const idSet = new Set(canvasesIds)
    const newSavedCanvases = [...savedCanvases.filter(c => !idSet.has(c.id))]
    setSavedCanvases(newSavedCanvases)
    onDelete?.()
  }

  const s = canvasesIds.length > 1 ? 's' : ''
  const itThem = canvasesIds.length > 1 ? 'them' : 'it'

  const header = `Delete painting${s}?`
  const paragraph = `Do you really want to delete your painting${s}? You won't see ${itThem} ever again (that's a long time).`

  return (
    <>
      <DMHeader icon='warning'>{header}</DMHeader>
      <DMParagraph className='w-xl'>{paragraph}</DMParagraph>
      <DMZoneButtons>
        <DMButton icon='trash' empty onClick={handleClick}>
          Yes, I don't care
        </DMButton>
        <DMButton icon='cross'>No, wait!</DMButton>
      </DMZoneButtons>
    </>
  )
}
