import { useRef } from 'react'
import { BLANK_DRAFT, COLOR_PALETTE } from '@/consts'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { calcMiddlePixelsIndexes } from '@/utils/calcMiddlePixels'
import { useBucketPixels } from './useBucketPixels'
import { useFreshRefs } from './useFreshRefs'

export const useSaveHandler = () => {
  const setDraftPixels = useCanvasStore(s => s.setDraftCanvasPixels)
  const draft = useCanvasStore(s => s.draftCanvas)
  const unshiftToSavedCanvases = useCanvasStore(s => s.unshiftToSavedCanvases)
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)
  const getNewCanvasId = useCanvasStore(s => s.getNewCanvasId)
  const editingPixels = usePaintStore(s => s.pixels)
  const paintPixels = usePaintStore(s => s.paintPixels)
  const elementRef = useRef<HTMLElement>(null)

  const refs = useFreshRefs({ editingPixels, draft })
  const { paintBucketPixels } = useBucketPixels()

  const isDraft = editingCanvasId === null

  const cloneToNewDraftAction = () => {
    const { editingPixels } = refs.current
    setEditingCanvasId(null)
    setDraftPixels(editingPixels)
  }

  const newBlankDraftAction = () => {
    setEditingCanvasId(null)
    setDraftPixels(BLANK_DRAFT.pixels)

    paintBucketPixels({
      startIndexes: calcMiddlePixelsIndexes(),
      paintGenerationAction: generation => {
        paintPixels(...generation.map(({ index }) => ({ color: COLOR_PALETTE.WHITE, index })))
      }
    })
  }

  const createNewSave = () => {
    const newCanvasId = getNewCanvasId()
    const savingCanvas = { id: newCanvasId, pixels: refs.current.editingPixels }

    unshiftToSavedCanvases(savingCanvas)
    setEditingCanvasId(newCanvasId)
    setDraftPixels(BLANK_DRAFT.pixels)
  }

  const saveDraft = () => {
    const newCanvasId = getNewCanvasId()
    const savingCanvas = { id: newCanvasId, pixels: refs.current.draft.pixels }
    unshiftToSavedCanvases(savingCanvas)
  }

  return {
    cloneToNewDraftAction,
    newBlankDraftAction,
    createNewSave,
    saveDraft,
    refs,
    elementRef,
    isDraft
  }
}
