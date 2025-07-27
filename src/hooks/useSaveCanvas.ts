import { useEffect } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { generateId } from '@/utils/generateId'

export const useSaveCanvas = () => {
  const canvas = usePaintStore(s => s.canvas)
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)

  const savedCanvas = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvas = useCanvasStore(s => s.setSavedCanvases)

  const draft = useCanvasStore(s => s.draft)
  const setDraft = useCanvasStore(s => s.setDraft)

  const isDraft = editingCanvasId === null

  const generateNewCanvasId = (): string => {
    const generatedId = generateId()
    return savedCanvas.some(c => c.id === generatedId) ? generateNewCanvasId() : generatedId
  }

  const newSave = () => {
    const newCanvasId = generateNewCanvasId()

    const savingCanvas = {
      id: newCanvasId,
      pixels: canvas
    }
    setSavedCanvas([...savedCanvas, savingCanvas])
    setEditingCanvasId(newCanvasId)
  }

  const newDraft = () => {
    setEditingCanvasId(null)
  }

  useEffect(() => {
    if (isDraft) {
      setDraft({ ...draft, pixels: canvas })
    }
  }, [canvas])

  return { isDraft, newSave, newDraft }
}
