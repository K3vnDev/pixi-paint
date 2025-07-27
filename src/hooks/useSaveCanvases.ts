import { useEffect } from 'react'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { generateId } from '@/utils/generateId'

export const useSaveCanvases = () => {
  const canvas = usePaintStore(s => s.canvas)
  const editingCanvasId = useCanvasStore(s => s.editingCanvasId)
  const setEditingCanvasId = useCanvasStore(s => s.setEditingCanvasId)

  const savedCanvases = useCanvasStore(s => s.savedCanvases)
  const setSavedCanvases = useCanvasStore(s => s.setSavedCanvases)

  const draft = useCanvasStore(s => s.draft)
  const setDraft = useCanvasStore(s => s.setDraft)

  const hydrate = useCanvasStore(s => s.hydrate)
  const hydrated = useCanvasStore(s => s.hydrated)

  const isDraft = editingCanvasId === null

  const generateNewCanvasId = (): string => {
    const generatedId = generateId()
    return savedCanvases.some(c => c.id === generatedId) ? generateNewCanvasId() : generatedId
  }

  const createNewSave = () => {
    const newCanvasId = generateNewCanvasId()

    const savingCanvas = {
      id: newCanvasId,
      pixels: canvas
    }
    setSavedCanvases([...savedCanvases, savingCanvas])
    setEditingCanvasId(newCanvasId)
  }

  const createNewDraft = () => {
    setEditingCanvasId(null)
  }

  // Load data from local storage
  useEffect(hydrate, [])

  useEffect(() => {
    if (isDraft && hydrated) {
      setDraft({ ...draft, pixels: canvas })
    }
  }, [canvas])

  return { isDraft, createNewSave, createNewDraft, savedCanvases }
}
