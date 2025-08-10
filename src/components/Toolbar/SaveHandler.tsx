import { BLANK_DRAFT, SPRITES_RESOLUTION, SPRITES_SIZE } from '@consts'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { PixelatedImage } from '../PixelatedImage'
import { Item } from './Item'

export const SaveHandler = () => {
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)
  const setDraft = useCanvasStore(s => s.setDraftCanvas)

  const editingPixels = usePaintStore(s => s.pixels)
  const isDraft = editingCanvasId === null

  const createNewSave = () => {
    const newCanvasId = getNewCanvasId()

    const savingCanvas = {
      id: newCanvasId,
      pixels: editingPixels
    }
    setSavedCanvases([...savedCanvases, savingCanvas])
    setEditingCanvasId(newCanvasId)
  }

  const createNewDraft = () => {
    setEditingCanvasId(null)
    setDraft({
      ...BLANK_DRAFT,
      pixels: editingPixels
    })
  }

  const handleClick = () => {
    if (isDraft) {
      createNewSave()
    } else {
      createNewDraft()
    }
  }

  const [title, image] = isDraft
    ? ['Draft. Click to save', 'save']
    : ['Saved! Click to start a new draft', 'saved-check']

  return (
    <Item className='button flex items-center justify-center'>
      <button className='px-2' onClick={handleClick} title={title}>
        <PixelatedImage
          resolution={SPRITES_RESOLUTION}
          src={`/imgs/save/${image}.png`}
          imageSize={SPRITES_SIZE}
          alt='Save icon'
        />
      </button>
    </Item>
  )
}
