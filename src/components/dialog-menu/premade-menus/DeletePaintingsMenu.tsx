import { DMButton } from '@dialog-menu/DMButton'
import { DMHeader } from '@dialog-menu/DMHeader'
import { DMParagraph } from '@dialog-menu/DMParagraph'
import { DMZoneButtons } from '@dialog-menu/DMZoneButtons'
import { useCanvasesStore } from '@/store/useCanvasesStore'
import { useRemoteStore } from '@/store/useRemoteStore'
import { DMParagraphsZone } from '../DMParagraphsZone'

interface Props {
  canvasesIds: string[]
  onDelete?: () => void
}

export const DeletePaintingsMenu = ({ canvasesIds, onDelete }: Props) => {
  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)

  const setUserPublishedIds = useRemoteStore(s => s.setUserPublishedIds)

  const handleClick = () => {
    // Delete from saved canvases
    const idSet = new Set(canvasesIds)
    const newSavedCanvases = [...savedCanvases.filter(c => !idSet.has(c.id))]
    setSavedCanvases(newSavedCanvases)

    // Delete from user published canvases id
    setUserPublishedIds(ids => {
      ids &&
        canvasesIds.forEach(id => {
          ids?.delete(id)
        })
      return ids
    })

    onDelete?.()
  }

  const s = canvasesIds.length > 1 ? 's' : ''
  const itThem = canvasesIds.length > 1 ? 'them' : 'it'

  const header = `Delete painting${s}?`
  const paragraph1 = `Do you really want to delete your painting${s}?`
  const paragraph2 = `You won't see ${itThem} ever again (and that's a long time).`

  return (
    <>
      <DMHeader icon='warning'>{header}</DMHeader>
      <DMParagraphsZone className='max-w-xl w-full'>
        <DMParagraph>{paragraph1}</DMParagraph>
        <DMParagraph remark>{paragraph2}</DMParagraph>
      </DMParagraphsZone>
      <DMZoneButtons>
        <DMButton icon='trash' empty onClick={handleClick}>
          Yes, I don't care
        </DMButton>
        <DMButton icon='cross'>No, wait!</DMButton>
      </DMZoneButtons>
    </>
  )
}
