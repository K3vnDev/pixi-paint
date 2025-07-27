import { useEffect } from 'react'
import { BLANK_DRAFT } from '@/consts'
import { useCanvasStore } from '@/store/useCanvasStore'
import { usePaintStore } from '@/store/usePaintStore'
import { generateId } from '@/utils/generateId'

export const useSaveCanvases = () => {
  const editingPixels = usePaintStore(s => s.pixels)

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

  // Load data from local storage
  useEffect(() => {
    if (!hydrated) hydrate()
  }, [])

  useEffect(() => {
    // Update draft
    if (isDraft && hydrated) {
      setDraft({ ...draft, pixels: editingPixels })
    } else {
      // Update saved
      const index = savedCanvases.findIndex(c => c.id === editingCanvasId)
      if (index === -1) return

      const newCanvases = structuredClone(savedCanvases)
      newCanvases[index] = {
        ...newCanvases[index],
        pixels: editingPixels
      }
      setSavedCanvases(newCanvases)
    }
  }, [editingPixels])

  return { isDraft, createNewSave, createNewDraft, savedCanvases, draft, hydrated }
}
