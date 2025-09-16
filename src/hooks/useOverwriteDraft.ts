import { useCanvasesStore } from '@/store/useCanvasesStore'
import { generateId } from '@/utils/generateId'
import { isCanvasEmpty } from '@/utils/isCanvasEmpty'
import { pixelsComparison } from '@/utils/pixelsComparison'
import { useFreshRefs } from './useFreshRefs'

export const useOverwriteDraft = (overwritingPixels: string[]) => {
  const draftCanvas = useCanvasesStore(s => s.draftCanvas)
  const setDraftCanvasPixels = useCanvasesStore(s => s.setDraftCanvasPixels)
  const setEditingCanvasId = useCanvasesStore(s => s.setEditingCanvasId)
  const savedCanvases = useCanvasesStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasesStore(s => s.setSavedCanvases)
  const refs = useFreshRefs({ draftCanvas, savedCanvases })

  const overwriteDraft = (alsoResetId = false) => {
    setDraftCanvasPixels(overwritingPixels)
    alsoResetId && setEditingCanvasId(null)
  }

  const saveDraft = () => {
    const newCanvasId = generateId()
    const savingCanvas = { id: newCanvasId, pixels: overwritingPixels }
    setSavedCanvases(s => [savingCanvas, ...s])
  }

  const canOverwriteDraft = (overwritingPixels?: string[]): boolean => {
    const { draftCanvas, savedCanvases } = refs.current

    // Return true if draft is empty or similar to overriding pixels
    if (
      isCanvasEmpty(draftCanvas) ||
      (overwritingPixels && pixelsComparison(overwritingPixels, draftCanvas.pixels))
    ) {
      return true
    }

    // Return if draft is similar to an already saved canvas
    const isAlreadySaved = savedCanvases.some(s => pixelsComparison(s.pixels, draftCanvas.pixels))
    return isAlreadySaved
  }

  return { canOverwriteDraft, overwriteDraft, saveDraft, draftPixels: draftCanvas.pixels }
}
